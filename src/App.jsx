import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import { ToastContainer } from 'react-toastify'
import Home from './pages/Home.jsx'
import ProductDetails from './pages/ProductDetails.jsx'
import Cart from './pages/Cart.jsx'
import Checkout from './pages/Checkout.jsx'
import Profile from './pages/Profile.jsx'
import Login from './pages/Login.jsx'
import SignUp from './pages/SignUp.jsx'
import OrderTracking from './pages/OrderTracking.jsx'
import Wishlist from './pages/Wishlist.jsx'
import EditProfile from './pages/EditProfile.jsx'
import Addresses from './pages/Addresses.jsx'
import OrderSuccess from './pages/OrderSuccess.jsx'
import Orders from './pages/Orders.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { WishlistProvider } from './context/WishlistContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import { AdminAuthProvider } from './context/AdminAuthContext.jsx'
import AdminLogin from './pages/admin/Login.jsx'
import AdminDashboard from './pages/admin/Dashboard.jsx'
import AdminProducts from './pages/admin/Products.jsx'
import AdminOrders from './pages/admin/Orders.jsx'
import AdminUsers from './pages/admin/Users.jsx'
import AdminReports from './pages/admin/Reports.jsx'
import ProtectedAdminRoute from './components/admin/ProtectedAdminRoute.jsx'

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">
                <ErrorBoundary>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/product/:id" element={<ProductDetails />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/profile/edit" element={<EditProfile />} />
                  <Route path="/profile/addresses" element={<Addresses />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/orders/track/:orderId" element={<OrderTracking />} />
                  <Route path="/orders/success/:orderId" element={<OrderSuccess />} />
                  
                    {/* Admin routes */}
                    <Route path="/admin/login" element={<AdminAuthProvider><AdminLogin /></AdminAuthProvider>} />
                    <Route path="/admin/*" element={<AdminAuthProvider><ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute></AdminAuthProvider>} />
                    <Route path="/admin/dashboard" element={<AdminAuthProvider><ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute></AdminAuthProvider>} />
                    <Route path="/admin/products" element={<AdminAuthProvider><ProtectedAdminRoute><AdminProducts /></ProtectedAdminRoute></AdminAuthProvider>} />
                    <Route path="/admin/orders" element={<AdminAuthProvider><ProtectedAdminRoute><AdminOrders /></ProtectedAdminRoute></AdminAuthProvider>} />
                    <Route path="/admin/users" element={<AdminAuthProvider><ProtectedAdminRoute><AdminUsers /></ProtectedAdminRoute></AdminAuthProvider>} />
                    <Route path="/admin/reports" element={<AdminAuthProvider><ProtectedAdminRoute><AdminReports /></ProtectedAdminRoute></AdminAuthProvider>} />
                </Routes>
                </ErrorBoundary>
              </main>
              <Footer />
              <ToastContainer />
            </div>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  )
}


