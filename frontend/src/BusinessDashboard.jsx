// src/BusinessDashboard.jsx - IMPROVED VERSION WITH WORKING CATEGORY LINKS
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

function BusinessDashboard() {
  const [business, setBusiness] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalServices: 0,
    inStock: 0,
    outOfStock: 0,
    viewsToday: 0,
    totalListings: 0
  });
  const [recentListings, setRecentListings] = useState([]);

  // Categories with proper links
  const categories = {
    "electronics": {
      name: "Electronics & Devices",
      type: "product",
      icon: "fa-microchip",
      color: "primary",
      description: "Laptops, smartphones, electronics with specifications",
      link: "/business-listing/electronics",
      stats: 0
    },
    "general": {
      name: "General Goods", 
      type: "product",
      icon: "fa-tshirt",
      color: "warning",
      description: "Clothing, shoes, items without technical specifications",
      link: "/business-listing/general",
      stats: 0
    },
    "vehicles": {
      name: "Vehicles",
      type: "product",
      icon: "fa-car",
      color: "danger",
      description: "Cars, motorcycles, bicycles, airplanes, vehicles",
      link: "/business-listing/vehicles",
      stats: 0
    },
    "building": {
      name: "Building & Hotels",
      type: "service",
      icon: "fa-building",
      color: "success",
      description: "Hotels, apartments, luxury properties with services",
      link: "/business-listing/building",
      stats: 0
    }
  };

  const navigate = useNavigate();

  // Initialize dashboard
  useEffect(() => {
    const initializeDashboard = async () => {
      const isAuthenticated = localStorage.getItem('businessAuthenticated') === 'true';
      const businessData = JSON.parse(localStorage.getItem('currentBusiness'));
      
      if (!isAuthenticated || !businessData) {
        navigate('/business-auth');
        return;
      }

      setBusiness(businessData);
      await loadStats(businessData.id);
      await loadRecentListings(businessData.id);
    };

    initializeDashboard();
  }, [navigate]);

  // Load stats and category counts
  const loadStats = async (businessId) => {
    try {
      const savedProducts = JSON.parse(localStorage.getItem(`products_${businessId}`)) || [];
      const savedServices = JSON.parse(localStorage.getItem(`services_${businessId}`)) || [];
      
      const totalProducts = savedProducts.length;
      const totalServices = savedServices.length;
      const inStock = savedProducts.filter(p => p.stock > 0).length;
      const outOfStock = savedProducts.filter(p => p.stock === 0).length;
      const totalListings = totalProducts + totalServices;

      // Calculate category counts
      const categoryCounts = { ...categories };
      Object.keys(categoryCounts).forEach(key => {
        categoryCounts[key].stats = savedProducts.filter(p => p.category === categoryCounts[key].name).length + 
                                   savedServices.filter(s => s.category === categoryCounts[key].name).length;
      });

      setStats({
        totalProducts,
        totalServices,
        inStock,
        outOfStock,
        viewsToday: Math.floor(Math.random() * 50) + totalListings,
        totalListings
      });

    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  // Load recent listings
  const loadRecentListings = async (businessId) => {
    try {
      const savedProducts = JSON.parse(localStorage.getItem(`products_${businessId}`)) || [];
      const savedServices = JSON.parse(localStorage.getItem(`services_${businessId}`)) || [];
      
      const allListings = [...savedProducts, ...savedServices]
        .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))
        .slice(0, 5);
      
      setRecentListings(allListings);
    } catch (error) {
      console.error("Error loading recent listings:", error);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('businessAuthenticated');
    localStorage.removeItem('currentBusiness');
    navigate('/');
  };

  // Format price for display
  const formatPrice = (item) => {
    if (item.type === 'service') {
      return `${item.currencySymbol || '$'} ${item.priceRange}`;
    }
    return `${item.currencySymbol || '$'} ${item.price?.toLocaleString() || '0'}`;
  };

  // Get category icon
  const getCategoryIcon = (categoryName) => {
    const category = Object.values(categories).find(cat => cat.name === categoryName);
    return category?.icon || 'fa-box';
  };

  // Get category color
  const getCategoryColor = (categoryName) => {
    const category = Object.values(categories).find(cat => cat.name === categoryName);
    return category?.color || 'secondary';
  };

  if (!business) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100" style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      }}>
        <div className="text-center text-white">
          <div className="spinner-border mb-3" style={{ width: '3rem', height: '3rem' }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h5>Loading Dashboard...</h5>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100" style={{ 
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      minHeight: '100vh'
    }}>
      {/* Add CDN Links */}
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet" />
      
      {/* Header */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark bg-opacity-90 shadow">
        <div className="container">
          <Link className="navbar-brand fw-bold d-flex align-items-center" to="/">
            
            <span>BisRun Business</span>
          </Link>
          <div className="d-flex align-items-center">
            <div className="dropdown">
              <button className="btn btn-outline-light dropdown-toggle d-flex align-items-center" type="button" data-bs-toggle="dropdown">
                <i className="fas fa-user-circle me-2"></i>
                <span className="d-none d-md-inline">{business.businessName}</span>
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <Link className="dropdown-item" to="/">
                    <i className="fas fa-home me-2"></i>
                    Back to Home
                  </Link>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button className="dropdown-item text-danger" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt me-2"></i>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container-fluid py-4">
        <div className="row g-4">


          {/* Main Content Area */}
          <div className="col-lg-9 col-md-8">
            {/* Welcome Header */}
            <div className="card shadow-lg border-0 mb-4">
              <div className="card-body p-4">
                <div className="row align-items-center">
                  <div className="col-md-8">
                    <h3 className="fw-bold text-dark mb-2">
                      Welcome back, {business.businessName}! 👋
                    </h3>
                    <p className="text-muted mb-0">
                      Manage your inventory, track performance, and grow your business.
                    </p>
                  </div>
                  <div className="col-md-4 text-md-end">
                    <div className="bg-primary bg-opacity-10 rounded p-3 d-inline-block">
                      <h4 className="fw-bold text-primary mb-0">{stats.totalListings}</h4>
                      <small className="text-muted">Active Listings</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Selection */}
            <div className="card shadow-lg border-0 mb-4">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="card-title fw-bold text-dark mb-0">
                    <i className="fas fa-layer-group me-2 text-primary"></i>
                    Manage Your Inventory
                  </h4>
                  <span className="badge bg-primary">
                    {stats.totalListings} Total Items
                  </span>
                </div>
                
                <div className="row g-4">
                  {Object.entries(categories).map(([key, category]) => (
                    <div key={key} className="col-xl-3 col-lg-6">
                      <Link 
                        to={category.link}
                        className="text-decoration-none"
                      >
                        <div 
                          className="card category-card border-0 cursor-pointer h-100 transition-all position-relative"
                          style={{
                            background: 'white',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            border: 'none',
                            minHeight: '200px'
                          }}
                        >
                          <div className="card-body text-center p-4 d-flex flex-column">
                            <div className={`mb-3 text-${category.color}`}>
                              <i className={`fas ${category.icon} fa-3x`}></i>
                            </div>
                            <h6 className="fw-bold text-dark mb-2 flex-grow-1">
                              {category.name}
                            </h6>
                            <small className="text-muted mb-3">
                              {category.description}
                            </small>
                            <div className="mt-auto">
                              <span className={`badge bg-${category.color} text-white px-3 py-2`}>
                                <i className="fas fa-plus me-1"></i>
                                List New Item
                              </span>
                              {category.stats > 0 && (
                                <div className="mt-2">
                                  <small className="text-muted">
                                    {category.stats} items listed
                                  </small>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Stats Overview and Recent Listings */}
            <div className="row g-4">
              {/* Quick Stats Summary */}
              <div className="col-lg-6">
                <div className="card shadow-lg border-0 h-100">
                  <div className="card-body">
                    <h5 className="fw-bold text-dark mb-4 d-flex align-items-center">
                      <i className="fas fa-chart-bar me-2 text-primary"></i>
                      Business Overview
                    </h5>
                    <div className="row g-3">
                      <div className="col-6">
                        <div className="bg-primary bg-opacity-10 rounded p-3 text-center">
                          <i className="fas fa-cube fa-2x text-primary mb-2"></i>
                          <h4 className="fw-bold text-primary mb-0">{stats.totalProducts}</h4>
                          <small className="text-muted">Total Products</small>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="bg-success bg-opacity-10 rounded p-3 text-center">
                          <i className="fas fa-concierge-bell fa-2x text-success mb-2"></i>
                          <h4 className="fw-bold text-success mb-0">{stats.totalServices}</h4>
                          <small className="text-muted">Total Services</small>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="bg-warning bg-opacity-10 rounded p-3 text-center">
                          <i className="fas fa-box-open fa-2x text-warning mb-2"></i>
                          <h4 className="fw-bold text-warning mb-0">{stats.inStock}</h4>
                          <small className="text-muted">Items In Stock</small>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="bg-info bg-opacity-10 rounded p-3 text-center">
                          <i className="fas fa-eye fa-2x text-info mb-2"></i>
                          <h4 className="fw-bold text-info mb-0">{stats.viewsToday}</h4>
                          <small className="text-muted">Views Today</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Listings */}
              <div className="col-lg-6">
                <div className="card shadow-lg border-0 h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h5 className="fw-bold text-dark mb-0 d-flex align-items-center">
                        <i className="fas fa-clock me-2 text-primary"></i>
                        Recent Listings
                      </h5>
                      <span className="badge bg-primary">{recentListings.length}</span>
                    </div>
                    
                    {recentListings.length > 0 ? (
                      <div className="list-group list-group-flush">
                        {recentListings.map((listing, index) => (
                          <div key={index} className="list-group-item border-0 px-0 py-3">
                            <div className="d-flex align-items-center">
                              <div className={`bg-${getCategoryColor(listing.category)} bg-opacity-10 rounded p-2 me-3`}>
                                <i className={`fas ${getCategoryIcon(listing.category)} text-${getCategoryColor(listing.category)}`}></i>
                              </div>
                              <div className="flex-grow-1">
                                <h6 className="fw-bold text-dark mb-1 small">
                                  {listing.name}
                                </h6>
                                <div className="d-flex justify-content-between align-items-center">
                                  <span className="text-success fw-bold small">
                                    {formatPrice(listing)}
                                  </span>
                                  <span className={`badge bg-${listing.type === 'service' ? 'success' : 'primary'} small`}>
                                    {listing.type}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
                        <p className="text-muted mb-0">No listings yet</p>
                        <small className="text-muted">Start by adding your first item!</small>
                      </div>
                    )}
                    
                    {recentListings.length > 0 && (
                      <div className="text-center mt-3">
                        <button className="btn btn-outline-primary btn-sm">
                          View All Listings
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

      {/* Custom Styles */}
      <style jsx>{`
        .category-card {
          transition: all 0.3s ease;
          border: none !important;
        }
        .category-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 35px rgba(0,0,0,0.15) !important;
        }
        
        .card {
          border-radius: 20px !important;
          overflow: hidden;
        }
        
        .bg-opacity-10 {
          background-color: rgba(var(--bs-primary-rgb), 0.1) !important;
        }
        
        .list-group-item.active {
          border-radius: 15px !important;
        }
        
        .cursor-pointer {
          cursor: pointer;
        }
        
        .transition-all {
          transition: all 0.3s ease;
        }

        /* Custom hover effects */
        .category-card:hover .fa-3x {
          transform: scale(1.1);
          transition: transform 0.3s ease;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .container-fluid {
            padding-left: 12px;
            padding-right: 12px;
          }
          
          .card-body {
            padding: 1.5rem !important;
          }
          
          .col-lg-3, .col-lg-9 {
            margin-bottom: 1rem;
          }
        }
      `}</style>
    </div>
  );
}

export default BusinessDashboard;