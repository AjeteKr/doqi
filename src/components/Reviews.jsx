import { useState, useEffect } from 'react'
import { ChevronLeftIcon, ChevronRightIcon, StarIcon, CheckBadgeIcon } from '@heroicons/react/24/solid'
import { useTranslation } from 'react-i18next'

const Reviews = ({ reviews = [] }) => {
  const { t } = useTranslation()
  const [currentIndex, setCurrentIndex] = useState(0)

  // Sample reviews if none provided
  const sampleReviews = [
    {
      id: 1,
      name: t('reviews.review1.name'),
      role: t('reviews.review1.role'),
      comment: t('reviews.review1.comment'),
      rating: 5,
      date: t('reviews.review1.date'),
      verified: true,
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=400&fit=crop&crop=face"
    },
    {
      id: 2,
      name: t('reviews.review2.name'),
      role: t('reviews.review2.role'),
      comment: t('reviews.review2.comment'),
      rating: 5,
      date: t('reviews.review2.date'),
      verified: true,
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=400&fit=crop&crop=face"
    },
    {
      id: 3,
      name: t('reviews.review3.name'),
      role: t('reviews.review3.role'),
      comment: t('reviews.review3.comment'),
      rating: 5,
      date: t('reviews.review3.date'),
      verified: true,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=400&fit=crop&crop=face"
    },
    {
      id: 4,
      name: t('reviews.review4.name'),
      role: t('reviews.review4.role'),
      comment: t('reviews.review4.comment'),
      rating: 5,
      date: t('reviews.review4.date'),
      verified: true,
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=400&fit=crop&crop=face"
    }
  ]

  const displayReviews = reviews.length > 0 ? reviews : sampleReviews

  // Auto-rotate every 8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === displayReviews.length - 1 ? 0 : prevIndex + 1
      )
    }, 8000)

    return () => clearInterval(timer)
  }, [displayReviews.length])

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? displayReviews.length - 1 : prevIndex - 1
    )
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === displayReviews.length - 1 ? 0 : prevIndex + 1
    )
  }

  const currentReview = displayReviews[currentIndex]

  // Get next two reviewers for the thumbnail preview
  const getOtherReviewers = () => {
    const others = []
    for (let i = 1; i <= 2; i++) {
      const nextIndex = (currentIndex + i) % displayReviews.length
      others.push(displayReviews[nextIndex])
    }
    return others
  }

  const otherReviewers = getOtherReviewers()

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {t('reviews.title')}
          </h2>
          <p className="text-base text-gray-600">
            {t('reviews.subtitle')}
          </p>
        </div>

        {/* Review Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Quote and Rating */}
          <div className="lg:col-span-3 space-y-4">
            <div className="text-red-600 text-7xl font-serif leading-none mb-2">"</div>
            
            {/* Star Rating */}
            <div className="flex gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <StarIcon 
                  key={i} 
                  className={`w-5 h-5 ${i < currentReview.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                />
              ))}
            </div>
            
            <p className="text-gray-900 text-sm leading-relaxed text-right italic">
              {currentReview.comment}
            </p>
          </div>

          {/* Center: Main Image with Verified Badge */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative">
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-xl w-64 h-80">
                <img
                  src={currentReview.image}
                  alt={currentReview.name}
                  className="w-full h-full object-cover transition-all duration-700 ease-in-out"
                  key={currentReview.id}
                />
              </div>
              {/* Verified Badge */}
              {currentReview.verified && (
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-white rounded-full px-4 py-2 shadow-lg flex items-center gap-2">
                  <CheckBadgeIcon className="w-5 h-5 text-blue-500" />
                  <span className="text-xs font-semibold text-gray-700">{t('reviews.verified')}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Thumbnails and Customer Info */}
          <div className="lg:col-span-4 flex flex-col items-start space-y-6">
            {/* Other Reviewers Thumbnails */}
            <div className="flex gap-4">
              {otherReviewers.map((reviewer, idx) => (
                <div 
                  key={`${reviewer.id}-preview`}
                  className="relative rounded-2xl overflow-hidden shadow-lg w-32 h-24 cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0 group"
                  onClick={() => setCurrentIndex((currentIndex + idx + 1) % displayReviews.length)}
                >
                  <img
                    src={reviewer.image}
                    alt={reviewer.name}
                    className="w-full h-full object-cover transition-all duration-700 ease-in-out"
                  />
                  {/* Hover overlay with name */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-white text-xs font-semibold text-center px-2">{reviewer.name}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Customer Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-gray-900">{currentReview.name}</h3>
                {currentReview.verified && (
                  <CheckBadgeIcon className="w-5 h-5 text-blue-500" title={t('reviews.verified')} />
                )}
              </div>
              <p className="text-sm text-gray-600">{currentReview.role}</p>
              <p className="text-xs text-gray-500">{currentReview.date}</p>
            </div>

            {/* Review Stats */}
            <div className="bg-gray-100 rounded-lg p-4 w-full">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-600 font-medium">{t('reviews.rating')}</span>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon 
                      key={i} 
                      className={`w-4 h-4 ${i < currentReview.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
              </div>
              <div className="text-xs text-gray-500">
                {t('reviews.reviewedOn')} {currentReview.date}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <div className="flex justify-center items-center gap-4 mt-10">
          <button
            onClick={handlePrevious}
            className="p-3 rounded-full border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
            aria-label="Previous review"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="p-3 rounded-full border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
            aria-label="Next review"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  )
}

export default Reviews