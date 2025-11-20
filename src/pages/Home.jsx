import React from 'react'
import Layout from '../components/layout/Layout'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import SEO from '../components/common/SEO'

const Home = () => {
    return (
        <Layout>
            <SEO
                title="Home"
                description="Welcome to VelcyFashion, your destination for premium sarees and dresses."
            />
            {/* Hero Section */}
            <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-gray-900">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1583391733958-e023765f350a?q=80&w=2071&auto=format&fit=crop"
                        alt="Elegant Saree"
                        className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>

                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-5xl md:text-7xl font-heading font-bold text-white mb-6 leading-tight"
                    >
                        Timeless Elegance, <br />
                        <span className="text-accent">Modern Soul</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto"
                    >
                        Discover our exclusive collection of handpicked sarees and contemporary dresses designed for the modern woman.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <Link to="/shop?category=sarees" className="bg-accent text-primary font-bold py-4 px-8 rounded-full hover:bg-white transition-all transform hover:scale-105 flex items-center justify-center">
                            Shop Sarees <ArrowRight className="ml-2" size={20} />
                        </Link>
                        <Link to="/shop?category=dresses" className="bg-white/10 backdrop-blur-md border border-white/30 text-white font-bold py-4 px-8 rounded-full hover:bg-white hover:text-primary transition-all transform hover:scale-105 flex items-center justify-center">
                            Explore Dresses
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Featured Collections */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Curated Collections</h2>
                        <p className="text-gray-600">Handpicked styles for every occasion</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: 'Wedding Edit', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1974&auto=format&fit=crop' },
                            { title: 'Festive Glam', image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=1974&auto=format&fit=crop' },
                            { title: 'Casual Chic', image: 'https://images.unsplash.com/photo-1596783437088-213049e36dc1?q=80&w=1974&auto=format&fit=crop' },
                        ].map((collection, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ y: -10 }}
                                className="relative h-96 rounded-2xl overflow-hidden group cursor-pointer"
                            >
                                <img
                                    src={collection.image}
                                    alt={collection.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                <div className="absolute bottom-0 left-0 p-8">
                                    <h3 className="text-2xl font-bold text-white mb-2">{collection.title}</h3>
                                    <span className="text-accent font-medium flex items-center group-hover:translate-x-2 transition-transform">
                                        View Collection <ArrowRight className="ml-2" size={16} />
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </Layout>
    )
}

export default Home
