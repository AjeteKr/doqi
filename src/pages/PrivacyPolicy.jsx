import { useTranslation } from 'react-i18next'
import { 
  ShieldCheckIcon, 
  InformationCircleIcon,
  CubeTransparentIcon,
  LinkIcon,
  LockClosedIcon,
  PencilSquareIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline'

const PrivacyPolicy = () => {
  const { t } = useTranslation()

  const sections = [
    {
      icon: InformationCircleIcon,
      title: t('privacy.infoWeCollect.title'),
      content: t('privacy.infoWeCollect.content')
    },
    {
      icon: CubeTransparentIcon,
      title: t('privacy.cookiesAnalytics.title'),
      content: t('privacy.cookiesAnalytics.content')
    },
    {
      icon: LinkIcon,
      title: t('privacy.linksToOtherSites.title'),
      content: t('privacy.linksToOtherSites.content')
    },
    {
      icon: LockClosedIcon,
      title: t('privacy.dataSecurity.title'),
      content: t('privacy.dataSecurity.content')
    },
    {
      icon: PencilSquareIcon,
      title: t('privacy.changesToPolicy.title'),
      content: t('privacy.changesToPolicy.content')
    },
    {
      icon: EnvelopeIcon,
      title: t('privacy.contact.title'),
      content: t('privacy.contact.content')
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
                <ShieldCheckIcon className="h-16 w-16 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t('privacy.title')}
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              {t('privacy.subtitle')}
            </p>
            <div className="mt-6 inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
              <span className="text-sm font-medium">{t('privacy.lastUpdated')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Introduction */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
          <p className="text-gray-700 text-lg leading-relaxed">
            {t('privacy.introduction')}
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
                      <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl group-hover:from-blue-100 group-hover:to-blue-200 transition-all duration-300">
                        <IconComponent className="h-8 w-8 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                        <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
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

        {/* Privacy Commitment */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-xl p-8 text-white">
          <div className="text-center">
            <ShieldCheckIcon className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-3">{t('privacy.commitmentTitle')}</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              {t('privacy.commitmentText')}
            </p>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-8 text-center border border-gray-100">
          <EnvelopeIcon className="h-12 w-12 mx-auto mb-4 text-blue-600" />
          <h3 className="text-2xl font-bold mb-3 text-gray-900">{t('privacy.questionsTitle')}</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            {t('privacy.questionsText')}
          </p>
          <a 
            href="mailto:info@doqi-ks.com"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg"
          >
            <EnvelopeIcon className="h-5 w-5 mr-2" />
            info@doqi-ks.com
          </a>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy
