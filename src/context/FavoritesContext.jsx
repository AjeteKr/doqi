import { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext();

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('doqi-favorites');
    if (savedFavorites) {
      try {
        const parsedFavorites = JSON.parse(savedFavorites);
        setFavorites(parsedFavorites);
      } catch (error) {
        setFavorites([]);
      }
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('doqi-favorites', JSON.stringify(favorites));
    }
  }, [favorites, isInitialized]);

  const addToFavorites = (product) => {
    setFavorites(prev => {
      const isAlreadyFavorite = prev.some(item => item.id === product.id);
      if (isAlreadyFavorite) {
        return prev;
      }
      return [...prev, product];
    });
  };

  const removeFromFavorites = (productId) => {
    setFavorites(prev => prev.filter(item => item.id !== productId));
  };

  const toggleFavorite = (product) => {
    const isAlreadyFavorite = favorites.some(item => item.id === product.id);
    if (isAlreadyFavorite) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  const isFavorite = (productId) => {
    return favorites.some(item => item.id === productId);
  };

  const clearFavorites = () => {
    setFavorites([]);
    localStorage.removeItem('doqi-favorites');
  }

  const value = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    favoritesCount: favorites.length
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};