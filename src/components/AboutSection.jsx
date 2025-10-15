import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const AboutSection = () => {
  const { t } = useTranslation()

  return (
    <section id="about" className="py-16 lg:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16 lg:mb-20">
          
          {/* Column 1: About Us Title + Heading */}
          <div className="space-y-6">
            {/* About Us Title */}
            <div className="flex items-center space-x-3">
              <h3 className="text-sm font-normal text-gray-700 whitespace-nowrap">
                {t('home.aboutUsTitle')}
              </h3>
              <div className="flex-grow h-px bg-gray-400"></div>
            </div>
            
            {/* Surfaces Made to Inspire Heading */}
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-normal text-black leading-tight">
              {t('home.aboutHeading')}
            </h2>
          </div>

          {/* Column 2: History + Mission/Vision */}
          <div className="space-y-8">
            {/* History (Company Description) */}
            <div className="space-y-4">
              <p className="text-xs text-black leading-relaxed text-justify">
                {t('home.aboutCompanyDescription')}
              </p>
              
              {/* Read More Link */}
              <Link
                to="/about"
                className="text-xs font-normal text-black hover:text-red-600 transition-colors inline-flex items-center"
              >
                ...{t('common.readMore')}
              </Link>
            </div>

            {/* Mission and Vision in 2 sub-columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Mission */}
              <div>
                <p className="text-xs text-black leading-relaxed text-justify">
                  {t('home.missionDescription')}
                </p>
              </div>

              {/* Vision */}
              <div>
                <p className="text-xs text-black leading-relaxed text-justify">
                  {t('home.visionDescription')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-12 pt-8">
          {/* Statistic 1: 99% */}
          <div className="text-center space-y-3">
            <div className="text-7xl sm:text-8xl lg:text-9xl font-bold text-black mb-3">
              99%
            </div>
            <p className="text-sm text-black leading-relaxed max-w-xs mx-auto">
              {t('home.stat1Description')}
            </p>
          </div>

          {/* Statistic 2: 5K+ */}
          <div className="text-center space-y-3">
            <div className="text-7xl sm:text-8xl lg:text-9xl font-bold text-black mb-3">
              5K<span className="text-6xl sm:text-7xl lg:text-8xl align-top ml-1">+</span>
            </div>
            <p className="text-sm text-black leading-relaxed max-w-xs mx-auto">
              {t('home.stat2Description')}
            </p>
          </div>

          {/* Statistic 3: 2.8M */}
          <div className="text-center space-y-3">
            <div className="text-7xl sm:text-8xl lg:text-9xl font-bold text-black mb-3">
              2.8M
            </div>
            <p className="text-sm text-black leading-relaxed max-w-xs mx-auto">
              {t('home.stat3Description')}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection
