// src/ProductSearch.jsx - ILIYOREKEBISHWA: BIDHAA 200 ZIMEONGEWA
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

      // BIDHAA 200 ZIMEONGEWA - ELECTRONICS, FASHION, HOTELS, VEHICLES
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
        },
        {
          id: "elec-3", name: "Samsung Galaxy S24", category: "Electronics & Devices", price: 1800000, currency: "TZS", currencySymbol: "TSh", stock: 8,
          business: "MobileTech Kenya", location: { lat: -1.2921, lng: 36.8219 }, address: "Westlands, Nairobi", country: "Kenya", region: "Nairobi", city: "Nairobi",
          images: ["https://images.pexels.com/photos/47261/pexels-photo-47261.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Advanced smartphone with AI features", brand: "Samsung", condition: "new", rating: 4.6, reviews: 12, type: "product"
        },
        {
          id: "elec-4", name: "MacBook Air M3", category: "Electronics & Devices", price: 3200000, currency: "TZS", currencySymbol: "TSh", stock: 4,
          business: "Apple Store Dar", location: { lat: -6.8155, lng: 39.2861 }, address: "Masaki, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/812264/pexels-photo-812264.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Ultra-thin laptop with M3 chip", brand: "Apple", condition: "new", rating: 4.9, reviews: 18, type: "product"
        },
        {
          id: "elec-5", name: "Sony 4K Smart TV", category: "Electronics & Devices", price: 1500000, currency: "TZS", currencySymbol: "TSh", stock: 6,
          business: "ElectroWorld Uganda", location: { lat: 0.3476, lng: 32.5825 }, address: "Kampala Road, Kampala", country: "Uganda", region: "Kampala", city: "Kampala",
          images: ["https://images.pexels.com/photos/5721908/pexels-photo-5721908.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "55-inch 4K Ultra HD Smart TV", brand: "Sony", condition: "new", rating: 4.4, reviews: 9, type: "product"
        },
        {
          id: "elec-6", name: "Canon EOS R5", category: "Electronics & Devices", price: 4500000, currency: "TZS", currencySymbol: "TSh", stock: 2,
          business: "Camera Pro Tanzania", location: { lat: -6.8184, lng: 39.2883 }, address: "Mlimani City, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Professional mirrorless camera", brand: "Canon", condition: "new", rating: 4.7, reviews: 7, type: "product"
        },
        {
          id: "elec-7", name: "Bose QuietComfort 45", category: "Electronics & Devices", price: 450000, currency: "TZS", currencySymbol: "TSh", stock: 15,
          business: "Audio Masters Kenya", location: { lat: -1.2921, lng: 36.8219 }, address: "CBD, Nairobi", country: "Kenya", region: "Nairobi", city: "Nairobi",
          images: ["https://images.pexels.com/photos/3394661/pexels-photo-3394661.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Noise cancelling headphones", brand: "Bose", condition: "new", rating: 4.5, reviews: 14, type: "product"
        },
        {
          id: "elec-8", name: "iPad Pro 12.9", category: "Electronics & Devices", price: 1800000, currency: "TZS", currencySymbol: "TSh", stock: 7,
          business: "TechZone Uganda", location: { lat: 0.3476, lng: 32.5825 }, address: "Garden City, Kampala", country: "Uganda", region: "Kampala", city: "Kampala",
          images: ["https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "12.9-inch iPad with M2 chip", brand: "Apple", condition: "new", rating: 4.8, reviews: 11, type: "product"
        },
        {
          id: "elec-9", name: "Dyson V15 Vacuum", category: "Electronics & Devices", price: 850000, currency: "TZS", currencySymbol: "TSh", stock: 9,
          business: "HomeTech Tanzania", location: { lat: -6.7924, lng: 39.2083 }, address: "Posta, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/4107274/pexels-photo-4107274.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Cordless vacuum cleaner", brand: "Dyson", condition: "new", rating: 4.3, reviews: 6, type: "product"
        },
        {
          id: "elec-10", name: "PlayStation 5", category: "Electronics & Devices", price: 1200000, currency: "TZS", currencySymbol: "TSh", stock: 3,
          business: "GameWorld Kenya", location: { lat: -1.2921, lng: 36.8219 }, address: "Yaya Center, Nairobi", country: "Kenya", region: "Nairobi", city: "Nairobi",
          images: ["https://images.pexels.com/photos/4522995/pexels-photo-4522995.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Next-gen gaming console", brand: "Sony", condition: "new", rating: 4.9, reviews: 22, type: "product"
        },
        {
          id: "elec-11", name: "Apple Watch Series 9", category: "Electronics & Devices", price: 650000, currency: "TZS", currencySymbol: "TSh", stock: 12,
          business: "Watch Gallery Dar", location: { lat: -6.8155, lng: 39.2861 }, address: "Slipway, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Advanced smartwatch with health features", brand: "Apple", condition: "new", rating: 4.6, reviews: 16, type: "product"
        },
        {
          id: "elec-12", name: "Samsung Galaxy Tab S9", category: "Electronics & Devices", price: 950000, currency: "TZS", currencySymbol: "TSh", stock: 8,
          business: "Tablet World Uganda", location: { lat: 0.3476, lng: 32.5825 }, address: "Acacia Mall, Kampala", country: "Uganda", region: "Kampala", city: "Kampala",
          images: ["https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Premium Android tablet", brand: "Samsung", condition: "new", rating: 4.4, reviews: 8, type: "product"
        },
        {
          id: "elec-13", name: "LG OLED TV 65", category: "Electronics & Devices", price: 2800000, currency: "TZS", currencySymbol: "TSh", stock: 4,
          business: "Home Entertainment Kenya", location: { lat: -1.2921, lng: 36.8219 }, address: "Thika Road Mall, Nairobi", country: "Kenya", region: "Nairobi", city: "Nairobi",
          images: ["https://images.pexels.com/photos/5721908/pexels-photo-5721908.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "65-inch OLED 4K TV", brand: "LG", condition: "new", rating: 4.7, reviews: 13, type: "product"
        },
        {
          id: "elec-14", name: "GoPro Hero 12", category: "Electronics & Devices", price: 550000, currency: "TZS", currencySymbol: "TSh", stock: 11,
          business: "Action Cam Tanzania", location: { lat: -6.8184, lng: 39.2883 }, address: "Mlimani City, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Action camera for adventures", brand: "GoPro", condition: "new", rating: 4.5, reviews: 9, type: "product"
        },
        {
          id: "elec-15", name: "Microsoft Surface Pro 9", category: "Electronics & Devices", price: 2200000, currency: "TZS", currencySymbol: "TSh", stock: 5,
          business: "Windows Center Uganda", location: { lat: 0.3476, lng: 32.5825 }, address: "Lugogo, Kampala", country: "Uganda", region: "Kampala", city: "Kampala",
          images: ["https://images.pexels.com/photos/812264/pexels-photo-812264.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "2-in-1 laptop and tablet", brand: "Microsoft", condition: "new", rating: 4.6, reviews: 10, type: "product"
        },
        {
          id: "elec-16", name: "DJI Mavic 3 Drone", category: "Electronics & Devices", price: 3500000, currency: "TZS", currencySymbol: "TSh", stock: 2,
          business: "Drone Tech Kenya", location: { lat: -1.2921, lng: 36.8219 }, address: "Karen, Nairobi", country: "Kenya", region: "Nairobi", city: "Nairobi",
          images: ["https://images.pexels.com/photos/210574/pexels-photo-210574.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Professional aerial photography drone", brand: "DJI", condition: "new", rating: 4.8, reviews: 5, type: "product"
        },
        {
          id: "elec-17", name: "Nintendo Switch OLED", category: "Electronics & Devices", price: 750000, currency: "TZS", currencySymbol: "TSh", stock: 8,
          business: "GameHub Tanzania", location: { lat: -6.7924, lng: 39.2083 }, address: "Kariakoo, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/4522995/pexels-photo-4522995.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Gaming console with OLED screen", brand: "Nintendo", condition: "new", rating: 4.7, reviews: 14, type: "product"
        },
        {
          id: "elec-18", name: "JBL Flip 6 Speaker", category: "Electronics & Devices", price: 280000, currency: "TZS", currencySymbol: "TSh", stock: 20,
          business: "Sound Masters Uganda", location: { lat: 0.3476, lng: 32.5825 }, address: "Naalya, Kampala", country: "Uganda", region: "Kampala", city: "Kampala",
          images: ["https://images.pexels.com/photos/3394661/pexels-photo-3394661.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Portable Bluetooth speaker", brand: "JBL", condition: "new", rating: 4.4, reviews: 11, type: "product"
        },
        {
          id: "elec-19", name: "Razer Blade 15", category: "Electronics & Devices", price: 3800000, currency: "TZS", currencySymbol: "TSh", stock: 3,
          business: "Gaming Pro Kenya", location: { lat: -1.2921, lng: 36.8219 }, address: "Westgate, Nairobi", country: "Kenya", region: "Nairobi", city: "Nairobi",
          images: ["https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=300"], description: "Gaming laptop with RTX graphics", brand: "Razer", condition: "new", rating: 4.9, reviews: 7, type: "product"
        },
        {
          id: "elec-20", name: "Fitbit Charge 6", category: "Electronics & Devices", price: 320000, currency: "TZS", currencySymbol: "TSh", stock: 15,
          business: "Fitness Tech Tanzania", location: { lat: -6.8155, lng: 39.2861 }, address: "Oysterbay, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Advanced fitness tracker", brand: "Fitbit", condition: "new", rating: 4.3, reviews: 12, type: "product"
        },
        {
          id: "elec-21", name: "Xbox Series X", category: "Electronics & Devices", price: 1300000, currency: "TZS", currencySymbol: "TSh", stock: 4,
          business: "GameWorld Kenya", location: { lat: -1.2921, lng: 36.8219 }, address: "Two Rivers, Nairobi", country: "Kenya", region: "Nairobi", city: "Nairobi",
          images: ["https://images.pexels.com/photos/4522995/pexels-photo-4522995.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Next-gen gaming console", brand: "Microsoft", condition: "new", rating: 4.8, reviews: 16, type: "product"
        },
        {
          id: "elec-22", name: "Canon Pixma Printer", category: "Electronics & Devices", price: 350000, currency: "TZS", currencySymbol: "TSh", stock: 10,
          business: "Office Solutions Uganda", location: { lat: 0.3476, lng: 32.5825 }, address: "Ntinda, Kampala", country: "Uganda", region: "Kampala", city: "Kampala",
          images: ["https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "All-in-one photo printer", brand: "Canon", condition: "new", rating: 4.2, reviews: 8, type: "product"
        },
        {
          id: "elec-23", name: "Amazon Echo Dot", category: "Electronics & Devices", price: 150000, currency: "TZS", currencySymbol: "TSh", stock: 25,
          business: "Smart Home Tanzania", location: { lat: -6.8184, lng: 39.2883 }, address: "Mlimani City, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/3394661/pexels-photo-3394661.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Smart speaker with Alexa", brand: "Amazon", condition: "new", rating: 4.1, reviews: 13, type: "product"
        },
        {
          id: "elec-24", name: "Samsung Galaxy Watch", category: "Electronics & Devices", price: 480000, currency: "TZS", currencySymbol: "TSh", stock: 14,
          business: "Watch Pro Kenya", location: { lat: -1.2921, lng: 36.8219 }, address: "Galleria Mall, Nairobi", country: "Kenya", region: "Nairobi", city: "Nairobi",
          images: ["https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Smartwatch with health monitoring", brand: "Samsung", condition: "new", rating: 4.5, reviews: 9, type: "product"
        },
        {
          id: "elec-25", name: "HP LaserJet Printer", category: "Electronics & Devices", price: 420000, currency: "TZS", currencySymbol: "TSh", stock: 8,
          business: "Office Tech Uganda", location: { lat: 0.3476, lng: 32.5825 }, address: "Industrial Area, Kampala", country: "Uganda", region: "Kampala", city: "Kampala",
          images: ["https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Monochrome laser printer", brand: "HP", condition: "new", rating: 4.3, reviews: 6, type: "product"
        },
        {
          id: "elec-26", name: "Google Pixel 8 Pro", category: "Electronics & Devices", price: 1600000, currency: "TZS", currencySymbol: "TSh", stock: 6,
          business: "MobileTech Kenya", location: { lat: -1.2921, lng: 36.8219 }, address: "Sarit Centre, Nairobi", country: "Kenya", region: "Nairobi", city: "Nairobi",
          images: ["https://images.pexels.com/photos/47261/pexels-photo-47261.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "AI-powered smartphone", brand: "Google", condition: "new", rating: 4.6, reviews: 10, type: "product"
        },
        {
          id: "elec-27", name: "Lenovo ThinkPad X1", category: "Electronics & Devices", price: 2800000, currency: "TZS", currencySymbol: "TSh", stock: 4,
          business: "Business Laptops Tanzania", location: { lat: -6.7924, lng: 39.2083 }, address: "City Centre, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=300"], description: "Business ultrabook", brand: "Lenovo", condition: "new", rating: 4.7, reviews: 8, type: "product"
        },
        {
          id: "elec-28", name: "Beats Studio Pro", category: "Electronics & Devices", price: 520000, currency: "TZS", currencySymbol: "TSh", stock: 12,
          business: "Audio World Uganda", location: { lat: 0.3476, lng: 32.5825 }, address: "Victoria Mall, Kampala", country: "Uganda", region: "Kampala", city: "Kampala",
          images: ["https://images.pexels.com/photos/3394661/pexels-photo-3394661.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Wireless noise cancelling headphones", brand: "Beats", condition: "new", rating: 4.4, reviews: 11, type: "product"
        },
        {
          id: "elec-29", name: "ASUS ROG Gaming Laptop", category: "Electronics & Devices", price: 3200000, currency: "TZS", currencySymbol: "TSh", stock: 3,
          business: "Gaming Zone Kenya", location: { lat: -1.2921, lng: 36.8219 }, address: "Junction Mall, Nairobi", country: "Kenya", region: "Nairobi", city: "Nairobi",
          images: ["https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=300"], description: "High-performance gaming laptop", brand: "ASUS", condition: "new", rating: 4.8, reviews: 7, type: "product"
        },
        {
          id: "elec-30", name: "Kindle Paperwhite", category: "Electronics & Devices", price: 280000, currency: "TZS", currencySymbol: "TSh", stock: 18,
          business: "Book Tech Tanzania", location: { lat: -6.8155, lng: 39.2861 }, address: "Masaki, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Waterproof e-reader", brand: "Amazon", condition: "new", rating: 4.5, reviews: 14, type: "product"
        },
        {
          id: "elec-31", name: "Logitech MX Master 3", category: "Electronics & Devices", price: 180000, currency: "TZS", currencySymbol: "TSh", stock: 22,
          business: "Computer Accessories Uganda", location: { lat: 0.3476, lng: 32.5825 }, address: "Kisementi, Kampala", country: "Uganda", region: "Kampala", city: "Kampala",
          images: ["https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Advanced wireless mouse", brand: "Logitech", condition: "new", rating: 4.6, reviews: 9, type: "product"
        },
        {
          id: "elec-32", name: "Nikon Z6 II", category: "Electronics & Devices", price: 3800000, currency: "TZS", currencySymbol: "TSh", stock: 2,
          business: "Camera Pro Kenya", location: { lat: -1.2921, lng: 36.8219 }, address: "ABC Place, Nairobi", country: "Kenya", region: "Nairobi", city: "Nairobi",
          images: ["https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Mirrorless camera professional", brand: "Nikon", condition: "new", rating: 4.7, reviews: 6, type: "product"
        },
        {
          id: "elec-33", name: "Apple AirPods Pro", category: "Electronics & Devices", price: 450000, currency: "TZS", currencySymbol: "TSh", stock: 16,
          business: "Audio Store Tanzania", location: { lat: -6.8184, lng: 39.2883 }, address: "Mlimani City, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/3394661/pexels-photo-3394661.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Wireless earbuds with ANC", brand: "Apple", condition: "new", rating: 4.8, reviews: 17, type: "product"
        },
        {
          id: "elec-34", name: "Samsung Soundbar", category: "Electronics & Devices", price: 650000, currency: "TZS", currencySymbol: "TSh", stock: 9,
          business: "Home Audio Uganda", location: { lat: 0.3476, lng: 32.5825 }, address: "Forest Mall, Kampala", country: "Uganda", region: "Kampala", city: "Kampala",
          images: ["https://images.pexels.com/photos/3394661/pexels-photo-3394661.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Dolby Atmos soundbar", brand: "Samsung", condition: "new", rating: 4.4, reviews: 8, type: "product"
        },
        {
          id: "elec-35", name: "Dell Ultrasharp Monitor", category: "Electronics & Devices", price: 850000, currency: "TZS", currencySymbol: "TSh", stock: 7,
          business: "Monitor Pro Kenya", location: { lat: -1.2921, lng: 36.8219 }, address: "Lavington, Nairobi", country: "Kenya", region: "Nairobi", city: "Nairobi",
          images: ["https://images.pexels.com/photos/1229861/pexels-photo-1229861.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "27-inch 4K monitor", brand: "Dell", condition: "new", rating: 4.6, reviews: 10, type: "product"
        },
        {
          id: "elec-36", name: "Garmin Fenix 7", category: "Electronics & Devices", price: 750000, currency: "TZS", currencySymbol: "TSh", stock: 5,
          business: "Outdoor Tech Tanzania", location: { lat: -6.8155, lng: 39.2861 }, address: "Oysterbay, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Multisport GPS watch", brand: "Garmin", condition: "new", rating: 4.7, reviews: 8, type: "product"
        },
        {
          id: "elec-37", name: "HP Spectre x360", category: "Electronics & Devices", price: 2900000, currency: "TZS", currencySymbol: "TSh", stock: 4,
          business: "Laptop World Uganda", location: { lat: 0.3476, lng: 32.5825 }, address: "Acacia Mall, Kampala", country: "Uganda", region: "Kampala", city: "Kampala",
          images: ["https://images.pexels.com/photos/812264/pexels-photo-812264.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Convertible laptop", brand: "HP", condition: "new", rating: 4.5, reviews: 9, type: "product"
        },
        {
          id: "elec-38", name: "Sony WH-1000XM5", category: "Electronics & Devices", price: 580000, currency: "TZS", currencySymbol: "TSh", stock: 11,
          business: "Headphone Hub Kenya", location: { lat: -1.2921, lng: 36.8219 }, address: "The Hub, Nairobi", country: "Kenya", region: "Nairobi", city: "Nairobi",
          images: ["https://images.pexels.com/photos/3394661/pexels-photo-3394661.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Noise cancelling headphones", brand: "Sony", condition: "new", rating: 4.8, reviews: 15, type: "product"
        },
        {
          id: "elec-39", name: "Microsoft Surface Laptop", category: "Electronics & Devices", price: 2600000, currency: "TZS", currencySymbol: "TSh", stock: 6,
          business: "Windows Store Tanzania", location: { lat: -6.7924, lng: 39.2083 }, address: "Samora Avenue, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=300"], description: "Premium Windows laptop", brand: "Microsoft", condition: "new", rating: 4.6, reviews: 11, type: "product"
        },
        {
          id: "elec-40", name: "Anker PowerCore", category: "Electronics & Devices", price: 120000, currency: "TZS", currencySymbol: "TSh", stock: 30,
          business: "Power Solutions Uganda", location: { lat: 0.3476, lng: 32.5825 }, address: "Nakawa, Kampala", country: "Uganda", region: "Kampala", city: "Kampala",
          images: ["https://images.pexels.com/photos/1275929/pexels-photo-1275929.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Portable power bank", brand: "Anker", condition: "new", rating: 4.3, reviews: 12, type: "product"
        },
        {
          id: "elec-41", name: "Roku Ultra", category: "Electronics & Devices", price: 220000, currency: "TZS", currencySymbol: "TSh", stock: 15,
          business: "Streaming Tech Kenya", location: { lat: -1.2921, lng: 36.8219 }, address: "Kilimani, Nairobi", country: "Kenya", region: "Nairobi", city: "Nairobi",
          images: ["https://images.pexels.com/photos/5721908/pexels-photo-5721908.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "4K streaming player", brand: "Roku", condition: "new", rating: 4.4, reviews: 7, type: "product"
        },
        {
          id: "elec-42", name: "Canon EOS Rebel", category: "Electronics & Devices", price: 950000, currency: "TZS", currencySymbol: "TSh", stock: 8,
          business: "Camera World Tanzania", location: { lat: -6.8184, lng: 39.2883 }, address: "Mlimani City, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "DSLR camera for beginners", brand: "Canon", condition: "new", rating: 4.2, reviews: 9, type: "product"
        },
        {
          id: "elec-43", name: "Jabra Elite 85t", category: "Electronics & Devices", price: 380000, currency: "TZS", currencySymbol: "TSh", stock: 13,
          business: "Wireless Audio Uganda", location: { lat: 0.3476, lng: 32.5825 }, address: "Bugolobi, Kampala", country: "Uganda", region: "Kampala", city: "Kampala",
          images: ["https://images.pexels.com/photos/3394661/pexels-photo-3394661.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "True wireless earbuds", brand: "Jabra", condition: "new", rating: 4.5, reviews: 10, type: "product"
        },
        {
          id: "elec-44", name: "ASUS ZenBook", category: "Electronics & Devices", price: 2400000, currency: "TZS", currencySymbol: "TSh", stock: 5,
          business: "Ultrabook Kenya", location: { lat: -1.2921, lng: 36.8219 }, address: "Yaya Centre, Nairobi", country: "Kenya", region: "Nairobi", city: "Nairobi",
          images: ["https://images.pexels.com/photos/812264/pexels-photo-812264.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Slim and light laptop", brand: "ASUS", condition: "new", rating: 4.6, reviews: 8, type: "product"
        },
        {
          id: "elec-45", name: "Philips Hue Starter", category: "Electronics & Devices", price: 320000, currency: "TZS", currencySymbol: "TSh", stock: 12,
          business: "Smart Home Tanzania", location: { lat: -6.8155, lng: 39.2861 }, address: "Masaki, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/1275929/pexels-photo-1275929.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Smart lighting kit", brand: "Philips", condition: "new", rating: 4.4, reviews: 11, type: "product"
        },
        {
          id: "elec-46", name: "Samsung Galaxy Buds", category: "Electronics & Devices", price: 280000, currency: "TZS", currencySymbol: "TSh", stock: 18,
          business: "Wireless Tech Uganda", location: { lat: 0.3476, lng: 32.5825 }, address: "Kabalagala, Kampala", country: "Uganda", region: "Kampala", city: "Kampala",
          images: ["https://images.pexels.com/photos/3394661/pexels-photo-3394661.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Wireless earbuds", brand: "Samsung", condition: "new", rating: 4.3, reviews: 13, type: "product"
        },
        {
          id: "elec-47", name: "LG Gram Laptop", category: "Electronics & Devices", price: 2700000, currency: "TZS", currencySymbol: "TSh", stock: 4,
          business: "Light Laptops Kenya", location: { lat: -1.2921, lng: 36.8219 }, address: "Loresho, Nairobi", country: "Kenya", region: "Nairobi", city: "Nairobi",
          images: ["https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=300"], description: "Ultra-light laptop", brand: "LG", condition: "new", rating: 4.5, reviews: 7, type: "product"
        },
        {
          id: "elec-48", name: "Bose SoundLink", category: "Electronics & Devices", price: 420000, currency: "TZS", currencySymbol: "TSh", stock: 14,
          business: "Portable Audio Tanzania", location: { lat: -6.8184, lng: 39.2883 }, address: "Mlimani City, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/3394661/pexels-photo-3394661.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Bluetooth speaker", brand: "Bose", condition: "new", rating: 4.6, reviews: 9, type: "product"
        },
        {
          id: "elec-49", name: "Apple TV 4K", category: "Electronics & Devices", price: 650000, currency: "TZS", currencySymbol: "TSh", stock: 8,
          business: "Entertainment Hub Uganda", location: { lat: 0.3476, lng: 32.5825 }, address: "Kololo, Kampala", country: "Uganda", region: "Kampala", city: "Kampala",
          images: ["https://images.pexels.com/photos/5721908/pexels-photo-5721908.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Streaming device", brand: "Apple", condition: "new", rating: 4.7, reviews: 10, type: "product"
        },
        {
          id: "elec-50", name: "Dell XPS 13", category: "Electronics & Devices", price: 3100000, currency: "TZS", currencySymbol: "TSh", stock: 3,
          business: "Premium Laptops Kenya", location: { lat: -1.2921, lng: 36.8219 }, address: "Village Market, Nairobi", country: "Kenya", region: "Nairobi", city: "Nairobi",
          images: ["https://images.pexels.com/photos/812264/pexels-photo-812264.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Compact premium laptop", brand: "Dell", condition: "new", rating: 4.8, reviews: 12, type: "product"
        }
      ];

      const sampleFashion = [
        {
          id: "fash-1", name: "Men's Running Shoes", category: "General Goods", price: 85000, currency: "TZS", currencySymbol: "TSh", stock: 15,
          business: "Sports Gear Tanzania", location: { lat: -6.8184, lng: 39.2883 }, address: "Mlimani City, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Comfortable running shoes", brand: "RunPro", condition: "new", rating: 4.3, reviews: 15, type: "product"
        },
        {
          id: "fash-2", name: "Designer Leather Handbag", category: "General Goods", price: 150000, currency: "TZS", currencySymbol: "TSh", stock: 8,
          business: "Fashion House Dar", location: { lat: -6.8155, lng: 39.2861 }, address: "Masaki, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Luxury designer handbag", brand: "StyleCraft", condition: "new", rating: 4.6, reviews: 8, type: "product"
        },
        {
          id: "fash-3", name: "Women's Summer Dress", category: "General Goods", price: 65000, currency: "TZS", currencySymbol: "TSh", stock: 20,
          business: "Fashion Trends Kenya", location: { lat: -1.2921, lng: 36.8219 }, address: "Westgate, Nairobi", country: "Kenya", region: "Nairobi", city: "Nairobi",
          images: ["https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Elegant summer floral dress", brand: "FashionNova", condition: "new", rating: 4.4, reviews: 12, type: "product"
        },
        {
          id: "fash-4", name: "Men's Business Suit", category: "General Goods", price: 280000, currency: "TZS", currencySymbol: "TSh", stock: 6,
          business: "Executive Wear Uganda", location: { lat: 0.3476, lng: 32.5825 }, address: "Garden City, Kampala", country: "Uganda", region: "Kampala", city: "Kampala",
          images: ["https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Premium wool business suit", brand: "ExecutiveStyle", condition: "new", rating: 4.7, reviews: 9, type: "product"
        },
        {
          id: "fash-5", name: "Designer Sunglasses", category: "General Goods", price: 120000, currency: "TZS", currencySymbol: "TSh", stock: 25,
          business: "Eye Fashion Tanzania", location: { lat: -6.8184, lng: 39.2883 }, address: "Mlimani City, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/2112606/pexels-photo-2112606.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Luxury polarized sunglasses", brand: "Ray-Ban", condition: "new", rating: 4.5, reviews: 14, type: "product"
        },
        {
          id: "fash-6", name: "Women's Handbag", category: "General Goods", price: 95000, currency: "TZS", currencySymbol: "TSh", stock: 18,
          business: "Bag Boutique Kenya", location: { lat: -1.2921, lng: 36.8219 }, address: "Two Rivers, Nairobi", country: "Kenya", region: "Nairobi", city: "Nairobi",
          images: ["https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Trendy women's handbag", brand: "Coach", condition: "new", rating: 4.3, reviews: 11, type: "product"
        },
        {
          id: "fash-7", name: "Men's Casual Shirt", category: "General Goods", price: 45000, currency: "TZS", currencySymbol: "TSh", stock: 30,
          business: "Men's Fashion Uganda", location: { lat: 0.3476, lng: 32.5825 }, address: "Acacia Mall, Kampala", country: "Uganda", region: "Kampala", city: "Kampala",
          images: ["https://images.pexels.com/photos/769733/pexels-photo-769733.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Cotton casual shirt", brand: "Tommy Hilfiger", condition: "new", rating: 4.2, reviews: 8, type: "product"
        },
        {
          id: "fash-8", name: "Women's High Heels", category: "General Goods", price: 78000, currency: "TZS", currencySymbol: "TSh", stock: 12,
          business: "Shoe Palace Tanzania", location: { lat: -6.7924, lng: 39.2083 }, address: "Kariakoo, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Elegant high heel shoes", brand: "Jimmy Choo", condition: "new", rating: 4.6, reviews: 7, type: "product"
        },
        {
          id: "fash-9", name: "Men's Watch", category: "General Goods", price: 320000, currency: "TZS", currencySymbol: "TSh", stock: 10,
          business: "Timepiece Kenya", location: { lat: -1.2921, lng: 36.8219 }, address: "The Hub, Nairobi", country: "Kenya", region: "Nairobi", city: "Nairobi",
          images: ["https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Luxury men's wristwatch", brand: "Rolex", condition: "new", rating: 4.8, reviews: 6, type: "product"
        },
        {
          id: "fash-10", name: "Women's Jewelry Set", category: "General Goods", price: 180000, currency: "TZS", currencySymbol: "TSh", stock: 15,
          business: "Jewelry Gallery Uganda", location: { lat: 0.3476, lng: 32.5825 }, address: "Victoria Mall, Kampala", country: "Uganda", region: "Kampala", city: "Kampala",
          images: ["https://images.pexels.com/photos/1132040/pexels-photo-1132040.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Gold plated jewelry set", brand: "Pandora", condition: "new", rating: 4.5, reviews: 10, type: "product"
        },
        {
          id: "fash-11", name: "Men's Leather Jacket", category: "General Goods", price: 220000, currency: "TZS", currencySymbol: "TSh", stock: 8,
          business: "Leather Crafts Tanzania", location: { lat: -6.8155, lng: 39.2861 }, address: "Oysterbay, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/1306245/pexels-photo-1306245.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Genuine leather jacket", brand: "Schott", condition: "new", rating: 4.7, reviews: 9, type: "product"
        },
        {
          id: "fash-12", name: "Women's Winter Coat", category: "General Goods", price: 190000, currency: "TZS", currencySymbol: "TSh", stock: 7,
          business: "Winter Fashion Kenya", location: { lat: -1.2921, lng: 36.8219 }, address: "Sarit Centre, Nairobi", country: "Kenya", region: "Nairobi", city: "Nairobi",
          images: ["https://images.pexels.com/photos/2065195/pexels-photo-2065195.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Warm winter coat", brand: "North Face", condition: "new", rating: 4.4, reviews: 8, type: "product"
        },
        {
          id: "fash-13", name: "Men's Sneakers", category: "General Goods", price: 68000, currency: "TZS", currencySymbol: "TSh", stock: 22,
          business: "Sneaker Head Uganda", location: { lat: 0.3476, lng: 32.5825 }, address: "Kabalagala, Kampala", country: "Uganda", region: "Kampala", city: "Kampala",
          images: ["https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Casual sneakers", brand: "Nike", condition: "new", rating: 4.3, reviews: 13, type: "product"
        },
        {
          id: "fash-14", name: "Women's Perfume", category: "General Goods", price: 95000, currency: "TZS", currencySymbol: "TSh", stock: 25,
          business: "Fragrance World Tanzania", location: { lat: -6.8184, lng: 39.2883 }, address: "Mlimani City, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Luxury women's perfume", brand: "Chanel", condition: "new", rating: 4.6, reviews: 11, type: "product"
        },
        {
          id: "fash-15", name: "Men's Cologne", category: "General Goods", price: 85000, currency: "TZS", currencySymbol: "TSh", stock: 20,
          business: "Men's Grooming Kenya", location: { lat: -1.2921, lng: 36.8219 }, address: "Galleria Mall, Nairobi", country: "Kenya", region: "Nairobi", city: "Nairobi",
          images: ["https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Premium men's cologne", brand: "Dior", condition: "new", rating: 4.5, reviews: 9, type: "product"
        },
        {
          id: "fash-16", name: "Women's Handbag", category: "General Goods", price: 110000, currency: "TZS", currencySymbol: "TSh", stock: 14,
          business: "Luxury Bags Uganda", location: { lat: 0.3476, lng: 32.5825 }, address: "Forest Mall, Kampala", country: "Uganda", region: "Kampala", city: "Kampala",
          images: ["https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Designer handbag", brand: "Gucci", condition: "new", rating: 4.7, reviews: 8, type: "product"
        },
        {
          id: "fash-17", name: "Men's Formal Shoes", category: "General Goods", price: 125000, currency: "TZS", currencySymbol: "TSh", stock: 9,
          business: "Shoe Masters Tanzania", location: { lat: -6.7924, lng: 39.2083 }, address: "City Centre, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Leather formal shoes", brand: "Allen Edmonds", condition: "new", rating: 4.4, reviews: 7, type: "product"
        },
        {
          id: "fash-18", name: "Women's Dress", category: "General Goods", price: 75000, currency: "TZS", currencySymbol: "TSh", stock: 18,
          business: "Dress Boutique Kenya", location: { lat: -1.2921, lng: 36.8219 }, address: "Junction Mall, Nairobi", country: "Kenya", region: "Nairobi", city: "Nairobi",
          images: ["https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Evening party dress", brand: "Zara", condition: "new", rating: 4.3, reviews: 12, type: "product"
        },
        {
          id: "fash-19", name: "Men's T-Shirt", category: "General Goods", price: 25000, currency: "TZS", currencySymbol: "TSh", stock: 35,
          business: "Casual Wear Uganda", location: { lat: 0.3476, lng: 32.5825 }, address: "Nakawa, Kampala", country: "Uganda", region: "Kampala", city: "Kampala",
          images: ["https://images.pexels.com/photos/769733/pexels-photo-769733.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Cotton t-shirt", brand: "Uniqlo", condition: "new", rating: 4.1, reviews: 15, type: "product"
        },
        {
          id: "fash-20", name: "Women's Sandals", category: "General Goods", price: 45000, currency: "TZS", currencySymbol: "TSh", stock: 20,
          business: "Summer Shoes Tanzania", location: { lat: -6.8184, lng: 39.2883 }, address: "Mlimani City, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Comfortable sandals", brand: "Birkenstock", condition: "new", rating: 4.2, reviews: 10, type: "product"
        },
        {
          id: "fash-21", name: "Men's Belt", category: "General Goods", price: 35000, currency: "TZS", currencySymbol: "TSh", stock: 28,
          business: "Accessories Kenya", location: { lat: -1.2921, lng: 36.8219 }, address: "Yaya Centre, Nairobi", country: "Kenya", region: "Nairobi", city: "Nairobi",
          images: ["https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Genuine leather belt", brand: "Hugo Boss", condition: "new", rating: 4.3, reviews: 8, type: "product"
        },
        {
          id: "fash-22", name: "Women's Scarf", category: "General Goods", price: 28000, currency: "TZS", currencySymbol: "TSh", stock: 32,
          business: "Fashion Accessories Uganda", location: { lat: 0.3476, lng: 32.5825 }, address: "Garden City, Kampala", country: "Uganda", region: "Kampala", city: "Kampala",
          images: ["https://images.pexels.com/photos/2065195/pexels-photo-2065195.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Silk scarf", brand: "Hermes", condition: "new", rating: 4.4, reviews: 9, type: "product"
        },
        {
          id: "fash-23", name: "Men's Wallet", category: "General Goods", price: 55000, currency: "TZS", currencySymbol: "TSh", stock: 16,
          business: "Leather Goods Tanzania", location: { lat: -6.8155, lng: 39.2861 }, address: "Slipway, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Genuine leather wallet", brand: "Montblanc", condition: "new", rating: 4.5, reviews: 7, type: "product"
        },
        {
          id: "fash-24", name: "Women's Hat", category: "General Goods", price: 32000, currency: "TZS", currencySymbol: "TSh", stock: 24,
          business: "Headwear Kenya", location: { lat: -1.2921, lng: 36.8219 }, address: "Lavington, Nairobi", country: "Kenya", region: "Nairobi", city: "Nairobi",
          images: ["https://images.pexels.com/photos/2065195/pexels-photo-2065195.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Fashionable sun hat", brand: "Eugenia Kim", condition: "new", rating: 4.2, reviews: 6, type: "product"
        },
        {
          id: "fash-25", name: "Men's Shorts", category: "General Goods", price: 38000, currency: "TZS", currencySymbol: "TSh", stock: 26,
          business: "Summer Wear Uganda", location: { lat: 0.3476, lng: 32.5825 }, address: "Naalya, Kampala", country: "Uganda", region: "Kampala", city: "Kampala",
          images: ["https://images.pexels.com/photos/769733/pexels-photo-769733.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Casual summer shorts", brand: "Lacoste", condition: "new", rating: 4.1, reviews: 11, type: "product"
        },
        {
          id: "fash-26", name: "Women's Blouse", category: "General Goods", price: 52000, currency: "TZS", currencySymbol: "TSh", stock: 19,
          business: "Women's Fashion Tanzania", location: { lat: -6.8184, lng: 39.2883 }, address: "Mlimani City, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Elegant blouse", brand: "Mango", condition: "new", rating: 4.3, reviews: 8, type: "product"
        },
        {
          id: "fash-27", name: "Men's Sweater", category: "General Goods", price: 68000, currency: "TZS", currencySymbol: "TSh", stock: 14,
          business: "Winter Collection Kenya", location: { lat: -1.2921, lng: 36.8219 }, address: "Karen, Nairobi", country: "Kenya", region: "Nairobi", city: "Nairobi",
          images: ["https://images.pexels.com/photos/1306245/pexels-photo-1306245.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Warm wool sweater", brand: "Ralph Lauren", condition: "new", rating: 4.4, reviews: 9, type: "product"
        },
        {
          id: "fash-28", name: "Women's Skirt", category: "General Goods", price: 48000, currency: "TZS", currencySymbol: "TSh", stock: 21,
          business: "Skirt Boutique Uganda", location: { lat: 0.3476, lng: 32.5825 }, address: "Bugolobi, Kampala", country: "Uganda", region: "Kampala", city: "Kampala",
          images: ["https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "A-line skirt", brand: "H&M", condition: "new", rating: 4.2, reviews: 7, type: "product"
        },
        {
          id: "fash-29", name: "Men's Jacket", category: "General Goods", price: 95000, currency: "TZS", currencySymbol: "TSh", stock: 11,
          business: "Outerwear Tanzania", location: { lat: -6.8155, lng: 39.2861 }, address: "Oysterbay, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/1306245/pexels-photo-1306245.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Casual jacket", brand: "Superdry", condition: "new", rating: 4.5, reviews: 10, type: "product"
        },
        {
          id: "fash-30", name: "Women's Bracelet", category: "General Goods", price: 65000, currency: "TZS", currencySymbol: "TSh", stock: 23,
          business: "Jewelry World Kenya", location: { lat: -1.2921, lng: 36.8219 }, address: "Westgate, Nairobi", country: "Kenya", region: "Nairobi", city: "Nairobi",
          images: ["https://images.pexels.com/photos/1132040/pexels-photo-1132040.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Silver bracelet", brand: "Tiffany", condition: "new", rating: 4.6, reviews: 8, type: "product"
        },
        {
          id: "fash-31", name: "Men's Tie", category: "General Goods", price: 28000, currency: "TZS", currencySymbol: "TSh", stock: 30,
          business: "Formal Accessories Uganda", location: { lat: 0.3476, lng: 32.5825 }, address: "Industrial Area, Kampala", country: "Uganda", region: "Kampala", city: "Kampala",
          images: ["https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Silk necktie", brand: "Armani", condition: "new", rating: 4.3, reviews: 6, type: "product"
        },
        {
          id: "fash-32", name: "Women's Earrings", category: "General Goods", price: 42000, currency: "TZS", currencySymbol: "TSh", stock: 27,
          business: "Earring Gallery Tanzania", location: { lat: -6.8184, lng: 39.2883 }, address: "Mlimani City, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/1132040/pexels-photo-1132040.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Gold plated earrings", brand: "Swarovski", condition: "new", rating: 4.4, reviews: 9, type: "product"
        },
        {
          id: "fash-33", name: "Men's Socks", category: "General Goods", price: 15000, currency: "TZS", currencySymbol: "TSh", stock: 40,
          business: "Sock Collection Kenya", location: { lat: -1.2921, lng: 36.8219 }, address: "Kilimani, Nairobi", country: "Kenya", region: "Nairobi", city: "Nairobi",
          images: ["https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Cotton dress socks", brand: "Happy Socks", condition: "new", rating: 4.1, reviews: 12, type: "product"
        },
        {
          id: "fash-34", name: "Women's Necklace", category: "General Goods", price: 88000, currency: "TZS", currencySymbol: "TSh", stock: 17,
          business: "Necklace Boutique Uganda", location: { lat: 0.3476, lng: 32.5825 }, address: "Victoria Mall, Kampala", country: "Uganda", region: "Kampala", city: "Kampala",
          images: ["https://images.pexels.com/photos/1132040/pexels-photo-1132040.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Pearl necklace", brand: "Mikimoto", condition: "new", rating: 4.7, reviews: 7, type: "product"
        },
        {
          id: "fash-35", name: "Men's Cap", category: "General Goods", price: 22000, currency: "TZS", currencySymbol: "TSh", stock: 33,
          business: "Headwear Tanzania", location: { lat: -6.8155, lng: 39.2861 }, address: "Masaki, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/2065195/pexels-photo-2065195.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Baseball cap", brand: "New Era", condition: "new", rating: 4.2, reviews: 10, type: "product"
        },
        {
          id: "fash-36", name: "Women's Ring", category: "General Goods", price: 35000, currency: "TZS", currencySymbol: "TSh", stock: 29,
          business: "Ring World Kenya", location: { lat: -1.2921, lng: 36.8219 }, address: "The Hub, Nairobi", country: "Kenya", region: "Nairobi", city: "Nairobi",
          images: ["https://images.pexels.com/photos/1132040/pexels-photo-1132040.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Diamond ring", brand: "Cartier", condition: "new", rating: 4.8, reviews: 6, type: "product"
        },
        {
          id: "fash-37", name: "Men's Gloves", category: "General Goods", price: 32000, currency: "TZS", currencySymbol: "TSh", stock: 22,
          business: "Winter Gear Uganda", location: { lat: 0.3476, lng: 32.5825 }, address: "Kololo, Kampala", country: "Uganda", region: "Kampala", city: "Kampala",
          images: ["https://images.pexels.com/photos/1306245/pexels-photo-1306245.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Leather gloves", brand: "Coach", condition: "new", rating: 4.3, reviews: 8, type: "product"
        },
        {
          id: "fash-38", name: "Women's Purse", category: "General Goods", price: 68000, currency: "TZS", currencySymbol: "TSh", stock: 16,
          business: "Purse Collection Tanzania", location: { lat: -6.8184, lng: 39.2883 }, address: "Mlimani City, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Evening purse", brand: "Kate Spade", condition: "new", rating: 4.5, reviews: 9, type: "product"
        },
        {
          id: "fash-39", name: "Men's Underwear", category: "General Goods", price: 18000, currency: "TZS", currencySymbol: "TSh", stock: 45,
          business: "Underwear Store Kenya", location: { lat: -1.2921, lng: 36.8219 }, address: "Galleria Mall, Nairobi", country: "Kenya", region: "Nairobi", city: "Nairobi",
          images: ["https://images.pexels.com/photos/769733/pexels-photo-769733.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Cotton underwear", brand: "Calvin Klein", condition: "new", rating: 4.2, reviews: 11, type: "product"
        },
        {
          id: "fash-40", name: "Women's Leggings", category: "General Goods", price: 38000, currency: "TZS", currencySymbol: "TSh", stock: 26,
          business: "Active Wear Uganda", location: { lat: 0.3476, lng: 32.5825 }, address: "Naalya, Kampala", country: "Uganda", region: "Kampala", city: "Kampala",
          images: ["https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Yoga leggings", brand: "Lululemon", condition: "new", rating: 4.4, reviews: 10, type: "product"
        },
        {
          id: "fash-41", name: "Men's Swimwear", category: "General Goods", price: 42000, currency: "TZS", currencySymbol: "TSh", stock: 19,
          business: "Beach Wear Tanzania", location: { lat: -6.8155, lng: 39.2861 }, address: "Masaki, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/769733/pexels-photo-769733.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Swim trunks", brand: "Speedo", condition: "new", rating: 4.3, reviews: 7, type: "product"
        },
        {
          id: "fash-42", name: "Women's Swimwear", category: "General Goods", price: 55000, currency: "TZS", currencySymbol: "TSh", stock: 15,
          business: "Beach Fashion Kenya", location: { lat: -1.2921, lng: 36.8219 }, address: "Karen, Nairobi", country: "Kenya", region: "Nairobi", city: "Nairobi",
          images: ["https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Bikini set", brand: "Victoria's Secret", condition: "new", rating: 4.6, reviews: 8, type: "product"
        },
        {
          id: "fash-43", name: "Men's Robe", category: "General Goods", price: 75000, currency: "TZS", currencySymbol: "TSh", stock: 12,
          business: "Home Wear Uganda", location: { lat: 0.3476, lng: 32.5825 }, address: "Bugolobi, Kampala", country: "Uganda", region: "Kampala", city: "Kampala",
          images: ["https://images.pexels.com/photos/1306245/pexels-photo-1306245.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Bath robe", brand: "Ralph Lauren", condition: "new", rating: 4.4, reviews: 6, type: "product"
        },
        {
          id: "fash-44", name: "Women's Pajamas", category: "General Goods", price: 48000, currency: "TZS", currencySymbol: "TSh", stock: 21,
          business: "Sleepwear Tanzania", location: { lat: -6.8184, lng: 39.2883 }, address: "Mlimani City, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Silk pajamas", brand: "La Perla", condition: "new", rating: 4.5, reviews: 9, type: "product"
        },
        {
          id: "fash-45", name: "Men's Sportswear", category: "General Goods", price: 65000, currency: "TZS", currencySymbol: "TSh", stock: 17,
          business: "Sports Fashion Kenya", location: { lat: -1.2921, lng: 36.8219 }, address: "Westgate, Nairobi", country: "Kenya", region: "Nairobi", city: "Nairobi",
          images: ["https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Track suit", brand: "Adidas", condition: "new", rating: 4.3, reviews: 10, type: "product"
        },
        {
          id: "fash-46", name: "Women's Sportswear", category: "General Goods", price: 58000, currency: "TZS", currencySymbol: "TSh", stock: 18,
          business: "Women's Active Uganda", location: { lat: 0.3476, lng: 32.5825 }, address: "Nakawa, Kampala", country: "Uganda", region: "Kampala", city: "Kampala",
          images: ["https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Yoga set", brand: "Nike", condition: "new", rating: 4.4, reviews: 8, type: "product"
        },
        {
          id: "fash-47", name: "Men's Formal Wear", category: "General Goods", price: 320000, currency: "TZS", currencySymbol: "TSh", stock: 8,
          business: "Formal Attire Tanzania", location: { lat: -6.8155, lng: 39.2861 }, address: "Oysterbay, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Tuxedo set", brand: "Hugo Boss", condition: "new", rating: 4.7, reviews: 7, type: "product"
        },
        {
          id: "fash-48", name: "Women's Formal Dress", category: "General Goods", price: 280000, currency: "TZS", currencySymbol: "TSh", stock: 9,
          business: "Evening Gowns Kenya", location: { lat: -1.2921, lng: 36.8219 }, address: "The Hub, Nairobi", country: "Kenya", region: "Nairobi", city: "Nairobi",
          images: ["https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Evening gown", brand: "Marchesa", condition: "new", rating: 4.8, reviews: 6, type: "product"
        },
        {
          id: "fash-49", name: "Men's Casual Wear", category: "General Goods", price: 85000, currency: "TZS", currencySymbol: "TSh", stock: 23,
          business: "Casual Fashion Uganda", location: { lat: 0.3476, lng: 32.5825 }, address: "Kabalagala, Kampala", country: "Uganda", region: "Kampala", city: "Kampala",
          images: ["https://images.pexels.com/photos/769733/pexels-photo-769733.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Casual outfit set", brand: "Tommy Hilfiger", condition: "new", rating: 4.3, reviews: 11, type: "product"
        },
        {
          id: "fash-50", name: "Women's Casual Wear", category: "General Goods", price: 78000, currency: "TZS", currencySymbol: "TSh", stock: 24,
          business: "Everyday Fashion Tanzania", location: { lat: -6.8184, lng: 39.2883 }, address: "Mlimani City, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Casual day outfit", brand: "Zara", condition: "new", rating: 4.4, reviews: 10, type: "product"
        }
      ];

      const sampleHotels = [
        {
          id: "hotel-1", name: "Serengeti Luxury Hotel", category: "Building & Hotels", serviceType: "5-Star Hotel", priceRange: "150-300", currency: "USD", currencySymbol: "$",
          business: "Serengeti Hospitality Group", location: { lat: -6.8155, lng: 39.2861 }, address: "Masaki, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "5-star luxury hotel with premium amenities", rating: "5", type: "service"
        },
        {
          id: "hotel-2", name: "Kilimanjaro Business Suites", category: "Building & Hotels", serviceType: "Luxury Apartment", priceRange: "80,000-150,000", currency: "TZS", currencySymbol: "TSh",
          business: "Prime Properties Tanzania", location: { lat: -6.8120, lng: 39.2840 }, address: "City Center, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Modern luxury apartments with business facilities", rating: "4", type: "service"
        },
        {
          id: "hotel-3", name: "Nairobi Safari Hotel", category: "Building & Hotels", serviceType: "4-Star Hotel", priceRange: "120-250", currency: "USD", currencySymbol: "$",
          business: "Safari Hospitality Kenya", location: { lat: -1.2921, lng: 36.8219 }, address: "Westlands, Nairobi", country: "Kenya", region: "Nairobi", city: "Nairobi",
          images: ["https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Luxury hotel with safari theme", rating: "4.5", type: "service"
        },
        {
          id: "hotel-4", name: "Kampala City Hotel", category: "Building & Hotels", serviceType: "Business Hotel", priceRange: "100-200", currency: "USD", currencySymbol: "$",
          business: "City Hospitality Uganda", location: { lat: 0.3476, lng: 32.5825 }, address: "Kampala Road, Kampala", country: "Uganda", region: "Kampala", city: "Kampala",
          images: ["https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Modern business hotel in city center", rating: "4.2", type: "service"
        },
        {
          id: "hotel-5", name: "Zanzibar Beach Resort", category: "Building & Hotels", serviceType: "Beach Resort", priceRange: "200-500", currency: "USD", currencySymbol: "$",
          business: "Zanzibar Resorts Ltd", location: { lat: -6.1659, lng: 39.2026 }, address: "Nungwi Beach, Zanzibar", country: "Tanzania", region: "Zanzibar", city: "Zanzibar",
          images: ["https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Luxury beachfront resort", rating: "4.8", type: "service"
        },
        {
          id: "hotel-6", name: "Arusha Safari Lodge", category: "Building & Hotels", serviceType: "Safari Lodge", priceRange: "180-350", currency: "USD", currencySymbol: "$",
          business: "Safari Lodges Tanzania", location: { lat: -3.3869, lng: 36.6821 }, address: "Arusha, Tanzania", country: "Tanzania", region: "Arusha", city: "Arusha",
          images: ["https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Authentic safari experience", rating: "4.6", type: "service"
        },
        {
          id: "hotel-7", name: "Mombasa Beach Hotel", category: "Building & Hotels", serviceType: "Beach Hotel", priceRange: "90-180", currency: "USD", currencySymbol: "$",
          business: "Coastal Hotels Kenya", location: { lat: -4.0435, lng: 39.6682 }, address: "Nyali Beach, Mombasa", country: "Kenya", region: "Mombasa", city: "Mombasa",
          images: ["https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Beachfront hotel with ocean views", rating: "4.3", type: "service"
        },
        {
          id: "hotel-8", name: "Lake Victoria Resort", category: "Building & Hotels", serviceType: "Lakeside Resort", priceRange: "70-150", currency: "USD", currencySymbol: "$",
          business: "Lake Resorts Uganda", location: { lat: 0.3476, lng: 33.2026 }, address: "Entebbe, Uganda", country: "Uganda", region: "Entebbe", city: "Entebbe",
          images: ["https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Peaceful lakeside retreat", rating: "4.4", type: "service"
        },
        {
          id: "hotel-9", name: "Dar es Salaam Business Inn", category: "Building & Hotels", serviceType: "Business Hotel", priceRange: "60,000-120,000", currency: "TZS", currencySymbol: "TSh",
          business: "Business Inns Tanzania", location: { lat: -6.7924, lng: 39.2083 }, address: "City Centre, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Comfortable business accommodation", rating: "4.1", type: "service"
        },
        {
          id: "hotel-10", name: "Nairobi Executive Suites", category: "Building & Hotels", serviceType: "Executive Apartments", priceRange: "150-300", currency: "USD", currencySymbol: "$",
          business: "Executive Stays Kenya", location: { lat: -1.2921, lng: 36.8219 }, address: "Kilimani, Nairobi", country: "Kenya", region: "Nairobi", city: "Nairobi",
          images: ["https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Luxury executive apartments", rating: "4.7", type: "service"
        },
        {
          id: "hotel-11", name: "Kampala Garden Hotel", category: "Building & Hotels", serviceType: "Boutique Hotel", priceRange: "80-160", currency: "USD", currencySymbol: "$",
          business: "Garden Hotels Uganda", location: { lat: 0.3476, lng: 32.5825 }, address: "Kololo, Kampala", country: "Uganda", region: "Kampala", city: "Kampala",
          images: ["https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Charming boutique hotel", rating: "4.5", type: "service"
        },
        {
          id: "hotel-12", name: "Zanzibar Palace Hotel", category: "Building & Hotels", serviceType: "Historic Hotel", priceRange: "120-240", currency: "USD", currencySymbol: "$",
          business: "Historic Hotels Zanzibar", location: { lat: -6.1659, lng: 39.2026 }, address: "Stone Town, Zanzibar", country: "Tanzania", region: "Zanzibar", city: "Zanzibar",
          images: ["https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Restored historic palace hotel", rating: "4.6", type: "service"
        },
        {
          id: "hotel-13", name: "Arusha Mountain View", category: "Building & Hotels", serviceType: "Mountain Lodge", priceRange: "100-200", currency: "USD", currencySymbol: "$",
          business: "Mountain Lodges Tanzania", location: { lat: -3.3869, lng: 36.6821 }, address: "Arusha, Tanzania", country: "Tanzania", region: "Arusha", city: "Arusha",
          images: ["https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Lodge with mountain views", rating: "4.4", type: "service"
        },
        {
          id: "hotel-14", name: "Mombasa City Hotel", category: "Building & Hotels", serviceType: "City Hotel", priceRange: "70-140", currency: "USD", currencySymbol: "$",
          business: "City Hotels Kenya", location: { lat: -4.0435, lng: 39.6682 }, address: "Mombasa Island, Mombasa", country: "Kenya", region: "Mombasa", city: "Mombasa",
          images: ["https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Comfortable city accommodation", rating: "4.2", type: "service"
        },
        {
          id: "hotel-15", name: "Lake Victoria Fishing Lodge", category: "Building & Hotels", serviceType: "Fishing Lodge", priceRange: "90-180", currency: "USD", currencySymbol: "$",
          business: "Fishing Lodges Uganda", location: { lat: 0.3476, lng: 33.2026 }, address: "Jinja, Uganda", country: "Uganda", region: "Jinja", city: "Jinja",
          images: ["https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Fishing and relaxation retreat", rating: "4.3", type: "service"
        },
        {
          id: "hotel-16", name: "Dar es Salaam Airport Hotel", category: "Building & Hotels", serviceType: "Airport Hotel", priceRange: "50,000-100,000", currency: "TZS", currencySymbol: "TSh",
          business: "Airport Hotels Tanzania", location: { lat: -6.8722, lng: 39.2026 }, address: "Airport Area, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Convenient airport accommodation", rating: "4.0", type: "service"
        },
        {
          id: "hotel-17", name: "Nairobi Conference Center", category: "Building & Hotels", serviceType: "Conference Hotel", priceRange: "200-400", currency: "USD", currencySymbol: "$",
          business: "Conference Hotels Kenya", location: { lat: -1.2921, lng: 36.8219 }, address: "Westlands, Nairobi", country: "Kenya", region: "Nairobi", city: "Nairobi",
          images: ["https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Modern conference facilities", rating: "4.5", type: "service"
        },
        {
          id: "hotel-18", name: "Kampala Business Center", category: "Building & Hotels", serviceType: "Business Center", priceRange: "120-250", currency: "USD", currencySymbol: "$",
          business: "Business Centers Uganda", location: { lat: 0.3476, lng: 32.5825 }, address: "Nakasero, Kampala", country: "Uganda", region: "Kampala", city: "Kampala",
          images: ["https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Premium business accommodation", rating: "4.4", type: "service"
        },
        {
          id: "hotel-19", name: "Zanzibar Spa Resort", category: "Building & Hotels", serviceType: "Spa Resort", priceRange: "250-500", currency: "USD", currencySymbol: "$",
          business: "Spa Resorts Zanzibar", location: { lat: -6.1659, lng: 39.2026 }, address: "Kendwa Beach, Zanzibar", country: "Tanzania", region: "Zanzibar", city: "Zanzibar",
          images: ["https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Luxury spa and wellness resort", rating: "4.9", type: "service"
        },
        {
          id: "hotel-20", name: "Arusha Camping Lodge", category: "Building & Hotels", serviceType: "Camping Lodge", priceRange: "40-80", currency: "USD", currencySymbol: "$",
          business: "Camping Lodges Tanzania", location: { lat: -3.3869, lng: 36.6821 }, address: "Arusha, Tanzania", country: "Tanzania", region: "Arusha", city: "Arusha",
          images: ["https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Authentic camping experience", rating: "4.2", type: "service"
        },
        {
          id: "hotel-21", name: "Mombasa Family Resort", category: "Building & Hotels", serviceType: "Family Resort", priceRange: "110-220", currency: "USD", currencySymbol: "$",
          business: "Family Resorts Kenya", location: { lat: -4.0435, lng: 39.6682 }, address: "Diani Beach, Mombasa", country: "Kenya", region: "Mombasa", city: "Mombasa",
          images: ["https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Family-friendly beach resort", rating: "4.6", type: "service"
        },
        {
          id: "hotel-22", name: "Lake Victoria Eco Lodge", category: "Building & Hotels", serviceType: "Eco Lodge", priceRange: "60-120", currency: "USD", currencySymbol: "$",
          business: "Eco Lodges Uganda", location: { lat: 0.3476, lng: 33.2026 }, address: "Ssese Islands, Uganda", country: "Uganda", region: "Kalangala", city: "Kalangala",
          images: ["https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Sustainable eco-tourism", rating: "4.3", type: "service"
        },
        {
          id: "hotel-23", name: "Dar es Salaam Beach Hotel", category: "Building & Hotels", serviceType: "Beach Hotel", priceRange: "80,000-160,000", currency: "TZS", currencySymbol: "TSh",
          business: "Beach Hotels Tanzania", location: { lat: -6.8155, lng: 39.2861 }, address: "Kunduchi Beach, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Beachfront city hotel", rating: "4.4", type: "service"
        },
        {
          id: "hotel-24", name: "Nairobi Budget Inn", category: "Building & Hotels", serviceType: "Budget Hotel", priceRange: "30-60", currency: "USD", currencySymbol: "$",
          business: "Budget Stays Kenya", location: { lat: -1.2921, lng: 36.8219 }, address: "CBD, Nairobi", country: "Kenya", region: "Nairobi", city: "Nairobi",
          images: ["https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Affordable city accommodation", rating: "3.8", type: "service"
        },
        {
          id: "hotel-25", name: "Kampala Luxury Villas", category: "Building & Hotels", serviceType: "Private Villas", priceRange: "300-600", currency: "USD", currencySymbol: "$",
          business: "Luxury Villas Uganda", location: { lat: 0.3476, lng: 32.5825 }, address: "Lubowa, Kampala", country: "Uganda", region: "Kampala", city: "Kampala",
          images: ["https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Private luxury villas", rating: "4.8", type: "service"
        }
      ];

      const sampleVehicles = [
        {
          id: "veh-1", name: "Toyota Land Cruiser V8", category: "Vehicles", price: 185000000, currency: "TZS", currencySymbol: "TSh", stock: 2,
          business: "Premium Motors Tanzania", location: { lat: -6.8155, lng: 39.2861 }, address: "Masaki, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Luxury SUV with premium features", brand: "Toyota", condition: "new", rating: 4.8, reviews: 12, type: "product"
        },
        {
          id: "veh-2", name: "BMW X5", category: "Vehicles", price: 165000000, currency: "TZS", currencySymbol: "TSh", stock: 3,
          business: "German Motors Kenya", location: { lat: -1.2921, lng: 36.8219 }, address: "Westlands, Nairobi", country: "Kenya", region: "Nairobi", city: "Nairobi",
          images: ["https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Luxury German SUV", brand: "BMW", condition: "new", rating: 4.7, reviews: 9, type: "product"
        },
        {
          id: "veh-3", name: "Mercedes Benz C-Class", category: "Vehicles", price: 145000000, currency: "TZS", currencySymbol: "TSh", stock: 4,
          business: "Mercedes Uganda", location: { lat: 0.3476, lng: 32.5825 }, address: "Kampala Road, Kampala", country: "Uganda", region: "Kampala", city: "Kampala",
          images: ["https://images.pexels.com/photos/2365572/pexels-photo-2365572.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Executive luxury sedan", brand: "Mercedes", condition: "new", rating: 4.6, reviews: 11, type: "product"
        },
        {
          id: "veh-4", name: "Toyota Hilux Double Cab", category: "Vehicles", price: 85000000, currency: "TZS", currencySymbol: "TSh", stock: 8,
          business: "Toyota Tanzania", location: { lat: -6.7924, lng: 39.2083 }, address: "Nyerere Road, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Rugged pickup truck", brand: "Toyota", condition: "new", rating: 4.5, reviews: 15, type: "product"
        },
        {
          id: "veh-5", name: "Honda CR-V", category: "Vehicles", price: 95000000, currency: "TZS", currencySymbol: "TSh", stock: 5,
          business: "Honda Kenya", location: { lat: -1.2921, lng: 36.8219 }, address: "Thika Road, Nairobi", country: "Kenya", region: "Nairobi", city: "Nairobi",
          images: ["https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Reliable family SUV", brand: "Honda", condition: "new", rating: 4.4, reviews: 8, type: "product"
        },
        {
          id: "veh-6", name: "Range Rover Sport", category: "Vehicles", price: 220000000, currency: "TZS", currencySymbol: "TSh", stock: 2,
          business: "Luxury Cars Uganda", location: { lat: 0.3476, lng: 32.5825 }, address: "Kololo, Kampala", country: "Uganda", region: "Kampala", city: "Kampala",
          images: ["https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Premium British SUV", brand: "Land Rover", condition: "new", rating: 4.9, reviews: 7, type: "product"
        },
        {
          id: "veh-7", name: "Toyota RAV4", category: "Vehicles", price: 78000000, currency: "TZS", currencySymbol: "TSh", stock: 6,
          business: "Toyota Kenya", location: { lat: -1.2921, lng: 36.8219 }, address: "Mombasa Road, Nairobi", country: "Kenya", region: "Nairobi", city: "Nairobi",
          images: ["https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Compact crossover SUV", brand: "Toyota", condition: "new", rating: 4.3, reviews: 10, type: "product"
        },
        {
          id: "veh-8", name: "Nissan X-Trail", category: "Vehicles", price: 82000000, currency: "TZS", currencySymbol: "TSh", stock: 4,
          business: "Nissan Tanzania", location: { lat: -6.8184, lng: 39.2883 }, address: "Mlimani City, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Family SUV with space", brand: "Nissan", condition: "new", rating: 4.2, reviews: 6, type: "product"
        },
        {
          id: "veh-9", name: "Mitsubishi Pajero Sport", category: "Vehicles", price: 105000000, currency: "TZS", currencySymbol: "TSh", stock: 3,
          business: "Mitsubishi Uganda", location: { lat: 0.3476, lng: 32.5825 }, address: "Entebbe Road, Kampala", country: "Uganda", region: "Kampala", city: "Kampala",
          images: ["https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Rugged off-road SUV", brand: "Mitsubishi", condition: "new", rating: 4.5, reviews: 9, type: "product"
        },
        {
          id: "veh-10", name: "Subaru Forester", category: "Vehicles", price: 88000000, currency: "TZS", currencySymbol: "TSh", stock: 5,
          business: "Subaru Kenya", location: { lat: -1.2921, lng: 36.8219 }, address: "Langata Road, Nairobi", country: "Kenya", region: "Nairobi", city: "Nairobi",
          images: ["https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "All-wheel drive SUV", brand: "Subaru", condition: "new", rating: 4.4, reviews: 8, type: "product"
        },
        {
          id: "veh-11", name: "Toyota Corolla", category: "Vehicles", price: 55000000, currency: "TZS", currencySymbol: "TSh", stock: 12,
          business: "Toyota Tanzania", location: { lat: -6.7924, lng: 39.2083 }, address: "City Centre, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/2365572/pexels-photo-2365572.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Reliable compact sedan", brand: "Toyota", condition: "new", rating: 4.6, reviews: 14, type: "product"
        },
        {
          id: "veh-12", name: "Honda Civic", category: "Vehicles", price: 62000000, currency: "TZS", currencySymbol: "TSh", stock: 7,
          business: "Honda Uganda", location: { lat: 0.3476, lng: 32.5825 }, address: "Naalya, Kampala", country: "Uganda", region: "Kampala", city: "Kampala",
          images: ["https://images.pexels.com/photos/2365572/pexels-photo-2365572.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Sporty compact sedan", brand: "Honda", condition: "new", rating: 4.5, reviews: 11, type: "product"
        },
        {
          id: "veh-13", name: "Mazda CX-5", category: "Vehicles", price: 92000000, currency: "TZS", currencySymbol: "TSh", stock: 4,
          business: "Mazda Kenya", location: { lat: -1.2921, lng: 36.8219 }, address: "Karen, Nairobi", country: "Kenya", region: "Nairobi", city: "Nairobi",
          images: ["https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Stylish crossover SUV", brand: "Mazda", condition: "new", rating: 4.4, reviews: 7, type: "product"
        },
        {
          id: "veh-14", name: "Volkswagen Tiguan", category: "Vehicles", price: 98000000, currency: "TZS", currencySymbol: "TSh", stock: 3,
          business: "Volkswagen Tanzania", location: { lat: -6.8155, lng: 39.2861 }, address: "Oysterbay, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "German compact SUV", brand: "Volkswagen", condition: "new", rating: 4.3, reviews: 6, type: "product"
        },
        {
          id: "veh-15", name: "Toyota Hiace", category: "Vehicles", price: 68000000, currency: "TZS", currencySymbol: "TSh", stock: 10,
          business: "Commercial Vehicles Kenya", location: { lat: -1.2921, lng: 36.8219 }, address: "Industrial Area, Nairobi", country: "Kenya", region: "Nairobi", city: "Nairobi",
          images: ["https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Commercial passenger van", brand: "Toyota", condition: "new", rating: 4.2, reviews: 9, type: "product"
        },
        {
          id: "veh-16", name: "Isuzu D-Max", category: "Vehicles", price: 72000000, currency: "TZS", currencySymbol: "TSh", stock: 6,
          business: "Isuzu Uganda", location: { lat: 0.3476, lng: 32.5825 }, address: "Ntinda, Kampala", country: "Uganda", region: "Kampala", city: "Kampala",
          images: ["https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Durable pickup truck", brand: "Isuzu", condition: "new", rating: 4.4, reviews: 8, type: "product"
        },
        {
          id: "veh-17", name: "Ford Ranger", category: "Vehicles", price: 78000000, currency: "TZS", currencySymbol: "TSh", stock: 5,
          business: "Ford Tanzania", location: { lat: -6.8184, lng: 39.2883 }, address: "Mlimani City, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "American pickup truck", brand: "Ford", condition: "new", rating: 4.3, reviews: 7, type: "product"
        },
        {
          id: "veh-18", name: "Hyundai Tucson", category: "Vehicles", price: 85000000, currency: "TZS", currencySymbol: "TSh", stock: 4,
          business: "Hyundai Kenya", location: { lat: -1.2921, lng: 36.8219 }, address: "Mombasa Road, Nairobi", country: "Kenya", region: "Nairobi", city: "Nairobi",
          images: ["https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Modern compact SUV", brand: "Hyundai", condition: "new", rating: 4.2, reviews: 6, type: "product"
        },
        {
          id: "veh-19", name: "Kia Sportage", category: "Vehicles", price: 82000000, currency: "TZS", currencySymbol: "TSh", stock: 5,
          business: "Kia Uganda", location: { lat: 0.3476, lng: 32.5825 }, address: "Kisementi, Kampala", country: "Uganda", region: "Kampala", city: "Kampala",
          images: ["https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Stylish family SUV", brand: "Kia", condition: "new", rating: 4.3, reviews: 8, type: "product"
        },
        {
          id: "veh-20", name: "Toyota Prius", category: "Vehicles", price: 65000000, currency: "TZS", currencySymbol: "TSh", stock: 8,
          business: "Eco Cars Tanzania", location: { lat: -6.8155, lng: 39.2861 }, address: "Masaki, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/2365572/pexels-photo-2365572.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Hybrid fuel-efficient car", brand: "Toyota", condition: "new", rating: 4.5, reviews: 10, type: "product"
        },
        {
          id: "veh-21", name: "Mercedes Sprinter", category: "Vehicles", price: 125000000, currency: "TZS", currencySymbol: "TSh", stock: 3,
          business: "Commercial Vehicles Kenya", location: { lat: -1.2921, lng: 36.8219 }, address: "Industrial Area, Nairobi", country: "Kenya", region: "Nairobi", city: "Nairobi",
          images: ["https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Commercial passenger van", brand: "Mercedes", condition: "new", rating: 4.6, reviews: 7, type: "product"
        },
        {
          id: "veh-22", name: "Toyota Coaster", category: "Vehicles", price: 145000000, currency: "TZS", currencySymbol: "TSh", stock: 2,
          business: "Bus Sales Uganda", location: { lat: 0.3476, lng: 32.5825 }, address: "Industrial Area, Kampala", country: "Uganda", region: "Kampala", city: "Kampala",
          images: ["https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Mini bus for transport", brand: "Toyota", condition: "new", rating: 4.4, reviews: 5, type: "product"
        },
        {
          id: "veh-23", name: "Nissan Navara", category: "Vehicles", price: 75000000, currency: "TZS", currencySymbol: "TSh", stock: 4,
          business: "Nissan Kenya", location: { lat: -1.2921, lng: 36.8219 }, address: "Mombasa Road, Nairobi", country: "Kenya", region: "Nairobi", city: "Nairobi",
          images: ["https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Robust pickup truck", brand: "Nissan", condition: "new", rating: 4.3, reviews: 6, type: "product"
        },
        {
          id: "veh-24", name: "Mitsubishi L200", category: "Vehicles", price: 78000000, currency: "TZS", currencySymbol: "TSh", stock: 3,
          business: "Mitsubishi Tanzania", location: { lat: -6.7924, lng: 39.2083 }, address: "Nyerere Road, Dar es Salaam", country: "Tanzania", region: "Dar es Salaam", city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Workhorse pickup truck", brand: "Mitsubishi", condition: "new", rating: 4.2, reviews: 5, type: "product"
        },
        {
          id: "veh-25", name: "Toyota Fortuner", category: "Vehicles", price: 115000000, currency: "TZS", currencySymbol: "TSh", stock: 4,
          business: "Toyota Uganda", location: { lat: 0.3476, lng: 32.5825 }, address: "Entebbe Road, Kampala", country: "Uganda", region: "Kampala", city: "Kampala",
          images: ["https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=300"], description: "Premium family SUV", brand: "Toyota", condition: "new", rating: 4.7, reviews: 9, type: "product"
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