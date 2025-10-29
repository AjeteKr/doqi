import { useTranslation } from 'react-i18next'
import { CheckCircleIcon, LightBulbIcon, UserGroupIcon, SparklesIcon } from '@heroicons/react/24/outline'

// Import partner logos
import kastamonuLogo from '../assets/partners/kastamonu.png'
import puricelliLogo from '../assets/partners/puricelli.png'
import alvicLogo from '../assets/partners/alvic.png'
import alfaWoodLogo from '../assets/partners/alfa-wood-group.png'
import starwoodLogo from '../assets/partners/starwood.png'
import covestroLogo from '../assets/partners/covestro.png'
import boyutPlasticLogo from '../assets/partners/boyut-plastic.png'
import rubateksLogo from '../assets/partners/rubateks.png'
import carpenterLogo from '../assets/partners/carpenter.png'
import arkopaLogo from '../assets/partners/arkopa.png'
import comfytexLogo from '../assets/partners/comfytex.png'
import boyteksLogo from '../assets/partners/boyteks.png'
import apexLogo from '../assets/partners/apex.png'
import mitreApelLogo from '../assets/partners/mitre-apel.png'

const About = () => {
  const { t } = useTranslation()

  const partners = [
    { name: 'Kastamonu Entegre', logo: kastamonuLogo, url: 'https://www.kastamonuentegre.com/en' },
    { name: 'Puricelli Group', logo: puricelliLogo, url: 'https://www.puricelli-group.com/kitchenbath/' },
    { name: 'Alvic', logo: alvicLogo, url: 'https://alvic.com/en/' },
    { name: 'Alfa Wood Group', logo: alfaWoodLogo, url: 'https://alfawood.gr/en/' },
    { name: 'Starwood', logo: starwoodLogo, url: 'https://www.starwood.com.tr/en/' },
    { name: 'Covestro', logo: covestroLogo, url: 'https://www.covestro.com/en' },
    { name: 'Boyut Plastik', logo: boyutPlasticLogo, url: 'https://boyutplastik.com.tr/main-page' },
    { name: 'Rubateks', logo: rubateksLogo, url: 'https://rubateks.com.tr/' },
    { name: 'Carpenter', logo: carpenterLogo, url: 'https://carpenter.com/' },
    { name: 'Arkopa', logo: arkopaLogo, url: 'https://arkopa.com.tr/en/' },
    { name: 'Comfytex', logo: comfytexLogo, url: 'https://comfytex.com.tr/' },
    { name: 'Boyteks', logo: boyteksLogo, url: 'https://www.boyteks.com/en/home' },
    { name: 'Apex Adhesive', logo: apexLogo, url: 'https://apexadhesive.com/' },
    { name: 'Mitre Apel', logo: mitreApelLogo, url: 'https://mitreapel.ca/' }
  ]

  const values = [
    {
      icon: CheckCircleIcon,
      title: t('about.values.quality.title'),
      description: t('about.values.quality.description')
    },
    {
      icon: LightBulbIcon,
      title: t('about.values.innovation.title'),
      description: t('about.values.innovation.description')
    },
    {
      icon: UserGroupIcon,
      title: t('about.values.customer.title'),
      description: t('about.values.customer.description')
    },
    {
      icon: SparklesIcon,
      title: t('about.values.sustainability.title'),
      description: t('about.values.sustainability.description')
    }
  ]

  const stats = [
    { number: '99%', label: t('home.stat1Description') },
    { number: '5K+', label: t('home.stat2Description') },
    { number: '2.8M', label: t('home.stat3Description') }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-red-900 text-white py-24 lg:py-32">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
            {t('about.hero.title')}
          </h1>
          <p className="text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {t('about.hero.subtitle')}
          </p>
        </div>
      </div>

      {/* Story Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8">
                {t('about.story.title')}
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                {t('about.story.description')}
              </p>
              <div className="grid grid-cols-3 gap-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-4xl font-bold text-red-600 mb-2">
                      {stat.number}
                    </div>
                    <p className="text-sm text-gray-600">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-2xl p-8 lg:p-12">
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <span className="w-1 h-8 bg-red-600 mr-3"></span>
                    {t('about.mission.title')}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {t('about.mission.description')}
                  </p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <span className="w-1 h-8 bg-red-600 mr-3"></span>
                    {t('about.vision.title')}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {t('about.vision.description')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              {t('about.values.title')}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 rounded-full mb-6 group-hover:bg-red-600 transition-colors duration-300">
                  <value.icon className="w-8 h-8 text-red-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Manufacturing & Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                {t('about.factory.title')}
              </h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                {t('about.factory.description')}
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                {t('about.team.title')}
              </h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                {t('about.team.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              {t('about.partners.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('about.partners.subtitle')}
            </p>
            <div className="w-24 h-1 bg-red-600 mx-auto mt-6"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {partners.map((partner, index) => (
              <a
                key={index}
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center p-6 bg-white rounded-xl border-2 border-gray-100 hover:border-red-600 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                title={partner.name}
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="max-w-full max-h-20 object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Commitment Section */}
      <section className="py-20 bg-red-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-8">
            {t('about.commitment.title')}
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            {t('about.commitment.description')}
          </p>
        </div>
      </section>
    </div>
  )
}

export default About