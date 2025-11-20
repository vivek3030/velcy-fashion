import React, { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const WishlistContext = createContext()

export const useWishlist = () => useContext(WishlistContext)

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState(() => {
        const saved = localStorage.getItem('wishlist')
        return saved ? JSON.parse(saved) : []
    })

    useEffect(() => {
        localStorage.setItem('wishlist', JSON.stringify(wishlist))
    }, [wishlist])

    const addToWishlist = (product) => {
        if (wishlist.some(item => item.id === product.id)) {
            toast.error('Already in wishlist')
            return
        }
        setWishlist([...wishlist, product])
        toast.success('Added to wishlist')
    }

    const removeFromWishlist = (productId) => {
        setWishlist(wishlist.filter(item => item.id !== productId))
        toast.success('Removed from wishlist')
    }

    const isInWishlist = (productId) => {
        return wishlist.some(item => item.id === productId)
    }

    return (
        <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
            {children}
        </WishlistContext.Provider>
    )
}
