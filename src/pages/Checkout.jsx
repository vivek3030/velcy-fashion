import React, { useState, useEffect } from 'react'
import Layout from '../components/layout/Layout'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useAddress } from '../context/AddressContext'
import { useNavigate } from 'react-router-dom'
import AddressManager from '../components/addresses/AddressManager'
import { MapPin, CheckCircle, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import notificationService from '../lib/notificationService'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'

const Checkout = () => {
    const { cart, cartTotal } = useCart()
    const { user, loading } = useAuth()
    const { addresses, defaultAddressId, getDefaultAddress } = useAddress()
    const navigate = useNavigate()
    const [selectedAddressId, setSelectedAddressId] = useState(null)
    const [processingPayment, setProcessingPayment] = useState(false)

    useEffect(() => {
        if (!loading) {
            if (cart.length === 0) {
                navigate('/shop')
            } else if (!user) {
                navigate('/login')
            } else {
                // Auto-select default address if available
                const defaultAddr = getDefaultAddress()
                if (defaultAddr && !selectedAddressId) {
                    setSelectedAddressId(defaultAddr.id)
                }
            }
        }
    }, [cart, user, loading, navigate, selectedAddressId, getDefaultAddress])

    if (loading || cart.length === 0 || !user) {
        return null // Or a loading spinner
    }

    const handlePayment = async () => {
        const selectedAddr = addresses.find(addr => addr.id === selectedAddressId) || getDefaultAddress()
        if (!selectedAddr) {
            toast.error('Please select or add an address')
            return
        }

        // Validate Razorpay configuration
        const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID
        if (!razorpayKey) {
            toast.error('Payment configuration error. Please contact support.')
            console.error('Missing VITE_RAZORPAY_KEY_ID in environment variables')
            return
        }

        const loadScript = (src) => {
            return new Promise((resolve) => {
                const script = document.createElement('script')
                script.src = src
                script.onload = () => resolve(true)
                script.onerror = () => resolve(false)
                document.body.appendChild(script)
            })
        }

        const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')

        if (!res) {
            toast.error('Razorpay SDK failed to load. Are you online?')
            return
        }

        const options = {
            key: razorpayKey,
            amount: cartTotal * 100,
            currency: "INR",
            name: "VelcyFashion",
            description: "Transaction",
            image: "https://velcyfashion.com/logo.png",
            handler: async function (response) {
                setProcessingPayment(true)
                try {
                    // Helper to replace undefined with null for Firestore compatibility
                    const sanitizeData = (data) => {
                        return JSON.parse(JSON.stringify(data, (key, value) => {
                            return value === undefined ? null : value;
                        }));
                    };

                    if (!selectedAddr) {
                        throw new Error("Delivery address is missing. Please select an address.");
                    }

                    // Create order in Firestore
                    const rawOrderData = {
                        userId: user.uid,
                        items: cart,
                        total: cartTotal,
                        address: {
                            name: selectedAddr.name,
                            phone: selectedAddr.phone,
                            address: selectedAddr.address,
                            city: selectedAddr.city,
                            state: selectedAddr.state,
                            pincode: selectedAddr.pincode,
                            landmark: selectedAddr.landmark,
                            area: selectedAddr.area
                        },
                        customerName: selectedAddr.name,
                        customerPhone: selectedAddr.phone,
                        customerEmail: user.email,
                        paymentId: response.razorpay_payment_id,
                        orderId: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
                        signature: response.razorpay_signature || '',
                        status: 'confirmed',
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }

                    const orderData = sanitizeData(rawOrderData);

                    // Create order in Firebase
                    const orderRef = await addDoc(collection(db, 'orders'), orderData)

                    // Send payment success notification
                    await notificationService.notifyPaymentSuccess({
                        ...orderData,
                        id: orderRef.id
                    })

                    // Send order confirmation notification
                    await notificationService.notifyOrderConfirmation({
                        ...orderData,
                        id: orderRef.id
                    })

                    toast.success('Payment Successful!')
                    navigate('/order-confirmation', {
                        state: {
                            paymentId: response.razorpay_payment_id,
                            orderId: orderData.orderId,
                            orderData
                        }
                    })
                } catch (error) {
                    console.error('Order creation error:', error)
                    toast.error(`Order creation failed: ${error.message}`)
                    setProcessingPayment(false)
                }
            },
            prefill: {
                name: user?.displayName || 'Customer',
                email: user?.email || 'customer@example.com',
                contact: user?.phoneNumber || '9999999999'
            },
            notes: {
                address: "VelcyFashion Corporate Office"
            },
            theme: {
                color: "#D4AF37"
            }
        }

        const paymentObject = new window.Razorpay(options)
        paymentObject.open()
    }

    return (
        <Layout>
            {/* Processing Overlay */}
            {processingPayment && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center">
                        <Loader2 className="w-16 h-16 text-accent animate-spin mx-auto mb-4" />
                        <h3 className="text-2xl font-bold mb-2">Processing Your Order</h3>
                        <p className="text-gray-600">Please wait while we confirm your payment and create your order...</p>
                        <div className="mt-6 flex items-center justify-center gap-2">
                            <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-gray-50 py-12 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-heading font-bold mb-8">Checkout</h1>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column: Address & Payment */}
                        <div className="lg:col-span-2 space-y-8">

                            {/* Address Section */}
                            <div className="bg-white p-6 rounded-xl shadow-sm">
                                <div className="flex items-center gap-2 mb-6">
                                    <MapPin className="text-accent" />
                                    <h2 className="text-xl font-bold">Shipping Address</h2>
                                </div>

                                <AddressManager
                                    selectedAddressId={selectedAddressId}
                                    onAddressSelect={(address) => setSelectedAddressId(address?.id)}
                                    compact={true}
                                />
                            </div>

                            {/* Payment Method (Mock) */}
                            <div className="bg-white p-6 rounded-xl shadow-sm">
                                <h2 className="text-xl font-bold mb-6">Payment Method</h2>
                                <div className="space-y-4">
                                    <label className="flex items-center gap-4 p-4 border border-accent bg-accent/5 rounded-xl cursor-pointer">
                                        <input type="radio" name="payment" defaultChecked className="w-5 h-5 text-accent focus:ring-accent" />
                                        <span className="font-bold">Razorpay (UPI, Cards, Netbanking)</span>
                                    </label>
                                    <label className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl cursor-pointer opacity-50">
                                        <input type="radio" name="payment" disabled className="w-5 h-5 text-gray-300" />
                                        <span className="text-gray-500">Cash on Delivery (Currently Unavailable)</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white p-6 rounded-xl shadow-sm sticky top-24">
                                <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
                                    {cart.map((item) => (
                                        <div key={`${item.id}-${item.selectedColor}`} className="flex gap-4">
                                            <div className="w-16 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                                <img src={item.images?.[0] || item.image} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 text-sm">
                                                <p className="font-medium line-clamp-2">{item.name}</p>
                                                <p className="text-gray-500">Qty: {item.quantity}</p>
                                                <p className="font-bold">₹{(item.price * item.quantity).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-gray-100 pt-4 space-y-2">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span>₹{cartTotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Shipping</span>
                                        <span className="text-green-600 font-medium">Free</span>
                                    </div>
                                    <div className="flex justify-between text-xl font-bold text-primary pt-2 border-t border-gray-100 mt-2">
                                        <span>Total</span>
                                        <span>₹{cartTotal.toLocaleString()}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handlePayment}
                                    disabled={processingPayment}
                                    className="w-full bg-accent text-white font-bold py-4 rounded-xl mt-8 hover:bg-primary transition-colors shadow-lg shadow-accent/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processingPayment ? 'Processing...' : 'Pay Now'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Checkout