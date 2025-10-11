import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './LanguageSwitcher'

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { t } = useTranslation()

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side: Mobile menu button + Logo */}
          <div className="flex items-center">
            {/* Mobile menu button */}
            <div className="md:hidden mr-4">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* Logo */}
            <Link to="/" className="flex items-center">
              <div className="flex items-center space-x-2">
                <img 
                  src="/src/assets/images/doqi-logo.png" 
                  alt="DOQI Logo" 
                  className="h-8 w-auto"
                />
              </div>
            </Link>
          </div>

          {/* Center: Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-gray-900 text-base font-medium transition-colors"
            >
              {t('nav.home')}
            </Link>
            <Link 
              to="/about" 
              className="text-gray-700 hover:text-gray-900 text-base font-medium transition-colors"
            >
              {t('nav.about')}
            </Link>
            <Link 
              to="/products" 
              className="text-gray-700 hover:text-red-900 text-base font-medium transition-colors"
            >
              {t('nav.products')}
            </Link>
            <Link 
              to="/contact" 
              className="text-gray-700 hover:text-gray-900 text-base font-medium transition-colors"
            >
              {t('nav.contact')}
            </Link>
          </div>

          {/* Right side elements */}
          <div className="flex items-center space-x-4">
            <Link 
              to="/starflex" 
              className="items-center text-white px-2 py-1 rounded text-xs font-bold hover:bg-red-200 transition-colors font-extrabold"
            >
              <img src="/src/assets/images/starflex-logo.png" alt="StarFlex Logo" className="h-16 w-auto" />
            </Link>

            {/* Icons */}
            <div className="flex items-center space-x-3">
              {/* Favorites/Wishlist Icon */}
              <button className="text-gray-500 hover:text-gray-700 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>

              {/* Search Icon */}
              <button className="text-gray-500 hover:text-gray-700 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Language Selector */}
              <LanguageSwitcher className="hidden sm:flex" />
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-2">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('nav.home')}
              </Link>
              <Link 
                to="/about" 
                className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('nav.about')}
              </Link>
              <Link 
                to="/products" 
                className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('nav.products')}
              </Link>
              <Link 
                to="/contact" 
                className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('nav.contact')}
              </Link>
              <Link 
                to="/starflex" 
                className="text-red-600 hover:text-red-700 px-3 py-2 text-sm font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                StarFlex
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar