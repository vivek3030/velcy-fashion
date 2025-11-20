import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetails from './pages/ProductDetails'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Checkout from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'
import Dashboard from './pages/admin/Dashboard'
import Products from './pages/admin/Products'
import Orders from './pages/admin/Orders'
import { WishlistProvider } from './context/WishlistContext'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import CartDrawer from './components/cart/CartDrawer'

function App() {
    return (
        <AuthProvider>
            <WishlistProvider>
                <CartProvider>
                    <Router>
                        <div className="min-h-screen bg-secondary font-sans text-primary">
                            <CartDrawer />
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/shop" element={<Shop />} />
                                <Route path="/product/:id" element={<ProductDetails />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/profile" element={<Profile />} />
                                <Route path="/checkout" element={<Checkout />} />
                                <Route path="/order-confirmation" element={<OrderConfirmation />} />
                                <Route path="/admin" element={<Dashboard />} />
                                <Route path="/admin/products" element={<Products />} />
                                <Route path="/admin/orders" element={<Orders />} />
                            </Routes>
                        </div>
                    </Router>
                </CartProvider>
            </WishlistProvider>
        </AuthProvider>
    )
}

export default App
