import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, MapPin, Edit2, Trash2, Check, X, Home, Briefcase, Star, Loader2 } from 'lucide-react'
import { useAddress } from '../../context/AddressContext'

const AddressManager = ({ selectedAddressId, onAddressSelect, showDefault = true, compact = false }) => {
    const {
        addresses,
        loading,
        error,
        defaultAddressId,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        validateIndianAddress
    } = useAddress()

    const [showForm, setShowForm] = useState(false)
    const [editingAddress, setEditingAddress] = useState(null)
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        area: '',
        landmark: '',
        city: '',
        state: '',
        pincode: '',
        label: 'home'
    })

    // Indian states for dropdown
    const indianStates = [
        'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
        'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
        'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
        'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
        'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands',
        'Chandigarh', 'Dadra and Nagar Haveli', 'Daman and Diu', 'Delhi', 'Jammu and Kashmir',
        'Ladakh', 'Lakshadweep', 'Puducherry'
    ]

    const addressLabels = [
        { value: 'home', label: 'Home', icon: Home },
        { value: 'work', label: 'Work', icon: Briefcase },
        { value: 'other', label: 'Other', icon: MapPin }
    ]

    useEffect(() => {
        if (editingAddress) {
            setFormData({
                name: editingAddress.name,
                phone: editingAddress.phone,
                address: editingAddress.address,
                area: editingAddress.area || '',
                landmark: editingAddress.landmark || '',
                city: editingAddress.city,
                state: editingAddress.state,
                pincode: editingAddress.pincode,
                label: editingAddress.label || 'home'
            })
            setShowForm(true)
        }
    }, [editingAddress])

    const handleSubmit = async (e) => {
        e.preventDefault()

        const addressData = { ...formData }

        let result
        if (editingAddress) {
            result = await updateAddress(editingAddress.id, addressData)
        } else {
            result = await addAddress(addressData)
        }

        if (result) {
            setShowForm(false)
            setEditingAddress(null)
            setFormData({
                name: '',
                phone: '',
                address: '',
                area: '',
                landmark: '',
                city: '',
                state: '',
                pincode: '',
                label: 'home'
            })
        }
    }

    const handleEdit = (address) => {
        setEditingAddress(address)
    }

    const handleDelete = async (addressId) => {
        await deleteAddress(addressId)
    }

    const handleSetDefault = async (addressId) => {
        await setDefaultAddress(addressId)
    }

    const handleAddressSelect = (address) => {
        if (onAddressSelect) {
            onAddressSelect(address)
        }
    }

    const getLabelIcon = (label) => {
        const labelConfig = addressLabels.find(l => l.value === label)
        return labelConfig ? labelConfig.icon : MapPin
    }

    if (loading && addresses.length === 0) {
        return (
            <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-accent" />
            </div>
        )
    }

    if (compact) {
        return (
            <div className="space-y-3">
                {addresses.map((address) => (
                    <div
                        key={address.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                            selectedAddressId === address.id
                                ? 'border-accent bg-accent/5'
                                : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleAddressSelect(address)}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    {React.createElement(getLabelIcon(address.label), {
                                        size: 16,
                                        className: 'text-gray-500'
                                    })}
                                    <span className="font-medium text-gray-800">{address.name}</span>
                                    {defaultAddressId === address.id && (
                                        <span className="text-xs bg-accent text-white px-2 py-0.5 rounded-full">Default</span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-600">{address.phone}</p>
                                <p className="text-sm text-gray-600 mt-1">{address.formattedAddress}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Delivery Addresses</h3>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 bg-accent text-white px-4 py-2 rounded-lg hover:bg-white hover:text-accent transition-colors text-sm font-medium"
                >
                    <Plus size={16} />
                    Add Address
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            {/* Addresses List */}
            <div className="space-y-4">
                {addresses.length === 0 && !loading ? (
                    <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                        <MapPin size={48} className="mx-auto text-gray-300 mb-4" />
                        <h4 className="text-lg font-medium text-gray-800 mb-2">No saved addresses</h4>
                        <p className="text-gray-600 mb-4">Add your first address for faster checkout</p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="bg-accent text-white px-6 py-2 rounded-lg hover:bg-white hover:text-accent transition-colors font-medium"
                        >
                            Add New Address
                        </button>
                    </div>
                ) : (
                    addresses.map((address) => (
                        <motion.div
                            key={address.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className={`border rounded-lg p-4 transition-all ${
                                selectedAddressId === address.id
                                    ? 'border-accent bg-accent/5'
                                    : 'border-gray-200 hover:border-gray-300'
                            }`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        {React.createElement(getLabelIcon(address.label), {
                                            size: 18,
                                            className: 'text-accent'
                                        })}
                                        <span className="font-semibold text-gray-800">{address.name}</span>
                                        <span className="text-sm text-gray-500">{address.label}</span>
                                        {defaultAddressId === address.id && (
                                            <span className="text-xs bg-accent text-white px-2 py-0.5 rounded-full">Default</span>
                                        )}
                                    </div>
                                    <p className="text-gray-600 mb-1">{address.phone}</p>
                                    <p className="text-gray-600">{address.formattedAddress}</p>
                                </div>
                                <div className="flex gap-2">
                                    {showDefault && defaultAddressId !== address.id && (
                                        <button
                                            onClick={() => handleSetDefault(address.id)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Set as default"
                                        >
                                            <Star size={16} />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleEdit(address)}
                                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                        title="Edit address"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(address.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete address"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Add/Edit Address Modal */}
            <AnimatePresence>
                {showForm && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-800">
                                    {editingAddress ? 'Edit Address' : 'Add New Address'}
                                </h3>
                                <button
                                    onClick={() => {
                                        setShowForm(false)
                                        setEditingAddress(null)
                                    }}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Address Label */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Address Type
                                    </label>
                                    <div className="flex gap-3">
                                        {addressLabels.map((label) => {
                                            const IconComponent = label.icon
                                            return (
                                                <button
                                                    key={label.value}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, label: label.value })}
                                                    className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${
                                                        formData.label === label.value
                                                            ? 'border-accent bg-accent/10 text-accent'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                                >
                                                    <IconComponent size={18} />
                                                    <span className="font-medium">{label.label}</span>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                                            placeholder="John Doe"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Mobile Number *
                                        </label>
                                        <input
                                            type="tel"
                                            required
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                                            placeholder="9876543210"
                                            maxLength={10}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Street Address *
                                    </label>
                                    <textarea
                                        required
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
                                        rows={2}
                                        placeholder="House No., Building Name, Street"
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Area/Locality
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.area}
                                            onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                                            placeholder="Koramangala, Sector 15"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Landmark
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.landmark}
                                            onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                                            placeholder="Near Metro Station, Temple"
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            City *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                                            placeholder="Bangalore"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            State *
                                        </label>
                                        <select
                                            required
                                            value={formData.state}
                                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                                        >
                                            <option value="">Select State</option>
                                            {indianStates.map((state) => (
                                                <option key={state} value={state}>
                                                    {state}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            PIN Code *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.pincode}
                                            onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                                            placeholder="560001"
                                            maxLength={6}
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowForm(false)
                                            setEditingAddress(null)
                                        }}
                                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 px-4 py-2 bg-accent text-white rounded-lg hover:bg-white hover:text-accent transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {loading ? (
                                            <Loader2 size={16} className="animate-spin" />
                                        ) : (
                                            <>
                                                {editingAddress ? (
                                                    <>
                                                        <Check size={16} />
                                                        Update Address
                                                    </>
                                                ) : (
                                                    <>
                                                        <Plus size={16} />
                                                        Add Address
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default AddressManager