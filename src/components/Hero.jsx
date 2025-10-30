import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import VideoPlayer from './VideoPlayer'

const Hero = () => {
  const { t } = useTranslation()
  const [currentSlide, setCurrentSlide] = useState(0)
  
  const images = [
    '/images/hero-bg-1.png',
    '/images/hero-bg-2.png',
    '/images/hero-bg-3.png'
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length)
  }

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  // Auto-play carousel every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 5000)

    return () => clearInterval(interval)
  }, [currentSlide])

  return (
    <section className="relative h-screen w-full overflow-hidden mt-16">
      {/* Background Image Carousel */}
      <div className="absolute inset-0">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={image}
              alt={`Hero ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30"></div>
          </div>
        ))}
      </div>

      {/* Content Container */}
      <div className="relative h-full flex items-center justify-center sm:justify-end px-4 sm:px-8 lg:px-16 xl:px-24 pb-32">
        {/* Right Side: Hero Text */}
        <div className="text-center sm:text-right text-white max-w-2xl z-10 mb-20 px-4">
          {/* Top Red Line */}
          <div className="flex justify-center sm:justify-end mb-3 sm:mb-4">
            <div className="w-24 sm:w-32 lg:w-48 h-0.5 sm:h-1 bg-red-600"></div>
          </div>

          {/* Main Heading */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light leading-tight mb-4 sm:mb-6">
            {t('hero.title')}<br />
            {t('hero.subtitle')}
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base md:text-lg lg:text-xl font-light mb-3 sm:mb-4 opacity-95">
            {t('hero.description')}
          </p>

          {/* Bottom Red Line */}
          <div className="flex justify-center sm:justify-end">
            <div className="w-16 sm:w-24 lg:w-32 h-0.5 bg-red-600"></div>
          </div>
        </div>
      </div>

      {/* Left Side: Explore Products Button */}
      <div className="absolute left-4 sm:left-8 lg:left-16 bottom-24 sm:bottom-32 lg:bottom-40 z-20">
        <Link
          to="/products"
          className="px-6 py-2.5 sm:px-8 sm:py-3 lg:px-10 lg:py-4 border-2 border-white rounded-full text-white font-medium text-xs sm:text-sm lg:text-base hover:bg-white hover:text-black transition-all duration-300 inline-block shadow-lg"
        >
          {t('hero.exploreProducts')}
        </Link>
      </div>

      {/* Left Side: Carousel Dots */}
      <div className="absolute left-3 sm:left-8 lg:left-16 top-1/2 transform -translate-y-1/2 z-20 flex flex-col space-y-2 sm:space-y-3">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-red-600 scale-125'
                : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Bottom Right: Video Thumbnail */}
      <div className="absolute bottom-20 right-4 sm:bottom-8 sm:right-8 lg:bottom-16 lg:right-16 z-20">
        <VideoPlayer className="w-48 h-28 sm:w-64 sm:h-36 lg:w-80 lg:h-44 shadow-2xl" />
      </div>

      {/* Bottom Center: Scroll Down Arrow */}
      <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 z-20">
        <a
          href="#about"
          className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-red-600 rounded-full hover:bg-red-700 transition-colors duration-300 animate-bounce shadow-lg"
        >
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </a>
      </div>
    </section>
  )
}

export default Hero