import React, { useState } from 'react'
import Layout from '../components/layout/Layout'
import { motion } from 'framer-motion'
import { Heart, ShoppingBag, ArrowRight, Share2, X, Loader2, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useWishlist } from '../context/WishlistContext'
import { useCart } from '../context/CartContext'
import SEO from '../components/common/SEO'
import toast from 'react-hot-toast'

const Wishlist = () => {
    const { wishlist, clearWishlist } = useWishlist()
    const { addToCart } = useCart()
    const [sharing, setSharing] = useState(false)
    const [movingAll, setMovingAll] = useState(false)

    const handleAddToCart = (product) => {
        addToCart(product, 1, product.colors ? product.colors[0] : null)
        toast.success('Added to cart!')
    }

    const handleShareWishlist = async () => {
        if (!wishlist.length) return

        setSharing(true)
        try {
            if (navigator.share) {
                await navigator.share({
                    title: 'My Wishlist - Velcy Fashion',
                    text: `Check out my wishlist with ${wishlist.length} items from Velcy Fashion!`,
                    url: window.location.href
                })
            } else {
                // Fallback: copy to clipboard
                const wishlistText = wishlist.map(item =>
                    `${item.name} - ₹${item.price.toLocaleString()}\n${window.location.origin}/product/${item.id}`
                ).join('\n\n')

                await navigator.clipboard.writeText(wishlistText)
                toast.success('Wishlist copied to clipboard!')
            }
        } catch (error) {
            console.error('Error sharing wishlist:', error)
            toast.error('Failed to share wishlist')
        } finally {
            setSharing(false)
        }
    }

    const handleMoveAllToCart = () => {
        setMovingAll(true)
        setTimeout(() => {
            wishlist.forEach(product => {
                addToCart(product, 1, product.colors ? product.colors[0] : null)
            })
            clearWishlist()
            setMovingAll(false)
            toast.success(`Added ${wishlist.length} items to cart!`)
        }, 1000)
    }

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating)
        const hasHalfStar = rating % 1 >= 0.5
        const stars = []

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(<Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />)
            } else if (i === fullStars && hasHalfStar) {
                stars.push(<Star key={i} size={14} className="fill-yellow-400/50 text-yellow-400" />)
            } else {
                stars.push(<Star key={i} size={14} className="text-gray-300" />)
            }
        }
        return stars
    }

    if (!wishlist.length) {
        return (
            <Layout>
                <SEO
                    title="My Wishlist"
                    description="View and manage your wishlist items at Velcy Fashion"
                />
                <div className="min-h-[60vh] flex items-center justify-center px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center max-w-md"
                    >
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Heart size={40} className="text-gray-300" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-3">Your wishlist is empty</h2>
                        <p className="text-gray-600 mb-8">
                            Start adding items you love to your wishlist and they'll appear here.
                        </p>
                        <Link
                            to="/shop"
                            className="inline-flex items-center bg-accent text-primary font-semibold px-6 py-3 rounded-full hover:bg-white hover:text-accent transition-all transform hover:scale-105"
                        >
                            Continue Shopping <ArrowRight className="ml-2" size={18} />
                        </Link>
                    </motion.div>
                </div>
            </Layout>
        )
    }

    return (
        <Layout>
            <SEO
                title="My Wishlist"
                description={`View and manage your wishlist with ${wishlist.length} items at Velcy Fashion`}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4"
                >
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">My Wishlist</h1>
                        <p className="text-gray-600">
                            {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} in your wishlist
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={handleShareWishlist}
                            disabled={sharing}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            {sharing ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <Share2 size={16} />
                            )}
                            Share
                        </button>

                        <button
                            onClick={handleMoveAllToCart}
                            disabled={movingAll}
                            className="flex items-center gap-2 bg-accent text-primary px-4 py-2 rounded-full text-sm font-medium hover:bg-white hover:text-accent transition-colors disabled:opacity-50"
                        >
                            {movingAll ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <ShoppingBag size={16} />
                            )}
                            Add All to Cart
                        </button>
                    </div>
                </motion.div>

                {/* Wishlist Items */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                    {wishlist.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ y: -5 }}
                            className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
                        >
                            {/* Product Image */}
                            <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                                <img
                                    src={product.images?.[0] || product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    loading="lazy"
                                />

                                {/* Badge */}
                                {product.isNew && (
                                    <span className="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                                        NEW
                                    </span>
                                )}

                                {/* Quick Actions */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center gap-3 pb-4">
                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        className="bg-white p-3 rounded-full text-primary hover:text-accent hover:scale-110 transition-all shadow-lg"
                                        title="Add to Cart"
                                    >
                                        <ShoppingBag size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Product Info */}
                            <div className="p-4">
                                <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">{product.category}</p>

                                <Link to={`/product/${product.id}`}>
                                    <h3 className="text-lg font-medium text-primary mb-2 group-hover:text-accent transition-colors line-clamp-2 leading-tight">
                                        {product.name}
                                    </h3>
                                </Link>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg font-bold text-primary">₹{product.price.toLocaleString()}</span>
                                        {product.originalPrice && (
                                            <span className="text-sm text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
                                        )}
                                    </div>

                                    <div className="flex gap-1">
                                        {product.colors && product.colors.slice(0, 2).map((color, i) => (
                                            <div
                                                key={i}
                                                className="w-3 h-3 rounded-full border border-gray-200"
                                                style={{ backgroundColor: color }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Stock Status */}
                                {product.inStock === false && (
                                    <div className="mt-2 text-xs text-red-500 font-medium">Out of Stock</div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Continue Shopping */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-center mt-12"
                >
                    <Link
                        to="/shop"
                        className="inline-flex items-center text-accent font-medium hover:text-primary transition-colors"
                    >
                        Continue Shopping for More Items <ArrowRight className="ml-2" size={18} />
                    </Link>
                </motion.div>
            </div>
        </Layout>
    )
}

export default Wishlist