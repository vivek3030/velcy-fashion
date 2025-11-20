import React, { useState } from 'react'
import Layout from '../components/layout/Layout'
import ProductCard from '../components/product/ProductCard'
import { Filter, ChevronDown } from 'lucide-react'

// Dummy Data
const PRODUCTS = [
    {
        id: 1,
        name: 'Kanjivaram Silk Saree',
        category: 'Saree',
        price: 12999,
        originalPrice: 15999,
        discount: 20,
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1974&auto=format&fit=crop',
        isNew: true,
        colors: ['#800000', '#FFD700']
    },
    {
        id: 2,
        name: 'Floral Georgette Dress',
        category: 'Dress',
        price: 4599,
        originalPrice: null,
        discount: null,
        image: 'https://images.unsplash.com/photo-1596783437088-213049e36dc1?q=80&w=1974&auto=format&fit=crop',
        isNew: false,
        colors: ['#FFC0CB', '#FFFFFF']
    },
    {
        id: 3,
        name: 'Banarasi Silk Saree',
        category: 'Saree',
        price: 8999,
        originalPrice: 10999,
        discount: 18,
        image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=1974&auto=format&fit=crop',
        isNew: false,
        colors: ['#000080', '#C0C0C0']
    },
    {
        id: 4,
        name: 'Embroidered Anarkali',
        category: 'Dress',
        price: 6999,
        originalPrice: 8999,
        discount: 22,
        image: 'https://images.unsplash.com/photo-1583391733958-e023765f350a?q=80&w=2071&auto=format&fit=crop',
        isNew: true,
        colors: ['#008000', '#FFD700']
    }
]

const Shop = () => {
    const [isFilterOpen, setIsFilterOpen] = useState(false)

    return (
        <Layout>
            <div className="bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                        <h1 className="text-3xl font-heading font-bold text-primary mb-4 md:mb-0">Shop Collection</h1>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200 hover:border-accent transition-colors"
                            >
                                <Filter size={20} />
                                <span>Filters</span>
                            </button>
                            <div className="relative group">
                                <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200 hover:border-accent transition-colors">
                                    <span>Sort by: Featured</span>
                                    <ChevronDown size={16} />
                                </button>
                                {/* Dropdown would go here */}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Sidebar Filters (Desktop) */}
                        <aside className={`w-full md:w-64 flex-shrink-0 ${isFilterOpen ? 'block' : 'hidden md:block'}`}>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
                                <div className="mb-8">
                                    <h3 className="font-bold text-lg mb-4">Categories</h3>
                                    <ul className="space-y-2">
                                        {['All', 'Sarees', 'Dresses', 'Lehengas', 'Kurtas'].map(cat => (
                                            <li key={cat}>
                                                <label className="flex items-center gap-2 cursor-pointer hover:text-accent">
                                                    <input type="checkbox" className="rounded text-accent focus:ring-accent" />
                                                    <span>{cat}</span>
                                                </label>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="mb-8">
                                    <h3 className="font-bold text-lg mb-4">Price Range</h3>
                                    <input type="range" min="0" max="50000" className="w-full accent-accent" />
                                    <div className="flex justify-between text-sm text-gray-500 mt-2">
                                        <span>₹0</span>
                                        <span>₹50,000+</span>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-bold text-lg mb-4">Fabric</h3>
                                    <ul className="space-y-2">
                                        {['Silk', 'Cotton', 'Georgette', 'Chiffon', 'Velvet'].map(fabric => (
                                            <li key={fabric}>
                                                <label className="flex items-center gap-2 cursor-pointer hover:text-accent">
                                                    <input type="checkbox" className="rounded text-accent focus:ring-accent" />
                                                    <span>{fabric}</span>
                                                </label>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </aside>

                        {/* Product Grid */}
                        <div className="flex-1">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {PRODUCTS.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>

                            {/* Pagination */}
                            <div className="mt-12 flex justify-center">
                                <button className="bg-white border border-gray-200 px-4 py-2 rounded-l-lg hover:bg-gray-50">Prev</button>
                                <button className="bg-accent text-white px-4 py-2">1</button>
                                <button className="bg-white border border-gray-200 px-4 py-2 hover:bg-gray-50">2</button>
                                <button className="bg-white border border-gray-200 px-4 py-2 hover:bg-gray-50">3</button>
                                <button className="bg-white border border-gray-200 px-4 py-2 rounded-r-lg hover:bg-gray-50">Next</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Shop
