import React, { useEffect } from 'react'
import Layout from '../components/layout/Layout'
import { CheckCircle, Package, ArrowRight } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import confetti from 'canvas-confetti'

const OrderConfirmation = () => {
    const { clearCart } = useCart()
    const location = useLocation()
    const { orderId, orderData } = location.state || {}

    useEffect(() => {
        clearCart()
        if (orderId) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            })
        }
    }, [orderId])

    if (!orderId) {
        return (
            <Layout>
                <div className="min-h-[60vh] flex flex-col items-center justify-center">
                    <h1 className="text-2xl font-bold mb-4">No Order Found</h1>
                    <Link to="/shop" className="text-accent hover:underline">Return to Shop</Link>
                </div>
            </Layout>
        )
    }

    return (
        <Layout>
            <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4">
                <div className="max-w-lg w-full bg-white p-8 rounded-2xl shadow-lg text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={40} className="text-green-600" />
                    </div>
                    <h1 className="text-3xl font-heading font-bold text-primary mb-2">Order Confirmed!</h1>
                    <p className="text-gray-500 mb-8">Thank you for your purchase. Your order ID is <span className="font-mono font-bold text-primary">#{orderId}</span></p>

                    <div className="bg-gray-50 p-6 rounded-xl mb-8 text-left">
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                            <Package size={20} /> Order Details
                        </h3>
                        <div className="space-y-2 text-sm text-gray-600 mb-4">
                            <p><span className="font-bold">Amount:</span> ₹{orderData?.total?.toLocaleString()}</p>
                            <p><span className="font-bold">Items:</span> {orderData?.items?.length}</p>
                            <p><span className="font-bold">Date:</span> {new Date().toLocaleDateString()}</p>
                        </div>
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                            <Package size={20} /> What's Next?
                        </h3>
                        <ul className="space-y-3 text-sm text-gray-600">
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-accent rounded-full mt-2"></span>
                                You can check the order status in your orders.
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-accent rounded-full mt-2"></span>
                                You will receive order within 7 days.
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-accent rounded-full mt-2"></span>
                                If you need any inquiry please contact the seller.
                            </li>
                        </ul>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link to="/profile" className="flex-1 border border-gray-300 text-primary font-bold py-3 rounded-xl hover:bg-gray-50 transition-colors">
                            View Order History
                        </Link>
                        <Link to="/shop" className="flex-1 bg-primary text-white font-bold py-3 rounded-xl hover:bg-accent transition-colors flex items-center justify-center gap-2">
                            Continue Shopping <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default OrderConfirmation
