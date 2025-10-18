// src/SearchResultsPage.jsx - UPDATED WITH HEADER LIKE HOMEPAGE1 AND GLASS MORPHISM CARDS
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
  const [showSidebar, setShowSidebar] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState(null);

  // Categories data (same as HomePage1)
  const categoryData = [
    {
      id: "electronics",
      name: "Electronics & Devices",
      icon: "fa-microchip",
      color: "primary",
      description: "Laptops, smartphones, tablets, and gadgets",
      image: "https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      id: "general",
      name: "General Goods", 
      icon: "fa-tshirt",
      color: "warning",
      description: "Clothing, shoes, accessories, and daily items",
      image: "https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      id: "building",
      name: "Building & Hotels",
      icon: "fa-building",
      color: "success",
      description: "Hotels, apartments, and luxury properties",
      image: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      id: "vehicles",
      name: "Vehicles",
      icon: "fa-car",
      color: "danger",
      description: "Cars, motorcycles, and transportation",
      image: "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=600"
    }
  ];

  // Check user authentication
  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      setUser(JSON.parse(currentUser));
    }
  }, []);

  // Handle account click
  const handleAccountClick = () => {
    setShowAuthModal(true);
  };

  // Handle business auth
  const handleBusinessAuth = () => {
    const isBusinessAuthenticated = localStorage.getItem('businessAuthenticated') === 'true';
    if (isBusinessAuthenticated) {
      navigate('/business-dashboard');
    } else {
      navigate('/business-auth');
    }
  };

  // Sidebar Component (same as HomePage1)
  const Sidebar = () => {
    return (
      <div className={`offcanvas offcanvas-start ${showSidebar ? 'show' : ''}`} 
           style={{ 
             visibility: showSidebar ? 'visible' : 'hidden',
             width: '280px'
           }}
           tabIndex="-1">
        <div className="offcanvas-header border-bottom">
          <h5 className="offcanvas-title fw-bold text-primary">BisRun Menu</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowSidebar(false)}
          ></button>
        </div>
        <div className="offcanvas-body p-0">
          <div className="list-group list-group-flush">
            <button 
              className="list-group-item list-group-item-action border-0 py-3"
              onClick={() => {
                setShowSidebar(false);
                navigate('/');
              }}
            >
              <i className="fas fa-home me-3 text-primary"></i>
              Home
            </button>
            <button 
              className="list-group-item list-group-item-action border-0 py-3"
              onClick={() => {
                setShowSidebar(false);
                navigate('/search-results?q=');
              }}
            >
              <i className="fas fa-search me-3 text-primary"></i>
              Search
            </button>
            <button 
              className="list-group-item list-group-item-action border-0 py-3"
              onClick={() => {
                setShowSidebar(false);
                navigate('/categories');
              }}
            >
              <i className="fas fa-th-large me-3 text-primary"></i>
              Categories
            </button>
            <div className="border-top my-2"></div>
            <h6 className="px-3 pt-2 text-muted small">BUSINESS</h6>
            <button 
              className="list-group-item list-group-item-action border-0 py-3"
              onClick={() => {
                setShowSidebar(false);
                handleBusinessAuth();
              }}
            >
              <i className="fas fa-store me-3 text-success"></i>
              List Your Business
            </button>
            <button 
              className="list-group-item list-group-item-action border-0 py-3"
              onClick={() => {
                setShowSidebar(false);
                navigate('/business-dashboard');
              }}
            >
              <i className="fas fa-chart-line me-3 text-success"></i>
              Business Dashboard
            </button>
            <div className="border-top my-2"></div>
            <h6 className="px-3 pt-2 text-muted small">ACCOUNT</h6>
            {user ? (
              <>
                <div className="list-group-item border-0 py-3">
                  <div className="d-flex align-items-center">
                    <img 
                      src={user.picture || "https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=300"} 
                      alt={user.name}
                      className="rounded-circle me-3"
                      style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                    />
                    <div>
                      <div className="fw-bold">{user.name}</div>
                      <small className="text-muted">{user.email}</small>
                    </div>
                  </div>
                </div>
                <button 
                  className="list-group-item list-group-item-action border-0 py-3 text-danger"
                  onClick={() => {
                    setShowSidebar(false);
                    setUser(null);
                    localStorage.removeItem('currentUser');
                  }}
                >
                  <i className="fas fa-sign-out-alt me-3"></i>
                  Sign Out
                </button>
              </>
            ) : (
              <button 
                className="list-group-item list-group-item-action border-0 py-3"
                onClick={() => {
                  setShowSidebar(false);
                  setShowAuthModal(true);
                }}
              >
                <i className="fas fa-user me-3 text-primary"></i>
                Sign In / Register
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Auth Modal Component (simplified version)
  const AuthModal = () => {
    return (
      <div className={`modal fade ${showAuthModal ? 'show d-block' : ''}`} 
           style={{ 
             backgroundColor: 'rgba(0,0,0,0.5)', 
             position: 'fixed',
             top: 0,
             left: 0,
             right: 0,
             bottom: 0,
             zIndex: 9999
           }} 
           tabIndex="-1">
        <div className="d-flex align-items-center justify-content-center min-vh-100 p-3">
          <div className="modal-dialog modal-dialog-centered" 
               style={{ 
                 maxWidth: '420px',
                 width: '100%',
                 margin: '0 auto'
               }}>
            <div className="modal-content rounded-3 border shadow-lg" 
                 style={{ 
                   borderColor: '#e0e0e0', 
                   backdropFilter: 'blur(10px)',
                   transform: 'translateY(0)'
                 }}>
              
              {/* Header */}
              <div className="modal-header border-0 pb-0 pt-4 px-4">
                <div className="w-100 text-center">
                  <div className="avatar-placeholder mb-3 mx-auto">
                    <i className="fas fa-user display-4 text-primary"></i>
                  </div>
                  <h4 className="modal-title fw-bold text-dark mb-1" style={{ fontSize: '1.5rem' }}>
                    Authentication Required
                  </h4>
                  <p className="text-muted small mb-0">
                    Sign in to access all features
                  </p>
                </div>
                <button 
                  type="button" 
                  className="btn-close position-absolute top-0 end-0 m-3" 
                  onClick={() => setShowAuthModal(false)}
                  style={{ fontSize: '0.8rem' }}
                ></button>
              </div>
              
              {/* Body */}
              <div className="modal-body py-4 px-4 text-center">
                <p className="text-muted mb-4">
                  Please sign in to your account to continue.
                </p>
                
                <div className="d-grid gap-2">
                  <button
                    className="btn btn-primary btn-lg w-100 py-3 rounded-3 fw-medium"
                    onClick={() => {
                      setShowAuthModal(false);
                      // Simulate successful login
                      const userData = {
                        uid: 'demo-user',
                        name: 'Demo User',
                        email: 'demo@example.com',
                        picture: null,
                        emailVerified: true
                      };
                      setUser(userData);
                      localStorage.setItem('currentUser', JSON.stringify(userData));
                    }}
                    style={{ fontSize: '1rem' }}
                  >
                    <i className="fas fa-sign-in-alt me-2"></i>
                    Sign In (Demo)
                  </button>
                  
                  <button
                    className="btn btn-outline-dark btn-lg w-100 py-3 rounded-3 fw-medium"
                    onClick={() => setShowAuthModal(false)}
                    style={{ fontSize: '1rem' }}
                  >
                    <i className="fas fa-times me-2"></i>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

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

  // Handle category click
  const handleCategoryClick = (categoryName) => {
    navigate(`/search-results?q=${encodeURIComponent(categoryName)}`);
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

  // UPDATED: Function to render single black star with rating number
  const renderStars = (rating) => {
    const numRating = typeof rating === 'string' ? parseFloat(rating) : (rating || 4.0);
    return (
      <div className="d-flex align-items-center">
        <i
          className="fas fa-star me-1"
          style={{ fontSize: '0.7rem', color: '#000000' }}
        ></i>
        <small 
          className="text-dark"
          style={{ fontSize: '10px', fontWeight: '600' }}
        >
          {numRating.toFixed(1)}
        </small>
      </div>
    );
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
      <div className="min-vh-100 bg-silver d-flex justify-content-center align-items-center">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }}></div>
          <p className="text-dark">Loading search results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-silver">
      
      {/* Sidebar Overlay */}
      {showSidebar && (
        <div 
          className="modal-backdrop fade show" 
          onClick={() => setShowSidebar(false)}
        ></div>
      )}

      {/* Sidebar */}
      <Sidebar />

      {/* Auth Modal */}
      {showAuthModal && <AuthModal />}

      {/* Main Content */}
      <div className="container-fluid px-0 bg-silver">
        
        {/* Header Section - SAME AS HOMEPAGE1 */}
        <header className="bg-white border-bottom py-3 px-4 position-relative">
          <div className="d-flex align-items-center justify-content-between">
            
            {/* Left: Menu Button */}
            <button
              className="btn btn-lg p-2 me-3"
              onClick={() => setShowSidebar(true)}
              style={{ 
                background: '#f8f9fa',
                border: '1px solid #dee2e6',
                borderRadius: '12px',
                color: '#495057'
              }}
            >
              <i className="fas fa-bars"></i>
            </button>

            {/* Center: Logo */}
            <div className="flex-grow-1 text-center">
              <h1 className="h3 mb-0 fw-bold text-primary">
                BisRun
              </h1>
              <small className="text-muted opacity-75">
                Find Everything You Need
              </small>
            </div>

            {/* Right: Account Button */}
            <button
              className="btn btn-lg p-2 ms-3"
              onClick={handleAccountClick}
              style={{ 
                background: '#f8f9fa',
                border: '1px solid #dee2e6',
                borderRadius: '12px',
                color: '#495057'
              }}
            >
              <i className="fas fa-user"></i>
            </button>
          </div>
        </header>

        {/* Search Section - SAME AS HOMEPAGE1 */}
        <section className="px-4 py-4 bg-silver">
          <div className="row justify-content-center">
            <div className="col-12 col-md-10 col-lg-8">
              
              {/* Search Container */}
              <div className="position-relative">
                <form onSubmit={handleSearch}>
                  <div className="input-group input-group-lg shadow-sm" 
                       style={{ 
                         borderRadius: '16px',
                         overflow: 'hidden',
                         border: '2px solid #007bff'
                       }}>
                    
                    {/* Search Icon */}
                    <span className="input-group-text border-0 bg-white px-4">
                      <i className="fas fa-search text-muted"></i>
                    </span>
                    
                    {/* Search Input */}
                    <input
                      type="text"
                      className="form-control border-0 bg-white py-3"
                      placeholder="Search products, services, businesses..."
                      value={searchQuery}
                      onChange={handleSearchInputChange}
                      onFocus={handleSearchInputFocus}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                      style={{ 
                        fontSize: '1.1rem',
                        outline: 'none',
                        boxShadow: 'none'
                      }}
                    />
                    
                    {/* Search Button */}
                    <button
                      type="submit"
                      className="btn btn-primary px-4 border-0"
                      style={{ 
                        borderRadius: '0 14px 14px 0',
                        fontWeight: '600'
                      }}
                    >
                      Search
                    </button>
                  </div>
                </form>

                {/* Search Suggestions Dropdown */}
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div className="position-absolute top-100 start-0 end-0 mt-1 shadow-lg rounded-3 overflow-hidden z-3"
                       style={{ 
                         background: 'white',
                         border: '1px solid #dee2e6'
                       }}>
                    
                    {/* Recent Searches Header */}
                    {searchQuery.trim() === "" && recentSearches.length > 0 && (
                      <div className="d-flex justify-content-between align-items-center px-3 pt-3 pb-2 border-bottom">
                        <small className="text-muted fw-semibold">RECENT SEARCHES</small>
                        <button
                          className="btn btn-sm p-0 text-danger"
                          onClick={handleClearRecentSearches}
                          style={{ fontSize: '0.7rem' }}
                        >
                          Clear All
                        </button>
                      </div>
                    )}
                    
                    {/* Suggestions List */}
                    <div className="py-2">
                      {searchSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          className="btn btn-light w-100 text-start rounded-0 border-0 py-3 px-4 d-flex align-items-center"
                          onClick={() => handleSuggestionClick(suggestion)}
                          style={{ 
                            background: 'transparent',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = 'rgba(0, 123, 255, 0.1)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = 'transparent';
                          }}
                        >
                          <i className="fas fa-search text-muted me-3" style={{ fontSize: '0.8rem' }}></i>
                          <span className="text-dark" style={{ fontSize: '0.95rem' }}>
                            {suggestion}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Categories */}
              <div className="row g-2 mt-3">
                {categoryData.slice(0, 4).map((category) => (
                  <div key={category.id} className="col-6 col-sm-3">
                    <button
                      className="btn w-100 py-2 text-dark border rounded-3"
                      onClick={() => handleCategoryClick(category.name)}
                      style={{ 
                        background: '#f8f9fa',
                        border: '1px solid #dee2e6',
                        fontSize: '0.8rem',
                        fontWeight: '500'
                      }}
                    >
                      <i className={`fas ${category.icon} me-1`}></i>
                      {category.name.split(' ')[0]}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

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

              {/* GLASS MORPHISM CARDS WITH SILVER BACKGROUND - NO VIEW DETAILS BUTTON */}
              <div className="row g-3 justify-content-center">
                {searchResults.map((item) => (
                  <div key={item.id} className="col-6 col-sm-4 col-md-3 col-lg-2">
                    {/* GLASS MORPHISM CARD */}
                    <div 
                      className="glass-card"
                      style={{
                        width: '100%',
                        height: '254px',
                        backdropFilter: 'blur(7px)',
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        borderRadius: '26px',
                        boxShadow: `
                          35px 35px 68px 0px rgba(157, 177, 255, 0.2),
                          inset -8px -8px 16px 0px rgba(157, 177, 255, 0.6),
                          inset 0px 11px 28px 0px rgb(255, 255, 255)
                        `,
                        transition: 'all 0.3s',
                        cursor: 'pointer',
                        overflow: 'hidden',
                        position: 'relative'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = '35px 35px 68px 0px rgba(157, 177, 255, 0.5)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = `
                          35px 35px 68px 0px rgba(157, 177, 255, 0.2),
                          inset -8px -8px 16px 0px rgba(157, 177, 255, 0.6),
                          inset 0px 11px 28px 0px rgb(255, 255, 255)
                        `;
                      }}
                      onClick={() => navigate(`/product/${item.id}`)}
                    >
                      {/* Product Image */}
                      <div 
                        className="product-image-container"
                        style={{
                          width: '100%',
                          height: '120px',
                          overflow: 'hidden',
                          position: 'relative'
                        }}
                      >
                        <img
                          src={getItemImage(item)}
                          alt={item.name}
                          className="product-image"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'scale(1.05)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'scale(1)';
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
                              background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                              color: '#000',
                              padding: '3px 8px',
                              borderRadius: '12px',
                              fontSize: '9px',
                              fontWeight: 'bold',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                              backdropFilter: 'blur(5px)'
                            }}
                          >
                            <i className="fas fa-star me-1" style={{ fontSize: '7px' }}></i>
                            FEATURED
                          </div>
                        )}
                      </div>

                      {/* Card Body */}
                      <div 
                        className="card-body"
                        style={{
                          padding: '12px',
                          height: 'calc(100% - 120px)',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between'
                        }}
                      >
                        {/* Product Info */}
                        <div>
                          {/* Product Name */}
                          <h6 
                            className="product-name mb-1"
                            style={{
                              fontSize: '12px',
                              fontWeight: '700',
                              lineHeight: '1.2',
                              color: '#000',
                              marginBottom: '4px',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}
                          >
                            {item.name}
                          </h6>

                          {/* Business Name */}
                          <p 
                            className="business-name mb-1"
                            style={{
                              fontSize: '9px',
                              color: '#666',
                              fontWeight: '500',
                              marginBottom: '4px'
                            }}
                          >
                            {item.businessName || item.business}
                          </p>

                          {/* Description */}
                          <p 
                            className="description mb-2"
                            style={{
                              fontSize: '9px',
                              color: '#888',
                              lineHeight: '1.2',
                              marginBottom: '8px',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              minHeight: '20px'
                            }}
                          >
                            {truncateDescription(item.description)}
                          </p>
                        </div>

                        {/* Bottom Section - REMOVED VIEW DETAILS BUTTON */}
                        <div>
                          {/* Rating and Price Row */}
                          <div className="d-flex justify-content-between align-items-center">
                            {/* Rating */}
                            {renderStars(item.rating)}

                            {/* Price - UPDATED: BLUE COLOR */}
                            <div 
                              className="price"
                              style={{
                                fontSize: '12px',
                                fontWeight: '800',
                                color: '#2563eb', // BLUE COLOR
                                textShadow: '0 1px 2px rgba(37, 99, 235, 0.2)'
                              }}
                            >
                              {formatPrice(item)}
                            </div>
                          </div>

                          {/* REMOVED: View Details Button Section */}
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

      {/* Add CSS for silver background and glass morphism effects */}
      <style>
        {`
          .bg-silver {
            background: linear-gradient(135deg, #ffffffff 0%, #ffffffff 50%, #f0f0f0 100%) !important;
            background-color: #feffffff !important;
          }

          .glass-card:active {
            transform: scale(0.95);
            border: 1px solid rgba(37, 99, 235, 0.3); /* BLUE BORDER */
          }

          .glass-card {
            transition: all 0.3s;
          }

          .product-image {
            transition: transform 0.3s ease;
          }

          .product-image:hover {
            transform: scale(1.05);
          }

          /* Responsive adjustments */
          @media (max-width: 576px) {
            .col-6 {
              padding: 4px;
            }
            
            .glass-card {
              height: 240px !important;
            }
            
            .product-image-container {
              height: 110px !important;
            }
            
            .card-body {
              padding: 10px !important;
              height: calc(100% - 110px) !important;
            }
            
            .product-name {
              font-size: 11px !important;
            }
            
            .business-name {
              font-size: 8px !important;
            }
            
            .description {
              font-size: 8px !important;
            }
            
            .price {
              font-size: 11px !important;
            }
          }

          @media (min-width: 576px) {
            .col-sm-4 {
              padding: 6px;
            }
            
            .glass-card {
              height: 254px !important;
            }
          }

          @media (min-width: 768px) {
            .col-md-3 {
              padding: 8px;
            }
          }

          @media (min-width: 992px) {
            .col-lg-2 {
              padding: 10px;
            }
          }
        `}
      </style>
    </div>
  );
};

export default SearchResultsPage;