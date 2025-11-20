import React, { useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { Search, Eye, ChevronDown } from 'lucide-react'
import toast from 'react-hot-toast'

const Orders = () => {
    const [orders, setOrders] = useState([
        {
            id: 'VF12345',
            customer: 'John Doe',
            date: '2023-10-25',
            total: 12999,
            status: 'Processing',
            payment: 'Paid'
        },
        {
            id: 'VF12346',
            customer: 'Jane Smith',
            date: '2023-10-24',
            total: 8999,
            status: 'Shipped',
            payment: 'Paid'
        },
        {
            id: 'VF12347',
            customer: 'Alice Johnson',
            date: '2023-10-23',
            total: 4599,
            status: 'Delivered',
            payment: 'Paid'
        }
    ])

    const handleStatusChange = (id, newStatus) => {
        setOrders(orders.map(order => order.id === id ? { ...order, status: newStatus } : order))
        toast.success(`Order ${id} status updated to ${newStatus}`)
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'Processing': return 'bg-yellow-100 text-yellow-700'
            case 'Shipped': return 'bg-blue-100 text-blue-700'
            case 'Delivered': return 'bg-green-100 text-green-700'
            case 'Cancelled': return 'bg-red-100 text-red-700'
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

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-100">
                            <tr>
                                <th className="p-4">Order ID</th>
                                <th className="p-4">Customer</th>
                                <th className="p-4">Date</th>
                                <th className="p-4">Total</th>
                                <th className="p-4">Payment</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50">
                                    <td className="p-4 font-bold text-gray-800">{order.id}</td>
                                    <td className="p-4 text-gray-600">{order.customer}</td>
                                    <td className="p-4 text-gray-600">{order.date}</td>
                                    <td className="p-4 font-medium">₹{order.total.toLocaleString()}</td>
                                    <td className="p-4">
                                        <span className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-bold border border-green-100">
                                            {order.payment}
                                        </span>
                                    </td>
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
                </div>
            </div>
        </AdminLayout>
    )
}

export default Orders
