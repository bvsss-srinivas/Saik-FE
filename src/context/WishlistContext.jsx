import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useToast } from './ToastContext.jsx'

const WishlistContext = createContext(null)
const STORAGE_KEY = 'wishlist-items'

export function WishlistProvider({ children }) {
  const toast = useToast()
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addToWishlist = (product) => {
    setItems((prev) => {
      if (prev.some((p) => p.id === product.id)) return prev
      try { toast?.showToast(`${product.name} added to wishlist`, 'success') } catch (e) {}
      return [...prev, product]
    })
  }

  const removeFromWishlist = (productId) => {
    setItems((prev) => {
      const removed = prev.find((p) => p.id === productId)
      const next = prev.filter((p) => p.id !== productId)
      try { if (removed) toast?.showToast(`${removed.name} removed from wishlist`, 'warning') } catch (e) {}
      return next
    })
  }

  const isWishlisted = (productId) => items.some((p) => p.id === productId)

  const value = useMemo(() => ({ items, addToWishlist, removeFromWishlist, isWishlisted }), [items])

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export function useWishlist() {
  return useContext(WishlistContext)
}



