// src/HomePage1.jsx - REDESIGNED WITH GLASS MORPHISM CARDS AND WHITE BACKGROUND
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
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [helpMessage, setHelpMessage] = useState("");
  
  // New state for dynamic placeholder with animation - FIXED VERSION
  const [placeholderText, setPlaceholderText] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

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
    { code: "SWE", name: "Svenska", flag: "🇸🇪" },
    { code: "NOR", name: "Norsk", flag: "🇳🇴" },
    { code: "DAN", name: "Dansk", flag: "🇩🇰" },
    { code: "FIN", name: "Suomi", flag: "🇫🇮" },
    { code: "POL", name: "Polski", flag: "🇵🇱" },
    { code: "CZE", name: "Čeština", flag: "🇨🇿" },
    { code: "GRE", name: "Ελληνικά", flag: "🇬🇷" },
    { code: "HEB", name: "עברית", flag: "🇮🇱" },
    { code: "PER", name: "فارسی", flag: "🇮🇷" },
    { code: "URD", name: "اردو", flag: "🇵🇰" },
    { code: "IND", name: "Bahasa Indonesia", flag: "🇮🇩" },
    { code: "MAL", name: "Bahasa Malaysia", flag: "🇲🇾" },
    { code: "THA", name: "ไทย", flag: "🇹🇭" },
    { code: "VIE", name: "Tiếng Việt", flag: "🇻🇳" },
    { code: "FIL", name: "Filipino", flag: "🇵🇭" }
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

  // FIXED: Smooth placeholder animation effect
  useEffect(() => {
    let timeoutId;
    
    const animateText = () => {
      const currentText = placeholderTexts[placeholderIndex];
      
      if (!isDeleting) {
        // Typing animation
        if (placeholderText.length < currentText.length) {
          timeoutId = setTimeout(() => {
            setPlaceholderText(currentText.substring(0, placeholderText.length + 1));
          }, 100);
        } else {
          // Finished typing, wait then start deleting
          timeoutId = setTimeout(() => {
            setIsDeleting(true);
          }, 1500);
        }
      } else {
        // Deleting animation
        if (placeholderText.length > 0) {
          timeoutId = setTimeout(() => {
            setPlaceholderText(currentText.substring(0, placeholderText.length - 1));
          }, 50);
        } else {
          // Finished deleting, move to next text
          setIsDeleting(false);
          setPlaceholderIndex((prevIndex) => (prevIndex + 1) % placeholderTexts.length);
        }
      }
    };

    timeoutId = setTimeout(animateText, isDeleting ? 50 : 100);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [placeholderText, placeholderIndex, isDeleting, placeholderTexts]);

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

  // Handle help message submission
  const handleHelpSubmit = (e) => {
    e.preventDefault();
    if (helpMessage.trim()) {
      // Here you would typically send the message to your backend
      console.log("Help message sent:", helpMessage);
      alert("Thank you for your message! We'll get back to you soon.");
      setHelpMessage("");
      setShowHelpModal(false);
    }
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

  // NEW: Function to truncate description to 42 characters
  const truncateDescription = (description) => {
    if (!description) return 'No description available';
    if (description.length <= 42) return description;
    return description.substring(0, 42) + '...';
  };

  // Help Modal Component
  const HelpModal = () => {
    return (
      <div className={`modal fade ${showHelpModal ? 'show d-block' : ''}`} 
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
                 maxWidth: '500px',
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
                    <i className="fas fa-headset display-4 text-primary"></i>
                  </div>
                  <h4 className="modal-title fw-bold text-dark mb-1" style={{ fontSize: '1.5rem' }}>
                    Need Help?
                  </h4>
                  <p className="text-muted small mb-0">
                    We're here to assist you. Send us a message!
                  </p>
                </div>
                <button 
                  type="button" 
                  className="btn-close position-absolute top-0 end-0 m-3" 
                  onClick={() => setShowHelpModal(false)}
                  style={{ fontSize: '0.8rem' }}
                ></button>
              </div>
              
              {/* Body */}
              <div className="modal-body py-4 px-4">
                <form onSubmit={handleHelpSubmit}>
                  <div className="mb-4">
                    <label className="form-label fw-semibold text-dark mb-3">
                      Your Message
                    </label>
                    <textarea
                      className="form-control rounded-3 border"
                      placeholder="Tell us how we can help you..."
                      value={helpMessage}
                      onChange={(e) => setHelpMessage(e.target.value)}
                      required
                      rows="5"
                      style={{ 
                        padding: '16px', 
                        fontSize: '16px',
                        borderColor: '#e0e0e0',
                        resize: 'none'
                      }}
                    ></textarea>
                  </div>

                  <div className="d-grid gap-2">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg w-100 py-3 rounded-3 fw-medium"
                      style={{ fontSize: '1rem' }}
                    >
                      <i className="fas fa-paper-plane me-2"></i>
                      Send Message
                    </button>
                    
                    <button
                      type="button"
                      className="btn btn-outline-secondary w-100 py-3 rounded-3 fw-medium"
                      onClick={() => setShowHelpModal(false)}
                      style={{ fontSize: '1rem' }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>

                <div className="text-center mt-4 pt-3 border-top">
                  <h6 className="text-dark fw-semibold mb-2">Other Ways to Reach Us</h6>
                  <div className="row text-muted small">
                    <div className="col-12 mb-2">
                      <i className="fas fa-envelope me-2 text-primary"></i>
                      support@bisrun.com
                    </div>
                    <div className="col-12 mb-2">
                      <i className="fas fa-phone me-2 text-primary"></i>
                      +255 123 456 789
                    </div>
                    <div className="col-12">
                      <i className="fas fa-clock me-2 text-primary"></i>
                      Available 24/7
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Sidebar Component - UPDATED WITH LANGUAGE AND HELP
  const Sidebar = () => {
    const [showAllLanguages, setShowAllLanguages] = useState(false);
    
    const displayedLanguages = showAllLanguages ? languages : languages.slice(0, 8);
    const currentLanguageObj = languages.find(lang => lang.code === currentLanguage) || languages[0];

    return (
      <div className={`offcanvas offcanvas-start ${showSidebar ? 'show' : ''}`} 
           style={{ 
             visibility: showSidebar ? 'visible' : 'hidden',
             width: '320px',
             background: 'white'
           }}
           tabIndex="-1">
        <div className="offcanvas-header border-bottom bg-white">
          <h5 className="offcanvas-title fw-bold text-primary">BisRun Menu</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowSidebar(false)}
          ></button>
        </div>
        <div className="offcanvas-body p-0 bg-white">
          <div className="list-group list-group-flush">
            
            {/* Navigation Section */}
            <Link to="/" className="list-group-item list-group-item-action border-0 py-3 bg-white">
              <i className="fas fa-home me-3 text-primary"></i>
              Home
            </Link>
            <Link to="/search-results" className="list-group-item list-group-item-action border-0 py-3 bg-white">
              <i className="fas fa-search me-3 text-primary"></i>
              Search
            </Link>
            <Link to="/categories" className="list-group-item list-group-item-action border-0 py-3 bg-white">
              <i className="fas fa-th-large me-3 text-primary"></i>
              Categories
            </Link>
            
            <div className="border-top my-2"></div>
            
            {/* Business Section */}
            <h6 className="px-3 pt-2 text-muted small bg-white">BUSINESS</h6>
            <button 
              className="list-group-item list-group-item-action border-0 py-3 bg-white"
              onClick={handleBusinessAuth}
            >
              <i className="fas fa-store me-3 text-success"></i>
              List Your Business
            </button>
            <Link to="/business-dashboard" className="list-group-item list-group-item-action border-0 py-3 bg-white">
              <i className="fas fa-chart-line me-3 text-success"></i>
              Business Dashboard
            </Link>
            
            <div className="border-top my-2"></div>
            
            {/* Language Section */}
            <h6 className="px-3 pt-2 text-muted small bg-white">LANGUAGE</h6>
            <div className="px-3 py-2 bg-white">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="small fw-semibold text-dark">Current Language</span>
                <span className="badge bg-primary bg-opacity-10 text-primary px-2 py-1 rounded-pill">
                  {currentLanguageObj.flag} {currentLanguageObj.name}
                </span>
              </div>
              
              <div className="language-list" style={{ maxHeight: showAllLanguages ? '400px' : '200px', overflowY: 'auto' }}>
                {displayedLanguages.map((language) => (
                  <button
                    key={language.code}
                    className={`btn w-100 text-start rounded-2 py-2 px-3 mb-1 ${
                      currentLanguage === language.code 
                        ? 'bg-primary text-white' 
                        : 'bg-light text-dark'
                    }`}
                    onClick={() => handleLanguageChange(language.code)}
                    style={{ 
                      border: 'none',
                      transition: 'all 0.2s ease',
                      fontSize: '0.9rem'
                    }}
                  >
                    <span className="me-2" style={{ fontSize: '1.1rem' }}>{language.flag}</span>
                    {language.name}
                    {currentLanguage === language.code && (
                      <i className="fas fa-check float-end mt-1"></i>
                    )}
                  </button>
                ))}
              </div>
              
              {languages.length > 8 && (
                <button
                  className="btn btn-outline-primary w-100 mt-2 py-2 rounded-2"
                  onClick={() => setShowAllLanguages(!showAllLanguages)}
                  style={{ fontSize: '0.85rem' }}
                >
                  <i className={`fas fa-${showAllLanguages ? 'chevron-up' : 'chevron-down'} me-2`}></i>
                  {showAllLanguages ? 'Show Less' : `Show More (+${languages.length - 8})`}
                </button>
              )}
            </div>
            
            <div className="border-top my-2"></div>
            
            {/* Help Section */}
            <h6 className="px-3 pt-2 text-muted small bg-white">SUPPORT</h6>
            <button 
              className="list-group-item list-group-item-action border-0 py-3 bg-white"
              onClick={() => {
                setShowSidebar(false);
                setShowHelpModal(true);
              }}
            >
              <i className="fas fa-headset me-3 text-info"></i>
              Help & Support
            </button>
            <Link to="/faq" className="list-group-item list-group-item-action border-0 py-3 bg-white">
              <i className="fas fa-question-circle me-3 text-info"></i>
              FAQ
            </Link>
            
            <div className="border-top my-2"></div>
            
            {/* Account Section */}
            <h6 className="px-3 pt-2 text-muted small bg-white">ACCOUNT</h6>
            {user ? (
              <>
                <div className="list-group-item border-0 py-3 bg-white">
                  <div className="d-flex align-items-center">
                    <img 
                      src={user.picture || "https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=300"} 
                      alt={user.name}
                      className="rounded-circle me-3"
                      style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                    />
                    <div>
                      <div className="fw-bold text-dark">{user.name}</div>
                      <small className="text-muted">{user.email}</small>
                    </div>
                  </div>
                </div>
                <button 
                  className="list-group-item list-group-item-action border-0 py-3 text-danger bg-white"
                  onClick={handleSignOut}
                >
                  <i className="fas fa-sign-out-alt me-3"></i>
                  Sign Out
                </button>
              </>
            ) : (
              <button 
                className="list-group-item list-group-item-action border-0 py-3 bg-white"
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
                    <i className="fas fa-user display-4 text-primary"></i>
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
                              className="form-check-input"
                              type="checkbox"
                              checked={rememberMe}
                              onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            <label className="form-check-label small text-muted">
                              Remember me
                            </label>
                          </div>
                          <a href="#" className="small text-primary text-decoration-none">
                            Forgot password?
                          </a>
                        </div>
                      )}

                      {authError && (
                        <div className="alert alert-danger small rounded-3 mb-3 w-100">
                          <i className="fas fa-exclamation-triangle me-2"></i>
                          {authError}
                        </div>
                      )}

                      <div className="d-grid gap-2 mb-3 w-100">
                        <button
                          type="submit"
                          className="btn btn-primary btn-lg w-100 py-3 rounded-3 fw-medium"
                          disabled={authLoading}
                          style={{ fontSize: '1rem' }}
                        >
                          {authLoading ? (
                            <>
                              <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                              {authMode === "signin" ? "Signing In..." : "Creating Account..."}
                            </>
                          ) : (
                            <>
                              <i className={`fas ${authMode === "signin" ? "fa-sign-in-alt" : "fa-user-plus"} me-2`}></i>
                              {authMode === "signin" ? "Sign In" : "Create Account"}
                            </>
                          )}
                        </button>
                      </div>
                    </form>

                    {/* Divider */}
                    <div className="position-relative my-4 w-100">
                      <hr className="my-4" style={{ borderColor: '#e0e0e0' }} />
                      <span className="position-absolute top-50 start-50 translate-middle bg-white px-3 small text-muted">
                        Or continue with
                      </span>
                    </div>

                    {/* Google Sign In */}
                    <div className="d-grid gap-2 mb-3 w-100">
                      <button
                        type="button"
                        className="btn btn-outline-dark btn-lg w-100 py-3 rounded-3 fw-medium"
                        onClick={handleGoogleSignIn}
                        disabled={authLoading}
                        style={{ fontSize: '1rem' }}
                      >
                        {authLoading ? (
                          <>
                            <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                            Signing In...
                          </>
                        ) : (
                          <>
                            <i className="fab fa-google me-2"></i>
                            Continue with Google
                          </>
                        )}
                      </button>
                    </div>

                    {/* Switch Auth Mode */}
                    <div className="text-center mt-3 w-100">
                      <p className="text-muted small mb-0">
                        {authMode === "signin" ? "Don't have an account? " : "Already have an account? "}
                        <button
                          className="btn btn-link p-0 text-primary text-decoration-none fw-medium"
                          onClick={() => {
                            setAuthMode(authMode === "signin" ? "signup" : "signin");
                            setAuthError("");
                          }}
                        >
                          {authMode === "signin" ? "Sign Up" : "Sign In"}
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
    <div className="min-vh-100 bg-white" style={{ fontFamily: 'Segoe UI, system-ui, sans-serif' }}>
      
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

      {/* Help Modal */}
      {showHelpModal && <HelpModal />}

      {/* Main Content */}
      <div className="container-fluid px-0 bg-white">
        
        {/* Header Section */}
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

        {/* Search Section */}
        <section className="px-4 py-4 bg-white">
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
                      placeholder={placeholderText}
                      value={searchQuery}
                      onChange={handleSearchInputChange}
                      onFocus={handleSearchInputFocus}
                      onBlur={handleSearchInputBlur}
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
                          <i className="fas fa-search me-3 text-muted"></i>
                          <span className="flex-grow-1">{suggestion}</span>
                          {searchQuery.trim() === "" && (
                            <i className="fas fa-clock text-muted"></i>
                          )}
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

        {/* Main Content Area */}
        <main className="pb-5 bg-white">
          
          {/* Categories Section */}
          <section className="px-4 mb-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="h4 text-dark fw-bold mb-0">Browse Categories</h2>
              <Link to="/categories" className="text-primary text-decoration-none small">
                View All <i className="fas fa-chevron-right ms-1"></i>
              </Link>
            </div>
            
            <div className="row g-3">
              {categoryData.map((category) => (
                <div key={category.id} className="col-6 col-md-3">
                  <div 
                    className="card border-0 shadow-sm h-100 text-decoration-none"
                    onClick={() => handleCategoryClick(category.name)}
                    style={{ 
                      cursor: 'pointer',
                      background: 'white',
                      border: '1px solid #e9ecef',
                      borderRadius: '16px',
                      transition: 'all 0.3s ease',
                      overflow: 'hidden'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                    }}
                  >
                    <div className="card-body text-center p-4">
                      <div 
                        className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                        style={{ 
                          width: '60px', 
                          height: '60px',
                          background: `var(--bs-${category.color}-bg-subtle)`,
                          fontSize: '1.5rem',
                          color: `var(--bs-${category.color})`
                        }}
                      >
                        <i className={`fas ${category.icon}`}></i>
                      </div>
                      <h6 className="card-title text-dark fw-bold mb-2" style={{ fontSize: '0.9rem' }}>
                        {category.name}
                      </h6>
                      <p className="card-text text-muted small mb-0" style={{ fontSize: '0.75rem', lineHeight: '1.3' }}>
                        {category.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Featured Items Section */}
          <section className="px-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="h4 text-dark fw-bold mb-0">Featured Items</h2>
              <Link to="/search-results?q=featured" className="text-primary text-decoration-none small">
                View All <i className="fas fa-chevron-right ms-1"></i>
              </Link>
            </div>

            {isLoading ? (
              <div className="row g-3">
                {[...Array(8)].map((_, index) => (
                  <div key={index} className="col-6 col-md-4 col-lg-3">
                    <div 
                      className="card border-0 shadow-sm h-100"
                      style={{ 
                        background: 'white',
                        border: '1px solid #e9ecef',
                        borderRadius: '16px',
                        minHeight: '280px'
                      }}
                    >
                      <div className="card-body p-3">
                        <div className="placeholder-glow">
                          <div className="placeholder rounded-3 mb-3" style={{ height: '120px', background: '#f8f9fa' }}></div>
                          <div className="placeholder col-8 mb-2" style={{ background: '#f8f9fa' }}></div>
                          <div className="placeholder col-6 mb-2" style={{ background: '#f8f9fa' }}></div>
                          <div className="placeholder col-4" style={{ background: '#f8f9fa' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : featuredItems.length > 0 ? (
              <div className="row g-3">
                {featuredItems.map((item) => (
                  <div key={item.id} className="col-6 col-md-4 col-lg-3">
                    {/* GLASS MORPHISM CARD - SAME AS SEARCH RESULTS */}
                    <div 
                      className="glass-card"
                      onClick={() => handleFeaturedItemClick(item.id)}
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
                          src={item.images?.[0] || "https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=600"}
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
                            {item.business || item.businessName || 'Unknown Business'}
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

                        {/* Bottom Section */}
                        <div>
                          {/* Rating and Price Row */}
                          <div className="d-flex justify-content-between align-items-center">
                            {/* Rating */}
                            {renderStars(item.rating)}

                            {/* Price - BLUE COLOR */}
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
                              {item.type === 'service' && '/night'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div 
                className="text-center py-5 rounded-3"
                style={{ 
                  background: '#f8f9fa',
                  border: '1px solid #e9ecef'
                }}
              >
                <i className="fas fa-search display-4 text-muted mb-3"></i>
                <h5 className="text-dark mb-2">No Featured Items Found</h5>
                <p className="text-muted mb-3">Check back later for new featured products and services</p>
                <button 
                  className="btn btn-primary rounded-3 px-4"
                  onClick={() => navigate('/business-dashboard')}
                >
                  <i className="fas fa-plus me-2"></i>
                  Add Your First Item
                </button>
              </div>
            )}
          </section>
        </main>
      </div>

      {/* Custom Styles */}
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

          /* Language list scrollbar styling */
          .language-list::-webkit-scrollbar {
            width: 6px;
          }

          .language-list::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
          }

          .language-list::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 10px;
          }

          .language-list::-webkit-scrollbar-thumb:hover {
            background: #a8a8a8;
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
}

export default HomePage1;