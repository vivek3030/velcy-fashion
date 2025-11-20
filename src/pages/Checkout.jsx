import React, { useState, useEffect } from 'react'
import Layout from '../components/layout/Layout'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import AddressForm from '../components/checkout/AddressForm'
import { MapPin, Plus, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'

const Checkout = () => {
    const { cart, cartTotal } = useCart()
    const { user, loading } = useAuth()
    const navigate = useNavigate()
    const [showAddressForm, setShowAddressForm] = useState(false)
    const [selectedAddress, setSelectedAddress] = useState(null)
    const [addresses, setAddresses] = useState([
        // Dummy address for demo
        {
            id: 1,
            name: 'John Doe',
            mobile: '9876543210',
            pincode: '110001',
            address: '123, Main Street, Connaught Place',
            city: 'New Delhi',
            state: 'Delhi',
            isDefault: true
        }
    ])

    useEffect(() => {
        if (!loading) {
            if (cart.length === 0) {
                navigate('/shop')
            } else if (!user) {
                navigate('/login')
            }
        }
    }, [cart, user, loading, navigate])

    if (loading || cart.length === 0 || !user) {
        return null // Or a loading spinner
    }

    const handleAddAddress = (newAddress) => {
        const addressWithId = { ...newAddress, id: Date.now() }
        setAddresses([...addresses, addressWithId])
        setShowAddressForm(false)
        setSelectedAddress(addressWithId.id)
    }

    const handlePayment = async () => {
        if (!selectedAddress && addresses.length === 0) {
            toast.error('Please add an address')
            return
        }

        let finalAddressId = selectedAddress
        if (!finalAddressId && addresses.length > 0) {
            finalAddressId = addresses[0].id
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

        const selectedAddr = addresses.find(a => a.id === finalAddressId)

        const options = {
            key: razorpayKey,
            amount: cartTotal * 100,
            currency: "INR",
            name: "VelcyFashion",
            description: "Transaction",
            image: "https://velcyfashion.com/logo.png",
            handler: async function (response) {
                try {
                    // Create order in Firestore
                    const orderData = {
                        userId: user.uid,
                        items: cart,
                        total: cartTotal,
                        address: selectedAddr,
                        paymentId: response.razorpay_payment_id,
                        orderId: response.razorpay_order_id,
                        signature: response.razorpay_signature,
                        status: 'confirmed',
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }

                    await addDoc(collection(db, 'orders'), orderData)
                    toast.success('Payment Successful!')
                    navigate('/order-confirmation', {
                        state: {
                            paymentId: response.razorpay_payment_id,
                            orderId: response.razorpay_order_id,
                            orderData
                        }
                    })
                } catch (error) {
                    console.error('Order creation error:', error)
                    toast.error('Payment successful but order creation failed. Please contact support.')
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
            <div className="bg-gray-50 py-12 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-heading font-bold mb-8">Checkout</h1>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column: Address & Payment */}
                        <div className="lg:col-span-2 space-y-8">

                            {/* Address Section */}
                            <div className="bg-white p-6 rounded-xl shadow-sm">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold flex items-center gap-2">
                                        <MapPin className="text-accent" /> Shipping Address
                                    </h2>
                                    {!showAddressForm && (
                                        <button
                                            onClick={() => setShowAddressForm(true)}
                                            className="text-accent font-bold text-sm hover:underline flex items-center gap-1"
                                        >
                                            <Plus size={16} /> Add New
                                        </button>
                                    )}
                                </div>

                                {showAddressForm ? (
                                    <AddressForm
                                        onSave={handleAddAddress}
                                        onCancel={() => setShowAddressForm(false)}
                                    />
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {addresses.map((addr) => (
                                            <div
                                                key={addr.id}
                                                onClick={() => setSelectedAddress(addr.id)}
                                                className={`border-2 rounded-xl p-4 cursor-pointer relative transition-all ${selectedAddress === addr.id || (addresses.length === 1 && !selectedAddress) ? 'border-accent bg-accent/5' : 'border-gray-200 hover:border-gray-300'}`}
                                            >
                                                {(selectedAddress === addr.id || (addresses.length === 1 && !selectedAddress)) && (
                                                    <div className="absolute top-4 right-4 text-accent">
                                                        <CheckCircle size={20} fill="currentColor" className="text-white" />
                                                    </div>
                                                )}
                                                <h3 className="font-bold">{addr.name}</h3>
                                                <p className="text-sm text-gray-600 mt-1">{addr.address}</p>
                                                <p className="text-sm text-gray-600">{addr.city}, {addr.state} - {addr.pincode}</p>
                                                <p className="text-sm text-gray-600 mt-2 font-medium">Mobile: {addr.mobile}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
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
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
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
                                    className="w-full bg-accent text-white font-bold py-4 rounded-xl mt-8 hover:bg-primary transition-colors shadow-lg shadow-accent/20"
                                >
                                    Pay Now
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