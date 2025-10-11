import React from 'react'
import { Link, useParams } from 'react-router-dom'

export default function OrderSuccess() {
  const { orderId } = useParams()
  return (
    <div className="container-responsive py-16">
      <div className="mx-auto max-w-xl rounded-lg border p-8 text-center">
        <h1 className="mb-4 text-2xl font-bold">Order placed successfully</h1>
        <p className="mb-4 text-gray-600">Thank you for your purchase. Your order {orderId || 'ORD123'} has been received.</p>
        <Link to="/" className="btn-primary">Continue shopping</Link>
      </div>
    </div>
  )
}
