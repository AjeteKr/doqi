import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { 
  MapPinIcon, 
  PhoneIcon, 
  EnvelopeIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

const Footer = () => {
  const { t } = useTranslation()
  const currentYear = new Date().getFullYear()
  const yearsInBusiness = currentYear - 1992

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-red-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Company Info & Logo */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                DOQI
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                {t('footer.tagline')}
              </p>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              {t('footer.description')}
            </p>
            
            {/* Experience Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-red-600/10 border border-red-600/30 rounded-lg">
              <span className="text-2xl font-bold text-red-500">{yearsInBusiness}+</span>
              <span className="ml-2 text-xs text-gray-300">{t('footer.yearsExperience')}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white relative inline-block">
              {t('footer.quickLinks')}
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-red-600"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-300 hover:text-red-500 transition-colors duration-300 flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-red-500 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-300 hover:text-red-500 transition-colors duration-300 flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-red-500 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                  {t('nav.products')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-red-500 transition-colors duration-300 flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-red-500 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-red-500 transition-colors duration-300 flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-red-500 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                  {t('nav.contact')}
                </Link>
              </li>
              <li>
                <Link to="/starflex" className="text-gray-300 hover:text-red-500 transition-colors duration-300 flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-red-500 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                  StarFlex
                </Link>
              </li>
            </ul>
          </div>

          {/* Product Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white relative inline-block">
              {t('footer.products')}
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-red-600"></span>
            </h3>
            <ul className="space-y-3">
              <li className="text-gray-300 text-sm hover:text-red-500 transition-colors cursor-pointer">
                {t('products.categories.compactHPL')}
              </li>
              <li className="text-gray-300 text-sm hover:text-red-500 transition-colors cursor-pointer">
                {t('products.categories.mattress')}
              </li>
              <li className="text-gray-300 text-sm hover:text-red-500 transition-colors cursor-pointer">
                {t('products.categories.sofaChair')}
              </li>
              <li className="text-gray-300 text-sm hover:text-red-500 transition-colors cursor-pointer">
                {t('products.categories.mdfChipBoard')}
              </li>
              <li className="text-gray-300 text-sm hover:text-red-500 transition-colors cursor-pointer">
                {t('products.categories.accessories')}
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white relative inline-block">
              {t('footer.contact')}
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-red-600"></span>
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-gray-300 text-sm">
                <MapPinIcon className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <span>{t('footer.address')}</span>
              </li>
              <li className="flex items-start space-x-3 text-gray-300 text-sm">
                <PhoneIcon className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <a href="tel:+38349123456" className="hover:text-red-500 transition-colors">
                    +383 49 123 456
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3 text-gray-300 text-sm">
                <EnvelopeIcon className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <a href="mailto:info@doqi.com" className="hover:text-red-500 transition-colors">
                  info@doqishpk.com
                </a>
              </li>
              <li className="flex items-start space-x-3 text-gray-300 text-sm">
                <ClockIcon className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p>{t('footer.workingHours')}</p>
                  <p className="text-xs text-gray-400">{t('footer.saturday')}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media & Partners Section */}
        <div className="border-t border-gray-700/50 pt-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            
            {/* Social Media */}
            <div>
              <p className="text-sm text-gray-400 mb-3 text-center md:text-left">
                {t('footer.followUs')}
              </p>
              <div className="flex gap-4">
                <a 
                  href="https://www.facebook.com/DOQI.SHPK/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-800 hover:bg-red-600 flex items-center justify-center transition-all duration-300 hover:scale-110"
                  aria-label="Facebook"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a 
                  href="https://www.instagram.com/doqi.ks/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-800 hover:bg-red-600 flex items-center justify-center transition-all duration-300 hover:scale-110"
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Partner Badge */}
            <div className="flex items-center gap-3 px-6 py-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
              <div className="text-right">
                <p className="text-xs text-gray-400">{t('footer.officialPartner')}</p>
                <p className="text-lg font-bold text-red-500">StarFlex</p>
              </div>
              <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700/50 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>
              © {currentYear} <span className="text-white font-semibold">DOQI SHPK</span>. {t('footer.rights')}
            </p>
            <div className="flex gap-6">
              <Link to="/privacy" className="hover:text-red-500 transition-colors">
                {t('footer.privacy')}
              </Link>
              <Link to="/terms" className="hover:text-red-500 transition-colors">
                {t('footer.terms')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer