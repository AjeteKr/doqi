import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const NotFound = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const handleGoBack = () => {
    navigate(-1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center px-6 pt-24 relative overflow-hidden">
      
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 border-2 border-red-200/30 rounded-full"></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 border border-red-200/20 rounded-full"></div>
        <div className="absolute top-1/3 -right-32 w-64 h-64 border border-red-200/25 rounded-full"></div>
      </div>

      <div className="relative z-10 bg-white rounded-3xl shadow-xl border border-red-100/50 px-16 py-8 max-w-4xl w-full mx-auto text-center">
        
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex-shrink-0">
            <div className="relative">
              <img 
                src="/images/not-found.png" 
                alt="404"
                className="mx-auto w-64 h-48 object-contain drop-shadow-lg"
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'block'
                }}
              />
              
              <div 
                className="mx-auto w-64 h-48 items-center justify-center"
                style={{ display: 'none' }}
              >
                <div className="text-center">
                  <div className="relative mb-4">
                    <div className="w-24 h-12 bg-red-400 rounded-full mx-auto relative">
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 w-12 h-6 bg-red-300 rounded-full"></div>
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2">
                        <div className="w-1 h-4 bg-red-200 mx-auto"></div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="text-4xl">🪑</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center space-x-4 mt-4">
                    <div className="text-red-300 text-lg">🛋️</div>
                    <div className="text-red-300 text-lg">🏠</div>
                    <div className="text-red-300 text-lg">💡</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 text-left lg:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              {t('notFound.whoopsTitle')}
            </h1>

            <div className="mb-8">
              <p className="text-gray-600 text-lg mb-2">
                {t('notFound.pageNotFoundMessage')}
              </p>
              <p className="text-gray-500 text-base">
                {t('notFound.suggestHome')}
              </p>
            </div>

            <button
              onClick={handleGoBack}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              {t('notFound.backToHome')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound
