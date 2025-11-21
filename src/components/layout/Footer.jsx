import React from 'react'
import { Link } from 'react-router-dom'
import { Instagram } from 'lucide-react'

const Footer = () => {
    return (
        <footer className="bg-primary text-white pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Brand & Social */}
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-2xl font-heading font-bold">Velcy<span className="text-accent">Fashion</span></h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Redefining elegance with our exclusive collection of sarees and dresses. Crafted for the modern woman who cherishes tradition.
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Instagram"
                                className="bg-gray-800 p-2 rounded-full text-gray-400 hover:text-accent hover:bg-gray-700 transition-all"
                            >
                                <Instagram size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6">Shop</h4>
                        <ul className="space-y-3 text-gray-400 text-sm">
                            <li><Link to="/shop?category=sarees" className="hover:text-accent transition-colors">Sarees</Link></li>
                            <li><Link to="/shop?category=dresses" className="hover:text-accent transition-colors">Dresses</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6">Contact Us</h4>
                        <ul className="space-y-4 text-gray-400 text-sm">
                            <li className="flex items-start gap-3">
                                <span className="font-bold text-white min-w-[60px]">Address:</span>
                                <span>241, Tulsi Arcade, Near Atlanta Shopping Mall, Sudama Chowk, Mota Varachha, Surat, Gujarat, 394101</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="font-bold text-white min-w-[60px]">Phone:</span>
                                <a href="tel:+919106118628" className="hover:text-accent transition-colors">+91 91061 18628</a>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="font-bold text-white min-w-[60px]">Email:</span>
                                <a href="mailto:velcyfashion2025@gmail.com" className="hover:text-accent transition-colors">velcyfashion2025@gmail.com</a>
                            </li>
                        </ul>
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
