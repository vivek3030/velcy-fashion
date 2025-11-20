import React, { useState } from 'react'
import Layout from '../components/layout/Layout'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Phone, Lock, ArrowRight } from 'lucide-react'

const Login = () => {
    const [phoneNumber, setPhoneNumber] = useState('')
    const [otp, setOtp] = useState('')
    const [step, setStep] = useState('PHONE') // PHONE or OTP
    const { sendOtp, verifyOtp, mockLogin, user, otpCooldown } = useAuth()
    const navigate = useNavigate()

    // Redirect if already logged in
    if (user) {
        navigate('/profile')
        return null
    }

    const handleSendOtp = async (e) => {
        e.preventDefault()
        // Basic validation for 10-digit number or formatted +91
        const phoneRegex = /^(\+91)?[6-9]\d{9}$/
        if (!phoneRegex.test(phoneNumber)) {
            // In a real app, show a toast error here
            alert("Please enter a valid valid Indian mobile number (e.g., 9999999999)")
            return
        }

        // For development/demo purposes, we'll use the mock login if the number is a specific test number
        if (phoneNumber === '9999999999') {
            mockLogin('+919999999999')
            return
        }

        const formattedNumber = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`
        const success = await sendOtp(formattedNumber)
        if (success) setStep('OTP')
    }

    const handleVerifyOtp = async (e) => {
        e.preventDefault()
        const success = await verifyOtp(otp)
        if (success) navigate('/profile')
    }
    // ... rest of the component remains the same
    return (
        <Layout>
            <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-lg">
                    <div className="text-center">
                        <h2 className="mt-6 text-3xl font-heading font-bold text-primary">
                            {step === 'PHONE' ? 'Welcome Back' : 'Verify OTP'}
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            {step === 'PHONE'
                                ? 'Enter your mobile number to login/signup'
                                : `Enter the OTP sent to ${phoneNumber}`
                            }
                        </p>
                    </div>

                    {step === 'PHONE' ? (
                        <form className="mt-8 space-y-6" onSubmit={handleSendOtp}>
                            <div className="rounded-md shadow-sm -space-y-px">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Phone className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="tel"
                                        required
                                        className="appearance-none rounded-lg relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-accent focus:border-accent focus:z-10 sm:text-sm"
                                        placeholder="Mobile Number"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={otpCooldown > 0}
                                    className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent ${otpCooldown > 0
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-primary hover:bg-accent'
                                        }`}
                                >
                                    {otpCooldown > 0 ? `Wait ${otpCooldown}s` : 'Send OTP'}
                                    {otpCooldown === 0 && <ArrowRight className="ml-2 h-4 w-4" />}
                                </button>
                            </div>
                            <div id="recaptcha-container"></div>

                            <div className="text-center text-xs text-gray-400 mt-4">
                                <p>For demo, use <strong>9999999999</strong> to skip OTP.</p>
                            </div>
                        </form>
                    ) : (
                        <form className="mt-8 space-y-6" onSubmit={handleVerifyOtp}>
                            <div className="rounded-md shadow-sm -space-y-px">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        className="appearance-none rounded-lg relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-accent focus:border-accent focus:z-10 sm:text-sm"
                                        placeholder="Enter OTP"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-between items-center">
                                <button
                                    type="button"
                                    onClick={() => setStep('PHONE')}
                                    className="text-sm text-accent hover:underline"
                                >
                                    Change Number
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSendOtp}
                                    disabled={otpCooldown > 0}
                                    className={`text-sm ${otpCooldown > 0
                                        ? 'text-gray-400 cursor-not-allowed'
                                        : 'text-gray-500 hover:text-primary cursor-pointer'
                                        }`}
                                >
                                    {otpCooldown > 0 ? `Resend in ${otpCooldown}s` : 'Resend OTP'}
                                </button>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
                                >
                                    Verify & Login
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </Layout>
    )
}

export default Login