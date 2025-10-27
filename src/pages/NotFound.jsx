import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const NotFound = () => {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-16 mt-16">
      <div className="max-w-4xl w-full text-center">
        {/* Animated 404 with furniture-themed illustration */}
        <div className="relative mb-8">
          {/* Main 404 text */}
          <div className="text-[120px] md:text-[180px] font-bold text-gray-200 leading-none select-none">
            404
          </div>
          
          {/* Animated furniture piece overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-bounce">
              {/* HPL Board/Furniture Icon SVG */}
              <svg 
                className="w-32 h-32 md:w-48 md:h-48 text-red-600 opacity-80"
                viewBox="0 0 200 200"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Stylized furniture/HPL board */}
                <rect x="40" y="60" width="120" height="80" rx="4" className="opacity-90"/>
                <rect x="50" y="70" width="100" height="60" rx="2" className="fill-red-500"/>
                <rect x="60" y="80" width="80" height="40" rx="2" className="fill-red-400"/>
                {/* Decorative lines representing wood grain/HPL texture */}
                <line x1="70" y1="85" x2="130" y2="85" stroke="white" strokeWidth="2" opacity="0.3"/>
                <line x1="70" y1="95" x2="130" y2="95" stroke="white" strokeWidth="2" opacity="0.3"/>
                <line x1="70" y1="105" x2="130" y2="105" stroke="white" strokeWidth="2" opacity="0.3"/>
                <line x1="70" y1="115" x2="130" y2="115" stroke="white" strokeWidth="2" opacity="0.3"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Error message */}
        <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">
          {t('notFound.title', 'Oops! Page Not Found')}
        </h1>
        
        <p className="text-lg md:text-xl text-gray-600 mb-3 max-w-2xl mx-auto">
          {t('notFound.description', "Looks like this page has been moved to our warehouse! The furniture might be here, but this page isn't.")}
        </p>
        
        <p className="text-base text-gray-500 mb-8">
          {t('notFound.helpText', "Don't worry, we'll help you find your way back to quality products.")}
        </p>

        {/* Interactive navigation cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-3xl mx-auto">
          {/* Home Card */}
          <Link 
            to="/"
            className="group bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-transparent hover:border-red-600"
          >
            <div className="text-4xl mb-3">🏠</div>
            <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-red-600 transition-colors">
              {t('notFound.homeButton', 'Back to Home')}
            </h3>
            <p className="text-sm text-gray-600">
              {t('notFound.homeDescription', 'Return to our homepage')}
            </p>
          </Link>

          {/* Products Card */}
          <Link 
            to="/products"
            className="group bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-transparent hover:border-red-600"
          >
            <div className="text-4xl mb-3">🛋️</div>
            <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-red-600 transition-colors">
              {t('notFound.productsButton', 'View Products')}
            </h3>
            <p className="text-sm text-gray-600">
              {t('notFound.productsDescription', 'Explore our furniture range')}
            </p>
          </Link>

          {/* Contact Card */}
          <Link 
            to="/contact"
            className="group bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-transparent hover:border-red-600"
          >
            <div className="text-4xl mb-3">📧</div>
            <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-red-600 transition-colors">
              {t('notFound.contactButton', 'Contact Us')}
            </h3>
            <p className="text-sm text-gray-600">
              {t('notFound.contactDescription', 'We\'re here to help')}
            </p>
          </Link>
        </div>

        {/* Fun fact or additional info */}
        <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-r-lg max-w-2xl mx-auto">
          <p className="text-sm text-gray-700">
            <span className="font-semibold text-red-600">
              {t('notFound.funFactLabel', 'Did you know?')}
            </span>{' '}
            {t('notFound.funFact', 'DoqiSHPK specializes in high-quality Compact HPL products and mattresses. Explore our collection to find the perfect piece for your space!')}
          </p>
        </div>

        {/* Keyboard shortcut hint */}
        <div className="mt-8 text-sm text-gray-500">
          <p>
            {t('notFound.keyboardHint', 'Press')} <kbd className="px-2 py-1 bg-gray-200 rounded text-xs font-mono">H</kbd> {t('notFound.keyboardHintAction', 'to go home')}
          </p>
        </div>
      </div>
    </div>
  )
}

// Keyboard shortcut handler
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'h' || e.key === 'H') {
      // Only trigger if we're on a 404 page (check if current path doesn't match any known routes)
      const currentPath = window.location.pathname
      const knownPaths = ['/', '/about', '/contact', '/products', '/product/']
      const isKnownPath = knownPaths.some(path => currentPath === path || currentPath.startsWith('/product/'))
      
      if (!isKnownPath) {
        window.location.href = '/'
      }
    }
  })
}

export default NotFound
