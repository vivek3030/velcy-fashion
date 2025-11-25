import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, ShoppingBag, Package, Users, LogOut, Menu, X, Truck } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const AdminLayout = ({ children }) => {
    const location = useLocation()
    const { logout } = useAuth()
    const navigate = useNavigate()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const handleLogout = async () => {
        await logout()
        navigate('/login')
    }

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
        { icon: ShoppingBag, label: 'Products', path: '/admin/products' },
        { icon: Package, label: 'Orders', path: '/admin/orders' },
        { icon: Users, label: 'Customers', path: '/admin/customers' },
        { icon: Truck, label: 'Delivery Agents', path: '/admin/delivery-agents' },
    ]

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 bg-primary text-white z-50 flex items-center justify-between px-4 py-3 border-b border-gray-800">
                <h1 className="text-xl font-heading font-bold">Velcy<span className="text-accent">Admin</span></h1>
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar - Desktop & Mobile */}
            <aside className={`
                fixed md:static inset-y-0 left-0 z-40
                w-64 bg-primary text-white flex-shrink-0 flex flex-col
                transform transition-transform duration-300 ease-in-out
                ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                ${mobileMenuOpen ? 'mt-14' : 'md:mt-0'}
            `}>
                <div className="p-6 border-b border-gray-800 hidden md:block">
                    <h1 className="text-2xl font-heading font-bold">Velcy<span className="text-accent">Admin</span></h1>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === item.path ? 'bg-accent text-primary font-bold' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                        >
                            <item.icon size={20} />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 w-full transition-colors"
                    >
                        <LogOut size={20} /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto mt-14 md:mt-0">
                <div className="p-4 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    )
}

export default AdminLayout
