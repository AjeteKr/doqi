import React from 'react'
import { useTranslation } from 'react-i18next'
import { US } from 'country-flag-icons/react/3x2'
import { AL } from 'country-flag-icons/react/3x2'
import { RS } from 'country-flag-icons/react/3x2'
import { BA } from 'country-flag-icons/react/3x2'
import { HR } from 'country-flag-icons/react/3x2'
import { MK } from 'country-flag-icons/react/3x2'
import { IT } from 'country-flag-icons/react/3x2'
import { FR } from 'country-flag-icons/react/3x2'
import { DE } from 'country-flag-icons/react/3x2'

// Flag Icon Component using real flag images
const FlagIcon = ({ countryCode, className = "w-6 h-4" }) => {
  const flagComponents = {
    en: US,
    al: AL, 
    sr: RS,
    bs: BA,
    hr: HR,
    mk: MK,
    it: IT,
    fr: FR,
    de: DE
  }

  const FlagComponent = flagComponents[countryCode]
  
  if (!FlagComponent) {
    return <div className={`${className} bg-gray-300 rounded-sm`}></div>
  }

  return (
    <FlagComponent 
      className={`${className} rounded-sm border border-gray-200 shadow-sm`} 
      style={{ minWidth: '24px', minHeight: '16px' }}
    />
  )
}

const LanguageSwitcher = ({ className = "" }) => {
  const { i18n } = useTranslation()

  const languages = [
    { code: 'en', name: 'English', country: 'en' },
    { code: 'al', name: 'Shqip', country: 'al' },
    { code: 'sr', name: 'Српски', country: 'sr' },
    { code: 'bs', name: 'Bosanski', country: 'bs' },
    { code: 'hr', name: 'Hrvatski', country: 'hr' },
    { code: 'mk', name: 'Македонски', country: 'mk' },
    { code: 'it', name: 'Italiano', country: 'it' },
    { code: 'fr', name: 'Français', country: 'fr' },
    { code: 'de', name: 'Deutsch', country: 'de' }
  ]

  const handleLanguageChange = (languageCode) => {
    i18n.changeLanguage(languageCode)
  }

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0]

  return (
    <div className={`relative group ${className}`}>
      <button className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
        <FlagIcon countryCode={currentLanguage.country} />
        <span>{currentLanguage.code.toUpperCase()}</span>
        <svg className="w-4 h-4 ml-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        {languages.map((language) => (
          <button
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`w-full flex items-center space-x-2 px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
              i18n.language === language.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
            }`}
          >
            <FlagIcon countryCode={language.country} />
            <span>{language.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default LanguageSwitcher