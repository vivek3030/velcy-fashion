import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import { Star, Truck, ShieldCheck, Heart, ShoppingBag, Minus, Plus, ArrowLeft, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import toast from 'react-hot-toast'

const ProductDetails = () => {
    const { id } = useParams()
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [selectedImage, setSelectedImage] = useState(0)
    const [quantity, setQuantity] = useState(1)
    const { addToCart } = useCart()
    const { wishlist, addToWishlist, removeFromWishlist } = useWishlist()

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const docRef = doc(db, 'products', id)
                const docSnap = await getDoc(docRef)

                if (docSnap.exists()) {
                    setProduct({ id: docSnap.id, ...docSnap.data() })
                } else {
                    console.log('No such document!')
                }
            } catch (error) {
                console.error('Error fetching product:', error)
                toast.error('Failed to load product details')
            } finally {
                setLoading(false)
            }
        }

        fetchProduct()
    }, [id])

    if (loading) {
        return (
            <Layout>
                <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                    <Loader2 className="w-12 h-12 text-accent animate-spin mb-4" />
                    <p className="text-gray-600">Loading product...</p>
                </div>
            </Layout>
        )
    }

    // Handle case where product is not found
    if (!product) {
        return (
            <Layout>
                <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                    <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
                    <Link to="/shop" className="text-accent hover:underline flex items-center gap-2">
                        <ArrowLeft size={16} /> Back to Shop
                    </Link>
                </div>
            </Layout>
        )
    }

    const selectedColor = product.colors?.[0] || null
    const isInWishlist = wishlist.some(item => item.id === product.id)

    // Safe price display
    const formatPrice = (price) => {
        return Number(price || 0).toLocaleString('en-IN')
    }

    return (
        <Layout>
            <div className="bg-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Left Column: Image Gallery */}
                        <div className="space-y-4">
                            <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100 relative">
                                <motion.img
                                    key={selectedImage}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    src={product.images?.[selectedImage] || product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                                {product.salePrice && (
                                    <span className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                        Sale
                                    </span>
                                )}
                            </div>
                            {product.images && product.images.length > 1 && (
                                <div className="grid grid-cols-4 gap-4">
                                    {product.images.map((img, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(index)}
                                            className={`aspect-square rounded-lg overflow-hidden border-2 ${selectedImage === index ? 'border-accent' : 'border-transparent'}`}
                                        >
                                            <img src={img} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Right Column: Product Info */}
                        <div className="space-y-8">
                            <div>
                                <h1 className="text-3xl font-heading font-bold text-primary mb-2">{product.name}</h1>
                                <p className="text-gray-500 text-sm mb-4 uppercase tracking-wider">{product.category}</p>
                                <div className="flex items-center gap-4">
                                    <span className="text-3xl font-bold text-primary">₹{formatPrice(product.salePrice || product.price)}</span>
                                    {product.salePrice && (
                                        <span className="text-xl text-gray-400 line-through">₹{formatPrice(product.price)}</span>
                                    )}
                                </div>
                            </div>

                            <div className="prose prose-sm text-gray-600">
                                <p>{product.description}</p>
                            </div>

                            <div className="space-y-6 pt-6 border-t border-gray-100">
                                {/* Colors */}
                                {product.colors && product.colors.length > 0 && (
                                    <div>
                                        <h3 className="font-bold mb-3">Color</h3>
                                        <div className="flex gap-3">
                                            {product.colors.map((color, i) => (
                                                <div
                                                    key={i}
                                                    className={`w-8 h-8 rounded-full border-2 ${selectedColor === color ? 'border-primary ring-2 ring-offset-2 ring-primary' : 'border-gray-200'}`}
                                                    style={{ backgroundColor: color }}
                                                    title={color}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Quantity */}
                                <div>
                                    <h3 className="font-bold mb-3">Quantity</h3>
                                    <div className="flex items-center border border-gray-300 rounded-lg w-max">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="p-3 hover:bg-gray-50 transition-colors"
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span className="w-12 text-center font-bold">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="p-3 hover:bg-gray-50 transition-colors"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-4 pt-6 border-t border-gray-100">
                                <button
                                    onClick={() => {
                                        addToCart(product, quantity, selectedColor)
                                        toast.success('Added to cart!')
                                    }}
                                    className="flex-1 bg-accent text-white font-bold py-4 rounded-xl hover:bg-primary transition-colors flex items-center justify-center gap-2 shadow-lg shadow-accent/20"
                                >
                                    <ShoppingBag size={20} /> Add to Cart
                                </button>
                                <button
                                    onClick={() => {
                                        if (isInWishlist) {
                                            removeFromWishlist(product.id)
                                        } else {
                                            addToWishlist(product)
                                        }
                                    }}
                                    className="p-4 border border-gray-200 rounded-xl hover:border-accent hover:text-accent transition-colors"
                                >
                                    <Heart size={24} fill={isInWishlist ? 'currentColor' : 'none'} />
                                </button>
                            </div>

                            {/* Features */}
                            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-100">
                                <div className="flex items-start gap-3">
                                    <Truck className="text-accent" size={24} />
                                    <div>
                                        <h4 className="font-bold text-sm">Free Shipping</h4>
                                        <p className="text-xs text-gray-500">On orders above ₹999</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <ShieldCheck className="text-accent" size={24} />
                                    <div>
                                        <h4 className="font-bold text-sm">Authentic Quality</h4>
                                        <p className="text-xs text-gray-500">100% Original Products</p>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Info */}
                            <div className="pt-6 border-t border-gray-100 space-y-2 text-sm text-gray-600">
                                <p><span className="font-bold text-primary">Fabric:</span> {product.fabric || 'N/A'}</p>
                                {product.stock && <p><span className="font-bold text-primary">Stock:</span> {product.stock > 0 ? 'In Stock' : 'Out of Stock'}</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default ProductDetails