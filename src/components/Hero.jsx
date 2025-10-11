import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import VideoPlayer from './VideoPlayer'
import ImageCarousel from './ImageCarousel'

const Hero = () => {
  const { t } = useTranslation()

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* Image Carousel Background */}
        <ImageCarousel 
          images={[
            '/images/hero-bg-1.jpg',
            '/images/hero-bg-2.jpg',
            '/images/hero-bg-3.jpg'
          ]}
          autoPlay={true}
          autoPlayInterval={6000}
          className="absolute inset-0"
        />

        {/* Content Container */}
        <div className="relative z-30 h-full flex items-center justify-end pr-8 lg:pr-16">
          <div className="text-right text-white max-w-2xl bg-black/20 p-4 rounded-lg backdrop-blur-sm">
            {/* Red Line Above Title */}
            <div className="w-76 h-2 bg-red-600 mb-4 ml-auto"></div>
            
            {/* Main Title */}
            <h1 className="text-3xl lg:text-5xl xl:text-6xl font-normal leading-tight mb-6 tracking-tight">
              {t('hero.title')}
              <br />
              {t('hero.subtitle')}
            </h1>

            {/* Red Line After Title */}
            <div className="w-38 h-1 bg-red-600 mb-8 ml-auto"></div>

            {/* Subtitle */}
            <p className="text-lg lg:text-2xl xl:text-3xl font-light mb-12 leading-relaxed tracking-wide opacity-90">
              {t('hero.description')}
            </p>
          </div>
        </div>

        {/* Left Side Elements */}
        <div className="absolute left-4 lg:left-12 bottom-32 lg:bottom-40 z-30">
          {/* CTA Buttons moved to bottom-left */}

          {/* CTA Button */}
          <Link
            to="/products"
            className="block w-64 h-16 border-2 border-white rounded-full flex items-center justify-center text-white font-normal text-xl tracking-wide hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105"
          >
            {t('hero.exploreProducts')}
          </Link>

        </div>

        {/* Video Glassmorphism Card */}
        <div className="absolute bottom-8 right-8 lg:bottom-16 lg:right-16 z-30">
          <VideoPlayer />
        </div>


      </section>




    </>
  )
}

export default Hero