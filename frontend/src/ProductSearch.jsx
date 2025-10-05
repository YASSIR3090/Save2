// src/ProductSearch.jsx - IMEONGEWA BIDHAA 20 ZA KILA AINA
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
      id: "electronics", 
      name: "Electronics", 
      icon: "fa-laptop", 
      color: "#007bff",
      description: "Laptops, phones, gadgets"
    },
    { 
      id: "fashion", 
      name: "Fashion", 
      icon: "fa-tshirt", 
      color: "#007bff",
      description: "Clothing, shoes, accessories"
    },
    { 
      id: "hotels", 
      name: "Hotels", 
      icon: "fa-hotel", 
      color: "#007bff",
      description: "Hotels, apartments, vacation"
    },
    { 
      id: "cars", 
      name: "Vehicles", 
      icon: "fa-car", 
      color: "#007bff",
      description: "Cars, motorcycles, bikes"
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

      // BIDHAA 20 ZA ELECTRONICS
      const sampleElectronics = [
        {
          id: "elec-1", name: "Dell Latitude Laptop", category: "Electronics & Devices",
          price: 1200000, currency: "TZS", currencySymbol: "TSh", stock: 5,
          business: "TechHub Tanzania", location: { lat: -6.7924, lng: 39.2083 },
          address: "Samora Avenue, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=300"],
          description: "High-performance business laptop with latest Intel Core i7 processor",
          brand: "Dell", condition: "new", rating: 4.5, reviews: 23, type: "product"
        },
        {
          id: "elec-2", name: "iPhone 15 Pro Max", category: "Electronics & Devices",
          price: 2500000, currency: "TZS", currencySymbol: "TSh", stock: 3,
          business: "MobileWorld Tanzania", location: { lat: -6.8184, lng: 39.2883 },
          address: "Mlimani City Mall, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Latest iPhone with titanium design and advanced camera system",
          brand: "Apple", condition: "new", rating: 4.8, reviews: 15, type: "product"
        },
        {
          id: "elec-3", name: "Samsung Galaxy Tab", category: "Electronics & Devices",
          price: 850000, currency: "TZS", currencySymbol: "TSh", stock: 7,
          business: "TechHub Tanzania", location: { lat: -6.7924, lng: 39.2083 },
          address: "Samora Avenue, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "10-inch tablet with high-resolution display and long battery life",
          brand: "Samsung", condition: "new", rating: 4.3, reviews: 12, type: "product"
        },
        {
          id: "elec-4", name: "Wireless Headphones", category: "Electronics & Devices",
          price: 150000, currency: "TZS", currencySymbol: "TSh", stock: 10,
          business: "AudioTech Tanzania", location: { lat: -6.8155, lng: 39.2861 },
          address: "Masaki, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Premium wireless headphones with noise cancellation",
          brand: "SoundMax", condition: "new", rating: 4.6, reviews: 8, type: "product"
        },
        {
          id: "elec-5", name: "Smart Watch Series 8", category: "Electronics & Devices",
          price: 350000, currency: "TZS", currencySymbol: "TSh", stock: 6,
          business: "TechHub Tanzania", location: { lat: -6.7924, lng: 39.2083 },
          address: "Samora Avenue, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Advanced smartwatch with health monitoring features",
          brand: "TechWear", condition: "new", rating: 4.4, reviews: 9, type: "product"
        },
        {
          id: "elec-6", name: "Gaming Laptop RTX 4060", category: "Electronics & Devices",
          price: 2800000, currency: "TZS", currencySymbol: "TSh", stock: 4,
          business: "GameTech Tanzania", location: { lat: -6.8184, lng: 39.2883 },
          address: "Mlimani City Mall, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/777001/pexels-photo-777001.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "High-performance gaming laptop with RTX 4060 graphics",
          brand: "GameMax", condition: "new", rating: 4.7, reviews: 11, type: "product"
        },
        {
          id: "elec-7", name: "Digital Camera DSLR", category: "Electronics & Devices",
          price: 1800000, currency: "TZS", currencySymbol: "TSh", stock: 8,
          business: "Camera World Tanzania", location: { lat: -6.8155, lng: 39.2861 },
          address: "Masaki, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Professional DSLR camera with 24MP sensor",
          brand: "PhotoPro", condition: "new", rating: 4.5, reviews: 7, type: "product"
        },
        {
          id: "elec-8", name: "Bluetooth Speaker", category: "Electronics & Devices",
          price: 120000, currency: "TZS", currencySymbol: "TSh", stock: 15,
          business: "AudioTech Tanzania", location: { lat: -6.8155, lng: 39.2861 },
          address: "Masaki, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/160827/pexels-photo-160827.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Portable Bluetooth speaker with 20W output",
          brand: "SoundWave", condition: "new", rating: 4.2, reviews: 14, type: "product"
        },
        {
          id: "elec-9", name: "Tablet Stand", category: "Electronics & Devices",
          price: 45000, currency: "TZS", currencySymbol: "TSh", stock: 20,
          business: "TechHub Tanzania", location: { lat: -6.7924, lng: 39.2083 },
          address: "Samora Avenue, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/7974/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=300"],
          description: "Adjustable tablet stand for comfortable viewing",
          brand: "TechGear", condition: "new", rating: 4.1, reviews: 6, type: "product"
        },
        {
          id: "elec-10", name: "Wireless Mouse", category: "Electronics & Devices",
          price: 35000, currency: "TZS", currencySymbol: "TSh", stock: 25,
          business: "TechHub Tanzania", location: { lat: -6.7924, lng: 39.2083 },
          address: "Samora Avenue, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Ergonomic wireless mouse with precision tracking",
          brand: "TechGear", condition: "new", rating: 4.3, reviews: 18, type: "product"
        },
        {
          id: "elec-11", name: "External Hard Drive 2TB", category: "Electronics & Devices",
          price: 250000, currency: "TZS", currencySymbol: "TSh", stock: 12,
          business: "TechHub Tanzania", location: { lat: -6.7924, lng: 39.2083 },
          address: "Samora Avenue, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/2588757/pexels-photo-2588757.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Portable 2TB external hard drive for data storage",
          brand: "DataSafe", condition: "new", rating: 4.6, reviews: 9, type: "product"
        },
        {
          id: "elec-12", name: "Mechanical Keyboard", category: "Electronics & Devices",
          price: 180000, currency: "TZS", currencySymbol: "TSh", stock: 8,
          business: "GameTech Tanzania", location: { lat: -6.8184, lng: 39.2883 },
          address: "Mlimani City Mall, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/2115257/pexels-photo-2115257.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "RGB mechanical keyboard with blue switches",
          brand: "GameMax", condition: "new", rating: 4.4, reviews: 13, type: "product"
        },
        {
          id: "elec-13", name: "Webcam HD", category: "Electronics & Devices",
          price: 95000, currency: "TZS", currencySymbol: "TSh", stock: 14,
          business: "TechHub Tanzania", location: { lat: -6.7924, lng: 39.2083 },
          address: "Samora Avenue, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/51383/photo-camera-subject-photographer-51383.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "HD webcam with built-in microphone for video calls",
          brand: "VideoPro", condition: "new", rating: 4.2, reviews: 7, type: "product"
        },
        {
          id: "elec-14", name: "Power Bank 20000mAh", category: "Electronics & Devices",
          price: 85000, currency: "TZS", currencySymbol: "TSh", stock: 18,
          business: "MobileWorld Tanzania", location: { lat: -6.8184, lng: 39.2883 },
          address: "Mlimani City Mall, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/12791056/pexels-photo-12791056.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "High-capacity power bank for multiple device charges",
          brand: "PowerPlus", condition: "new", rating: 4.5, reviews: 16, type: "product"
        },
        {
          id: "elec-15", name: "USB-C Hub", category: "Electronics & Devices",
          price: 65000, currency: "TZS", currencySymbol: "TSh", stock: 22,
          business: "TechHub Tanzania", location: { lat: -6.7924, lng: 39.2083 },
          address: "Samora Avenue, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/2588757/pexels-photo-2588757.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "7-in-1 USB-C hub with multiple ports",
          brand: "TechGear", condition: "new", rating: 4.3, reviews: 11, type: "product"
        },
        {
          id: "elec-16", name: "Monitor 27-inch", category: "Electronics & Devices",
          price: 650000, currency: "TZS", currencySymbol: "TSh", stock: 6,
          business: "TechHub Tanzania", location: { lat: -6.7924, lng: 39.2083 },
          address: "Samora Avenue, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "27-inch 4K monitor for professional work",
          brand: "ViewMax", condition: "new", rating: 4.7, reviews: 8, type: "product"
        },
        {
          id: "elec-17", name: "Wireless Earbuds", category: "Electronics & Devices",
          price: 120000, currency: "TZS", currencySymbol: "TSh", stock: 16,
          business: "AudioTech Tanzania", location: { lat: -6.8155, lng: 39.2861 },
          address: "Masaki, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/1646704/pexels-photo-1646704.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "True wireless earbuds with charging case",
          brand: "SoundWave", condition: "new", rating: 4.4, reviews: 12, type: "product"
        },
        {
          id: "elec-18", name: "Laptop Backpack", category: "Electronics & Devices",
          price: 75000, currency: "TZS", currencySymbol: "TSh", stock: 20,
          business: "TechHub Tanzania", location: { lat: -6.7924, lng: 39.2083 },
          address: "Samora Avenue, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Water-resistant laptop backpack with multiple compartments",
          brand: "TravelGear", condition: "new", rating: 4.2, reviews: 15, type: "product"
        },
        {
          id: "elec-19", name: "Smartphone Gimbal", category: "Electronics & Devices",
          price: 180000, currency: "TZS", currencySymbol: "TSh", stock: 9,
          business: "Camera World Tanzania", location: { lat: -6.8155, lng: 39.2861 },
          address: "Masaki, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/51383/photo-camera-subject-photographer-51383.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "3-axis smartphone gimbal for stable video recording",
          brand: "VideoPro", condition: "new", rating: 4.6, reviews: 7, type: "product"
        },
        {
          id: "elec-20", name: "Portable Projector", category: "Electronics & Devices",
          price: 450000, currency: "TZS", currencySymbol: "TSh", stock: 5,
          business: "TechHub Tanzania", location: { lat: -6.7924, lng: 39.2083 },
          address: "Samora Avenue, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/1772128/pexels-photo-1772128.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Mini portable projector for home entertainment",
          brand: "ViewMax", condition: "new", rating: 4.3, reviews: 6, type: "product"
        }
      ];

      // BIDHAA 20 ZA FASHION
      const sampleFashion = [
        {
          id: "fash-1", name: "Men's Running Shoes", category: "General Goods",
          price: 85000, currency: "TZS", currencySymbol: "TSh", stock: 15,
          business: "Sports Gear Tanzania", location: { lat: -6.8184, lng: 39.2883 },
          address: "Mlimani City, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Comfortable running shoes designed for maximum performance",
          brand: "RunPro", condition: "new", rating: 4.3, reviews: 15, type: "product"
        },
        {
          id: "fash-2", name: "Designer Handbag", category: "General Goods",
          price: 120000, currency: "TZS", currencySymbol: "TSh", stock: 8,
          business: "Fashion House Dar", location: { lat: -6.8155, lng: 39.2861 },
          address: "Masaki, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Luxury designer handbag made from genuine leather",
          brand: "StyleCraft", condition: "new", rating: 4.7, reviews: 6, type: "product"
        },
        {
          id: "fash-3", name: "Casual T-Shirt Pack", category: "General Goods",
          price: 45000, currency: "TZS", currencySymbol: "TSh", stock: 25,
          business: "Fashion House Dar", location: { lat: -6.8155, lng: 39.2861 },
          address: "Masaki, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/9558699/pexels-photo-9558699.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Pack of 3 comfortable cotton t-shirts in various colors",
          brand: "ComfortWear", condition: "new", rating: 4.2, reviews: 18, type: "product"
        },
        {
          id: "fash-4", name: "Leather Wallet", category: "General Goods",
          price: 35000, currency: "TZS", currencySymbol: "TSh", stock: 12,
          business: "Fashion House Dar", location: { lat: -6.8155, lng: 39.2861 },
          address: "Masaki, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Genuine leather wallet with multiple card slots",
          brand: "LeatherCraft", condition: "new", rating: 4.5, reviews: 7, type: "product"
        },
        {
          id: "fash-5", name: "Women's Dress", category: "General Goods",
          price: 65000, currency: "TZS", currencySymbol: "TSh", stock: 10,
          business: "Fashion House Dar", location: { lat: -6.8155, lng: 39.2861 },
          address: "Masaki, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Elegant women's dress for special occasions",
          brand: "Elegance", condition: "new", rating: 4.6, reviews: 9, type: "product"
        },
        {
          id: "fash-6", name: "Men's Suit", category: "General Goods",
          price: 250000, currency: "TZS", currencySymbol: "TSh", stock: 6,
          business: "Fashion House Dar", location: { lat: -6.8155, lng: 39.2861 },
          address: "Masaki, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Professional men's suit for business occasions",
          brand: "ExecutiveWear", condition: "new", rating: 4.8, reviews: 5, type: "product"
        },
        {
          id: "fash-7", name: "Sneakers Collection", category: "General Goods",
          price: 95000, currency: "TZS", currencySymbol: "TSh", stock: 18,
          business: "Sports Gear Tanzania", location: { lat: -6.8184, lng: 39.2883 },
          address: "Mlimani City, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Trendy sneakers in various colors and styles",
          brand: "UrbanStep", condition: "new", rating: 4.4, reviews: 12, type: "product"
        },
        {
          id: "fash-8", name: "Women's Handbag", category: "General Goods",
          price: 80000, currency: "TZS", currencySymbol: "TSh", stock: 14,
          business: "Fashion House Dar", location: { lat: -6.8155, lng: 39.2861 },
          address: "Masaki, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Stylish women's handbag for everyday use",
          brand: "ChicStyle", condition: "new", rating: 4.3, reviews: 8, type: "product"
        },
        {
          id: "fash-9", name: "Men's Watch", category: "General Goods",
          price: 150000, currency: "TZS", currencySymbol: "TSh", stock: 9,
          business: "Fashion House Dar", location: { lat: -6.8155, lng: 39.2861 },
          address: "Masaki, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Elegant men's wristwatch with leather strap",
          brand: "TimeMaster", condition: "new", rating: 4.7, reviews: 11, type: "product"
        },
        {
          id: "fash-10", name: "Women's Jewelry Set", category: "General Goods",
          price: 120000, currency: "TZS", currencySymbol: "TSh", stock: 7,
          business: "Fashion House Dar", location: { lat: -6.8155, lng: 39.2861 },
          address: "Masaki, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Beautiful jewelry set including necklace and earrings",
          brand: "Sparkle", condition: "new", rating: 4.9, reviews: 6, type: "product"
        },
        {
          id: "fash-11", name: "Kids Clothing Set", category: "General Goods",
          price: 35000, currency: "TZS", currencySymbol: "TSh", stock: 20,
          business: "Fashion House Dar", location: { lat: -6.8155, lng: 39.2861 },
          address: "Masaki, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Colorful clothing set for children",
          brand: "KidsComfort", condition: "new", rating: 4.2, reviews: 14, type: "product"
        },
        {
          id: "fash-12", name: "Men's Casual Shirt", category: "General Goods",
          price: 45000, currency: "TZS", currencySymbol: "TSh", stock: 22,
          business: "Fashion House Dar", location: { lat: -6.8155, lng: 39.2861 },
          address: "Masaki, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/769733/pexels-photo-769733.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Comfortable casual shirt for everyday wear",
          brand: "ComfortWear", condition: "new", rating: 4.3, reviews: 16, type: "product"
        },
        {
          id: "fash-13", name: "Women's Sandals", category: "General Goods",
          price: 55000, currency: "TZS", currencySymbol: "TSh", stock: 17,
          business: "Fashion House Dar", location: { lat: -6.8155, lng: 39.2861 },
          address: "Masaki, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/267320/pexels-photo-267320.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Comfortable women's sandals for summer",
          brand: "SummerStep", condition: "new", rating: 4.4, reviews: 9, type: "product"
        },
        {
          id: "fash-14", name: "Men's Belt", category: "General Goods",
          price: 25000, currency: "TZS", currencySymbol: "TSh", stock: 25,
          business: "Fashion House Dar", location: { lat: -6.8155, lng: 39.2861 },
          address: "Masaki, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Genuine leather belt for men",
          brand: "LeatherCraft", condition: "new", rating: 4.5, reviews: 13, type: "product"
        },
        {
          id: "fash-15", name: "Women's Scarf", category: "General Goods",
          price: 20000, currency: "TZS", currencySymbol: "TSh", stock: 30,
          business: "Fashion House Dar", location: { lat: -6.8155, lng: 39.2861 },
          address: "Masaki, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/54203/pexels-photo-54203.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Silk scarf with beautiful patterns",
          brand: "ChicStyle", condition: "new", rating: 4.6, reviews: 8, type: "product"
        },
        {
          id: "fash-16", name: "Men's Jacket", category: "General Goods",
          price: 120000, currency: "TZS", currencySymbol: "TSh", stock: 11,
          business: "Fashion House Dar", location: { lat: -6.8155, lng: 39.2861 },
          address: "Masaki, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Warm men's jacket for cold weather",
          brand: "WinterWear", condition: "new", rating: 4.4, reviews: 10, type: "product"
        },
        {
          id: "fash-17", name: "Women's Skirt", category: "General Goods",
          price: 40000, currency: "TZS", currencySymbol: "TSh", stock: 19,
          business: "Fashion House Dar", location: { lat: -6.8155, lng: 39.2861 },
          address: "Masaki, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Elegant women's skirt for office wear",
          brand: "OfficeChic", condition: "new", rating: 4.3, reviews: 7, type: "product"
        },
        {
          id: "fash-18", name: "Men's Shorts", category: "General Goods",
          price: 35000, currency: "TZS", currencySymbol: "TSh", stock: 24,
          business: "Fashion House Dar", location: { lat: -6.8155, lng: 39.2861 },
          address: "Masaki, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Comfortable men's shorts for casual wear",
          brand: "ComfortWear", condition: "new", rating: 4.2, reviews: 15, type: "product"
        },
        {
          id: "fash-19", name: "Women's Blouse", category: "General Goods",
          price: 50000, currency: "TZS", currencySymbol: "TSh", stock: 16,
          business: "Fashion House Dar", location: { lat: -6.8155, lng: 39.2861 },
          address: "Masaki, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/769733/pexels-photo-769733.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Elegant women's blouse for professional settings",
          brand: "OfficeChic", condition: "new", rating: 4.5, reviews: 9, type: "product"
        },
        {
          id: "fash-20", name: "Unisex Backpack", category: "General Goods",
          price: 65000, currency: "TZS", currencySymbol: "TSh", stock: 21,
          business: "Fashion House Dar", location: { lat: -6.8155, lng: 39.2861 },
          address: "Masaki, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Stylish backpack for daily use",
          brand: "UrbanGear", condition: "new", rating: 4.4, reviews: 12, type: "product"
        }
      ];

      // BIDHAA 20 ZA HOTELS
      const sampleHotels = [
        {
          id: "hotel-1", name: "Serengeti Luxury Hotel", category: "Building & Hotels",
          serviceType: "5-Star Hotel", priceRange: "150-300", currency: "USD", currencySymbol: "$",
          business: "Serengeti Hospitality Group", location: { lat: -6.8155, lng: 39.2861 },
          address: "Masaki, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "5-star luxury hotel with premium amenities and excellent service",
          rating: "5", type: "service"
        },
        {
          id: "hotel-2", name: "City View Apartments", category: "Building & Hotels",
          serviceType: "Luxury Apartment", priceRange: "80,000-150,000", currency: "TZS", currencySymbol: "TSh",
          business: "Prime Properties Tanzania", location: { lat: -6.8120, lng: 39.2840 },
          address: "City Center, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Modern luxury apartments with business facilities",
          rating: "4", type: "service"
        },
        {
          id: "hotel-3", name: "Beach Resort Zanzibar", category: "Building & Hotels",
          serviceType: "Beach Resort", priceRange: "200-500", currency: "USD", currencySymbol: "$",
          business: "Zanzibar Hospitality Group", location: { lat: -6.1659, lng: 39.2026 },
          address: "Nungwi, Zanzibar", country: "Tanzania", region: "Zanzibar", city: "Zanzibar",
          images: ["https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Luxury beach resort with private beach access and spa",
          rating: "5", type: "service"
        },
        {
          id: "hotel-4", name: "Business Hotel Arusha", category: "Building & Hotels",
          serviceType: "Business Hotel", priceRange: "100-200", currency: "USD", currencySymbol: "$",
          business: "Arusha Hospitality", location: { lat: -3.3869, lng: 36.6820 },
          address: "City Center, Arusha", country: "Tanzania", region: "Arusha", city: "Arusha",
          images: ["https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Comfortable business hotel with conference facilities",
          rating: "4", type: "service"
        },
        {
          id: "hotel-5", name: "Mountain View Lodge", category: "Building & Hotels",
          serviceType: "Mountain Lodge", priceRange: "120-250", currency: "USD", currencySymbol: "$",
          business: "Kilimanjaro Hospitality", location: { lat: -3.0674, lng: 37.3556 },
          address: "Moshi, Kilimanjaro", country: "Tanzania", region: "Kilimanjaro", city: "Moshi",
          images: ["https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Lodge with stunning views of Mount Kilimanjaro",
          rating: "4", type: "service"
        },
        {
          id: "hotel-6", name: "Lakeside Resort", category: "Building & Hotels",
          serviceType: "Lakeside Resort", priceRange: "80-180", currency: "USD", currencySymbol: "$",
          business: "Lake Victoria Resorts", location: { lat: -2.5164, lng: 32.9170 },
          address: "Mwanza, Lake Victoria", country: "Tanzania", region: "Mwanza", city: "Mwanza",
          images: ["https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Beautiful resort on the shores of Lake Victoria",
          rating: "4", type: "service"
        },
        {
          id: "hotel-7", name: "City Center Hotel", category: "Building & Hotels",
          serviceType: "Boutique Hotel", priceRange: "60-120", currency: "USD", currencySymbol: "$",
          business: "City Hospitality Group", location: { lat: -6.8120, lng: 39.2840 },
          address: "City Center, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Boutique hotel in the heart of the city",
          rating: "4", type: "service"
        },
        {
          id: "hotel-8", name: "Beachfront Villa", category: "Building & Hotels",
          serviceType: "Private Villa", priceRange: "300-600", currency: "USD", currencySymbol: "$",
          business: "Luxury Villas Tanzania", location: { lat: -6.8155, lng: 39.2861 },
          address: "Masaki, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Private beachfront villa with pool and staff",
          rating: "5", type: "service"
        },
        {
          id: "hotel-9", name: "Safari Camp", category: "Building & Hotels",
          serviceType: "Safari Lodge", priceRange: "200-400", currency: "USD", currencySymbol: "$",
          business: "Serengeti Safari Camps", location: { lat: -2.3333, lng: 34.8333 },
          address: "Serengeti National Park", country: "Tanzania", region: "Mara", city: "Serengeti",
          images: ["https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Luxury safari camp in the heart of Serengeti",
          rating: "5", type: "service"
        },
        {
          id: "hotel-10", name: "Budget Hostel", category: "Building & Hotels",
          serviceType: "Hostel", priceRange: "20-50", currency: "USD", currencySymbol: "$",
          business: "Backpackers Tanzania", location: { lat: -6.8184, lng: 39.2883 },
          address: "Mlimani City, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Affordable hostel for backpackers and travelers",
          rating: "3", type: "service"
        },
        {
          id: "hotel-11", name: "Executive Suites", category: "Building & Hotels",
          serviceType: "Serviced Apartments", priceRange: "150-300", currency: "USD", currencySymbol: "$",
          business: "Executive Stays Tanzania", location: { lat: -6.8155, lng: 39.2861 },
          address: "Masaki, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Luxury serviced apartments for business travelers",
          rating: "4", type: "service"
        },
        {
          id: "hotel-12", name: "Family Resort", category: "Building & Hotels",
          serviceType: "Family Resort", priceRange: "100-250", currency: "USD", currencySymbol: "$",
          business: "Family Fun Resorts", location: { lat: -6.8184, lng: 39.2883 },
          address: "Mlimani City, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Family-friendly resort with kids activities",
          rating: "4", type: "service"
        },
        {
          id: "hotel-13", name: "Beach Bungalows", category: "Building & Hotels",
          serviceType: "Beach Bungalows", priceRange: "80-150", currency: "USD", currencySymbol: "$",
          business: "Island Paradise Resorts", location: { lat: -6.1659, lng: 39.2026 },
          address: "Zanzibar Beach", country: "Tanzania", region: "Zanzibar", city: "Zanzibar",
          images: ["https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Traditional beach bungalows with ocean views",
          rating: "4", type: "service"
        },
        {
          id: "hotel-14", name: "City Loft", category: "Building & Hotels",
          serviceType: "Modern Loft", priceRange: "120-200", currency: "USD", currencySymbol: "$",
          business: "Urban Living Tanzania", location: { lat: -6.8120, lng: 39.2840 },
          address: "City Center, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Modern loft apartment in the city center",
          rating: "4", type: "service"
        },
        {
          id: "hotel-15", name: "Mountain Retreat", category: "Building & Hotels",
          serviceType: "Mountain Retreat", priceRange: "90-180", currency: "USD", currencySymbol: "$",
          business: "Mountain Escape Resorts", location: { lat: -3.0674, lng: 37.3556 },
          address: "Kilimanjaro Foothills", country: "Tanzania", region: "Kilimanjaro", city: "Moshi",
          images: ["https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Peaceful mountain retreat for nature lovers",
          rating: "4", type: "service"
        },
        {
          id: "hotel-16", name: "Luxury Tent Camp", category: "Building & Hotels",
          serviceType: "Glamping", priceRange: "150-300", currency: "USD", currencySymbol: "$",
          business: "Luxury Camping Tanzania", location: { lat: -2.3333, lng: 34.8333 },
          address: "Serengeti Plains", country: "Tanzania", region: "Mara", city: "Serengeti",
          images: ["https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Luxury tent camping experience in the wild",
          rating: "5", type: "service"
        },
        {
          id: "hotel-17", name: "Business Center Hotel", category: "Building & Hotels",
          serviceType: "Conference Hotel", priceRange: "100-220", currency: "USD", currencySymbol: "$",
          business: "Business Travel Tanzania", location: { lat: -6.8120, lng: 39.2840 },
          address: "CBD, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Hotel with full business and conference facilities",
          rating: "4", type: "service"
        },
        {
          id: "hotel-18", name: "Island Resort", category: "Building & Hotels",
          serviceType: "Private Island Resort", priceRange: "250-500", currency: "USD", currencySymbol: "$",
          business: "Island Luxury Resorts", location: { lat: -6.1659, lng: 39.2026 },
          address: "Private Island, Zanzibar", country: "Tanzania", region: "Zanzibar", city: "Zanzibar",
          images: ["https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Exclusive private island resort experience",
          rating: "5", type: "service"
        },
        {
          id: "hotel-19", name: "Garden Hotel", category: "Building & Hotels",
          serviceType: "Boutique Garden Hotel", priceRange: "70-140", currency: "USD", currencySymbol: "$",
          business: "Garden Retreat Hotels", location: { lat: -6.8155, lng: 39.2861 },
          address: "Masaki, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Charming boutique hotel with beautiful gardens",
          rating: "4", type: "service"
        },
        {
          id: "hotel-20", name: "Lake View Lodge", category: "Building & Hotels",
          serviceType: "Lake View Lodge", priceRange: "60-120", currency: "USD", currencySymbol: "$",
          business: "Lake View Hospitality", location: { lat: -2.5164, lng: 32.9170 },
          address: "Mwanza, Lake Victoria", country: "Tanzania", region: "Mwanza", city: "Mwanza",
          images: ["https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Comfortable lodge with stunning lake views",
          rating: "4", type: "service"
        }
      ];

      // BIDHAA 20 ZA VEHICLES
      const sampleVehicles = [
        {
          id: "vehicle-1", name: "Toyota RAV4 2023", category: "Vehicles",
          price: 45000000, currency: "TZS", currencySymbol: "TSh", stock: 3,
          business: "AutoWorld Tanzania", location: { lat: -6.8184, lng: 39.2883 },
          address: "Mlimani City, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Brand new Toyota RAV4 2023 model with full features",
          brand: "Toyota", condition: "new", rating: 4.8, reviews: 12, type: "product"
        },
        {
          id: "vehicle-2", name: "Honda CR-V 2022", category: "Vehicles",
          price: 38000000, currency: "TZS", currencySymbol: "TSh", stock: 2,
          business: "AutoWorld Tanzania", location: { lat: -6.8184, lng: 39.2883 },
          address: "Mlimani City, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Well-maintained Honda CR-V 2022 with low mileage",
          brand: "Honda", condition: "used", rating: 4.6, reviews: 8, type: "product"
        },
        {
          id: "vehicle-3", name: "BMW X5 2021", category: "Vehicles",
          price: 85000000, currency: "TZS", currencySymbol: "TSh", stock: 1,
          business: "Luxury Motors Tanzania", location: { lat: -6.8155, lng: 39.2861 },
          address: "Masaki, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Luxury BMW X5 with premium features",
          brand: "BMW", condition: "used", rating: 4.9, reviews: 5, type: "product"
        },
        {
          id: "vehicle-4", name: "Toyota Hilux 2023", category: "Vehicles",
          price: 52000000, currency: "TZS", currencySymbol: "TSh", stock: 4,
          business: "AutoWorld Tanzania", location: { lat: -6.8184, lng: 39.2883 },
          address: "Mlimani City, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "New Toyota Hilux double cabin pickup truck",
          brand: "Toyota", condition: "new", rating: 4.7, reviews: 15, type: "product"
        },
        {
          id: "vehicle-5", name: "Mercedes Benz C-Class", category: "Vehicles",
          price: 68000000, currency: "TZS", currencySymbol: "TSh", stock: 2,
          business: "Luxury Motors Tanzania", location: { lat: -6.8155, lng: 39.2861 },
          address: "Masaki, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Elegant Mercedes Benz C-Class sedan",
          brand: "Mercedes", condition: "used", rating: 4.8, reviews: 7, type: "product"
        },
        {
          id: "vehicle-6", name: "Nissan X-Trail 2022", category: "Vehicles",
          price: 42000000, currency: "TZS", currencySymbol: "TSh", stock: 3,
          business: "AutoWorld Tanzania", location: { lat: -6.8184, lng: 39.2883 },
          address: "Mlimani City, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Comfortable Nissan X-Trail SUV",
          brand: "Nissan", condition: "used", rating: 4.5, reviews: 9, type: "product"
        },
        {
          id: "vehicle-7", name: "Toyota Corolla 2023", category: "Vehicles",
          price: 32000000, currency: "TZS", currencySymbol: "TSh", stock: 5,
          business: "AutoWorld Tanzania", location: { lat: -6.8184, lng: 39.2883 },
          address: "Mlimani City, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Fuel-efficient Toyota Corolla sedan",
          brand: "Toyota", condition: "new", rating: 4.6, reviews: 11, type: "product"
        },
        {
          id: "vehicle-8", name: "Land Rover Discovery", category: "Vehicles",
          price: 95000000, currency: "TZS", currencySymbol: "TSh", stock: 1,
          business: "Luxury Motors Tanzania", location: { lat: -6.8155, lng: 39.2861 },
          address: "Masaki, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Premium Land Rover Discovery SUV",
          brand: "Land Rover", condition: "used", rating: 4.9, reviews: 4, type: "product"
        },
        {
          id: "vehicle-9", name: "Mitsubishi Pajero", category: "Vehicles",
          price: 45000000, currency: "TZS", currencySymbol: "TSh", stock: 2,
          business: "AutoWorld Tanzania", location: { lat: -6.8184, lng: 39.2883 },
          address: "Mlimani City, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Reliable Mitsubishi Pajero 4x4",
          brand: "Mitsubishi", condition: "used", rating: 4.4, reviews: 8, type: "product"
        },
        {
          id: "vehicle-10", name: "Hyundai Tucson 2023", category: "Vehicles",
          price: 38000000, currency: "TZS", currencySymbol: "TSh", stock: 3,
          business: "AutoWorld Tanzania", location: { lat: -6.8184, lng: 39.2883 },
          address: "Mlimani City, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Modern Hyundai Tucson with advanced features",
          brand: "Hyundai", condition: "new", rating: 4.5, reviews: 6, type: "product"
        },
        {
          id: "vehicle-11", name: "Toyota Hiace Minibus", category: "Vehicles",
          price: 55000000, currency: "TZS", currencySymbol: "TSh", stock: 2,
          business: "Commercial Vehicles Tanzania", location: { lat: -6.7924, lng: 39.2083 },
          address: "Samora Avenue, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Toyota Hiace minibus for passenger transport",
          brand: "Toyota", condition: "new", rating: 4.3, reviews: 10, type: "product"
        },
        {
          id: "vehicle-12", name: "Ford Ranger 2022", category: "Vehicles",
          price: 48000000, currency: "TZS", currencySymbol: "TSh", stock: 3,
          business: "AutoWorld Tanzania", location: { lat: -6.8184, lng: 39.2883 },
          address: "Mlimani City, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Powerful Ford Ranger pickup truck",
          brand: "Ford", condition: "used", rating: 4.6, reviews: 7, type: "product"
        },
        {
          id: "vehicle-13", name: "Lexus RX 350", category: "Vehicles",
          price: 72000000, currency: "TZS", currencySymbol: "TSh", stock: 1,
          business: "Luxury Motors Tanzania", location: { lat: -6.8155, lng: 39.2861 },
          address: "Masaki, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Luxury Lexus RX 350 SUV",
          brand: "Lexus", condition: "used", rating: 4.9, reviews: 3, type: "product"
        },
        {
          id: "vehicle-14", name: "Suzuki Vitara 2023", category: "Vehicles",
          price: 35000000, currency: "TZS", currencySymbol: "TSh", stock: 4,
          business: "AutoWorld Tanzania", location: { lat: -6.8184, lng: 39.2883 },
          address: "Mlimani City, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Compact Suzuki Vitara SUV",
          brand: "Suzuki", condition: "new", rating: 4.4, reviews: 8, type: "product"
        },
        {
          id: "vehicle-15", name: "Toyota Land Cruiser", category: "Vehicles",
          price: 120000000, currency: "TZS", currencySymbol: "TSh", stock: 1,
          business: "Luxury Motors Tanzania", location: { lat: -6.8155, lng: 39.2861 },
          address: "Masaki, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Premium Toyota Land Cruiser V8",
          brand: "Toyota", condition: "used", rating: 4.9, reviews: 2, type: "product"
        },
        {
          id: "vehicle-16", name: "Honda Civic 2023", category: "Vehicles",
          price: 34000000, currency: "TZS", currencySymbol: "TSh", stock: 3,
          business: "AutoWorld Tanzania", location: { lat: -6.8184, lng: 39.2883 },
          address: "Mlimani City, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Sporty Honda Civic sedan",
          brand: "Honda", condition: "new", rating: 4.7, reviews: 9, type: "product"
        },
        {
          id: "vehicle-17", name: "Isuzu D-Max", category: "Vehicles",
          price: 46000000, currency: "TZS", currencySymbol: "TSh", stock: 2,
          business: "Commercial Vehicles Tanzania", location: { lat: -6.7924, lng: 39.2083 },
          address: "Samora Avenue, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Durable Isuzu D-Max pickup truck",
          brand: "Isuzu", condition: "new", rating: 4.5, reviews: 6, type: "product"
        },
        {
          id: "vehicle-18", name: "BMW 3 Series", category: "Vehicles",
          price: 58000000, currency: "TZS", currencySymbol: "TSh", stock: 1,
          business: "Luxury Motors Tanzania", location: { lat: -6.8155, lng: 39.2861 },
          address: "Masaki, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Sporty BMW 3 Series sedan",
          brand: "BMW", condition: "used", rating: 4.8, reviews: 4, type: "product"
        },
        {
          id: "vehicle-19", name: "Toyota Premio 2022", category: "Vehicles",
          price: 36000000, currency: "TZS", currencySymbol: "TSh", stock: 4,
          business: "AutoWorld Tanzania", location: { lat: -6.8184, lng: 39.2883 },
          address: "Mlimani City, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Comfortable Toyota Premio sedan",
          brand: "Toyota", condition: "used", rating: 4.6, reviews: 7, type: "product"
        },
        {
          id: "vehicle-20", name: "Mercedes Sprinter", category: "Vehicles",
          price: 65000000, currency: "TZS", currencySymbol: "TSh", stock: 2,
          business: "Commercial Vehicles Tanzania", location: { lat: -6.7924, lng: 39.2083 },
          address: "Samora Avenue, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Mercedes Sprinter passenger van",
          brand: "Mercedes", condition: "new", rating: 4.7, reviews: 5, type: "product"
        }
      ];

      const sampleItems = [
        ...sampleElectronics,
        ...sampleFashion,
        ...sampleHotels,
        ...sampleVehicles
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
      "shoes", "shoe", "sneakers", "footwear",
      "car", "cars", "vehicle", "vehicles", "toyota", "honda"
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
      case 'Vehicles': return 'fa-car';
      default: return 'fa-box';
    }
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case 'Electronics & Devices': return 'primary';
      case 'General Goods': return 'warning';
      case 'Building & Hotels': return 'success';
      case 'Vehicles': return 'danger';
      default: return 'secondary';
    }
  };

  const getCategoryBadge = (category) => {
    switch(category) {
      case 'Electronics & Devices': return 'bg-primary';
      case 'General Goods': return 'bg-warning';
      case 'Building & Hotels': return 'bg-success';
      case 'Vehicles': return 'bg-danger';
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

  // BEAUTIFUL SIDEBAR COMPONENT WITH WHITE BACKGROUND - SIZE IMEPUNGULIWA
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

        {/* Sidebar - NOW WITH SMALLER SIZE */}
        <div 
          className={`sidebar-menu ${showSidebar ? 'active' : ''}`}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            bottom: 0,
            width: '280px', // IMEPUNGULIWA KUTOKA 320px
            background: '#ffffff',
            zIndex: 1100,
            transform: showSidebar ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 0.3s ease',
            boxShadow: '2px 0 20px rgba(0,0,0,0.1)',
            overflowY: 'auto'
          }}
        >
          {/* Sidebar Header - SIZE IMEPUNGULIWA */}
          <div className="sidebar-header" style={{
            padding: '15px', // IMEPUNGULIWA KUTOKA 20px
            background: '#f8f9fa',
            borderBottom: '1px solid #e9ecef'
          }}>
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <i className="fas fa-bars text-primary me-2 fs-6"></i> {/* SIZE IMEPUNGULIWA */}
                <h6 className="text-dark mb-0 fw-bold" style={{ fontSize: '0.95rem' }}>Browse Categories</h6> {/* SIZE IMEPUNGULIWA */}
              </div>
              <button 
                className="btn btn-close"
                onClick={toggleSidebar}
                style={{ fontSize: '0.8rem' }} // SIZE IMEPUNGULIWA
              ></button>
            </div>
          </div>

          {/* Sidebar Content - SIZE IMEPUNGULIWA */}
          <div className="sidebar-content" style={{ padding: '15px' }}> {/* IMEPUNGULIWA KUTOKA 20px */}
            {/* Welcome Section - SIZE IMEPUNGULIWA */}
            <div className="welcome-section mb-3"> {/* IMEPUNGULIWA KUTOKA mb-4 */}
              <div className="text-center text-dark mb-2"> {/* IMEPUNGULIWA KUTOKA mb-3 */}
                <i className="fas fa-shopping-bag fa-lg mb-2 text-primary"></i> {/* SIZE IMEPUNGULIWA */}
                <h6 className="fw-bold" style={{ fontSize: '0.9rem' }}>Find What You Need</h6> {/* SIZE IMEPUNGULIWA */}
                <small className="text-muted" style={{ fontSize: '0.75rem' }}>Browse through our categories</small> {/* SIZE IMEPUNGULIWA */}
              </div>
            </div>

            {/* Home Link Button - SIZE IMEPUNGULIWA */}
            <div className="home-link-section mb-3"> {/* IMEPUNGULIWA KUTOKA mb-4 */}
              <Link 
                to="/" 
                className="btn btn-primary w-100 d-flex align-items-center justify-content-center py-2" 
                style={{
                  borderRadius: '10px', // IMEPUNGULIWA KUTOKA 12px
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: '0.85rem', // SIZE IMEPUNGULIWA
                  border: 'none'
                }}
                onClick={() => setShowSidebar(false)}
              >
                <i className="fas fa-home me-2 fs-6"></i> {/* SIZE IMEPUNGULIWA */}
                Home Page
              </Link>
            </div>

            {/* Categories List - SIZE IMEPUNGULIWA */}
            <div className="categories-list">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`category-item w-100 text-start mb-2 ${activeCategory === category.id ? 'active' : ''}`}
                  onClick={() => handleCategorySelect(category.id)}
                  style={{
                    background: activeCategory === category.id ? 'rgba(0, 123, 255, 0.1)' : '#ffffff',
                    border: activeCategory === category.id ? '2px solid #007bff' : '1px solid #e9ecef',
                    borderRadius: '10px', // IMEPUNGULIWA KUTOKA 12px
                    padding: '12px', // IMEPUNGULIWA KUTOKA 15px
                    color: activeCategory === category.id ? '#007bff' : '#495057',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                >
                  <div className="d-flex align-items-center">
                    <div className="category-icon me-2" style={{ // IMEPUNGULIWA KUTOKA me-3
                      width: '32px', // IMEPUNGULIWA KUTOKA 40px
                      height: '32px', // IMEPUNGULIWA KUTOKA 40px
                      background: activeCategory === category.id ? '#007bff' : 'rgba(0, 123, 255, 0.1)',
                      borderRadius: '8px', // IMEPUNGULIWA KUTOKA 10px
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.9rem', // SIZE IMEPUNGULIWA
                      color: activeCategory === category.id ? '#ffffff' : '#007bff'
                    }}>
                      <i className={`fas ${category.icon}`}></i>
                    </div>
                    <div className="flex-grow-1">
                      <div className="fw-semibold" style={{ fontSize: '0.8rem' }}>{category.name}</div> {/* SIZE IMEPUNGULIWA */}
                      <small className={activeCategory === category.id ? "text-primary" : "text-muted"} style={{ fontSize: '0.7rem' }}>{category.description}</small> {/* SIZE IMEPUNGULIWA */}
                    </div>
                    {activeCategory === category.id && (
                      <i className="fas fa-check text-success ms-1" style={{ fontSize: '0.8rem' }}></i> 
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Help & Support Section - SIZE IMEPUNGULIWA */}
            <div className="help-section mt-3 pt-3 border-top border-secondary border-opacity-25"> {/* SIZE IMEPUNGULIWA */}
              <h6 className="text-dark fw-semibold mb-2" style={{ fontSize: '0.85rem' }}>Help & Support</h6> {/* SIZE IMEPUNGULIWA */}
              
              <button 
                className="btn btn-outline-info w-100 mb-2 d-flex align-items-center justify-content-center" 
                onClick={handleHelpClick}
                style={{
                  borderRadius: '8px', // IMEPUNGULIWA KUTOKA 10px
                  padding: '10px', // IMEPUNGULIWA KUTOKA 12px
                  border: '2px solid #17a2b8',
                  color: '#17a2b8',
                  fontWeight: '600',
                  fontSize: '0.8rem' // SIZE IMEPUNGULIWA
                }}
              >
                <i className="fas fa-question-circle me-2 fs-6"></i> {/* SIZE IMEPUNGULIWA */}
                Help Center
              </button>
            </div>

            {/* Language Selector - SIZE IMEPUNGULIWA */}
            <div className="language-section mt-3 pt-3 border-top border-secondary border-opacity-25"> {/* SIZE IMEPUNGULIWA */}
              <h6 className="text-dark fw-semibold mb-2" style={{ fontSize: '0.85rem' }}>Language</h6> {/* SIZE IMEPUNGULIWA */}
              
              <div className="position-relative">
                <button 
                  className="btn btn-outline-success w-100 d-flex align-items-center justify-content-between"
                  onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                  style={{
                    borderRadius: '8px', // IMEPUNGULIWA KUTOKA 10px
                    padding: '10px', // IMEPUNGULIWA KUTOKA 12px
                    border: '2px solid #28a745',
                    color: '#28a745',
                    fontWeight: '600',
                    fontSize: '0.8rem' // SIZE IMEPUNGULIWA
                  }}
                >
                  <div className="d-flex align-items-center">
                    <i className="fas fa-globe me-2 fs-6"></i> {/* SIZE IMEPUNGULIWA */}
                    <span>{selectedLanguage}</span>
                  </div>
                  <i className={`fas fa-chevron-${showLanguageDropdown ? 'up' : 'down'}`} style={{ fontSize: '0.7rem' }}></i> {/* SIZE IMEPUNGULIWA */}
                </button>

                {/* Language Dropdown - SIZE IMEPUNGULIWA */}
                {showLanguageDropdown && (
                  <div className="position-absolute top-100 start-0 end-0 mt-1 z-3">
                    <div className="bg-white border rounded-2 shadow-lg" style={{ maxHeight: '180px', overflowY: 'auto' }}> {/* SIZE IMEPUNGULIWA */}
                      {languages.map((language) => (
                        <button
                          key={language.code}
                          className={`btn btn-light w-100 text-start p-2 border-bottom ${ /* IMEPUNGULIWA KUTOKA p-3 */
                            selectedLanguage === language.name ? 'bg-primary text-white' : ''
                          }`}
                          onClick={() => handleLanguageSelect(language)}
                          style={{ 
                            border: 'none',
                            borderRadius: '0',
                            fontSize: '0.8rem' // SIZE IMEPUNGULIWA
                          }}
                        >
                          <div className="d-flex align-items-center">
                            <span className="me-2 fs-6">{language.flag}</span> {/* SIZE IMEPUNGULIWA */}
                            <div>
                              <div className="fw-semibold">{language.name}</div>
                            </div>
                            {selectedLanguage === language.name && (
                              <i className="fas fa-check ms-auto" style={{ fontSize: '0.7rem' }}></i> 
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions - SIZE IMEPUNGULIWA */}
            <div className="quick-actions mt-3 pt-3 border-top border-secondary border-opacity-25"> {/* SIZE IMEPUNGULIWA */}
              <h6 className="text-dark fw-semibold mb-2" style={{ fontSize: '0.85rem' }}>Quick Actions</h6> {/* SIZE IMEPUNGULIWA */}
              
              <button 
                className="btn btn-outline-primary w-100 mb-2 d-flex align-items-center justify-content-center"
                onClick={handleFilterClick}
                style={{
                  borderRadius: '8px', // IMEPUNGULIWA KUTOKA 10px
                  padding: '10px', // IMEPUNGULIWA KUTOKA 12px
                  border: '2px solid #007bff',
                  color: '#007bff',
                  fontWeight: '600',
                  fontSize: '0.8rem' // SIZE IMEPUNGULIWA
                }}
              >
                <i className="fas fa-filter me-2" style={{ fontSize: '0.7rem' }}></i> {/* SIZE IMEPUNGULIWA */}
                Advanced Filters
                {getActiveFiltersCount() > 0 && (
                  <span className="badge bg-primary text-white ms-2" style={{ fontSize: '0.6rem' }}> {/* SIZE IMEPUNGULIWA */}
                    {getActiveFiltersCount()}
                  </span>
                )}
              </button>

              <button 
                className="btn btn-primary w-100 d-flex align-items-center justify-content-center"
                onClick={clearSearch}
                style={{
                  borderRadius: '8px', // IMEPUNGULIWA KUTOKA 10px
                  padding: '10px', // IMEPUNGULIWA KUTOKA 12px
                  fontWeight: '600',
                  background: '#007bff',
                  border: 'none',
                  fontSize: '0.8rem' // SIZE IMEPUNGULIWA
                }}
              >
                <i className="fas fa-eraser me-2" style={{ fontSize: '0.7rem' }}></i> {/* SIZE IMEPUNGULIWA */}
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
      {/* Fixed Top Header */}
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

      {/* Main Content - MARGIN TOP IMEONGEXWA */}
      <div className="container-fluid bg-white" style={{ paddingTop: '160px', paddingBottom: '20px' }}> {/* IMEBADILISHWA KUTOKA 140px */}
        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary mb-3"></div>
            <p className="text-muted">Loading products...</p>
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
              // HORIZONTAL SCROLL CONTAINER FOR MOBILE
              <div className="col-12">
                <div className="horizontal-scroll-container">
                  <div className="horizontal-scroll-content">
                    {searchResults.map((item) => (
                      <div key={item.id} className="horizontal-scroll-item">
                        {/* Product Card */}
                        <div className="card h-100 border-0 shadow-sm product-card" style={{ borderRadius: '12px', overflow: 'hidden', minWidth: '160px' }}>
                          
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
                            
                            {/* Stock Status - IMEBAAKIWA PEKEE */}
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
                                className="btn btn-success rounded-pill py-1 px-2"
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
                    ))}
                  </div>
                </div>
              </div>
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
                      <option value="Vehicles">Vehicles</option>
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
        
        /* Horizontal Scroll Styles for Mobile */
        .horizontal-scroll-container {
          width: 100%;
          overflow-x: auto;
          overflow-y: hidden;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          -ms-overflow-style: none;
          padding-bottom: 10px;
        }
        
        .horizontal-scroll-container::-webkit-scrollbar {
          display: none;
        }
        
        .horizontal-scroll-content {
          display: flex;
          gap: 12px;
          padding: 0 8px;
          min-width: min-content;
        }
        
        .horizontal-scroll-item {
          flex: 0 0 auto;
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
          
          /* Horizontal scroll specific for mobile */
          .horizontal-scroll-container {
            margin-left: -8px;
            margin-right: -8px;
            width: calc(100% + 16px);
          }
          
          .horizontal-scroll-content {
            padding: 0 12px;
          }
          
          .horizontal-scroll-item {
            width: 160px;
          }
        }

        /* Desktop Optimizations */
        @media (min-width: 992px) {
          .col-lg-2 {
            flex: 0 0 auto;
            width: 16.66666667%;
          }
          
          /* Hide horizontal scroll on desktop */
          .horizontal-scroll-container {
            overflow-x: visible;
          }
          
          .horizontal-scroll-content {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
            gap: 12px;
            padding: 0;
          }
          
          .horizontal-scroll-item {
            width: auto;
          }
        }
      `}</style>
    </div>
  );
}

export default ProductSearch;