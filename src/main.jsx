import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)

// global toast container for react-toastify
const rootEl = document.getElementById('root')
if (rootEl) {
  // append ToastContainer after initial render
  const container = document.createElement('div')
  container.id = 'toast-root'
  rootEl.appendChild(container)
}



