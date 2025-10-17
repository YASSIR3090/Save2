// src/SearchResultsPage.jsx - UPDATED WITH BETTER BORDER DETAILS
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const SearchResultsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [allItems, setAllItems] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [sortBy, setSortBy] = useState("relevance");
  const [dataLastUpdated, setDataLastUpdated] = useState(null);

  // FUZZY SEARCH FUNCTIONS
  const levenshteinDistance = (str1, str2) => {
    const track = Array(str2.length + 1).fill(null).map(() =>
      Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i += 1) {
      track[0][i] = i;
    }
    
    for (let j = 0; j <= str2.length; j += 1) {
      track[j][0] = j;
    }
    
    for (let j = 1; j <= str2.length; j += 1) {
      for (let i = 1; i <= str1.length; i += 1) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        track[j][i] = Math.min(
          track[j][i - 1] + 1,
          track[j - 1][i] + 1,
          track[j - 1][i - 1] + indicator,
        );
      }
    }
    
    return track[str2.length][str1.length];
  };

  const calculateSimilarity = (str1, str2) => {
    const distance = levenshteinDistance(str1.toLowerCase(), str2.toLowerCase());
    const maxLength = Math.max(str1.length, str2.length);
    return 1 - distance / maxLength;
  };

  const fuzzySearch = (text, query) => {
    if (!query.trim()) return { match: true, score: 0 };
    
    const textLower = text.toLowerCase();
    const queryLower = query.toLowerCase();
    const queryWords = queryLower.split(/\s+/).filter(word => word.length > 0);
    
    if (textLower.includes(queryLower)) {
      return { match: true, score: 1.0 };
    }
    
    if (queryLower.length >= 2) {
      const words = textLower.split(/\s+/);
      for (let word of words) {
        if (word.startsWith(queryLower.substring(0, Math.min(3, queryLower.length)))) {
          return { match: true, score: 0.8 };
        }
      }
      
      let bestSimilarity = 0;
      for (let word of words) {
        if (word.length >= 2) {
          const similarity = calculateSimilarity(word, queryLower);
          if (similarity > bestSimilarity) {
            bestSimilarity = similarity;
          }
        }
      }
      
      const fullTextSimilarity = calculateSimilarity(textLower, queryLower);
      bestSimilarity = Math.max(bestSimilarity, fullTextSimilarity);
      
      if (bestSimilarity >= 0.5) {
        return { match: true, score: bestSimilarity };
      }
    }
    
    if (queryWords.length > 1) {
      for (let word of queryWords) {
        if (word.length >= 2 && textLower.includes(word)) {
          return { match: true, score: 0.7 };
        }
      }
    }
    
    return { match: false, score: 0 };
  };

  // LOAD ALL ITEMS FROM ALL SOURCES - CRITICAL FIX
  const loadAllItemsFromStorage = () => {
    try {
      const allBusinesses = JSON.parse(localStorage.getItem('verifiedBusinesses')) || [];
      let allItems = [];

      // Load items from all businesses
      allBusinesses.forEach(business => {
        const businessProducts = JSON.parse(localStorage.getItem(`products_${business.id}`)) || [];
        const businessServices = JSON.parse(localStorage.getItem(`services_${business.id}`)) || [];
        
        const productsWithBusiness = businessProducts.map(product => ({
          ...product,
          businessName: business.businessName,
          type: "product",
          featured: product.featured || false
        }));
        
        const servicesWithBusiness = businessServices.map(service => ({
          ...service,
          businessName: business.businessName,
          type: "service",
          featured: service.featured || false
        }));
        
        allItems = [...allItems, ...productsWithBusiness, ...servicesWithBusiness];
      });

      return allItems;
    } catch (error) {
      console.error("Error loading items from storage:", error);
      return [];
    }
  };

  // Load all items
  const loadAllItems = useCallback(() => {
    try {
      // Load stored items from businesses
      const storedItems = loadAllItemsFromStorage();

      // Comprehensive sample data (same as HomePage1)
      const sampleItems = [
        {
          id: "elec-1",
          name: "Dell Latitude Laptop",
          category: "Electronics & Devices",
          price: 1200000,
          currency: "TZS",
          currencySymbol: "TSh",
          stock: 5,
          business: "TechHub Tanzania",
          location: { lat: -6.7924, lng: 39.2083 },
          address: "Dar es Salaam",
          country: "Tanzania",
          city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=600"],
          description: "High-performance business laptop with latest Intel Core i7 processor",
          rating: 4.5,
          reviews: 23,
          type: "product",
          featured: true
        },
        {
          id: "gen-1",
          name: "Men's Running Shoes",
          category: "General Goods",
          price: 85000,
          currency: "TZS",
          currencySymbol: "TSh",
          stock: 15,
          business: "Sports Gear Tanzania",
          location: { lat: -6.8184, lng: 39.2883 },
          address: "Dar es Salaam", 
          country: "Tanzania",
          city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=600"],
          description: "Comfortable running shoes designed for maximum performance",
          rating: 4.3,
          reviews: 15,
          type: "product",
          featured: true
        },
        {
          id: "hotel-1", 
          name: "Serengeti Luxury Hotel",
          category: "Building & Hotels",
          serviceType: "5-Star Hotel",
          priceRange: "150-300",
          currency: "USD", 
          currencySymbol: "$",
          business: "Serengeti Hospitality Group",
          location: { lat: -6.8155, lng: 39.2861 },
          address: "Dar es Salaam",
          country: "Tanzania", 
          city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=600"],
          description: "5-star luxury hotel with premium amenities and excellent service",
          rating: "5",
          type: "service",
          featured: true
        },
        {
          id: "elec-2",
          name: "iPhone 15 Pro Max", 
          category: "Electronics & Devices",
          price: 2500000,
          currency: "TZS",
          currencySymbol: "TSh",
          stock: 3,
          business: "MobileWorld Tanzania",
          location: { lat: -6.8184, lng: 39.2883 },
          address: "Dar es Salaam",
          country: "Tanzania",
          city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=600"],
          description: "Latest iPhone with titanium design and advanced camera system",
          rating: 4.8,
          reviews: 15,
          type: "product",
          featured: true
        },
        {
          id: "veh-1",
          name: "Toyota Land Cruiser V8",
          category: "Vehicles",
          price: 185000000,
          currency: "TZS",
          currencySymbol: "TSh",
          stock: 2,
          business: "Premium Motors Tanzania",
          location: { lat: -6.8155, lng: 39.2861 },
          address: "Dar es Salaam",
          country: "Tanzania",
          city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=600"],
          description: "Luxury SUV with premium features",
          rating: 4.8,
          reviews: 12,
          type: "product",
          featured: true
        },
        {
          id: "gen-2",
          name: "Women's Handbag",
          category: "General Goods",
          price: 45000,
          currency: "TZS",
          currencySymbol: "TSh",
          stock: 10,
          business: "Fashion Store Tanzania",
          location: { lat: -6.8155, lng: 39.2861 },
          address: "Dar es Salaam",
          country: "Tanzania",
          city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=600"],
          description: "Elegant leather handbag for women",
          rating: 4.1,
          reviews: 8,
          type: "product",
          featured: true
        },
        {
          id: "elec-3",
          name: "Apple iPhone 16 Pro (256GB) - Latest Model with Advanced Features",
          category: "Electronics",
          price: 3200000,
          currency: "TZS",
          currencySymbol: "TSh",
          stock: 8,
          business: "TechHub Tanzania",
          images: ["https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=600"],
          description: "Latest iPhone 16 Pro with Face ID and advanced camera system. A18 Pro chip, 256GB storage, and premium features for professional use.",
          rating: 4.8,
          reviews: 45,
          type: "product"
        },
        {
          id: "elec-4",
          name: "Samsung Galaxy S25 Ultra AI (512GB) - Premium Edition",
          category: "Electronics",
          price: 2800000,
          currency: "TZS",
          currencySymbol: "TSh",
          stock: 6,
          business: "TechHub Tanzania",
          images: ["https://images.pexels.com/photos/47261/pexels-photo-47261.jpeg?auto=compress&cs=tinysrgb&w=600"],
          description: "Samsung Galaxy S25 Ultra with AI capabilities, S Pen, quad camera system, and advanced display technology for the best mobile experience.",
          rating: 4.7,
          reviews: 28,
          type: "product"
        }
      ];

      // Combine stored items with sample items
      const combinedItems = [...storedItems, ...sampleItems];
      
      // Remove duplicates based on ID
      const uniqueItems = combinedItems.filter((item, index, self) =>
        index === self.findIndex((t) => t.id === item.id)
      );

      setAllItems(uniqueItems);
      return uniqueItems;
    } catch (error) {
      console.error("Error loading items:", error);
      return [];
    }
  }, []);

  // Load recent searches
  const loadRecentSearches = useCallback(() => {
    try {
      const recent = JSON.parse(localStorage.getItem('recentSearches')) || [];
      setRecentSearches(recent.slice(0, 5));
    } catch (error) {
      console.error("Error loading recent searches:", error);
    }
  }, []);

  // Generate search suggestions
  const generateSearchSuggestions = useCallback((query) => {
    if (query.trim() === "") return recentSearches;

    const suggestions = new Set();
    const queryLower = query.toLowerCase();

    recentSearches.forEach(search => {
      if (fuzzySearch(search, query).match) {
        suggestions.add(search);
      }
    });

    allItems.forEach(item => {
      if (fuzzySearch(item.name, query).match) {
        suggestions.add(item.name);
      }
      if (fuzzySearch(item.category, query).match) {
        suggestions.add(item.category);
      }
      if (fuzzySearch(item.business, query).match) {
        suggestions.add(item.business);
      }
    });

    return Array.from(suggestions).slice(0, 8);
  }, [allItems, recentSearches]);

  // Perform search
  const performSearch = useCallback((query, items) => {
    if (!query.trim()) return items;

    const filtered = items.map(item => {
      const searchableText = `
        ${item.name || ''}
        ${item.category || ''}
        ${item.businessName || item.business || ''}
        ${item.description || ''}
        ${item.serviceType || ''}
        ${item.brand || ''}
      `.toLowerCase();

      const searchResult = fuzzySearch(searchableText, query);
      return {
        ...item,
        searchScore: searchResult.score,
        isFuzzyMatch: searchResult.match && searchResult.score < 0.9
      };
    }).filter(item => item.searchScore > 0);

    return filtered.sort((a, b) => b.searchScore - a.searchScore);
  }, []);

  // Sort results
  const sortResults = useCallback((results, sortType) => {
    const sorted = [...results];
    
    switch (sortType) {
      case "price-low":
        return sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
      case "price-high":
        return sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
      case "rating":
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case "relevance":
      default:
        return sorted.sort((a, b) => {
          if (b.searchScore !== a.searchScore) {
            return b.searchScore - a.searchScore;
          }
          return (b.rating || 0) - (a.rating || 0);
        });
    }
  }, []);

  // Initialize search
  const initializeSearch = useCallback(async () => {
    setIsLoading(true);
    
    try {
      const items = await loadAllItems();
      loadRecentSearches();
      
      const searchParams = new URLSearchParams(location.search);
      const query = searchParams.get('q') || '';
      setSearchQuery(query);
      
      let results = performSearch(query, items);
      results = sortResults(results, sortBy);
      
      setSearchResults(results);
      setDataLastUpdated(localStorage.getItem('dataLastUpdated'));
      
    } catch (error) {
      console.error("Search initialization error:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [location.search, loadAllItems, performSearch, sortResults, sortBy, loadRecentSearches]);

  // Listen for data updates
  useEffect(() => {
    const checkForDataUpdates = () => {
      const lastUpdate = localStorage.getItem('dataLastUpdated');
      if (lastUpdate !== dataLastUpdated) {
        console.log('Data updated detected, reloading search...');
        initializeSearch();
      }
    };

    // Check every 2 seconds for updates
    const interval = setInterval(checkForDataUpdates, 2000);
    return () => clearInterval(interval);
  }, [dataLastUpdated, initializeSearch]);

  useEffect(() => {
    initializeSearch();
  }, [initializeSearch]);

  // Handle search input change
  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.trim() !== "") {
      const suggestions = generateSearchSuggestions(value);
      setSearchSuggestions(suggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Save to recent searches
      const recent = JSON.parse(localStorage.getItem('recentSearches')) || [];
      const filtered = recent.filter(item => item.toLowerCase() !== searchQuery.toLowerCase());
      filtered.unshift(searchQuery);
      localStorage.setItem('recentSearches', JSON.stringify(filtered.slice(0, 10)));
      
      navigate(`/search-results?q=${encodeURIComponent(searchQuery)}`);
      setShowSuggestions(false);
      initializeSearch();
    }
  };

  // Handle clear search
  const handleClearSearch = () => {
    setSearchQuery("");
    setShowSuggestions(false);
  };

  // Handle sort change
  const handleSortChange = (e) => {
    const newSortBy = e.target.value;
    setSortBy(newSortBy);
    
    const sortedResults = sortResults(searchResults, newSortBy);
    setSearchResults(sortedResults);
  };

  // Handle search input focus
  const handleSearchInputFocus = () => {
    if (searchQuery.trim() !== "") {
      const suggestions = generateSearchSuggestions(searchQuery);
      setSearchSuggestions(suggestions);
      setShowSuggestions(suggestions.length > 0);
    } else if (recentSearches.length > 0) {
      setSearchSuggestions(recentSearches);
      setShowSuggestions(true);
    }
  };

  // Handle search suggestion click
  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    // Save to recent searches
    const recent = JSON.parse(localStorage.getItem('recentSearches')) || [];
    const filtered = recent.filter(item => item.toLowerCase() !== suggestion.toLowerCase());
    filtered.unshift(suggestion);
    localStorage.setItem('recentSearches', JSON.stringify(filtered.slice(0, 10)));
    
    setShowSuggestions(false);
    navigate(`/search-results?q=${encodeURIComponent(suggestion)}`);
  };

  // Handle clear recent searches
  const handleClearRecentSearches = () => {
    localStorage.removeItem('recentSearches');
    setRecentSearches([]);
    setSearchSuggestions([]);
  };

  const getItemImage = (item) => {
    if (item.images && item.images.length > 0) {
      const firstImage = item.images[0];
      if (typeof firstImage === 'string' && firstImage.startsWith('data:image')) {
        return firstImage;
      } else if (typeof firstImage === 'string') {
        return firstImage;
      }
    }
    return 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=600';
  };

  const renderStars = (rating) => {
    const numRating = typeof rating === 'string' ? parseFloat(rating) : (rating || 4.0);
    return Array.from({ length: 5 }, (_, index) => (
      <i
        key={index}
        className={`fas fa-star ${index < Math.floor(numRating) ? 'text-warning' : 'text-muted'}`}
        style={{ fontSize: '0.7rem' }}
      ></i>
    ));
  };

  const formatPrice = (item) => {
    if (item.type === 'service') {
      return `${item.currencySymbol || '$'} ${item.priceRange}`;
    }
    return `${item.currencySymbol || '$'} ${item.price?.toLocaleString() || '0'}`;
  };

  // NEW: Function to truncate description to 42 characters
  const truncateDescription = (description) => {
    if (!description) return 'No description available';
    if (description.length <= 42) return description;
    return description.substring(0, 42) + '...';
  };

  if (isLoading) {
    return (
      <div className="min-vh-100 bg-white d-flex justify-content-center align-items-center">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }}></div>
          <p className="text-dark">Loading search results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-white">
      {/* Header with Beautiful Animated Search Bar */}
      <div className="bg-white border-bottom sticky-top shadow-sm">
        <div className="container-fluid py-3">
          <div className="row align-items-center">
            <div className="col-auto">
              <button
                className="btn btn-light rounded-circle border"
                onClick={() => navigate('/')}
                style={{ 
                  width: '40px', 
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <i className="fas fa-arrow-left text-dark"></i>
              </button>
            </div>
            
            <div className="col position-relative">
              <form onSubmit={handleSearch}>
                {/* BEAUTIFUL ANIMATED SEARCH BAR */}
                <div 
                  className="form"
                  style={{
                    '--input-bg': '#FFF',
                    '--padding': '1.5em',
                    '--rotate': '80deg',
                    '--gap': '2em',
                    '--icon-change-color': '#15A986',
                    '--height': '45px',
                    width: '100%',
                    paddingInlineEnd: '1em',
                    background: 'var(--input-bg)',
                    position: 'relative',
                    borderRadius: '8px'
                  }}
                >
                  <label style={{ display: 'flex', alignItems: 'center', width: '100%', height: 'var(--height)' }}>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchInputChange}
                      onFocus={handleSearchInputFocus}
                      placeholder="Search products, services, businesses..."
                      style={{
                        width: '100%',
                        paddingInlineStart: 'calc(var(--padding) + var(--gap))',
                        outline: 'none',
                        background: 'none',
                        border: '0',
                        fontSize: '0.9rem',
                        height: '100%'
                      }}
                      required
                    />
                    
                    {/* Search Icon */}
                    <div 
                      className="icon"
                      style={{
                        position: 'absolute',
                        left: 'var(--padding)',
                        transition: '0.3s cubic-bezier(.4,0,.2,1)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%'
                      }}
                    >
                      <svg 
                        className="swap-on"
                        style={{ 
                          display: 'block',
                          color: '#111',
                          transition: '0.3s cubic-bezier(.4,0,.2,1)',
                          height: '18px'
                        }} 
                        viewBox="0 0 24 24"
                      >
                        <path d="M21.71,20.29,18,16.61A9,9,0,1,0,16.61,18l3.68,3.68a1,1,0,0,0,1.42,0A1,1,0,0,0,21.71,20.29ZM11,18a7,7,0,1,1,7-7A7,7,0,0,1,11,18Z"/>
                      </svg>
                      
                      <svg 
                        className="swap-off"
                        style={{
                          display: 'block',
                          color: '#111',
                          transition: '0.3s cubic-bezier(.4,0,.2,1)',
                          position: 'absolute',
                          height: '18px',
                          transform: 'rotate(-80deg)',
                          opacity: '0',
                          visibility: 'hidden'
                        }} 
                        viewBox="0 0 512 512"
                      >
                        <path d="M443.6,387.1L312.4,255.4l131.5-130c5.4-5.4,5.4-14.2,0-19.6l-37.4-37.6c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4  L256,197.8L124.9,68.3c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4L68,105.9c-5.4,5.4-5.4,14.2,0,19.6l131.5,130L68.4,387.1  c-2.6,2.6-4.1,6.1-4.1,9.8c0,3.7,1.4,7.2,4.1,9.8l37.4,37.6c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1L256,313.1l130.7,131.1  c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1l37.4-37.6c2.6-2.6,4.1-6.1,4.1-9.8C447.7,393.2,446.2,389.7,443.6,387.1z"/>
                      </svg>
                    </div>

                    {/* Close Button */}
                    {searchQuery && (
                      <button 
                        type="button"
                        className="close-btn"
                        onClick={handleClearSearch}
                        style={{
                          background: 'none',
                          border: 'none',
                          right: 'calc(var(--padding) - var(--gap))',
                          boxSizing: 'border-box',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#111',
                          padding: '0.1em',
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          transition: '0.3s',
                          position: 'absolute',
                          opacity: '1',
                          transform: 'scale(1)',
                          visibility: 'visible'
                        }}
                      >
                        <svg 
                          style={{ width: '12px', height: '12px' }} 
                          viewBox="0 0 512 512"
                        >
                          <path d="M443.6,387.1L312.4,255.4l131.5-130c5.4-5.4,5.4-14.2,0-19.6l-37.4-37.6c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4  L256,197.8L124.9,68.3c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4L68,105.9c-5.4,5.4-5.4,14.2,0,19.6l131.5,130L68.4,387.1  c-2.6,2.6-4.1,6.1-4.1,9.8c0,3.7,1.4,7.2,4.1,9.8l37.4,37.6c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1L256,313.1l130.7,131.1  c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1l37.4-37.6c2.6-2.6,4.1-6.1,4.1-9.8C447.7,393.2,446.2,389.7,443.6,387.1z"/>
                        </svg>
                      </button>
                    )}
                  </label>
                </div>

                {/* Search Suggestions */}
                {showSuggestions && (
                  <div className="position-absolute top-100 start-0 end-0 mt-2" style={{ zIndex: 1030 }}>
                    <div className="bg-white border rounded-3 shadow-lg overflow-hidden">
                      {/* Recent Searches Section */}
                      {searchQuery === "" && recentSearches.length > 0 && (
                        <>
                          <div className="px-3 pt-2 pb-1 bg-light border-bottom">
                            <div className="d-flex justify-content-between align-items-center">
                              <small className="text-muted fw-bold">RECENT SEARCHES</small>
                              <button 
                                className="btn btn-link p-0 text-danger text-decoration-none"
                                onClick={handleClearRecentSearches}
                                style={{ fontSize: '11px' }}
                              >
                                Clear all
                              </button>
                            </div>
                          </div>
                          {recentSearches.map((search, index) => (
                            <button
                              key={`recent-${index}`}
                              className="btn btn-light w-100 text-start p-3 border-bottom d-flex align-items-center"
                              onClick={() => handleSuggestionClick(search)}
                              style={{ 
                                border: 'none', 
                                borderRadius: '0',
                                fontSize: '14px'
                              }}
                            >
                              <i className="fas fa-clock text-muted me-3" style={{ width: '16px' }}></i>
                              {search}
                            </button>
                          ))}
                        </>
                      )}
                      
                      {/* Search Suggestions Section */}
                      {searchQuery !== "" && searchSuggestions.length > 0 && (
                        <>
                          <div className="px-3 pt-2 pb-1 bg-light border-bottom">
                            <small className="text-muted fw-bold">SUGGESTIONS</small>
                          </div>
                          {searchSuggestions.map((suggestion, index) => (
                            <button
                              key={`suggestion-${index}`}
                              className="btn btn-light w-100 text-start p-3 border-bottom d-flex align-items-center"
                              onClick={() => handleSuggestionClick(suggestion)}
                              style={{ 
                                border: 'none', 
                                borderRadius: '0',
                                fontSize: '14px'
                              }}
                            >
                              <i className="fas fa-search text-muted me-3" style={{ width: '16px' }}></i>
                              {suggestion}
                            </button>
                          ))}
                        </>
                      )}

                      {/* No Results Message */}
                      {searchQuery !== "" && searchSuggestions.length === 0 && (
                        <div className="p-3 text-center text-muted">
                          <i className="fas fa-search me-2"></i>
                          No suggestions found for "{searchQuery}"
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="container-fluid py-4">
        {searchResults.length === 0 ? (
          <div className="text-center py-5">
            <div className="mb-4">
              <i className="fas fa-search fa-3x text-muted mb-3"></i>
            </div>
            <h4 className="text-dark mb-3">No Results Found</h4>
            <p className="text-muted mb-4">
              {searchQuery ? `No items found for "${searchQuery}". Try different keywords.` : 'Please enter a search term to find items.'}
            </p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/')}
            >
              <i className="fas fa-home me-2"></i>
              Back to Home
            </button>
          </div>
        ) : (
          <>
            {/* Search Summary */}
            <div className="row mb-4">
              <div className="col-12">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="text-muted small">
                    {searchResults.length} results for "<span className="text-primary">"{searchQuery}"</span>"
                  </div>
                  <div className="dropdown">
                    <button className="btn btn-outline-dark btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown">
                      Sort by: {sortBy === 'relevance' ? 'Relevance' : 
                              sortBy === 'price-low' ? 'Price: Low to High' :
                              sortBy === 'price-high' ? 'Price: High to Low' : 'Rating'}
                    </button>
                    <ul className="dropdown-menu">
                      <li><button className="dropdown-item small" onClick={() => handleSortChange({target: {value: 'relevance'}})}>Relevance</button></li>
                      <li><button className="dropdown-item small" onClick={() => handleSortChange({target: {value: 'price-low'}})}>Price: Low to High</button></li>
                      <li><button className="dropdown-item small" onClick={() => handleSortChange({target: {value: 'price-high'}})}>Price: High to Low</button></li>
                      <li><button className="dropdown-item small" onClick={() => handleSortChange({target: {value: 'rating'}})}>Highest Rating</button></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* IMPROVED CARDS WITH BETTER BORDER DETAILS */}
            <div className="row g-3 justify-content-center">
              {searchResults.map((item) => (
                <div key={item.id} className="col-6 col-sm-4 col-md-3 col-lg-2">
                  {/* IMPROVED CARD WITH BETTER BORDER DETAILS */}
                  <div 
                    className="improved-card"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                      width: '100%',
                      height: '280px',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                      backgroundColor: 'white',
                      border: '2px solid #e8e8e8',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.borderColor = '#c45500';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = '#e8e8e8';
                    }}
                    onClick={() => {
                      if (item.type === 'service') {
                        navigate(`/service-detail/${item.id}`);
                      } else {
                        navigate(`/product-detail/${item.id}`);
                      }
                    }}
                  >
                    {/* Image Container */}
                    <div 
                      className="image-container"
                      style={{
                        position: 'relative',
                        width: '100%',
                        height: '140px',
                        overflow: 'hidden',
                        backgroundColor: '#f8f9fa'
                      }}
                    >
                      <img
                        src={getItemImage(item)}
                        alt={item.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.3s ease'
                        }}
                        onError={(e) => {
                          e.target.src = 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=600';
                        }}
                      />
                      
                      {/* Featured Badge */}
                      {item.featured && (
                        <div 
                          className="featured-badge"
                          style={{
                            position: 'absolute',
                            top: '8px',
                            left: '8px',
                            backgroundColor: '#ff4444',
                            color: 'white',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '9px',
                            fontWeight: 'bold',
                            zIndex: 2
                          }}
                        >
                          FEATURED
                        </div>
                      )}

                      {/* Type Badge */}
                      <div 
                        className="type-badge"
                        style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          backgroundColor: 'rgba(0, 0, 0, 0.7)',
                          color: 'white',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '9px',
                          fontWeight: 'bold',
                          zIndex: 2
                        }}
                      >
                        {item.type === 'service' ? 'SERVICE' : 'PRODUCT'}
                      </div>
                    </div>

                    {/* Content Container */}
                    <div 
                      className="content-container"
                      style={{
                        flex: 1,
                        padding: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      {/* Top Section - Name and Category */}
                      <div>
                        {/* Item Name */}
                        <h6 
                          className="item-name"
                          style={{
                            fontSize: '13px',
                            fontWeight: '600',
                            lineHeight: '1.3',
                            marginBottom: '4px',
                            color: '#1a1a1a',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            minHeight: '32px'
                          }}
                        >
                          {item.name}
                        </h6>

                        {/* Category */}
                        <p 
                          className="category"
                          style={{
                            fontSize: '11px',
                            color: '#666',
                            marginBottom: '6px',
                            fontWeight: '500'
                          }}
                        >
                          {item.category}
                        </p>
                      </div>

                      {/* Middle Section - Description */}
                      <div style={{ marginBottom: '8px' }}>
                        <p 
                          className="description"
                          style={{
                            fontSize: '10px',
                            color: '#888',
                            lineHeight: '1.3',
                            margin: 0,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {truncateDescription(item.description)}
                        </p>
                      </div>

                      {/* Bottom Section - Price, Rating, Business */}
                      <div>
                        {/* Price */}
                        <div 
                          className="price"
                          style={{
                            fontSize: '14px',
                            fontWeight: 'bold',
                            color: '#c45500',
                            marginBottom: '4px'
                          }}
                        >
                          {formatPrice(item)}
                          {item.type === 'product' && item.currency === 'USD' && (
                            <span style={{ fontSize: '10px', color: '#666', marginLeft: '2px' }}>USD</span>
                          )}
                        </div>

                        {/* Rating and Business */}
                        <div className="d-flex justify-content-between align-items-center">
                          {/* Rating */}
                          <div className="d-flex align-items-center">
                            <div className="me-1">
                              {renderStars(item.rating)}
                            </div>
                            <small 
                              className="text-muted"
                              style={{ fontSize: '9px' }}
                            >
                              {item.rating || '4.0'}
                            </small>
                          </div>

                          {/* Business Name */}
                          <small 
                            className="business-name text-end"
                            style={{
                              fontSize: '9px',
                              color: '#666',
                              fontWeight: '500',
                              maxWidth: '60%',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {item.businessName || item.business}
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;