import api from './api.js'

export const AdminApi = {
  login: async (payload) => {
    return api.post('/auth/login', payload)
  },
  getSummary: async () => {
    return api.get('/admin/overview')
  },
  getRecentOrders: async () => {
    return api.get('/admin/orders')
  },
  // fetch products with optional pagination; default to large page size for admin listing
  getProducts: async (page = 0, size = 1000) => {
    return api.get(`/products?page=${page}&size=${size}`)
  },
  createProduct: async (p) => {
    return api.post('/products', p)
  },
  updateProduct: async (id, p) => {
    return api.put(`/products/${id}`, p)
  },
  deleteProduct: async (id) => {
    return api.delete(`/products/${id}`)
  },
  getOrders: async () => {
    return api.get('/admin/orders')
  },
  updateOrderStatus: async (orderId, status) => {
    return api.put(`/admin/orders/${orderId}?status=${encodeURIComponent(status)}`)
  },
  getUsers: async () => {
    return api.get('/admin/users')
  },
  blockUser: async (id, blocked = true) => {
    // send desired blocked state as query param so backend can toggle appropriately
    return api.put(`/admin/users/${id}/block?blocked=${blocked}`)
  },
  getReports: async () => {
    return api.get('/admin/reports')
  },
}

export default AdminApi
