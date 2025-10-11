import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useToast } from './ToastContext.jsx'

const CartContext = createContext(null)

const STORAGE_KEY = 'cart-items'

export function CartProvider({ children }) {
  const toast = useToast()
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addToCart = (product, quantity = 1) => {
    // normalize incoming product shape: ensure image and numeric price
    const normalized = {
      ...product,
      image: product.image || product.imageUrl,
      price: typeof product.price === 'string' ? Number(product.price) : product.price,
    }
    setItems((prev) => {
      const existing = prev.find((p) => p.id === normalized.id)
      if (existing) {
        return prev.map((p) => (p.id === normalized.id ? { ...p, quantity: p.quantity + quantity } : p))
      }
      return [...prev, { ...normalized, quantity }]
    })
    try { toast?.showToast(`${product.name} added to cart`, 'success') } catch (e) {}
  }

  const updateQuantity = (productId, quantity) => {
    setItems((prev) => prev.map((p) => (p.id === productId ? { ...p, quantity: Math.max(1, quantity) } : p)))
  }

  const removeFromCart = (productId) => {
    setItems((prev) => {
      const removed = prev.find((p) => p.id === productId)
      const next = prev.filter((p) => p.id !== productId)
      try { if (removed) toast?.showToast(`${removed.name} removed from cart`, 'warning') } catch (e) {}
      return next
    })
  }

  const clearCart = () => setItems([])

  const total = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items])

  const value = useMemo(
    () => ({ items, addToCart, updateQuantity, removeFromCart, clearCart, total }),
    [items, total]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  return useContext(CartContext)
}



