import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const categories = [
  { key: 'men', label: 'Men' },
  { key: 'women', label: 'Women' },
  { key: 'electronics', label: 'Electronics' },
  { key: 'home', label: 'Home' },
  { key: 'offers', label: 'Offers' },
]

export default function CategoryBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const active = params.get('cat') || 'all'

  const setCategory = (key) => {
    const next = new URLSearchParams(location.search)
    if (key === 'all') next.delete('cat')
    else next.set('cat', key)
    navigate({ pathname: '/', search: next.toString() })
  }

  const iconFor = (key) => {
    // returns a wrapped circular icon with centered white glyph
    const wrap = (bg, svg) => (
      <div className="h-9 w-9 flex-shrink-0 flex items-center justify-center rounded-full" style={{ background: bg }}>
        {svg}
      </div>
    )

    switch (key) {
      case 'men':
        // switched to a brighter blue for better contrast
        return wrap('#2563EB', (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 12a4 4 0 100-8 4 4 0 000 8z" fill="white"/><path d="M3 21c0-3.3 4.5-6 9-6s9 2.7 9 6" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        ))
      case 'women':
        return wrap('#EC4899', (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" fill="white"/><path d="M6 20c0-3 6-5 6-5s6 2 6 5" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        ))
      case 'electronics':
        return wrap('#06B6D4', (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="2" y="4" width="20" height="12" rx="1" stroke="white" strokeWidth="1.4"/><path d="M8 20h8" stroke="white" strokeWidth="1.4" strokeLinecap="round"/></svg>
        ))
      case 'home':
        return wrap('#10B981', (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 10.5L12 4l9 6.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1V10.5z" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        ))
      case 'offers':
        return wrap('#F59E0B', (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M2 7l10-5 10 5v10a1 1 0 01-1 1H3a1 1 0 01-1-1V7z" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="18" cy="7" r="2" fill="white"/></svg>
        ))
      default:
        return null
    }
  }

  return (
    <div className="border-t bg-white">
      <div className="container-responsive py-3">
        <div className="flex gap-3 overflow-x-auto">
          <button
            onClick={() => setCategory('all')}
            className={`flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 shadow-sm hover-lift ${active === 'all' ? 'bg-primary-600 text-white' : 'bg-white'}`}>
            <span className="text-sm font-medium">All</span>
          </button>

          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => setCategory(c.key)}
              className={`flex items-center gap-3 whitespace-nowrap rounded-full px-4 py-2 shadow-sm hover-lift ${active === c.key ? 'bg-primary-600 text-white' : 'bg-white'}`}>
              <span className="flex items-center">{iconFor(c.key)}</span>
              <span className="text-sm font-medium">{c.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}


