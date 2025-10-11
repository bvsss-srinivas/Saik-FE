import React from 'react'

const steps = ['Order Placed', 'Shipped', 'Out for Delivery', 'Delivered']

export default function OrderStatus({ current = 1 }) {
  return (
    <div className="container-responsive py-6">
      <ol className="flex items-center">
        {steps.map((label, idx) => {
          const active = idx <= current
          return (
            <li key={label} className="flex w-full items-center">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${active ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                {idx + 1}
              </div>
              {idx < steps.length - 1 && (
                <div className={`h-1 w-full ${idx < current ? 'bg-primary-600' : 'bg-gray-200'}`}></div>
              )}
            </li>
          )
        })}
      </ol>
      <div className="mt-4 grid grid-cols-4 text-center text-sm">
        {steps.map((label, idx) => (
          <div key={label} className={`${idx <= current ? 'text-primary-700' : 'text-gray-500'}`}>{label}</div>
        ))}
      </div>
    </div>
  )
}



