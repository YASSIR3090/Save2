// src/SearchResultsPage.jsx - UPDATED VERSION WITH COMPLETE DATA LOADING
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
      {/* Header with Search Bar */}
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
                <div className="input-group position-relative">
                  <input
                    type="text"
                    className="form-control border bg-light rounded-pill ps-4"
                    placeholder="Search products, services..."
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    onFocus={handleSearchInputFocus}
                    style={{ fontSize: '0.9rem' }}
                  />
                  <div className="position-absolute top-50 start-0 translate-middle-y ps-3">
                    <i className="fas fa-search text-muted"></i>
                  </div>
                  <button 
                    className="btn btn-primary rounded-pill ms-2"
                    type="submit"
                  >
                    <i className="fas fa-search"></i>
                  </button>
                </div>

                {/* Search Suggestions */}
                {showSuggestions && (
                  <div className="position-absolute top-100 start-0 end-0 mt-1" style={{ zIndex: 1030 }}>
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

            {/* RESPONSIVE CARDS GRID WITH TALLER DESKTOP CARDS */}
            <div className="row g-3 justify-content-center">
              {searchResults.map((item) => (
                <div key={item.id} className="col-6 col-md-4 col-lg-3">
                  <div 
                    className="position-relative card-responsive"
                    onClick={() => navigate(`/product/${item.id}`)}
                    style={{ 
                      width: '100%',
                      // Mobile height (default)
                      height: '320px',
                      background: 'rgb(240, 241, 245)',
                      borderRadius: '20px',
                      boxShadow: 'rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset, rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset, rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px',
                      cursor: 'pointer',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    }}
                  >
                    {/* PRODUCT IMAGE - Responsive height */}
                    <div 
                      className="position-relative w-100 card-image-responsive"
                      style={{
                        // Mobile image height
                        height: '130px',
                        overflow: 'hidden',
                        borderTopLeftRadius: '20px',
                        borderTopRightRadius: '20px'
                      }}
                    >
                      <img
                        src={getItemImage(item)}
                        alt={item.name}
                        className="w-100 h-100"
                        style={{ 
                          objectFit: 'cover'
                        }}
                        onError={(e) => {
                          e.target.src = 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=600';
                        }}
                      />
                    </div>

                    {/* BADGES */}
                    <div className="position-absolute top-0 start-0 w-100 p-2 d-flex justify-content-between">
                      {item.isFuzzyMatch && (
                        <div 
                          className="badge"
                          style={{
                            background: 'linear-gradient(45deg, #f59e0b, #fbbf24)',
                            color: '#1f2937',
                            fontWeight: 'bold',
                            padding: '4px 8px',
                            fontSize: '0.6rem',
                            borderRadius: '12px'
                          }}
                        >
                          <i className="fas fa-bolt me-1"></i>
                          Similar
                        </div>
                      )}
                      
                      {item.featured && (
                        <div 
                          className="badge"
                          style={{
                            background: 'linear-gradient(45deg, #8b5cf6, #a78bfa)',
                            color: '#ffffff',
                            fontWeight: 'bold',
                            padding: '4px 8px',
                            fontSize: '0.6rem',
                            borderRadius: '12px'
                          }}
                        >
                          <i className="fas fa-star me-1"></i>
                          Featured
                        </div>
                      )}
                      
                      {item.type === 'product' && (
                        <div 
                          className="badge"
                          style={{
                            background: item.stock > 0 ? 
                              'linear-gradient(45deg, #10b981, #34d399)' : 
                              'linear-gradient(45deg, #ef4444, #f87171)',
                            color: '#ffffff',
                            fontWeight: 'bold',
                            padding: '4px 8px',
                            fontSize: '0.6rem',
                            borderRadius: '12px'
                          }}
                        >
                          {item.stock > 0 ? 'In Stock' : 'Out of Stock'}
                        </div>
                      )}
                    </div>

                    {/* PRODUCT INFO */}
                    <div className="p-2 flex-grow-1 d-flex flex-column card-content-responsive">
                      {/* TITLE - More space on desktop */}
                      <h6 
                        className="mb-1 card-title-responsive"
                        style={{
                          // Mobile font size
                          fontSize: '0.8rem',
                          color: '#1f2937',
                          fontWeight: '700',
                          lineHeight: '1.2'
                        }}
                      >
                        {item.name.length > 35 ? `${item.name.substring(0, 35)}...` : item.name}
                      </h6>
                      
                      {/* DESCRIPTION - More content on desktop */}
                      <p 
                        className="mb-1 flex-grow-1 card-description-responsive"
                        style={{
                          // Mobile font size
                          fontSize: '0.65rem',
                          color: '#6b7280',
                          lineHeight: '1.2'
                        }}
                      >
                        {item.description && item.description.length > 50 
                          ? `${item.description.substring(0, 50)}...` 
                          : item.description || 'No description available.'}
                      </p>

                      {/* RATING AND PRICE SECTION */}
                      <div className="mt-auto">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <div className="d-flex align-items-center">
                            <div className="me-1">
                              {renderStars(item.rating)}
                            </div>
                            <small className="text-primary fw-bold" style={{ fontSize: '0.55rem' }}>
                              ({item.reviews || 0})
                            </small>
                          </div>
                          
                          {/* PROMINENT PRICE */}
                          <div style={{ minWidth: '70px' }}>
                            <div 
                              className="fw-bold text-end card-price-responsive"
                              style={{ 
                                color: '#059669',
                                // Mobile font size
                                fontSize: '0.9rem',
                                fontWeight: '800'
                              }}
                            >
                              {formatPrice(item)}
                            </div>
                          </div>
                        </div>

                        {/* BUSINESS AND LOCATION */}
                        <div className="d-flex justify-content-between align-items-center card-details-responsive">
                          <small className="text-muted" style={{ fontSize: '0.55rem' }}>
                            <i className="fas fa-store me-1"></i>
                            {item.businessName ? (item.businessName.length > 12 ? `${item.businessName.substring(0, 12)}...` : item.businessName) : (item.business ? (item.business.length > 12 ? `${item.business.substring(0, 12)}...` : item.business) : 'Shop')}
                          </small>
                          <small className="text-muted" style={{ fontSize: '0.55rem' }}>
                            <i className="fas fa-map-marker-alt me-1"></i>
                            {item.city || 'TZ'}
                          </small>
                        </div>

                        {/* VIEW BUTTON */}
                        <button 
                          className="w-100 mt-1 card-button-responsive"
                          style={{
                            cursor: 'pointer',
                            padding: '0.4rem',
                            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                            // Mobile font size
                            fontSize: '0.65rem',
                            color: '#ffffff',
                            border: '0',
                            borderRadius: '12px',
                            fontWeight: '600'
                          }}
                        >
                          <i className="fas fa-eye me-1"></i>
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {searchResults.length >= 15 && (
              <div className="text-center mt-4">
                <button 
                  className="btn px-4 py-2"
                  style={{
                    cursor: 'pointer',
                    background: 'rgb(240, 241, 245)',
                    color: '#1f2937',
                    border: '2px solid #d1d5db',
                    borderRadius: '25px',
                    fontWeight: '600',
                    fontSize: '0.9rem'
                  }}
                >
                  <i className="fas fa-sync-alt me-2"></i>
                  Load More Results
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Responsive CSS for Desktop */}
      <style jsx>{`
        @media (min-width: 768px) {
          .card-responsive {
            height: 380px !important; /* Taller cards on desktop */
          }
          
          .card-image-responsive {
            height: 160px !important; /* Larger image area on desktop */
          }
          
          .card-title-responsive {
            font-size: 0.9rem !important; /* Larger title on desktop */
            min-height: 2.2rem;
          }
          
          .card-description-responsive {
            font-size: 0.7rem !important; /* Slightly larger description */
            min-height: 2.4rem;
          }
          
          .card-price-responsive {
            font-size: 1rem !important; /* Larger price on desktop */
          }
          
          .card-button-responsive {
            font-size: 0.75rem !important; /* Larger button text */
            padding: 0.5rem !important;
          }
          
          .card-content-responsive {
            padding: 0.75rem !important; /* More padding on desktop */
          }
        }
        
        @media (min-width: 1024px) {
          .card-responsive {
            height: 400px !important; /* Even taller on larger screens */
          }
          
          .card-image-responsive {
            height: 180px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SearchResultsPage;