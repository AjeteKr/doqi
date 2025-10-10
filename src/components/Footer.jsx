import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">DoqiSHPK</h3>
            <p className="text-gray-300 mb-4">
              High-quality furniture and mattress production in partnership with Starflex. 
              Combining comfort, durability, and style with modern technology.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-white">Home</Link></li>
              <li><Link to="/products" className="text-gray-300 hover:text-white">Products</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-white">About</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white">Contact</Link></li>
            </ul>
          </div>

          {/* Partners */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Partners</h4>
            <ul className="space-y-2">
              <li><Link to="/starflex" className="text-gray-300 hover:text-white">Starflex</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 DoqiSHPK. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer