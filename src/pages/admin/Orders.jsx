import React, { useState, useEffect } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { Eye, Loader2, User, Truck, Clock, CheckCircle, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { collection, query, getDocs, orderBy, updateDoc, doc } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { deliveryAgentService, deliveryAssignmentService, suggestBestAgents } from '../../lib/deliveryService'

const Orders = () => {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [updatingOrderId, setUpdatingOrderId] = useState(null)
    const [activeTab, setActiveTab] = useState('all')
    const [showAssignModal, setShowAssignModal] = useState(false)
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [availableAgents, setAvailableAgents] = useState([])
    const [suggestedAgents, setSuggestedAgents] = useState([])
    const [loadingAgents, setLoadingAgents] = useState(false)

    const statusTabs = [
        { id: 'all', label: 'All Orders', status: null },
        { id: 'confirmed', label: 'Confirmed', status: 'confirmed' },
        { id: 'processing', label: 'Processing', status: 'Processing' },
        { id: 'shipped', label: 'Shipped', status: 'Shipped' },
        { id: 'delivered', label: 'Delivered', status: 'Delivered' },
        { id: 'cancelled', label: 'Cancelled', status: 'Cancelled' }
    ]

    const filteredOrders = activeTab === 'all'
        ? orders
        : orders.filter(order => order.status === statusTabs.find(tab => tab.id === activeTab)?.status)

    useEffect(() => {
        fetchOrders()
    }, [])

    const fetchOrders = async () => {
        try {
            const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'))
            const querySnapshot = await getDocs(q)
            const loadedOrders = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            setOrders(loadedOrders)
        } catch (error) {
            console.error("Error fetching orders:", error)
            toast.error("Failed to load orders")
        } finally {
            setLoading(false)
        }
    }

    const handleStatusChange = async (id, newStatus) => {
        setUpdatingOrderId(id)
        try {
            const orderRef = doc(db, 'orders', id)
            await updateDoc(orderRef, { status: newStatus })

            setOrders(orders.map(order => order.id === id ? { ...order, status: newStatus } : order))
            toast.success(`Order status updated to ${newStatus}`)
        } catch (error) {
            console.error("Error updating status:", error)
            toast.error("Failed to update status")
        } finally {
            setUpdatingOrderId(null)
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'Processing': return 'bg-yellow-100 text-yellow-700'
            case 'Shipped': return 'bg-blue-100 text-blue-700'
            case 'Delivered': return 'bg-green-100 text-green-700'
            case 'Cancelled': return 'bg-red-100 text-red-700'
            case 'confirmed': return 'bg-purple-100 text-purple-700'
            default: return 'bg-gray-100 text-gray-700'
        }
    }

    // Delivery Assignment Functions
    const handleOpenAssignModal = async (order) => {
        try {
            setSelectedOrder(order)
            setShowAssignModal(true)
            setLoadingAgents(true)

            // Load available agents and suggestions
            const [agents, suggestions] = await Promise.all([
                deliveryAgentService.getActiveAgents(),
                suggestBestAgents()
            ])

            setAvailableAgents(agents)
            setSuggestedAgents(suggestions)
        } catch (error) {
            console.error('Error loading agents:', error)
            toast.error('Failed to load delivery agents')
            // Load mock data for development
            const mockAgents = [
                {
                    id: '1',
                    name: 'Raj Kumar',
                    phone: '+91 98765 43210',
                    averageRating: 4.7,
                    totalDeliveries: 156,
                    vehicleDetails: { type: 'bike', number: 'DL-01-AB-1234' },
                    suggestionScore: 0.95
                },
                {
                    id: '2',
                    name: 'Priya Singh',
                    phone: '+91 98765 43211',
                    averageRating: 4.9,
                    totalDeliveries: 89,
                    vehicleDetails: { type: 'van', number: 'DL-02-CD-5678' },
                    suggestionScore: 0.88
                }
            ]
            setAvailableAgents(mockAgents)
            setSuggestedAgents(mockAgents.slice(0, 2))
        } finally {
            setLoadingAgents(false)
        }
    }

    const handleAssignOrder = async (agentId) => {
        if (!selectedOrder) return

        try {
            setUpdatingOrderId(selectedOrder.id)

            // Create delivery assignment
            await deliveryAssignmentService.createAssignment({
                orderId: selectedOrder.id,
                agentId: agentId,
                estimatedDeliveryTime: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
            })

            // Update order status to Processing
            await updateDoc(doc(db, 'orders', selectedOrder.id), {
                status: 'Processing'
            })

            setOrders(orders.map(order =>
                order.id === selectedOrder.id
                    ? { ...order, status: 'Processing', assignedAgent: agentId }
                    : order
            ))

            toast.success('Order assigned successfully!')
            setShowAssignModal(false)
            setSelectedOrder(null)
        } catch (error) {
            console.error('Error assigning order:', error)
            toast.error('Failed to assign order')
        } finally {
            setUpdatingOrderId(null)
        }
    }

    const getDeliveryStatus = (orderId) => {
        // This would normally fetch from delivery assignments
        // For now, return mock data
        const mockStatuses = {
            'assigned': { label: 'Assigned', color: 'bg-purple-100 text-purple-700', icon: User },
            'picked_up': { label: 'Picked Up', color: 'bg-blue-100 text-blue-700', icon: Truck },
            'in_transit': { label: 'In Transit', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
            'delivered': { label: 'Delivered', color: 'bg-green-100 text-green-700', icon: CheckCircle },
            'failed': { label: 'Failed', color: 'bg-red-100 text-red-700', icon: XCircle }
        }

        const statusKey = ['assigned', 'picked_up', 'in_transit', 'delivered'][Math.floor(Math.random() * 4)]
        return mockStatuses[statusKey] || mockStatuses.assigned
    }

    return (
        <AdminLayout>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Status Tabs */}
                <div className="border-b border-gray-200">
                    <div className="flex overflow-x-auto">
                        {statusTabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-6 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.id
                                        ? 'border-accent text-accent bg-accent/5'
                                        : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                                    }`}
                            >
                                {tab.label}
                                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id ? 'bg-accent text-white' : 'bg-gray-200 text-gray-600'
                                    }`}>
                                    {tab.status === null ? orders.length : orders.filter(o => o.status === tab.status).length}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="p-12 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-100">
                                <tr>
                                    <th className="p-4">Order ID</th>
                                    <th className="p-4">Customer</th>
                                    <th className="p-4">Items</th>
                                    <th className="p-4">Date</th>
                                    <th className="p-4">Total</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Delivery</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50">
                                        <td className="p-4 font-bold text-gray-800">
                                            #{order.orderId ? order.orderId.substring(6) : order.id.substring(0, 6)}
                                        </td>
                                        <td className="p-4 text-gray-600">
                                            <div className="font-medium">{order.address?.name || 'Unknown'}</div>
                                            <div className="text-sm">{order.address?.address}</div>
                                            <div className="text-sm">{order.address?.city}, {order.address?.state} - {order.address?.pincode}</div>
                                            <div className="text-xs text-gray-400 mt-1">Ph: {order.address?.mobile}</div>
                                        </td>
                                        <td className="p-4 text-gray-600">
                                            <div className="text-sm">
                                                {order.items?.map((item, idx) => (
                                                    <div key={idx} className="mb-1">
                                                        {item.quantity}x {item.name} ({item.selectedSize})
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-600">
                                            {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : new Date().toLocaleDateString()}
                                        </td>
                                        <td className="p-4 font-medium">₹{order.total?.toLocaleString()}</td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                    disabled={updatingOrderId === order.id}
                                                    className={`px-3 py-1 rounded-full text-xs font-bold border-none cursor-pointer focus:ring-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed ${getStatusColor(order.status)}`}
                                                >
                                                    {['Processing', 'Shipped', 'Delivered', 'Cancelled', 'confirmed'].map((status) => (
                                                        <option key={status} value={status} className="bg-white text-gray-700">
                                                            {status.charAt(0).toUpperCase() + status.slice(1)}
                                                        </option>
                                                    ))}
                                                </select>
                                                {updatingOrderId === order.id && (
                                                    <Loader2 className="w-4 h-4 text-accent animate-spin" />
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            {order.status === 'confirmed' ? (
                                                <button
                                                    onClick={() => handleOpenAssignModal(order)}
                                                    disabled={updatingOrderId === order.id}
                                                    className="flex items-center gap-1 px-3 py-1 bg-accent text-white text-xs font-medium rounded-full hover:bg-white hover:text-accent transition-colors disabled:opacity-50"
                                                >
                                                    <User size={14} />
                                                    Assign
                                                </button>
                                            ) : order.status === 'Processing' || order.status === 'Shipped' ? (
                                                <div className="flex items-center gap-1">
                                                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getDeliveryStatus(order.id).color}`}>
                                                        <div className="flex items-center gap-1">
                                                            {React.createElement(getDeliveryStatus(order.id).icon, { size: 12 })}
                                                            {getDeliveryStatus(order.id).label}
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 text-xs">-</span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-2">
                                                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                    <Eye size={18} />
                                                </button>
                                                {order.status === 'confirmed' && (
                                                    <button
                                                        onClick={() => handleOpenAssignModal(order)}
                                                        className="p-2 text-accent hover:bg-accent/10 rounded-lg transition-colors"
                                                        title="Assign Delivery Agent"
                                                    >
                                                        <User size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredOrders.length === 0 && (
                            <div className="p-12 text-center text-gray-500">
                                {activeTab === 'all' ? 'No orders found.' : `No ${statusTabs.find(t => t.id === activeTab)?.label.toLowerCase()}.`}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Assignment Modal */}
            {showAssignModal && selectedOrder && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">Assign Delivery Agent</h2>
                                <p className="text-gray-600 mt-1">
                                    Order #{selectedOrder.orderId ? selectedOrder.orderId.substring(6) : selectedOrder.id.substring(0, 6)}
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    setShowAssignModal(false)
                                    setSelectedOrder(null)
                                }}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ×
                            </button>
                        </div>

                        {loadingAgents ? (
                            <div className="p-12 text-center">
                                <Loader2 className="w-8 h-8 text-accent animate-spin mx-auto mb-4" />
                                <p className="text-gray-600">Loading available agents...</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Suggested Agents */}
                                {suggestedAgents.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                            <span className="text-green-500">⭐</span>
                                            Recommended Agents
                                        </h3>
                                        <div className="space-y-3">
                                            {suggestedAgents.slice(0, 3).map((agent) => (
                                                <div key={agent.id} className="border border-green-200 bg-green-50 rounded-lg p-4">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                                                <User size={18} className="text-green-600" />
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-gray-800">{agent.name}</p>
                                                                <p className="text-sm text-gray-600">{agent.phone}</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="flex items-center gap-1 text-sm text-gray-600">
                                                                <span>⭐</span>
                                                                <span className="font-medium">{agent.averageRating}</span>
                                                            </div>
                                                            <p className="text-xs text-gray-500">{agent.totalDeliveries} deliveries</p>
                                                            <p className="text-xs text-green-600 font-medium mt-1">
                                                                Match: {Math.round((agent.suggestionScore || 0.8) * 100)}%
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => handleAssignOrder(agent.id)}
                                                        disabled={updatingOrderId === selectedOrder.id}
                                                        className="mt-3 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                                                    >
                                                        {updatingOrderId === selectedOrder.id ? (
                                                            <Loader2 size={16} className="animate-spin mx-auto" />
                                                        ) : (
                                                            'Assign to this Agent'
                                                        )}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* All Available Agents */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">All Available Agents</h3>
                                    <div className="space-y-3">
                                        {availableAgents.map((agent) => (
                                            <div key={agent.id} className="border border-gray-200 rounded-lg p-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                                            <User size={18} className="text-gray-600" />
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-800">{agent.name}</p>
                                                            <p className="text-sm text-gray-600">{agent.phone}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="flex items-center gap-1 text-sm text-gray-600">
                                                            <span>⭐</span>
                                                            <span className="font-medium">{agent.averageRating}</span>
                                                        </div>
                                                        <p className="text-xs text-gray-500">{agent.totalDeliveries} deliveries</p>
                                                        <p className="text-xs text-gray-500 mt-1 capitalize">
                                                            {agent.vehicleDetails?.type}
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleAssignOrder(agent.id)}
                                                    disabled={updatingOrderId === selectedOrder.id}
                                                    className="mt-3 w-full bg-accent text-white py-2 rounded-lg hover:bg-white hover:text-accent transition-colors disabled:opacity-50"
                                                >
                                                    {updatingOrderId === selectedOrder.id ? (
                                                        <Loader2 size={16} className="animate-spin mx-auto" />
                                                    ) : (
                                                        'Assign to this Agent'
                                                    )}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {availableAgents.length === 0 && (
                                    <div className="text-center py-8 text-gray-500">
                                        <User size={48} className="mx-auto mb-4 text-gray-300" />
                                        <p>No available agents found</p>
                                        <p className="text-sm mt-2">Please add delivery agents or check their availability</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </AdminLayout>
    )
}

export default Orders