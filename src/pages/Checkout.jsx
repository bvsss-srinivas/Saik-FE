import React, { useState } from 'react'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { useNavigate } from 'react-router-dom'
import api from '../services/api.js'
import resolveImage from '../services/image.js'

export default function Checkout() {
  const { items, total, clearCart } = useCart()
  const { user } = useAuth()
  const [address, setAddress] = useState({ firstName: '', lastName: '', line1: '', line2: '', city: '', state: '', zip: '' })
  const [payment, setPayment] = useState('Card')
  const [shippingMethod, setShippingMethod] = useState('Standard')
  const [message, setMessage] = useState('')
  const toast = useToast()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)

  const placeOrder = async () => {
    const payload = { items, total, address, payment, shippingMethod }
    // prefer /orders/me to use authenticated user; fallback to /orders with userId
    // map client cart items to backend CartItemDTO shape: { productId, quantity }
    const itemsDto = items.map((i) => ({ productId: i.id, quantity: i.quantity }))
    let res = null
    try {
      res = await api.post('/orders/me', { items: itemsDto })
    } catch (e) {
      // fallback to anonymous order placement
      try {
        const body = { userId: user?.id || null, items: itemsDto }
        res = await api.post('/orders', body)
      } catch (err) {
        console.error('Failed to place order', err)
        try { toast?.showToast('Failed to place order', 'error') } catch (t) {}
        return
      }
    }
    // backend returns the saved order entity with id
    const orderId = res?.data?.id || res?.data?.orderId || 'ORD123'
    setMessage('Order placed successfully!')
    try { toast?.showToast('Order placed successfully', 'success') } catch (e) {}
    clearCart()
    navigate(`/orders/success/${orderId}`)
  }

  return (
    <div className="container-responsive py-8">
      <h1 className="mb-6 text-3xl font-extrabold">Checkout</h1>

      <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
        {/* Left: stepper + content */}
        <div className="flex gap-6">
          {/* Stepper */}
          <div className="w-12 flex flex-col items-center">
            {[1, 2, 3].map((n) => (
              <div key={n} className="flex flex-col items-center">
                <div className={`h-8 w-8 flex items-center justify-center rounded-full ${currentStep === n ? 'bg-primary-600 text-white' : 'bg-white border'}`}>{n}</div>
                {n < 3 && <div className="h-20 border-l"></div>}
              </div>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 space-y-6">
            {/* Shipping address */}
            <section className="rounded-lg border bg-white p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Shipping address</h2>
                <div className="text-sm text-gray-500">Step 1</div>
              </div>
              <p className="mt-2 text-sm text-gray-600">*Indicates required field</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <input className="input" placeholder="First name *" value={address.firstName} onChange={(e) => setAddress({ ...address, firstName: e.target.value })} />
                <input className="input" placeholder="Last name *" value={address.lastName} onChange={(e) => setAddress({ ...address, lastName: e.target.value })} />
                <input className="input sm:col-span-2" placeholder="Address 1 - street or P.O. box *" value={address.line1} onChange={(e) => setAddress({ ...address, line1: e.target.value })} />
                <input className="input sm:col-span-2" placeholder="Address 2 - apt, suite, floor" value={address.line2} onChange={(e) => setAddress({ ...address, line2: e.target.value })} />
                <input className="input" placeholder="Zip code *" value={address.zip} onChange={(e) => setAddress({ ...address, zip: e.target.value })} />
                <input className="input" placeholder="City *" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
                <select className="input" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })}>
                  <option value="">Select state</option>
                  <option value="AN">Andaman and Nicobar Islands</option>
                  <option value="AP">Andhra Pradesh</option>
                  <option value="AR">Arunachal Pradesh</option>
                  <option value="AS">Assam</option>
                  <option value="BR">Bihar</option>
                  <option value="CH">Chandigarh</option>
                  <option value="CT">Chhattisgarh</option>
                  <option value="DN">Dadra & Nagar Haveli and Daman & Diu</option>
                  <option value="DL">Delhi</option>
                  <option value="GA">Goa</option>
                  <option value="GJ">Gujarat</option>
                  <option value="HR">Haryana</option>
                  <option value="HP">Himachal Pradesh</option>
                  <option value="JK">Jammu and Kashmir</option>
                  <option value="JH">Jharkhand</option>
                  <option value="KA">Karnataka</option>
                  <option value="KL">Kerala</option>
                  <option value="LA">Ladakh</option>
                  <option value="LD">Lakshadweep</option>
                  <option value="MP">Madhya Pradesh</option>
                  <option value="MH">Maharashtra</option>
                  <option value="MN">Manipur</option>
                  <option value="ML">Meghalaya</option>
                  <option value="MZ">Mizoram</option>
                  <option value="NL">Nagaland</option>
                  <option value="OR">Odisha</option>
                  <option value="PY">Puducherry</option>
                  <option value="PB">Punjab</option>
                  <option value="RJ">Rajasthan</option>
                  <option value="SK">Sikkim</option>
                  <option value="TN">Tamil Nadu</option>
                  <option value="TG">Telangana</option>
                  <option value="TR">Tripura</option>
                  <option value="UP">Uttar Pradesh</option>
                  <option value="UT">Uttarakhand</option>
                  <option value="WB">West Bengal</option>
                </select>
                {/* Removed per-section continue button - actions handled from the summary panel */}
              </div>
            </section>

            {/* Shipping method */}
            <section className="rounded-lg border bg-white p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Shipping method</h2>
                <div className="text-sm text-gray-500">Step 2</div>
              </div>
              <div className="mt-4 space-y-3">
                {[
                  { id: 'Standard', label: 'Standard Shipping (3-5 days) - Free' },
                  { id: 'Express', label: 'Express (1-2 days) - $9.99' },
                ].map((s) => (
                  <label key={s.id} className="flex items-center gap-3 rounded-md border p-3">
                    <input type="radio" name="ship" checked={shippingMethod === s.id} onChange={() => setShippingMethod(s.id)} />
                    <div>
                      <div className="font-medium">{s.id}</div>
                      <div className="text-sm text-gray-600">{s.label}</div>
                    </div>
                  </label>
                ))}
                {/* Removed per-section continue button - actions handled from the summary panel */}
              </div>
            </section>

            {/* Payment */}
            <section className="rounded-lg border bg-white p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Payment</h2>
                <div className="text-sm text-gray-500">Step 3</div>
              </div>
              <div className="mt-4 space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <input className="input" placeholder="Card number" />
                  <input className="input" placeholder="Name on card" />
                  <input className="input" placeholder="MM/YY" />
                  <input className="input" placeholder="CVC" />
                </div>
                {/* Removed per-section continue button - actions handled from the summary panel */}
              </div>
            </section>

            {/* Review step removed - final action is in the summary panel */}
          </div>
        </div>

        {/* Right: summary / cart */}
        <aside className="h-fit rounded-lg border bg-white p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Summary</h3>
            <div className="text-sm text-gray-500">Order subtotal ({items.length} items)</div>
          </div>

          <div className="mb-3">
            <label className="text-sm text-gray-600">Promo code</label>
            <div className="mt-2 flex gap-2">
              <input className="input" placeholder="Enter code" />
              <button className="btn-primary">Apply</button>
            </div>
          </div>

          <div className="space-y-3 text-sm mb-4">
            {items.map((i) => (
              <div key={i.id} className="flex gap-3">
                <img src={i.image ? resolveImage(i.image) : '/vite.svg'} alt={i.name} className="h-16 w-16 rounded object-cover" />
                <div className="flex-1">
                  <div className="font-medium">{i.name}</div>
                  <div className="text-xs text-gray-600">Qty: {i.quantity}</div>
                </div>
                <div className="font-medium">${(i.price * i.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>

          <div className="border-t pt-3 space-y-2 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>${total.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{shippingMethod === 'Express' ? '$9.99' : 'FREE'}</span></div>
            <div className="flex justify-between font-semibold"><span>Total</span><span>${(total + (shippingMethod === 'Express' ? 9.99 : 0)).toFixed(2)}</span></div>
          </div>

          <div className="mt-4">
            <button className="btn-primary w-full" onClick={placeOrder} disabled={items.length === 0}>Place order</button>
            {message && <div className="mt-3 rounded-md bg-green-50 p-3 text-green-700">{message}</div>}
          </div>
        </aside>
      </div>
    </div>
  )
}



