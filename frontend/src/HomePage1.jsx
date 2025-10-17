// src/HomePage1.jsx - REDESIGNED HEADER LIKE AMAZON MOBILE
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { auth, googleProvider } from './firebase.jsx';
import { signInWithPopup, signOut, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

function HomePage1() {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authMode, setAuthMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [currentLanguage, setCurrentLanguage] = useState("ENG");
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [dataLastUpdated, setDataLastUpdated] = useState(null);
  
  // New state for dynamic placeholder with animation
  const [placeholderText, setPlaceholderText] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const languages = [
    { code: "ENG", name: "English", flag: "🇺🇸" },
    { code: "SWA", name: "Kiswahili", flag: "🇹🇿" },
    { code: "FRA", name: "Français", flag: "🇫🇷" },
    { code: "SPA", name: "Español", flag: "🇪🇸" },
    { code: "ARA", name: "العربية", flag: "🇸🇦" },
    { code: "CHI", name: "中文", flag: "🇨🇳" },
    { code: "HIN", name: "हिन्दी", flag: "🇮🇳" },
    { code: "POR", name: "Português", flag: "🇵🇹" },
    { code: "RUS", name: "Русский", flag: "🇷🇺" },
    { code: "JPN", name: "日本語", flag: "🇯🇵" },
    { code: "GER", name: "Deutsch", flag: "🇩🇪" },
    { code: "ITA", name: "Italiano", flag: "🇮🇹" },
    { code: "KOR", name: "한국어", flag: "🇰🇷" },
    { code: "TUR", name: "Türkçe", flag: "🇹🇷" },
    { code: "DUT", name: "Nederlands", flag: "🇳🇱" },
    { code: "SWE", name: "Svenska", flag: "🇸🇪" }
  ];

  // Dynamic placeholder texts
  const placeholderTexts = [
    "Search products...",
    "Search services...", 
    "Search businesses...",
    "Search electronics...",
    "Search hotels...",
    "Search vehicles...",
    "Search fashion...",
    "Find anything..."
  ];

  // Smooth placeholder animation effect
  useEffect(() => {
    let currentTimeout;
    
    const animatePlaceholder = () => {
      setIsAnimating(true);
      setPlaceholderText("");
      
      const currentText = placeholderTexts[placeholderIndex];
      let charIndex = 0;
      
      // Type animation
      const typeInterval = setInterval(() => {
        if (charIndex < currentText.length) {
          setPlaceholderText(currentText.substring(0, charIndex + 1));
          charIndex++;
        } else {
          clearInterval(typeInterval);
          
          // Wait before starting next animation
          currentTimeout = setTimeout(() => {
            setIsAnimating(false);
            setPlaceholderIndex((prevIndex) => (prevIndex + 1) % placeholderTexts.length);
          }, 2000);
        }
      }, 100);
    };

    if (!isAnimating) {
      animatePlaceholder();
    }

    return () => {
      if (currentTimeout) clearTimeout(currentTimeout);
    };
  }, [placeholderIndex, isAnimating, placeholderTexts]);

  // Categories data
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

  // Countries
  const countries = [
    { code: "TZ", name: "Tanzania", flag: "🇹🇿" },
    { code: "KE", name: "Kenya", flag: "🇰🇪" },
    { code: "UG", name: "Uganda", flag: "🇺🇬" },
    { code: "US", name: "United States", flag: "🇺🇸" },
    { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
    { code: "CN", name: "China", flag: "🇨🇳" }
  ];

  // Handle language change
  const handleLanguageChange = (languageCode) => {
    setCurrentLanguage(languageCode);
    setShowLanguageDropdown(false);
    console.log("Language changed to:", languageCode);
  };

  // Authentication Functions
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userData = {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          picture: user.photoURL,
          emailVerified: user.emailVerified
        };
        setUser(userData);
        localStorage.setItem('currentUser', JSON.stringify(userData));
      } else {
        setUser(null);
        localStorage.removeItem('currentUser');
      }
    });

    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      setAuthLoading(true);
      setAuthError("");
      
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      const userData = {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        picture: user.photoURL,
        emailVerified: user.emailVerified
      };
      
      setUser(userData);
      localStorage.setItem('currentUser', JSON.stringify(userData));
      setShowAuthModal(false);
      
    } catch (error) {
      console.error("Google authentication failed:", error);
      setAuthError("Error signing in with Google. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    try {
      setAuthLoading(true);
      setAuthError("");
      
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;
      
      const userData = {
        uid: user.uid,
        name: user.email.split('@')[0],
        email: user.email,
        picture: null,
        emailVerified: user.emailVerified
      };
      
      setUser(userData);
      localStorage.setItem('currentUser', JSON.stringify(userData));
      setShowAuthModal(false);
      
    } catch (error) {
      console.error("Email sign up failed:", error);
      setAuthError(error.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    try {
      setAuthLoading(true);
      setAuthError("");
      
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;
      
      const userData = {
        uid: user.uid,
        name: user.displayName || user.email.split('@')[0],
        email: user.email,
        picture: user.photoURL,
        emailVerified: user.emailVerified
      };
      
      setUser(userData);
      localStorage.setItem('currentUser', JSON.stringify(userData));
      setShowAuthModal(false);
      
    } catch (error) {
      console.error("Email sign in failed:", error);
      setAuthError(error.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      localStorage.removeItem('currentUser');
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const handleAccountClick = () => {
    setShowAuthModal(true);
  };

  const handleBusinessDashboard = () => {
    if (user) {
      navigate('/business-dashboard');
    } else {
      setShowAuthModal(true);
    }
  };

  // CRITICAL FIX: Improved data loading with real-time updates
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

  // Load featured items and categories
  const loadHomeData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Set categories
      setCategories(categoryData);

      // Load ALL items from localStorage (CRITICAL FIX)
      const storedItems = loadAllItemsFromStorage();

      // Comprehensive sample data (fallback)
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
        }
      ];

      // Combine stored items with sample items
      const combinedItems = [...storedItems, ...sampleItems];
      
      // Select featured items (prioritize stored items)
      const featured = combinedItems
        .filter(item => item.featured)
        .sort((a, b) => {
          // Prioritize stored items over sample items
          if (a.id.includes('elec-') || a.id.includes('gen-') || a.id.includes('hotel-') || a.id.includes('veh-')) {
            return 1; // Sample items go to end
          }
          return -1; // Stored items come first
        })
        .slice(0, 12);

      setFeaturedItems(featured);
      
      // Update data timestamp
      setDataLastUpdated(localStorage.getItem('dataLastUpdated'));

    } catch (error) {
      console.error("Error loading home data:", error);
      // Fallback to sample data
      setFeaturedItems(categoryData.map(cat => ({
        id: cat.id,
        name: cat.name,
        category: cat.name,
        price: 100000,
        currencySymbol: "TSh",
        images: [cat.image],
        rating: 4.5,
        country: "Tanzania",
        description: cat.description
      })));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get user location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          setUserLocation({ lat: -6.7924, lng: 39.2083 });
        }
      );
    }
  };

  // Load recent searches from localStorage
  const loadRecentSearches = () => {
    try {
      const recent = JSON.parse(localStorage.getItem('recentSearches')) || [];
      setRecentSearches(recent.slice(0, 5));
    } catch (error) {
      console.error("Error loading recent searches:", error);
    }
  };

  // Save search to recent searches
  const saveToRecentSearches = (query) => {
    try {
      const recent = JSON.parse(localStorage.getItem('recentSearches')) || [];
      // Remove if already exists
      const filtered = recent.filter(item => item.toLowerCase() !== query.toLowerCase());
      // Add to beginning
      filtered.unshift(query);
      // Keep only last 10 searches
      const updated = filtered.slice(0, 10);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
      setRecentSearches(updated.slice(0, 5));
    } catch (error) {
      console.error("Error saving recent search:", error);
    }
  };

  // Generate search suggestions based on products and categories
  const generateSearchSuggestions = (query) => {
    if (!query.trim()) return [];

    const queryLower = query.toLowerCase();
    const suggestions = new Set();

    // Add recent searches that match
    recentSearches.forEach(search => {
      if (search.toLowerCase().includes(queryLower)) {
        suggestions.add(search);
      }
    });

    // Add categories that match
    categories.forEach(category => {
      if (category.name.toLowerCase().includes(queryLower)) {
        suggestions.add(category.name);
      }
    });

    // Add product names from featured items that match
    featuredItems.forEach(item => {
      if (item.name.toLowerCase().includes(queryLower)) {
        suggestions.add(item.name);
      }
      if (item.business?.toLowerCase().includes(queryLower)) {
        suggestions.add(item.business);
      }
    });

    // Add common search terms
    const commonTerms = [
      "laptop", "phone", "hotel", "car", "shoes", "clothing",
      "electronics", "restaurant", "apartment", "house", "land",
      "motorcycle", "bicycle", "furniture", "jewelry", "watch",
      "camera", "television", "refrigerator", "air conditioner"
    ];

    commonTerms.forEach(term => {
      if (term.includes(queryLower) && queryLower.length >= 2) {
        suggestions.add(term.charAt(0).toUpperCase() + term.slice(1));
      }
    });

    return Array.from(suggestions).slice(0, 8);
  };

  // CRITICAL FIX: Listen for data updates
  useEffect(() => {
    const checkForDataUpdates = () => {
      const lastUpdate = localStorage.getItem('dataLastUpdated');
      if (lastUpdate !== dataLastUpdated) {
        console.log('Data updated detected, reloading...');
        loadHomeData();
      }
    };

    // Check every 2 seconds for updates
    const interval = setInterval(checkForDataUpdates, 2000);
    return () => clearInterval(interval);
  }, [dataLastUpdated, loadHomeData]);

  useEffect(() => {
    loadHomeData();
    getUserLocation();
    loadRecentSearches();
  }, [loadHomeData]);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      saveToRecentSearches(searchQuery.trim());
      navigate(`/search-results?q=${encodeURIComponent(searchQuery)}`);
      setShowSuggestions(false);
    }
  };

  // Handle search input change
  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.trim() !== "") {
      const suggestions = generateSearchSuggestions(value);
      setSearchSuggestions(suggestions);
      setShowSuggestions(suggestions.length > 0);
    } else {
      setShowSuggestions(false);
      setSearchSuggestions([]);
    }
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

  // Handle search input blur
  const handleSearchInputBlur = () => {
    // Delay hiding suggestions to allow for clicking on them
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  // Handle search suggestion click
  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    saveToRecentSearches(suggestion);
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

  // Handle featured item click
  const handleFeaturedItemClick = (itemId) => {
    navigate(`/product/${itemId}`);
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

  // Render stars for rating
  const renderStars = (rating) => {
    const numRating = typeof rating === 'string' ? parseFloat(rating) : (rating || 4.0);
    return Array.from({ length: 5 }, (_, index) => (
      <i
        key={index}
        className={`fas fa-star ${index < Math.floor(numRating) ? 'text-warning' : 'text-light'}`}
        style={{ fontSize: '0.8rem' }}
      ></i>
    ));
  };

  // Format price
  const formatPrice = (item) => {
    if (item.type === 'service') {
      return `${item.currencySymbol || '$'} ${item.priceRange}`;
    }
    return `${item.currencySymbol || '$'} ${item.price?.toLocaleString() || '0'}`;
  };

  // Get country flag
  const getCountryFlag = (countryName) => {
    const country = countries.find(c => c.name === countryName);
    return country?.flag || '🏳️';
  };

  // Sidebar Component
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
            <Link to="/" className="list-group-item list-group-item-action border-0 py-3">
              <i className="fas fa-home me-3 text-primary"></i>
              Home
            </Link>
            <Link to="/search-results" className="list-group-item list-group-item-action border-0 py-3">
              <i className="fas fa-search me-3 text-primary"></i>
              Search
            </Link>
            <Link to="/categories" className="list-group-item list-group-item-action border-0 py-3">
              <i className="fas fa-th-large me-3 text-primary"></i>
              Categories
            </Link>
            <div className="border-top my-2"></div>
            <h6 className="px-3 pt-2 text-muted small">BUSINESS</h6>
            <button 
              className="list-group-item list-group-item-action border-0 py-3"
              onClick={handleBusinessAuth}
            >
              <i className="fas fa-store me-3 text-success"></i>
              List Your Business
            </button>
            <Link to="/business-dashboard" className="list-group-item list-group-item-action border-0 py-3">
              <i className="fas fa-chart-line me-3 text-success"></i>
              Business Dashboard
            </Link>
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
                  onClick={handleSignOut}
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

  // Authentication Modal Component
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
                    <i className="fas fa-user-circle display-4 text-primary"></i>
                  </div>
                  <h4 className="modal-title fw-bold text-dark mb-1" style={{ fontSize: '1.5rem' }}>
                    {user ? "Account Settings" : authMode === "signin" ? "Welcome Back" : "Join BisRun"}
                  </h4>
                  <p className="text-muted small mb-0">
                    {user ? "Manage your account" : authMode === "signin" ? "Sign in to your account" : "Create your account to get started"}
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
              <div className="modal-body py-4 px-4">
                {user ? (
                  // User Profile View
                  <div className="text-center">
                    <div className="mb-4">
                      <img 
                        src={user.picture || "https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=300"} 
                        alt={user.name}
                        className="rounded-circle border"
                        style={{ 
                          width: '80px', 
                          height: '80px', 
                          objectFit: 'cover',
                          border: '3px solid #f8f9fa'
                        }}
                      />
                      <h5 className="mt-3 mb-1 fw-bold">{user.name}</h5>
                      <p className="text-muted mb-3">{user.email}</p>
                      <div className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill">
                        <i className="fas fa-check-circle me-2"></i>
                        {user.emailVerified ? "Email Verified" : "Email Not Verified"}
                      </div>
                    </div>
                    
                    <div className="row text-start small text-muted mb-4">
                      <div className="col-12 mb-2">
                        <i className="fas fa-user me-2"></i>
                        ID: {user.uid.substring(0, 8)}...
                      </div>
                      <div className="col-12">
                        <i className="fas fa-shield-alt me-2"></i>
                        Secure Authentication
                      </div>
                    </div>

                    <div className="d-grid gap-2 mb-3">
                      <button
                        className="btn btn-primary w-100 py-3 rounded-3 fw-medium"
                        onClick={handleBusinessDashboard}
                        style={{ fontSize: '1rem' }}
                      >
                        <i className="fas fa-chart-line me-2"></i>
                        Go to Business Dashboard
                      </button>
                    </div>
                    
                    <button
                      className="btn btn-outline-danger w-100 py-3 rounded-3 fw-medium"
                      onClick={handleSignOut}
                      style={{ fontSize: '1rem' }}
                    >
                      <i className="fas fa-sign-out-alt me-2"></i>
                      Sign Out
                    </button>
                  </div>
                ) : (
                  // Authentication Options
                  <div className="text-center w-100">
                    
                    {/* Email/Password Form */}
                    <form onSubmit={authMode === "signin" ? handleEmailSignIn : handleEmailSignUp} className="w-100">
                      <div className="mb-3 w-100">
                        <input
                          type="email"
                          className="form-control form-control-lg rounded-3 border w-100"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          style={{ 
                            padding: '16px', 
                            fontSize: '16px',
                            borderColor: '#e0e0e0'
                          }}
                        />
                      </div>
                      
                      <div className="mb-3 w-100">
                        <input
                          type="password"
                          className="form-control form-control-lg rounded-3 border w-100"
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          style={{ 
                            padding: '16px', 
                            fontSize: '16px',
                            borderColor: '#e0e0e0'
                          }}
                        />
                      </div>

                      {authMode === "signin" && (
                        <div className="mb-3 d-flex justify-content-between align-items-center w-100">
                          <div className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id="rememberMe"
                              checked={rememberMe}
                              onChange={(e) => setRememberMe(e.target.checked)}
                              style={{ cursor: 'pointer' }}
                            />
                            <label className="form-check-label small text-muted" htmlFor="rememberMe" style={{ cursor: 'pointer' }}>
                              Remember me
                            </label>
                          </div>
                          <button type="button" className="btn btn-link p-0 small text-primary text-decoration-none">
                            Forgot password?
                          </button>
                        </div>
                      )}

                      {authError && (
                        <div className="alert alert-danger py-3 small rounded-3 w-100 mb-3" role="alert" style={{ border: '1px solid #f5c6cb' }}>
                          <i className="fas fa-exclamation-triangle me-2"></i>
                          {authError}
                        </div>
                      )}

                      {/* Sign In/Up Button */}
                      <button
                        type="submit"
                        className={`btn btn-primary w-100 py-3 rounded-3 mb-4 ${authLoading ? 'disabled' : ''}`}
                        disabled={authLoading}
                        style={{ 
                          fontSize: '16px', 
                          fontWeight: '600', 
                          height: '52px',
                          background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
                          border: 'none'
                        }}
                      >
                        {authLoading ? (
                          <>
                            <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                            {authMode === "signin" ? "Signing In..." : "Creating Account..."}
                        </>
                        ) : (
                          authMode === "signin" ? "Sign In" : "Create Account"
                        )}
                      </button>
                    </form>

                    {/* Divider */}
                    <div className="divider mb-4 w-100">
                      <span className="divider-text text-muted bg-white px-3">or continue with</span>
                    </div>

                    {/* Google Sign In Button */}
                    <button
                      className={`btn btn-outline-secondary w-100 py-3 rounded-3 mb-4 ${authLoading ? 'disabled' : ''}`}
                      onClick={handleGoogleSignIn}
                      disabled={authLoading}
                      style={{ 
                        borderColor: '#dadce0',
                        backgroundColor: '#fff',
                        fontSize: '16px',
                        fontWeight: '500',
                        height: '52px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {authLoading ? (
                        <>
                          <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                          Connecting...
                        </>
                      ) : (
                        <>
                          <img 
                            src="https://developers.google.com/identity/images/g-logo.png" 
                            alt="Google" 
                            style={{ 
                              width: '18px', 
                              height: '18px', 
                              marginRight: '12px' 
                            }}
                          />
                          Continue with Google
                        </>
                      )}
                    </button>

                    {/* Switch between Sign In and Sign Up */}
                    <div className="text-center mb-3 w-100">
                      <p className="small text-muted mb-0">
                        {authMode === "signin" ? "Don't have an account? " : "Already have an account? "}
                        <button
                          type="button"
                          className="btn btn-link p-0 small text-primary fw-bold text-decoration-none"
                          onClick={() => setAuthMode(authMode === "signin" ? "signup" : "signin")}
                          style={{ fontSize: '14px' }}
                        >
                          {authMode === "signin" ? "Sign up" : "Sign in"}
                        </button>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-vh-100 bg-white">
      <AuthModal />
      <Sidebar />

      {/* Header with Amazon-like Mobile Design */}
      <div className="bg-white border-bottom">
        {/* Top Row: Logo, Menu, Language, Account */}
        <div className="container py-2">
          <div className="d-flex justify-content-between align-items-center">
            {/* Left: Menu Icon and Logo */}
            <div className="d-flex align-items-center">
              {/* Menu Icon */}
              <button
                className="btn border-0 p-0 me-2"
                onClick={() => setShowSidebar(true)}
                style={{ background: 'none' }}
              >
                <i className="fas fa-bars text-dark" style={{ fontSize: '1.2rem' }}></i>
              </button>
              
              {/* Logo */}
              <span 
                className="fw-bold text-primary"
                style={{ 
                  fontSize: '1.5rem',
                  fontWeight: '800',
                }}
              >
                BisRun
              </span>
            </div>

            {/* Right: Language and Account */}
            <div className="d-flex align-items-center gap-2">
              {/* Language Selector */}
              <div className="position-relative">
                <button
                  className="btn btn-outline-secondary border-0 d-flex align-items-center gap-1"
                  onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                  style={{ 
                    background: 'none',
                    padding: '4px 8px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}
                >
                  <span>{currentLanguage}</span>
                  <i className={`fas fa-chevron-${showLanguageDropdown ? 'up' : 'down'}`} style={{ fontSize: '10px' }}></i>
                </button>

                {/* Language Dropdown */}
                {showLanguageDropdown && (
                  <div 
                    className="position-absolute top-100 end-0 mt-1 bg-white border rounded-2 shadow-lg"
                    style={{ 
                      zIndex: 1040,
                      width: '180px',
                      maxHeight: '250px',
                      overflowY: 'auto'
                    }}
                  >
                    {languages.map((language) => (
                      <button
                        key={language.code}
                        className={`btn btn-light w-100 text-start p-2 border-bottom ${
                          currentLanguage === language.code ? 'bg-primary text-white' : ''
                        }`}
                        onClick={() => handleLanguageChange(language.code)}
                        style={{ 
                          border: 'none', 
                          borderRadius: '0',
                          fontSize: '12px'
                        }}
                      >
                        <span className="me-2">{language.flag}</span>
                        {language.name} ({language.code})
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Account Icon */}
              <button
                className="btn border-0 p-0"
                onClick={handleAccountClick}
                style={{ background: 'none' }}
              >
                {user ? (
                  user.picture ? (
                    <img 
                      src={user.picture} 
                      alt={user.name}
                      className="rounded-circle"
                      style={{ 
                        width: '28px',
                        height: '28px',
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <i className="fas fa-user-circle text-dark" style={{ fontSize: '1.5rem' }}></i>
                  )
                ) : (
                  <i className="fas fa-user-circle text-dark" style={{ fontSize: '1.5rem' }}></i>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Row: Square Search Bar */}
        <div className="container pb-2">
          <form onSubmit={handleSearch} className="position-relative">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder={placeholderText}
                value={searchQuery}
                onChange={handleSearchInputChange}
                onFocus={handleSearchInputFocus}
                onBlur={handleSearchInputBlur}
                style={{ 
                  borderRadius: '0',
                  border: '2px solid #007bff',
                  padding: '12px 20px',
                  fontSize: '16px',
                  height: '50px',
                  borderRight: 'none'
                }}
              />
              <button 
                className="btn btn-primary border-0"
                type="submit"
                style={{ 
                  borderRadius: '0',
                  width: '60px',
                  background: '#007bff',
                  border: '2px solid #007bff',
                  borderLeft: 'none'
                }}
              >
                <i className="fas fa-search text-white"></i>
              </button>
            </div>

            {/* Search Suggestions */}
            {showSuggestions && (
              <div className="position-absolute top-100 start-0 end-0 mt-1" style={{ zIndex: 1030 }}>
                <div className="bg-white border rounded-0 shadow-lg overflow-hidden">
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

      {/* Rest of the content remains the same */}
      <div>
        
        {/* Hero Section */}
        <section 
          className="hero-section position-relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            minHeight: '50vh',
            display: 'flex',
            alignItems: 'center',
            paddingTop: '30px',
            paddingBottom: '30px'
          }}
        >
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6 text-white">
                <h1 className="display-5 fw-bold mb-3" style={{ marginTop: '0', fontSize: '2rem' }}>
                  Find Everything You Need, <span className="text-warning">Anywhere</span>
                </h1>
                <p className="lead mb-3" style={{ fontSize: '1rem' }}>
                  Discover products and services from local businesses and global providers. 
                  From electronics to hotels, find exactly what you're looking for.
                </p>
                
                {/* Quick Stats */}
                <div className="row text-center">
                  <div className="col-4">
                    <div className="border-end border-white">
                      <h4 className="fw-bold text-warning">500+</h4>
                      <small>Businesses</small>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="border-end border-white">
                      <h4 className="fw-bold text-warning">2,000+</h4>
                      <small>Products</small>
                    </div>
                  </div>
                  <div className="col-4">
                    <div>
                      <h4 className="fw-bold text-warning">100+</h4>
                      <small>Services</small>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="col-lg-6 d-none d-lg-block">
                <div className="position-relative">
                  <img 
                    src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Shopping Experience"
                    className="img-fluid rounded-4 shadow-lg"
                    style={{ transform: 'rotate(3deg)' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Wave Divider */}
          <div className="position-absolute bottom-0 start-0 w-100">
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-100">
              <path 
                d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
                opacity=".25" 
                className="shape-fill"
                fill="#ffffff"
              ></path>
              <path 
                d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
                opacity=".5" 
                className="shape-fill"
                fill="#ffffff"
              ></path>
              <path 
                d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" 
                className="shape-fill"
                fill="#ffffff"
              ></path>
            </svg>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-4 py-md-5 bg-light">
          <div className="container">
            <div className="d-flex justify-content-between align-items-center mb-3 mb-md-4">
              <div>
                <h3 className="fw-bold mb-1 mb-md-2">Featured Products</h3>
                <p className="text-muted d-none d-md-block">Handpicked items you'll love</p>
              </div>
              <Link to="/search-results" className="btn btn-outline-primary btn-sm">
                View All <i className="fas fa-arrow-right ms-1"></i>
              </Link>
            </div>

            {isLoading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary mb-3"></div>
                <p>Loading featured items...</p>
              </div>
            ) : (
              <div className="position-relative">
                <div className="d-flex overflow-auto pb-3" style={{ scrollbarWidth: 'thin', msOverflowStyle: 'none' }}>
                  <div className="d-flex flex-nowrap gap-3">
                    {featuredItems.map((item) => (
                      <div 
                        key={item.id} 
                        className="bg-white rounded-4 overflow-hidden"
                        style={{ 
                          width: '280px', 
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                        }}
                        onClick={() => handleFeaturedItemClick(item.id)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-5px)';
                          e.currentTarget.style.boxShadow = '0 12px 35px rgba(0,0,0,0.15)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
                        }}
                      >
                        <div className="position-relative">
                          <img
                            src={item.images && item.images.length > 0 ? item.images[0] : 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=600'}
                            className="w-100"
                            alt={item.name}
                            style={{ 
                              height: '200px', 
                              objectFit: 'cover',
                              objectPosition: 'center'
                            }}
                            onError={(e) => {
                              e.target.src = 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=600';
                            }}
                          />
                          <div className="position-absolute top-0 end-0 m-2">
                            <span className="badge bg-warning text-dark px-3 py-2 rounded-pill">
                              <i className="fas fa-star me-1"></i>
                              Featured
                            </span>
                          </div>
                        </div>
                        
                        <div className="p-3">
                          <h6 className="fw-bold text-dark mb-2" style={{ fontSize: '0.95rem', lineHeight: '1.3' }}>
                            {item.name}
                          </h6>
                          
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="fw-bold text-primary fs-5">
                              {formatPrice(item)}
                            </span>
                            <div className="d-flex align-items-center">
                              {renderStars(item.rating)}
                              <small className="text-muted ms-1">({item.reviews || 0})</small>
                            </div>
                          </div>
                          
                          <div className="d-flex justify-content-between align-items-center">
                            <small className="text-muted">
                              <i className="fas fa-store me-1 text-primary"></i>
                              {item.businessName || item.business}
                            </small>
                            <small className="text-muted">
                              {getCountryFlag(item.country)}
                            </small>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* All Products Grid Section */}
        <section className="py-4 py-md-5">
          <div className="container">
            <div className="d-flex justify-content-between align-items-center mb-3 mb-md-4">
              <div>
                <h3 className="fw-bold mb-1 mb-md-2">All Products</h3>
                <p className="text-muted d-none d-md-block">Browse our complete collection</p>
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-outline-primary btn-sm">
                  <i className="fas fa-filter me-1"></i>
                  Filter
                </button>
                <button className="btn btn-outline-primary btn-sm">
                  <i className="fas fa-sort me-1"></i>
                  Sort
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary mb-3"></div>
                <p>Loading products...</p>
              </div>
            ) : (
              <div className="row g-3">
                {featuredItems.map((item) => (
                  <div key={item.id} className="col-6 col-md-4 col-lg-3 col-xl-2">
                    <div 
                      className="bg-white rounded-3 overflow-hidden h-100"
                      onClick={() => handleFeaturedItemClick(item.id)}
                      style={{ 
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.12)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)';
                      }}
                    >
                      <div className="position-relative">
                        <img
                          src={item.images && item.images.length > 0 ? item.images[0] : 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=600'}
                          className="w-100"
                          alt={item.name}
                          style={{ 
                            height: '140px', 
                            objectFit: 'cover',
                            objectPosition: 'center'
                          }}
                          onError={(e) => {
                            e.target.src = 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=600';
                          }}
                        />
                        <div className="position-absolute top-0 start-0 m-1">
                          <span className="badge bg-primary text-white px-2 py-1 rounded-pill" style={{ fontSize: '0.65rem' }}>
                            {item.category?.split(' ')[0]}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-2 d-flex flex-column h-100">
                        <h6 className="text-dark fw-bold mb-1 flex-grow-1" style={{ fontSize: '0.8rem', lineHeight: '1.2' }}>
                          {item.name.length > 40 ? `${item.name.substring(0, 40)}...` : item.name}
                        </h6>

                        <p className="text-muted mb-1 small" style={{ fontSize: '0.65rem' }}>
                          <i className="fas fa-store me-1 text-primary"></i>
                          {item.businessName || item.business}
                        </p>

                        <div className="mb-2">
                          <h6 className="text-success fw-bold mb-0" style={{ fontSize: '0.9rem' }}>
                            {formatPrice(item)}
                          </h6>
                        </div>

                        <div className="d-flex justify-content-between align-items-center mt-auto">
                          <small className="text-muted" style={{ fontSize: '0.6rem' }}>
                            <i className="fas fa-map-marker-alt text-primary me-1"></i>
                            {item.city}
                          </small>
                          <div className="d-flex align-items-center">
                            {renderStars(item.rating)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-4 py-md-5">
          <div className="container">
            <div className="text-center mb-4 mb-md-5">
              <h2 className="fw-bold mb-2 mb-md-3">Browse by Category</h2>
              <p className="text-muted lead d-none d-md-block">Find exactly what you're looking for in our organized categories</p>
            </div>

            <div className="row g-3 g-md-4">
              {categories.map((category) => (
                <div key={category.id} className="col-6 col-md-6 col-lg-3">
                  <div 
                    className="card border-0 shadow-sm h-100 category-card text-center"
                    onClick={() => handleCategoryClick(category.name)}
                    style={{ 
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      background: `linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%), url(${category.image}) center/cover`
                    }}
                  >
                    <div className="card-body p-3 p-md-4 d-flex flex-column justify-content-center">
                      <div className={`icon-container bg-${category.color} bg-opacity-10 rounded-circle mx-auto mb-2 mb-md-3`} 
                           style={{ width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className={`fas ${category.icon} fa-2x text-${category.color}`}></i>
                      </div>
                      <h5 className="fw-bold text-dark" style={{ fontSize: '1rem' }}>{category.name}</h5>
                      <p className="text-muted mb-2 mb-md-3 small d-none d-md-block">{category.description}</p>
                      <button className={`btn btn-${category.color} btn-sm mt-auto`}>
                        Explore <i className="fas fa-arrow-right ms-2"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Business CTA Section */}
        <section className="py-4 py-md-5" style={{ background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)' }}>
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-8 text-white">
                <h3 className="fw-bold mb-2 mb-md-3">Are you a business owner?</h3>
                <p className="lead mb-3 mb-md-4">
                  List your products and services on BisRun to reach thousands of potential customers. 
                  Join our growing network of businesses today!
                </p>
                <div className="d-flex flex-wrap gap-2 gap-md-3">
                  <button 
                    className="btn btn-warning btn-lg px-3 px-md-4"
                    onClick={handleBusinessAuth}
                  >
                    <i className="fas fa-store me-2"></i>
                    List Your Business
                  </button>
                  <button 
                    className="btn btn-outline-light btn-lg px-3 px-md-4"
                    onClick={() => navigate('/business-auth')}
                  >
                    <i className="fas fa-chart-line me-2"></i>
                    Business Dashboard
                  </button>
                </div>
              </div>
              <div className="col-lg-4 text-center d-none d-lg-block">
                <i className="fas fa-rocket fa-6x text-warning opacity-75"></i>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-dark text-white py-4 py-md-5">
          <div className="container">
            <div className="row">
              <div className="col-lg-4 mb-4">
                <h5 className="fw-bold mb-3">
                  <span style={{ fontSize: '1.8rem', color: '#007bff' }}>BisRun</span>
                </h5>
                <p className="text-light small">
                  Connecting customers with businesses worldwide. Find products and services you need, when you need them.
                </p>
                <div className="d-flex gap-3">
                  <a href="#!" className="text-light"><i className="fab fa-facebook fa-lg"></i></a>
                  <a href="#!" className="text-light"><i className="fab fa-twitter fa-lg"></i></a>
                  <a href="#!" className="text-light"><i className="fab fa-instagram fa-lg"></i></a>
                  <a href="#!" className="text-light"><i className="fab fa-linkedin fa-lg"></i></a>
                </div>
              </div>
              
              <div className="col-lg-2 col-6 mb-4">
                <h6 className="fw-bold mb-3">Explore</h6>
                <ul className="list-unstyled">
                  <li><Link to="/search" className="text-light text-decoration-none small">Search</Link></li>
                  <li><Link to="/" className="text-light text-decoration-none small">Categories</Link></li>
                  <li><a href="#!" className="text-light text-decoration-none small">Featured</a></li>
                  <li><a href="#!" className="text-light text-decoration-none small">Businesses</a></li>
                </ul>
              </div>
              
              <div className="col-lg-2 col-6 mb-4">
                <h6 className="fw-bold mb-3">Business</h6>
                <ul className="list-unstyled">
                  <li><Link to="/business-auth" className="text-light text-decoration-none small">List Your Business</Link></li>
                  <li><Link to="/business-dashboard" className="text-light text-decoration-none small">Dashboard</Link></li>
                  <li><a href="#!" className="text-light text-decoration-none small">Pricing</a></li>
                  <li><a href="#!" className="text-light text-decoration-none small">Support</a></li>
                </ul>
              </div>
              
              <div className="col-lg-4 mb-4">
                <h6 className="fw-bold mb-3">Stay Updated</h6>
                <p className="text-light small mb-3">
                  Subscribe to get notifications about new features and updates.
                </p>
                <div className="input-group">
                  <input 
                    type="email" 
                    className="form-control" 
                    placeholder="Enter your email"
                  />
                  <button className="btn btn-primary">
                    <i className="fas fa-paper-plane"></i>
                  </button>
                </div>
              </div>
            </div>
            
            <hr className="my-3 my-md-4" />
            
            <div className="row align-items-center">
              <div className="col-md-6">
                <p className="mb-0 text-light small">
                  &copy; 2024 BisRun. All rights reserved.
                </p>
              </div>
              <div className="col-md-6 text-md-end">
                <a href="#!" className="text-light text-decoration-none me-3 small">Privacy Policy</a>
                <a href="#!" className="text-light text-decoration-none me-3 small">Terms of Service</a>
                <a href="#!" className="text-light text-decoration-none small">Contact</a>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Custom Styles */}
      <style>
        {`
          /* Placeholder animation */
          .form-control::placeholder {
            color: #6c757d;
            transition: all 0.3s ease;
          }

          .category-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(0,0,0,0.1) !important;
          }
          
          .product-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
          }
          
          .hero-section {
            position: relative;
          }
          
          .shape-fill {
            fill: #ffffff;
          }
          
          .btn-warning {
            background: linear-gradient(135deg, #ffc107 0%, #ff8c00 100%);
            border: none;
            font-weight: 600;
          }
          
          .btn-warning:hover {
            background: linear-gradient(135deg, #ff8c00 0%, #ff6b00 100%);
            transform: translateY(-1px);
          }
          
          /* Scrollbar styling */
          .d-flex.overflow-auto::-webkit-scrollbar {
            height: 6px;
          }
          
          .d-flex.overflow-auto::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
          }
          
          .d-flex.overflow-auto::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 10px;
          }
          
          .d-flex.overflow-auto::-webkit-scrollbar-thumb:hover {
            background: #a8a8a8;
          }

          /* Search suggestions styling */
          .search-suggestions {
            max-height: 300px;
            overflow-y: auto;
          }

          .search-suggestions::-webkit-scrollbar {
            width: 6px;
          }

          .search-suggestions::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 3px;
          }

          .search-suggestions::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 3px;
          }

          .search-suggestions::-webkit-scrollbar-thumb:hover {
            background: #a8a8a8;
          }

          /* Sidebar backdrop */
          .offcanvas-backdrop {
            background-color: rgba(0, 0, 0, 0.5);
          }

          /* Mobile Responsive */
          @media (max-width: 768px) {
            .hero-section h1 {
              font-size: 1.8rem !important;
            }
            
            .hero-section .lead {
              font-size: 0.9rem !important;
            }
            
            .container {
              padding-left: 12px;
              padding-right: 12px;
            }
          }

          @media (max-width: 576px) {
            .container {
              padding-left: 10px;
              padding-right: 10px;
            }
          }
        `}
      </style>
    </div>
  );
}

export default HomePage1;