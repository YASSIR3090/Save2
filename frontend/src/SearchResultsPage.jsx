// src/SearchResultsPage.jsx - COMPLETE & WORKING VERSION WITH PROPER ROUTING
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

function SearchResultsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [allItems, setAllItems] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [sortBy, setSortBy] = useState("relevance");
  const [showSearchPage, setShowSearchPage] = useState(false);

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
    
    // Check for exact match first
    if (textLower.includes(queryLower)) {
      return { match: true, score: 1.0 };
    }
    
    // Check for partial matches
    if (queryLower.length >= 2) {
      // Check if any word in text starts with query
      const words = textLower.split(/\s+/);
      for (let word of words) {
        if (word.startsWith(queryLower.substring(0, Math.min(3, queryLower.length)))) {
          return { match: true, score: 0.8 };
        }
        if (queryLower.startsWith(word.substring(0, Math.min(3, word.length)))) {
          return { match: true, score: 0.8 };
        }
      }
      
      // Check using similarity score
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
    
    // For multiple word queries
    if (queryWords.length > 1) {
      for (let word of queryWords) {
        if (word.length >= 2 && textLower.includes(word)) {
          return { match: true, score: 0.7 };
        }
        
        for (let textWord of textLower.split(/\s+/)) {
          if (textWord.length >= 2) {
            const wordSimilarity = calculateSimilarity(textWord, word);
            if (wordSimilarity >= 0.6) {
              return { match: true, score: wordSimilarity };
            }
          }
        }
      }
    }
    
    return { match: false, score: 0 };
  };

  // Load all items from localStorage and sample data
  const loadAllItems = useCallback(() => {
    try {
      const allBusinesses = JSON.parse(localStorage.getItem('verifiedBusinesses')) || [];
      let storedProducts = [];
      let storedServices = [];
      
      allBusinesses.forEach(business => {
        const businessProducts = JSON.parse(localStorage.getItem(`products_${business.id}`)) || [];
        const businessServices = JSON.parse(localStorage.getItem(`services_${business.id}`)) || [];
        
        const productsWithBusiness = businessProducts.map(product => ({
          ...product,
          businessName: business.businessName,
          businessPhone: business.phone,
          businessEmail: business.email,
          businessAddress: business.address,
          type: "product"
        }));
        
        const servicesWithBusiness = businessServices.map(service => ({
          ...service,
          businessName: business.businessName,
          businessPhone: business.phone,
          businessEmail: business.email,
          businessAddress: business.address,
          type: "service"
        }));
        
        storedProducts = [...storedProducts, ...productsWithBusiness];
        storedServices = [...storedServices, ...servicesWithBusiness];
      });

      // Comprehensive sample data
      const sampleElectronics = [
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
          address: "Samora Avenue, Dar es Salaam",
          country: "Tanzania",
          region: "Dar es Salaam",
          city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=300"],
          lastUpdated: "2024-01-15",
          description: "High-performance business laptop with latest Intel Core i7 processor",
          specifications: ["Processor: Intel Core i7-1165G7", "RAM: 16GB DDR4", "Storage: 512GB SSD"],
          features: ["Backlit Keyboard", "Fingerprint Reader", "Windows 11 Pro"],
          brand: "Dell",
          condition: "new",
          requiresSpecifications: true,
          rating: 4.5,
          reviews: 23,
          type: "product"
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
          address: "Mlimani City Mall, Dar es Salaam",
          country: "Tanzania",
          region: "Dar es Salaam",
          city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=300"],
          lastUpdated: "2024-01-14",
          description: "Latest iPhone with titanium design and advanced camera system",
          specifications: ["Display: 6.7-inch Super Retina XDR", "Chip: A17 Pro", "Storage: 256GB"],
          features: ["Titanium Design", "48MP Camera", "5G Connectivity"],
          brand: "Apple",
          condition: "new",
          requiresSpecifications: true,
          rating: 4.8,
          reviews: 15,
          type: "product"
        }
      ];

      const sampleGeneralGoods = [
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
          address: "Mlimani City, Dar es Salaam",
          country: "Tanzania",
          region: "Dar es Salaam",
          city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=300"],
          lastUpdated: "2024-01-14",
          description: "Comfortable running shoes designed for maximum performance",
          features: ["Lightweight Design", "Breathable Mesh", "Shock Absorption"],
          brand: "RunPro",
          condition: "new",
          size: "L",
          color: "Black",
          material: "Mesh",
          requiresSpecifications: false,
          rating: 4.3,
          reviews: 15,
          type: "product"
        }
      ];

      const sampleBuildingHotels = [
        {
          id: "hotel-1",
          name: "Serengeti Luxury Hotel",
          category: "Building & Hotels",
          serviceType: "Hotel",
          priceRange: "150-300",
          currency: "USD",
          currencySymbol: "$",
          business: "Serengeti Hospitality Group",
          location: { lat: -6.8155, lng: 39.2861 },
          address: "Masaki, Dar es Salaam",
          country: "Tanzania",
          region: "Dar es Salaam",
          city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=300"],
          lastUpdated: "2024-01-15",
          description: "5-star luxury hotel with premium amenities and excellent service",
          amenities: ["Swimming Pool", "Spa", "Restaurant", "Free WiFi", "24/7 Room Service"],
          services: ["Room Service", "Airport Transfer", "Tour Booking", "Laundry Service"],
          contactInfo: "+255 789 456 123 | info@serengetihotel.com",
          capacity: "100 guests, 50 luxury rooms",
          rating: "5",
          checkInTime: "14:00",
          checkOutTime: "12:00",
          policies: "Free cancellation 24 hours before check-in",
          type: "service"
        }
      ];

      const sampleVehicles = [
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
          address: "Masaki, Dar es Salaam",
          country: "Tanzania",
          region: "Dar es Salaam",
          city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=300"],
          lastUpdated: "2024-01-14",
          description: "Luxury SUV with premium features",
          features: ["4.6L V8 Engine", "Leather Interior", "Sunroof", "Navigation System"],
          brand: "Toyota",
          condition: "new",
          requiresSpecifications: false,
          rating: 4.8,
          reviews: 12,
          type: "product"
        }
      ];

      const allItems = [
        ...sampleElectronics,
        ...sampleGeneralGoods, 
        ...sampleBuildingHotels,
        ...sampleVehicles,
        ...storedProducts,
        ...storedServices
      ];

      setAllItems(allItems);
      return allItems;
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
      if (item.brand && fuzzySearch(item.brand, query).match) {
        suggestions.add(item.brand);
      }
      if (item.businessName && fuzzySearch(item.businessName, query).match) {
        suggestions.add(item.businessName);
      }
      if (item.serviceType && fuzzySearch(item.serviceType, query).match) {
        suggestions.add(item.serviceType);
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
        ${item.brand || ''}
        ${item.serviceType || ''}
        ${item.description || ''}
        ${item.country || ''}
        ${item.city || ''}
        ${item.region || ''}
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
  useEffect(() => {
    const initializeSearch = async () => {
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
      } catch (error) {
        console.error("Search initialization error:", error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    initializeSearch();
  }, [location.search, loadAllItems, performSearch, sortResults, sortBy, loadRecentSearches]);

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

  // Handle search suggestion click
  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    navigate(`/search-results?q=${encodeURIComponent(suggestion)}`);
  };

  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    navigate(`/search-results?q=${encodeURIComponent(searchQuery)}`);
  };

  // Handle sort change
  const handleSortChange = (e) => {
    const newSortBy = e.target.value;
    setSortBy(newSortBy);
    
    const sortedResults = sortResults(searchResults, newSortBy);
    setSearchResults(sortedResults);
  };

  const handleBackToSearch = () => {
    navigate('/search');
  };

  const handleViewDetails = (itemId) => {
    navigate(`/product/${itemId}`);
  };

  const formatPrice = (item) => {
    if (item.type === 'service') {
      return `${item.currencySymbol || '$'} ${item.priceRange}`;
    }
    return `${item.currencySymbol || '$'} ${item.price?.toLocaleString() || '0'}`;
  };

  const getCategoryBadge = (category) => {
    switch(category) {
      case 'Electronics & Devices':
        return 'bg-primary';
      case 'General Goods':
        return 'bg-warning';
      case 'Building & Hotels':
        return 'bg-success';
      case 'Vehicles':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  };

  const getItemImage = (item) => {
    if (item.images && item.images.length > 0) {
      return item.images[0];
    }
    return 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=300';
  };

  const renderStars = (rating) => {
    const numRating = typeof rating === 'string' ? parseFloat(rating) : (rating || 4.0);
    return Array.from({ length: 5 }, (_, index) => (
      <i
        key={index}
        className={`fas fa-star ${index < Math.floor(numRating) ? 'text-warning' : 'text-light'}`}
        style={{ fontSize: '0.7rem' }}
      ></i>
    ));
  };

  const toggleViewMode = () => {
    setViewMode(prevMode => prevMode === 'grid' ? 'list' : 'grid');
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    navigate('/search-results');
  };

  // Search Page Component
  const SearchPage = () => {
    return (
      <div className="min-vh-100 bg-white" style={{ zIndex: 1040, position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
        <div className="bg-white border-bottom shadow-sm">
          <div className="container-fluid p-3">
            <div className="row align-items-center">
              <div className="col-auto">
                <button
                  className="btn btn-light rounded-circle"
                  onClick={() => setShowSearchPage(false)}
                  style={{ 
                    width: '45px', 
                    height: '45px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <i className="fas fa-arrow-left"></i>
                </button>
              </div>
              
              <div className="col">
                <form onSubmit={handleSearchSubmit}>
                  <div className="input-group input-group-lg position-relative">
                    <input
                      type="text"
                      className="form-control border-0 bg-light rounded-pill ps-4"
                      placeholder="Search products, services..."
                      value={searchQuery}
                      onChange={handleSearchInputChange}
                      style={{ fontSize: '1rem' }}
                      autoFocus
                    />
                    
                    <button
                      type="submit"
                      className="btn btn-primary rounded-pill position-absolute end-0 top-50 translate-middle-y me-2"
                      style={{ 
                        width: '40px', 
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <i className="fas fa-search text-white"></i>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {showSuggestions && searchSuggestions.length > 0 && (
          <div className="container-fluid mt-2">
            <div className="row">
              <div className="col-12">
                <div className="bg-white border rounded-3 shadow-sm">
                  {searchSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      className="btn btn-light w-100 text-start p-3 border-bottom"
                      onClick={() => handleSuggestionClick(suggestion)}
                      style={{ 
                        border: 'none',
                        borderRadius: '0',
                        fontSize: '1rem'
                      }}
                    >
                      <div className="d-flex align-items-center">
                        <i className="fas fa-search me-3 text-muted"></i>
                        <div>
                          <div className="fw-semibold text-dark">{suggestion}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {!showSuggestions && recentSearches.length > 0 && (
          <div className="container-fluid mt-3">
            <div className="row">
              <div className="col-12">
                <h6 className="text-muted mb-3 px-3">Recent Searches</h6>
                <div className="bg-white border rounded-3 shadow-sm">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      className="btn btn-light w-100 text-start p-3 border-bottom"
                      onClick={() => handleSuggestionClick(search)}
                      style={{ 
                        border: 'none',
                        borderRadius: '0',
                        fontSize: '1rem'
                      }}
                    >
                      <div className="d-flex align-items-center">
                        <i className="fas fa-clock me-3 text-muted"></i>
                        <div>
                          <div className="fw-semibold text-dark">{search}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="container-fluid" style={{ paddingTop: '20px', paddingBottom: '80px' }}>
          {searchQuery.trim() === "" && (
            <div className="text-center py-5">
              <i className="fas fa-search fa-4x text-muted mb-4"></i>
              <h4 className="text-muted fw-bold mb-3">Search for Products & Services</h4>
              <p className="text-muted">Enter your search terms above to find items</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (showSearchPage) {
    return <SearchPage />;
  }

  if (isLoading) {
    return (
      <div className="min-vh-100 bg-light d-flex justify-content-center align-items-center">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }}></div>
          <p className="text-muted">Loading search results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100" style={{ background: "linear-gradient(white,white, #fdfbfdea 100%)" }}>
      {/* Header with Search Bar */}
      <div className="bg-white shadow-sm sticky-top">
        <div className="container-fluid py-3">
          <div className="row align-items-center">
            <div className="col-auto">
              <button
                className="btn btn-light rounded-circle"
                onClick={handleBackToSearch}
                style={{ 
                  width: '45px', 
                  height: '45px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <i className="fas fa-arrow-left"></i>
              </button>
            </div>
            
            <div className="col position-relative">
              <div className="input-group input-group-lg position-relative">
                <input
                  type="text"
                  className="form-control border-0 bg-light rounded-pill ps-5"
                  placeholder="Search products, services..."
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  onFocus={() => setShowSearchPage(true)}
                  style={{ fontSize: '1rem' }}
                />
                <div className="position-absolute top-50 start-0 translate-middle-y ps-3">
                  <i className="fas fa-search text-muted"></i>
                </div>
              </div>

              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="position-absolute top-100 start-0 end-0 mt-1 z-3">
                  <div className="bg-white border rounded-3 shadow-sm">
                    {searchSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        className="btn btn-light w-100 text-start p-3 border-bottom"
                        onClick={() => handleSuggestionClick(suggestion)}
                        style={{ 
                          border: 'none',
                          borderRadius: '0',
                          fontSize: '0.9rem'
                        }}
                      >
                        <div className="d-flex align-items-center">
                          <i className="fas fa-search me-3 text-muted"></i>
                          <div>
                            <div className="fw-semibold text-dark">{suggestion}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="col-auto">
              <span className="badge bg-primary fs-6">
                {searchResults.length} {searchResults.length === 1 ? 'item' : 'items'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="container-fluid py-4">
        {searchResults.length === 0 ? (
          <div className="text-center py-5">
            <div className="mb-4">
              <i className="fas fa-search fa-4x text-muted mb-3"></i>
            </div>
            <h3 className="text-dark mb-3">No Results Found</h3>
            <p className="text-muted mb-4">
              {searchQuery ? `No items found for "${searchQuery}". Try different keywords.` : 'Please enter a search term to find items.'}
            </p>
            <div className="d-flex gap-3 justify-content-center">
              <button
                className="btn btn-primary btn-lg rounded-pill px-4"
                onClick={handleClearSearch}
              >
                <i className="fas fa-backspace me-2"></i>
                Clear Search
              </button>
              <button
                className="btn btn-outline-primary btn-lg rounded-pill px-4"
                onClick={handleBackToSearch}
              >
                <i className="fas fa-arrow-left me-2"></i>
                Back to Search
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Search Summary and Controls */}
            <div className="row mb-4">
              <div className="col-12">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                  <div>
                    <h5 className="text-dark fw-bold mb-1">
                      Showing {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'}
                      {searchResults.some(item => item.isFuzzyMatch) && " (showing similar matches)"}
                    </h5>
                    {searchQuery && (
                      <p className="text-muted mb-0">for "<strong>{searchQuery}</strong>"</p>
                    )}
                  </div>
                  
                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    {/* Sort Dropdown */}
                    <div className="dropdown">
                      <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                        <i className="fas fa-sort me-2"></i>
                        Sort: {sortBy === 'relevance' ? 'Relevance' : 
                              sortBy === 'price-low' ? 'Price: Low to High' :
                              sortBy === 'price-high' ? 'Price: High to Low' : 'Rating'}
                      </button>
                      <ul className="dropdown-menu">
                        <li><button className="dropdown-item" onClick={() => handleSortChange({target: {value: 'relevance'}})}>Relevance</button></li>
                        <li><button className="dropdown-item" onClick={() => handleSortChange({target: {value: 'price-low'}})}>Price: Low to High</button></li>
                        <li><button className="dropdown-item" onClick={() => handleSortChange({target: {value: 'price-high'}})}>Price: High to Low</button></li>
                        <li><button className="dropdown-item" onClick={() => handleSortChange({target: {value: 'rating'}})}>Highest Rating</button></li>
                      </ul>
                    </div>

                    {/* View Mode Toggle */}
                    <div className="btn-group view-mode-toggle" role="group">
                      <button
                        type="button"
                        className={`btn ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline-primary'} d-flex align-items-center gap-2`}
                        onClick={() => setViewMode('grid')}
                        title="Grid View"
                        style={{ 
                          padding: '0.5rem 1rem',
                          fontSize: '0.875rem',
                          fontWeight: '500'
                        }}
                      >
                        <i className="fas fa-th"></i>
                        <span>Grid</span>
                      </button>
                      <button
                        type="button"
                        className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-outline-primary'} d-flex align-items-center gap-2`}
                        onClick={() => setViewMode('list')}
                        title="List View"
                        style={{ 
                          padding: '0.5rem 1rem',
                          fontSize: '0.875rem',
                          fontWeight: '500'
                        }}
                      >
                        <i className="fas fa-list"></i>
                        <span>List</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Grid/List */}
            <div className={`row ${viewMode === 'grid' ? 'g-3' : 'g-3'}`}>
              {searchResults.map((item, index) => 
                viewMode === 'grid' ? renderGridView(item) : renderListView(item, index)
              )}
            </div>
          </>
        )}
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .product-card {
          transition: all 0.3s ease;
        }
        .product-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.1) !important;
        }
        
        .card {
          border-radius: 10px !important;
          overflow: hidden;
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
        }
        
        .btn-primary:hover {
          background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
          transform: translateY(-1px);
        }

        .view-mode-toggle .btn {
          transition: all 0.3s ease;
          border-radius: 8px !important;
        }
        
        .view-mode-toggle .btn:first-child {
          border-top-right-radius: 0 !important;
          border-bottom-right-radius: 0 !important;
        }
        
        .view-mode-toggle .btn:last-child {
          border-top-left-radius: 0 !important;
          border-bottom-left-radius: 0 !important;
        }
        
        .view-mode-toggle .btn:hover {
          transform: translateY(-1px);
        }
        
        .view-mode-toggle .btn-primary {
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
        }

        @media (max-width: 576px) {
          .container-fluid {
            padding-left: 8px;
            padding-right: 8px;
          }
          
          .card-body {
            padding: 0.5rem !important;
          }
          
          .btn {
            font-size: 0.75rem;
          }
          
          .badge {
            font-size: 0.6rem;
          }
          
          .small {
            font-size: 0.75rem;
          }
          
          .view-mode-toggle .btn {
            padding: 0.375rem 0.75rem !important;
            font-size: 0.75rem !important;
          }
          
          .view-mode-toggle .btn span {
            display: none;
          }
          
          .view-mode-toggle .btn i {
            margin-right: 0 !important;
          }

          .dropdown .btn {
            font-size: 0.75rem;
            padding: 0.375rem 0.75rem;
          }
        }

        @media (min-width: 768px) {
          .row.g-3 {
            margin-left: -0.5rem;
            margin-right: -0.5rem;
          }
          
          .row.g-3 > [class*="col-"] {
            padding-left: 0.5rem;
            padding-right: 0.5rem;
          }
          
          .view-mode-toggle .btn span {
            display: inline;
          }
        }
      `}</style>
    </div>
  );

  // Helper functions for rendering items
  function renderGridView(item) {
    return (
      <div key={item.id} className="col-6 col-md-4 col-lg-3 col-xl-2">
        <div 
          className="card h-100 border-0 shadow-sm product-card"
          onClick={() => handleViewDetails(item.id)}
          style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
        >
          <div className="position-relative overflow-hidden">
            <img
              src={getItemImage(item)}
              className="card-img-top"
              alt={item.name}
              style={{ 
                height: '120px', 
                objectFit: 'cover',
                width: '100%'
              }}
              onError={(e) => {
                e.target.src = 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=300';
              }}
            />
            
            <div className="position-absolute top-0 end-0 m-2">
              <span className={`badge ${getCategoryBadge(item.category)} text-white`}>
                {item.category}
              </span>
            </div>
            
            {item.isFuzzyMatch && (
              <div className="position-absolute top-0 start-0 m-2">
                <span className="badge bg-warning text-dark">
                  <i className="fas fa-lightbulb me-1"></i>
                  Similar
                </span>
              </div>
            )}
          </div>
          
          <div className="card-body d-flex flex-column p-2">
            <h6 className="card-title text-dark fw-bold mb-1" style={{ fontSize: '0.8rem' }}>
              {item.name}
            </h6>
            
            <p className="card-text text-muted small mb-1" style={{ fontSize: '0.7rem' }}>
              {item.businessName || item.business}
            </p>
            
            <div className="d-flex align-items-center mb-1">
              <div className="me-1">
                {renderStars(item.rating)}
              </div>
              <small className="text-muted ms-1" style={{ fontSize: '0.65rem' }}>
                ({item.reviews || 0})
              </small>
            </div>
            
            <div className="mt-auto">
              <div className="d-flex justify-content-between align-items-center">
                <span className="fw-bold text-primary" style={{ fontSize: '0.85rem' }}>
                  {formatPrice(item)}
                </span>
                
                {item.type === 'product' && item.stock && (
                  <small className={`text-${item.stock > 0 ? 'success' : 'danger'}`} style={{ fontSize: '0.65rem' }}>
                    {item.stock > 0 ? `${item.stock} in stock` : 'Out of stock'}
                  </small>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderListView(item, index) {
    return (
      <div key={item.id} className="col-12">
        <div 
          className="card border-0 shadow-sm mb-2 product-card"
          onClick={() => handleViewDetails(item.id)}
          style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
        >
          <div className="row g-0">
            <div className="col-4 col-md-3 col-lg-2">
              <img
                src={getItemImage(item)}
                className="img-fluid rounded-start"
                alt={item.name}
                style={{ 
                  height: '120px', 
                  objectFit: 'cover',
                  width: '100%'
                }}
                onError={(e) => {
                  e.target.src = 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=300';
                }}
              />
            </div>
            
            <div className="col-8 col-md-9 col-lg-10">
              <div className="card-body d-flex flex-column h-100 p-3">
                <div className="d-flex justify-content-between align-items-start mb-1">
                  <div className="flex-grow-1">
                    <h6 className="card-title text-dark fw-bold mb-1">
                      {item.name}
                    </h6>
                    
                    <div className="d-flex align-items-center flex-wrap gap-2 mb-1">
                      <span className={`badge ${getCategoryBadge(item.category)} text-white`}>
                        {item.category}
                      </span>
                      
                      {item.isFuzzyMatch && (
                        <span className="badge bg-warning text-dark">
                          <i className="fas fa-lightbulb me-1"></i>
                          Similar Match
                        </span>
                      )}
                      
                      <span className="text-muted small">
                        {item.businessName || item.business}
                      </span>
                    </div>
                    
                    <p className="card-text text-muted small mb-2 d-none d-md-block">
                      {item.description?.substring(0, 100)}...
                    </p>
                  </div>
                  
                  <div className="text-end ms-2">
                    <div className="fw-bold text-primary h6 mb-1">
                      {formatPrice(item)}
                    </div>
                    
                    <div className="d-flex align-items-center justify-content-end mb-1">
                      <div className="me-1">
                        {renderStars(item.rating)}
                      </div>
                      <small className="text-muted ms-1">
                        ({item.reviews || 0})
                      </small>
                    </div>
                    
                    {item.type === 'product' && item.stock && (
                      <small className={`text-${item.stock > 0 ? 'success' : 'danger'}`}>
                        {item.stock > 0 ? `${item.stock} in stock` : 'Out of stock'}
                      </small>
                    )}
                  </div>
                </div>
                
                <div className="mt-auto d-flex justify-content-between align-items-center">
                  <div className="d-flex gap-2 flex-wrap">
                    {item.features && item.features.slice(0, 3).map((feature, idx) => (
                      <span key={idx} className="badge bg-light text-dark border small">
                        {feature}
                      </span>
                    ))}
                  </div>
                  
                  <button 
                    className="btn btn-primary btn-sm rounded-pill px-3"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewDetails(item.id);
                    }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SearchResultsPage;