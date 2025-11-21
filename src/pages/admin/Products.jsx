import React, { useState, useEffect } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import ProductForm from '../../components/admin/ProductForm'
import { Plus, Search, Edit2, Trash2, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { db } from '../../lib/firebase'

const Products = () => {
    const [showForm, setShowForm] = useState(false)
    const [editingProduct, setEditingProduct] = useState(null)
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')

    // Fetch products from Firestore
    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'products'))
            const loadedProducts = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            setProducts(loadedProducts)
            console.log('Admin: Loaded products from Firestore:', loadedProducts)
        } catch (error) {
            console.error('Error fetching products:', error)
            toast.error('Failed to load products')
        } finally {
            setLoading(false)
        }
    }

    const handleSaveProduct = async (productData) => {
        try {
            if (editingProduct) {
                // Update existing product
                const productRef = doc(db, 'products', editingProduct.id)
                await updateDoc(productRef, {
                    name: productData.name,
                    category: productData.category,
                    price: Number(productData.price),
                    salePrice: productData.salePrice ? Number(productData.salePrice) : null,
                    description: productData.description,
                    fabric: productData.fabric,
                    colors: productData.colors || [],
                    images: productData.images || [],
                    stock: Number(productData.stock)
                })
                toast.success('Product updated successfully')
            } else {
                // Add new product
                await addDoc(collection(db, 'products'), {
                    name: productData.name,
                    category: productData.category,
                    price: Number(productData.price),
                    salePrice: productData.salePrice ? Number(productData.salePrice) : null,
                    description: productData.description,
                    fabric: productData.fabric,
                    colors: productData.colors || [],
                    images: productData.images || [],
                    stock: Number(productData.stock),
                    createdAt: new Date()
                })
                toast.success('Product added successfully')
            }

            // Refresh products list
            fetchProducts()
            setShowForm(false)
            setEditingProduct(null)
        } catch (error) {
            console.error('Error saving product:', error)
            toast.error('Failed to save product')
        }
    }

    const handleEdit = (product) => {
        setEditingProduct(product)
        setShowForm(true)
    }

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteDoc(doc(db, 'products', id))
                toast.success('Product deleted successfully')
                fetchProducts()
            } catch (error) {
                console.error('Error deleting product:', error)
                toast.error('Failed to delete product')
            }
        }
    }

    // Filter products by search query
    const filteredProducts = products.filter(product =>
        product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchQuery.toLowerCase())
    )

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
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-accent"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="w-8 h-8 text-accent animate-spin" />
                    </div>
                ) : (
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
                                {filteredProducts.length > 0 ? (
                                    filteredProducts.map((product) => (
                                        <tr key={product.id} className="hover:bg-gray-50">
                                            <td className="p-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                                                        {product.images && product.images[0] ? (
                                                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                                No img
                                                            </div>
                                                        )}
                                                    </div>
                                                    <span className="font-medium text-gray-800">{product.name}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 capitalize text-gray-600">{product.category}</td>
                                            <td className="p-4 font-medium">₹{product.price?.toLocaleString()}</td>
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
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="p-8 text-center text-gray-500">
                                            {searchQuery ? 'No products found matching your search' : 'No products yet. Click "Add Product" to get started.'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
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
