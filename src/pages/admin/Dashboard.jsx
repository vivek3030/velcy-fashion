import React, { useState, useEffect } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { DollarSign, ShoppingBag, Package, Users, Loader2 } from 'lucide-react'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import toast from 'react-hot-toast'

const Dashboard = () => {
    const [stats, setStats] = useState([
        { label: 'Total Revenue', value: '₹0', icon: DollarSign, color: 'bg-green-100 text-green-600' },
        { label: 'Total Orders', value: '0', icon: Package, color: 'bg-blue-100 text-blue-600' },
        { label: 'Products', value: '0', icon: ShoppingBag, color: 'bg-purple-100 text-purple-600' },
        { label: 'Customers', value: '0', icon: Users, color: 'bg-orange-100 text-orange-600' },
    ])
    const [recentOrders, setRecentOrders] = useState([])
    const [popularProducts, setPopularProducts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // 1. Fetch Orders for Revenue and Count
                const ordersRef = collection(db, 'orders')
                const ordersSnapshot = await getDocs(ordersRef)
                const orders = ordersSnapshot.docs.map(doc => doc.data())

                const totalRevenue = orders.reduce((sum, order) => sum + (Number(order.total) || 0), 0)
                const totalOrders = orders.length

                // 2. Fetch Products Count
                const productsRef = collection(db, 'products')
                const productsSnapshot = await getDocs(productsRef)
                const totalProducts = productsSnapshot.size
                const products = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

                // 3. Fetch Customers Count
                const usersRef = collection(db, 'users')
                const usersSnapshot = await getDocs(usersRef)
                const totalCustomers = usersSnapshot.size

                // Update Stats
                setStats([
                    { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'bg-green-100 text-green-600' },
                    { label: 'Total Orders', value: totalOrders.toString(), icon: Package, color: 'bg-blue-100 text-blue-600' },
                    { label: 'Products', value: totalProducts.toString(), icon: ShoppingBag, color: 'bg-purple-100 text-purple-600' },
                    { label: 'Customers', value: totalCustomers.toString(), icon: Users, color: 'bg-orange-100 text-orange-600' },
                ])

                // 4. Fetch Recent Orders (Limit 5)
                const recentOrdersQuery = query(ordersRef, orderBy('createdAt', 'desc'), limit(5))
                const recentOrdersSnapshot = await getDocs(recentOrdersQuery)
                setRecentOrders(recentOrdersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))

                // 5. Set Popular Products (Just taking first 3 for now as placeholder)
                setPopularProducts(products.slice(0, 3))

            } catch (error) {
                console.error('Error fetching dashboard data:', error)
                toast.error('Failed to load dashboard data')
            } finally {
                setLoading(false)
            }
        }

        fetchDashboardData()
    }, [])

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-[60vh]">
                    <Loader2 className="w-12 h-12 text-accent animate-spin" />
                </div>
            </AdminLayout>
        )
    }

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
                            {/* <span className="text-green-500 text-sm font-bold">+12%</span> */}
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium">{stat.label}</h3>
                        <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Orders */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="font-bold text-lg mb-4">Recent Orders</h2>
                    <div className="space-y-4">
                        {recentOrders.length > 0 ? (
                            recentOrders.map((order) => (
                                <div key={order.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100">
                                    <div>
                                        <p className="font-bold text-sm">Order #{order.orderId || order.id.slice(0, 8)}</p>
                                        <p className="text-xs text-gray-500">
                                            {order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}
                                        </p>
                                    </div>
                                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                            order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Pending'}
                                    </span>
                                    <p className="font-bold text-sm">₹{order.total?.toLocaleString()}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center py-4">No orders yet</p>
                        )}
                    </div>
                </div>

                {/* Popular Products */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="font-bold text-lg mb-4">Popular Products</h2>
                    <div className="space-y-4">
                        {popularProducts.length > 0 ? (
                            popularProducts.map((product) => (
                                <div key={product.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100">
                                    <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-sm line-clamp-1">{product.name}</p>
                                        <p className="text-xs text-gray-500">{product.category}</p>
                                    </div>
                                    <p className="font-bold text-sm">₹{product.price?.toLocaleString()}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center py-4">No products found</p>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}

export default Dashboard
