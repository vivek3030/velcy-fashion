import React, { useState, useEffect } from 'react'
import Layout from '../components/layout/Layout'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Package, MapPin, LogOut, User as UserIcon } from 'lucide-react'
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'
import { db } from '../lib/firebase'

const Profile = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('orders')
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (user) {
            loadOrders()
        }
    }, [user])

    const loadOrders = async () => {
        try {
            const ordersQuery = query(
                collection(db, 'orders'),
                where('userId', '==', user.uid),
                orderBy('createdAt', 'desc')
            )
            const querySnapshot = await getDocs(ordersQuery)
            const loadedOrders = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            setOrders(loadedOrders)
        } catch (error) {
            console.error('Error loading orders:', error)
        } finally {
            setLoading(false)
        }
    }

    if (!user) {
        navigate('/login')
        return null
    }

    const handleLogout = async () => {
        await logout()
        navigate('/')
    }

    return (
        <Layout>
            <div className="bg-gray-50 py-12 min-h-[70vh]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                                    <UserIcon size={32} />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-primary">{user.displayName || 'Valued Customer'}</h1>
                                    <p className="text-gray-500">{user.phoneNumber}</p>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 text-red-500 hover:text-red-600 font-medium"
                            >
                                <LogOut size={20} /> Logout
                            </button>
                        </div>

                        <div className="flex border-b border-gray-100">
                            <button
                                onClick={() => setActiveTab('orders')}
                                className={`flex-1 py-4 text-center font-medium border-b-2 transition-colors ${activeTab === 'orders' ? 'border-accent text-accent' : 'border-transparent text-gray-500 hover:text-primary'}`}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <Package size={20} /> My Orders
                                </div>
                            </button>
                            <button
                                onClick={() => setActiveTab('addresses')}
                                className={`flex-1 py-4 text-center font-medium border-b-2 transition-colors ${activeTab === 'addresses' ? 'border-accent text-accent' : 'border-transparent text-gray-500 hover:text-primary'}`}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <MapPin size={20} /> Addresses
                                </div>
                            </button>
                        </div>

                        <div className="p-8">
                            {activeTab === 'orders' ? (
                                <div className="space-y-6">
                                    {loading ? (
                                        <div className="text-center py-12">
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
                                            <p className="text-gray-500 mt-4">Loading orders...</p>
                                        </div>
                                    ) : orders.length > 0 ? (
                                        orders.map((order) => (
                                            <div key={order.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                                                <div className="flex flex-col md:flex-row justify-between mb-4">
                                                    <div>
                                                        <p className="font-bold text-lg">Order #{order.orderId || order.id.substring(0, 8).toUpperCase()}</p>
                                                        <p className="text-sm text-gray-500">{order.createdAt?.toDate?.().toLocaleDateString() || 'Recent'}</p>
                                                    </div>
                                                    <div className="mt-2 md:mt-0">
                                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                                                            {order.status || 'Confirmed'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="space-y-3">
                                                    {order.items?.slice(0, 2).map((item, idx) => (
                                                        <div key={idx} className="flex items-center gap-4">
                                                            <div className="w-16 h-20 bg-gray-100 rounded overflow-hidden">
                                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                            </div>
                                                            <div>
                                                                <p className="font-medium">{item.name}</p>
                                                                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-4">
                                                    <p className="font-bold">Total: ₹{order.total?.toLocaleString()}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-16">
                                            <Package size={64} className="mx-auto mb-4 text-gray-300" />
                                            <p className="text-xl font-medium text-gray-600 mb-2">No orders yet</p>
                                            <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
                                            <button
                                                onClick={() => navigate('/shop')}
                                                className="bg-accent text-white px-8 py-3 rounded-lg font-bold hover:bg-primary transition-colors"
                                            >
                                                Start Shopping
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-gray-500">
                                    <MapPin size={48} className="mx-auto mb-4 opacity-20" />
                                    <p className="text-lg">No saved addresses</p>
                                    <button className="mt-4 bg-primary text-white px-6 py-2 rounded-lg hover:bg-accent transition-colors">Add New Address</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Profile
