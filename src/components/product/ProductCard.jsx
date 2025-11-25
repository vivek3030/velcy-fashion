import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, ShoppingBag, Eye, Star, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import OptimizedImage from '../common/OptimizedImage'
import toast from 'react-hot-toast'

const ProductCard = ({ product }) => {
    const { addToCart } = useCart()
    const { wishlist, addToWishlist, removeFromWishlist } = useWishlist()
    const [showQuickView, setShowQuickView] = useState(false)

    const isInWishlist = wishlist.some(item => item.id === product.id)

    // Generate or use existing rating
    const rating = product.rating || (Math.random() * 1.5 + 3.5).toFixed(1) // Random rating between 3.5-5.0
    const reviewCount = product.reviewCount || Math.floor(Math.random() * 50 + 10) // Random 10-60 reviews

    const handleQuickAdd = (e) => {
        e.preventDefault()
        e.stopPropagation()
        addToCart(product, 1, product.colors ? product.colors[0] : null)
        toast.success('Added to cart!')
    }

    const handleWishlist = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (isInWishlist) {
            removeFromWishlist(product.id)
            toast.success('Removed from wishlist')
        } else {
            addToWishlist(product)
            toast.success('Added to wishlist!')
        }
    }

    const handleQuickView = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setShowQuickView(true)
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

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -10 }}
            className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
        >
            {/* Image Container */}
            <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                <OptimizedImage
                    src={product.images?.[0] || product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    width={300}
                    height={400}
                    quality={80}
                    placeholder="blur"
                />

                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center gap-4 pb-6">
                    <button
                        onClick={handleQuickView}
                        className="bg-white p-3 rounded-full text-primary hover:text-accent hover:scale-110 transition-all shadow-lg"
                        title="Quick View"
                        aria-label="Quick view"
                    >
                        <Eye size={18} />
                    </button>
                    <button
                        onClick={handleWishlist}
                        className="bg-white p-3 rounded-full text-primary hover:text-accent hover:scale-110 transition-all shadow-lg"
                        title="Add to Wishlist"
                        aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                    >
                        <Heart size={18} fill={isInWishlist ? 'currentColor' : 'none'} />
                    </button>
                    <button
                        onClick={handleQuickAdd}
                        className="bg-accent p-3 rounded-full text-white hover:bg-white hover:text-accent hover:scale-110 transition-all shadow-lg"
                        title="Quick Add"
                        aria-label="Quick add to cart"
                    >
                        <ShoppingBag size={18} />
                    </button>
                </div>

                {/* Enhanced Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.isNew && (
                        <span className="bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                            NEW
                        </span>
                    )}
                    {product.discount && (
                        <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                            -{product.discount}%
                        </span>
                    )}
                </div>

                {/* Quick View Button - Always visible on hover */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                        onClick={handleQuickView}
                        className="bg-white/90 backdrop-blur-sm p-2 rounded-full text-primary hover:bg-white hover:scale-110 transition-all shadow-md"
                        title="Quick View"
                        aria-label="Quick view"
                    >
                        <Eye size={16} />
                    </button>
                </div>
            </div>

            {/* Product Info */}
            <div className="p-4">
                <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">{product.category}</p>

                {/* Rating Display */}
                <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                        {renderStars(parseFloat(rating))}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{rating}</span>
                    <span className="text-xs text-gray-500">({reviewCount} reviews)</span>
                </div>

                <Link to={`/product/${product.id}`}>
                    <h3 className="text-lg font-medium text-primary mb-3 group-hover:text-accent transition-colors line-clamp-2 leading-tight">
                        {product.name}
                    </h3>
                </Link>

                {/* Color Swatches */}
                {product.colors && product.colors.length > 0 && (
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs text-gray-500">Colors:</span>
                        <div className="flex gap-1">
                            {product.colors.slice(0, 4).map((color, i) => (
                                <div
                                    key={i}
                                    className="w-4 h-4 rounded-full border-2 border-gray-200 hover:border-accent transition-colors cursor-pointer"
                                    style={{ backgroundColor: color }}
                                    title={color}
                                />
                            ))}
                            {product.colors.length > 4 && (
                                <div className="w-4 h-4 rounded-full border-2 border-gray-200 flex items-center justify-center bg-gray-100">
                                    <span className="text-xs text-gray-600 leading-none">+{product.colors.length - 4}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-primary">₹{product.price.toLocaleString()}</span>
                        {product.originalPrice && (
                            <span className="text-sm text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default ProductCard
