import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import { Star, Truck, ShieldCheck, Heart, ShoppingBag, Minus, Plus, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { products } from '../data/products'
import toast from 'react-hot-toast'

const ProductDetails = () => {
    const { id } = useParams()
    const [selectedImage, setSelectedImage] = useState(0)
    const [quantity, setQuantity] = useState(1)

    // Find product by ID
    const product = products.find(p => p.id === Number(id))

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

    const [selectedColor, setSelectedColor] = useState(product.colors ? product.colors[0] : null)
    const { addToCart } = useCart()
    const { wishlist, addToWishlist, removeFromWishlist } = useWishlist()

    const isInWishlist = wishlist.some(item => item.id === product.id)

    return (
        <Layout>
            <div className="bg-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Image Gallery */}
                        <div className="space-y-4">
                            <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100">
                                <motion.img
                                    key={selectedImage}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    src={product.images[selectedImage] || product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
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

                        {/* Product Info */}
                        <div>
                            <div className="mb-6">
                                <h1 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-2">{product.name}</h1>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="flex items-center text-yellow-400">
                                        <Star size={18} fill="currentColor" />
                                        <span className="ml-1 text-primary font-bold">{product.rating || 'New'}</span>
                                    </div>
                                    <span className="text-gray-400">|</span>
                                    <span className="text-gray-500">{product.reviews || 0} Reviews</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-3xl font-bold text-primary">₹{product.price.toLocaleString()}</span>
                                    {product.originalPrice && (
                                        <>
                                            <span className="text-xl text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
                                            <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-bold">
                                                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>

                            <p className="text-gray-600 leading-relaxed mb-8">
                                {product.description}
                            </p>

                            {/* Options */}
                            <div className="space-y-6 mb-8">
                                {product.colors && product.colors.length > 0 && (
                                    <div>
                                        <h3 className="font-bold mb-3">Color</h3>
                                        <div className="flex gap-3">
                                            {product.colors.map((color, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => setSelectedColor(color)}
                                                    className={`w-8 h-8 rounded-full border-2 ${selectedColor === color ? 'border-primary ring-2 ring-offset-2 ring-primary' : 'border-gray-200'}`}
                                                    style={{ backgroundColor: color }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

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
                            <div className="flex gap-4 mb-8">
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
                            <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-8">
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
                            <div className="mt-8 space-y-2 text-sm text-gray-600">
                                <p><span className="font-bold text-primary">Fabric:</span> {product.fabric}</p>
                                <p><span className="font-bold text-primary">Care:</span> {product.care}</p>
                                <p><span className="font-bold text-primary">Estimated Delivery:</span> {product.delivery}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default ProductDetails