import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useWishlist } from '../context/WishlistContext.jsx'
import resolveImage from '../services/image.js'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isWishlisted } = useWishlist()
  const wished = isWishlisted(product.id)
  return (
    <div className="card">
      <Link to={`/product/${product.id}`} className="block">
      <img src={resolveImage(product.image || product.imageUrl)} alt={product.name} className="h-48 w-full rounded-t-lg object-cover" />
        </Link>
      <div className="space-y-2 p-4">
        <Link to={`/product/${product.id}`} className="line-clamp-1 font-medium hover:underline">
          {product.name}
        </Link>
        <div className="text-lg font-semibold">${product.price.toFixed(2)}</div>
        <div className="flex gap-2">
          <button className="btn-primary" onClick={() => addToCart(product)}>
            Add to Cart
          </button>
          {wished ? (
            <button className="btn-ghost text-red-600" onClick={() => removeFromWishlist(product.id)}>
              ♥ Saved
            </button>
          ) : (
            <button className="btn-ghost" onClick={() => addToWishlist(product)}>
              ♥ Wishlist
            </button>
          )}
        </div>
      </div>
    </div>
  )
}


