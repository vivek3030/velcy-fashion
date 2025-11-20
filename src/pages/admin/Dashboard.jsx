import React from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { DollarSign, ShoppingBag, Package, Users } from 'lucide-react'

const Dashboard = () => {
    const stats = [
        { label: 'Total Revenue', value: '₹1,25,000', icon: DollarSign, color: 'bg-green-100 text-green-600' },
        { label: 'Total Orders', value: '156', icon: Package, color: 'bg-blue-100 text-blue-600' },
        { label: 'Products', value: '48', icon: ShoppingBag, color: 'bg-purple-100 text-purple-600' },
        { label: 'Customers', value: '1,203', icon: Users, color: 'bg-orange-100 text-orange-600' },
    ]

    return (
        <AdminLayout>
            <h1 className="text-2xl font-bold text-gray-800 mb-8">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-lg ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                            <span className="text-green-500 text-sm font-bold">+12%</span>
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium">{stat.label}</h3>
                        <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="font-bold text-lg mb-4">Recent Orders</h2>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100">
                                <div>
                                    <p className="font-bold text-sm">Order #VF{12340 + i}</p>
                                    <p className="text-xs text-gray-500">2 mins ago</p>
                                </div>
                                <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-1 rounded-full">Processing</span>
                                <p className="font-bold text-sm">₹4,599</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="font-bold text-lg mb-4">Popular Products</h2>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100">
                                <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                                    <img src={`https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1974&auto=format&fit=crop`} alt="Product" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-sm line-clamp-1">Kanjivaram Silk Saree</p>
                                    <p className="text-xs text-gray-500">24 sales</p>
                                </div>
                                <p className="font-bold text-sm">₹12,999</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}

export default Dashboard
