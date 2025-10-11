import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import CartItem from '../components/CartItem.jsx'
import { useCart } from '../context/CartContext.jsx'
import api from '../services/api.js'

export default function Cart() {
  const { items, total } = useCart()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        // optional server-backed cart endpoint; ignore if not available
        await api.get('/cart')
      } catch (e) {
        console.debug('No server-side /cart endpoint or failed to load; continuing with local cart', e?.message || e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="container-responsive py-8">
      <h1 className="mb-4 text-2xl font-bold">Your Cart</h1>
      {loading ? (
        <div>Loading...</div>
      ) : items.length === 0 ? (
        <div className="rounded-md border p-6 text-center">
          <p>Your cart is empty.</p>
          <Link to="/" className="btn-primary mt-4 inline-block">Continue Shopping</Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
          <div className="space-y-3">
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>
          <aside className="h-fit rounded-lg border p-4">
            <h2 className="mb-2 text-lg font-semibold">Order Summary</h2>
            <div className="flex items-center justify-between">
              <span>Total</span>
              <span className="text-xl font-bold">${total.toFixed(2)}</span>
            </div>
            <div className="mt-4 grid gap-2">
              <Link to="/" className="rounded-md border px-4 py-2 text-center hover:bg-gray-50">Continue Shopping</Link>
              <button className="btn-primary w-full" onClick={() => navigate('/checkout')}>Proceed to Checkout</button>
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}



