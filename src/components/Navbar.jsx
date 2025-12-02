import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useFavorites } from '../context/FavoritesContext'
import LanguageSwitcher from './LanguageSwitcher'

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { t } = useTranslation()
  const { favoritesCount } = useFavorites()

  return (
    <nav className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side: Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="flex items-center space-x-2">
                <img 
                  src="/images/doqi-logo.png" 
                  alt="DoqiSHPK Logo" 
                  className="h-10 w-auto"
                />
              </div>
            </Link>
          </div>

          {/* Center: Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-10">
            <Link 
              to="/" 
              className="text-gray-800 hover:text-red-600 text-base font-medium transition-colors"
            >
              {t('nav.home')}
            </Link>
            <Link 
              to="/about" 
              className="text-gray-800 hover:text-red-600 text-base font-medium transition-colors"
            >
              {t('nav.about')}
            </Link>
            <Link 
              to="/products" 
              className="text-gray-800 hover:text-red-600 text-base font-medium transition-colors"
            >
              {t('nav.products')}
            </Link>
            <Link 
              to="/contact" 
              className="text-gray-800 hover:text-red-600 text-base font-medium transition-colors"
            >
              {t('nav.contact')}
            </Link>
          </div>

          {/* Right side elements */}
          <div className="flex items-center space-x-6">
            <Link 
              to="/starflex" 
              className="hidden lg:flex flex-col items-center group"
            >
              <img src="/images/starflex-logo.png" alt="StarFlex Logo" className="h-12 w-auto group-hover:opacity-80 transition-opacity" />
              <span className="text-[8px] text-gray-600 uppercase tracking-wide font-medium -mt-0.5">
                {t('starflex.mattressProducer')}
              </span>
            </Link>
            
            <div className="hidden lg:flex items-center space-x-5">
              {/* Favorites/Wishlist Icon with Counter */}
              <Link 
                to="/favorites" 
                className="relative text-gray-700 hover:text-red-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {favoritesCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {favoritesCount}
                  </span>
                )}
              </Link>

              {/* Search Icon */}
              <Link 
                to="/products" 
                className="text-gray-700 hover:text-red-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </Link>

              {/* Language Selector */}
              <LanguageSwitcher className="flex" />
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-700 hover:text-gray-900 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-2">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-red-600 px-3 py-2 text-sm font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('nav.home')}
              </Link>
              <Link 
                to="/about" 
                className="text-gray-700 hover:text-red-600 px-3 py-2 text-sm font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('nav.about')}
              </Link>
              <Link 
                to="/products" 
                className="text-gray-700 hover:text-red-600 px-3 py-2 text-sm font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('nav.products')}
              </Link>
              <Link 
                to="/contact" 
                className="text-gray-700 hover:text-red-600 px-3 py-2 text-sm font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('nav.contact')}
              </Link>
              <Link 
                to="/starflex" 
                className="text-red-600 hover:text-red-700 px-3 py-2 text-sm font-medium flex items-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <img src="/images/starflex-logo.png" alt="StarFlex Logo" className="h-6 w-auto" />
              </Link>
              <div className="px-3 py-2 flex items-center space-x-4">
                <Link 
                  to="/favorites" 
                  className="text-gray-700 hover:text-red-600 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </Link>
                <Link 
                  to="/products" 
                  className="text-gray-700 hover:text-red-600 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </Link>
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar