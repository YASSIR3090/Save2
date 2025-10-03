// src/HomePage1.jsx - IMPROVED & COMPLETE VERSION
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";

function HomePage1() {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const navigate = useNavigate();

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

  // Load featured items and categories
  const loadHomeData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Set categories
      setCategories(categoryData);

      // Load featured items from localStorage and sample data
      const allBusinesses = JSON.parse(localStorage.getItem('verifiedBusinesses')) || [];
      let allItems = [];

      // Load items from all businesses
      allBusinesses.forEach(business => {
        const businessProducts = JSON.parse(localStorage.getItem(`products_${business.id}`)) || [];
        const businessServices = JSON.parse(localStorage.getItem(`services_${business.id}`)) || [];
        
        const productsWithBusiness = businessProducts.map(product => ({
          ...product,
          businessName: business.businessName,
          type: "product"
        }));
        
        const servicesWithBusiness = businessServices.map(service => ({
          ...service,
          businessName: business.businessName,
          type: "service"
        }));
        
        allItems = [...allItems, ...productsWithBusiness, ...servicesWithBusiness];
      });

      // Sample featured items
      const sampleFeaturedItems = [
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
        }
      ];

      // Combine and select featured items
      const combinedItems = [...sampleFeaturedItems, ...allItems];
      const featured = combinedItems
        .filter(item => item.featured)
        .slice(0, 6); // Show max 6 featured items

      setFeaturedItems(featured);

    } catch (error) {
      console.error("Error loading home data:", error);
      // Fallback to sample data if there's an error
      setFeaturedItems([
        {
          id: "elec-1",
          name: "Dell Latitude Laptop",
          category: "Electronics & Devices", 
          price: 1200000,
          currencySymbol: "TSh",
          images: ["https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=600"],
          rating: 4.5,
          country: "Tanzania"
        },
        {
          id: "gen-1",
          name: "Men's Running Shoes",
          category: "General Goods",
          price: 85000, 
          currencySymbol: "TSh",
          images: ["https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=600"],
          rating: 4.3,
          country: "Tanzania"
        },
        {
          id: "hotel-1",
          name: "Serengeti Luxury Hotel",
          category: "Building & Hotels", 
          priceRange: "150-300",
          currencySymbol: "$",
          images: ["https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=600"],
          rating: "5",
          country: "Tanzania"
        }
      ]);
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
          console.log("Location access denied");
          // Set default location (Dar es Salaam)
          setUserLocation({ lat: -6.7924, lng: 39.2083 });
        }
      );
    }
  };

  useEffect(() => {
    loadHomeData();
    getUserLocation();
  }, [loadHomeData]);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search-results?q=${encodeURIComponent(searchQuery)}`);
    }
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

  return (
    <div className="min-vh-100">
      {/* Hero Section */}
      <section 
        className="hero-section position-relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 text-white">
              <h1 className="display-4 fw-bold mb-4">
                Find Everything You Need, <span className="text-warning">Anywhere</span>
              </h1>
              <p className="lead mb-4">
                Discover products and services from local businesses and global providers. 
                From electronics to hotels, find exactly what you're looking for.
              </p>
              
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="mb-4">
                <div className="input-group input-group-lg shadow">
                  <input
                    type="text"
                    className="form-control border-0 py-3"
                    placeholder="Search for products, services, hotels..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ fontSize: '1.1rem' }}
                  />
                  <button 
                    className="btn btn-warning text-dark px-4" 
                    type="submit"
                  >
                    <i className="fas fa-search me-2"></i>
                    Search
                  </button>
                </div>
              </form>

              {/* Quick Stats */}
              <div className="row text-center">
                <div className="col-4">
                  <div className="border-end border-white">
                    <h3 className="fw-bold text-warning">500+</h3>
                    <small>Businesses</small>
                  </div>
                </div>
                <div className="col-4">
                  <div className="border-end border-white">
                    <h3 className="fw-bold text-warning">2,000+</h3>
                    <small>Products</small>
                  </div>
                </div>
                <div className="col-4">
                  <div>
                    <h3 className="fw-bold text-warning">100+</h3>
                    <small>Services</small>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-lg-6">
              <div className="position-relative">
                <img 
                  src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Shopping Experience"
                  className="img-fluid rounded-4 shadow-lg"
                  style={{ transform: 'rotate(3deg)' }}
                />
                <div 
                  className="position-absolute top-0 start-0 w-100 h-100 rounded-4"
                  style={{
                    background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
                    backdropFilter: 'blur(10px)'
                  }}
                ></div>
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

      {/* Categories Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-3">Browse by Category</h2>
            <p className="text-muted lead">Find exactly what you're looking for in our organized categories</p>
          </div>

          {isLoading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary mb-3"></div>
              <p>Loading categories...</p>
            </div>
          ) : (
            <div className="row g-4">
              {categories.map((category) => (
                <div key={category.id} className="col-md-4">
                  <div 
                    className="card border-0 shadow-sm h-100 category-card"
                    onClick={() => handleCategoryClick(category.name)}
                    style={{ 
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      background: `linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%), url(${category.image}) center/cover`
                    }}
                  >
                    <div className="card-body text-center p-4 d-flex flex-column justify-content-center">
                      <div className={`icon-container bg-${category.color} bg-opacity-10 rounded-circle mx-auto mb-3`} 
                           style={{ width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className={`fas ${category.icon} fa-2x text-${category.color}`}></i>
                      </div>
                      <h5 className="fw-bold text-dark">{category.name}</h5>
                      <p className="text-muted mb-3">{category.description}</p>
                      <button className={`btn btn-${category.color} btn-sm mt-auto`}>
                        Explore <i className="fas fa-arrow-right ms-2"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Items Section */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-3">Featured Items</h2>
            <p className="text-muted lead">Handpicked products and services you'll love</p>
          </div>

          {isLoading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary mb-3"></div>
              <p>Loading featured items...</p>
            </div>
          ) : (
            <div className="row g-4">
              {featuredItems.length > 0 ? (
                featuredItems.map((item) => (
                  <div key={item.id} className="col-md-6 col-lg-4">
                    <div 
                      className="card border-0 shadow-sm h-100 featured-card"
                      onClick={() => handleFeaturedItemClick(item.id)}
                      style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                    >
                      <div className="position-relative">
                        <img
                          src={item.images && item.images.length > 0 ? item.images[0] : 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=600'}
                          className="card-img-top"
                          alt={item.name}
                          style={{ height: '200px', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.src = 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=600';
                          }}
                        />
                        <div className="position-absolute top-0 end-0 m-2">
                          <span className="badge bg-warning text-dark">
                            <i className="fas fa-star me-1"></i>
                            Featured
                          </span>
                        </div>
                        <div className="position-absolute top-0 start-0 m-2">
                          <span className="badge bg-light text-dark">
                            {getCountryFlag(item.country)} {item.country}
                          </span>
                        </div>
                      </div>
                      
                      <div className="card-body">
                        <h6 className="card-title fw-bold text-dark mb-2">{item.name}</h6>
                        <p className="card-text text-muted small mb-2">
                          {item.description && item.description.length > 80 
                            ? `${item.description.substring(0, 80)}...` 
                            : item.description}
                        </p>
                        
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="fw-bold text-primary">
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
                            <i className="fas fa-map-marker-alt me-1 text-danger"></i>
                            {item.city}
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12 text-center py-5">
                  <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
                  <h5 className="text-muted">No featured items available</h5>
                  <p className="text-muted">Check back later for new featured products and services</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-3">How It Works</h2>
            <p className="text-muted lead">Simple steps to find what you need</p>
          </div>
          
          <div className="row g-4">
            <div className="col-md-4 text-center">
              <div className="bg-primary bg-opacity-10 rounded-circle mx-auto mb-3" 
                   style={{ width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fas fa-search fa-2x text-primary"></i>
              </div>
              <h5 className="fw-bold">Search</h5>
              <p className="text-muted">
                Use our powerful search to find products and services from local and global providers.
              </p>
            </div>
            
            <div className="col-md-4 text-center">
              <div className="bg-success bg-opacity-10 rounded-circle mx-auto mb-3" 
                   style={{ width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fas fa-eye fa-2x text-success"></i>
              </div>
              <h5 className="fw-bold">Discover</h5>
              <p className="text-muted">
                Browse detailed listings with photos, prices, ratings, and business information.
              </p>
            </div>
            
            <div className="col-md-4 text-center">
              <div className="bg-warning bg-opacity-10 rounded-circle mx-auto mb-3" 
                   style={{ width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fas fa-handshake fa-2x text-warning"></i>
              </div>
              <h5 className="fw-bold">Connect</h5>
              <p className="text-muted">
                Contact businesses directly or get directions to their location.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Business CTA Section */}
      <section className="py-5" style={{ background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8 text-white">
              <h3 className="fw-bold mb-3">Are you a business owner?</h3>
              <p className="lead mb-4">
                List your products and services on ProductFinder to reach thousands of potential customers. 
                Join our growing network of businesses today!
              </p>
              <div className="d-flex flex-wrap gap-3">
                <button 
                  className="btn btn-warning btn-lg px-4"
                  onClick={handleBusinessAuth}
                >
                  <i className="fas fa-store me-2"></i>
                  List Your Business
                </button>
                <button 
                  className="btn btn-outline-light btn-lg px-4"
                  onClick={() => navigate('/business-auth')}
                >
                  <i className="fas fa-chart-line me-2"></i>
                  Business Dashboard
                </button>
              </div>
            </div>
            <div className="col-lg-4 text-center">
              <i className="fas fa-rocket fa-6x text-warning opacity-75"></i>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 mb-4">
              <h5 className="fw-bold mb-3">
                <i className="fas fa-globe-americas me-2 text-primary"></i>
                ProductFinder
              </h5>
              <p className="text-light">
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
                <li><Link to="/search" className="text-light text-decoration-none">Search</Link></li>
                <li><Link to="/" className="text-light text-decoration-none">Categories</Link></li>
                <li><a href="#!" className="text-light text-decoration-none">Featured</a></li>
                <li><a href="#!" className="text-light text-decoration-none">Businesses</a></li>
              </ul>
            </div>
            
            <div className="col-lg-2 col-6 mb-4">
              <h6 className="fw-bold mb-3">Business</h6>
              <ul className="list-unstyled">
                <li><Link to="/business-auth" className="text-light text-decoration-none">List Your Business</Link></li>
                <li><Link to="/business-dashboard" className="text-light text-decoration-none">Dashboard</Link></li>
                <li><a href="#!" className="text-light text-decoration-none">Pricing</a></li>
                <li><a href="#!" className="text-light text-decoration-none">Support</a></li>
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
          
          <hr className="my-4" />
          
          <div className="row align-items-center">
            <div className="col-md-6">
              <p className="mb-0 text-light">
                &copy; 2024 ProductFinder. All rights reserved.
              </p>
            </div>
            <div className="col-md-6 text-md-end">
              <a href="#!" className="text-light text-decoration-none me-3">Privacy Policy</a>
              <a href="#!" className="text-light text-decoration-none me-3">Terms of Service</a>
              <a href="#!" className="text-light text-decoration-none">Contact</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Add CDN Links */}
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet" />
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

      <style>
        {`
          .category-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(0,0,0,0.1) !important;
          }
          
          .featured-card:hover {
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
          
          .card {
            transition: all 0.3s ease;
          }
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .fade-in {
            animation: fadeIn 0.6s ease-in;
          }
        `}
      </style>
    </div>
  );
}

export default HomePage1;