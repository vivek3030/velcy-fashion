import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag, Menu, X, Search, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../../context/CartContext'
import logo from '../../assets/logo.png'

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const { cartCount, setIsCartOpen } = useCart()

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <img src={logo} alt="VelcyFashion" className="h-12 w-auto" />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className={`font-medium transition-colors ${isScrolled ? 'text-primary hover:text-accent' : 'text-primary hover:text-accent'}`}>Home</Link>
                        <Link to="/shop?category=sarees" className={`font-medium transition-colors ${isScrolled ? 'text-primary hover:text-accent' : 'text-primary hover:text-accent'}`}>Sarees</Link>
                        <Link to="/shop?category=dresses" className={`font-medium transition-colors ${isScrolled ? 'text-primary hover:text-accent' : 'text-primary hover:text-accent'}`}>Dresses</Link>
                        <Link to="/about" className={`font-medium transition-colors ${isScrolled ? 'text-primary hover:text-accent' : 'text-primary hover:text-accent'}`}>Our Story</Link>
                    </div>

                    {/* Icons */}
                    <div className="hidden md:flex items-center space-x-6">
                        <button className={`transition-colors ${isScrolled ? 'text-primary hover:text-accent' : 'text-primary hover:text-accent'}`}>
                            <Search size={20} />
                        </button>
                        <Link to="/profile" className={`transition-colors ${isScrolled ? 'text-primary hover:text-accent' : 'text-primary hover:text-accent'}`}>
                            <User size={20} />
                        </Link>
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className={`relative transition-colors ${isScrolled ? 'text-primary hover:text-accent' : 'text-primary hover:text-accent'}`}
                        >
                            <ShoppingBag size={20} />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-accent text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className={`focus:outline-none ${isScrolled ? 'text-primary' : 'text-primary'}`}
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
                        className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
                    >
                        <div className="px-4 pt-2 pb-6 space-y-2">
                            <Link to="/" className="block px-3 py-2 text-base font-medium text-primary hover:bg-gray-50 rounded-md">Home</Link>
                            <Link to="/shop?category=sarees" className="block px-3 py-2 text-base font-medium text-primary hover:bg-gray-50 rounded-md">Sarees</Link>
                            <Link to="/shop?category=dresses" className="block px-3 py-2 text-base font-medium text-primary hover:bg-gray-50 rounded-md">Dresses</Link>
                            <Link to="/about" className="block px-3 py-2 text-base font-medium text-primary hover:bg-gray-50 rounded-md">Our Story</Link>
                            <div className="border-t border-gray-100 pt-4 mt-4 flex space-x-6 px-3">
                                <Link to="/profile" className="flex items-center text-primary hover:text-accent">
                                    <User size={20} className="mr-2" /> Profile
                                </Link>
                                <button onClick={() => setIsCartOpen(true)} className="flex items-center text-primary hover:text-accent w-full text-left">
                                    <ShoppingBag size={20} className="mr-2" /> Cart ({cartCount})
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}

export default Navbar
