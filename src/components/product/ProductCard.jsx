import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, ShoppingBag } from 'lucide-react'
import { motion } from 'framer-motion'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import toast from 'react-hot-toast'

const ProductCard = ({ product }) => {
    const { addToCart } = useCart()
    const { wishlist, addToWishlist, removeFromWishlist } = useWishlist()

    const isInWishlist = wishlist.some(item => item.id === product.id)

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
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                    <button
                        onClick={handleWishlist}
                        className="bg-white p-3 rounded-full text-primary hover:text-accent hover:scale-110 transition-all shadow-lg"
                        title="Add to Wishlist"
                    >
                        <Heart size={20} fill={isInWishlist ? 'currentColor' : 'none'} />
                    </button>
                    <button
                        onClick={handleQuickAdd}
                        className="bg-accent p-3 rounded-full text-white hover:bg-white hover:text-accent hover:scale-110 transition-all shadow-lg"
                        title="Quick Add"
                    >
                        <ShoppingBag size={20} />
                    </button>
                </div>

                {/* Badges */}
                {product.isNew && (
                    <span className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                        NEW
                    </span>
                )}
                {product.discount && (
                    <span className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        -{product.discount}%
                    </span>
                )}
            </div>

            {/* Product Info */}
            <div className="p-4">
                <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">{product.category}</p>
                <Link to={`/product/${product.id}`}>
                    <h3 className="text-lg font-medium text-primary mb-2 group-hover:text-accent transition-colors line-clamp-1">
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
                        {product.colors && product.colors.map((color, i) => (
                            <div key={i} className="w-3 h-3 rounded-full border border-gray-200" style={{ backgroundColor: color }}></div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default ProductCard
