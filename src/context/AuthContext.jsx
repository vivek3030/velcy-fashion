import React, { createContext, useContext, useState, useEffect } from 'react'
import { auth, db } from '../lib/firebase'
import { onAuthStateChanged, signOut, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [confirmationResult, setConfirmationResult] = useState(null)
    const [recaptchaVerifier, setRecaptchaVerifier] = useState(null)
    const [otpCooldown, setOtpCooldown] = useState(0)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                // Fetch user profile from Firestore
                const userDoc = await getDoc(doc(db, 'users', currentUser.uid))
                if (userDoc.exists()) {
                    setUser({ ...currentUser, ...userDoc.data() })
                } else {
                    setUser(currentUser)
                }
            } else {
                setUser(null)
            }
            setLoading(false)
        })

        return () => {
            unsubscribe()
            // Cleanup RecaptchaVerifier on unmount
            if (recaptchaVerifier) {
                recaptchaVerifier.clear()
            }
        }
    }, [recaptchaVerifier])

    const setupRecaptcha = (elementId) => {
        if (!recaptchaVerifier) {
            const verifier = new RecaptchaVerifier(auth, elementId, {
                'size': 'invisible',
                'callback': (response) => {
                    // reCAPTCHA solved
                }
            })
            setRecaptchaVerifier(verifier)
            return verifier
        }
        return recaptchaVerifier
    }

    const sendOtp = async (phoneNumber) => {
        // Rate limiting: Check if cooldown is active
        if (otpCooldown > 0) {
            toast.error(`Please wait ${otpCooldown} seconds before requesting another OTP`)
            return false
        }

        try {
            const appVerifier = setupRecaptcha('recaptcha-container')
            const confirmation = await signInWithPhoneNumber(auth, phoneNumber, appVerifier)
            setConfirmationResult(confirmation)

            // Set 60 second cooldown
            setOtpCooldown(60)
            const interval = setInterval(() => {
                setOtpCooldown((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval)
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)

            toast.success('OTP sent successfully!')
            return true
        } catch (error) {
            console.error(error)
            toast.error('Failed to send OTP: ' + error.message)
            return false
        }
    }

    const verifyOtp = async (otp) => {
        if (!confirmationResult) return false
        try {
            const result = await confirmationResult.confirm(otp)
            const user = result.user

            // Check if user exists in Firestore, if not create
            const userRef = doc(db, 'users', user.uid)
            const userSnap = await getDoc(userRef)

            if (!userSnap.exists()) {
                await setDoc(userRef, {
                    phoneNumber: user.phoneNumber,
                    createdAt: new Date(),
                    role: 'user'
                })
            }

            toast.success('Logged in successfully!')
            return true
        } catch (error) {
            console.error(error)
            toast.error('Invalid OTP')
            return false
        }
    }

    const logout = async () => {
        try {
            await signOut(auth)
            toast.success('Logged out')
        } catch (error) {
            toast.error('Error logging out')
        }
    }

    // MOCK LOGIN FOR DEVELOPMENT ONLY
    const mockLogin = (phoneNumber) => {
        // Only allow mock login in development
        if (import.meta.env.MODE !== 'development') {
            toast.error('Mock login is not available in production')
            return
        }

        const mockUser = {
            uid: 'mock-user-123',
            phoneNumber: phoneNumber,
            displayName: 'Test User',
            role: 'user'
        }
        setUser(mockUser)
        toast.success('Mock Login Successful (Development Only)')
    }

    return (
        <AuthContext.Provider value={{ user, loading, sendOtp, verifyOtp, logout, mockLogin, otpCooldown }}>
            {children}
        </AuthContext.Provider>
    )
}
