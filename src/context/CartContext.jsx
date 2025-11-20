import React, { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const CartContext = createContext()

export const useCart = () => useContext(CartContext)

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem('cart')
        return saved ? JSON.parse(saved) : []
    })
    const [isCartOpen, setIsCartOpen] = useState(false)

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart))
    }, [cart])

    const addToCart = (product, quantity = 1, color) => {
        const existingItem = cart.find(item => item.id === product.id && item.selectedColor === color)

        if (existingItem) {
            setCart(cart.map(item =>
                item.id === product.id && item.selectedColor === color
                    ? { ...item, quantity: item.quantity + quantity }
                    : item
            ))
        } else {
            setCart([...cart, { ...product, quantity, selectedColor: color }])
        }
        setIsCartOpen(true)
        toast.success('Added to cart')
    }

    const removeFromCart = (productId, color) => {
        setCart(cart.filter(item => !(item.id === productId && item.selectedColor === color)))
        toast.success('Removed from cart')
    }

    const updateQuantity = (productId, color, newQuantity) => {
        if (newQuantity < 1) return
        setCart(cart.map(item =>
            item.id === productId && item.selectedColor === color
                ? { ...item, quantity: newQuantity }
                : item
        ))
    }

    const clearCart = () => {
        setCart([])
    }

    const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0)
    const cartCount = cart.reduce((count, item) => count + item.quantity, 0)

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartTotal,
            cartCount,
            isCartOpen,
            setIsCartOpen
        }}>
            {children}
        </CartContext.Provider>
    )
}
