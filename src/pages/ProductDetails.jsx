import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import { Star, Truck, ShieldCheck, Heart, ShoppingBag, Minus, Plus } from 'lucide-react'
import { motion } from 'framer-motion'

// Dummy Data (In a real app, fetch by ID)
const PRODUCT = {
    id: 1,
    name: 'Kanjivaram Silk Saree',
    price: 12999,
    originalPrice: 15999,
    description: 'Exquisite Kanjivaram silk saree with intricate zari work. Perfect for weddings and special occasions. Handwoven by master weavers in Kanchipuram.',
    fabric: 'Pure Silk',
    care: 'Dry Clean Only',
    delivery: '3-5 Business Days',
    images: [
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1974&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=1974&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1583391733958-e023765f350a?q=80&w=2071&auto=format&fit=crop',
    ],
    colors: ['#800000', '#FFD700', '#008000'],
    sizes: ['Free Size'],
    reviews: 128,
    rating: 4.8
}

const ProductDetails = () => {
    const { id } = useParams()
    const [selectedImage, setSelectedImage] = useState(0)
    const [quantity, setQuantity] = useState(1)
    const [selectedColor, setSelectedColor] = useState(PRODUCT.colors[0])

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
                                    src={PRODUCT.images[selectedImage]}
                                    alt={PRODUCT.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="grid grid-cols-4 gap-4">
                                {PRODUCT.images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`aspect-square rounded-lg overflow-hidden border-2 ${selectedImage === index ? 'border-accent' : 'border-transparent'}`}
                                    >
                                        <img src={img} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Product Info */}
                        <div>
                            <div className="mb-6">
                                <h1 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-2">{PRODUCT.name}</h1>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="flex items-center text-yellow-400">
                                        <Star size={18} fill="currentColor" />
                                        <span className="ml-1 text-primary font-bold">{PRODUCT.rating}</span>
                                    </div>
                                    <span className="text-gray-400">|</span>
                                    <span className="text-gray-500">{PRODUCT.reviews} Reviews</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-3xl font-bold text-primary">₹{PRODUCT.price.toLocaleString()}</span>
                                    <span className="text-xl text-gray-400 line-through">₹{PRODUCT.originalPrice.toLocaleString()}</span>
                                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-bold">
                                        {Math.round(((PRODUCT.originalPrice - PRODUCT.price) / PRODUCT.originalPrice) * 100)}% OFF
                                    </span>
                                </div>
                            </div>

                            <p className="text-gray-600 leading-relaxed mb-8">
                                {PRODUCT.description}
                            </p>

                            {/* Options */}
                            <div className="space-y-6 mb-8">
                                <div>
                                    <h3 className="font-bold mb-3">Color</h3>
                                    <div className="flex gap-3">
                                        {PRODUCT.colors.map((color, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setSelectedColor(color)}
                                                className={`w-8 h-8 rounded-full border-2 ${selectedColor === color ? 'border-primary ring-2 ring-offset-2 ring-primary' : 'border-gray-200'}`}
                                                style={{ backgroundColor: color }}
                                            />
                                        ))}
                                    </div>
                                </div>

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
                                <button className="flex-1 bg-accent text-white font-bold py-4 rounded-xl hover:bg-primary transition-colors flex items-center justify-center gap-2 shadow-lg shadow-accent/20">
                                    <ShoppingBag size={20} /> Add to Cart
                                </button>
                                <button className="p-4 border border-gray-200 rounded-xl hover:border-accent hover:text-accent transition-colors">
                                    <Heart size={24} />
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
                                <p><span className="font-bold text-primary">Fabric:</span> {PRODUCT.fabric}</p>
                                <p><span className="font-bold text-primary">Care:</span> {PRODUCT.care}</p>
                                <p><span className="font-bold text-primary">Estimated Delivery:</span> {PRODUCT.delivery}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default ProductDetails
