// src/ProductSearch.jsx - ILIYOREKEBISHWA: HOME KWENYE NAVBAR
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

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
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  
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

  // Languages
  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "sw", name: "Kiswahili", flag: "🇹🇿" },
    { code: "fr", name: "French", flag: "🇫🇷" },
    { code: "es", name: "Spanish", flag: "🇪🇸" },
    { code: "ar", name: "Arabic", flag: "🇸🇦" },
    { code: "zh", name: "Chinese", flag: "🇨🇳" },
    { code: "hi", name: "Hindi", flag: "🇮🇳" },
    { code: "pt", name: "Portuguese", flag: "🇵🇹" }
  ];

  // BEAUTIFUL SIDEBAR CATEGORIES WITH WHITE BACKGROUND
  const categories = [
    { 
      id: "all", 
      name: "All Items", 
      icon: "fa-grid", 
      color: "#007bff",
      description: "Browse all products and services"
    },
    { 
      id: "education", 
      name: "Education", 
      icon: "fa-graduation-cap", 
      color: "#007bff",
      description: "Courses, books, learning"
    },
  ];

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
    loadAllItems();
    loadRecentSearches();
    getUserLocation();
    
    // Check for URL search parameters
    const urlParams = new URLSearchParams(location.search);
    const urlQuery = urlParams.get('q');
    if (urlQuery) {
      setSearchQuery(urlQuery);
      handleSearch(urlQuery);
    }
  }, [location.search]);

  // Load all items from localStorage and sample data
  const loadAllItems = useCallback(() => {
    try {
      setIsLoading(true);
      const allBusinesses = JSON.parse(localStorage.getItem('verifiedBusinesses')) || [];
      let storedProducts = [];
      let storedServices = [];
      
      // Load from all businesses
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

      // Sample data for demonstration
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
          description: "High-performance business laptop with latest Intel Core i7 processor",
          brand: "Dell",
          condition: "new",
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
          description: "Latest iPhone with titanium design and advanced camera system",
          brand: "Apple",
          condition: "new",
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
          description: "Comfortable running shoes designed for maximum performance",
          brand: "RunPro",
          condition: "new",
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
          serviceType: "5-Star Hotel",
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
          description: "5-star luxury hotel with premium amenities and excellent service",
          rating: "5",
          type: "service"
        }
      ];

      const sampleItems = [
        ...sampleElectronics,
        ...sampleGeneralGoods,
        ...sampleBuildingHotels
      ];

      const combinedItems = [...sampleItems, ...storedProducts, ...storedServices];
      setAllItems(combinedItems);
      setSearchResults(combinedItems);
      
    } catch (error) {
      console.error("Error loading items:", error);
      alert("Failed to load products. Please refresh the page.");
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

  // IMPROVED FUZZY SEARCH FUNCTION
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
    
    if (queryLower.length >= 3) {
      const words = textLower.split(/\s+/);
      for (let word of words) {
        if (word.startsWith(queryLower.substring(0, Math.min(3, queryLower.length)))) {
          return { match: true, score: 0.8 };
        }
        if (queryLower.startsWith(word.substring(0, Math.min(3, word.length)))) {
          return { match: true, score: 0.8 };
        }
      }
      
      let bestSimilarity = 0;
      for (let word of words) {
        if (word.length >= 3) {
          const similarity = calculateSimilarity(word, queryLower);
          if (similarity > bestSimilarity) {
            bestSimilarity = similarity;
          }
        }
      }
      
      const fullTextSimilarity = calculateSimilarity(textLower, queryLower);
      bestSimilarity = Math.max(bestSimilarity, fullTextSimilarity);
      
      if (bestSimilarity >= 0.6) {
        return { match: true, score: bestSimilarity };
      }
    }
    
    if (queryWords.length > 1) {
      for (let word of queryWords) {
        if (word.length >= 3 && textLower.includes(word)) {
          return { match: true, score: 0.7 };
        }
      }
    }
    
    return { match: false, score: 0 };
  };

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

    const commonSearches = [
      "laptop", "laptops", "computer", "notebook", 
      "phone", "mobile", "smartphone", "cellphone",
      "hotel", "hotels", "motel", "accommodation",
      "shoes", "shoe", "sneakers", "footwear"
    ];
    
    commonSearches.forEach(search => {
      if (fuzzySearch(search, query).match) {
        suggestions.add(search.charAt(0).toUpperCase() + search.slice(1));
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
    navigate(`/search-results?q=${encodeURIComponent(suggestion)}`);
  };

  // Perform search with filters
  const handleSearch = useCallback((query = searchQuery) => {
    if (!query.trim() && getActiveFiltersCount() === 0) {
      setSearchResults(allItems);
      setHasSearched(false);
      return;
    }

    let filtered = [...allItems];

    if (query.trim() !== "") {
      filtered = filtered.map(item => {
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

      filtered.sort((a, b) => b.searchScore - a.searchScore);
      saveToRecentSearches(query);
    }

    filtered = applyFiltersToResults(filtered);

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
      case "phones":
        category = "Electronics & Devices";
        break;
      case "cars":
        category = "Vehicles";
        break;
      case "realestate":
        category = "Real Estate";
        break;
      case "jobs":
        category = "Jobs";
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

  // Handle filter button click
  const handleFilterClick = () => {
    setShowFilterModal(true);
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

  // Clear filters only
  const clearFilters = () => {
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
      alert('Sorry, no location information available for this service. Please contact the business directly.');
    }
  };

  const handleViewDetails = (itemId) => {
    navigate(`/product/${itemId}`);
  };

  const handleAccountClick = () => {
    const isBusinessAuthenticated = localStorage.getItem('businessAuthenticated') === 'true';
    navigate(isBusinessAuthenticated ? '/business-dashboard' : '/business-auth');
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
      navigate(`/search-results?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  // Close sidebar when clicking overlay
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowSidebar(false);
    }
  };

  // Language handlers
  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language.name);
    setShowLanguageDropdown(false);
    // Here you can add logic to change the app language
    alert(`Language changed to ${language.name}`);
  };

  const handleHelpClick = () => {
    alert("Welcome to BisConnect Help Center!\n\nFor assistance, please contact:\n📞 Customer Support: +255-123-456-789\n📧 Email: support@bisconnect.com\n\nWe're here to help you find the best products and services!");
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

  const getAvailableRegions = () => {
    if (!filters.country) return [];
    return regionsByCountry[filters.country] || [];
  };

  const getAvailableCities = () => {
    if (!filters.country || !filters.region) return [];
    
    const cities = new Set();
    allItems.forEach(item => {
      if (item.country === filters.country && item.region === filters.region && item.city) {
        cities.add(item.city);
      }
    });
    return Array.from(cities);
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

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Electronics & Devices': return 'fa-laptop';
      case 'General Goods': return 'fa-tshirt';
      case 'Building & Hotels': return 'fa-hotel';
      default: return 'fa-box';
    }
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case 'Electronics & Devices': return 'primary';
      case 'General Goods': return 'warning';
      case 'Building & Hotels': return 'success';
      default: return 'secondary';
    }
  };

  const getCategoryBadge = (category) => {
    switch(category) {
      case 'Electronics & Devices': return 'bg-primary';
      case 'General Goods': return 'bg-warning';
      case 'Building & Hotels': return 'bg-success';
      default: return 'bg-secondary';
    }
  };

  const getItemImage = (item) => {
    if (item.images && item.images.length > 0) {
      return item.images[0];
    }
    return 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=300';
  };

  const getCountryFlag = (countryName) => {
    const country = countries.find(c => c.name === countryName);
    const flagEmojis = {
      'TZ': '🇹🇿', 'KE': '🇰🇪', 'UG': '🇺🇬', 'US': '🇺🇸', 'GB': '🇬🇧',
      'EU': '🇪🇺', 'CN': '🇨🇳', 'IN': '🇮🇳', 'ZA': '🇿🇦'
    };
    return flagEmojis[country?.code] || '🏳️';
  };

  const formatPrice = (item) => {
    if (item.type === 'service') {
      return `${item.currencySymbol || '$'} ${item.priceRange}`;
    }
    return `${item.currencySymbol || '$'} ${item.price?.toLocaleString() || '0'}`;
  };

  // NAVBAR YA KAWALIDA (YA KWA MTAANDAO)
  const RegularNavbar = () => {
    return (
      <div className="fixed-top bg-white border-bottom shadow-sm" style={{ zIndex: 1030 }}>
        <div className="container-fluid p-3">
          <div className="row align-items-center">
            {/* Menu Button */}
            <div className="col-auto">
              <button
                className="btn btn-light rounded-circle"
                onClick={toggleSidebar}
                style={{ 
                  width: '45px', 
                  height: '45px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
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
            
            {/* Account Icon */}
            <div className="col-auto ms-2">
              <button
                className="btn btn-light rounded-circle border"
                onClick={handleAccountClick}
                style={{ 
                  width: '45px', 
                  height: '45px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <i className="bi bi-person text-dark"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // NAVBAR YA SLIDE (YA KWA WAVUTIAJI)
  const SlideNavbar = () => {
    return (
      <div className="fixed-top bg-white border-bottom shadow-sm" style={{ zIndex: 1030 }}>
        <div className="container-fluid p-3">
          <div className="row align-items-center">
            {/* Slide Menu Button */}
            <div className="col-auto">
              <button
                className="btn btn-light rounded-circle"
                onClick={toggleSidebar}
                style={{ 
                  width: '45px', 
                  height: '45px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
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
            
            {/* Account Icon */}
            <div className="col-auto ms-2">
              <button
                className="btn btn-light rounded-circle border"
                onClick={handleAccountClick}
                style={{ 
                  width: '45px', 
                  height: '45px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <i className="bi bi-person text-dark"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Search Page Component
  const SearchPage = () => {
    return (
      <div className="min-vh-100 bg-white" style={{ zIndex: 1040, position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
        {/* Search Page Header */}
        <div className="bg-white border-bottom shadow-sm">
          <div className="container-fluid p-3">
            <div className="row align-items-center">
              <div className="col-auto">
                <button
                  className="btn btn-light rounded-circle"
                  onClick={handleSearchPageBack}
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
                <form onSubmit={handleSearchPageSubmit}>
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
                    
                    {/* Search Button */}
                    <button
                      type="submit"
                      className="btn custom-primary-btn rounded-pill position-absolute end-0 top-50 translate-middle-y me-2"
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

        {/* Search Suggestions */}
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

        {/* Recent Searches */}
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

        {/* Search Page Content */}
        <div className="container-fluid" style={{ paddingTop: '20px', paddingBottom: '80px' }}>
          {!hasSearched && searchQuery.trim() === "" && (
            <div className="text-center py-5">
              <i className="fas fa-search fa-4x text-muted mb-4"></i>
              <h4 className="text-muted fw-bold mb-3">Search for Products & Services</h4>
              <p className="text-muted">Enter your search terms above to find items</p>
              
              {/* Quick Categories */}
              <div className="row mt-5">
                <div className="col-4 mb-3">
                  <button 
                    className="btn btn-outline-primary w-100 py-3"
                    onClick={() => handleSuggestionClick("Laptop")}
                  >
                    <i className="fas fa-laptop fa-2x mb-2"></i>
                    <div>Electronics</div>
                  </button>
                </div>
                <div className="col-4 mb-3">
                  <button 
                    className="btn btn-outline-primary w-100 py-3"
                    onClick={() => handleSuggestionClick("Shoes")}
                  >
                    <i className="fas fa-tshirt fa-2x mb-2"></i>
                    <div>Fashion</div>
                  </button>
                </div>
                <div className="col-4 mb-3">
                  <button 
                    className="btn btn-outline-primary w-100 py-3"
                    onClick={() => handleSuggestionClick("Hotel")}
                  >
                    <i className="fas fa-hotel fa-2x mb-2"></i>
                    <div>Hotels</div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Show search page when activated
  if (showSearchPage) {
    return <SearchPage />;
  }

  // BEAUTIFUL SIDEBAR COMPONENT WITH WHITE BACKGROUND
  const SidebarMenu = () => {
    return (
      <>
        {/* Overlay */}
        <div 
          className={`sidebar-overlay ${showSidebar ? 'active' : ''}`}
          onClick={handleOverlayClick}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1090,
            opacity: showSidebar ? 1 : 0,
            visibility: showSidebar ? 'visible' : 'hidden',
            transition: 'all 0.3s ease'
          }}
        ></div>

        {/* Sidebar - NOW WITH WHITE BACKGROUND */}
        <div 
          className={`sidebar-menu ${showSidebar ? 'active' : ''}`}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            bottom: 0,
            width: '320px',
            background: '#ffffff', // WHITE BACKGROUND
            zIndex: 1100,
            transform: showSidebar ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 0.3s ease',
            boxShadow: '2px 0 20px rgba(0,0,0,0.1)',
            overflowY: 'auto'
          }}
        >
          {/* Sidebar Header */}
          <div className="sidebar-header" style={{
            padding: '20px',
            background: '#f8f9fa',
            borderBottom: '1px solid #e9ecef'
          }}>
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <i className="fas fa-bars text-primary me-3 fs-5"></i>
                <h5 className="text-dark mb-0 fw-bold">Browse Categories</h5>
              </div>
              <button 
                className="btn btn-close"
                onClick={toggleSidebar}
              ></button>
            </div>
          </div>

          {/* Sidebar Content */}
          <div className="sidebar-content" style={{ padding: '20px' }}>
            {/* Welcome Section */}
            <div className="welcome-section mb-4">
              <div className="text-center text-dark mb-3">
                <i className="fas fa-shopping-bag fa-2x mb-2 text-primary"></i>
                <h6 className="fw-bold">Find What You Need</h6>
                <small className="text-muted">Browse through our categories</small>
              </div>
            </div>

            {/* Home Link Button */}
            <div className="home-link-section mb-4">
              <Link 
                to="/" 
                className="btn btn-primary w-100 d-flex align-items-center justify-content-center py-3"
                style={{
                  borderRadius: '12px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: '1rem',
                  border: 'none'
                }}
                onClick={() => setShowSidebar(false)}
              >
                <i className="fas fa-home me-3 fs-5"></i>
                Home Page
              </Link>
            </div>

            {/* Categories List */}
            <div className="categories-list">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`category-item w-100 text-start mb-2 ${activeCategory === category.id ? 'active' : ''}`}
                  onClick={() => handleCategorySelect(category.id)}
                  style={{
                    background: activeCategory === category.id ? 'rgba(0, 123, 255, 0.1)' : '#ffffff',
                    border: activeCategory === category.id ? '2px solid #007bff' : '1px solid #e9ecef',
                    borderRadius: '12px',
                    padding: '15px',
                    color: activeCategory === category.id ? '#007bff' : '#495057',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                >
                  <div className="d-flex align-items-center">
                    <div className="category-icon me-3" style={{
                      width: '40px',
                      height: '40px',
                      background: activeCategory === category.id ? '#007bff' : 'rgba(0, 123, 255, 0.1)',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.1rem',
                      color: activeCategory === category.id ? '#ffffff' : '#007bff'
                    }}>
                      <i className={`fas ${category.icon}`}></i>
                    </div>
                    <div className="flex-grow-1">
                      <div className="fw-semibold" style={{ fontSize: '0.9rem' }}>{category.name}</div>
                      <small className={activeCategory === category.id ? "text-primary" : "text-muted"} style={{ fontSize: '0.75rem' }}>{category.description}</small>
                    </div>
                    {activeCategory === category.id && (
                      <i className="fas fa-check text-success ms-2"></i>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Help & Support Section */}
            <div className="help-section mt-4 pt-4 border-top border-secondary border-opacity-25">
              <h6 className="text-dark fw-semibold mb-3">Help & Support</h6>
              
              <button 
                className="btn btn-outline-info w-100 mb-3 d-flex align-items-center justify-content-center"
                onClick={handleHelpClick}
                style={{
                  borderRadius: '10px',
                  padding: '12px',
                  border: '2px solid #17a2b8',
                  color: '#17a2b8',
                  fontWeight: '600'
                }}
              >
                <i className="fas fa-question-circle me-2 fs-5"></i>
                Help Center
              </button>
            </div>

            {/* Language Selector */}
            <div className="language-section mt-4 pt-4 border-top border-secondary border-opacity-25">
              <h6 className="text-dark fw-semibold mb-3">Language</h6>
              
              <div className="position-relative">
                <button 
                  className="btn btn-outline-success w-100 d-flex align-items-center justify-content-between"
                  onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                  style={{
                    borderRadius: '10px',
                    padding: '12px',
                    border: '2px solid #28a745',
                    color: '#28a745',
                    fontWeight: '600'
                  }}
                >
                  <div className="d-flex align-items-center">
                    <i className="fas fa-globe me-2 fs-5"></i>
                    <span>{selectedLanguage}</span>
                  </div>
                  <i className={`fas fa-chevron-${showLanguageDropdown ? 'up' : 'down'}`}></i>
                </button>

                {/* Language Dropdown */}
                {showLanguageDropdown && (
                  <div className="position-absolute top-100 start-0 end-0 mt-1 z-3">
                    <div className="bg-white border rounded-3 shadow-lg" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                      {languages.map((language) => (
                        <button
                          key={language.code}
                          className={`btn btn-light w-100 text-start p-3 border-bottom ${
                            selectedLanguage === language.name ? 'bg-primary text-white' : ''
                          }`}
                          onClick={() => handleLanguageSelect(language)}
                          style={{ 
                            border: 'none',
                            borderRadius: '0',
                            fontSize: '0.9rem'
                          }}
                        >
                          <div className="d-flex align-items-center">
                            <span className="me-3 fs-6">{language.flag}</span>
                            <div>
                              <div className="fw-semibold">{language.name}</div>
                            </div>
                            {selectedLanguage === language.name && (
                              <i className="fas fa-check ms-auto"></i>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions mt-4 pt-4 border-top border-secondary border-opacity-25">
              <h6 className="text-dark fw-semibold mb-3">Quick Actions</h6>
              
              <button 
                className="btn btn-outline-primary w-100 mb-2 d-flex align-items-center justify-content-center"
                onClick={handleFilterClick}
                style={{
                  borderRadius: '10px',
                  padding: '12px',
                  border: '2px solid #007bff',
                  color: '#007bff',
                  fontWeight: '600'
                }}
              >
                <i className="fas fa-filter me-2"></i>
                Advanced Filters
                {getActiveFiltersCount() > 0 && (
                  <span className="badge bg-primary text-white ms-2">
                    {getActiveFiltersCount()}
                  </span>
                )}
              </button>

              <button 
                className="btn btn-primary w-100 d-flex align-items-center justify-content-center"
                onClick={clearSearch}
                style={{
                  borderRadius: '1010px',
                  padding: '12px',
                  fontWeight: '600',
                  background: '#007bff',
                  border: 'none'
                }}
              >
                <i className="fas fa-eraser me-2"></i>
                Clear All Filters
              </button>
            </div>
          </div>
        </div>
      </>
    );
  };

  // Main Component Render
  return (
    <div className="min-vh-100 bg-white">
      {/* Fixed Top Header - NAVBAR MBILI TOFAUTI */}
      {/* UNACHAGUA NAVBAR GANI KUTUMIA HAPA: */}
      {/* <RegularNavbar /> AU <SlideNavbar /> */}
      <SlideNavbar />

      {/* Quick Categories Bar */}
      <div className="fixed-top" style={{ top: '80px', zIndex: 1025 }}>
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

      {/* Sidebar Menu */}
      <SidebarMenu />

      {/* Main Content */}
      <div className="container-fluid bg-white" style={{ paddingTop: '140px', paddingBottom: '20px' }}>
        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary mb-3"></div>
            <p className="text-muted">Loading products...</p>
          </div>
        )}

        {/* Results Summary */}
        {!isLoading && (
          <div className="row mb-3">
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center">
                <h6 className="text-dark mb-0 fw-bold">
                  {searchResults.length} {searchResults.length === 1 ? 'item' : 'items'} found
                  {filters.category && ` in ${filters.category}`}
                  {searchQuery && ` for "${searchQuery}"`}
                  {searchResults.some(item => item.isFuzzyMatch) && " (showing similar results)"}
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
        )}

        {/* Search Results */}
        {!isLoading && (
          <div className="row g-2">
            {searchResults.length === 0 && hasSearched ? (
              <div className="col-12 text-center py-5">
                <i className="fas fa-search fa-3x text-muted mb-3"></i>
                <h5 className="text-dark fw-bold">No matches found</h5>
                <p className="text-muted">Try different keywords or check spelling</p>
                <button
                  className="btn custom-primary-btn rounded-pill px-4"
                  onClick={clearSearch}
                >
                  <i className="fas fa-undo me-2"></i>
                  Reset Search
                </button>
              </div>
            ) : (
              searchResults.map((item) => (
                <div key={item.id} className="col-6 col-lg-2">
                  {/* Product Card */}
                  <div className="card h-100 border-0 shadow-sm product-card" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                    
                    {/* Image Section */}
                    <div className="position-relative">
                      <img
                        src={getItemImage(item)}
                        className="card-img-top"
                        alt={item.name}
                        style={{ 
                          height: '100px', 
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
                            <small>{item.stock > 0 ? 'In Stock' : 'Out'}</small>
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
                          className="btn custom-primary-btn flex-fill rounded-pill py-1"
                          onClick={() => handleViewDetails(item.id)}
                          style={{ fontSize: '0.7rem' }}
                        >
                          <i className="fas fa-eye me-1"></i>
                          View
                        </button>
                        <button
                          className="btn btn-outline-primary rounded-pill py-1 px-2"
                          onClick={() => handleContactBusiness(item)}
                          style={{ fontSize: '0.7rem' }}
                          title="Contact Business"
                        >
                          <i className="fas fa-phone"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1200 }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '15px', overflow: 'hidden' }}>
              {/* Modal Header */}
              <div className="modal-header custom-primary-bg text-white border-0">
                <div className="d-flex align-items-center">
                  <i className="fas fa-sliders-h fs-5 me-3"></i>
                  <h5 className="modal-title mb-0 fw-bold">Advanced Filters</h5>
                </div>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={() => setShowFilterModal(false)}
                ></button>
              </div>

              {/* Modal Body */}
              <div className="modal-body p-4">
                <div className="row g-3">
                  {/* Category Filter */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-dark mb-2">
                      <i className="fas fa-tags me-2 text-primary"></i>
                      Category
                    </label>
                    <select
                      className="form-select border-2 rounded-3"
                      value={filters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                    >
                      <option value="">All Categories</option>
                      <option value="Electronics & Devices">Electronics & Devices</option>
                      <option value="General Goods">General Goods</option>
                      <option value="Building & Hotels">Building & Hotels</option>
                    </select>
                  </div>

                  {/* Price Range Filter */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-dark mb-2">
                      <i className="fas fa-dollar-sign me-2 text-primary"></i>
                      Price Range
                    </label>
                    <select
                      className="form-select border-2 rounded-3"
                      value={filters.priceRange}
                      onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                    >
                      {priceRanges.map(range => (
                        <option key={range.value} value={range.value}>{range.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Country Filter */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-dark mb-2">
                      <i className="fas fa-globe me-2 text-primary"></i>
                      Country
                    </label>
                    <select
                      className="form-select border-2 rounded-3"
                      value={filters.country}
                      onChange={(e) => handleFilterChange('country', e.target.value)}
                    >
                      <option value="">All Countries</option>
                      {countries.map(country => (
                        <option key={country.code} value={country.name}>
                          {getCountryFlag(country.code)} {country.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Region Filter */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-dark mb-2">
                      <i className="fas fa-map-marker-alt me-2 text-primary"></i>
                      Region
                    </label>
                    <select
                      className="form-select border-2 rounded-3"
                      value={filters.region}
                      onChange={(e) => handleFilterChange('region', e.target.value)}
                      disabled={!filters.country}
                    >
                      <option value="">All Regions</option>
                      {getAvailableRegions().map(region => (
                        <option key={region} value={region}>{region}</option>
                      ))}
                    </select>
                  </div>

                  {/* City Filter */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-dark mb-2">
                      <i className="fas fa-city me-2 text-primary"></i>
                      City
                    </label>
                    <select
                      className="form-select border-2 rounded-3"
                      value={filters.city}
                      onChange={(e) => handleFilterChange('city', e.target.value)}
                      disabled={!filters.region}
                    >
                      <option value="">All Cities</option>
                      {getAvailableCities().map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>

                  {/* Stock Filter */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-dark mb-2">
                      <i className="fas fa-box me-2 text-primary"></i>
                      Availability
                    </label>
                    <div className="form-check form-switch mt-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={filters.inStock}
                        onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                        style={{ transform: 'scale(1.2)' }}
                      />
                      <label className="form-check-label fw-medium text-dark">
                        In Stock Only
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="modal-footer border-0 bg-light">
                <div className="d-flex gap-3 w-100">
                  <button
                    className="btn btn-outline-primary rounded-pill flex-fill fw-semibold"
                    onClick={clearFilters}
                  >
                    <i className="fas fa-eraser me-2"></i>
                    Clear Filters
                  </button>
                  <button
                    className="btn custom-primary-btn rounded-pill flex-fill fw-semibold"
                    onClick={() => {
                      handleSearch();
                      setShowFilterModal(false);
                    }}
                  >
                    <i className="fas fa-check me-2"></i>
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom CSS */}
      <style jsx>{`
        .custom-primary-bg {
          background: linear-gradient(135deg, #007bff 0%, #0056b3 100%) !important;
        }
        .custom-primary-btn {
          background: linear-gradient(135deg, #007bff 0%, #0056b3 100%) !important;
          border: none !important;
          color: white !important;
        }
        .custom-primary-btn:hover {
          background: linear-gradient(135deg, #0056b3 0%, #004085 100%) !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 123, 255, 0.4);
        }
        .product-card {
          transition: all 0.3s ease;
          border: 1px solid #f0f0f0;
        }
        .product-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
        }
        
        /* Sidebar Styles */
        .sidebar-menu {
          scrollbar-width: thin;
          scrollbar-color: rgba(0,0,0,0.2) transparent;
        }
        
        .sidebar-menu::-webkit-scrollbar {
          width: 4px;
        }
        
        .sidebar-menu::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .sidebar-menu::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.2);
          border-radius: 2px;
        }
        
        .category-item:hover {
          background: rgba(0, 123, 255, 0.05) !important;
          transform: translateX(5px);
          border-color: #007bff !important;
        }
        
        .quick-category-item:hover {
          background: rgba(0, 123, 255, 0.1) !important;
          transform: translateY(-2px);
        }
        
        .quick-category-item:hover .quick-category-icon {
          color: #007bff !important;
          transform: scale(1.1);
        }
        
        .quick-category-item:hover .quick-category-label {
          color: #007bff !important;
        }
        
        /* Mobile Optimizations */
        @media (max-width: 576px) {
          .container-fluid {
            padding-left: 6px;
            padding-right: 6px;
          }
          .card-body {
            padding: 0.5rem;
          }
          .btn {
            font-size: 0.7rem;
          }
          .badge {
            font-size: 0.6rem;
          }
          .small {
            fontSize: 0.65rem;
          }
          
          .sidebar-menu {
            width: 280px !important;
          }
          
          .quick-category-item {
            padding: 6px 8px !important;
            min-width: 60px !important;
          }
          
          .quick-category-icon {
            width: 24px !important;
            height: 24px !important;
            font-size: 0.9rem !important;
          }
          
          .quick-category-label {
            font-size: 0.6rem !important;
          }
        }

        /* Laptop Optimizations */
        @media (min-width: 992px) {
          .col-lg-2 {
            flex: 0 0 auto;
            width: 16.66666667%;
          }
        }
      `}</style>
    </div>
  );
}

export default ProductSearch;