import React, { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import ProductCard from '../components/ProductCard.jsx'
import api from '../services/api.js'
import featuredProducts from '../data/products.json'

export default function Home() {
  const [products, setProducts] = useState([])
  const [banners, setBanners] = useState([])
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const cat = params.get('cat')
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 20

  useEffect(() => {
    const load = async () => {
      try {
        if (cat && cat !== 'offers') {
          // Try a few casing variants to match backend data (some rows use 'Men'/'Home')
          const variants = [
            // capitalize first letter (Men, Women, Home, Electronics)
            cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase(),
            // lowercase variant (men, women, electronics, home)
            cat.toLowerCase(),
          ]

          let got = null
          for (const v of variants) {
            try {
              const res = await api.get(`/products/category/${v}`)
              // accept either array or page.content
              const payload = res.data
              const list = Array.isArray(payload) ? payload : (payload?.content || [])
              console.debug(`[Home] category attempt '${v}' returned ${list?.length || 0} items`)
              if (list && list.length > 0) {
                got = list
                break
              }
            } catch (err) {
              console.debug(`[Home] category attempt '${v}' failed:`, err?.response?.status || err.message)
            }
          }

      if (got) {
        // normalize product shape from backend (imageUrl -> image, ensure numeric price)
        const normalized = got.map((p) => ({ ...p, image: p.image || p.imageUrl, price: typeof p.price === 'string' ? Number(p.price) : p.price }))
        setProducts(normalized)
            return
          }

          // fallback: fetch a large page of products and filter client-side case-insensitively
          try {
            const all = await api.get('/products?page=0&size=1000')
            const payload = all.data
            const list = Array.isArray(payload) ? payload : (payload?.content || [])
            console.debug('[Home] fallback fetched', list.length, 'products; filtering by category', cat)
            const wanted = String(cat).toLowerCase()
            const filteredList = list.filter((p) => (p.category || '').toString().toLowerCase().includes(wanted))
            const normalized = filteredList.map((p) => ({ ...p, image: p.image || p.imageUrl, price: typeof p.price === 'string' ? Number(p.price) : p.price }))
            setProducts(normalized)
            return
          } catch (err) {
            console.error('Fallback load failed', err)
          }
        }

        // default: show a random mix of all products on home
        try {
          const res = await api.get('/products?page=0&size=1000')
          const payload = res.data
          const list = Array.isArray(payload) ? payload : (payload?.content || [])
          // normalize shape and ensure numeric price
          const normalized = list.map((p) => ({ ...p, image: p.image || p.imageUrl, price: typeof p.price === 'string' ? Number(p.price) : p.price }))
          // shuffle list (Fisher-Yates)
          for (let i = normalized.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            const tmp = normalized[i]
            normalized[i] = normalized[j]
            normalized[j] = tmp
          }
          setProducts(normalized)
        } catch (err) {
          console.debug('Failed to load all products for home, falling back to featured:', err)
          const res2 = await api.get('/products/featured')
          const featured = Array.isArray(res2.data) ? res2.data : (res2.data?.content || res2.data || [])
          const normalizedFeatured = featured.map((p) => ({ ...p, image: p.image || p.imageUrl, price: typeof p.price === 'string' ? Number(p.price) : p.price }))
          setProducts(normalizedFeatured)
        }
      } catch (e) {
        console.error('Failed to load products for home:', e)
      }
    }
    load()
  }, [cat])

  useEffect(() => {
    // banners could be fetched from an API; fallback to using a few featured product images
    const loadBanners = async () => {
      const mockBanners = [
        { id: 'b1', title: 'New arrivals', image: featuredProducts[0]?.image },
        { id: 'b2', title: 'Summer sale', image: featuredProducts[2]?.image },
      ]
      try {
        const res = await api.get('/banners')
        setBanners(res.data)
      } catch (e) {
        setBanners(mockBanners)
      }
    }
    loadBanners()
  }, [])

  const filtered = useMemo(() => {
    if (!cat) return products
    if (cat === 'offers') return products.filter((p) => p.isOffer)
    // case-insensitive category match to tolerate DB capitalization like 'Men' vs URL 'men'
    const wanted = String(cat).toLowerCase()
    return products.filter((p) => (p.category || '').toString().toLowerCase() === wanted)
  }, [products, cat])

  // visible products for pagination (client-side)
  const visible = filtered.slice(0, page * PAGE_SIZE)
  const hasMore = visible.length < filtered.length

  return (
    <div>
      <section className="bg-gradient-to-r from-primary-50 to-white">
        <div className="container-responsive py-10">
          <div className="rounded-2xl bg-white p-6 shadow-lg md:p-10">
            {/* Banner carousel */}
            <div className="relative overflow-hidden rounded-lg">
              <div className="flex transition-transform duration-500" style={{ transform: `translateX(0%)` }}>
                {banners.map((b, i) => (
                  <div key={b.id} className="min-w-full">
                    <div className="grid gap-6 items-center md:grid-cols-2 p-6 md:p-10">
                      <div className="space-y-4">
                        <h1 className="text-2xl md:text-3xl font-extrabold leading-tight">{b.title}</h1>
                        <p className="text-gray-600 max-w-xl">Check out the latest from our collection.</p>
                        <div className="flex gap-3 pt-2">
                          <a href="/" className="btn-primary">Shop now</a>
                          <a href="/" className="btn-ghost">Browse categories</a>
                        </div>
                      </div>
                      <div className="flex items-center justify-center">
                        <img src={b.image} alt={b.title} className="mx-auto h-40 w-40 object-cover rounded-md" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="container-responsive py-8">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold">Featured Products</h3>
        </div>
        {filtered.length === 0 ? (
          <div className="rounded border p-8 text-center text-gray-600">No products found for this filter.</div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {visible.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
            {hasMore && (
              <div className="mt-6 flex justify-center">
                <button className="btn-ghost" onClick={() => setPage((s) => s + 1)}>Load more</button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  )
}


