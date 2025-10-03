// src/ProductSearch.jsx - IMPROVED & COMPLETE VERSION WITH 30+ SAMPLE ITEMS PER CATEGORY
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";

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

      // ==================== SAMPLE DATA - 30+ ITEMS PER CATEGORY ====================
      
      // Electronics & Devices - 30+ items
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
        },
        {
          id: "elec-3",
          name: "Samsung Galaxy S24 Ultra",
          category: "Electronics & Devices",
          price: 1800000,
          currency: "TZS",
          currencySymbol: "TSh",
          stock: 8,
          business: "MobileTech Kenya",
          location: { lat: -1.2921, lng: 36.8219 },
          address: "Westlands, Nairobi",
          country: "Kenya",
          region: "Nairobi",
          city: "Nairobi",
          images: ["https://images.pexels.com/photos/47261/pexels-photo-47261.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Premium smartphone with S Pen and advanced AI features",
          brand: "Samsung",
          condition: "new",
          rating: 4.6,
          reviews: 12,
          type: "product"
        },
        {
          id: "elec-4",
          name: "HP Pavilion Gaming Laptop",
          category: "Electronics & Devices",
          price: 950000,
          currency: "TZS",
          currencySymbol: "TSh",
          stock: 4,
          business: "Gaming Zone Uganda",
          location: { lat: 0.3476, lng: 32.5825 },
          address: "Kampala Road, Kampala",
          country: "Uganda",
          region: "Kampala",
          city: "Kampala",
          images: ["https://images.pexels.com/photos/303383/pexels-photo-303383.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Gaming laptop with RTX graphics and high refresh rate display",
          brand: "HP",
          condition: "new",
          rating: 4.4,
          reviews: 8,
          type: "product"
        },
        {
          id: "elec-5",
          name: "MacBook Air M2",
          category: "Electronics & Devices",
          price: 2200000,
          currency: "TZS",
          currencySymbol: "TSh",
          stock: 6,
          business: "Apple Store Tanzania",
          location: { lat: -6.8155, lng: 39.2861 },
          address: "Masaki, Dar es Salaam",
          country: "Tanzania",
          region: "Dar es Salaam",
          city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/1229861/pexels-photo-1229861.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Ultra-thin laptop with Apple M2 chip and Retina display",
          brand: "Apple",
          condition: "new",
          rating: 4.9,
          reviews: 20,
          type: "product"
        },
        {
          id: "elec-6",
          name: "Sony WH-1000XM5 Headphones",
          category: "Electronics & Devices",
          price: 450000,
          currency: "TZS",
          currencySymbol: "TSh",
          stock: 12,
          business: "Audio Masters Kenya",
          location: { lat: -1.2921, lng: 36.8219 },
          address: "CBD, Nairobi",
          country: "Kenya",
          region: "Nairobi",
          city: "Nairobi",
          images: ["https://images.pexels.com/photos/3394663/pexels-photo-3394663.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Premium noise-canceling wireless headphones",
          brand: "Sony",
          condition: "new",
          rating: 4.7,
          reviews: 15,
          type: "product"
        },
        {
          id: "elec-7",
          name: "iPad Pro 12.9-inch",
          category: "Electronics & Devices",
          price: 1500000,
          currency: "TZS",
          currencySymbol: "TSh",
          stock: 7,
          business: "TechHub Tanzania",
          location: { lat: -6.7924, lng: 39.2083 },
          address: "Samora Avenue, Dar es Salaam",
          country: "Tanzania",
          region: "Dar es Salaam",
          city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Professional tablet with M2 chip and Liquid Retina XDR display",
          brand: "Apple",
          condition: "new",
          rating: 4.8,
          reviews: 18,
          type: "product"
        },
        {
          id: "elec-8",
          name: "Canon EOS R5 Camera",
          category: "Electronics & Devices",
          price: 3500000,
          currency: "TZS",
          currencySymbol: "TSh",
          stock: 3,
          business: "Camera World Uganda",
          location: { lat: 0.3476, lng: 32.5825 },
          address: "Kampala Road, Kampala",
          country: "Uganda",
          region: "Kampala",
          city: "Kampala",
          images: ["https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Professional mirrorless camera with 45MP sensor",
          brand: "Canon",
          condition: "new",
          rating: 4.9,
          reviews: 10,
          type: "product"
        },
        {
          id: "elec-9",
          name: "Samsung 55-inch 4K Smart TV",
          category: "Electronics & Devices",
          price: 850000,
          currency: "TZS",
          currencySymbol: "TSh",
          stock: 9,
          business: "Home Electronics Tanzania",
          location: { lat: -6.8184, lng: 39.2883 },
          address: "Mlimani City, Dar es Salaam",
          country: "Tanzania",
          region: "Dar es Salaam",
          city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/5721908/pexels-photo-5721908.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Crystal UHD 4K smart television with streaming apps",
          brand: "Samsung",
          condition: "new",
          rating: 4.5,
          reviews: 14,
          type: "product"
        },
        {
          id: "elec-10",
          name: "PlayStation 5 Console",
          category: "Electronics & Devices",
          price: 1100000,
          currency: "TZS",
          currencySymbol: "TSh",
          stock: 5,
          business: "Gaming Zone Kenya",
          location: { lat: -1.2921, lng: 36.8219 },
          address: "Westlands, Nairobi",
          country: "Kenya",
          region: "Nairobi",
          city: "Nairobi",
          images: ["https://images.pexels.com/photos/4522994/pexels-photo-4522994.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Next-gen gaming console with ultra-high speed SSD",
          brand: "Sony",
          condition: "new",
          rating: 4.8,
          reviews: 25,
          type: "product"
        },
        {
          id: "elec-11",
          name: "Apple Watch Series 9",
          category: "Electronics & Devices",
          price: 650000,
          currency: "TZS",
          currencySymbol: "TSh",
          stock: 15,
          business: "Wearable Tech Tanzania",
          location: { lat: -6.8155, lng: 39.2861 },
          address: "Masaki, Dar es Salaam",
          country: "Tanzania",
          region: "Dar es Salaam",
          city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Advanced smartwatch with health monitoring features",
          brand: "Apple",
          condition: "new",
          rating: 4.6,
          reviews: 22,
          type: "product"
        },
        {
          id: "elec-12",
          name: "Dyson V11 Cordless Vacuum",
          category: "Electronics & Devices",
          price: 750000,
          currency: "TZS",
          currencySymbol: "TSh",
          stock: 8,
          business: "Home Appliances Uganda",
          location: { lat: 0.3476, lng: 32.5825 },
          address: "Kampala Road, Kampala",
          country: "Uganda",
          region: "Kampala",
          city: "Kampala",
          images: ["https://images.pexels.com/photos/4107269/pexels-photo-4107269.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Powerful cordless vacuum with intelligent cleaning",
          brand: "Dyson",
          condition: "new",
          rating: 4.7,
          reviews: 16,
          type: "product"
        },
        {
          id: "elec-13",
          name: "Bose SoundLink Speaker",
          category: "Electronics & Devices",
          price: 350000,
          currency: "TZS",
          currencySymbol: "TSh",
          stock: 20,
          business: "Audio Masters Kenya",
          location: { lat: -1.2921, lng: 36.8219 },
          address: "CBD, Nairobi",
          country: "Kenya",
          region: "Nairobi",
          city: "Nairobi",
          images: ["https://images.pexels.com/photos/1608279/pexels-photo-1608279.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Portable Bluetooth speaker with deep, loud sound",
          brand: "Bose",
          condition: "new",
          rating: 4.5,
          reviews: 30,
          type: "product"
        },
        {
          id: "elec-14",
          name: "LG UltraWide Monitor",
          category: "Electronics & Devices",
          price: 680000,
          currency: "TZS",
          currencySymbol: "TSh",
          stock: 6,
          business: "Office Tech Tanzania",
          location: { lat: -6.7924, lng: 39.2083 },
          address: "Samora Avenue, Dar es Salaam",
          country: "Tanzania",
          region: "Dar es Salaam",
          city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "34-inch curved ultrawide monitor for productivity",
          brand: "LG",
          condition: "new",
          rating: 4.4,
          reviews: 12,
          type: "product"
        },
        {
          id: "elec-15",
          name: "GoPro HERO12 Black",
          category: "Electronics & Devices",
          price: 550000,
          currency: "TZS",
          currencySymbol: "TSh",
          stock: 10,
          business: "Adventure Gear Kenya",
          location: { lat: -1.2921, lng: 36.8219 },
          address: "Westlands, Nairobi",
          country: "Kenya",
          region: "Nairobi",
          city: "Nairobi",
          images: ["https://images.pexels.com/photos/1637267/pexels-photo-1637267.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Action camera with 5.3K video and HyperSmooth stabilization",
          brand: "GoPro",
          condition: "new",
          rating: 4.6,
          reviews: 18,
          type: "product"
        },
        {
          id: "elec-16",
          name: "Microsoft Surface Pro 9",
          category: "Electronics & Devices",
          price: 1800000,
          currency: "TZS",
          currencySymbol: "TSh",
          stock: 4,
          business: "TechHub Tanzania",
          location: { lat: -6.7924, lng: 39.2083 },
          address: "Samora Avenue, Dar es Salaam",
          country: "Tanzania",
          region: "Dar es Salaam",
          city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/1334598/pexels-photo-1334598.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Versatile 2-in-1 laptop and tablet with Intel processors",
          brand: "Microsoft",
          condition: "new",
          rating: 4.5,
          reviews: 14,
          type: "product"
        },
        {
          id: "elec-17",
          name: "Nintendo Switch OLED",
          category: "Electronics & Devices",
          price: 850000,
          currency: "TZS",
          currencySymbol: "TSh",
          stock: 12,
          business: "Gaming Zone Uganda",
          location: { lat: 0.3476, lng: 32.5825 },
          address: "Kampala Road, Kampala",
          country: "Uganda",
          region: "Kampala",
          city: "Kampala",
          images: ["https://images.pexels.com/photos/1637436/pexels-photo-1637436.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Hybrid gaming console with vibrant OLED screen",
          brand: "Nintendo",
          condition: "new",
          rating: 4.7,
          reviews: 20,
          type: "product"
        },
        {
          id: "elec-18",
          name: "DJI Mini 3 Pro Drone",
          category: "Electronics & Devices",
          price: 1200000,
          currency: "TZS",
          currencySymbol: "TSh",
          stock: 5,
          business: "Camera World Kenya",
          location: { lat: -1.2921, lng: 36.8219 },
          address: "CBD, Nairobi",
          country: "Kenya",
          region: "Nairobi",
          city: "Nairobi",
          images: ["https://images.pexels.com/photos/380954/pexels-photo-380954.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Compact drone with 4K camera and obstacle sensing",
          brand: "DJI",
          condition: "new",
          rating: 4.8,
          reviews: 16,
          type: "product"
        },
        {
          id: "elec-19",
          name: "Kindle Paperwhite",
          category: "Electronics & Devices",
          price: 250000,
          currency: "TZS",
          currencySymbol: "TSh",
          stock: 25,
          business: "Book Store Tanzania",
          location: { lat: -6.8184, lng: 39.2883 },
          address: "Mlimani City, Dar es Salaam",
          country: "Tanzania",
          region: "Dar es Salaam",
          city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/590493/pexels-photo-590493.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Waterproof e-reader with built-in light",
          brand: "Amazon",
          condition: "new",
          rating: 4.6,
          reviews: 35,
          type: "product"
        },
        {
          id: "elec-20",
          name: "ASUS ROG Gaming Laptop",
          category: "Electronics & Devices",
          price: 2800000,
          currency: "TZS",
          currencySymbol: "TSh",
          stock: 3,
          business: "Gaming Zone Tanzania",
          location: { lat: -6.8155, lng: 39.2861 },
          address: "Masaki, Dar es Salaam",
          country: "Tanzania",
          region: "Dar es Salaam",
          city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/777001/pexels-photo-777001.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "High-performance gaming laptop with RTX 4070",
          brand: "ASUS",
          condition: "new",
          rating: 4.9,
          reviews: 8,
          type: "product"
        },
        {
          id: "elec-21",
          name: "JBL Flip 6 Speaker",
          category: "Electronics & Devices",
          price: 280000,
          currency: "TZS",
          currencySymbol: "TSh",
          stock: 18,
          business: "Audio Masters Uganda",
          location: { lat: 0.3476, lng: 32.5825 },
          address: "Kampala Road, Kampala",
          country: "Uganda",
          region: "Kampala",
          city: "Kampala",
          images: ["https://images.pexels.com/photos/1608279/pexels-photo-1608279.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Portable Bluetooth speaker with waterproof design",
          brand: "JBL",
          condition: "new",
          rating: 4.5,
          reviews: 24,
          type: "product"
        },
        {
          id: "elec-22",
          name: "Canon Pixma Printer",
          category: "Electronics & Devices",
          price: 320000,
          currency: "TZS",
          currencySymbol: "TSh",
          stock: 10,
          business: "Office Tech Kenya",
          location: { lat: -1.2921, lng: 36.8219 },
          address: "CBD, Nairobi",
          country: "Kenya",
          region: "Nairobi",
          city: "Nairobi",
          images: ["https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "All-in-one wireless color printer",
          brand: "Canon",
          condition: "new",
          rating: 4.3,
          reviews: 15,
          type: "product"
        },
        {
          id: "elec-23",
          name: "Samsung Galaxy Tab S9",
          category: "Electronics & Devices",
          price: 950000,
          currency: "TZS",
          currencySymbol: "TSh",
          stock: 8,
          business: "MobileWorld Tanzania",
          location: { lat: -6.8184, lng: 39.2883 },
          address: "Mlimani City Mall, Dar es Salaam",
          country: "Tanzania",
          region: "Dar es Salaam",
          city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Premium Android tablet with S Pen included",
          brand: "Samsung",
          condition: "new",
          rating: 4.6,
          reviews: 12,
          type: "product"
        },
        {
          id: "elec-24",
          name: "Logitech MX Master 3S",
          category: "Electronics & Devices",
          price: 180000,
          currency: "TZS",
          currencySymbol: "TSh",
          stock: 15,
          business: "Office Tech Tanzania",
          location: { lat: -6.7924, lng: 39.2083 },
          address: "Samora Avenue, Dar es Salaam",
          country: "Tanzania",
          region: "Dar es Salaam",
          city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Advanced wireless mouse for productivity",
          brand: "Logitech",
          condition: "new",
          rating: 4.7,
          reviews: 20,
          type: "product"
        },
        {
          id: "elec-25",
          name: "Razer BlackWidow Keyboard",
          category: "Electronics & Devices",
          price: 220000,
          currency: "TZS",
          currencySymbol: "TSh",
          stock: 12,
          business: "Gaming Zone Kenya",
          location: { lat: -1.2921, lng: 36.8219 },
          address: "Westlands, Nairobi",
          country: "Kenya",
          region: "Nairobi",
          city: "Nairobi",
          images: ["https://images.pexels.com/photos/2115257/pexels-photo-2115257.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Mechanical gaming keyboard with RGB lighting",
          brand: "Razer",
          condition: "new",
          rating: 4.6,
          reviews: 18,
          type: "product"
        },
        {
          id: "elec-26",
          name: "Apple AirPods Pro 2",
          category: "Electronics & Devices",
          price: 450000,
          currency: "TZS",
          currencySymbol: "TSh",
          stock: 20,
          business: "Apple Store Tanzania",
          location: { lat: -6.8155, lng: 39.2861 },
          address: "Masaki, Dar es Salaam",
          country: "Tanzania",
          region: "Dar es Salaam",
          city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/7154178/pexels-photo-7154178.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Wireless earbuds with active noise cancellation",
          brand: "Apple",
          condition: "new",
          rating: 4.8,
          reviews: 28,
          type: "product"
        },
        {
          id: "elec-27",
          name: "Xbox Series X",
          category: "Electronics & Devices",
          price: 1250000,
          currency: "TZS",
          currencySymbol: "TSh",
          stock: 6,
          business: "Gaming Zone Uganda",
          location: { lat: 0.3476, lng: 32.5825 },
          address: "Kampala Road, Kampala",
          country: "Uganda",
          region: "Kampala",
          city: "Kampala",
          images: ["https://images.pexels.com/photos/4522994/pexels-photo-4522994.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Next-gen gaming console with 4K gaming",
          brand: "Microsoft",
          condition: "new",
          rating: 4.7,
          reviews: 22,
          type: "product"
        },
        {
          id: "elec-28",
          name: "Fitbit Charge 6",
          category: "Electronics & Devices",
          price: 280000,
          currency: "TZS",
          currencySymbol: "TSh",
          stock: 25,
          business: "Wearable Tech Kenya",
          location: { lat: -1.2921, lng: 36.8219 },
          address: "CBD, Nairobi",
          country: "Kenya",
          region: "Nairobi",
          city: "Nairobi",
          images: ["https://images.pexels.com/photos/437034/pexels-photo-437034.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Advanced fitness tracker with GPS and heart rate monitor",
          brand: "Fitbit",
          condition: "new",
          rating: 4.5,
          reviews: 30,
          type: "product"
        },
        {
          id: "elec-29",
          name: "Lenovo ThinkPad X1",
          category: "Electronics & Devices",
          price: 1950000,
          currency: "TZS",
          currencySymbol: "TSh",
          stock: 4,
          business: "Business Tech Tanzania",
          location: { lat: -6.7924, lng: 39.2083 },
          address: "Samora Avenue, Dar es Salaam",
          country: "Tanzania",
          region: "Dar es Salaam",
          city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=300"],
          description: "Premium business laptop with security features",
          brand: "Lenovo",
          condition: "new",
          rating: 4.6,
          reviews: 14,
          type: "product"
        },
        {
          id: "elec-30",
          name: "Garmin Fenix 7",
          category: "Electronics & Devices",
          price: 850000,
          currency: "TZS",
          currencySymbol: "TSh",
          stock: 7,
          business: "Outdoor Gear Uganda",
          location: { lat: 0.3476, lng: 32.5825 },
          address: "Kampala Road, Kampala",
          country: "Uganda",
          region: "Kampala",
          city: "Kampala",
          images: ["https://images.pexels.com/photos/437034/pexels-photo-437034.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Multisport GPS smartwatch with mapping",
          brand: "Garmin",
          condition: "new",
          rating: 4.7,
          reviews: 16,
          type: "product"
        },
        {
          id: "elec-31",
          name: "Anker PowerCore Power Bank",
          category: "Electronics & Devices",
          price: 85000,
          currency: "TZS",
          currencySymbol: "TSh",
          stock: 50,
          business: "Mobile Accessories Kenya",
          location: { lat: -1.2921, lng: 36.8219 },
          address: "CBD, Nairobi",
          country: "Kenya",
          region: "Nairobi",
          city: "Nairobi",
          images: ["https://images.pexels.com/photos/12791080/pexels-photo-12791080.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "High-capacity portable charger for all devices",
          brand: "Anker",
          condition: "new",
          rating: 4.6,
          reviews: 45,
          type: "product"
        },
        {
          id: "elec-32",
          name: "Epson EcoTank Printer",
          category: "Electronics & Devices",
          price: 680000,
          currency: "TZS",
          currencySymbol: "TSh",
          stock: 8,
          business: "Office Tech Tanzania",
          location: { lat: -6.7924, lng: 39.2083 },
          address: "Samora Avenue, Dar es Salaam",
          country: "Tanzania",
          region: "Dar es Salaam",
          city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Ink tank printer with ultra-high page yield",
          brand: "Epson",
          condition: "new",
          rating: 4.5,
          reviews: 12,
          type: "product"
        }
      ];

      // General Goods - 30+ items
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
        },
        {
          id: "gen-2",
          name: "Designer Leather Handbag",
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
          description: "Luxury designer handbag made from genuine leather",
          brand: "StyleCraft",
          condition: "new",
          rating: 4.6,
          reviews: 8,
          type: "product"
        },
        {
          id: "gen-3",
          name: "Casual Summer Dress",
          category: "General Goods",
          price: 45000,
          currency: "TZS",
          currencySymbol: "TSh",
          stock: 20,
          business: "Fashion Trends Kenya",
          location: { lat: -1.2921, lng: 36.8219 },
          address: "Westlands, Nairobi",
          country: "Kenya",
          region: "Nairobi",
          city: "Nairobi",
          images: ["https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Lightweight floral print dress for summer",
          brand: "FashionTrend",
          condition: "new",
          rating: 4.4,
          reviews: 12,
          type: "product"
        },
        {
          id: "gen-4",
          name: "Men's Business Suit",
          category: "General Goods",
          price: 280000,
          currency: "TZS",
          currencySymbol: "TSh",
          stock: 6,
          business: "Executive Wear Uganda",
          location: { lat: 0.3476, lng: 32.5825 },
          address: "Kampala Road, Kampala",
          country: "Uganda",
          region: "Kampala",
          city: "Kampala",
          images: ["https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Premium wool blend business suit",
          brand: "ExecutiveStyle",
          condition: "new",
          rating: 4.7,
          reviews: 9,
          type: "product"
        },
        {
          id: "gen-5",
          name: "Women's Handbag",
          category: "General Goods",
          price: 95000,
          currency: "TZS",
          currencySymbol: "TSh",
          stock: 12,
          business: "Boutique Dar",
          location: { lat: -6.8155, lng: 39.2861 },
          address: "Masaki, Dar es Salaam",
          country: "Tanzania",
          region: "Dar es Salaam",
          city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Elegant women's handbag with multiple compartments",
          brand: "ChicStyle",
          condition: "new",
          rating: 4.5,
          reviews: 14,
          type: "product"
        },
        {
          id: "gen-6",
          name: "Running Shorts",
          category: "General Goods",
          price: 25000,
          currency: "TZS",
          currencySymbol: "TSh",
          stock: 30,
          business: "Sports Gear Kenya",
          location: { lat: -1.2921, lng: 36.8219 },
          address: "CBD, Nairobi",
          country: "Kenya",
          region: "Nairobi",
          city: "Nairobi",
          images: ["https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Lightweight running shorts with moisture-wicking fabric",
          brand: "RunPro",
          condition: "new",
          rating: 4.3,
          reviews: 18,
          type: "product"
        },
        {
          id: "gen-7",
          name: "Designer Sunglasses",
          category: "General Goods",
          price: 75000,
          currency: "TZS",
          currencySymbol: "TSh",
          stock: 15,
          business: "Optical World Tanzania",
          location: { lat: -6.8184, lng: 39.2883 },
          address: "Mlimani City Mall, Dar es Salaam",
          country: "Tanzania",
          region: "Dar es Salaam",
          city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/2064707/pexels-photo-2064707.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "UV protection sunglasses with polarized lenses",
          brand: "RayStyle",
          condition: "new",
          rating: 4.6,
          reviews: 11,
          type: "product"
        },
        {
          id: "gen-8",
          name: "Casual T-Shirt Pack",
          category: "General Goods",
          price: 35000,
          currency: "TZS",
          currencySymbol: "TSh",
          stock: 40,
          business: "Basic Wear Uganda",
          location: { lat: 0.3476, lng: 32.5825 },
          address: "Kampala Road, Kampala",
          country: "Uganda",
          region: "Kampala",
          city: "Kampala",
          images: ["https://images.pexels.com/photos/9558699/pexels-photo-9558699.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Pack of 3 basic cotton t-shirts in assorted colors",
          brand: "BasicWear",
          condition: "new",
          rating: 4.2,
          reviews: 25,
          type: "product"
        },
        {
          id: "gen-9",
          name: "Winter Jacket",
          category: "General Goods",
          price: 120000,
          currency: "TZS",
          currencySymbol: "TSh",
          stock: 8,
          business: "Outdoor Gear Kenya",
          location: { lat: -1.2921, lng: 36.8219 },
          address: "Westlands, Nairobi",
          country: "Kenya",
          region: "Nairobi",
          city: "Nairobi",
          images: ["https://images.pexels.com/photos/983497/pexels-photo-983497.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Warm insulated jacket for cold weather",
          brand: "MountainGear",
          condition: "new",
          rating: 4.5,
          reviews: 13,
          type: "product"
        },
        {
          id: "gen-10",
          name: "Formal Leather Shoes",
          category: "General Goods",
          price: 98000,
          currency: "TZS",
          currencySymbol: "TSh",
          stock: 10,
          business: "Executive Wear Tanzania",
          location: { lat: -6.7924, lng: 39.2083 },
          address: "Samora Avenue, Dar es Salaam",
          country: "Tanzania",
          region: "Dar es Salaam",
          city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/19090/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=300"],
          description: "Classic leather formal shoes for business",
          brand: "ExecutiveStyle",
          condition: "new",
          rating: 4.6,
          reviews: 16,
          type: "product"
        },
        {
          id: "gen-11",
          name: "Yoga Pants",
          category: "General Goods",
          price: 32000,
          currency: "TZS",
          currencySymbol: "TSh",
          stock: 25,
          business: "Active Wear Uganda",
          location: { lat: 0.3476, lng: 32.5825 },
          address: "Kampala Road, Kampala",
          country: "Uganda",
          region: "Kampala",
          city: "Kampala",
          images: ["https://images.pexels.com/photos/4499792/pexels-photo-4499792.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Stretchy yoga pants with high waist",
          brand: "ActiveFit",
          condition: "new",
          rating: 4.4,
          reviews: 20,
          type: "product"
        },
        {
          id: "gen-12",
          name: "Designer Watch",
          category: "General Goods",
          price: 180000,
          currency: "TZS",
          currencySymbol: "TSh",
          stock: 5,
          business: "Luxury Time Kenya",
          location: { lat: -1.2921, lng: 36.8219 },
          address: "CBD, Nairobi",
          country: "Kenya",
          region: "Nairobi",
          city: "Nairobi",
          images: ["https://images.pexels.com/photos/125779/pexels-photo-125779.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Luxury automatic watch with leather strap",
          brand: "TimeLux",
          condition: "new",
          rating: 4.8,
          reviews: 7,
          type: "product"
        },
        {
          id: "gen-13",
          name: "Backpack",
          category: "General Goods",
          price: 55000,
          currency: "TZS",
          currencySymbol: "TSh",
          stock: 18,
          business: "Urban Gear Tanzania",
          location: { lat: -6.8184, lng: 39.2883 },
          address: "Mlimani City, Dar es Salaam",
          country: "Tanzania",
          region: "Dar es Salaam",
          city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Durable backpack with laptop compartment",
          brand: "UrbanPack",
          condition: "new",
          rating: 4.5,
          reviews: 22,
          type: "product"
        },
        {
          id: "gen-14",
          name: "Casual Sneakers",
          category: "General Goods",
          price: 68000,
          currency: "TZS",
          currencySymbol: "TSh",
          stock: 22,
          business: "Footwear Kenya",
          location: { lat: -1.2921, lng: 36.8219 },
          address: "CBD, Nairobi",
          country: "Kenya",
          region: "Nairobi",
          city: "Nairobi",
          images: ["https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Comfortable casual sneakers for everyday wear",
          brand: "UrbanStep",
          condition: "new",
          rating: 4.4,
          reviews: 19,
          type: "product"
        },
        {
          id: "gen-15",
          name: "Silk Scarf",
          category: "General Goods",
          price: 35000,
          currency: "TZS",
          currencySymbol: "TSh",
          stock: 15,
          business: "Fashion Accessories Uganda",
          location: { lat: 0.3476, lng: 32.5825 },
          address: "Kampala Road, Kampala",
          country: "Uganda",
          region: "Kampala",
          city: "Kampala",
          images: ["https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Elegant silk scarf with floral pattern",
          brand: "SilkElegance",
          condition: "new",
          rating: 4.3,
          reviews: 11,
          type: "product"
        },
        {
          id: "gen-16",
          name: "Men's Wallet",
          category: "General Goods",
          price: 28000,
          currency: "TZS",
          currencySymbol: "TSh",
          stock: 30,
          business: "Leather Goods Tanzania",
          location: { lat: -6.7924, lng: 39.2083 },
          address: "Samora Avenue, Dar es Salaam",
          country: "Tanzania",
          region: "Dar es Salaam",
          city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Genuine leather wallet with multiple card slots",
          brand: "LeatherCraft",
          condition: "new",
          rating: 4.4,
          reviews: 17,
          type: "product"
        },
        {
          id: "gen-17",
          name: "Women's Heels",
          category: "General Goods",
          price: 75000,
          currency: "TZS",
          currencySymbol: "TSh",
          stock: 12,
          business: "Shoe Palace Kenya",
          location: { lat: -1.2921, lng: 36.8219 },
          address: "Westlands, Nairobi",
          country: "Kenya",
          region: "Nairobi",
          city: "Nairobi",
          images: ["https://images.pexels.com/photos/267301/pexels-photo-267301.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Elegant high heels for formal occasions",
          brand: "HeelElegance",
          condition: "new",
          rating: 4.5,
          reviews: 14,
          type: "product"
        },
        {
          id: "gen-18",
          name: "Sports Cap",
          category: "General Goods",
          price: 15000,
          currency: "TZS",
          currencySymbol: "TSh",
          stock: 40,
          business: "Sports Gear Uganda",
          location: { lat: 0.3476, lng: 32.5825 },
          address: "Kampala Road, Kampala",
          country: "Uganda",
          region: "Kampala",
          city: "Kampala",
          images: ["https://images.pexels.com/photos/1087727/pexels-photo-1087727.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Adjustable sports cap with UV protection",
          brand: "SportCap",
          condition: "new",
          rating: 4.2,
          reviews: 23,
          type: "product"
        },
        {
          id: "gen-19",
          name: "Designer Belt",
          category: "General Goods",
          price: 45000,
          currency: "TZS",
          currencySymbol: "TSh",
          stock: 18,
          business: "Fashion House Tanzania",
          location: { lat: -6.8155, lng: 39.2861 },
          address: "Masaki, Dar es Salaam",
          country: "Tanzania",
          region: "Dar es Salaam",
          city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Genuine leather belt with designer buckle",
          brand: "StyleCraft",
          condition: "new",
          rating: 4.6,
          reviews: 13,
          type: "product"
        },
        {
          id: "gen-20",
          name: "Swimwear Set",
          category: "General Goods",
          price: 38000,
          currency: "TZS",
          currencySymbol: "TSh",
          stock: 25,
          business: "Beach Wear Kenya",
          location: { lat: -1.2921, lng: 36.8219 },
          address: "CBD, Nairobi",
          country: "Kenya",
          region: "Nairobi",
          city: "Nairobi",
          images: ["https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Two-piece swimwear set in various patterns",
          brand: "BeachStyle",
          condition: "new",
          rating: 4.3,
          reviews: 16,
          type: "product"
        },
        {
          id: "gen-21",
          name: "Winter Gloves",
          category: "General Goods",
          price: 22000,
          currency: "TZS",
          currencySymbol: "TSh",
          stock: 35,
          business: "Outdoor Gear Tanzania",
          location: { lat: -6.7924, lng: 39.2083 },
          address: "Samora Avenue, Dar es Salaam",
          country: "Tanzania",
          region: "Dar es Salaam",
          city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/1087727/pexels-photo-1087727.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Warm insulated gloves for cold weather",
          brand: "WinterComfort",
          condition: "new",
          rating: 4.4,
          reviews: 19,
          type: "product"
        },
        {
          id: "gen-22",
          name: "Evening Gown",
          category: "General Goods",
          price: 185000,
          currency: "TZS",
          currencySymbol: "TSh",
          stock: 4,
          business: "Boutique Dar",
          location: { lat: -6.8155, lng: 39.2861 },
          address: "Masaki, Dar es Salaam",
          country: "Tanzania",
          region: "Dar es Salaam",
          city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Elegant evening gown for special occasions",
          brand: "GownElegance",
          condition: "new",
          rating: 4.7,
          reviews: 6,
          type: "product"
        },
        {
          id: "gen-23",
          name: "Athletic Socks Pack",
          category: "General Goods",
          price: 18000,
          currency: "TZS",
          currencySymbol: "TSh",
          stock: 50,
          business: "Sports Gear Uganda",
          location: { lat: 0.3476, lng: 32.5825 },
          address: "Kampala Road, Kampala",
          country: "Uganda",
          region: "Kampala",
          city: "Kampala",
          images: ["https://images.pexels.com/photos/9558699/pexels-photo-9558699.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Pack of 6 athletic socks with cushioning",
          brand: "SportSock",
          condition: "new",
          rating: 4.3,
          reviews: 28,
          type: "product"
        },
        {
          id: "gen-24",
          name: "Designer Perfume",
          category: "General Goods",
          price: 95000,
          currency: "TZS",
          currencySymbol: "TSh",
          stock: 12,
          business: "Fragrance World Kenya",
          location: { lat: -1.2921, lng: 36.8219 },
          address: "Westlands, Nairobi",
          country: "Kenya",
          region: "Nairobi",
          city: "Nairobi",
          images: ["https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Luxury designer perfume with long-lasting scent",
          brand: "ScentLuxury",
          condition: "new",
          rating: 4.6,
          reviews: 15,
          type: "product"
        },
        {
          id: "gen-25",
          name: "Casual Blazer",
          category: "General Goods",
          price: 125000,
          currency: "TZS",
          currencySymbol: "TSh",
          stock: 8,
          business: "Fashion Trends Tanzania",
          location: { lat: -6.8184, lng: 39.2883 },
          address: "Mlimani City, Dar es Salaam",
          country: "Tanzania",
          region: "Dar es Salaam",
          city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Modern casual blazer for smart casual wear",
          brand: "BlazerStyle",
          condition: "new",
          rating: 4.5,
          reviews: 11,
          type: "product"
        },
        {
          id: "gen-26",
          name: "Yoga Mat",
          category: "General Goods",
          price: 35000,
          currency: "TZS",
          currencySymbol: "TSh",
          stock: 20,
          business: "Fitness Gear Kenya",
          location: { lat: -1.2921, lng: 36.8219 },
          address: "CBD, Nairobi",
          country: "Kenya",
          region: "Nairobi",
          city: "Nairobi",
          images: ["https://images.pexels.com/photos/4499792/pexels-photo-4499792.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Non-slip yoga mat with carrying strap",
          brand: "YogaEssentials",
          condition: "new",
          rating: 4.4,
          reviews: 17,
          type: "product"
        },
        {
          id: "gen-27",
          name: "Designer Jewelry Set",
          category: "General Goods",
          price: 150000,
          currency: "TZS",
          currencySymbol: "TSh",
          stock: 6,
          business: "Luxury Accessories Uganda",
          location: { lat: 0.3476, lng: 32.5825 },
          address: "Kampala Road, Kampala",
          country: "Uganda",
          region: "Kampala",
          city: "Kampala",
          images: ["https://images.pexels.com/photos/125779/pexels-photo-125779.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Elegant necklace and earrings set",
          brand: "JewelLux",
          condition: "new",
          rating: 4.7,
          reviews: 8,
          type: "product"
        },
        {
          id: "gen-28",
          name: "Men's Casual Shirt",
          category: "General Goods",
          price: 42000,
          currency: "TZS",
          currencySymbol: "TSh",
          stock: 25,
          business: "Casual Wear Tanzania",
          location: { lat: -6.7924, lng: 39.2083 },
          address: "Samora Avenue, Dar es Salaam",
          country: "Tanzania",
          region: "Dar es Salaam",
          city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/9558699/pexels-photo-9558699.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Comfortable casual shirt in various colors",
          brand: "CasualComfort",
          condition: "new",
          rating: 4.3,
          reviews: 21,
          type: "product"
        },
        {
          id: "gen-29",
          name: "Women's Handbag",
          category: "General Goods",
          price: 68000,
          currency: "TZS",
          currencySymbol: "TSh",
          stock: 15,
          business: "Boutique Kenya",
          location: { lat: -1.2921, lng: 36.8219 },
          address: "Westlands, Nairobi",
          country: "Kenya",
          region: "Nairobi",
          city: "Nairobi",
          images: ["https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Trendy crossbody handbag with adjustable strap",
          brand: "TrendyBag",
          condition: "new",
          rating: 4.5,
          reviews: 18,
          type: "product"
        },
        {
          id: "gen-30",
          name: "Sports Water Bottle",
          category: "General Goods",
          price: 12000,
          currency: "TZS",
          currencySymbol: "TSh",
          stock: 60,
          business: "Fitness Gear Uganda",
          location: { lat: 0.3476, lng: 32.5825 },
          address: "Kampala Road, Kampala",
          country: "Uganda",
          region: "Kampala",
          city: "Kampala",
          images: ["https://images.pexels.com/photos/12791080/pexels-photo-12791080.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "BPA-free sports water bottle with carrying loop",
          brand: "HydratePro",
          condition: "new",
          rating: 4.2,
          reviews: 32,
          type: "product"
        },
        {
          id: "gen-31",
          name: "Designer Scarf",
          category: "General Goods",
          price: 28000,
          currency: "TZS",
          currencySymbol: "TSh",
          stock: 20,
          business: "Fashion Accessories Tanzania",
          location: { lat: -6.8155, lng: 39.2861 },
          address: "Masaki, Dar es Salaam",
          country: "Tanzania",
          region: "Dar es Salaam",
          city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Soft cashmere scarf in various colors",
          brand: "ScarfElegance",
          condition: "new",
          rating: 4.4,
          reviews: 14,
          type: "product"
        },
        {
          id: "gen-32",
          name: "Men's Watch",
          category: "General Goods",
          price: 85000,
          currency: "TZS",
          currencySymbol: "TSh",
          stock: 10,
          business: "Timepieces Kenya",
          location: { lat: -1.2921, lng: 36.8219 },
          address: "CBD, Nairobi",
          country: "Kenya",
          region: "Nairobi",
          city: "Nairobi",
          images: ["https://images.pexels.com/photos/125779/pexels-photo-125779.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Classic men's watch with leather strap",
          brand: "TimeClassic",
          condition: "new",
          rating: 4.5,
          reviews: 16,
          type: "product"
        }
      ];

      // Building & Hotels - 30+ items
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
          description: "Modern luxury apartments with business facilities",
          rating: "4",
          type: "service"
        },
        {
          id: "hotel-3",
          name: "Nairobi Safari Hotel",
          category: "Building & Hotels",
          serviceType: "4-Star Hotel",
          priceRange: "120-250",
          currency: "USD",
          currencySymbol: "$",
          business: "Kenya Hospitality Group",
          location: { lat: -1.2921, lng: 36.8219 },
          address: "CBD, Nairobi",
          country: "Kenya",
          region: "Nairobi",
          city: "Nairobi",
          images: ["https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Comfortable hotel with safari-themed decor",
          rating: "4",
          type: "service"
        },
        {
          id: "hotel-4",
          name: "Kampala Executive Apartments",
          category: "Building & Hotels",
          serviceType: "Serviced Apartments",
          priceRange: "65,000-120,000",
          currency: "TZS",
          currencySymbol: "TSh",
          business: "Uganda Properties Ltd",
          location: { lat: 0.3476, lng: 32.5825 },
          address: "Kampala Road, Kampala",
          country: "Uganda",
          region: "Kampala",
          city: "Kampala",
          images: ["https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Fully serviced apartments in central Kampala",
          rating: "4",
          type: "service"
        },
        {
          id: "hotel-5",
          name: "Zanzibar Beach Resort",
          category: "Building & Hotels",
          serviceType: "Beach Resort",
          priceRange: "200-450",
          currency: "USD",
          currencySymbol: "$",
          business: "Zanzibar Resorts Ltd",
          location: { lat: -6.1659, lng: 39.1986 },
          address: "Nungwi Beach, Zanzibar",
          country: "Tanzania",
          region: "Zanzibar",
          city: "Zanzibar",
          images: ["https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Luxury beachfront resort with private beach access",
          rating: "5",
          type: "service"
        },
        {
          id: "hotel-6",
          name: "Arusha Safari Lodge",
          category: "Building & Hotels",
          serviceType: "Safari Lodge",
          priceRange: "180-350",
          currency: "USD",
          currencySymbol: "$",
          business: "Tanzania Safari Lodges",
          location: { lat: -3.3869, lng: 36.6821 },
          address: "Arusha, Tanzania",
          country: "Tanzania",
          region: "Arusha",
          city: "Arusha",
          images: ["https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Authentic safari lodge near Serengeti National Park",
          rating: "4",
          type: "service"
        },
        {
          id: "hotel-7",
          name: "Mombasa Beach Hotel",
          category: "Building & Hotels",
          serviceType: "Beach Hotel",
          priceRange: "90-180",
          currency: "USD",
          currencySymbol: "$",
          business: "Coastal Hotels Kenya",
          location: { lat: -4.0435, lng: 39.6682 },
          address: "Nyali Beach, Mombasa",
          country: "Kenya",
          region: "Mombasa",
          city: "Mombasa",
          images: ["https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Beachfront hotel with ocean views and water sports",
          rating: "4",
          type: "service"
        },
        {
          id: "hotel-8",
          name: "Executive Office Space",
          category: "Building & Hotels",
          serviceType: "Office Rental",
          priceRange: "500,000-1,200,000",
          currency: "TZS",
          currencySymbol: "TSh",
          business: "Prime Office Spaces",
          location: { lat: -6.8155, lng: 39.2861 },
          address: "Masaki, Dar es Salaam",
          country: "Tanzania",
          region: "Dar es Salaam",
          city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Premium office spaces with modern amenities",
          rating: "4",
          type: "service"
        },
        {
          id: "hotel-9",
          name: "Lake Victoria Resort",
          category: "Building & Hotels",
          serviceType: "Lakeside Resort",
          priceRange: "75-150",
          currency: "USD",
          currencySymbol: "$",
          business: "Uganda Resorts Ltd",
          location: { lat: 0.3476, lng: 32.5825 },
          address: "Entebbe, Uganda",
          country: "Uganda",
          region: "Entebbe",
          city: "Entebbe",
          images: ["https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Peaceful resort on the shores of Lake Victoria",
          rating: "4",
          type: "service"
        },
        {
          id: "hotel-10",
          name: "Nairobi Business Hotel",
          category: "Building & Hotels",
          serviceType: "Business Hotel",
          priceRange: "100-220",
          currency: "USD",
          currencySymbol: "$",
          business: "City Hotels Kenya",
          location: { lat: -1.2921, lng: 36.8219 },
          address: "Westlands, Nairobi",
          country: "Kenya",
          region: "Nairobi",
          city: "Nairobi",
          images: ["https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Modern hotel designed for business travelers",
          rating: "4",
          type: "service"
        },
        {
          id: "hotel-11",
          name: "Dar es Salaam Serviced Apartments",
          category: "Building & Hotels",
          serviceType: "Serviced Apartments",
          priceRange: "85,000-160,000",
          currency: "TZS",
          currencySymbol: "TSh",
          business: "City Living Tanzania",
          location: { lat: -6.8184, lng: 39.2883 },
          address: "Mlimani City, Dar es Salaam",
          country: "Tanzania",
          region: "Dar es Salaam",
          city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Fully furnished apartments with daily housekeeping",
          rating: "4",
          type: "service"
        },
        {
          id: "hotel-12",
          name: "Mountain View Hotel",
          category: "Building & Hotels",
          serviceType: "Boutique Hotel",
          priceRange: "110-240",
          currency: "USD",
          currencySymbol: "$",
          business: "Mountain Hotels Ltd",
          location: { lat: -3.3869, lng: 36.6821 },
          address: "Arusha, Tanzania",
          country: "Tanzania",
          region: "Arusha",
          city: "Arusha",
          images: ["https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Boutique hotel with stunning mountain views",
          rating: "4",
          type: "service"
        },
        {
          id: "hotel-13",
          name: "Kampala City Hotel",
          category: "Building & Hotels",
          serviceType: "City Hotel",
          priceRange: "70-140",
          currency: "USD",
          currencySymbol: "$",
          business: "Capital Hotels Uganda",
          location: { lat: 0.3476, lng: 32.5825 },
          address: "Kampala Road, Kampala",
          country: "Uganda",
          region: "Kampala",
          city: "Kampala",
          images: ["https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Comfortable hotel in the heart of Kampala",
          rating: "3",
          type: "service"
        },
        {
          id: "hotel-14",
          name: "Beachfront Villa Rental",
          category: "Building & Hotels",
          serviceType: "Villa Rental",
          priceRange: "300-600",
          currency: "USD",
          currencySymbol: "$",
          business: "Luxury Villas Zanzibar",
          location: { lat: -6.1659, lng: 39.1986 },
          address: "Kendwa Beach, Zanzibar",
          country: "Tanzania",
          region: "Zanzibar",
          city: "Zanzibar",
          images: ["https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Private beachfront villa with personal staff",
          rating: "5",
          type: "service"
        },
        {
          id: "hotel-15",
          name: "Nairobi Conference Center",
          category: "Building & Hotels",
          serviceType: "Conference Facility",
          priceRange: "150,000-500,000",
          currency: "TZS",
          currencySymbol: "TSh",
          business: "Event Spaces Kenya",
          location: { lat: -1.2921, lng: 36.8219 },
          address: "CBD, Nairobi",
          country: "Kenya",
          region: "Nairobi",
          city: "Nairobi",
          images: ["https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Modern conference center with audio-visual equipment",
          rating: "4",
          type: "service"
        },
        {
          id: "hotel-16",
          name: "Dar es Salaam Business Center",
          category: "Building & Hotels",
          serviceType: "Co-working Space",
          priceRange: "50,000-120,000",
          currency: "TZS",
          currencySymbol: "TSh",
          business: "WorkHub Tanzania",
          location: { lat: -6.7924, lng: 39.2083 },
          address: "Samora Avenue, Dar es Salaam",
          country: "Tanzania",
          region: "Dar es Salaam",
          city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Modern co-working space with high-speed internet",
          rating: "4",
          type: "service"
        },
        {
          id: "hotel-17",
          name: "Safari Camp Tented Lodge",
          category: "Building & Hotels",
          serviceType: "Tented Camp",
          priceRange: "200-400",
          currency: "USD",
          currencySymbol: "$",
          business: "Wilderness Camps Tanzania",
          location: { lat: -2.3333, lng: 34.8333 },
          address: "Serengeti National Park",
          country: "Tanzania",
          region: "Mara",
          city: "Serengeti",
          images: ["https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Luxury tented camp in the heart of Serengeti",
          rating: "5",
          type: "service"
        },
        {
          id: "hotel-18",
          name: "Kampala Serviced Offices",
          category: "Building & Hotels",
          serviceType: "Office Rental",
          priceRange: "300,000-800,000",
          currency: "TZS",
          currencySymbol: "TSh",
          business: "Business Centers Uganda",
          location: { lat: 0.3476, lng: 32.5825 },
          address: "Kampala Road, Kampala",
          country: "Uganda",
          region: "Kampala",
          city: "Kampala",
          images: ["https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Fully serviced office spaces with meeting rooms",
          rating: "4",
          type: "service"
        },
        {
          id: "hotel-19",
          name: "Mombasa Business Hotel",
          category: "Building & Hotels",
          serviceType: "Business Hotel",
          priceRange: "80-160",
          currency: "USD",
          currencySymbol: "$",
          business: "Coastal Business Hotels",
          location: { lat: -4.0435, lng: 39.6682 },
          address: "Mombasa Island, Mombasa",
          country: "Kenya",
          region: "Mombasa",
          city: "Mombasa",
          images: ["https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Hotel designed for corporate travelers in Mombasa",
          rating: "4",
          type: "service"
        },
        {
          id: "hotel-20",
          name: "Arusha Conference Hotel",
          category: "Building & Hotels",
          serviceType: "Conference Hotel",
          priceRange: "100-220",
          currency: "USD",
          currencySymbol: "$",
          business: "Arusha Hospitality Group",
          location: { lat: -3.3869, lng: 36.6821 },
          address: "Arusha, Tanzania",
          country: "Tanzania",
          region: "Arusha",
          city: "Arusha",
          images: ["https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Hotel with extensive conference facilities",
          rating: "4",
          type: "service"
        },
        {
          id: "hotel-21",
          name: "Lake Naivasha Resort",
          category: "Building & Hotels",
          serviceType: "Lakeside Resort",
          priceRange: "95-190",
          currency: "USD",
          currencySymbol: "$",
          business: "Rift Valley Resorts",
          location: { lat: -0.7167, lng: 36.4333 },
          address: "Lake Naivasha, Kenya",
          country: "Kenya",
          region: "Nakuru",
          city: "Naivasha",
          images: ["https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Beautiful resort on the shores of Lake Naivasha",
          rating: "4",
          type: "service"
        },
        {
          id: "hotel-22",
          name: "Dar es Salaam Luxury Apartments",
          category: "Building & Hotels",
          serviceType: "Luxury Apartments",
          priceRange: "120,000-250,000",
          currency: "TZS",
          currencySymbol: "TSh",
          business: "Elite Living Tanzania",
          location: { lat: -6.8155, lng: 39.2861 },
          address: "Masaki, Dar es Salaam",
          country: "Tanzania",
          region: "Dar es Salaam",
          city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Premium apartments with sea views and amenities",
          rating: "5",
          type: "service"
        },
        {
          id: "hotel-23",
          name: "Nairobi Airport Hotel",
          category: "Building & Hotels",
          serviceType: "Airport Hotel",
          priceRange: "85-170",
          currency: "USD",
          currencySymbol: "$",
          business: "Airport Hotels Kenya",
          location: { lat: -1.3191, lng: 36.9277 },
          address: "JKIA, Nairobi",
          country: "Kenya",
          region: "Nairobi",
          city: "Nairobi",
          images: ["https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Convenient hotel near Jomo Kenyatta International Airport",
          rating: "3",
          type: "service"
        },
        {
          id: "hotel-24",
          name: "Kampala Boutique Hotel",
          category: "Building & Hotels",
          serviceType: "Boutique Hotel",
          priceRange: "90-180",
          currency: "USD",
          currencySymbol: "$",
          business: "Boutique Hotels Uganda",
          location: { lat: 0.3476, lng: 32.5825 },
          address: "Kololo, Kampala",
          country: "Uganda",
          region: "Kampala",
          city: "Kampala",
          images: ["https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Intimate boutique hotel with personalized service",
          rating: "4",
          type: "service"
        },
        {
          id: "hotel-25",
          name: "Zanzibar Stone Town Hotel",
          category: "Building & Hotels",
          serviceType: "Historic Hotel",
          priceRange: "110-230",
          currency: "USD",
          currencySymbol: "$",
          business: "Stone Town Hospitality",
          location: { lat: -6.1659, lng: 39.1986 },
          address: "Stone Town, Zanzibar",
          country: "Tanzania",
          region: "Zanzibar",
          city: "Zanzibar",
          images: ["https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Historic hotel in the heart of Stone Town",
          rating: "4",
          type: "service"
        },
        {
          id: "hotel-26",
          name: "Nairobi Serviced Apartments",
          category: "Building & Hotels",
          serviceType: "Serviced Apartments",
          priceRange: "95,000-180,000",
          currency: "TZS",
          currencySymbol: "TSh",
          business: "Nairobi Apartments Ltd",
          location: { lat: -1.2921, lng: 36.8219 },
          address: "Westlands, Nairobi",
          country: "Kenya",
          region: "Nairobi",
          city: "Nairobi",
          images: ["https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Modern serviced apartments in upscale neighborhood",
          rating: "4",
          type: "service"
        },
        {
          id: "hotel-27",
          name: "Dar es Salaam Conference Center",
          category: "Building & Hotels",
          serviceType: "Conference Facility",
          priceRange: "200,000-600,000",
          currency: "TZS",
          currencySymbol: "TSh",
          business: "Dar Events Center",
          location: { lat: -6.8184, lng: 39.2883 },
          address: "Mlimani City, Dar es Salaam",
          country: "Tanzania",
          region: "Dar es Salaam",
          city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "State-of-the-art conference and event facility",
          rating: "4",
          type: "service"
        },
        {
          id: "hotel-28",
          name: "Mombasa Beach Resort",
          category: "Building & Hotels",
          serviceType: "All-Inclusive Resort",
          priceRange: "150-300",
          currency: "USD",
          currencySymbol: "$",
          business: "All-Inclusive Resorts Kenya",
          location: { lat: -4.0435, lng: 39.6682 },
          address: "Diani Beach, Mombasa",
          country: "Kenya",
          region: "Mombasa",
          city: "Mombasa",
          images: ["https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "All-inclusive beach resort with multiple restaurants",
          rating: "4",
          type: "service"
        },
        {
          id: "hotel-29",
          name: "Kampala Executive Suites",
          category: "Building & Hotels",
          serviceType: "Executive Suites",
          priceRange: "100,000-200,000",
          currency: "TZS",
          currencySymbol: "TSh",
          business: "Executive Living Uganda",
          location: { lat: 0.3476, lng: 32.5825 },
          address: "Kampala Road, Kampala",
          country: "Uganda",
          region: "Kampala",
          city: "Kampala",
          images: ["https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Luxury executive suites with premium amenities",
          rating: "5",
          type: "service"
        },
        {
          id: "hotel-30",
          name: "Arusha Safari Hotel",
          category: "Building & Hotels",
          serviceType: "Safari Hotel",
          priceRange: "120-250",
          currency: "USD",
          currencySymbol: "$",
          business: "Safari Hotels Tanzania",
          location: { lat: -3.3869, lng: 36.6821 },
          address: "Arusha, Tanzania",
          country: "Tanzania",
          region: "Arusha",
          city: "Arusha",
          images: ["https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Comfortable hotel perfect for safari adventures",
          rating: "4",
          type: "service"
        },
        {
          id: "hotel-31",
          name: "Nairobi Co-working Space",
          category: "Building & Hotels",
          serviceType: "Co-working Space",
          priceRange: "40,000-100,000",
          currency: "TZS",
          currencySymbol: "TSh",
          business: "Innovation Hub Kenya",
          location: { lat: -1.2921, lng: 36.8219 },
          address: "CBD, Nairobi",
          country: "Kenya",
          region: "Nairobi",
          city: "Nairobi",
          images: ["https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Creative co-working space for entrepreneurs",
          rating: "4",
          type: "service"
        },
        {
          id: "hotel-32",
          name: "Dar es Salaam Beach Hotel",
          category: "Building & Hotels",
          serviceType: "Beach Hotel",
          priceRange: "130-280",
          currency: "USD",
          currencySymbol: "$",
          business: "Coastal Hotels Tanzania",
          location: { lat: -6.8155, lng: 39.2861 },
          address: "Masaki, Dar es Salaam",
          country: "Tanzania",
          region: "Dar es Salaam",
          city: "Dar es Salaam",
          images: ["https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=300"],
          description: "Modern beach hotel with oceanfront rooms",
          rating: "4",
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
          // Set default location (Dar es Salaam)
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

    // Search through all items
    allItems.forEach(item => {
      if (item.name.toLowerCase().includes(queryLower)) {
        suggestions.add(item.name);
      }
      if (item.category.toLowerCase().includes(queryLower)) {
        suggestions.add(item.category);
      }
      if (item.brand && item.brand.toLowerCase().includes(queryLower)) {
        suggestions.add(item.brand);
      }
      if (item.businessName && item.businessName.toLowerCase().includes(queryLower)) {
        suggestions.add(item.businessName);
      }
      if (item.serviceType && item.serviceType.toLowerCase().includes(queryLower)) {
        suggestions.add(item.serviceType);
      }
    });

    // Common searches
    const commonSearches = ["laptop", "phone", "hotel", "shoes", "apartment", "restaurant"];
    commonSearches.forEach(search => {
      if (search.includes(queryLower) || queryLower.includes(search)) {
        suggestions.add(search.charAt(0).toUpperCase() + search.slice(1));
      }
    });

    return Array.from(suggestions).slice(0, 8);
  }, [allItems, recentSearches]);

  // Handle search input change with debouncing
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
    handleSearch(suggestion);
  };

  // Perform search with filters
  const handleSearch = useCallback((query = searchQuery) => {
    if (!query.trim() && getActiveFiltersCount() === 0) {
      setSearchResults(allItems);
      setHasSearched(false);
      return;
    }

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
      saveToRecentSearches(query);
    }

    // Apply filters
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
        if (item.type === 'service') return true; // Skip price filter for services
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

    // Reset dependent filters
    if (key === 'country') {
      newFilters.region = "";
      newFilters.city = "";
    } else if (key === 'region') {
      newFilters.city = "";
    }

    setFilters(newFilters);
    
    // Apply filters immediately
    if (hasSearched || searchQuery.trim() !== "") {
      handleSearch();
    }
  };

  // Handle category selection
  const handleCategorySelect = (category) => {
    const newFilters = { ...filters, category };
    setFilters(newFilters);
    
    if (category) {
      setHasSearched(true);
      handleSearch();
    } else {
      // If "All" is selected, show all items
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
    setSearchResults(allItems);
    setHasSearched(false);
    setShowSuggestions(false);
    navigate('/search'); // Clear URL parameters
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
      case 'Electronics & Devices': return 'fa-microchip';
      case 'General Goods': return 'fa-tshirt';
      case 'Building & Hotels': return 'fa-building';
      default: return 'fa-box';
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
                    className="btn btn-outline-warning w-100 py-3"
                    onClick={() => handleSuggestionClick("Shoes")}
                  >
                    <i className="fas fa-tshirt fa-2x mb-2"></i>
                    <div>Fashion</div>
                  </button>
                </div>
                <div className="col-4 mb-3">
                  <button 
                    className="btn btn-outline-success w-100 py-3"
                    onClick={() => handleSuggestionClick("Hotel")}
                  >
                    <i className="fas fa-building fa-2x mb-2"></i>
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

  // Main Component Render
  return (
    <div className="min-vh-100" style={{ background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)" }}>
      {/* Fixed Top Header */}
      <div className="fixed-top bg-white border-bottom" style={{ zIndex: 1030 }}>
        <div className="container-fluid p-3">
          <div className="row align-items-center">
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
            
            {/* Account Icon */}
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

      {/* Main Content */}
      <div className="container-fluid" style={{ paddingTop: '100px', paddingBottom: '80px' }}>
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
                </h6>
                {(getActiveFiltersCount() > 0 || searchQuery.trim() !== "") && (
                  <button
                    className="btn btn-sm btn-outline-dark rounded-pill"
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
                          height: '150px', 
                          objectFit: 'cover',
                          width: '100%'
                        }}
                        onError={(e) => {
                          e.target.src = 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=300';
                        }}
                      />
                      
                      {/* Category Badge */}
                      <div className="position-absolute top-0 start-0 m-1">
                        <span className="badge custom-primary-bg text-white px-2 py-1 rounded-pill" style={{ fontSize: '0.6rem' }}>
                          <i className={`fas ${getCategoryIcon(item.category)} me-1`} style={{ fontSize: '0.5rem' }}></i>
                          <small>{item.category === 'Building & Hotels' ? 'Hotel' : item.category.split(' ')[0]}</small>
                        </span>
                      </div>

                      {/* Price Tag */}
                      <div className="position-absolute top-0 end-0 m-1">
                        <span className="badge bg-dark text-white px-2 py-1 rounded-pill" style={{ fontSize: '0.6rem' }}>
                          <small className="fw-bold">{formatPrice(item)}</small>
                        </span>
                      </div>

                      {/* Stock Status */}
                      {item.type === 'product' && (
                        <div className="position-absolute bottom-0 start-0 m-1">
                          <span className={`badge ${item.stock > 0 ? 'bg-success' : 'bg-danger'} px-2 py-1 rounded-pill`} style={{ fontSize: '0.6rem' }}>
                            <small>{item.stock > 0 ? 'In Stock' : 'Out'}</small>
                          </span>
                        </div>
                      )}

                      {/* Rating Badge */}
                      <div className="position-absolute bottom-0 end-0 m-1">
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

                      {/* Location */}
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <small className="text-muted" style={{ fontSize: '0.6rem' }}>
                          <i className="fas fa-map-marker-alt text-danger me-1"></i>
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
                          className="btn btn-outline-dark rounded-pill py-1 px-2"
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
                      <i className="fas fa-dollar-sign me-2 text-success"></i>
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

      {/* Bottom Navigation Bar */}
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
          border: 1px solid #e9ecef;
        }
        .product-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.1) !important;
        }
        .badge {
          font-weight: 600;
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
            font-size: 0.65rem;
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