import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="mt-10 border-t bg-white">
      <div className="container-responsive grid gap-6 py-8 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <h3 className="mb-2 text-lg font-semibold">ShopX</h3>
          <p className="text-sm text-gray-600">Your modern online shopping destination.</p>
        </div>
        <div>
          <h4 className="mb-2 font-semibold">Company</h4>
          <ul className="space-y-1 text-sm text-gray-600">
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-2 font-semibold">Legal</h4>
          <ul className="space-y-1 text-sm text-gray-600">
            <li><Link to="/privacy">Privacy</Link></li>
            <li><Link to="/terms">Terms</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-2 font-semibold">Get updates</h4>
          <div className="flex overflow-hidden rounded-md border">
            <input className="w-full px-3 py-2 outline-none" placeholder="Email address" />
            <button className="bg-primary-600 px-3 text-white">Join</button>
          </div>
        </div>
      </div>
      <div className="border-t py-4 text-center text-sm text-gray-500">© {new Date().getFullYear()} ShopX. All rights reserved.</div>
    </footer>
  )
}



