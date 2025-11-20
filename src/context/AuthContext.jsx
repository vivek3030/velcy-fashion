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

        return () => unsubscribe()
    }, [])

    const setupRecaptcha = (elementId) => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, elementId, {
                'size': 'invisible',
                'callback': (response) => {
                    // reCAPTCHA solved, allow signInWithPhoneNumber.
                }
            });
        }
    }

    const sendOtp = async (phoneNumber) => {
        try {
            setupRecaptcha('recaptcha-container')
            const appVerifier = window.recaptchaVerifier
            const confirmation = await signInWithPhoneNumber(auth, phoneNumber, appVerifier)
            setConfirmationResult(confirmation)
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

    // MOCK LOGIN FOR DEVELOPMENT (Since we don't have real Firebase keys yet)
    const mockLogin = (phoneNumber) => {
        const mockUser = {
            uid: 'mock-user-123',
            phoneNumber: phoneNumber,
            displayName: 'Test User',
            role: 'user'
        }
        setUser(mockUser)
        toast.success('Mock Login Successful')
    }

    return (
        <AuthContext.Provider value={{ user, loading, sendOtp, verifyOtp, logout, mockLogin }}>
            {children}
        </AuthContext.Provider>
    )
}
