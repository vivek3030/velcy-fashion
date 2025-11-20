import React, { useState } from 'react'
import { X, Upload, Plus } from 'lucide-react'
import toast from 'react-hot-toast'

const ProductForm = ({ onClose, onSave, initialData = {} }) => {
    // ... existing state initialization ...
    const [formData, setFormData] = useState({
        name: initialData.name || '',
        category: initialData.category || 'saree',
        price: initialData.price || '',
        salePrice: initialData.salePrice || '',
        description: initialData.description || '',
        fabric: initialData.fabric || '',
        colors: initialData.colors || [],
        images: initialData.images || [],
        stock: initialData.stock || ''
    })

    const [newColor, setNewColor] = useState('')
    const [newImage, setNewImage] = useState('')

    const handleChange = (e) => {
        const { name, value } = e.target
        // Prevent negative numbers for price and stock
        if ((name === 'price' || name === 'stock' || name === 'salePrice') && value < 0) {
            return
        }
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    // ... existing handleAddColor, handleAddImage ...
    const handleAddColor = () => {
        if (newColor && !formData.colors.includes(newColor)) {
            setFormData(prev => ({ ...prev, colors: [...prev.colors, newColor] }))
            setNewColor('')
        }
    }

    const handleAddImage = () => {
        if (newImage) {
            setFormData(prev => ({ ...prev, images: [...prev.images, newImage] }))
            setNewImage('')
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (Number(formData.price) <= 0) {
            toast.error('Price must be greater than 0')
            return
        }
        if (Number(formData.stock) < 0) {
            toast.error('Stock cannot be negative')
            return
        }
        onSave(formData)
    }

    // ... return JSX (same as before, just ensure handleSubmit is used) ...
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            {/* ... existing JSX structure ... */}
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* ... header ... */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-bold">{initialData.id ? 'Edit Product' : 'Add New Product'}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* ... inputs ... */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
                            >
                                <option value="saree">Saree</option>
                                <option value="dress">Dress</option>
                            </select>
                        </div>
                    </div>

                    {/* Price & Stock */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                            <input
                                type="number"
                                name="price"
                                min="0"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sale Price (Optional)</label>
                            <input
                                type="number"
                                name="salePrice"
                                min="0"
                                value={formData.salePrice}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                            <input
                                type="number"
                                name="stock"
                                min="0"
                                value={formData.stock}
                                onChange={handleChange}
                                required
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
                            />
                        </div>
                    </div>

                    {/* ... rest of the form (Description, Fabric, Colors, Images, Buttons) ... */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows="4"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Fabric</label>
                            <input
                                type="text"
                                name="fabric"
                                value={formData.fabric}
                                onChange={handleChange}
                                required
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Colors</label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    placeholder="Add color (e.g. Red)"
                                    value={newColor}
                                    onChange={(e) => setNewColor(e.target.value)}
                                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
                                />
                                <button type="button" onClick={handleAddColor} className="bg-gray-100 p-2 rounded-lg hover:bg-gray-200">
                                    <Plus size={20} />
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.colors.map((color, index) => (
                                    <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                        {color}
                                        <button type="button" onClick={() => setFormData(prev => ({ ...prev, colors: prev.colors.filter((_, i) => i !== index) }))}>
                                            <X size={14} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Images (URLs)</label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                placeholder="Image URL"
                                value={newImage}
                                onChange={(e) => setNewImage(e.target.value)}
                                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
                            />
                            <button type="button" onClick={handleAddImage} className="bg-gray-100 p-2 rounded-lg hover:bg-gray-200">
                                <Plus size={20} />
                            </button>
                        </div>
                        <div className="grid grid-cols-4 gap-4 mt-2">
                            {formData.images.map((img, index) => (
                                <div key={index} className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                    <img src={img} alt={`Product ${index}`} className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }))}
                                        className="absolute top-1 right-1 bg-white/80 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-gray-100">
                        <button
                            type="submit"
                            className="flex-1 bg-accent text-white font-bold py-3 rounded-lg hover:bg-primary transition-colors"
                        >
                            Save Product
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 border border-gray-300 text-gray-600 font-bold py-3 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ProductForm