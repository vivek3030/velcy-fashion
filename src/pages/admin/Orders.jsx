import React, { useState, useEffect } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { Search, Eye, ChevronDown } from 'lucide-react'
import toast from 'react-hot-toast'
import { collection, query, getDocs, orderBy, updateDoc, doc } from 'firebase/firestore'
import { db } from '../../lib/firebase'

const Orders = () => {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)

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
        try {
            const orderRef = doc(db, 'orders', id)
            await updateDoc(orderRef, { status: newStatus })

            setOrders(orders.map(order => order.id === id ? { ...order, status: newStatus } : order))
            toast.success(`Order status updated to ${newStatus}`)
        } catch (error) {
            console.error("Error updating status:", error)
            toast.error("Failed to update status")
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'Processing': return 'bg-yellow-100 text-yellow-700'
            case 'Shipped': return 'bg-blue-100 text-blue-700'
            case 'Delivered': return 'bg-green-100 text-green-700'
            case 'Cancelled': return 'bg-red-100 text-red-700'
            case 'confirmed': return 'bg-purple-100 text-purple-700' // Status from Checkout.jsx
            default: return 'bg-gray-100 text-gray-700'
        }
    }

    return (
        <AdminLayout>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search orders..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-accent"
                        />
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
                                    <th className="p-4">Date</th>
                                    <th className="p-4">Total</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50">
                                        <td className="p-4 font-bold text-gray-800">
                                            #{order.orderId ? order.orderId.substring(6) : order.id.substring(0, 6)}
                                        </td>
                                        <td className="p-4 text-gray-600">
                                            {order.address?.name || 'Unknown'}
                                            <div className="text-xs text-gray-400">{order.address?.mobile}</div>
                                        </td>
                                        <td className="p-4 text-gray-600">
                                            {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : new Date().toLocaleDateString()}
                                        </td>
                                        <td className="p-4 font-medium">₹{order.total?.toLocaleString()}</td>
                                        <td className="p-4">
                                            <div className="relative group">
                                                <button className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${getStatusColor(order.status)}`}>
                                                    {order.status} <ChevronDown size={12} />
                                                </button>
                                                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-100 rounded-lg shadow-lg py-1 hidden group-hover:block z-10 min-w-[120px]">
                                                    {['Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
                                                        <button
                                                            key={status}
                                                            onClick={() => handleStatusChange(order.id, status)}
                                                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-gray-700"
                                                        >
                                                            {status}
                                                        </button>
                                                    ))}
                                                </div>
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
                        {orders.length === 0 && (
                            <div className="p-12 text-center text-gray-500">No orders found.</div>
                        )}
                    </div>
                )}
            </div>
        </AdminLayout>
    )
}

export default Orders