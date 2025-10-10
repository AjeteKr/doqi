import React from 'react'
import { Link } from 'react-router-dom'

const Hero = ({ 
  title = "Welcome to DoqiSHPK", 
  subtitle = "High-quality furniture and mattress production", 
  description = "Doçi Shpk, in partnership with Starflex, delivers products that combine comfort, durability, and style.",
  buttonText = "Explore Products",
  buttonLink = "/products",
  backgroundClass = "bg-gradient-to-r from-blue-600 to-blue-800"
}) => {
  return (
    <section className={`${backgroundClass} text-white py-20`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          {title}
        </h1>
        <p className="text-xl md:text-2xl mb-6 text-blue-100">
          {subtitle}
        </p>
        <p className="text-lg mb-8 text-blue-50 max-w-3xl mx-auto">
          {description}
        </p>
        <Link 
          to={buttonLink}
          className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
        >
          {buttonText}
        </Link>
      </div>
    </section>
  )
}

export default Hero