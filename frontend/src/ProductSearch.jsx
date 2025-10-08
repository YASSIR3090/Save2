// src/ProductSearch.jsx - COMPLETE FILE WITH WORKING AUTH & BUSINESS DASHBOARD REDIRECT
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth, googleProvider } from './firebase.jsx';
import { signInWithPopup, signOut, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

function ProductSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [filters, setFilters] = useState({
    category: "",
    country: "",
    region: "",
    city: "",
    inStock: true,
    priceRange: ""
  });
  const [userLocation, setUserLocation] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSearchPage, setShowSearchPage] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [recentSearches, setRecentSearches] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authMode, setAuthMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Countries and Currencies
  const countries = [
    { code: "TZ", name: "Tanzania", currency: "TZS", currencySymbol: "TSh" },
    { code: "KE", name: "Kenya", currency: "KES", currencySymbol: "KSh" },
    { code: "UG", name: "Uganda", currency: "UGX", currencySymbol: "USh" },
    { code: "US", name: "United States", currency: "USD", currencySymbol: "$" },
    { code: "GB", name: "United Kingdom", currency: "GBP", currencySymbol: "£" },
    { code: "EU", name: "European Union", currency: "EUR", currencySymbol: "€" },
    { code: "CN", name: "China", currency: "CNY", currencySymbol: "¥" },
    { code: "IN", name: "India", currency: "INR", currencySymbol: "₹" },
    { code: "ZA", name: "South Africa", currency: "ZAR", currencySymbol: "R" }
  ];

  // Price Ranges
  const priceRanges = [
    { label: "Any Price", value: "" },
    { label: "Under $50", value: "0-50" },
    { label: "$50 - $100", value: "50-100" },
    { label: "$100 - $200", value: "100-200" },
    { label: "$200 - $500", value: "200-500" },
    { label: "Over $500", value: "500-10000" }
  ];

  // Regions by Country
  const regionsByCountry = {
    "Tanzania": ["Dar es Salaam", "Arusha", "Mwanza", "Zanzibar", "Mbeya", "Dodoma"],
    "Kenya": ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret"],
    "Uganda": ["Kampala", "Entebbe", "Jinja", "Gulu", "Mbale"],
    "United States": ["New York", "California", "Texas", "Florida", "Illinois"],
    "United Kingdom": ["London", "Manchester", "Birmingham", "Liverpool"],
    "China": ["Beijing", "Shanghai", "Guangzhou", "Shenzhen"],
    "India": ["Mumbai", "Delhi", "Bangalore", "Hyderabad"],
    "South Africa": ["Johannesburg", "Cape Town", "Durban", "Pretoria"]
  };

  // Quick access categories for main page
  const quickCategories = [
    { 
      id: "all", 
      name: "All", 
      icon: "fa-grid", 
      color: "#007bff"
    },
    { 
      id: "electronics", 
      name: "Electronics", 
      icon: "fa-laptop", 
      color: "#007bff"
    },
    { 
      id: "fashion", 
      name: "Fashion", 
      icon: "fa-tshirt", 
      color: "#007bff"
    },
    { 
      id: "hotels", 
      name: "Hotels", 
      icon: "fa-hotel", 
      color: "#007bff"
    },
    { 
      id: "cars", 
      name: "Vehicles", 
      icon: "fa-car", 
      color: "#007bff"
    },
  ];

  // Initialize - Load data on component mount
  useEffect(() => {
    console.log("Component mounted - loading data...");
    loadAllItems();
    loadRecentSearches();
    getUserLocation();
    
    // Setup auth state listener
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
        // Save user to localStorage for BusinessDashboard
        localStorage.setItem('currentUser', JSON.stringify(userData));
      } else {
        setUser(null);
        localStorage.removeItem('currentUser');
      }
    });

    // Check for URL search parameters
    const urlParams = new URLSearchParams(location.search);
    const urlQuery = urlParams.get('q');
    if (urlQuery) {
      setSearchQuery(urlQuery);
      handleSearch(urlQuery);
    }

    // Cleanup subscription
    return () => unsubscribe();
  }, [location.search]);

  // Google Authentication Functions - UPDATED WITH DASHBOARD REDIRECT
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
      
      // Save user to localStorage for BusinessDashboard
      localStorage.setItem('currentUser', JSON.stringify(userData));
      
      setShowAuthModal(false);
      
      // REDIRECT TO BUSINESS DASHBOARD AFTER SUCCESSFUL LOGIN
      setTimeout(() => {
        navigate('/business-dashboard');
      }, 1000);
      
    } catch (error) {
      console.error("Google authentication failed:", error);
      setAuthError("Error signing in with Google. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  // Email/Password Sign Up - UPDATED WITH DASHBOARD REDIRECT
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
      
      // Save user to localStorage for BusinessDashboard
      localStorage.setItem('currentUser', JSON.stringify(userData));
      
      setShowAuthModal(false);
      
      // REDIRECT TO BUSINESS DASHBOARD AFTER SUCCESSFUL SIGNUP
      setTimeout(() => {
        navigate('/business-dashboard');
      }, 1000);
      
    } catch (error) {
      console.error("Email sign up failed:", error);
      setAuthError(error.message);
    } finally {
      setAuthLoading(false);
    }
  };

  // Email/Password Sign In - UPDATED WITH DASHBOARD REDIRECT
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
      
      // Save user to localStorage for BusinessDashboard
      localStorage.setItem('currentUser', JSON.stringify(userData));
      
      setShowAuthModal(false);
      
      // REDIRECT TO BUSINESS DASHBOARD AFTER SUCCESSFUL LOGIN
      setTimeout(() => {
        navigate('/business-dashboard');
      }, 1000);
      
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
      alert("You have successfully signed out.");
    } catch (error) {
      console.error("Sign out error:", error);
      alert("Error signing out. Please try again.");
    }
  };

  const handleAccountClick = () => {
    setShowAuthModal(true);
  };

  // Reset form when modal opens/closes
  useEffect(() => {
    if (showAuthModal) {
      setEmail("");
      setPassword("");
      setAuthError("");
      setAuthMode("signin");
    }
  }, [showAuthModal]);

  // Load all items from localStorage and sample data
  const loadAllItems = useCallback(() => {
    try {
      console.log("Loading items...");
      setIsLoading(true);
      
      // Create comprehensive sample data
      const sampleItems = createSampleItems();
      
      // Try to load from localStorage
      let storedItems = [];
      try {
        const allBusinesses = JSON.parse(localStorage.getItem('verifiedBusinesses')) || [];
        console.log("Found businesses:", allBusinesses.length);
        
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
          
          storedItems = [...storedItems, ...productsWithBusiness, ...servicesWithBusiness];
        });
      } catch (storageError) {
        console.warn("Error loading from localStorage:", storageError);
      }

      const combinedItems = [...sampleItems, ...storedItems];
      console.log("Total items loaded:", combinedItems.length);
      
      setAllItems(combinedItems);
      setSearchResults(combinedItems);
      setHasSearched(false);
      
    } catch (error) {
      console.error("Error loading items:", error);
      // Fallback to sample data only
      const sampleItems = createSampleItems();
      setAllItems(sampleItems);
      setSearchResults(sampleItems);
      setHasSearched(false);
    } finally {
      setIsLoading(false);
      console.log("Loading completed");
    }
  }, []);

  // Create comprehensive sample data
  const createSampleItems = () => {
    const sampleElectronics = [
      {
        id: "elec-1", name: "Dell Latitude Laptop", category: "Electronics & Devices", price: 1200000, currency: "TZS", currencySymbol: "TSh", stock: 5,
        business: "TechHub Tanzania", location: { lat: -6.7924, lng: 39.2083 }, address: "Samora Avenue, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
        images: ["https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=300"], description: "High-performance business laptop", brand: "Dell", condition: "new", rating: 4.5, reviews: 23, type: "product"
      },
      {
        id: "elec-2", name: "iPhone 15 Pro Max", category: "Electronics & Devices", price: 2500000, currency: "TZS", currencySymbol: "TSh", stock: 3,
        business: "MobileWorld Tanzania", location: { lat: -6.8184, lng: 39.2883 }, address: "Mlimani City Mall, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
        images: ["https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Latest iPhone with titanium design", brand: "Apple", condition: "new", rating: 4.8, reviews: 15, type: "product"
      }
    ];

    const sampleFashion = [
      {
        id: "fash-1", name: "Men's Running Shoes", category: "General Goods", price: 85000, currency: "TZS", currencySymbol: "TSh", stock: 15,
        business: "Sports Gear Tanzania", location: { lat: -6.8184, lng: 39.2883 }, address: "Mlimani City, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
        images: ["https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Comfortable running shoes", brand: "RunPro", condition: "new", rating: 4.3, reviews: 15, type: "product"
      }
    ];

    const sampleHotels = [
      {
        id: "hotel-1", name: "Serengeti Luxury Hotel", category: "Building & Hotels", serviceType: "5-Star Hotel", priceRange: "150-300", currency: "USD", currencySymbol: "$",
        business: "Serengeti Hospitality Group", location: { lat: -6.8155, lng: 39.2861 }, address: "Masaki, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
        images: ["https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "5-star luxury hotel with premium amenities", rating: "5", type: "service"
      }
    ];

    const sampleVehicles = [
      {
        id: "veh-1", name: "Toyota Land Cruiser V8", category: "Vehicles", price: 185000000, currency: "TZS", currencySymbol: "TSh", stock: 2,
        business: "Premium Motors Tanzania", location: { lat: -6.8155, lng: 39.2861 }, address: "Masaki, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
        images: ["https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Luxury SUV with premium features", brand: "Toyota", condition: "new", rating: 4.8, reviews: 12, type: "product"
      }
    ];

    return [
      ...sampleElectronics,
      ...sampleFashion,
      ...sampleHotels,
      ...sampleVehicles
    ];
  };

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
        (error) => {
          console.log("Location access denied or unavailable");
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
    if (!query.trim()) return;
    
    try {
      const recent = recentSearches.filter(item => item !== query);
      const updated = [query, ...recent].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
    } catch (error) {
      console.error("Error saving recent search:", error);
    }
  };

  // Generate search suggestions
  const generateSearchSuggestions = useCallback((query) => {
    if (query.trim() === "") return recentSearches;

    const suggestions = new Set();
    const queryLower = query.toLowerCase();

    // Add recent searches that match
    recentSearches.forEach(search => {
      if (search.toLowerCase().includes(queryLower)) {
        suggestions.add(search);
      }
    });

    // Add item names and categories that match
    allItems.forEach(item => {
      if (item.name.toLowerCase().includes(queryLower)) {
        suggestions.add(item.name);
      }
      if (item.category.toLowerCase().includes(queryLower)) {
        suggestions.add(item.category);
      }
    });

    return Array.from(suggestions).slice(0, 8);
  }, [allItems, recentSearches]);

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
    setShowSearchPage(false);
    handleSearch(suggestion);
  };

  // Perform search with filters
  const handleSearch = useCallback((query = searchQuery) => {
    console.log("Searching for:", query);
    
    if (!query.trim() && getActiveFiltersCount() === 0) {
      setSearchResults(allItems);
      setHasSearched(false);
      return;
    }

    let filtered = [...allItems];

    if (query.trim() !== "") {
      filtered = filtered.filter(item => {
        const searchableText = `
          ${item.name || ''}
          ${item.category || ''}
          ${item.businessName || item.business || ''}
          ${item.brand || ''}
          ${item.serviceType || ''}
          ${item.description || ''}
        `.toLowerCase();

        return searchableText.includes(query.toLowerCase());
      });

      saveToRecentSearches(query);
    }

    // Apply filters
    filtered = applyFiltersToResults(filtered);

    console.log("Search results:", filtered.length);
    setSearchResults(filtered);
    setHasSearched(true);
    setShowSuggestions(false);
  }, [allItems, searchQuery, filters]);

  // Apply filters to results
  const applyFiltersToResults = (items) => {
    let filtered = [...items];

    if (filters.category) {
      filtered = filtered.filter(item => item.category === filters.category);
    }

    if (filters.country) {
      filtered = filtered.filter(item => item.country === filters.country);
    }

    if (filters.region) {
      filtered = filtered.filter(item => item.region === filters.region);
    }

    if (filters.city) {
      filtered = filtered.filter(item => 
        item.city && item.city.toLowerCase().includes(filters.city.toLowerCase())
      );
    }

    if (filters.inStock) {
      filtered = filtered.filter(item => 
        item.type === 'service' || (item.type === 'product' && item.stock > 0)
      );
    }

    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      filtered = filtered.filter(item => {
        if (item.type === 'service') return true;
        const price = item.price || 0;
        return price >= min && price <= max;
      });
    }

    return filtered;
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    const newFilters = {
      ...filters,
      [key]: value
    };

    if (key === 'country') {
      newFilters.region = "";
      newFilters.city = "";
    } else if (key === 'region') {
      newFilters.city = "";
    }

    setFilters(newFilters);
    
    if (hasSearched || searchQuery.trim() !== "") {
      handleSearch();
    }
  };

  // Handle category selection from sidebar
  const handleCategorySelect = (categoryId) => {
    let category = "";
    switch(categoryId) {
      case "electronics":
        category = "Electronics & Devices";
        break;
      case "fashion":
        category = "General Goods";
        break;
      case "hotels":
        category = "Building & Hotels";
        break;
      case "cars":
        category = "Vehicles";
        break;
      default:
        category = "";
    }

    const newFilters = { ...filters, category };
    setFilters(newFilters);
    setActiveCategory(categoryId);
    setShowSidebar(false);
    
    if (category) {
      setHasSearched(true);
      handleSearch();
    } else {
      setSearchResults(applyFiltersToResults(allItems));
    }
  };

  // Clear all search and filters
  const clearSearch = () => {
    setSearchQuery("");
    setFilters({
      category: "",
      country: "",
      region: "",
      city: "",
      inStock: true,
      priceRange: ""
    });
    setActiveCategory("all");
    setSearchResults(allItems);
    setHasSearched(false);
    setShowSuggestions(false);
    navigate('/search');
  };

  // Calculate distance for location display
  const calculateDistance = (itemLat, itemLng) => {
    if (!userLocation || !itemLat || !itemLng) return "Location info";
    
    const R = 6371;
    const dLat = (itemLat - userLocation.lat) * Math.PI / 180;
    const dLng = (itemLng - userLocation.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(userLocation.lat * Math.PI / 180) * Math.cos(itemLat * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`;
  };

  // Navigation handlers
  const handleContactBusiness = (item) => {
    const phoneNumber = item.businessPhone || "+255754000000";
    const email = item.businessEmail || `${item.businessName?.toLowerCase().replace(/\s+/g, '')}@email.com`;
    const address = item.businessAddress || item.address;
    
    alert(`Contact Information:\n\nBusiness: ${item.businessName || item.business}\nPhone: ${phoneNumber}\nEmail: ${email}\nAddress: ${address}, ${item.city}, ${item.country}`);
  };

  const handleGetDirections = (item) => {
    if (item.location && item.location.lat && item.location.lng) {
      const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${item.location.lat},${item.location.lng}`;
      window.open(mapsUrl, '_blank');
    } else if (item.address || (item.city && item.country)) {
      const addressParts = [];
      if (item.address) addressParts.push(item.address);
      if (item.city) addressParts.push(item.city);
      if (item.region) addressParts.push(item.region);
      if (item.country) addressParts.push(item.country);
      
      const fullAddress = addressParts.join(', ');
      const encodedAddress = encodeURIComponent(fullAddress);
      const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
      window.open(mapsUrl, '_blank');
    } else {
      alert('Sorry, no location information is available for this service. Please contact the business directly.');
    }
  };

  const handleViewDetails = (itemId) => {
    navigate(`/product/${itemId}`);
  };

  // Search page handlers
  const handleSearchInputFocus = () => {
    setShowSearchPage(true);
  };

  const handleSearchPageBack = () => {
    setShowSearchPage(false);
    setShowSuggestions(false);
  };

  const handleSearchPageSubmit = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (searchQuery.trim()) {
      handleSearch();
    }
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  // Helper functions
  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.category) count++;
    if (filters.country) count++;
    if (filters.region) count++;
    if (filters.city) count++;
    if (filters.priceRange) count++;
    return count;
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Electronics & Devices': return 'fa-laptop';
      case 'General Goods': return 'fa-tshirt';
      case 'Building & Hotels': return 'fa-hotel';
      case 'Vehicles': return 'fa-car';
      default: return 'fa-box';
    }
  };

  const getItemImage = (item) => {
    if (item.images && item.images.length > 0) {
      return item.images[0];
    }
    return 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=300';
  };

  const formatPrice = (item) => {
    if (item.type === 'service') {
      return `${item.currencySymbol || '$'} ${item.priceRange}`;
    }
    return `${item.currencySymbol || '$'} ${item.price?.toLocaleString() || '0'}`;
  };

  // NEW: Handle Business Dashboard Access
  const handleBusinessDashboard = () => {
    if (user) {
      navigate('/business-dashboard');
    } else {
      setShowAuthModal(true);
    }
  };

  // Beautiful Authentication Modal Component - UPDATED WITH DASHBOARD REDIRECT
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
        {/* Centered Container */}
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
                   transform: 'translateY(0)',
                   animation: 'modalSlideIn 0.3s ease-out'
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

                    {/* NEW: Business Dashboard Button */}
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
                  // Authentication Options - PERFECTLY CENTERED
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

                    {/* Divider - Centered */}
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
                        justifyContent: 'center',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#f8f9fa';
                        e.target.style.borderColor = '#adb5bd';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#fff';
                        e.target.style.borderColor = '#dadce0';
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

                    {/* NEW: Quick Business Dashboard Access */}
                    <div className="mb-4">
                      <button
                        className="btn btn-outline-primary w-100 py-3 rounded-3 fw-medium"
                        onClick={() => navigate('/business-dashboard')}
                        style={{ fontSize: '16px' }}
                      >
                        <i className="fas fa-store me-2"></i>
                        Access Business Dashboard
                      </button>
                    </div>

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

                    {/* Terms and Privacy */}
                    <div className="mt-3 pt-3 border-top w-100">
                      <p className="small text-muted mb-0 text-center" style={{ lineHeight: '1.4' }}>
                        By continuing, you agree to our{" "}
                        <a href="#" className="text-primary text-decoration-none fw-medium">Terms</a>{" "}
                        and{" "}
                        <a href="#" className="text-primary text-decoration-none fw-medium">Privacy Policy</a>
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

  // SlideNavbar Component - UPDATED WITH BUSINESS DASHBOARD BUTTON
  const SlideNavbar = () => {
    return (
      <div className="fixed-top bg-white border-bottom shadow-sm" style={{ zIndex: 1030 }}>
        <div className="container-fluid p-2">
          <div className="row align-items-center">
            {/* Slide Menu Button */}
            <div className="col-auto">
              <button
                className="btn btn-light rounded-circle"
                onClick={toggleSidebar}
                style={{ 
                  width: '40px', 
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.9rem'
                }}
              >
                <i className="fas fa-bars text-dark"></i>
              </button>
            </div>

            {/* Search Bar */}
            <div className="col">
              <div className="input-group input-group-lg position-relative">
                <input
                  type="text"
                  className="form-control border-0 bg-light rounded-pill ps-5"
                  placeholder="Search products, services..."
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  onFocus={handleSearchInputFocus}
                  style={{ fontSize: '1rem' }}
                />
                {/* Search Icon Inside Input */}
                <div className="position-absolute top-50 start-0 translate-middle-y ps-3">
                  <i className="fas fa-search text-muted"></i>
                </div>
              </div>

              {/* Search Suggestions Dropdown */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="position-absolute top-100 start-0 end-0 mt-1 z-3">
                  <div className="bg-white border rounded-3 shadow-lg">
                    {searchSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        className="btn btn-light w-100 text-start p-2 border-bottom"
                        onClick={() => handleSuggestionClick(suggestion)}
                        style={{ 
                          border: 'none',
                          borderRadius: '0',
                          fontSize: '0.8rem'
                        }}
                      >
                        <div className="d-flex align-items-center">
                          <i className="fas fa-search me-2 text-muted" style={{ fontSize: '0.7rem' }}></i>
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
            
            {/* NEW: Business Dashboard Button */}
            <div className="col-auto ms-2">
              <button
                className="btn btn-outline-primary rounded-pill d-flex align-items-center"
                onClick={handleBusinessDashboard}
                style={{ 
                  fontSize: '0.8rem',
                  padding: '8px 16px',
                  fontWeight: '600'
                }}
              >
                <i className="fas fa-chart-line me-2"></i>
                <span className="d-none d-sm-inline">Business</span>
              </button>
            </div>
            
            {/* Enhanced Account Icon */}
            <div className="col-auto ms-2">
              <button
                className="btn btn-light rounded-circle border position-relative d-flex align-items-center justify-content-center"
                onClick={handleAccountClick}
                style={{ 
                  width: '42px', 
                  height: '42px',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#f8f9fa';
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                {user ? (
                  <img 
                    src={user.picture || "https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=300"} 
                    alt={user.name}
                    className="rounded-circle"
                    style={{ 
                      width: '32px', 
                      height: '32px',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  <i className="fas fa-user text-dark"></i>
                )}
                
                {user && (
                  <span className="position-absolute top-0 start-100 translate-middle p-1 bg-success border border-2 border-white rounded-circle">
                    <span className="visually-hidden">User logged in</span>
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Main Component Render
  return (
    <div className="min-vh-100 bg-white">
      {/* Custom CSS Styles */}
      <style>
        {`
          /* Centered Modal Animation */
          @keyframes modalSlideIn {
            from {
              opacity: 0;
              transform: translateY(-20px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          
          .modal-content {
            animation: modalSlideIn 0.3s ease-out;
          }
          
          /* Perfect Centering */
          .modal-dialog-centered {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            min-height: calc(100vh - 1rem) !important;
          }
          
          /* Divider Styling */
          .divider {
            position: relative;
            text-align: center;
            margin: 25px 0;
            width: 100%;
          }
          
          .divider::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 0;
            right: 0;
            height: 1px;
            background: linear-gradient(90deg, transparent 0%, #e0e0e0 50%, transparent 100%);
            transform: translateY(-50%);
          }
          
          .divider-text {
            background: white;
            padding: 0 20px;
            color: #6c757d;
            font-size: 14px;
            position: relative;
            display: inline-block;
            font-weight: 500;
          }
          
          .avatar-placeholder {
            width: 80px;
            height: 80px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          /* Modal Content Styling */
          .modal-content {
            border: 1px solid #e0e0e0 !important;
            box-shadow: 
              0 25px 50px -12px rgba(0, 0, 0, 0.25),
              0 0 0 1px rgba(255, 255, 255, 0.1) !important;
            backdrop-filter: blur(20px);
            background: rgba(255, 255, 255, 0.98) !important;
          }
          
          /* Perfect Responsive Design */
          @media (max-width: 576px) {
            .modal-dialog {
              margin: 0 auto !important;
              max-width: 95% !important;
              width: 95% !important;
            }
            
            .modal-content {
              border-radius: 20px !important;
              margin: 10px !important;
            }
            
            .form-control {
              font-size: 16px !important;
              height: 56px !important;
              padding: 18px !important;
            }
            
            .btn {
              height: 56px !important;
              font-size: 16px !important;
            }
          }
          
          @media (min-width: 577px) and (max-width: 768px) {
            .modal-dialog {
              max-width: 400px !important;
              width: 400px !important;
            }
          }
          
          @media (min-width: 769px) {
            .modal-dialog {
              max-width: 420px !important;
              width: 420px !important;
            }
            
            .modal-content {
              border-radius: 20px !important;
            }
          }
          
          /* Hover effects */
          .btn-outline-secondary:hover {
            background-color: #f8f9fa !important;
            border-color: #adb5bd !important;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
          }
          
          .btn-primary:hover {
            transform: translateY(-1px);
            box-shadow: 0 6px 20px rgba(0, 123, 255, 0.3) !important;
          }
          
          /* Focus states for better accessibility */
          .form-control:focus {
            border-color: #007bff !important;
            box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1) !important;
            transform: translateY(-1px);
          }
          
          /* Smooth transitions */
          .modal-content,
          .btn,
          .form-control {
            transition: all 0.3s ease;
          }
          
          /* Backdrop blur effect */
          .modal-backdrop {
            backdrop-filter: blur(8px);
            background: rgba(0, 0, 0, 0.5) !important;
          }
        `}
      </style>
      
      {/* Fixed Top Header */}
      <SlideNavbar />

      {/* Quick Categories Bar */}
      <div className="fixed-top" style={{ top: '60px', zIndex: 1025 }}>
        <div className="container-fluid px-0">
          <div className="row justify-content-center mx-0">
            <div className="col-12 px-0">
              <div className="quick-categories-bar" style={{
                background: 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(0,0,0,0.1)',
                padding: '12px 0 8px 0',
                boxShadow: '0 2px 20px rgba(0,0,0,0.1)'
              }}>
                <div className="d-flex justify-content-around align-items-center px-2">
                  {quickCategories.map((category) => (
                    <button
                      key={category.id}
                      className={`quick-category-item ${activeCategory === category.id ? 'active' : ''} d-flex flex-column align-items-center position-relative`}
                      onClick={() => handleCategorySelect(category.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: '8px 12px',
                        minWidth: '70px',
                        transition: 'all 0.3s ease',
                        borderRadius: '8px',
                        cursor: 'pointer'
                      }}
                    >
                      {/* Icon */}
                      <div className="quick-category-icon mb-1" style={{
                        width: '28px',
                        height: '28px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1rem',
                        color: activeCategory === category.id ? '#007bff' : '#666666',
                        transition: 'all 0.3s ease'
                      }}>
                        <i className={`fas ${category.icon}`}></i>
                      </div>
                      
                      {/* Label */}
                      <span className="quick-category-label" style={{
                        fontSize: '0.65rem',
                        fontWeight: '600',
                        color: activeCategory === category.id ? '#007bff' : '#666666',
                        transition: 'all 0.3s ease',
                        textAlign: 'center',
                        lineHeight: '1.1'
                      }}>
                        {category.name}
                      </span>

                      {/* Active Indicator */}
                      {activeCategory === category.id && (
                        <div className="position-absolute bottom-0 start-50 translate-middle-x" style={{
                          width: '4px',
                          height: '4px',
                          background: '#007bff',
                          borderRadius: '50%',
                          marginBottom: '-2px'
                        }}></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Authentication Modal */}
      <AuthModal />

      {/* Main Content */}
      <div className="container-fluid bg-white" style={{ paddingTop: '120px', paddingBottom: '20px' }}>
        {/* Loading State */}
        {isLoading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary mb-3"></div>
            <p className="text-muted">Loading products...</p>
          </div>
        ) : (
          <>
            {/* Results Summary */}
            <div className="row mb-3">
              <div className="col-12">
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="text-dark mb-0 fw-bold">
                    {searchResults.length} {searchResults.length === 1 ? 'item' : 'items'} found
                    {filters.category && ` in ${filters.category}`}
                    {searchQuery && ` for "${searchQuery}"`}
                  </h6>
                  {(getActiveFiltersCount() > 0 || searchQuery.trim() !== "") && (
                    <button
                      className="btn btn-sm btn-outline-primary rounded-pill"
                      onClick={clearSearch}
                    >
                      <i className="fas fa-times me-1"></i>
                      Clear All
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Search Results */}
            <div className="row g-2">
              {searchResults.length === 0 && hasSearched ? (
                <div className="col-12 text-center py-5">
                  <i className="fas fa-search fa-3x text-muted mb-3"></i>
                  <h5 className="text-dark fw-bold">No matches found</h5>
                  <p className="text-muted">Try different words or check spelling</p>
                  <button
                    className="btn btn-primary rounded-pill px-4"
                    onClick={clearSearch}
                  >
                    <i className="fas fa-undo me-2"></i>
                    Reset Search
                  </button>
                </div>
              ) : (
                searchResults.map((item) => (
                  <div key={item.id} className="col-6 col-lg-3 col-xl-2">
                    {/* Product Card */}
                    <div 
                      className="card h-100 border-0 shadow-sm product-card clickable-card"
                      style={{ 
                        borderRadius: '12px', 
                        overflow: 'hidden',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onClick={() => handleViewDetails(item.id)}
                    >
                      
                      {/* Image Section */}
                      <div className="position-relative">
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
                        
                        {/* Category Badge */}
                        <div className="position-absolute top-0 start-0 m-1">
                          <span className="badge bg-primary text-white px-2 py-1 rounded-pill" style={{ fontSize: '0.6rem' }}>
                            <i className={`fas ${getCategoryIcon(item.category)} me-1`} style={{ fontSize: '0.5rem' }}></i>
                            <small>{item.category === 'Building & Hotels' ? 'Hotel' : item.category.split(' ')[0]}</small>
                          </span>
                        </div>

                        {/* Stock Status */}
                        {item.type === 'product' && (
                          <div className="position-absolute top-0 end-0 m-1">
                            <span className={`badge ${item.stock > 0 ? 'bg-success' : 'bg-danger'} px-2 py-1 rounded-pill`} style={{ fontSize: '0.6rem' }}>
                              <small>{item.stock > 0 ? 'In Stock' : 'Out of Stock'}</small>
                            </span>
                          </div>
                        )}

                        {/* Rating Badge */}
                        <div className="position-absolute bottom-0 start-0 m-1">
                          <span className="badge bg-white text-dark px-2 py-1 rounded-pill shadow-sm" style={{ fontSize: '0.6rem' }}>
                            <i className="fas fa-star text-warning me-1" style={{ fontSize: '0.5rem' }}></i>
                            <small className="fw-bold">{item.rating || '4.0'}</small>
                          </span>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="card-body p-2 d-flex flex-column">
                        {/* Product Title */}
                        <h6 className="card-title text-dark fw-bold mb-1" style={{ lineHeight: '1.2', fontSize: '0.8rem' }}>
                          {item.name.length > 40 ? `${item.name.substring(0, 40)}...` : item.name}
                        </h6>

                        {/* Business Name */}
                        <p className="card-text text-muted mb-1 small" style={{ fontSize: '0.65rem' }}>
                          <i className="fas fa-store me-1 text-primary"></i>
                          {item.businessName || item.business}
                        </p>

                        {/* Price */}
                        <div className="mb-2 mt-auto">
                          <h6 className="text-success fw-bold mb-0" style={{ fontSize: '0.9rem', lineHeight: '1.1' }}>
                            {formatPrice(item)}
                          </h6>
                          <small className="text-muted" style={{ fontSize: '0.6rem' }}>
                            {item.type === 'product' ? 'Inclusive of VAT' : 'Per night'}
                          </small>
                        </div>

                        {/* Location */}
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <small className="text-muted" style={{ fontSize: '0.6rem' }}>
                            <i className="fas fa-map-marker-alt text-primary me-1"></i>
                            {item.location ? calculateDistance(item.location.lat, item.location.lng) : item.city}
                          </small>
                        </div>

                        {/* Action Buttons */}
                        <div className="d-flex gap-1 mt-auto">
                          <button
                            className="btn btn-outline-primary flex-fill rounded-pill py-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleContactBusiness(item);
                            }}
                            style={{ fontSize: '0.7rem' }}
                          >
                            <i className="fas fa-phone me-1"></i>
                            Contact
                          </button>
                          <button
                            className="btn btn-outline-secondary rounded-pill py-1 px-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleGetDirections(item);
                            }}
                            style={{ fontSize: '0.7rem' }}
                            title="Get Directions"
                          >
                            <i className="fas fa-directions"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ProductSearch;