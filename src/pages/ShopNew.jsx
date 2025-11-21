import React, { useState, useMemo, useEffect } from 'react'
import Layout from '../components/layout/Layout'
import ProductCard from '../components/product/ProductCard'
import { Filter, ChevronDown, X, Loader2 } from 'lucide-react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../lib/firebase'
import toast from 'react-hot-toast'

const Shop = () => {
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [selectedCategories, setSelectedCategories] = useState([])
    const [selectedFabrics, setSelectedFabrics] = useState([])
    const [priceRange, setPriceRange] = useState(50000)
    const [sortBy, setSortBy] = useState('featured')
    const [searchQuery, setSearchQuery] = useState('')
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)

    // Fetch products from Firestore
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'products'))
                const loadedProducts = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }))
                setProducts(loadedProducts)
            } catch (error) {
                console.error('Error fetching products:', error)
                toast.error('Failed to load products')
            } finally {
                setLoading(false)
            }
        }
        fetchProducts()
    }, [])

    // Handle category filter
    const handleCategoryChange = (category) => {
        if (category === 'All') {
            setSelectedCategories([])
        } else {
            setSelectedCategories(prev =>
                prev.includes(category)
                    ? prev.filter(c => c !== category)
                    : [...prev, category]
            )
        }
    }

    // Handle fabric filter
    const handleFabricChange = (fabric) => {
        setSelectedFabrics(prev =>
            prev.includes(fabric)
                ? prev.filter(f => f !== fabric)
                : [...prev, fabric]
        )
    }

    // Clear all filters
    const clearAllFilters = () => {
        setSelectedCategories([])
        setSelectedFabrics([])
        setPriceRange(50000)
    }

    // Filtered products
    const filteredProducts = useMemo(() => {
        let filtered = products.filter(product => {
            // Search filter
            const searchMatch = searchQuery === '' ||
                product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.category?.toLowerCase().includes(searchQuery.toLowerCase())

            // Category filter
            const categoryMatch = selectedCategories.length === 0 ||
                selectedCategories.includes(product.category)

            // Fabric filter
            const fabricMatch = selectedFabrics.length === 0 ||
                selectedFabrics.includes(product.fabric)

            // Price filter
            const priceMatch = product.price <= priceRange

            return searchMatch && categoryMatch && fabricMatch && priceMatch
        })

        // Apply sorting
        if (sortBy === 'price-asc') {
            filtered.sort((a, b) => a.price - b.price)
        } else if (sortBy === 'price-desc') {
            filtered.sort((a, b) => b.price - a.price)
        } else if (sortBy === 'name') {
            filtered.sort((a, b) => a.name.localeCompare(b.name))
        }

        return filtered
    }, [products, selectedCategories, selectedFabrics, priceRange, sortBy, searchQuery])

    const hasActiveFilters = selectedCategories.length > 0 || selectedFabrics.length > 0 || priceRange < 50000

    if (loading) {
        return (
            <Layout>
                <div className="bg-gray-50 py-8 min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 text-accent animate-spin mx-auto mb-4" />
                        <p className="text-gray-600">Loading products...</p>
                    </div>
                </div>
            </Layout>
        )
    }

    return (
        <Layout>
            <div className="bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Search Bar */}
                    <div className="mb-6">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full max-w-md px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-accent transition-colors"
                        />
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                        <h1 className="text-3xl font-heading font-bold text-primary mb-4 md:mb-0">Shop Collection</h1>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                data-testid="filter-button"
                                className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200 hover:border-accent transition-colors"
                            >
                                <Filter size={20} />
                                <span>Filters</span>
                                {hasActiveFilters && (
                                    <span className="bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {selectedCategories.length + selectedFabrics.length + (priceRange < 50000 ? 1 : 0)}
                                    </span>
                                )}
                            </button>
                            <div className="relative group">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="bg-white px-4 py-2 rounded-lg border border-gray-200 hover:border-accent transition-colors appearance-none pr-10 cursor-pointer focus:outline-none focus:border-accent"
                                >
                                    <option value="featured">Sort by: Featured</option>
                                    <option value="price-asc">Price: Low to High</option>
                                    <option value="price-desc">Price: High to Low</option>
                                    <option value="name">Name: A to Z</option>
                                </select>
                                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Sidebar Filters (Desktop) */}
                        <aside className={`w-full md:w-64 flex-shrink-0 ${isFilterOpen ? 'block' : 'hidden md:block'}`}>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
                                {/* Clear All Button */}
                                {hasActiveFilters && (
                                    <button
                                        onClick={clearAllFilters}
                                        className="w-full mb-4 flex items-center justify-center gap-2 text-accent hover:text-primary transition-colors text-sm font-medium"
                                    >
                                        <X size={16} />
                                        Clear All Filters
                                    </button>
                                )}

                                <div className="mb-8">
                                    <h3 className="font-bold text-lg mb-4">Categories</h3>
                                    <ul className="space-y-2">
                                        {['All', 'Saree', 'Dress', 'Lehenga', 'Kurta'].map(cat => (
                                            <li key={cat}>
                                                <label className="flex items-center gap-2 cursor-pointer hover:text-accent">
                                                    <input
                                                        type="checkbox"
                                                        className="rounded text-accent focus:ring-accent"
                                                        checked={cat === 'All' ? selectedCategories.length === 0 : selectedCategories.includes(cat)}
                                                        onChange={() => handleCategoryChange(cat)}
                                                    />
                                                    <span>{cat}</span>
                                                </label>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="mb-8">
                                    <h3 className="font-bold text-lg mb-4">Price Range</h3>
                                    <input
                                        type="range"
                                        min="0"
                                        max="50000"
                                        value={priceRange}
                                        onChange={(e) => setPriceRange(Number(e.target.value))}
                                        className="w-full accent-accent"
                                    />
                                    <div className="flex justify-between text-sm text-gray-500 mt-2">
                                        <span>₹0</span>
                                        <span>₹{priceRange.toLocaleString('en-IN')}</span>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-bold text-lg mb-4">Fabric</h3>
                                    <ul className="space-y-2">
                                        {['Silk', 'Cotton', 'Georgette', 'Chiffon', 'Velvet'].map(fabric => (
                                            <li key={fabric}>
                                                <label className="flex items-center gap-2 cursor-pointer hover:text-accent">
                                                    <input
                                                        type="checkbox"
                                                        className="rounded text-accent focus:ring-accent"
                                                        checked={selectedFabrics.includes(fabric)}
                                                        onChange={() => handleFabricChange(fabric)}
                                                    />
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
                            <div className="mb-4 text-gray-600">
                                Showing {filteredProducts.length} of {products.length} products
                            </div>

                            {filteredProducts.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredProducts.map(product => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16 bg-white rounded-xl">
                                    <p className="text-gray-500 text-lg mb-4">No products found matching your filters</p>
                                    <button
                                        onClick={clearAllFilters}
                                        className="text-accent hover:text-primary font-medium"
                                    >
                                        Clear all filters
                                    </button>
                                </div>
                            )}

                            {/* Pagination - only show if products exist */}
                            {filteredProducts.length > 0 && (
                                <div className="mt-12 flex justify-center">
                                    <button className="bg-white border border-gray-200 px-4 py-2 rounded-l-lg hover:bg-gray-50">Prev</button>
                                    <button className="bg-accent text-white px-4 py-2">1</button>
                                    <button className="bg-white border border-gray-200 px-4 py-2 hover:bg-gray-50">2</button>
                                    <button className="bg-white border border-gray-200 px-4 py-2 hover:bg-gray-50">3</button>
                                    <button className="bg-white border border-gray-200 px-4 py-2 rounded-r-lg hover:bg-gray-50">Next</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Shop
