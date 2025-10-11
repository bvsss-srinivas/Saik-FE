import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import OrderStatus from '../components/OrderStatus.jsx'
import api from '../services/api.js'

export default function OrderTracking() {
  const { orderId } = useParams()
  const [step, setStep] = useState(1)

  useEffect(() => {
    const load = async () => {
  const res = await api.get(`/orders/track/${orderId}`)
      setStep(res.data.step)
    }
    load()
  }, [orderId])

  return (
    <div>
      <div className="container-responsive py-8">
        <h1 className="mb-4 text-2xl font-bold">Track Order #{orderId}</h1>
      </div>
      <OrderStatus current={step} />
    </div>
  )
}



