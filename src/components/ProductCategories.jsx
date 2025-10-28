import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import compactHPLIcon from '../assets/icons/compactHPL.png'
import sofaChairIcon from '../assets/icons/sofa-chair.png'
import mdfChipBoardIcon from '../assets/icons/mdf-ChipBoard.png'
import accessoriesIcon from '../assets/icons/accessories.png'
import mattressIcon from '../assets/icons/mattress.png'
import cuttingIcon from '../assets/icons/cutting.png'

const ProductCategories = ({ onCategoryChange }) => {
  const { t } = useTranslation()
  const [activeCategory, setActiveCategory] = useState(null)
  const [activeSubCategory, setActiveSubCategory] = useState(null)
  const [showSubCategories, setShowSubCategories] = useState(false)

  const categories = [
    { 
      id: 'customerService', 
      icon: cuttingIcon,
      hasSubCategories: true,
      subCategories: ['cutting', 'edgeBanding', 'cnc']
    },
    { 
      id: 'mattress', 
      icon: mattressIcon,
      hasSubCategories: true,
      subCategories: ['ecoFlex', 'mediumFlex', 'starFlex', 'hotelLineConcept']
    },
    { 
      id: 'sofaChair', 
      icon: sofaChairIcon,
      hasSubCategories: true,
      subCategories: ['sofa', 'chair']
    },
    { id: 'mdfChipBoard', icon: mdfChipBoardIcon, hasSubCategories: false },
    { id: 'compactHPL', icon: compactHPLIcon, hasSubCategories: false },
    { id: 'accessories', icon: accessoriesIcon, hasSubCategories: false }
  ]

  const handleCategoryClick = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId)
    
    if (category && category.hasSubCategories) {
      if (activeCategory === categoryId && showSubCategories) {
        setShowSubCategories(false)
        setActiveCategory(null)
        setActiveSubCategory(null)
        if (onCategoryChange) {
          onCategoryChange(null)
        }
      } else {
        setActiveCategory(categoryId)
        setShowSubCategories(true)
        setActiveSubCategory(null)
        if (onCategoryChange) {
          onCategoryChange(categoryId)
        }
      }
    } else {
      setActiveCategory(categoryId)
      setShowSubCategories(false)
      setActiveSubCategory(null)
      if (onCategoryChange) {
        onCategoryChange(categoryId)
      }
    }
  }

  const handleSubCategoryClick = (subCategoryId) => {
    setActiveSubCategory(subCategoryId)
    if (onCategoryChange) {
      onCategoryChange(`${activeCategory}.${subCategoryId}`)
    }
  }

  return (
    <section className="sm:py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-left mb-6 sm:mb-8 lg:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-normal text-black mb-2 sm:mb-4">
            {t('products.ourProducts')}
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl">
            {t('products.findYourPerfectPiece')}
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4 lg:gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`group relative rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                activeCategory === category.id 
                  ? 'bg-red-400' 
                  : 'bg-gray-200 hover:bg-red-400'
              }`}
            >
              {/* Icon */}
              <div className="flex justify-center mb-2 sm:mb-3 lg:mb-4 relative z-10">
                <img 
                  src={category.icon} 
                  alt={category.name}
                  className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 object-contain transition-all duration-300 ${
                    activeCategory === category.id 
                      ? 'brightness-0 invert' 
                      : 'group-hover:brightness-0 group-hover:invert'
                  }`}
                />
              </div>
              
              {/* Category Name */}
              <h3 className={`text-center text-xs sm:text-sm lg:text-sm font-medium transition-colors relative z-10 leading-tight ${
                activeCategory === category.id 
                  ? 'text-white' 
                  : 'text-gray-800 group-hover:text-white'
              }`}>
                {t(`products.categories.${category.id}`)}
              </h3>
            </div>
          ))}
        </div>

        {/* Sub-Categories */}
        {showSubCategories && activeCategory && (
          <div className="mt-6">
            <div className="flex flex-wrap gap-4">
              <span
                onClick={() => {
                  setActiveSubCategory(null)
                  if (onCategoryChange) {
                    onCategoryChange(activeCategory)
                  }
                }}
                className={`cursor-pointer transition-colors duration-200 text-sm font-medium ${
                  activeSubCategory === null
                    ? 'text-red-500 font-semibold'
                    : 'text-gray-600 hover:text-red-400'
                }`}
              >
                {t('products.subCategories.all')}
              </span>
              
              {categories.find(cat => cat.id === activeCategory)?.subCategories.map((subCategory) => (
                <span
                  key={subCategory}
                  onClick={() => handleSubCategoryClick(subCategory)}
                  className={`cursor-pointer transition-colors duration-200 text-sm font-medium ${
                    activeSubCategory === subCategory
                      ? 'text-red-500 font-semibold'
                      : 'text-gray-600 hover:text-red-400'
                  }`}
                >
                  {t(`products.subCategories.${subCategory}`)}
                </span>
              ))}
            </div>
          </div>
        )}


      </div>
    </section>
  )
}

export default ProductCategories