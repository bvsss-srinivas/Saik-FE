import React from 'react'
import { useCart } from '../context/CartContext.jsx'
import resolveImage from '../services/image.js'

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart()
  return (
    <div className="grid grid-cols-[80px,1fr,auto] items-center gap-4 rounded-md border p-3 sm:grid-cols-[100px,1fr,auto]">
      <img src={resolveImage(item.image || item.imageUrl)} alt={item.name} className="h-16 w-16 rounded object-cover sm:h-20 sm:w-20" />
      <div>
        <div className="font-medium">{item.name}</div>
        <div className="text-sm text-gray-600">${(item.price || 0).toFixed(2)}</div>
        <div className="mt-2 inline-flex items-center gap-2">
          <button className="rounded border px-2" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
          <span>{item.quantity}</span>
          <button className="rounded border px-2" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <div className="font-semibold">${(item.price * item.quantity).toFixed(2)}</div>
        <button className="text-sm text-red-600 hover:underline" onClick={() => removeFromCart(item.id)}>Remove</button>
      </div>
    </div>
  )
}



