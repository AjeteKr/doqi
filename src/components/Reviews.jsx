import { useState, useEffect } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
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
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=400&fit=crop&crop=face"
    },
    {
      id: 2,
      name: t('reviews.review2.name'),
      role: t('reviews.review2.role'),
      comment: t('reviews.review2.comment'),
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=400&fit=crop&crop=face"
    },
    {
      id: 3,
      name: t('reviews.review3.name'),
      role: t('reviews.review3.role'),
      comment: t('reviews.review3.comment'),
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=400&fit=crop&crop=face"
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
          {/* Left: Quote and Text */}
          <div className="lg:col-span-3 space-y-4">
            <div className="text-red-600 text-7xl font-serif leading-none mb-2">"</div>
            <p className="text-gray-900 text-sm leading-relaxed text-right">
              {currentReview.comment}
            </p>
          </div>

          {/* Center: Main Image */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-xl w-64 h-80">
              <img
                src={currentReview.image}
                alt={currentReview.name}
                className="w-full h-full object-cover transition-all duration-700 ease-in-out"
                key={currentReview.id}
              />
            </div>
          </div>

          {/* Right: Thumbnails and Customer Info */}
          <div className="lg:col-span-4 flex flex-col items-start space-y-6">
            {/* Other Reviewers Thumbnails */}
            <div className="flex gap-4">
              {otherReviewers.map((reviewer, idx) => (
                <div 
                  key={`${reviewer.id}-preview`}
                  className="relative rounded-2xl overflow-hidden shadow-lg w-32 h-24 cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0"
                  onClick={() => setCurrentIndex((currentIndex + idx + 1) % displayReviews.length)}
                >
                  <img
                    src={reviewer.image}
                    alt={reviewer.name}
                    className="w-full h-full object-cover transition-all duration-700 ease-in-out"
                  />
                </div>
              ))}
            </div>

            {/* Customer Info */}
            <div>
              <h3 className="text-lg font-bold text-gray-900">{currentReview.name}</h3>
              <p className="text-sm text-gray-600">{currentReview.role}</p>
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