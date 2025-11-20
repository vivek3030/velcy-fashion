import React, { useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import ProductForm from '../../components/admin/ProductForm'
import { Plus, Search, Edit2, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

const Products = () => {
    const [showForm, setShowForm] = useState(false)
    const [editingProduct, setEditingProduct] = useState(null)
    const [products, setProducts] = useState([
        {
            id: 1,
            name: 'Kanjivaram Silk Saree',
            category: 'saree',
            price: 12999,
            stock: 15,
            image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1974&auto=format&fit=crop'
        },
        {
            id: 2,
            name: 'Banarasi Silk Saree',
            category: 'saree',
            price: 8999,
            stock: 8,
            image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1974&auto=format&fit=crop'
        }
    ])

    const handleSaveProduct = (productData) => {
        if (editingProduct) {
            setProducts(products.map(p => p.id === editingProduct.id ? { ...p, ...productData } : p))
            toast.success('Product updated successfully')
        } else {
            setProducts([...products, { ...productData, id: Date.now(), image: productData.images[0] || '' }])
            toast.success('Product added successfully')
        }
        setShowForm(false)
        setEditingProduct(null)
    }

    const handleEdit = (product) => {
        setEditingProduct(product)
        setShowForm(true)
    }

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            setProducts(products.filter(p => p.id !== id))
            toast.success('Product deleted')
        }
    }

    return (
        <AdminLayout>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Products</h1>
                <button
                    onClick={() => { setEditingProduct(null); setShowForm(true) }}
                    className="bg-accent text-white px-6 py-3 rounded-lg font-bold hover:bg-primary transition-colors flex items-center gap-2"
                >
                    <Plus size={20} /> Add Product
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-accent"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-100">
                            <tr>
                                <th className="p-4">Product</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Price</th>
                                <th className="p-4">Stock</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {products.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50">
                                    <td className="p-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                                                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                            </div>
                                            <span className="font-medium text-gray-800">{product.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 capitalize text-gray-600">{product.category}</td>
                                    <td className="p-4 font-medium">₹{product.price.toLocaleString()}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${product.stock > 10 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                            {product.stock} in stock
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => handleEdit(product)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                <Edit2 size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(product.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showForm && (
                <ProductForm
                    onClose={() => setShowForm(false)}
                    onSave={handleSaveProduct}
                    initialData={editingProduct || {}}
                />
            )}
        </AdminLayout>
    )
}

export default Products
