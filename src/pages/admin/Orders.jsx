import React, { useState, useEffect } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { Eye, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { collection, query, getDocs, orderBy, updateDoc, doc } from 'firebase/firestore'
import { db } from '../../lib/firebase'

const Orders = () => {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [updatingOrderId, setUpdatingOrderId] = useState(null)
    const [activeTab, setActiveTab] = useState('all')

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
                                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                <Eye size={18} />
                                            </button>
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
        </AdminLayout>
    )
}

export default Orders