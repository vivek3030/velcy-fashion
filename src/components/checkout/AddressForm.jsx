import React, { useState } from 'react'
import { sanitizeInput } from '../../utils/sanitize'

const AddressForm = ({ onSave, onCancel, initialData = {} }) => {
    const [formData, setFormData] = useState({
        name: initialData.name || '',
        mobile: initialData.mobile || '',
        pincode: initialData.pincode || '',
        address: initialData.address || '',
        city: initialData.city || '',
        state: initialData.state || '',
        landmark: initialData.landmark || '',
        isDefault: initialData.isDefault || false
    })
    const [errors, setErrors] = useState({})

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const validateForm = () => {
        const newErrors = {}

        // Validate mobile number (10 digits)
        const mobileRegex = /^[0-9]{10}$/
        if (!mobileRegex.test(formData.mobile)) {
            newErrors.mobile = 'Mobile number must be 10 digits'
        }

        // Validate PIN code (6 digits)
        const pincodeRegex = /^[0-9]{6}$/
        if (!pincodeRegex.test(formData.pincode)) {
            newErrors.pincode = 'PIN code must be 6 digits'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (validateForm()) {
            // Sanitize all inputs before saving
            const sanitizedData = {
                ...formData,
                name: sanitizeInput(formData.name),
                mobile: sanitizeInput(formData.mobile),
                pincode: sanitizeInput(formData.pincode),
                address: sanitizeInput(formData.address),
                city: sanitizeInput(formData.city),
                state: sanitizeInput(formData.state),
                landmark: sanitizeInput(formData.landmark)
            }
            onSave(sanitizedData)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
                />
                <input
                    type="tel"
                    name="mobile"
                    placeholder="Mobile Number"
                    value={formData.mobile}
                    onChange={handleChange}
                    pattern="[0-9]{10}"
                    maxLength="10"
                    required
                    className={`w-full p-3 border ${errors.mobile ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-accent`}
                />
                {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                    type="text"
                    name="pincode"
                    placeholder="PIN Code"
                    value={formData.pincode}
                    onChange={handleChange}
                    pattern="[0-9]{6}"
                    maxLength="6"
                    required
                    className={`w-full p-3 border ${errors.pincode ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-accent`}
                />
                {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>}
                <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
                />
                <input
                    type="text"
                    name="landmark"
                    placeholder="Landmark (Optional)"
                    value={formData.landmark}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
                />
            </div>
            <textarea
                name="address"
                placeholder="Address (House No, Building, Street, Area)"
                value={formData.address}
                onChange={handleChange}
                required
                rows="3"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
            />

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    name="isDefault"
                    id="isDefault"
                    checked={formData.isDefault}
                    onChange={handleChange}
                    className="rounded text-accent focus:ring-accent"
                />
                <label htmlFor="isDefault" className="text-sm text-gray-600">Make this my default address</label>
            </div>

            <div className="flex gap-4 pt-4">
                <button
                    type="submit"
                    className="flex-1 bg-accent text-white font-bold py-3 rounded-lg hover:bg-primary transition-colors"
                >
                    Save Address
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 border border-gray-300 text-gray-600 font-bold py-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    Cancel
                </button>
            </div>
        </form>
    )
}

export default AddressForm
