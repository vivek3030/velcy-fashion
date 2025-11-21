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

    const mockLogin = async (phoneNumber) => {
        try {
            // Create a mock user for testing
            const mockUserId = phoneNumber.replace(/\+/g, '')
            const userRef = doc(db, 'users', mockUserId)
            const userSnap = await getDoc(userRef)

            // Determine role based on phone number
            // If phone ends with '0000', make them admin, otherwise regular user
            const role = phoneNumber.endsWith('0000') ? 'admin' : 'user'

            if (!userSnap.exists()) {
                await setDoc(userRef, {
                    phoneNumber: phoneNumber,
                    createdAt: new Date(),
                    role: role
                })
            }

            // Create a mock user object
            const mockUser = {
                uid: mockUserId,
                phoneNumber: phoneNumber,
                role: role
            }

            setUser(mockUser)
            toast.success(`Logged in as ${role}`)
        } catch (error) {
            console.error('Mock login error:', error)
            toast.error('Failed to login')
        }
    }

    const logout = async () => {
        try {
            await signOut(auth)
            setUser(null) // Explicitly clear user state (fixes mock login logout)
            toast.success('Logged out')
        } catch (error) {
            console.error('Logout error:', error)
            toast.error('Failed to log out')
        }
    }

    const value = {
        user,
        loading,
        sendOtp,
        verifyOtp,
        mockLogin,
        logout,
        otpCooldown
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
