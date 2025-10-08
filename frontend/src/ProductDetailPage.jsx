// src/ProductDetailPage.jsx - RESPONSIVE DESIGN FOR MOBILE & LAPTOP
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

  // Load item data
  const loadItemData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load all items from localStorage
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

      // Add comprehensive sample items
      const sampleItems = createSampleItems();
      
      // Combine all items
      const combinedItems = [...sampleItems, ...allItems];
      
      // Find the requested item
      const foundItem = combinedItems.find(item => item.id === productId);
      
      if (foundItem) {
        setItem(foundItem);
        
        // Find related items (same category)
        const related = combinedItems
          .filter(p => 
            p.id !== productId && 
            p.category === foundItem.category
          )
          .slice(0, 6);
        setRelatedItems(related);
      } else {
        setError("Item not found");
      }
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

  useEffect(() => {
    loadItemData();
  }, [loadItemData]);

  const getItemImages = (item) => {
    if (item && item.images && item.images.length > 0) {
      return item.images;
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
      <div className="min-vh-100 d-flex justify-content-center align-items-center" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="text-center text-white">
          <div className="spinner-border mb-3" style={{ width: '3rem', height: '3rem' }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h5>Loading Product Details...</h5>
          <p className="text-light">Please wait while we fetch the item information</p>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="text-center text-white">
          <i className="fas fa-exclamation-triangle fa-3x mb-3"></i>
          <h3>{error || "Product Not Found"}</h3>
          <p className="text-light">The product you're looking for doesn't exist or may have been removed.</p>
          <div className="d-flex gap-3 justify-content-center">
            <button className="btn btn-light" onClick={() => navigate('/search')}>
              <i className="fas fa-arrow-left me-2"></i>
              Back to Search
            </button>
            <button className="btn btn-outline-light" onClick={() => navigate('/')}>
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
    <div className="min-vh-100" style={{ background: '#f8f9fa' }}>
      {/* Modern Header */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
        <div className="container">
          <Link className="navbar-brand fw-bold text-primary" to="/">
            <i className="fas fa-globe-americas me-2"></i>
            ProductFinder
          </Link>
          <div className="navbar-nav ms-auto">
            <button className="btn btn-outline-primary btn-sm" onClick={() => navigate('/search')}>
              <i className="fas fa-arrow-left me-2"></i>
              Back to Search
            </button>
          </div>
        </div>
      </nav>

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
          {/* Image Gallery - RESPONSIVE DESIGN */}
          <div className="col-lg-7 col-xl-8">
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="card-body p-0">
                {/* Main Large Image - RESPONSIVE HEIGHT */}
                <div 
                  className="main-image-container position-relative cursor-pointer"
                  onClick={() => openImageModal(selectedImageIndex)}
                  style={{ 
                    height: 'clamp(300px, 40vh, 500px)', // Responsive height
                    background: `url(${itemImages[selectedImageIndex]}) center/contain no-repeat`,
                    backgroundColor: '#f8f9fa',
                    cursor: 'zoom-in'
                  }}
                >
                  {/* Image Overlay */}
                  <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                    style={{ background: 'rgba(0,0,0,0.1)', transition: 'all 0.3s ease' }}>
                    <div className="text-white text-center" style={{ opacity: 0.8 }}>
                      <i className="fas fa-search-plus fa-lg mb-2 d-none d-md-block"></i>
                      <i className="fas fa-search-plus mb-2 d-md-none"></i>
                      <p className="mb-0 small d-none d-sm-block">Click to enlarge</p>
                    </div>
                  </div>

                  {/* Image Navigation - RESPONSIVE SIZE */}
                  {itemImages.length > 1 && (
                    <>
                      <button 
                        className="btn btn-light rounded-circle position-absolute top-50 start-0 translate-middle-y ms-2 ms-lg-3 shadow d-none d-md-flex"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateImage('prev');
                        }}
                        style={{ width: 'clamp(40px, 4vw, 50px)', height: 'clamp(40px, 4vw, 50px)' }}
                      >
                        <i className="fas fa-chevron-left"></i>
                      </button>
                      <button 
                        className="btn btn-light rounded-circle position-absolute top-50 end-0 translate-middle-y me-2 me-lg-3 shadow d-none d-md-flex"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateImage('next');
                        }}
                        style={{ width: 'clamp(40px, 4vw, 50px)', height: 'clamp(40px, 4vw, 50px)' }}
                      >
                        <i className="fas fa-chevron-right"></i>
                      </button>
                    </>
                  )}

                  {/* Image Counter */}
                  <div className="position-absolute bottom-0 end-0 m-2 m-lg-3">
                    <span className="badge bg-dark bg-opacity-75 text-white px-3 py-2 rounded-pill">
                      {selectedImageIndex + 1} / {itemImages.length}
                    </span>
                  </div>
                </div>

                {/* Thumbnail Gallery - RESPONSIVE */}
                {itemImages.length > 1 && (
                  <div className="p-3 bg-light">
                    <div className="d-flex gap-2 overflow-auto pb-2">
                      {itemImages.map((img, index) => (
                        <div 
                          key={index}
                          className={`thumbnail-item flex-shrink-0 cursor-pointer ${selectedImageIndex === index ? 'active' : ''}`}
                          onClick={() => setSelectedImageIndex(index)}
                          style={{ 
                            width: 'clamp(60px, 8vw, 80px)', 
                            height: 'clamp(60px, 8vw, 80px)',
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
              </div>
            </div>
          </div>

          {/* Product Information - RESPONSIVE DESIGN */}
          <div className="col-lg-5 col-xl-4">
            <div className="card border-0 shadow-lg rounded-4 h-100">
              <div className="card-body p-3 p-lg-4 d-flex flex-column">
                {/* Category and Status */}
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <span className={`badge bg-${categoryBadgeColor} px-3 py-2 rounded-pill`}>
                    <i className={`fas ${categoryIcon} me-2`}></i>
                    <span className="d-none d-sm-inline">{item.category}</span>
                    <span className="d-sm-none">{item.category.split(' ')[0]}</span>
                  </span>
                  {item.type === 'product' ? (
                    <span className={`badge ${item.stock > 0 ? 'bg-success' : 'bg-danger'} px-3 py-2`}>
                      {item.stock > 0 ? '🟢 In Stock' : '🔴 Out of Stock'}
                    </span>
                  ) : (
                    <span className="badge bg-info px-3 py-2">
                      <i className="fas fa-concierge-bell me-1"></i>
                      <span className="d-none d-sm-inline">Service Available</span>
                      <span className="d-sm-none">Available</span>
                    </span>
                  )}
                </div>

                {/* Product Title */}
                <h1 className="h2 fw-bold text-dark mb-3" style={{ lineHeight: '1.3', fontSize: 'clamp(1.5rem, 2.5vw, 2rem)' }}>
                  {item.name}
                </h1>

                {/* Rating and Reviews */}
                <div className="d-flex align-items-center mb-3 flex-wrap">
                  <div className="d-flex align-items-center me-3 mb-1">
                    <div className="me-2">
                      {renderStars(item.rating || 4.0)}
                    </div>
                    <span className="fw-bold text-dark">{item.rating || 4.0}</span>
                  </div>
                  <span className="text-muted me-3 mb-1">({item.reviews || 0} reviews)</span>
                  <span className="badge bg-light text-dark mb-1">
                    {getCountryFlag(item.country)} {item.country}
                  </span>
                </div>

                {/* Price Section */}
                <div className="mb-4">
                  <h2 className="text-success fw-bold mb-2" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)' }}>
                    {formatPrice(item)}
                  </h2>
                  {item.type === 'product' && (
                    <small className="text-muted">
                      <i className="fas fa-receipt me-1"></i>
                      Inclusive of all taxes
                    </small>
                  )}
                </div>

                {/* Quick Info */}
                <div className="row g-3 mb-4">
                  {item.brand && (
                    <div className="col-sm-6 col-12">
                      <div className="d-flex align-items-center text-muted">
                        <i className="fas fa-tag me-2 text-primary"></i>
                        <small>Brand: {item.brand}</small>
                      </div>
                    </div>
                  )}
                  {item.condition && (
                    <div className="col-sm-6 col-12">
                      <div className="d-flex align-items-center text-muted">
                        <i className="fas fa-certificate me-2 text-warning"></i>
                        <small>Condition: {item.condition}</small>
                      </div>
                    </div>
                  )}
                  {item.vehicleType && (
                    <div className="col-sm-6 col-12">
                      <div className="d-flex align-items-center text-muted">
                        <i className="fas fa-car me-2 text-danger"></i>
                        <small>Type: {item.vehicleType}</small>
                      </div>
                    </div>
                  )}
                  {item.serviceType && (
                    <div className="col-sm-6 col-12">
                      <div className="d-flex align-items-center text-muted">
                        <i className="fas fa-building me-2 text-success"></i>
                        <small>Service: {item.serviceType}</small>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="d-grid gap-2 mb-4">
                  <button 
                    className="btn btn-primary btn-lg py-3 fw-bold rounded-pill"
                    onClick={handleContactBusiness}
                    style={{ fontSize: 'clamp(1rem, 1.5vw, 1.1rem)' }}
                  >
                    <i className="fas fa-phone-alt me-2"></i>
                    Contact Business
                  </button>
                  <button 
                    className="btn btn-outline-primary btn-lg py-3 fw-bold rounded-pill"
                    onClick={handleGetDirections}
                  >
                    <i className="fas fa-map-marker-alt me-2"></i>
                    Get Directions
                  </button>
                </div>

                {/* Business Info Card */}
                <div className="card bg-light border-0 rounded-3 mt-auto">
                  <div className="card-body">
                    <h6 className="fw-bold mb-3 d-flex align-items-center">
                      <i className="fas fa-store me-2 text-primary"></i>
                      {item.businessName || item.business}
                    </h6>
                    <div className="row small text-muted">
                      <div className="col-12 mb-2">
                        <i className="fas fa-map-marker-alt me-1"></i>
                        {item.businessAddress || item.address}, {item.city}, {item.country}
                      </div>
                      <div className="col-6">
                        <i className="fas fa-star me-1 text-warning"></i>
                        {item.rating || 4.0}/5 Rating
                      </div>
                      <div className="col-6">
                        <i className="fas fa-check-circle me-1 text-success"></i>
                        Verified Business
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details Tabs - RESPONSIVE DESIGN */}
        <div className="row mt-4">
          <div className="col-12">
            <div className="card border-0 shadow-lg rounded-4">
              <div className="card-header bg-white border-0 py-3">
                <div className="nav nav-pills nav-fill gap-2 p-1 bg-light rounded-3 flex-nowrap overflow-auto">
                  <button 
                    className={`nav-link rounded-2 text-nowrap ${activeTab === 'details' ? 'active bg-primary text-white' : 'text-dark'}`}
                    onClick={() => setActiveTab('details')}
                  >
                    <i className="fas fa-info-circle me-2"></i>
                    Details
                  </button>
                  {item.requiresSpecifications && item.specifications && (
                    <button 
                      className={`nav-link rounded-2 text-nowrap ${activeTab === 'specs' ? 'active bg-primary text-white' : 'text-dark'}`}
                      onClick={() => setActiveTab('specs')}
                    >
                      <i className="fas fa-list-alt me-2"></i>
                      Specifications
                    </button>
                  )}
                  <button 
                    className={`nav-link rounded-2 text-nowrap ${activeTab === 'features' ? 'active bg-primary text-white' : 'text-dark'}`}
                    onClick={() => setActiveTab('features')}
                  >
                    <i className="fas fa-star me-2"></i>
                    Features
                  </button>
                  {item.type === 'service' && (
                    <button 
                      className={`nav-link rounded-2 text-nowrap ${activeTab === 'amenities' ? 'active bg-primary text-white' : 'text-dark'}`}
                      onClick={() => setActiveTab('amenities')}
                    >
                      <i className="fas fa-concierge-bell me-2"></i>
                      Amenities
                    </button>
                  )}
                </div>
              </div>
              <div className="card-body p-3 p-lg-4">
                {activeTab === 'details' && (
                  <div>
                    <h5 className="fw-bold mb-4 text-dark">Product Description</h5>
                    <p className="text-muted lead" style={{ lineHeight: '1.8', fontSize: 'clamp(1rem, 1.2vw, 1.1rem)' }}>
                      {item.description || 'No description available.'}
                    </p>
                    {item.type === 'service' && item.policies && (
                      <div className="mt-5">
                        <h6 className="fw-bold mb-3 text-dark">Policies & Information</h6>
                        <div className="bg-light p-4 rounded-3">
                          <pre className="text-muted small mb-0" style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', lineHeight: '1.6' }}>
                            {item.policies}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'specs' && item.specifications && (
                  <div>
                    <h5 className="fw-bold mb-4 text-dark">Technical Specifications</h5>
                    <div className="row g-3">
                      {item.specifications.map((spec, index) => {
                        const { key, value } = formatSpecification(spec);
                        return (
                          <div key={index} className="col-md-6 col-12">
                            <div className="card bg-light border-0 h-100">
                              <div className="card-body">
                                <div className="d-flex justify-content-between align-items-start">
                                  <span className="fw-medium text-muted">{key}</span>
                                  <span className="fw-bold text-dark text-end">{value}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {activeTab === 'features' && (
                  <div>
                    <h5 className="fw-bold mb-4 text-dark">
                      {item.type === 'service' ? 'Services & Features' : 'Product Features'}
                    </h5>
                    <div className="row g-3">
                      {(item.features || []).map((feature, index) => (
                        <div key={index} className="col-lg-4 col-md-6 col-12">
                          <div className="card border-0 bg-primary bg-opacity-10 h-100">
                            <div className="card-body text-center">
                              <div className="d-flex align-items-center justify-content-center">
                                <i className="fas fa-check-circle text-success me-2"></i>
                                <span className="fw-medium">{feature}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'amenities' && item.type === 'service' && (
                  <div>
                    <div className="row g-4">
                      <div className="col-lg-6 col-12">
                        <h6 className="fw-bold mb-3 text-dark">
                          <i className="fas fa-spa me-2 text-success"></i>
                          Amenities
                        </h6>
                        <div className="row g-2">
                          {(item.amenities || []).map((amenity, index) => (
                            <div key={index} className="col-12">
                              <div className="card bg-light border-0">
                                <div className="card-body py-2">
                                  <div className="d-flex align-items-center">
                                    <i className="fas fa-check text-success me-3"></i>
                                    <span>{amenity}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="col-lg-6 col-12">
                        <h6 className="fw-bold mb-3 text-dark">
                          <i className="fas fa-concierge-bell me-2 text-primary"></i>
                          Services
                        </h6>
                        <div className="row g-2">
                          {(item.services || []).map((service, index) => (
                            <div key={index} className="col-12">
                              <div className="card bg-light border-0">
                                <div className="card-body py-2">
                                  <div className="d-flex align-items-center">
                                    <i className="fas fa-bell text-primary me-3"></i>
                                    <span>{service}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
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
          <div className="row mt-5">
            <div className="col-12">
              <div className="card border-0 shadow-lg rounded-4">
                <div className="card-header bg-white border-0 py-4">
                  <h5 className="fw-bold mb-0 d-flex align-items-center">
                    <i className="fas fa-th-large me-3 text-primary"></i>
                    Related Products
                  </h5>
                </div>
                <div className="card-body">
                  <div className="row g-4">
                    {relatedItems.map(relatedItem => (
                      <div key={relatedItem.id} className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-6">
                        <div 
                          className="card h-100 border-0 shadow-sm rounded-3 cursor-pointer product-card"
                          onClick={() => navigate(`/product/${relatedItem.id}`)}
                          style={{ 
                            cursor: 'pointer', 
                            transition: 'all 0.3s ease',
                            border: '1px solid #f0f0f0'
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
                          <div className="position-relative">
                            <img 
                              src={getItemImages(relatedItem)[0]} 
                              className="card-img-top rounded-top-3"
                              alt={relatedItem.name}
                              style={{ height: '150px', objectFit: 'cover' }}
                              onError={(e) => {
                                e.target.src = 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=800';
                              }}
                            />
                            <div className="position-absolute top-0 start-0 m-2">
                              <span className={`badge bg-${getCategoryBadgeColor(relatedItem.category)} text-white`}>
                                <i className={`fas ${getCategoryIcon(relatedItem.category)} me-1`}></i>
                                {relatedItem.category.split(' ')[0]}
                              </span>
                            </div>
                          </div>
                          <div className="card-body d-flex flex-column">
                            <h6 className="card-title fw-bold text-dark mb-2" style={{ fontSize: '0.9rem', lineHeight: '1.3' }}>
                              {relatedItem.name.length > 50 ? `${relatedItem.name.substring(0, 50)}...` : relatedItem.name}
                            </h6>
                            <p className="card-text text-success fw-bold mb-2">
                              {formatPrice(relatedItem)}
                            </p>
                            <div className="mt-auto">
                              <div className="d-flex justify-content-between align-items-center small text-muted">
                                <span>
                                  <i className="fas fa-map-marker-alt me-1"></i>
                                  {relatedItem.city || relatedItem.region}
                                </span>
                                <span>
                                  {renderStars(relatedItem.rating || 4.0)}
                                </span>
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

      {/* Image Modal for Full Screen View */}
      {showImageModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.9)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-xl m-0">
            <div className="modal-content bg-transparent border-0">
              <div className="modal-header border-0 position-absolute top-0 end-0 z-3">
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={closeImageModal}
                ></button>
              </div>
              <div className="modal-body p-0 d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
                <img 
                  src={itemImages[selectedImageIndex]} 
                  alt="Full size product view"
                  className="img-fluid"
                  style={{ maxWidth: '90%', maxHeight: '80vh', objectFit: 'contain' }}
                />
                {itemImages.length > 1 && (
                  <div className="position-absolute bottom-0 start-50 translate-middle-x mb-4">
                    <button 
                      className="btn btn-light rounded-circle me-2"
                      onClick={() => navigateImage('prev')}
                      style={{ width: '50px', height: '50px' }}
                    >
                      <i className="fas fa-chevron-left"></i>
                    </button>
                    <span className="text-white mx-2">
                      {selectedImageIndex + 1} / {itemImages.length}
                    </span>
                    <button 
                      className="btn btn-light rounded-circle ms-2"
                      onClick={() => navigateImage('next')}
                      style={{ width: '50px', height: '50px' }}
                    >
                      <i className="fas fa-chevron-right"></i>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom CSS */}
      <style jsx>{`
        .main-image-container:hover .hover-opacity-100 {
          opacity: 1 !important;
        }
        
        .thumbnail-item:hover {
          border-color: #007bff !important;
          transform: scale(1.05);
        }
        
        .thumbnail-item.active {
          border-color: #007bff !important;
          box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
        }
        
        .product-card {
          transition: all 0.3s ease;
        }
        
        .product-card:active {
          transform: scale(0.98);
        }
        
        .cursor-pointer {
          cursor: pointer;
        }
        
        .object-fit-cover {
          object-fit: cover;
        }

        /* Responsive optimizations */
        @media (max-width: 576px) {
          .container {
            padding-left: 12px;
            padding-right: 12px;
          }
        }
        
        @media (min-width: 1200px) {
          .container {
            max-width: 1140px;
          }
        }
        
        @media (min-width: 1400px) {
          .container {
            max-width: 1320px;
          }
        }
      `}</style>
    </div>
  );
}

export default ProductDetailPage;