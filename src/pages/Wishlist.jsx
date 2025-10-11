import React from 'react'
import { Link } from 'react-router-dom'
import { useWishlist } from '../context/WishlistContext.jsx'
import resolveImage from '../services/image.js'
import { useCart } from '../context/CartContext.jsx'

export default function Wishlist() {
  const { items, removeFromWishlist } = useWishlist()
  const { addToCart } = useCart()

  return (
    <div className="container-responsive py-8">
      <h1 className="mb-4 text-2xl font-bold">My Wishlist</h1>
      {items.length === 0 ? (
        <div className="rounded border p-6 text-center text-gray-600">
          <div className="mb-2">No items in wishlist.</div>
          <Link to="/" className="btn-primary inline-block">Continue shopping</Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((p) => (
            <div key={p.id} className="flex items-center justify-between rounded border p-3">
              <div className="flex items-center gap-3">
                <Link to={`/product/${p.id}`} className="block h-16 w-16 flex-shrink-0">
                  <img src={resolveImage(p.image)} alt={p.name} className="h-16 w-16 rounded object-cover" />
                </Link>
                <div>
                  <Link to={`/product/${p.id}`} className="font-medium hover:underline">{p.name}</Link>
                  <div className="text-sm text-gray-600">${p.price.toFixed(2)}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="btn-primary" onClick={() => addToCart(p)}>Add to Cart</button>
                <button className="rounded-md border px-3 py-2" onClick={() => removeFromWishlist(p.id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}



