import React, { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { WishlistProvider } from './context/WishlistContext'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import CartDrawer from './components/cart/CartDrawer'
import ProtectedAdminRoute from './components/auth/ProtectedAdminRoute'
import ErrorBoundary from './components/common/ErrorBoundary'

// Lazy load all pages for code splitting
const Home = lazy(() => import('./pages/Home'))
const Shop = lazy(() => import('./pages/Shop'))
const ProductDetails = lazy(() => import('./pages/ProductDetails'))
const Login = lazy(() => import('./pages/Login'))
const Profile = lazy(() => import('./pages/Profile'))
const Checkout = lazy(() => import('./pages/Checkout'))
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation'))
const Dashboard = lazy(() => import('./pages/admin/Dashboard'))
const Products = lazy(() => import('./pages/admin/Products'))
const Orders = lazy(() => import('./pages/admin/Orders'))

function App() {
    return (
        <ErrorBoundary>
            <AuthProvider>
                <WishlistProvider>
                    <CartProvider>
                        <Router>
                            <div className="min-h-screen bg-secondary font-sans text-primary">
                                <CartDrawer />
                                <Suspense fallback={
                                    <div className="min-h-screen flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-accent"></div>
                                    </div>
                                }>
                                    <Routes>
                                        <Route path="/" element={<Home />} />
                                        <Route path="/shop" element={<Shop />} />
                                        <Route path="/product/:id" element={<ProductDetails />} />
                                        <Route path="/login" element={<Login />} />
                                        <Route path="/profile" element={<Profile />} />
                                        <Route path="/checkout" element={<Checkout />} />
                                        <Route path="/order-confirmation" element={<OrderConfirmation />} />
                                        <Route path="/admin" element={<ProtectedAdminRoute><Dashboard /></ProtectedAdminRoute>} />
                                        <Route path="/admin/products" element={<ProtectedAdminRoute><Products /></ProtectedAdminRoute>} />
                                        <Route path="/admin/orders" element={<ProtectedAdminRoute><Orders /></ProtectedAdminRoute>} />
                                    </Routes>
                                </Suspense>
                            </div>
                        </Router>
                    </CartProvider>
                </WishlistProvider>
            </AuthProvider>
        </ErrorBoundary>
    )
}

export default App
