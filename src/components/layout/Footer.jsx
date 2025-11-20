import React from 'react'
import { Link } from 'react-router-dom'
import { Facebook, Instagram, Twitter } from 'lucide-react'

const Footer = () => {
    return (
        <footer className="bg-primary text-white pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-heading font-bold">Velcy<span className="text-accent">Fashion</span></h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Redefining elegance with our exclusive collection of sarees and dresses. Crafted for the modern woman who cherishes tradition.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6">Shop</h4>
                        <ul className="space-y-3 text-gray-400 text-sm">
                            <li><Link to="/shop?category=sarees" className="hover:text-accent transition-colors">Sarees</Link></li>
                            <li><Link to="/shop?category=dresses" className="hover:text-accent transition-colors">Dresses</Link></li>
                            <li><Link to="/new-arrivals" className="hover:text-accent transition-colors">New Arrivals</Link></li>
                            <li><Link to="/best-sellers" className="hover:text-accent transition-colors">Best Sellers</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-bold mb-6">Contact Us</h3>
                        <ul className="space-y-4 text-gray-400 text-sm">
                            <li className="flex items-start gap-3">
                                <span className="font-bold text-white">Address:</span>
                                <span>241, Tulsi Arcade, Near Atlanta Shopping Mall, Sudama Chowk, Mota Varachha, Surat, Gujarat, 394101</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="font-bold text-white">Phone:</span>
                                <a href="tel:+919106118628" className="hover:text-accent transition-colors">+91 91061 18628</a>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="font-bold text-white">Email:</span>
                                <a href="mailto:velcyfashion2025@gmail.com" className="hover:text-accent transition-colors">velcyfashion2025@gmail.com</a>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6">Stay Updated</h4>
                        <p className="text-gray-400 text-sm mb-4">Subscribe to our newsletter for exclusive offers and updates.</p>
                        <form className="flex flex-col space-y-3">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded focus:outline-none focus:border-accent transition-colors"
                            />
                            <button className="bg-accent text-primary font-bold py-2 px-4 rounded hover:bg-white transition-colors">
                                Subscribe
                            </button>
                        </form>
                        <div className="flex space-x-4 mt-6">
                            <a href="#" className="text-gray-400 hover:text-accent transition-colors"><Instagram size={20} /></a>
                            <a href="#" className="text-gray-400 hover:text-accent transition-colors"><Facebook size={20} /></a>
                            <a href="#" className="text-gray-400 hover:text-accent transition-colors"><Twitter size={20} /></a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} VelcyFashion. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
