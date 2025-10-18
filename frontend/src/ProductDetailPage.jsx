// src/ProductDetailPage.jsx - WITH HEADER LIKE HOMEPAGE1 AND SEARCH
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

function ProductDetailPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [relatedItems, setRelatedItems] = useState([]);
  const [activeTab, setActiveTab] = useState("details");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [dataLastUpdated, setDataLastUpdated] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

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

  // Countries and Currencies
  const countries = [
    { code: "TZ", name: "Tanzania", currency: "TZS", currencySymbol: "TSh", flag: "🇹🇿" },
    { code: "KE", name: "Kenya", currency: "KES", currencySymbol: "KSh", flag: "🇰🇪" },
    { code: "UG", name: "Uganda", currency: "UGX", currencySymbol: "USh", flag: "🇺🇬" },
    { code: "US", name: "United States", currency: "USD", currencySymbol: "$", flag: "🇺🇸" },
    { code: "GB", name: "United Kingdom", currency: "GBP", currencySymbol: "£", flag: "🇬🇧" },
    { code: "EU", name: "European Union", currency: "EUR", currencySymbol: "€", flag: "🇪🇺" },
    { code: "CN", name: "China", currency: "CNY", currencySymbol: "¥", flag: "🇨🇳" },
    { code: "IN", name: "India", currency: "INR", currencySymbol: "₹", flag: "🇮🇳" },
    { code: "ZA", name: "South Africa", currency: "ZAR", currencySymbol: "R", flag: "🇿🇦" }
  ];

  // Search functionality
  const loadRecentSearches = useCallback(() => {
    try {
      const recent = JSON.parse(localStorage.getItem('recentSearches')) || [];
      setRecentSearches(recent.slice(0, 5));
    } catch (error) {
      console.error("Error loading recent searches:", error);
    }
  }, []);

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.trim() !== "") {
      // Simple search suggestions based on recent searches
      const suggestions = recentSearches.filter(search => 
        search.toLowerCase().includes(value.toLowerCase())
      );
      setSearchSuggestions(suggestions);
      setShowSuggestions(suggestions.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

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
    }
  };

  const handleSearchInputFocus = () => {
    if (searchQuery.trim() !== "") {
      const suggestions = recentSearches.filter(search => 
        search.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchSuggestions(suggestions);
      setShowSuggestions(suggestions.length > 0);
    } else if (recentSearches.length > 0) {
      setSearchSuggestions(recentSearches);
      setShowSuggestions(true);
    }
  };

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

  const handleClearRecentSearches = () => {
    localStorage.removeItem('recentSearches');
    setRecentSearches([]);
    setSearchSuggestions([]);
  };

  const handleCategoryClick = (categoryName) => {
    navigate(`/search-results?q=${encodeURIComponent(categoryName)}`);
  };

  // CRITICAL FIX: Improved data loading with real-time updates
  const loadAllItemsFromStorage = () => {
    try {
      console.log("Loading all items for ProductDetailPage...");
      
      const allBusinesses = JSON.parse(localStorage.getItem('verifiedBusinesses')) || [];
      let allItems = [];

      // Load items from all businesses
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
        
        allItems = [...allItems, ...productsWithBusiness, ...servicesWithBusiness];
      });

      console.log(`Total items loaded: ${allItems.length}`);
      return allItems;
    } catch (error) {
      console.error("Error loading items from storage:", error);
      return [];
    }
  };

  // Load item data
  const loadItemData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`Loading item data for ID: ${productId}`);
      
      // Load ALL items from localStorage (CRITICAL FIX)
      const storedItems = loadAllItemsFromStorage();

      // Add comprehensive sample items
      const sampleItems = createSampleItems();
      
      // Combine all items
      const combinedItems = [...sampleItems, ...storedItems];
      
      console.log(`Total combined items: ${combinedItems.length}`);
      
      // Find the requested item
      const foundItem = combinedItems.find(item => item.id === productId);
      
      if (foundItem) {
        console.log(`Item found: ${foundItem.name}`);
        setItem(foundItem);
        
        // Find related items (same category)
        const related = combinedItems
          .filter(p => 
            p.id !== productId && 
            p.category === foundItem.category
          )
          .slice(0, 6);
        
        console.log(`Found ${related.length} related items`);
        setRelatedItems(related);
      } else {
        console.log(`Item not found: ${productId}`);
        setError("Item not found");
      }

      // Update data timestamp
      setDataLastUpdated(localStorage.getItem('dataLastUpdated'));
      
    } catch (error) {
      console.error("Error loading item:", error);
      setError("Failed to load item details");
    } finally {
      setLoading(false);
    }
  }, [productId]);

  // Create comprehensive sample items
  const createSampleItems = () => {
    return [
      // Electronics
      {
        id: "elec-1",
        name: "Dell Latitude Laptop",
        category: "Electronics & Devices",
        price: 1200000,
        currency: "TZS",
        currencySymbol: "TSh",
        stock: 5,
        business: "TechHub Tanzania",
        businessName: "TechHub Tanzania",
        businessPhone: "+255 789 123 456",
        businessEmail: "info@techhub.co.tz",
        businessAddress: "Samora Avenue, Dar es Salaam",
        location: { lat: -6.7924, lng: 39.2083 },
        address: "Samora Avenue, Dar es Salaam",
        country: "Tanzania",
        region: "Dar es Salaam",
        city: "Dar es Salaam",
        images: [
          "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1200",
          "https://images.pexels.com/photos/303383/pexels-photo-303383.jpeg?auto=compress&cs=tinysrgb&w=1200",
          "https://images.pexels.com/photos/1229861/pexels-photo-1229861.jpeg?auto=compress&cs=tinysrgb&w=1200"
        ],
        lastUpdated: "2024-01-15",
        description: "High-performance business laptop with latest Intel Core i7 processor, 16GB RAM, 512GB SSD, and 14-inch Full HD display. Perfect for professionals and students who need reliable computing power for work and studies. Features advanced security options and long battery life.",
        specifications: [
          "Processor: Intel Core i7-1165G7",
          "RAM: 16GB DDR4", 
          "Storage: 512GB SSD",
          "Display: 14-inch FHD (1920x1080)",
          "Graphics: Intel Iris Xe",
          "Battery: Up to 10 hours",
          "Weight: 1.5 kg",
          "Operating System: Windows 11 Pro",
          "Ports: 2x USB-C, 2x USB-A, HDMI, SD Card Reader"
        ],
        features: [
          "Backlit Keyboard",
          "Fingerprint Reader", 
          "HD Webcam with Privacy Shutter",
          "Windows 11 Pro",
          "3-year Warranty",
          "Fast Charging Technology",
          "Durable Aluminum Body"
        ],
        brand: "Dell",
        condition: "new",
        requiresSpecifications: true,
        rating: 4.5,
        reviews: 23,
        type: "product"
      },
      // Vehicles
      {
        id: "veh-1",
        name: "Toyota Land Cruiser V8 2023",
        category: "Vehicles",
        price: 185000000,
        currency: "TZS",
        currencySymbol: "TSh",
        stock: 2,
        business: "Premium Motors Tanzania",
        businessName: "Premium Motors Tanzania",
        businessPhone: "+255 754 333 444",
        businessEmail: "sales@premiummotors.co.tz",
        businessAddress: "Masaki, Dar es Salaam",
        location: { lat: -6.8155, lng: 39.2861 },
        address: "Masaki, Dar es Salaam",
        country: "Tanzania",
        region: "Dar es Salaam",
        city: "Dar es Salaam",
        images: [
          "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=1200",
          "https://images.pexels.com/photos/120049/pexels-photo-120049.jpeg?auto=compress&cs=tinysrgb&w=1200",
          "https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=1200"
        ],
        lastUpdated: "2024-01-14",
        description: "Brand new Toyota Land Cruiser V8 with premium luxury features. This SUV combines rugged off-road capability with luxurious comfort, making it perfect for both city driving and safari adventures. Features advanced safety systems and cutting-edge technology.",
        features: [
          "4.6L V8 Engine",
          "Leather Interior",
          "Sunroof",
          "Navigation System",
          "Premium Sound System",
          "Climate Control",
          "Advanced Safety Features",
          "Off-road Capability"
        ],
        brand: "Toyota",
        vehicleType: "suv",
        year: "2023",
        mileage: "0",
        fuelType: "petrol",
        transmission: "automatic",
        color: "White",
        condition: "new",
        requiresSpecifications: false,
        rating: 4.8,
        reviews: 12,
        type: "product"
      },
      // General Goods
      {
        id: "gen-1",
        name: "Men's Running Shoes - Premium Edition",
        category: "General Goods",
        price: 85000,
        currency: "TZS",
        currencySymbol: "TSh",
        stock: 15,
        business: "Sports Gear Tanzania",
        businessName: "Sports Gear Tanzania",
        businessPhone: "+255 713 456 789",
        businessEmail: "info@sportsgear.co.tz",
        businessAddress: "Mlimani City, Dar es Salaam",
        location: { lat: -6.8184, lng: 39.2883 },
        address: "Mlimani City, Dar es Salaam",
        country: "Tanzania",
        region: "Dar es Salaam",
        city: "Dar es Salaam",
        images: [
          "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1200",
          "https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=1200"
        ],
        lastUpdated: "2024-01-14", 
        description: "Comfortable running shoes designed for maximum performance and comfort. Perfect for jogging, gym workouts, and everyday casual wear. Features advanced cushioning technology and breathable materials to keep your feet comfortable all day long.",
        features: [
          "Lightweight Design",
          "Breathable Mesh Upper", 
          "Shock Absorption Technology",
          "Non-slip Rubber Sole",
          "Multiple Colors Available",
          "Easy to Clean"
        ],
        brand: "RunPro",
        condition: "new",
        size: "Available: S, M, L, XL",
        color: "Black/Blue/Red/White",
        material: "Mesh and Synthetic",
        requiresSpecifications: false,
        rating: 4.3,
        reviews: 15,
        type: "product"
      },
      // Building & Hotels
      {
        id: "hotel-1",
        name: "Serengeti Luxury Hotel & Spa",
        category: "Building & Hotels",
        serviceType: "5-Star Hotel",
        priceRange: "150-300",
        currency: "USD",
        currencySymbol: "$",
        business: "Serengeti Hospitality Group", 
        businessName: "Serengeti Hospitality Group",
        businessPhone: "+255 789 456 123",
        businessEmail: "info@serengetihotel.com",
        businessAddress: "Masaki, Dar es Salaam",
        location: { lat: -6.8155, lng: 39.2861 },
        address: "Masaki, Dar es Salaam",
        country: "Tanzania",
        region: "Dar es Salaam",
        city: "Dar es Salaam",
        images: [
          "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1200",
          "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=1200",
          "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=1200"
        ],
        lastUpdated: "2024-01-15",
        description: "5-star luxury hotel with premium amenities and excellent service. Located in the prestigious Masaki area, our hotel offers breathtaking views of the Indian Ocean and world-class hospitality. Experience unparalleled luxury with our spacious rooms, fine dining restaurants, and state-of-the-art facilities.",
        amenities: [
          "Infinity Swimming Pool",
          "Luxury Spa & Wellness Center", 
          "Fine Dining Restaurant",
          "24/7 Room Service",
          "Free High-Speed WiFi",
          "Fitness Center",
          "Business Center",
          "Concierge Service",
          "Valet Parking",
          "Beach Access"
        ],
        services: [
          "Airport Transfer Service",
          "Tour & Safari Booking",
          "Laundry & Dry Cleaning",
          "Car Rental Service",
          "Event Planning",
          "Meeting Rooms",
          "Babysitting Services",
          "Medical Assistance"
        ],
        contactInfo: "+255 789 456 123 | info@serengetihotel.com | www.serengetihotel.com",
        capacity: "100 guests, 50 luxury rooms and suites",
        rating: "5",
        checkInTime: "14:00",
        checkOutTime: "12:00", 
        policies: "Free cancellation 24 hours before check-in\nChildren under 12 stay free\nPets allowed with prior arrangement\nEarly check-in subject to availability\nCredit card required for incidentals",
        type: "service"
      }
    ];
  };

  // CRITICAL FIX: Listen for data updates
  useEffect(() => {
    const checkForDataUpdates = () => {
      const lastUpdate = localStorage.getItem('dataLastUpdated');
      if (lastUpdate !== dataLastUpdated) {
        console.log('Data update detected in ProductDetailPage, reloading...');
        loadItemData();
      }
    };

    // Check every 2 seconds for updates
    const interval = setInterval(checkForDataUpdates, 2000);
    return () => clearInterval(interval);
  }, [dataLastUpdated, loadItemData]);

  useEffect(() => {
    loadItemData();
    loadRecentSearches();
  }, [loadItemData, loadRecentSearches]);

  const getItemImages = (item) => {
    if (item && item.images && item.images.length > 0) {
      return item.images.filter(img => img && img.trim() !== "");
    }
    
    // Default images based on category
    if (item) {
      switch(item.category) {
        case 'Electronics & Devices':
          return [
            "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1200",
            "https://images.pexels.com/photos/303383/pexels-photo-303383.jpeg?auto=compress&cs=tinysrgb&w=1200"
          ];
        case 'Vehicles':
          return [
            "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=1200",
            "https://images.pexels.com/photos/120049/pexels-photo-120049.jpeg?auto=compress&cs=tinysrgb&w=1200"
          ];
        case 'General Goods':
          return [
            "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1200",
            "https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=1200"
          ];
        case 'Building & Hotels':
          return [
            "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1200",
            "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=1200"
          ];
        default:
          return [
            "https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=1200"
          ];
      }
    }
    return [];
  };

  const handleContactBusiness = () => {
    if (!item) return;
    
    const phoneNumber = item.businessPhone || "+255754000000";
    const email = item.businessEmail || `${item.businessName?.toLowerCase().replace(/\s+/g, '')}@email.com`;
    const address = item.businessAddress || item.address;
    
    alert(`Contact Information:\n\nBusiness: ${item.businessName || item.business}\nPhone: ${phoneNumber}\nEmail: ${email}\nAddress: ${address}, ${item.city}, ${item.country}`);
  };

  const handleGetDirections = () => {
    if (!item) return;

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
      alert('Samahani, hakuna taarifa ya eneo inayopatikana kwa huduma hii. Tafadhali wasiliana na biashara moja kwa moja.');
    }
  };

  // NEW: Handle Messages Click
  const handleMessagesClick = () => {
    if (!item) return;
    
    // Save product info for chat
    const chatData = {
      productId: item.id,
      productName: item.name,
      productImage: getItemImages(item)[0],
      businessName: item.businessName || item.business,
      businessPhone: item.businessPhone,
      price: item.type === 'service' ? item.priceRange : item.price,
      currency: item.currencySymbol || '$',
      category: item.category,
      timestamp: new Date().toISOString()
    };
    
    // Save to localStorage for chat page
    localStorage.setItem('currentChatProduct', JSON.stringify(chatData));
    
    // Navigate to chat page
    navigate('/chat');
  };

  const renderStars = (rating) => {
    const numRating = typeof rating === 'string' ? parseFloat(rating) : (rating || 4.0);
    return Array.from({ length: 5 }, (_, index) => (
      <i
        key={index}
        className={`fas fa-star ${index < Math.floor(numRating) ? 'text-warning' : 'text-light'}`}
      ></i>
    ));
  };

  const getCategoryIcon = (category) => {
    if (!category) return 'fa-box';
    
    switch(category) {
      case 'Electronics & Devices':
        return 'fa-laptop';
      case 'Vehicles':
        return 'fa-car';
      case 'General Goods':
        return 'fa-tshirt';
      case 'Building & Hotels':
        return 'fa-hotel';
      default:
        return 'fa-box';
    }
  };

  const getCategoryColor = (category) => {
    if (!category) return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    
    switch(category) {
      case 'Electronics & Devices':
        return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      case 'Vehicles':
        return 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
      case 'General Goods':
        return 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
      case 'Building & Hotels':
        return 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)';
      default:
        return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
  };

  const getCategoryBadgeColor = (category) => {
    if (!category) return 'primary';
    
    switch(category) {
      case 'Electronics & Devices':
        return 'primary';
      case 'Vehicles':
        return 'danger';
      case 'General Goods':
        return 'warning';
      case 'Building & Hotels':
        return 'success';
      default:
        return 'secondary';
    }
  };

  const getCountryFlag = (countryName) => {
    if (!countryName) return '🏳️';
    
    const country = countries.find(c => c.name === countryName);
    return country?.flag || '🏳️';
  };

  const formatPrice = (item) => {
    if (!item) return "$ 0";
    
    if (item.type === 'service') {
      return `${item.currencySymbol || '$'} ${item.priceRange} ${item.currency ? `(${item.currency})` : ''}`;
    }
    return `${item.currencySymbol || '$'} ${item.price?.toLocaleString() || '0'} ${item.currency ? `(${item.currency})` : ''}`;
  };

  const formatSpecification = (spec) => {
    if (!spec || !spec.includes(':')) return { key: spec, value: '' };
    
    const colonIndex = spec.indexOf(':');
    const key = spec.substring(0, colonIndex).trim();
    const value = spec.substring(colonIndex + 1).trim();
    
    return { key, value };
  };

  const openImageModal = (index) => {
    setSelectedImageIndex(index);
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
  };

  const navigateImage = (direction) => {
    const images = getItemImages(item);
    if (direction === 'next') {
      setSelectedImageIndex((prev) => (prev + 1) % images.length);
    } else {
      setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 bg-white d-flex justify-content-center align-items-center">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }}></div>
          <h5>Loading Product Details...</h5>
          <p className="text-muted">Please wait while we fetch the item information</p>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-vh-100 bg-white d-flex justify-content-center align-items-center">
        <div className="text-center">
          <i className="fas fa-exclamation-triangle fa-3x mb-3 text-muted"></i>
          <h3 className="text-dark">{error || "Product Not Found"}</h3>
          <p className="text-muted">The product you're looking for doesn't exist or may have been removed.</p>
          <div className="d-flex gap-3 justify-content-center">
            <button className="btn btn-primary" onClick={() => navigate('/search')}>
              <i className="fas fa-arrow-left me-2"></i>
              Back to Search
            </button>
            <button className="btn btn-outline-primary" onClick={() => navigate('/')}>
              <i className="fas fa-home me-2"></i>
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const itemImages = getItemImages(item);
  const categoryColor = getCategoryColor(item.category);
  const categoryBadgeColor = getCategoryBadgeColor(item.category);
  const categoryIcon = getCategoryIcon(item.category);

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

      {/* Main Content */}
      <div className="container-fluid px-0 bg-white">
        
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

        {/* Product Details Section */}
        <div className="container py-4">
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="mb-4">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/" className="text-decoration-none">
                  <i className="fas fa-home me-1"></i>
                  Home
                </Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/search" className="text-decoration-none">Search</Link>
              </li>
              <li className="breadcrumb-item active text-dark">{item.name}</li>
            </ol>
          </nav>

          <div className="row g-4">
            {/* Image Gallery */}
            <div className="col-lg-7 col-xl-8">
              <div className="card border-0 shadow-lg rounded-4 overflow-hidden mb-4">
                <div className="card-body p-0">
                  {/* Main Large Image */}
                  <div 
                    className="main-image-container position-relative cursor-pointer"
                    onClick={() => openImageModal(selectedImageIndex)}
                    style={{ 
                      height: '400px',
                      background: `url(${itemImages[selectedImageIndex]}) center/contain no-repeat`,
                      backgroundColor: '#f8f9fa',
                      cursor: 'zoom-in'
                    }}
                  >
                    {/* Image Navigation */}
                    {itemImages.length > 1 && (
                      <>
                        <button 
                          className="btn btn-light rounded-circle position-absolute top-50 start-0 translate-middle-y ms-3 shadow"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigateImage('prev');
                          }}
                          style={{ width: '50px', height: '50px' }}
                        >
                          <i className="fas fa-chevron-left"></i>
                        </button>
                        <button 
                          className="btn btn-light rounded-circle position-absolute top-50 end-0 translate-middle-y me-3 shadow"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigateImage('next');
                          }}
                          style={{ width: '50px', height: '50px' }}
                        >
                          <i className="fas fa-chevron-right"></i>
                        </button>
                      </>
                    )}

                    {/* Image Counter */}
                    <div className="position-absolute bottom-0 end-0 m-3">
                      <span className="badge bg-dark bg-opacity-75 text-white px-3 py-2 rounded-pill">
                        {selectedImageIndex + 1} / {itemImages.length}
                      </span>
                    </div>
                  </div>

                  {/* Thumbnail Gallery */}
                  {itemImages.length > 1 && (
                    <div className="p-3 bg-light">
                      <div className="d-flex gap-2 overflow-auto pb-2">
                        {itemImages.map((img, index) => (
                          <div 
                            key={index}
                            className={`thumbnail-item flex-shrink-0 cursor-pointer ${selectedImageIndex === index ? 'active' : ''}`}
                            onClick={() => setSelectedImageIndex(index)}
                            style={{ 
                              width: '80px', 
                              height: '80px',
                              border: selectedImageIndex === index ? '3px solid #007bff' : '2px solid #dee2e6',
                              borderRadius: '10px',
                              overflow: 'hidden',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease'
                            }}
                          >
                            <img 
                              src={img} 
                              alt={`Thumbnail ${index + 1}`}
                              className="w-100 h-100 object-fit-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Send Message Button Only */}
                  <div className="p-4 border-top">
                    <div className="row align-items-center">
                      <div className="col-md-8">
                        <h5 className="fw-bold text-dark mb-2">
                          <i className="fas fa-comments me-2 text-primary"></i>
                          Interested in this item?
                        </h5>
                        <p className="text-muted mb-0">
                          Chat directly with the business owner. Ask questions, negotiate prices, or request more details.
                        </p>
                      </div>
                      <div className="col-md-4 text-md-end">
                        <button 
                          className="btn btn-success btn-lg px-4 py-3 rounded-pill fw-bold"
                          onClick={handleMessagesClick}
                          style={{
                            background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                            border: 'none',
                            boxShadow: '0 4px 15px rgba(40, 167, 69, 0.3)'
                          }}
                        >
                          <i className="fas fa-paper-plane me-2"></i>
                          Send Message
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact & Location Section */}
              <div className="card border-0 shadow-lg rounded-4">
                <div className="card-header bg-white border-0 py-4">
                  <h5 className="fw-bold mb-0 d-flex align-items-center">
                    <i className="fas fa-map-marker-alt me-3 text-primary"></i>
                    Contact & Location Information
                  </h5>
                </div>
                <div className="card-body p-4">
                  <div className="row g-4">
                    {/* Contact Information */}
                    <div className="col-lg-6 col-12">
                      <div className="card bg-light border-0 h-100">
                        <div className="card-body">
                          <h6 className="fw-bold mb-4 text-dark d-flex align-items-center">
                            <i className="fas fa-address-card me-2 text-primary"></i>
                            Contact Details
                          </h6>
                          
                          <div className="mb-4">
                            <div className="d-flex align-items-center mb-3">
                              <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                                <i className="fas fa-store text-primary fa-lg"></i>
                              </div>
                              <div>
                                <h6 className="fw-bold mb-1 text-dark">Business Name</h6>
                                <p className="text-muted mb-0">{item.businessName || item.business}</p>
                              </div>
                            </div>

                            <div className="d-flex align-items-center mb-3">
                              <div className="bg-success bg-opacity-10 rounded-circle p-3 me-3">
                                <i className="fas fa-phone text-success fa-lg"></i>
                              </div>
                              <div>
                                <h6 className="fw-bold mb-1 text-dark">Phone Number</h6>
                                <p className="text-muted mb-0">{item.businessPhone || "+255754000000"}</p>
                              </div>
                            </div>

                            <div className="d-flex align-items-center mb-3">
                              <div className="bg-info bg-opacity-10 rounded-circle p-3 me-3">
                                <i className="fas fa-envelope text-info fa-lg"></i>
                              </div>
                              <div>
                                <h6 className="fw-bold mb-1 text-dark">Email Address</h6>
                                <p className="text-muted mb-0">{item.businessEmail || `${item.businessName?.toLowerCase().replace(/\s+/g, '')}@email.com`}</p>
                              </div>
                            </div>

                            <div className="d-flex align-items-center">
                              <div className="bg-warning bg-opacity-10 rounded-circle p-3 me-3">
                                <i className="fas fa-map-marker-alt text-warning fa-lg"></i>
                              </div>
                              <div>
                                <h6 className="fw-bold mb-1 text-dark">Location</h6>
                                <p className="text-muted mb-0">
                                  {item.businessAddress || item.address}, {item.city}, {item.country}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="d-grid gap-2">
                            <button 
                              className="btn btn-primary btn-lg rounded-pill fw-bold"
                              onClick={handleContactBusiness}
                            >
                              <i className="fas fa-phone-alt me-2"></i>
                              Contact Business
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Location Information */}
                    <div className="col-lg-6 col-12">
                      <div className="card bg-light border-0 h-100">
                        <div className="card-body">
                          <h6 className="fw-bold mb-4 text-dark d-flex align-items-center">
                            <i className="fas fa-map-marked-alt me-2 text-primary"></i>
                            Location Details
                          </h6>
                          
                          <div className="mb-4">
                            <div className="d-flex align-items-center mb-3">
                              <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                                <span className="text-primary fw-bold">{getCountryFlag(item.country)}</span>
                              </div>
                              <div>
                                <h6 className="fw-bold mb-1 text-dark">Country</h6>
                                <p className="text-muted mb-0">{item.country || 'Tanzania'}</p>
                              </div>
                            </div>

                            <div className="d-flex align-items-center mb-3">
                              <div className="bg-success bg-opacity-10 rounded-circle p-3 me-3">
                                <i className="fas fa-city text-success fa-lg"></i>
                              </div>
                              <div>
                                <h6 className="fw-bold mb-1 text-dark">City/Region</h6>
                                <p className="text-muted mb-0">
                                  {item.city || item.region || 'Dar es Salaam'}
                                  {item.region && item.city !== item.region ? `, ${item.region}` : ''}
                                </p>
                              </div>
                            </div>

                            <div className="d-flex align-items-center mb-3">
                              <div className="bg-info bg-opacity-10 rounded-circle p-3 me-3">
                                <i className="fas fa-road text-info fa-lg"></i>
                              </div>
                              <div>
                                <h6 className="fw-bold mb-1 text-dark">Address</h6>
                                <p className="text-muted mb-0">{item.businessAddress || item.address || 'Address not specified'}</p>
                              </div>
                            </div>

                            <div className="d-flex align-items-center">
                              <div className="bg-warning bg-opacity-10 rounded-circle p-3 me-3">
                                <i className="fas fa-globe-africa text-warning fa-lg"></i>
                              </div>
                              <div>
                                <h6 className="fw-bold mb-1 text-dark">Coordinates</h6>
                                <p className="text-muted mb-0">
                                  {item.location ? 
                                    `${item.location.lat?.toFixed(4)}, ${item.location.lng?.toFixed(4)}` : 
                                    'Coordinates not available'}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="d-grid gap-2">
                            <button 
                              className="btn btn-outline-primary btn-lg rounded-pill fw-bold"
                              onClick={handleGetDirections}
                            >
                              <i className="fas fa-directions me-2"></i>
                              Get Directions
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Information */}
            <div className="col-lg-5 col-xl-4">
              <div className="sticky-top" style={{ top: '100px' }}>
                {/* Main Info Card */}
                <div className="card border-0 shadow-lg rounded-4 mb-4 overflow-hidden">
                  {/* Category Header */}
                  <div 
                    className="card-header text-white border-0 py-4"
                    style={{ background: categoryColor }}
                  >
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <i className={`fas ${categoryIcon} fa-2x me-3`}></i>
                        <div>
                          <h5 className="fw-bold mb-1">{item.category}</h5>
                          <span className="badge bg-white bg-opacity-20 text-white px-3 py-2 rounded-pill">
                            {item.type === 'service' ? 'Service' : 'Product'}
                          </span>
                        </div>
                      </div>
                      <span className="badge bg-white bg-opacity-20 text-white px-3 py-2 rounded-pill">
                        {getCountryFlag(item.country)} {item.country || 'Tanzania'}
                      </span>
                    </div>
                  </div>

                  <div className="card-body p-4">
                    {/* Title and Rating */}
                    <div className="mb-4">
                      <h2 className="fw-bold text-dark mb-3">{item.name}</h2>
                      <div className="d-flex align-items-center flex-wrap gap-3">
                        <div className="d-flex align-items-center">
                          <div className="me-2">
                            {renderStars(item.rating)}
                          </div>
                          <span className="text-warning fw-bold me-1">{item.rating || 4.0}</span>
                          <span className="text-muted">({item.reviews || 0} reviews)</span>
                        </div>
                        <span className={`badge bg-${categoryBadgeColor} bg-opacity-10 text-${categoryBadgeColor} px-3 py-2 rounded-pill`}>
                          <i className={`fas ${categoryIcon} me-2`}></i>
                          {item.category}
                        </span>
                      </div>
                    </div>

                    {/* Price Section */}
                    <div className="mb-4 p-4 bg-light rounded-4">
                      <div className="d-flex align-items-center justify-content-between">
                        <div>
                          <h6 className="text-muted mb-2">Price</h6>
                          <h3 className="fw-bold text-primary mb-0">
                            {formatPrice(item)}
                          </h3>
                          {item.type === 'product' && item.stock !== undefined && (
                            <p className="text-muted mb-0 mt-2">
                              <i className="fas fa-box me-2"></i>
                              {item.stock > 0 ? (
                                <span className="text-success">
                                  {item.stock} in stock
                                </span>
                              ) : (
                                <span className="text-danger">
                                  Out of stock
                                </span>
                              )}
                            </p>
                          )}
                        </div>
                        <div className="text-end">
                          {item.condition && (
                            <span className={`badge ${item.condition === 'new' ? 'bg-success' : 'bg-warning'} px-3 py-2 rounded-pill`}>
                              {item.condition === 'new' ? 'New' : 'Used'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="d-grid gap-3 mb-4">
                      <button 
                        className="btn btn-primary btn-lg rounded-pill fw-bold py-3"
                        onClick={handleContactBusiness}
                      >
                        <i className="fas fa-phone-alt me-2"></i>
                        Contact Business
                      </button>
                      
                      <button 
                        className="btn btn-outline-primary btn-lg rounded-pill fw-bold py-3"
                        onClick={handleGetDirections}
                      >
                        <i className="fas fa-directions me-2"></i>
                        Get Directions
                      </button>

                      {/* Send Message Button */}
                      <button 
                        className="btn btn-success btn-lg rounded-pill fw-bold py-3"
                        onClick={handleMessagesClick}
                        style={{
                          background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                          border: 'none',
                          boxShadow: '0 4px 15px rgba(40, 167, 69, 0.3)'
                        }}
                      >
                        <i className="fas fa-paper-plane me-2"></i>
                        Send Message
                      </button>
                    </div>

                    {/* Business Info */}
                    <div className="border-top pt-4">
                      <h6 className="fw-bold text-dark mb-3 d-flex align-items-center">
                        <i className="fas fa-store me-2 text-primary"></i>
                        Business Information
                      </h6>
                      <div className="d-flex align-items-center mb-3">
                        <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                          <i className="fas fa-building text-primary"></i>
                        </div>
                        <div>
                          <h6 className="fw-bold mb-1 text-dark">Business Name</h6>
                          <p className="text-muted mb-0">{item.businessName || item.business}</p>
                        </div>
                      </div>
                      <div className="d-flex align-items-center">
                        <div className="bg-success bg-opacity-10 rounded-circle p-3 me-3">
                          <i className="fas fa-map-marker-alt text-success"></i>
                        </div>
                        <div>
                          <h6 className="fw-bold mb-1 text-dark">Location</h6>
                          <p className="text-muted mb-0">
                            {item.city}, {item.country}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description Card */}
                <div className="card border-0 shadow-lg rounded-4">
                  <div className="card-header bg-white border-0 py-4">
                    <h5 className="fw-bold mb-0 d-flex align-items-center">
                      <i className="fas fa-file-alt me-3 text-primary"></i>
                      Description
                    </h5>
                  </div>
                  <div className="card-body p-4">
                    <p className="text-dark mb-0" style={{ lineHeight: '1.6' }}>
                      {item.description || 'No description available for this item.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="row mt-4">
            <div className="col-12">
              <div className="card border-0 shadow-lg rounded-4">
                <div className="card-header bg-white border-0 py-4">
                  <ul className="nav nav-pills nav-fill" role="tablist">
                    <li className="nav-item">
                      <button 
                        className={`nav-link ${activeTab === 'details' ? 'active' : ''} rounded-pill fw-bold`}
                        onClick={() => setActiveTab('details')}
                      >
                        <i className="fas fa-info-circle me-2"></i>
                        Details & Specifications
                      </button>
                    </li>
                    <li className="nav-item">
                      <button 
                        className={`nav-link ${activeTab === 'features' ? 'active' : ''} rounded-pill fw-bold`}
                        onClick={() => setActiveTab('features')}
                      >
                        <i className="fas fa-star me-2"></i>
                        Features & Amenities
                      </button>
                    </li>
                    <li className="nav-item">
                      <button 
                        className={`nav-link ${activeTab === 'reviews' ? 'active' : ''} rounded-pill fw-bold`}
                        onClick={() => setActiveTab('reviews')}
                      >
                        <i className="fas fa-comment me-2"></i>
                        Reviews & Ratings
                      </button>
                    </li>
                  </ul>
                </div>

                <div className="card-body p-4">
                  {/* Details & Specifications Tab */}
                  {activeTab === 'details' && (
                    <div className="tab-content">
                      <div className="row g-4">
                        {/* Specifications */}
                        {item.specifications && item.specifications.length > 0 && (
                          <div className="col-md-6">
                            <h5 className="fw-bold text-dark mb-4 d-flex align-items-center">
                              <i className="fas fa-list-alt me-2 text-primary"></i>
                              Specifications
                            </h5>
                            <div className="bg-light rounded-4 p-4">
                              {item.specifications.map((spec, index) => {
                                const formattedSpec = formatSpecification(spec);
                                return (
                                  <div key={index} className="mb-3 pb-3 border-bottom">
                                    <h6 className="fw-bold text-primary mb-1">{formattedSpec.key}</h6>
                                    <p className="text-dark mb-0">{formattedSpec.value}</p>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Additional Details */}
                        <div className="col-md-6">
                          <h5 className="fw-bold text-dark mb-4 d-flex align-items-center">
                            <i className="fas fa-clipboard-list me-2 text-primary"></i>
                            Additional Details
                          </h5>
                          <div className="bg-light rounded-4 p-4">
                            {item.brand && (
                              <div className="mb-3 pb-3 border-bottom">
                                <h6 className="fw-bold text-primary mb-1">Brand</h6>
                                <p className="text-dark mb-0">{item.brand}</p>
                              </div>
                            )}
                            
                            {item.condition && (
                              <div className="mb-3 pb-3 border-bottom">
                                <h6 className="fw-bold text-primary mb-1">Condition</h6>
                                <p className="text-dark mb-0 text-capitalize">{item.condition}</p>
                              </div>
                            )}

                            {item.size && (
                              <div className="mb-3 pb-3 border-bottom">
                                <h6 className="fw-bold text-primary mb-1">Size</h6>
                                <p className="text-dark mb-0">{item.size}</p>
                              </div>
                            )}

                            {item.color && (
                              <div className="mb-3 pb-3 border-bottom">
                                <h6 className="fw-bold text-primary mb-1">Color</h6>
                                <p className="text-dark mb-0">{item.color}</p>
                              </div>
                            )}

                            {item.material && (
                              <div className="mb-3 pb-3 border-bottom">
                                <h6 className="fw-bold text-primary mb-1">Material</h6>
                                <p className="text-dark mb-0">{item.material}</p>
                              </div>
                            )}

                            {/* Vehicle Specific Details */}
                            {item.vehicleType && (
                              <>
                                <div className="mb-3 pb-3 border-bottom">
                                  <h6 className="fw-bold text-primary mb-1">Vehicle Type</h6>
                                  <p className="text-dark mb-0 text-capitalize">{item.vehicleType}</p>
                                </div>
                                {item.year && (
                                  <div className="mb-3 pb-3 border-bottom">
                                    <h6 className="fw-bold text-primary mb-1">Year</h6>
                                    <p className="text-dark mb-0">{item.year}</p>
                                  </div>
                                )}
                                {item.mileage && (
                                  <div className="mb-3 pb-3 border-bottom">
                                    <h6 className="fw-bold text-primary mb-1">Mileage</h6>
                                    <p className="text-dark mb-0">{item.mileage}</p>
                                  </div>
                                )}
                                {item.fuelType && (
                                  <div className="mb-3 pb-3 border-bottom">
                                    <h6 className="fw-bold text-primary mb-1">Fuel Type</h6>
                                    <p className="text-dark mb-0 text-capitalize">{item.fuelType}</p>
                                  </div>
                                )}
                                {item.transmission && (
                                  <div className="mb-3 pb-3 border-bottom">
                                    <h6 className="fw-bold text-primary mb-1">Transmission</h6>
                                    <p className="text-dark mb-0 text-capitalize">{item.transmission}</p>
                                  </div>
                                )}
                              </>
                            )}

                            {/* Service Specific Details */}
                            {item.serviceType && (
                              <div className="mb-3 pb-3 border-bottom">
                                <h6 className="fw-bold text-primary mb-1">Service Type</h6>
                                <p className="text-dark mb-0">{item.serviceType}</p>
                              </div>
                            )}

                            {item.capacity && (
                              <div className="mb-3 pb-3 border-bottom">
                                <h6 className="fw-bold text-primary mb-1">Capacity</h6>
                                <p className="text-dark mb-0">{item.capacity}</p>
                              </div>
                            )}

                            {item.checkInTime && (
                              <div className="mb-3 pb-3 border-bottom">
                                <h6 className="fw-bold text-primary mb-1">Check-in Time</h6>
                                <p className="text-dark mb-0">{item.checkInTime}</p>
                              </div>
                            )}

                            {item.checkOutTime && (
                              <div className="mb-3 pb-3 border-bottom">
                                <h6 className="fw-bold text-primary mb-1">Check-out Time</h6>
                                <p className="text-dark mb-0">{item.checkOutTime}</p>
                              </div>
                            )}

                            <div className="mb-3">
                              <h6 className="fw-bold text-primary mb-1">Last Updated</h6>
                              <p className="text-dark mb-0">{item.lastUpdated || '2024-01-15'}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Features & Amenities Tab */}
                  {activeTab === 'features' && (
                    <div className="tab-content">
                      <div className="row g-4">
                        {/* Features */}
                        {item.features && item.features.length > 0 && (
                          <div className="col-md-6">
                            <h5 className="fw-bold text-dark mb-4 d-flex align-items-center">
                              <i className="fas fa-star me-2 text-warning"></i>
                              Key Features
                            </h5>
                            <div className="row g-3">
                              {item.features.map((feature, index) => (
                                <div key={index} className="col-sm-6">
                                  <div className="card border-0 bg-light h-100">
                                    <div className="card-body text-center p-4">
                                      <i className="fas fa-check-circle text-success fa-2x mb-3"></i>
                                      <h6 className="fw-bold text-dark mb-0">{feature}</h6>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Amenities */}
                        {item.amenities && item.amenities.length > 0 && (
                          <div className="col-md-6">
                            <h5 className="fw-bold text-dark mb-4 d-flex align-items-center">
                              <i className="fas fa-concierge-bell me-2 text-primary"></i>
                              Amenities
                            </h5>
                            <div className="row g-3">
                              {item.amenities.map((amenity, index) => (
                                <div key={index} className="col-sm-6">
                                  <div className="card border-0 bg-light h-100">
                                    <div className="card-body text-center p-4">
                                      <i className="fas fa-check text-success fa-2x mb-3"></i>
                                      <h6 className="fw-bold text-dark mb-0">{amenity}</h6>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Services */}
                        {item.services && item.services.length > 0 && (
                          <div className="col-12 mt-4">
                            <h5 className="fw-bold text-dark mb-4 d-flex align-items-center">
                              <i className="fas fa-hands-helping me-2 text-success"></i>
                              Services Offered
                            </h5>
                            <div className="row g-3">
                              {item.services.map((service, index) => (
                                <div key={index} className="col-md-4 col-sm-6">
                                  <div className="card border-0 bg-success bg-opacity-10 h-100">
                                    <div className="card-body text-center p-4">
                                      <i className="fas fa-hand-holding-heart text-success fa-2x mb-3"></i>
                                      <h6 className="fw-bold text-dark mb-0">{service}</h6>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Policies */}
                        {item.policies && (
                          <div className="col-12 mt-4">
                            <h5 className="fw-bold text-dark mb-4 d-flex align-items-center">
                              <i className="fas fa-file-contract me-2 text-info"></i>
                              Policies & Information
                            </h5>
                            <div className="card border-0 bg-info bg-opacity-10">
                              <div className="card-body p-4">
                                <pre className="text-dark mb-0" style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                                  {item.policies}
                                </pre>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Reviews & Ratings Tab */}
                  {activeTab === 'reviews' && (
                    <div className="tab-content">
                      <div className="row g-4">
                        {/* Rating Summary */}
                        <div className="col-md-4">
                          <div className="card border-0 bg-light rounded-4 p-4 text-center">
                            <div className="display-4 fw-bold text-warning mb-2">
                              {item.rating || 4.0}
                            </div>
                            <div className="mb-3">
                              {renderStars(item.rating)}
                            </div>
                            <p className="text-muted mb-0">
                              {item.reviews || 0} reviews
                            </p>
                          </div>
                        </div>

                        {/* Review Stats */}
                        <div className="col-md-8">
                          <h5 className="fw-bold text-dark mb-4">Customer Reviews</h5>
                          
                          {/* Sample Reviews */}
                          <div className="space-y-4">
                            {/* Review 1 */}
                            <div className="card border-0 bg-white rounded-4 p-4 shadow-sm">
                              <div className="d-flex justify-content-between align-items-start mb-3">
                                <div className="d-flex align-items-center">
                                  <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                                    <i className="fas fa-user text-primary"></i>
                                  </div>
                                  <div>
                                    <h6 className="fw-bold text-dark mb-1">John M.</h6>
                                    <div className="d-flex align-items-center">
                                      {renderStars(5)}
                                      <span className="text-muted ms-2">2 days ago</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <p className="text-dark mb-0">
                                Excellent {item.type === 'service' ? 'service' : 'product'}! The quality exceeded my expectations. 
                                {item.businessName || item.business} provided outstanding customer service and the {item.type === 'service' ? 'service was delivered' : 'item was delivered'} on time.
                              </p>
                            </div>

                            {/* Review 2 */}
                            <div className="card border-0 bg-white rounded-4 p-4 shadow-sm">
                              <div className="d-flex justify-content-between align-items-start mb-3">
                                <div className="d-flex align-items-center">
                                  <div className="bg-success bg-opacity-10 rounded-circle p-3 me-3">
                                    <i className="fas fa-user text-success"></i>
                                  </div>
                                  <div>
                                    <h6 className="fw-bold text-dark mb-1">Sarah K.</h6>
                                    <div className="d-flex align-items-center">
                                      {renderStars(4)}
                                      <span className="text-muted ms-2">1 week ago</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <p className="text-dark mb-0">
                                Very satisfied with my purchase. The {item.type === 'service' ? 'service was professional' : 'product works perfectly'} and the price was reasonable. 
                                Would recommend {item.businessName || item.business} to others.
                              </p>
                            </div>

                            {/* Review 3 */}
                            <div className="card border-0 bg-white rounded-4 p-4 shadow-sm">
                              <div className="d-flex justify-content-between align-items-start mb-3">
                                <div className="d-flex align-items-center">
                                  <div className="bg-warning bg-opacity-10 rounded-circle p-3 me-3">
                                    <i className="fas fa-user text-warning"></i>
                                  </div>
                                  <div>
                                    <h6 className="fw-bold text-dark mb-1">David L.</h6>
                                    <div className="d-flex align-items-center">
                                      {renderStars(4.5)}
                                      <span className="text-muted ms-2">2 weeks ago</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <p className="text-dark mb-0">
                                Good {item.type === 'service' ? 'service experience' : 'quality product'}. The {item.type === 'service' ? 'service met my requirements' : 'item arrived as described'} and the communication was clear throughout the process.
                              </p>
                            </div>
                          </div>

                          {/* Load More Reviews Button */}
                          <div className="text-center mt-4">
                            <button className="btn btn-outline-primary rounded-pill px-4">
                              <i className="fas fa-arrow-down me-2"></i>
                              Load More Reviews
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Related Items Section */}
          {relatedItems.length > 0 && (
            <div className="row mt-4">
              <div className="col-12">
                <div className="card border-0 shadow-lg rounded-4">
                  <div className="card-header bg-white border-0 py-4">
                    <h5 className="fw-bold mb-0 d-flex align-items-center">
                      <i className="fas fa-th-large me-3 text-primary"></i>
                      Related {item.type === 'service' ? 'Services' : 'Products'}
                    </h5>
                  </div>
                  <div className="card-body p-4">
                    <div className="row g-4">
                      {relatedItems.slice(0, 4).map((relatedItem, index) => (
                        <div key={index} className="col-lg-3 col-md-6">
                          <div 
                            className="card border-0 shadow-sm h-100 cursor-pointer"
                            onClick={() => navigate(`/product/${relatedItem.id}`)}
                            style={{ 
                              transition: 'all 0.3s ease',
                              cursor: 'pointer'
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
                            <div className="position-relative overflow-hidden rounded-top-4">
                              <img 
                                src={getItemImages(relatedItem)[0]} 
                                className="card-img-top"
                                alt={relatedItem.name}
                                style={{ 
                                  height: '200px', 
                                  objectFit: 'cover',
                                  transition: 'transform 0.3s ease'
                                }}
                              />
                              <div className="position-absolute top-0 end-0 m-3">
                                <span className={`badge bg-${getCategoryBadgeColor(relatedItem.category)} bg-opacity-90 text-white px-3 py-2 rounded-pill`}>
                                  <i className={`fas ${getCategoryIcon(relatedItem.category)} me-1`}></i>
                                  {relatedItem.category}
                                </span>
                              </div>
                            </div>
                            <div className="card-body">
                              <h6 className="card-title fw-bold text-dark mb-2">{relatedItem.name}</h6>
                              <p className="card-text text-primary fw-bold mb-2">
                                {formatPrice(relatedItem)}
                              </p>
                              <div className="d-flex align-items-center justify-content-between">
                                <small className="text-muted">
                                  <i className="fas fa-store me-1"></i>
                                  {relatedItem.businessName || relatedItem.business}
                                </small>
                                <div className="d-flex align-items-center">
                                  {renderStars(relatedItem.rating)}
                                  <small className="text-muted ms-1">({relatedItem.reviews || 0})</small>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div 
          className="modal fade show d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.9)' }}
          tabIndex="-1"
          onClick={closeImageModal}
        >
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content bg-transparent border-0">
              <div className="modal-header border-0">
                <button 
                  type="button" 
                  className="btn-close btn-close-white"
                  onClick={closeImageModal}
                ></button>
              </div>
              <div className="modal-body text-center">
                <img 
                  src={itemImages[selectedImageIndex]} 
                  alt={`Product view ${selectedImageIndex + 1}`}
                  className="img-fluid rounded-4"
                  style={{ maxHeight: '70vh', objectFit: 'contain' }}
                  onClick={(e) => e.stopPropagation()}
                />
                {itemImages.length > 1 && (
                  <div className="mt-4">
                    <button 
                      className="btn btn-light rounded-circle me-3"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateImage('prev');
                      }}
                      style={{ width: '60px', height: '60px' }}
                    >
                      <i className="fas fa-chevron-left fa-lg"></i>
                    </button>
                    <button 
                      className="btn btn-light rounded-circle"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateImage('next');
                      }}
                      style={{ width: '60px', height: '60px' }}
                    >
                      <i className="fas fa-chevron-right fa-lg"></i>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Bootstrap Icons */}
      <link 
        rel="stylesheet" 
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" 
      />
      <style>
        {`
          .cursor-pointer { cursor: pointer; }
          .thumbnail-item.active { border-color: #007bff !important; }
          
          /* Responsive Design Improvements */
          @media (max-width: 768px) {
            .main-image-container {
              height: 250px !important;
            }
            .thumbnail-item {
              width: 50px !important;
              height: 50px !important;
            }
            .btn-lg {
              padding: 0.75rem 1.5rem !important;
              font-size: 1rem !important;
            }
            .display-4 {
              font-size: 2rem !important;
            }
          }
          
          @media (max-width: 576px) {
            .container {
              padding-left: 15px;
              padding-right: 15px;
            }
            .card-body {
              padding: 1rem !important;
            }
            .btn {
              width: 100% !important;
              margin-bottom: 0.5rem;
            }
          }
        `}
      </style>
    </div>
  );
}

export default ProductDetailPage;