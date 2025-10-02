// src/ProductSearch.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ProductSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [filters, setFilters] = useState({
    category: "",
    country: "",
    region: "",
    city: "",
    inStock: true
  });
  const [userLocation, setUserLocation] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSearchPage, setShowSearchPage] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  // Countries and Currencies
  const countries = [
    { code: "TZ", name: "Tanzania", currency: "TZS", currencySymbol: "TSh" },
    { code: "KE", name: "Kenya", currency: "KES", currencySymbol: "KSh" },
    { code: "UG", name: "Uganda", currency: "UGX", currencySymbol: "USh" },
    { code: "US", name: "United States", currency: "USD", currencySymbol: "$" },
    { code: "GB", name: "United Kingdom", currency: "GBP", currencySymbol: "£" },
    { code: "EU", name: "European Union", currency: "EUR", currencySymbol: "€" },
    { code: "JP", name: "Japan", currency: "JPY", currencySymbol: "¥" },
    { code: "CN", name: "China", currency: "CNY", currencySymbol: "¥" },
    { code: "IN", name: "India", currency: "INR", currencySymbol: "₹" },
    { code: "ZA", name: "South Africa", currency: "ZAR", currencySymbol: "R" },
    { code: "NG", name: "Nigeria", currency: "NGN", currencySymbol: "₦" },
    { code: "ET", name: "Ethiopia", currency: "ETB", currencySymbol: "Br" },
    { code: "RW", name: "Rwanda", currency: "RWF", currencySymbol: "FRw" },
    { code: "BI", name: "Burundi", currency: "BIF", currencySymbol: "FBu" },
    { code: "CD", name: "DR Congo", currency: "CDF", currencySymbol: "FC" }
  ];

  // Regions by Country
  const regionsByCountry = {
    "Tanzania": ["Dar es Salaam", "Arusha", "Mwanza", "Zanzibar", "Mbeya", "Dodoma", "Morogoro", "Tanga", "Moshi", "Iringa"],
    "Kenya": ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Thika", "Malindi", "Kitale"],
    "Uganda": ["Kampala", "Entebbe", "Jinja", "Gulu", "Mbale", "Lira", "Mbarara"],
    "United States": ["New York", "California", "Texas", "Florida", "Illinois", "Washington", "Massachusetts"],
    "United Kingdom": ["London", "Manchester", "Birmingham", "Liverpool", "Glasgow", "Edinburgh"],
    "European Union": ["Paris", "Berlin", "Rome", "Madrid", "Amsterdam", "Brussels"],
    "Japan": ["Tokyo", "Osaka", "Kyoto", "Yokohama", "Nagoya", "Sapporo"],
    "China": ["Beijing", "Shanghai", "Guangzhou", "Shenzhen", "Chengdu", "Hong Kong"],
    "India": ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata"],
    "South Africa": ["Johannesburg", "Cape Town", "Durban", "Pretoria", "Port Elizabeth"],
    "Nigeria": ["Lagos", "Abuja", "Kano", "Ibadan", "Port Harcourt"],
    "Ethiopia": ["Addis Ababa", "Dire Dawa", "Mekelle", "Adama", "Gondar"],
    "Rwanda": ["Kigali", "Butare", "Gitarama", "Ruhengeri", "Gisenyi"],
    "Burundi": ["Bujumbura", "Gitega", "Ngozi", "Rumonge", "Muyinga"],
    "DR Congo": ["Kinshasa", "Lubumbashi", "Mbuji-Mayi", "Kananga", "Kisangani"]
  };

  // MIFANO YA BIDHAA ZOTE NA BUILDING & HOTEL
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
    },
    {
      id: "elec-3",
      name: "Samsung Galaxy S24",
      category: "Electronics & Devices",
      price: 800,
      currency: "USD",
      currencySymbol: "$",
      stock: 8,
      business: "TechGlobal USA",
      location: { lat: 40.7128, lng: -74.0060 },
      address: "Manhattan, New York",
      country: "United States",
      region: "New York",
      city: "New York",
      images: ["https://images.pexels.com/photos/47261/pexels-photo-47261.jpeg?auto=compress&cs=tinysrgb&w=300"],
      lastUpdated: "2024-01-16",
      description: "Latest Samsung flagship with AI features",
      specifications: ["Display: 6.2-inch Dynamic AMOLED", "Chip: Snapdragon 8 Gen 3", "Storage: 256GB"],
      features: ["AI Photography", "5G Connectivity", "Wireless Charging"],
      brand: "Samsung",
      condition: "new",
      requiresSpecifications: true,
      rating: 4.6,
      reviews: 32,
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
    },
    {
      id: "gen-2",
      name: "Designer Handbag",
      category: "General Goods",
      price: 150000,
      currency: "TZS",
      currencySymbol: "TSh",
      stock: 8,
      business: "Fashion House Dar",
      location: { lat: -6.8155, lng: 39.2861 },
      address: "Masaki, Dar es Salaam",
      country: "Tanzania",
      region: "Dar es Salaam",
      city: "Dar es Salaam",
      images: ["https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=300"],
      lastUpdated: "2024-01-13",
      description: "Luxury designer handbag made from genuine leather",
      features: ["Genuine Leather", "Multiple Compartments", "Adjustable Strap"],
      brand: "StyleCraft",
      condition: "new",
      size: "Medium",
      color: "Brown",
      material: "Leather",
      requiresSpecifications: false,
      rating: 4.6,
      reviews: 8,
      type: "product"
    },
    {
      id: "gen-3",
      name: "Nike Air Max",
      category: "General Goods",
      price: 120,
      currency: "USD",
      currencySymbol: "$",
      stock: 12,
      business: "Sneaker World USA",
      location: { lat: 34.0522, lng: -118.2437 },
      address: "Downtown Los Angeles",
      country: "United States",
      region: "California",
      city: "Los Angeles",
      images: ["https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=300"],
      lastUpdated: "2024-01-15",
      description: "Premium running shoes with air cushioning",
      features: ["Air Cushioning", "Breathable Material", "Durable Sole"],
      brand: "Nike",
      condition: "new",
      size: "M",
      color: "White/Red",
      material: "Synthetic",
      requiresSpecifications: false,
      rating: 4.7,
      reviews: 28,
      type: "product"
    }
  ];

  // MIFANO YA BUILDING & HOTEL
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
      checkInTime: "12:00",
      policies: "Free cancellation 24 hours before check-in",
      type: "service"
    },
    {
      id: "hotel-2",
      name: "Kilimanjaro Business Suites",
      category: "Building & Hotels",
      serviceType: "Luxury Apartment",
      priceRange: "80,000-150,000",
      currency: "TZS",
      currencySymbol: "TSh",
      business: "Prime Properties Tanzania",
      location: { lat: -6.8120, lng: 39.2840 },
      address: "City Center, Dar es Salaam",
      country: "Tanzania",
      region: "Dar es Salaam",
      city: "Dar es Salaam",
      images: ["https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=300"],
      lastUpdated: "2024-01-14",
      description: "Modern luxury apartments with business facilities in city center",
      amenities: ["Fully Equipped Kitchen", "Free WiFi", "Gym", "Parking", "Security"],
      services: ["Cleaning Service", "Concierge", "Business Center", "Airport Pickup"],
      contactInfo: "+255 712 345 678 | bookings@kilimanjarosuites.com",
      capacity: "2-4 guests per apartment",
      rating: "4",
      checkInTime: "15:00",
      checkOutTime: "11:00",
      policies: "Minimum 2-night stay, No smoking in rooms",
      type: "service"
    },
    {
      id: "hotel-3",
      name: "New York Luxury Suites",
      category: "Building & Hotels",
      serviceType: "Luxury Apartment",
      priceRange: "300-600",
      currency: "USD",
      currencySymbol: "$",
      business: "Manhattan Properties",
      location: { lat: 40.7589, lng: -73.9851 },
      address: "Times Square, Manhattan",
      country: "United States",
      region: "New York",
      city: "New York",
      images: ["https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=300"],
      lastUpdated: "2024-01-16",
      description: "Luxury apartments in the heart of Manhattan",
      amenities: ["City Views", "Fitness Center", "Concierge", "High-Speed WiFi"],
      services: ["24/7 Concierge", "Housekeeping", "Room Service", "Business Center"],
      contactInfo: "+1 212 555 7890 | info@nyluxurysuites.com",
      capacity: "2-6 guests per suite",
      rating: "4.8",
      checkInTime: "15:00",
      checkOutTime: "11:00",
      policies: "Flexible cancellation policy",
      type: "service"
    }
  ];

  // Initialize
  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          console.log("Location access denied");
          setUserLocation({ lat: -6.7924, lng: 39.2083 });
        }
      );
    } else {
      setUserLocation({ lat: -6.7924, lng: 39.2083 });
    }

    // Load all items from localStorage and combine with demo items
    loadAllItems();
  }, []);

  const loadAllItems = () => {
    const allBusinesses = JSON.parse(localStorage.getItem('verifiedBusinesses')) || [];
    let storedProducts = [];
    let storedServices = [];
    
    // Load all products and services from all businesses
    allBusinesses.forEach(business => {
      const businessProducts = JSON.parse(localStorage.getItem(`products_${business.id}`)) || [];
      const businessServices = JSON.parse(localStorage.getItem(`services_${business.id}`)) || [];
      
      // Add business info to each product/service
      const productsWithBusiness = businessProducts.map(product => ({
        ...product,
        businessName: business.businessName,
        businessPhone: business.phone,
        businessEmail: business.email,
        businessAddress: business.address
      }));
      
      const servicesWithBusiness = businessServices.map(service => ({
        ...service,
        businessName: business.businessName,
        businessPhone: business.phone,
        businessEmail: business.email,
        businessAddress: business.address
      }));
      
      storedProducts = [...storedProducts, ...productsWithBusiness];
      storedServices = [...storedServices, ...servicesWithBusiness];
    });

    // Combine stored items with sample items
    const combinedItems = [
      ...sampleElectronics,
      ...sampleGeneralGoods, 
      ...sampleBuildingHotels,
      ...storedProducts,
      ...storedServices
    ];
    
    console.log("Total items loaded:", combinedItems.length);
    setAllItems(combinedItems);
    setSearchResults(combinedItems);
  };

  // Generate search suggestions based on current input
  const generateSearchSuggestions = (query) => {
    if (query.trim() === "") return [];

    const suggestions = new Set();
    const queryLower = query.toLowerCase();

    // Common search patterns and autocomplete
    const commonSearches = [
      "laptop", "laptops", "phone", "phones", "hotel", "hotels",
      "shoes", "bag", "bags", "computer", "electronics", "clothes",
      "apartment", "apartments", "restaurant", "car", "cars"
    ];

    // Search through all items for matching names, categories, brands
    allItems.forEach(item => {
      // Match product names
      if (item.name.toLowerCase().includes(queryLower)) {
        suggestions.add(item.name);
      }
      
      // Match categories
      if (item.category.toLowerCase().includes(queryLower)) {
        suggestions.add(item.category);
      }
      
      // Match brands
      if (item.brand && item.brand.toLowerCase().includes(queryLower)) {
        suggestions.add(item.brand);
      }
      
      // Match business names
      if (item.businessName && item.businessName.toLowerCase().includes(queryLower)) {
        suggestions.add(item.businessName);
      }
      
      // Match service types
      if (item.serviceType && item.serviceType.toLowerCase().includes(queryLower)) {
        suggestions.add(item.serviceType);
      }
    });

    // Add common searches that match the query
    commonSearches.forEach(search => {
      if (search.startsWith(queryLower) || search.includes(queryLower)) {
        suggestions.add(search.charAt(0).toUpperCase() + search.slice(1));
      }
    });

    // Generate autocomplete suggestions for partial words
    if (queryLower.length >= 2) {
      // For "lap" suggest "laptop", "laptops"
      if (queryLower === "lap") {
        suggestions.add("Laptop");
        suggestions.add("Laptops");
      }
      // For "lapb" suggest "laptop bag", "laptop bags"
      if (queryLower === "lapb") {
        suggestions.add("Laptop Bag");
        suggestions.add("Laptop Bags");
      }
      // For "hot" suggest "hotel", "hotels"
      if (queryLower === "hot") {
        suggestions.add("Hotel");
        suggestions.add("Hotels");
      }
      // For "pho" suggest "phone", "phones"
      if (queryLower === "pho") {
        suggestions.add("Phone");
        suggestions.add("Phones");
      }
      // For "ele" suggest "electronics"
      if (queryLower === "ele") {
        suggestions.add("Electronics");
      }
      // For "sho" suggest "shoes"
      if (queryLower === "sho") {
        suggestions.add("Shoes");
      }
    }

    return Array.from(suggestions).slice(0, 8); // Return top 8 suggestions
  };

  // Handle search input change with autocomplete
  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.trim() !== "") {
      const suggestions = generateSearchSuggestions(value);
      setSearchSuggestions(suggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      setSearchSuggestions([]);
    }
  };

  // Handle search suggestion click
  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    handleSearch(suggestion);
  };

  const handleSearch = (query = searchQuery) => {
    let filtered = [...allItems];

    // Apply search query filter
    if (query.trim() !== "") {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        (item.category && item.category.toLowerCase().includes(query.toLowerCase())) ||
        (item.businessName && item.businessName.toLowerCase().includes(query.toLowerCase())) ||
        (item.business && item.business.toLowerCase().includes(query.toLowerCase())) ||
        (item.brand && item.brand.toLowerCase().includes(query.toLowerCase())) ||
        (item.serviceType && item.serviceType.toLowerCase().includes(query.toLowerCase())) ||
        (item.description && item.description.toLowerCase().includes(query.toLowerCase())) ||
        (item.country && item.country.toLowerCase().includes(query.toLowerCase())) ||
        (item.city && item.city.toLowerCase().includes(query.toLowerCase()))
      );
    }

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(item => item.category === filters.category);
    }

    // Apply country filter
    if (filters.country) {
      filtered = filtered.filter(item => item.country === filters.country);
    }

    // Apply region filter
    if (filters.region) {
      filtered = filtered.filter(item => item.region === filters.region);
    }

    // Apply city filter
    if (filters.city) {
      filtered = filtered.filter(item => 
        item.city && item.city.toLowerCase().includes(filters.city.toLowerCase())
      );
    }

    // Apply stock filter
    if (filters.inStock) {
      filtered = filtered.filter(item => 
        item.type === 'service' || (item.type === 'product' && item.stock > 0)
      );
    }

    setSearchResults(filtered);
    setHasSearched(true);
    setShowSuggestions(false);
  };

  // UPDATED: Handle search from search page - Redirect to search results page
  const handleSearchPageSearch = (query) => {
    if (query.trim() !== "") {
      // Redirect to search results page with query parameter
      navigate(`/search-results?q=${encodeURIComponent(query)}`);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = {
      ...filters,
      [key]: value
    };

    // Reset dependent filters when parent filter changes
    if (key === 'country') {
      newFilters.region = "";
      newFilters.city = "";
    } else if (key === 'region') {
      newFilters.city = "";
    }

    setFilters(newFilters);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setFilters({
      category: "",
      country: "",
      region: "",
      city: "",
      inStock: true
    });
    setSearchResults(allItems);
    setHasSearched(false);
    setShowSuggestions(false);
  };

  const clearSearchPageSearch = () => {
    setSearchQuery("");
    setSearchResults(allItems);
    setHasSearched(false);
    setShowSuggestions(false);
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      country: "",
      region: "",
      city: "",
      inStock: true
    });
    setSearchResults(allItems);
    setHasSearched(false);
  };

  const handleCategorySelect = (category) => {
    setFilters(prev => ({ ...prev, category }));
    
    // Apply the category filter immediately
    const newFilters = { ...filters, category };
    applyFilters(newFilters);
  };

  const applyFilters = (filterSettings = filters) => {
    let filtered = [...allItems];

    // Apply search query filter
    if (searchQuery.trim() !== "") {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.businessName && item.businessName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.business && item.business.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.brand && item.brand.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.serviceType && item.serviceType.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.country && item.country.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.city && item.city.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply category filter
    if (filterSettings.category) {
      filtered = filtered.filter(item => item.category === filterSettings.category);
    }

    // Apply country filter
    if (filterSettings.country) {
      filtered = filtered.filter(item => item.country === filterSettings.country);
    }

    // Apply region filter
    if (filterSettings.region) {
      filtered = filtered.filter(item => item.region === filterSettings.region);
    }

    // Apply city filter
    if (filterSettings.city) {
      filtered = filtered.filter(item => 
        item.city && item.city.toLowerCase().includes(filterSettings.city.toLowerCase())
      );
    }

    // Apply stock filter
    if (filterSettings.inStock) {
      filtered = filtered.filter(item => 
        item.type === 'service' || (item.type === 'product' && item.stock > 0)
      );
    }

    setSearchResults(filtered);
    setHasSearched(true);
  };

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

  const handleGetDirections = (item) => {
    if (item.location && item.location.lat && item.location.lng) {
      const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${item.location.lat},${item.location.lng}`;
      window.open(mapsUrl, '_blank');
    } 
    else if (item.address || (item.city && item.country)) {
      const addressParts = [];
      if (item.address) addressParts.push(item.address);
      if (item.city) addressParts.push(item.city);
      if (item.region) addressParts.push(item.region);
      if (item.country) addressParts.push(item.country);
      
      const fullAddress = addressParts.join(', ');
      const encodedAddress = encodeURIComponent(fullAddress);
      const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
      window.open(mapsUrl, '_blank');
    }
    else if (item.businessName && item.country) {
      const locationQuery = `${item.businessName}, ${item.city || item.region || ''}, ${item.country}`;
      const encodedQuery = encodeURIComponent(locationQuery.trim());
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`;
      window.open(mapsUrl, '_blank');
    }
    else {
      alert('Samahani, hakuna taarifa ya eneo inayopatikana kwa huduma hii. Tafadhali wasiliana na biashara moja kwa moja.');
    }
  };

  const handleContactBusiness = (item) => {
    const phoneNumber = item.businessPhone || "+255754000000";
    const email = item.businessEmail || `${item.businessName?.toLowerCase().replace(/\s+/g, '')}@email.com`;
    const address = item.businessAddress || item.address;
    
    alert(`Contact Information:\n\nBusiness: ${item.businessName || item.business}\nPhone: ${phoneNumber}\nEmail: ${email}\nAddress: ${address}, ${item.city}, ${item.country}`);
  };

  const handleViewDetails = (itemId) => {
    navigate(`/product/${itemId}`);
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
      case 'Electronics & Devices':
        return 'fa-microchip';
      case 'General Goods':
        return 'fa-tshirt';
      case 'Building & Hotels':
        return 'fa-building';
      default:
        return 'fa-box';
    }
  };

  const getCategoryBadge = (category) => {
    switch(category) {
      case 'Electronics & Devices':
        return 'bg-primary';
      case 'General Goods':
        return 'bg-warning';
      case 'Building & Hotels':
        return 'bg-success';
      default:
        return 'bg-secondary';
    }
  };

  const getItemImage = (item) => {
    if (item.images && item.images.length > 0) {
      return item.images[0];
    }
    return item.image;
  };

  const getCountryFlag = (countryCode) => {
    const flagEmojis = {
      'TZ': '🇹🇿', 'KE': '🇰🇪', 'UG': '🇺🇬', 'US': '🇺🇸', 'GB': '🇬🇧',
      'EU': '🇪🇺', 'JP': '🇯🇵', 'CN': '🇨🇳', 'IN': '🇮🇳', 'ZA': '🇿🇦',
      'NG': '🇳🇬', 'ET': '🇪🇹', 'RW': '🇷🇼', 'BI': '🇧🇮', 'CD': '🇨🇩'
    };
    return flagEmojis[countryCode] || '🏳️';
  };

  const formatPrice = (item) => {
    if (item.type === 'service') {
      return `${item.currencySymbol || '$'} ${item.priceRange}`;
    }
    return `${item.currencySymbol || '$'} ${item.price?.toLocaleString() || '0'}`;
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.category) count++;
    if (filters.country) count++;
    if (filters.region) count++;
    if (filters.city) count++;
    return count;
  };

  // Get available regions based on selected country
  const getAvailableRegions = () => {
    if (!filters.country) return [];
    return regionsByCountry[filters.country] || [];
  };

  // Get available cities based on selected region and country
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

  const handleAccountClick = () => {
    // Check if user is logged in as business
    const isBusinessAuthenticated = localStorage.getItem('businessAuthenticated') === 'true';
    
    if (isBusinessAuthenticated) {
      navigate('/business-dashboard');
    } else {
      navigate('/business-auth');
    }
  };

  // Handle search input focus to show search page
  const handleSearchInputFocus = () => {
    setShowSearchPage(true);
  };

  // Handle back from search page
  const handleSearchPageBack = () => {
    setShowSearchPage(false);
    setShowSuggestions(false);
  };

  // Handle form submit in search page
  const handleSearchPageSubmit = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    handleSearchPageSearch(searchQuery);
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

        {/* Search Page Content - Show search results only after search */}
        <div className="container-fluid" style={{ paddingTop: '20px', paddingBottom: '80px' }}>
          {/* Show empty state when no search has been performed */}
          {!hasSearched && searchQuery.trim() === "" && (
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

  // Show search page when activated
  if (showSearchPage) {
    return <SearchPage />;
  }

  // ORIGINAL PAGE
  return (
    <div className="min-vh-100" style={{ background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)" }}>
      {/* Fixed Top Header - WITH SEARCH ICON INSIDE AND ACCOUNT ON RIGHT */}
      <div className="fixed-top bg-white border-bottom" style={{ zIndex: 1030 }}>
        <div className="container-fluid p-3">
          <div className="row align-items-center">
            {/* Search Bar - With Search Icon Inside */}
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
            
            {/* Account Icon - Right Side */}
            <div className="col-auto ms-2">
              <button
                className="btn btn-light rounded-circle"
                onClick={handleAccountClick}
                style={{ 
                  width: '45px', 
                  height: '45px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <i className="bi bi-person"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Rest of the component remains the same... */}
      {/* Filter Modal */}
      {showFilterModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
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
                      <i className="fas fa-map-marker-alt me-2 text-danger"></i>
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
                      <i className="fas fa-city me-2 text-info"></i>
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
                      <i className="fas fa-box me-2 text-success"></i>
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
                    className="btn btn-outline-dark rounded-pill flex-fill fw-semibold"
                    onClick={clearFilters}
                  >
                    <i className="fas fa-eraser me-2"></i>
                    Clear All
                  </button>
                  <button
                    className="btn custom-primary-btn rounded-pill flex-fill fw-semibold"
                    onClick={() => {
                      applyFilters();
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

      {/* Main Content */}
      <div className="container-fluid" style={{ paddingTop: '100px', paddingBottom: '80px' }}>
        {/* Results Summary */}
        <div className="row mb-3">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              <h6 className="text-dark mb-0 fw-bold">
                {searchResults.length} {searchResults.length === 1 ? 'item' : 'items'} found
                {filters.category && ` in ${filters.category}`}
              </h6>
              {getActiveFiltersCount() > 0 && (
                <button
                  className="btn btn-sm btn-outline-dark rounded-pill"
                  onClick={clearFilters}
                >
                  <i className="fas fa-times me-1"></i>
                  Clear ({getActiveFiltersCount()})
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Search Results - 4 ITEMS PER ROW ON MOBILE */}
        <div className="row g-3">
          {searchResults.length === 0 ? (
            <div className="col-12 text-center py-5">
              <i className="fas fa-search fa-3x text-muted mb-3"></i>
              <h5 className="text-muted fw-bold">No results found</h5>
              <p className="text-muted">Try adjusting your search or filters</p>
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
              <div key={item.id} className="col-6 col-sm-4 col-lg-3">
                <div className="card h-100 border-0 shadow-sm product-card">
                  {/* Item Image */}
                  <div className="position-relative">
                    <img
                      src={getItemImage(item)}
                      className="card-img-top"
                      alt={item.name}
                      style={{ 
                        height: '140px', 
                        objectFit: 'cover',
                        width: '100%'
                      }}
                      onError={(e) => {
                        e.target.src = 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=300';
                      }}
                    />
                    
                    {/* Category Badge */}
                    <div className="position-absolute top-0 start-0 m-2">
                      <span className="badge custom-primary-bg text-white px-2 py-1 rounded-pill">
                        <i className={`fas ${getCategoryIcon(item.category)} me-1`} style={{ fontSize: '0.7rem' }}></i>
                        <small>{item.category === 'Building & Hotels' ? 'Hotel' : item.category.split(' ')[0]}</small>
                      </span>
                    </div>

                    {/* Rating Badge */}
                    <div className="position-absolute top-0 end-0 m-2">
                      <span className="badge bg-white text-dark px-2 py-1 rounded-pill">
                        <i className="fas fa-star text-warning me-1" style={{ fontSize: '0.7rem' }}></i>
                        <small>{item.rating || '4.0'}</small>
                      </span>
                    </div>

                    {/* Stock Status */}
                    {item.type === 'product' && (
                      <div className="position-absolute bottom-0 start-0 m-2">
                        <span className={`badge ${item.stock > 0 ? 'bg-success' : 'bg-danger'} px-2 py-1 rounded-pill`}>
                          <small>{item.stock > 0 ? 'In Stock' : 'Out of Stock'}</small>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="card-body p-2 d-flex flex-column">
                    <div className="mb-1">
                      <h6 className="card-title text-dark fw-bold mb-1 small" style={{ lineHeight: '1.2' }}>
                        {item.name.length > 30 ? `${item.name.substring(0, 30)}...` : item.name}
                      </h6>
                      <p className="card-text text-muted mb-1 small">
                        <i className="fas fa-store me-1" style={{ fontSize: '0.7rem' }}></i>
                        {item.businessName || item.business}
                      </p>
                    </div>

                    <div className="mb-2">
                      <div className="d-flex align-items-center justify-content-between">
                        <span className="text-primary fw-bold small">
                          {formatPrice(item)}
                        </span>
                        <div className="d-flex align-items-center">
                          {renderStars(item.rating || 4.0)}
                        </div>
                      </div>
                      
                      <div className="d-flex justify-content-between align-items-center mt-1">
                        <small className="text-muted">
                          <i className="fas fa-map-marker-alt me-1" style={{ fontSize: '0.7rem' }}></i>
                          {item.location ? calculateDistance(item.location.lat, item.location.lng) : item.city}
                        </small>
                        <small className="text-muted">
                          {item.city}
                        </small>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="d-flex gap-1 mt-auto">
                      <button
                        className="btn custom-primary-btn flex-fill rounded-pill py-1"
                        onClick={() => handleViewDetails(item.id)}
                        style={{ fontSize: '0.75rem' }}
                      >
                        <i className="fas fa-eye me-1"></i>
                        View
                      </button>
                      <button
                        className="btn btn-outline-dark rounded-pill py-1 px-2"
                        onClick={() => handleGetDirections(item)}
                        style={{ fontSize: '0.75rem' }}
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
      </div>

      {/* Bottom Navigation Bar - WITHOUT ACCOUNT ICON */}
      <div className="fixed-bottom bg-white border-top shadow-lg" style={{ zIndex: 1030 }}>
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="d-flex justify-content-around align-items-center py-2">
                <button
                  className={`btn ${filters.category === '' ? 'custom-primary-btn' : 'btn-light'} rounded-pill d-flex flex-column align-items-center`}
                  onClick={() => handleCategorySelect('')}
                  style={{ 
                    minWidth: '60px',
                    padding: '8px 4px',
                    fontSize: '0.7rem'
                  }}
                >
                  <i className="fas fa-grid-2 mb-1" style={{ fontSize: '1rem' }}></i>
                  <span>All</span>
                </button>
                
                <button
                  className={`btn ${filters.category === 'Electronics & Devices' ? 'custom-primary-btn' : 'btn-light'} rounded-pill d-flex flex-column align-items-center`}
                  onClick={() => handleCategorySelect('Electronics & Devices')}
                  style={{ 
                    minWidth: '60px',
                    padding: '8px 4px',
                    fontSize: '0.7rem'
                  }}
                >
                  <i className="fas fa-microchip mb-1" style={{ fontSize: '1rem' }}></i>
                  <span>Electronics</span>
                </button>
                
                <button
                  className={`btn ${filters.category === 'General Goods' ? 'custom-primary-btn' : 'btn-light'} rounded-pill d-flex flex-column align-items-center`}
                  onClick={() => handleCategorySelect('General Goods')}
                  style={{ 
                    minWidth: '60px',
                    padding: '8px 4px',
                    fontSize: '0.7rem'
                  }}
                >
                  <i className="fas fa-tshirt mb-1" style={{ fontSize: '1rem' }}></i>
                  <span>Goods</span>
                </button>
                
                <button
                  className={`btn ${filters.category === 'Building & Hotels' ? 'custom-primary-btn' : 'btn-light'} rounded-pill d-flex flex-column align-items-center`}
                  onClick={() => handleCategorySelect('Building & Hotels')}
                  style={{ 
                    minWidth: '60px',
                    padding: '8px 4px',
                    fontSize: '0.7rem'
                  }}
                >
                  <i className="fas fa-building mb-1" style={{ fontSize: '1rem' }}></i>
                  <span>Hotels</span>
                </button>
                
                <button
                  className="btn custom-primary-btn rounded-pill d-flex flex-column align-items-center position-relative"
                  onClick={() => setShowFilterModal(true)}
                  style={{ 
                    minWidth: '60px',
                    padding: '8px 4px',
                    fontSize: '0.7rem'
                  }}
                >
                  <i className="fas fa-filter mb-1" style={{ fontSize: '1rem' }}></i>
                  <span>Filter</span>
                  {getActiveFiltersCount() > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.5rem' }}>
                      {getActiveFiltersCount()}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS */}
      <style jsx>{`
        .custom-primary-bg {
          background-color: #0F5B78 !important;
        }
        .custom-primary-color {
          color: #0F5B78 !important;
        }
        .custom-primary-btn {
          background-color: #0F5B78 !important;
          border-color: #0F5B78 !important;
          color: white !important;
        }
        .custom-primary-btn:hover {
          background-color: #0d4a63 !important;
          border-color: #0d4a63 !important;
        }
        .product-card {
          transition: all 0.3s ease;
        }
        .product-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.1) !important;
        }
        .btn-light {
          background-color: #f8f9fa;
          border-color: #dee2e6;
          color: #495057;
        }
        .btn-light:hover {
          background-color: #e9ecef;
          border-color: #dee2e6;
          color: #495057;
        }
        
        /* Mobile Optimizations */
        @media (max-width: 576px) {
          .container-fluid {
            padding-left: 8px;
            padding-right: 8px;
          }
          .card-body {
            padding: 0.5rem;
          }
          .btn {
            font-size: 0.75rem;
          }
          .badge {
            font-size: 0.65rem;
          }
          .small {
            font-size: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
}

export default ProductSearch;