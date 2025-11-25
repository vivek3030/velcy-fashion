import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag, Menu, X, User, Heart } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import logo from '../../assets/logo.png'

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const { cartCount, setIsCartOpen } = useCart()
    const { wishlist } = useWishlist()

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 bg-white shadow-sm py-4`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <img src={logo} alt="VelcyFashion" className="h-10 md:h-12 w-auto object-contain" />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="font-medium text-primary hover:text-accent transition-colors">Home</Link>
                        <Link to="/shop?category=sarees" className="font-medium text-primary hover:text-accent transition-colors">Sarees</Link>
                        <Link to="/shop?category=dresses" className="font-medium text-primary hover:text-accent transition-colors">Dresses</Link>
                    </div>

                    {/* Icons */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link to="/profile" className="text-primary hover:text-accent transition-colors">
                            <User size={22} />
                        </Link>
                        <Link to="/wishlist" className="relative text-primary hover:text-accent transition-colors" aria-label="Wishlist">
                            <Heart size={22} />
                            {wishlist.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                    {wishlist.length}
                                </span>
                            )}
                        </Link>
                        <button
                            onClick={() => setIsCartOpen(true)}
                            data-testid="cart-button"
                            aria-label="Cart"
                            className="relative text-primary hover:text-accent transition-colors"
                        >
                            <ShoppingBag size={22} />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-accent text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-4">
                        <Link to="/wishlist" className="relative text-primary">
                            <Heart size={22} />
                            {wishlist.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                    {wishlist.length}
                                </span>
                            )}
                        </Link>
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="relative text-primary"
                        >
                            <ShoppingBag size={22} />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-accent text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="focus:outline-none text-primary"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-t border-gray-100 overflow-hidden absolute top-full left-0 right-0 shadow-lg"
                    >
                        <div className="px-4 py-6 space-y-4">
                            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block text-lg font-medium text-primary hover:text-accent">Home</Link>
                            <Link to="/shop?category=sarees" onClick={() => setIsMobileMenuOpen(false)} className="block text-lg font-medium text-primary hover:text-accent">Sarees</Link>
                            <Link to="/shop?category=dresses" onClick={() => setIsMobileMenuOpen(false)} className="block text-lg font-medium text-primary hover:text-accent">Dresses</Link>
                            <div className="border-t border-gray-100 pt-4 mt-4 space-y-3">
                                <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center text-primary hover:text-accent text-lg font-medium">
                                    <Heart size={20} className="mr-3" /> Wishlist
                                </Link>
                                <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center text-primary hover:text-accent text-lg font-medium">
                                    <User size={20} className="mr-3" /> Profile
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}

export default Navbar