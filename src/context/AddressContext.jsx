import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { doc, setDoc, getDoc, updateDoc, deleteDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { auth } from '../lib/firebase'
import toast from 'react-hot-toast'

// Initial state
const initialState = {
    addresses: [],
    loading: false,
    error: null,
    defaultAddressId: null
}

// Action types
const ACTIONS = {
    SET_LOADING: 'SET_LOADING',
    SET_ERROR: 'SET_ERROR',
    SET_ADDRESSES: 'SET_ADDRESSES',
    ADD_ADDRESS: 'ADD_ADDRESS',
    UPDATE_ADDRESS: 'UPDATE_ADDRESS',
    DELETE_ADDRESS: 'DELETE_ADDRESS',
    SET_DEFAULT_ADDRESS: 'SET_DEFAULT_ADDRESS',
    CLEAR_ERROR: 'CLEAR_ERROR'
}

// Reducer function
const addressReducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.SET_LOADING:
            return { ...state, loading: action.payload }
        case ACTIONS.SET_ERROR:
            return { ...state, error: action.payload, loading: false }
        case ACTIONS.SET_ADDRESSES:
            return {
                ...state,
                addresses: action.payload.addresses,
                defaultAddressId: action.payload.defaultAddressId,
                loading: false,
                error: null
            }
        case ACTIONS.ADD_ADDRESS:
            const newAddresses = [...state.addresses, action.payload]
            return { ...state, addresses: newAddresses, loading: false, error: null }
        case ACTIONS.UPDATE_ADDRESS:
            const updatedAddresses = state.addresses.map(addr =>
                addr.id === action.payload.id ? { ...addr, ...action.payload } : addr
            )
            return { ...state, addresses: updatedAddresses, loading: false, error: null }
        case ACTIONS.DELETE_ADDRESS:
            const filteredAddresses = state.addresses.filter(addr => addr.id !== action.payload)
            const newDefaultId = state.defaultAddressId === action.payload ? null : state.defaultAddressId
            return {
                ...state,
                addresses: filteredAddresses,
                defaultAddressId: newDefaultId,
                loading: false,
                error: null
            }
        case ACTIONS.SET_DEFAULT_ADDRESS:
            return { ...state, defaultAddressId: action.payload, loading: false }
        case ACTIONS.CLEAR_ERROR:
            return { ...state, error: null }
        default:
            return state
    }
}

// Create context
const AddressContext = createContext()

