import React, { useState, useEffect } from 'react'
import Layout from '../components/layout/Layout'
import { motion } from 'framer-motion'
import { Search, User, Phone, MapPin, Clock, CheckCircle, Package, Truck, Star, MessageCircle, Calendar } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { deliveryAssignmentService } from '../lib/deliveryService'
import SEO from '../components/common/SEO'
import toast from 'react-hot-toast'

const TrackOrder = () => {
    const { orderId } = useParams()
    const [searchOrderId, setSearchOrderId] = useState(orderId || '')
    const [orderData, setOrderData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    // Mock delivery status timeline
    const deliveryTimeline = [
        {
            id: 1,
            status: 'confirmed',
            label: 'Order Confirmed',
            description: 'Your order has been confirmed and is being prepared',
            timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
            completed: true,
            icon: CheckCircle
        },
        {
            id: 2,
            status: 'assigned',
            label: 'Delivery Agent Assigned',
            description: 'A delivery agent has been assigned to your order',
            timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
            completed: true,
            icon: User
        },
        {
            id: 3,
            status: 'picked_up',
            label: 'Order Picked Up',
            description: 'Your order has been picked up and is on the way',
            timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
            completed: true,
            icon: Package
        },
        {
            id: 4,
            status: 'in_transit',
            label: 'Out for Delivery',
            description: 'Your order is out for delivery and will arrive soon',
            timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
            completed: true,
            icon: Truck
        },
        {
            id: 5,
            status: 'delivered',
            label: 'Delivered',
            description: 'Your order has been delivered successfully',
            timestamp: null,
            completed: false,
            icon: CheckCircle
        }
    ]

    // Mock delivery agent data
    const mockAgent = {
        id: '1',
        name: 'Raj Kumar',
        phone: '+91 98765 43210',
        email: 'raj.kumar@example.com',
        photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80',
        averageRating: 4.7,
        totalDeliveries: 156,
        vehicleDetails: {
            type: 'bike',
            number: 'DL-01-AB-1234'
        },
        currentLocation: {
            latitude: 28.6139,
            longitude: 77.2090,
            lastUpdated: new Date()
        }
    }

    const handleSearch = async (e) => {
        e.preventDefault()
        if (!searchOrderId.trim()) {
            toast.error('Please enter an order ID')
            return
        }

        setLoading(true)
        setError(null)
        setOrderData(null)

        try {
            // In a real app, this would fetch from Firebase
            // For now, simulate finding an order
            await new Promise(resolve => setTimeout(resolve, 1000))

            // Mock order data
            setOrderData({
                id: searchOrderId,
                orderId: `ORD-${searchOrderId.toUpperCase()}`,
                status: 'in_transit',
                customerName: 'John Doe',
                customerPhone: '+91 98765 43210',
                customerEmail: 'john.doe@example.com',
                items: [
                    {
                        name: 'Elegant Silk Saree',
                        quantity: 1,
                        price: 5999,
                        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=200&auto=format&fit=crop'
                    }
                ],
                total: 5999,
                address: {
                    name: 'John Doe',
                    address: '123 Fashion Street, MG Road',
                    city: 'Bangalore',
                    state: 'Karnataka',
                    pincode: '560001',
                    mobile: '+91 98765 43210'
                },
                createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
                estimatedDelivery: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
                agent: mockAgent,
                paymentMethod: 'Razorpay',
                paymentId: 'pay_' + Math.random().toString(36).substr(2, 9)
            })
        } catch (error) {
            console.error('Error tracking order:', error)
            setError('Order not found. Please check your order ID and try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleRatingSubmit = (rating) => {
        toast.success('Thank you for your feedback!')
        // In a real app, this would submit to Firebase
    }

    const formatTime = (date) => {
        if (!date) return 'Pending'
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }

    const formatDate = (date) => {
        if (!date) return 'Pending'
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }

    return (
        <Layout>
            <SEO
                title="Track Order - Velcy Fashion"
                description="Track your Velcy Fashion order and get real-time delivery updates"
            />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Search Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">Track Your Order</h1>
                    <p className="text-gray-600 mb-8">Enter your order ID to get real-time delivery updates</p>

                    <form onSubmit={handleSearch} className="max-w-md mx-auto">
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={searchOrderId}
                                onChange={(e) => setSearchOrderId(e.target.value)}
                                placeholder="Enter Order ID (e.g., ABC123)"
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                                required
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-accent text-white px-6 py-3 rounded-lg hover:bg-white hover:text-accent transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <Search size={20} />
                                )}
                                Track
                            </button>
                        </div>
                    </form>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8 text-center"
                    >
                        <div className="text-red-600 mb-2">
                            <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-red-800 mb-1">Order Not Found</h3>
                        <p className="text-red-600">{error}</p>
                    </motion.div>
                )}

                {orderData && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        {/* Order Overview */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">Order {orderData.orderId}</h2>
                                    <p className="text-gray-600">Placed on {formatDate(orderData.createdAt)}</p>
                                </div>
                                <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                                    orderData.status === 'delivered'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-blue-100 text-blue-700'
                                }`}>
                                    {orderData.status === 'in_transit' ? 'Out for Delivery' :
                                     orderData.status.charAt(0).toUpperCase() + orderData.status.slice(1)}
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-3">Delivery Address</h3>
                                    <div className="space-y-2 text-sm text-gray-600">
                                        <p className="font-medium text-gray-800">{orderData.address.name}</p>
                                        <p>{orderData.address.address}</p>
                                        <p>{orderData.address.city}, {orderData.address.state} - {orderData.address.pincode}</p>
                                        <p>📱 {orderData.address.mobile}</p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-3">Order Summary</h3>
                                    <div className="space-y-2">
                                        {orderData.items.map((item, index) => (
                                            <div key={index} className="flex items-center gap-3">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-12 h-12 object-cover rounded"
                                                />
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium">{item.name}</p>
                                                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                                </div>
                                                <p className="text-sm font-medium">₹{item.price.toLocaleString()}</p>
                                            </div>
                                        ))}
                                        <div className="border-t pt-2 mt-2">
                                            <div className="flex justify-between font-semibold">
                                                <span>Total</span>
                                                <span>₹{orderData.total.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Delivery Timeline */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-6">Delivery Timeline</h3>

                            <div className="relative">
                                {/* Timeline Line */}
                                <div className="absolute left-6 top-8 bottom-0 w-0.5 bg-gray-200"></div>

                                <div className="space-y-8">
                                    {deliveryTimeline.map((step, index) => {
                                        const IconComponent = step.icon
                                        const isActive = step.completed
                                        const isUpcoming = !step.completed

                                        return (
                                            <div key={step.id} className="relative flex items-start gap-4">
                                                {/* Status Icon */}
                                                <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center ${
                                                    isActive ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                                                }`}>
                                                    <IconComponent size={20} />
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 pb-8">
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <h4 className={`font-semibold text-lg ${
                                                                isActive ? 'text-gray-800' : 'text-gray-400'
                                                            }`}>
                                                                {step.label}
                                                            </h4>
                                                            <p className={`text-sm ${
                                                                isActive ? 'text-gray-600' : 'text-gray-400'
                                                            }`}>
                                                                {step.description}
                                                            </p>
                                                        </div>
                                                        {step.timestamp && (
                                                            <div className="text-right">
                                                                <p className="text-sm font-medium text-gray-800">
                                                                    {formatTime(step.timestamp)}
                                                                </p>
                                                                <p className="text-xs text-gray-500">
                                                                    {formatDate(step.timestamp)}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Delivery Agent Info */}
                        {orderData.agent && (
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-6">Delivery Agent</h3>

                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Agent Photo and Basic Info */}
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={orderData.agent.photo}
                                            alt={orderData.agent.name}
                                            className="w-20 h-20 rounded-full object-cover"
                                        />
                                        <div>
                                            <h4 className="text-lg font-semibold text-gray-800">{orderData.agent.name}</h4>
                                            <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                                <div className="flex items-center gap-1">
                                                    <Star size={14} className="fill-yellow-400 text-yellow-400" />
                                                    <span>{orderData.agent.averageRating}</span>
                                                </div>
                                                <span>•</span>
                                                <span>{orderData.agent.totalDeliveries} deliveries</span>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1 capitalize">
                                                🏍️ {orderData.agent.vehicleDetails.type} ({orderData.agent.vehicleDetails.number})
                                            </p>
                                        </div>
                                    </div>

                                    {/* Contact Actions */}
                                    <div className="flex gap-3 ml-auto">
                                        <a
                                            href={`tel:${orderData.agent.phone}`}
                                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                        >
                                            <Phone size={18} />
                                            Call
                                        </a>
                                        <a
                                            href={`mailto:${orderData.agent.email}`}
                                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            <MessageCircle size={18} />
                                            Message
                                        </a>
                                    </div>
                                </div>

                                {/* Estimated Delivery */}
                                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                    <div className="flex items-center gap-2 text-blue-800">
                                        <Clock size={18} />
                                        <span className="font-medium">Estimated Delivery</span>
                                    </div>
                                    <p className="text-blue-700 mt-1">
                                        {formatDate(orderData.estimatedDelivery)} by {formatTime(orderData.estimatedDelivery)}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Feedback Section */}
                        {orderData.status === 'delivered' && (
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-6">Rate Your Delivery Experience</h3>
                                <div className="text-center">
                                    <p className="text-gray-600 mb-4">How was your delivery experience?</p>
                                    <div className="flex justify-center gap-2 mb-4">
                                        {[1, 2, 3, 4, 5].map((rating) => (
                                            <button
                                                key={rating}
                                                onClick={() => handleRatingSubmit(rating)}
                                                className="p-2 text-3xl hover:scale-110 transition-transform"
                                            >
                                                <Star
                                                    size={32}
                                                    className="text-gray-300 hover:text-yellow-400 cursor-pointer"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                    <textarea
                                        placeholder="Share your experience (optional)"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
                                        rows={3}
                                    />
                                    <button className="mt-3 bg-accent text-white px-6 py-2 rounded-lg hover:bg-white hover:text-accent transition-colors">
                                        Submit Feedback
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </div>
        </Layout>
    )
}

export default TrackOrder