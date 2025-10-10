import React from 'react'

const Reviews = ({ reviews = [] }) => {
  // Sample reviews if none provided
  const sampleReviews = [
    {
      id: 1,
      name: "Ana Krasniqi",
      rating: 5,
      comment: "Excellent quality furniture. Very satisfied with my purchase!",
      date: "2025-01-15"
    },
    {
      id: 2,
      name: "Petrit Gashi",
      rating: 5,
      comment: "Professional service and high-quality products. Highly recommend DoqiSHPK!",
      date: "2025-01-10"
    },
    {
      id: 3,
      name: "Fjolla Berisha",
      rating: 4,
      comment: "Great mattress quality. Comfortable and durable.",
      date: "2025-01-05"
    }
  ]

  const displayReviews = reviews.length > 0 ? reviews : sampleReviews

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span 
        key={index}
        className={`text-lg ${
          index < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
      >
        ★
      </span>
    ))
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-gray-600">
            Real feedback from our satisfied customers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayReviews.map((review) => (
            <div 
              key={review.id}
              className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center mb-4">
                <div className="flex mr-2">
                  {renderStars(review.rating)}
                </div>
                <span className="text-sm text-gray-500">
                  ({review.rating}/5)
                </span>
              </div>
              
              <p className="text-gray-700 mb-4 italic">
                "{review.comment}"
              </p>
              
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">
                  {review.name}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(review.date).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Reviews