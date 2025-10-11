import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import api from '../services/api.js'
import { useWishlist } from '../context/WishlistContext.jsx'
import featuredProducts from '../data/products.json'
import ProductCard from '../components/ProductCard.jsx'
import resolveImage from '../services/image.js'

export default function ProductDetails() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isWishlisted } = useWishlist()
  const [product, setProduct] = useState(null)
  const [qty, setQty] = useState(1)
  const [related, setRelated] = useState([])

  useEffect(() => {
    const load = async () => {
      const current = featuredProducts.find((p) => String(p.id) === String(id)) || featuredProducts[0]
      const res = await api.get(`/products/${id}`)
  // normalize product shape (imageUrl -> image)
  const prod = { ...res.data, image: res.data.image || res.data.imageUrl, price: typeof res.data.price === 'string' ? Number(res.data.price) : res.data.price }
  setProduct(prod)
  const rel = featuredProducts.filter((p) => p.id !== res.data.id).slice(0, 4)
  const relRes = await api.get(`/products/related/${id}`)
  const relatedNormalized = relRes.data.map((p) => ({ ...p, image: p.image || p.imageUrl, price: typeof p.price === 'string' ? Number(p.price) : p.price }))
  setRelated(relatedNormalized)
    }
    load()
  }, [id])

  if (!product) return null
  const wished = isWishlisted(product.id)

  return (
    <div className="container-responsive py-8">
      <div className="grid gap-6 md:grid-cols-2">
  <img src={resolveImage(product.image || product.imageUrl)} alt={product.name} className="h-80 w-full rounded-lg object-cover" />
        <div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <div className="mt-2 text-xl font-semibold">${product.price.toFixed(2)}</div>
          <div className="mt-3 text-gray-600">{product.description || 'Great product with amazing features.'}</div>
          <div className="mt-4 flex items-center gap-3">
            <div className="inline-flex items-center gap-2">
              <button className="rounded border px-3" onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
              <span>{qty}</span>
              <button className="rounded border px-3" onClick={() => setQty(qty + 1)}>+</button>
            </div>
            <button className="btn-primary" onClick={() => addToCart(product, qty)}>Add to Cart</button>
            {wished ? (
              <button className="rounded-md border px-3 py-2 text-red-600" onClick={() => removeFromWishlist(product.id)}>♥ Saved</button>
            ) : (
              <button className="rounded-md border px-3 py-2" onClick={() => addToWishlist(product)}>Add to Wishlist</button>
            )}
          </div>
        </div>
      </div>
      <div className="mt-10">
        <h3 className="mb-4 text-lg font-semibold">Related Products</h3>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  )
}


