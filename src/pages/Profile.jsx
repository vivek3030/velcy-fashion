import React, { useState } from 'react'
import Layout from '../components/layout/Layout'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Package, MapPin, LogOut, User as UserIcon } from 'lucide-react'

const Profile = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('orders')

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
                                    {[1, 2].map((order) => (
                                        <div key={order} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                                            <div className="flex flex-col md:flex-row justify-between mb-4">
                                                <div>
                                                    <p className="font-bold text-lg">Order #VF{12345 + order}</p>
                                                    <p className="text-sm text-gray-500">Placed on {new Date().toLocaleDateString()}</p>
                                                </div>
                                                <div className="mt-2 md:mt-0">
                                                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                                                        Delivered
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="w-16 h-20 bg-gray-100 rounded overflow-hidden">
                                                    <img src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1974&auto=format&fit=crop" alt="Product" className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">Kanjivaram Silk Saree</p>
                                                    <p className="text-sm text-gray-500">Qty: 1</p>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                                <p className="font-bold">Total: ₹12,999</p>
                                                <button className="text-accent font-bold hover:underline">View Details</button>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="text-center pt-4">
                                        <button onClick={() => navigate('/shop')} className="text-accent font-bold hover:underline">Continue Shopping</button>
                                    </div>
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
