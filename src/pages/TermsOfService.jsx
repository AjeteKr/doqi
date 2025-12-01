import { useTranslation } from 'react-i18next'
import { 
  DocumentTextIcon, 
  ShieldCheckIcon, 
  ScaleIcon,
  GlobeAltIcon,
  ExclamationTriangleIcon,
  PencilSquareIcon,
  EnvelopeIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline'

const TermsOfService = () => {
  const { t } = useTranslation()

  const sections = [
    {
      icon: InformationCircleIcon,
      title: t('terms.generalInfo.title'),
      content: t('terms.generalInfo.content')
    },
    {
      icon: GlobeAltIcon,
      title: t('terms.useOfWebsite.title'),
      content: t('terms.useOfWebsite.content')
    },
    {
      icon: ShieldCheckIcon,
      title: t('terms.intellectualProperty.title'),
      content: t('terms.intellectualProperty.content')
    },
    {
      icon: DocumentTextIcon,
      title: t('terms.accuracyOfInfo.title'),
      content: t('terms.accuracyOfInfo.content')
    },
    {
      icon: ScaleIcon,
      title: t('terms.linksToOtherSites.title'),
      content: t('terms.linksToOtherSites.content')
    },
    {
      icon: ExclamationTriangleIcon,
      title: t('terms.limitationOfLiability.title'),
      content: t('terms.limitationOfLiability.content')
    },
    {
      icon: PencilSquareIcon,
      title: t('terms.changesToTerms.title'),
      content: t('terms.changesToTerms.content')
    },
    {
      icon: EnvelopeIcon,
      title: t('terms.contact.title'),
      content: t('terms.contact.content')
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-red-600 to-red-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
                <ScaleIcon className="h-16 w-16 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t('terms.title')}
            </h1>
            <p className="text-xl text-red-100 max-w-2xl mx-auto">
              {t('terms.subtitle')}
            </p>
            <div className="mt-6 inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
              <span className="text-sm font-medium">{t('terms.lastUpdated')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Introduction */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
          <p className="text-gray-700 text-lg leading-relaxed">
            {t('terms.introduction')}
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => {
            const IconComponent = section.icon
            return (
              <div 
                key={index}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <div className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="p-3 bg-gradient-to-br from-red-50 to-red-100 rounded-xl group-hover:from-red-100 group-hover:to-red-200 transition-all duration-300">
                        <IconComponent className="h-8 w-8 text-red-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                        <span className="bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                          {index + 1}. {section.title}
                        </span>
                      </h2>
                      <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {section.content}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 bg-gradient-to-r from-red-600 to-red-700 rounded-2xl shadow-xl p-8 text-white text-center">
          <EnvelopeIcon className="h-12 w-12 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-3">{t('terms.questionsTitle')}</h3>
          <p className="text-red-100 mb-6 max-w-2xl mx-auto">
            {t('terms.questionsText')}
          </p>
          <a 
            href="mailto:info@doqi-ks.com"
            className="inline-flex items-center px-6 py-3 bg-white text-red-600 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg"
          >
            <EnvelopeIcon className="h-5 w-5 mr-2" />
            info@doqi-ks.com
          </a>
        </div>
      </div>
    </div>
  )
}

export default TermsOfService
