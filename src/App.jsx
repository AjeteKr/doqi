import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Products from './pages/Products/Products'
import ProductDetails from './pages/ProductDetails/ProductDetails'
import Favorites from './pages/Favorites'
import NotFound from './pages/NotFound'
import { FavoritesProvider } from './context/FavoritesContext'

function App() {
  return (
    <FavoritesProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:slug" element={<ProductDetails />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </Router>
    </FavoritesProvider>


  )
}

export default App