// Provider component
export const AddressProvider = ({ children }) => {
    const [state, dispatch] = useReducer(addressReducer, initialState)

    // Validate Indian address
    const validateIndianAddress = (address) => {
        const errors = []

        if (!address.name || address.name.trim().length < 2) {
            errors.push('Name must be at least 2 characters long')
        }

        if (!address.phone || !/^[6-9]\d{9}$/.test(address.phone)) {
            errors.push('Please enter a valid 10-digit mobile number')
        }

        if (!address.pincode || !/^[1-9][0-9]{5}$/.test(address.pincode)) {
            errors.push('Please enter a valid 6-digit PIN code')
        }

        if (!address.address || address.address.trim().length < 10) {
            errors.push('Please enter a complete address (minimum 10 characters)')
        }

        if (!address.city || address.city.trim().length < 2) {
            errors.push('City is required')
        }

        if (!address.state || address.state.trim().length < 2) {
            errors.push('State is required')
        }

        // Validate state against Indian states
        const indianStates = [
            'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
            'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
            'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
            'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
            'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands',
            'Chandigarh', 'Dadra and Nagar Haveli', 'Daman and Diu', 'Delhi', 'Jammu and Kashmir',
            'Ladakh', 'Lakshadweep', 'Puducherry'
        ]

        if (address.state && !indianStates.includes(address.state)) {
            errors.push('Please select a valid Indian state')
        }

        return errors
    }

    // Format address for display
    const formatAddress = (address) => {
        const parts = [
            address.address,
            address.area || address.landmark,
            `${address.city} - ${address.pincode}`,
            address.state
        ].filter(Boolean)

        return parts.join(', ')
    }

    // Get full address with name
    const getFullAddress = (address) => {
        return {
            ...address,
            formattedAddress: formatAddress(address),
            shortAddress: `${address.city}, ${address.state}`,
            label: address.label || 'Home'
        }
    }

    // Fetch all addresses for current user
    const fetchAddresses = async () => {
        if (!auth.currentUser) {
            dispatch({ type: ACTIONS.SET_ADDRESSES, payload: { addresses: [], defaultAddressId: null } })
            return
        }

        dispatch({ type: ACTIONS.SET_LOADING, payload: true })

        try {
            const addressesRef = collection(db, 'users', auth.currentUser.uid, 'addresses')
            const q = query(addressesRef, orderBy('createdAt', 'desc'))
            const querySnapshot = await getDocs(q)

            const addresses = []
            let defaultAddressId = null

            querySnapshot.forEach((doc) => {
                const addressData = { id: doc.id, ...doc.data() }
                addresses.push(getFullAddress(addressData))
                if (addressData.isDefault) {
                    defaultAddressId = doc.id
                }
            })

            dispatch({
                type: ACTIONS.SET_ADDRESSES,
                payload: { addresses, defaultAddressId }
            })
        } catch (error) {
            console.error('Error fetching addresses:', error)
            dispatch({ type: ACTIONS.SET_ERROR, payload: 'Failed to fetch addresses' })
            toast.error('Failed to fetch addresses')
        }
    }

    // Add new address
    const addAddress = async (addressData) => {
        if (!auth.currentUser) {
            dispatch({ type: ACTIONS.SET_ERROR, payload: 'Please login to add address' })
            return false
        }

        // Validate address
        const validationErrors = validateIndianAddress(addressData)
        if (validationErrors.length > 0) {
            dispatch({ type: ACTIONS.SET_ERROR, payload: validationErrors.join(', ') })
            toast.error(validationErrors[0])
            return false
        }

        dispatch({ type: ACTIONS.SET_LOADING, payload: true })

        try {
            const addressRef = doc(collection(db, 'users', auth.currentUser.uid, 'addresses'))
            const newAddress = {
                ...addressData,
                createdAt: new Date(),
                updatedAt: new Date(),
                isDefault: state.addresses.length === 0 // Make default if it's first address
            }

            await setDoc(addressRef, newAddress)

            const addressWithId = { id: addressRef.id, ...newAddress }
            dispatch({ type: ACTIONS.ADD_ADDRESS, payload: getFullAddress(addressWithId) })

            // If this is the default address, update the default address ID
            if (newAddress.isDefault) {
                dispatch({ type: ACTIONS.SET_DEFAULT_ADDRESS, payload: addressRef.id })
            }

            toast.success('Address added successfully')
            return addressWithId
        } catch (error) {
            console.error('Error adding address:', error)
            dispatch({ type: ACTIONS.SET_ERROR, payload: 'Failed to add address' })
            toast.error('Failed to add address')
            return false
        }
    }

    // Update existing address
    const updateAddress = async (addressId, addressData) => {
        if (!auth.currentUser) {
            dispatch({ type: ACTIONS.SET_ERROR, payload: 'Please login to update address' })
            return false
        }

        // Validate address
        const validationErrors = validateIndianAddress(addressData)
        if (validationErrors.length > 0) {
            dispatch({ type: ACTIONS.SET_ERROR, payload: validationErrors.join(', ') })
            toast.error(validationErrors[0])
            return false
        }

        dispatch({ type: ACTIONS.SET_LOADING, payload: true })

        try {
            const addressRef = doc(db, 'users', auth.currentUser.uid, 'addresses', addressId)
            const updatedAddress = {
                ...addressData,
                updatedAt: new Date()
            }

            await updateDoc(addressRef, updatedAddress)

            const addressWithId = { id: addressId, ...updatedAddress }
            dispatch({ type: ACTIONS.UPDATE_ADDRESS, payload: getFullAddress(addressWithId) })

            toast.success('Address updated successfully')
            return addressWithId
        } catch (error) {
            console.error('Error updating address:', error)
            dispatch({ type: ACTIONS.SET_ERROR, payload: 'Failed to update address' })
            toast.error('Failed to update address')
            return false
        }
    }

    // Delete address
    const deleteAddress = async (addressId) => {
        if (!auth.currentUser) {
            dispatch({ type: ACTIONS.SET_ERROR, payload: 'Please login to delete address' })
            return false
        }

        if (!window.confirm('Are you sure you want to delete this address?')) {
            return false
        }

        dispatch({ type: ACTIONS.SET_LOADING, payload: true })

        try {
            await deleteDoc(doc(db, 'users', auth.currentUser.uid, 'addresses', addressId))
            dispatch({ type: ACTIONS.DELETE_ADDRESS, payload: addressId })
            toast.success('Address deleted successfully')
            return true
        } catch (error) {
            console.error('Error deleting address:', error)
            dispatch({ type: ACTIONS.SET_ERROR, payload: 'Failed to delete address' })
            toast.error('Failed to delete address')
            return false
        }
    }

    // Set default address
    const setDefaultAddress = async (addressId) => {
        if (!auth.currentUser) {
            dispatch({ type: ACTIONS.SET_ERROR, payload: 'Please login to set default address' })
            return false
        }

        dispatch({ type: ACTIONS.SET_LOADING, payload: true })

        try {
            // First, remove default status from all addresses
            const addressesRef = collection(db, 'users', auth.currentUser.uid, 'addresses')
            const q = query(addressesRef, where('isDefault', '==', true))
            const querySnapshot = await getDocs(q)

            const batch = []
            querySnapshot.forEach((doc) => {
                batch.push(updateDoc(doc.ref, { isDefault: false, updatedAt: new Date() }))
            })

            // Set new default address
            const newDefaultRef = doc(addressesRef, addressId)
            batch.push(updateDoc(newDefaultRef, { isDefault: true, updatedAt: new Date() }))

            await Promise.all(batch)

            // Update local state
            dispatch({ type: ACTIONS.SET_DEFAULT_ADDRESS, payload: addressId })
            toast.success('Default address updated successfully')
            return true
        } catch (error) {
            console.error('Error setting default address:', error)
            dispatch({ type: ACTIONS.SET_ERROR, payload: 'Failed to set default address' })
            toast.error('Failed to set default address')
            return false
        }
    }

    // Get default address
    const getDefaultAddress = () => {
        return state.addresses.find(addr => addr.id === state.defaultAddressId) || state.addresses[0] || null
    }

    // Clear errors
    const clearError = () => {
        dispatch({ type: ACTIONS.CLEAR_ERROR })
    }

    // Fetch addresses on auth state change
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                fetchAddresses()
            } else {
                dispatch({ type: ACTIONS.SET_ADDRESSES, payload: { addresses: [], defaultAddressId: null } })
            }
        })

        return unsubscribe
    }, [])

    const value = {
        ...state,
        addresses: state.addresses,
        loading: state.loading,
        error: state.error,
        defaultAddressId: state.defaultAddressId,
        fetchAddresses,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        getDefaultAddress,
        formatAddress,
        getFullAddress,
        validateIndianAddress,
        clearError
    }

    return (
        <AddressContext.Provider value={value}>
            {children}
        </AddressContext.Provider>
    )
}

// Custom hook
export const useAddress = () => {
    const context = useContext(AddressContext)
    if (!context) {
        throw new Error('useAddress must be used within an AddressProvider')
    }
    return context
}

export default AddressContext