import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'

const ToastContext = createContext(null)

let idCounter = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, type = 'info', ttl = 3500) => {
    // avoid adding duplicate toasts with same message+type
    let existingId = null
    setToasts((t) => {
      const found = t.find((x) => x.message === message && x.type === type)
      if (found) {
        existingId = found.id
        return t
      }
      const id = ++idCounter
      // schedule removal
      if (ttl > 0) {
        setTimeout(() => {
          setToasts((tt) => tt.filter((x) => x.id !== id))
        }, ttl)
      }
      return [...t, { id, message, type }]
    })
    return existingId
  }, [])

  const removeToast = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), [])

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed right-4 top-4 z-50 w-80 space-y-2">
        {toasts.map((t) => (
          <Toast key={t.id} toast={t} onClose={() => removeToast(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function Toast({ toast, onClose }) {
  const { message, type } = toast
  const base = 'rounded shadow p-3 flex items-start gap-3 border'
  const styles = {
    success: 'bg-green-50 text-green-800 border-green-100',
    error: 'bg-red-50 text-red-800 border-red-100',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-100',
    info: 'bg-blue-50 text-blue-800 border-blue-100',
  }
  return (
    <div className={`${base} ${styles[type] || styles.info}`}>
      <div className="flex-1 text-sm">{message}</div>
      <button className="text-xs opacity-70" onClick={onClose}>Dismiss</button>
    </div>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
