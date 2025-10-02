// src/ProductDetailPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

function ProductDetailPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [relatedItems, setRelatedItems] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState("details");
  const [loading, setLoading] = useState(true);

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

  // MIFANO YA BIDHAA ZOTE NA BUILDING & HOTEL
  const sampleItems = [
    // ELECTRONICS & DEVICES
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
      images: [
        "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/303383/pexels-photo-303383.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/1229861/pexels-photo-1229861.jpeg?auto=compress&cs=tinysrgb&w=800"
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
      images: [
        "https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/47261/pexels-photo-47261.jpeg?auto=compress&cs=tinysrgb&w=800"
      ],
      lastUpdated: "2024-01-14",
      description: "Latest iPhone with titanium design and advanced camera system. Experience unparalleled performance with the A17 Pro chip and capture stunning photos with the 48MP main camera.",
      specifications: [
        "Display: 6.7-inch Super Retina XDR",
        "Chip: A17 Pro",
        "Storage: 256GB",
        "Camera: 48MP Main + 12MP Ultra Wide + 12MP Telephoto",
        "Battery: Up to 29 hours video playback",
        "Connectivity: 5G, Wi-Fi 6E, Bluetooth 5.3"
      ],
      features: [
        "Titanium Design",
        "48MP Camera System", 
        "5G Connectivity",
        "Face ID",
        "iOS 17",
        "Ceramic Shield Protection"
      ],
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
      images: [
        "https://images.pexels.com/photos/47261/pexels-photo-47261.jpeg?auto=compress&cs=tinysrgb&w=800"
      ],
      lastUpdated: "2024-01-16",
      description: "Latest Samsung flagship with AI features and premium design.",
      specifications: [
        "Display: 6.2-inch Dynamic AMOLED",
        "Chip: Snapdragon 8 Gen 3",
        "Storage: 256GB",
        "Camera: 50MP Main + 12MP Ultra Wide + 10MP Telephoto",
        "Battery: 4000mAh",
        "Connectivity: 5G, Wi-Fi 6E"
      ],
      features: [
        "AI Photography",
        "5G Connectivity",
        "Wireless Charging",
        "IP68 Water Resistance"
      ],
      brand: "Samsung",
      condition: "new",
      requiresSpecifications: true,
      rating: 4.6,
      reviews: 32,
      type: "product"
    },

    // GENERAL GOODS
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
      images: [
        "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=800"
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
      images: [
        "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=800"
      ],
      lastUpdated: "2024-01-13",
      description: "Luxury designer handbag made from genuine leather. Features multiple compartments for organized storage and an elegant design suitable for both casual and formal occasions.",
      features: [
        "Genuine Leather Material",
        "Multiple Compartments",
        "Adjustable Shoulder Strap", 
        "Secure Zipper Closure",
        "Elegant Design",
        "Durable Construction"
      ],
      brand: "StyleCraft",
      condition: "new",
      size: "Medium (30cm x 20cm x 10cm)",
      color: "Brown, Black, Navy Blue",
      material: "Genuine Leather",
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
      images: [
        "https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=800"
      ],
      lastUpdated: "2024-01-15",
      description: "Premium running shoes with air cushioning technology for maximum comfort.",
      features: [
        "Air Cushioning",
        "Breathable Material",
        "Durable Sole",
        "Multiple Color Options"
      ],
      brand: "Nike",
      condition: "new",
      size: "M",
      color: "White/Red",
      material: "Synthetic",
      requiresSpecifications: false,
      rating: 4.7,
      reviews: 28,
      type: "product"
    },

    // BUILDING & HOTELS
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
      images: [
        "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=800"
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
      images: [
        "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/279719/pexels-photo-279719.jpeg?auto=compress&cs=tinysrgb&w=800"
      ],
      lastUpdated: "2024-01-14",
      description: "Modern luxury apartments with business facilities in the heart of Dar es Salaam. Perfect for business travelers and extended stays. Each apartment features fully equipped kitchens, comfortable living areas, and dedicated workspaces.",
      amenities: [
        "Fully Equipped Kitchen",
        "Free High-Speed WiFi", 
        "Modern Gym Facility",
        "Secure Parking",
        "24/7 Security",
        "Swimming Pool",
        "Laundry Facilities",
        "Balcony with City Views"
      ],
      services: [
        "Daily Cleaning Service",
        "Concierge Service",
        "Business Center Access",
        "Airport Pickup/Dropoff",
        "Grocery Delivery",
        "Taxi Service",
        "Tour Arrangements"
      ],
      contactInfo: "+255 712 345 678 | bookings@kilimanjarosuites.com | www.kilimanjarosuites.com",
      capacity: "2-4 guests per apartment (Studio, 1BR, 2BR available)",
      rating: "4",
      checkInTime: "15:00",
      checkOutTime: "11:00",
      policies: "Minimum 2-night stay\nNo smoking in apartments\nSecurity deposit required\nFree cancellation up to 48 hours before check-in",
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
      images: [
        "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800"
      ],
      lastUpdated: "2024-01-16",
      description: "Luxury apartments in the heart of Manhattan with stunning city views and premium amenities.",
      amenities: [
        "City Views",
        "Fitness Center",
        "Concierge",
        "High-Speed WiFi",
        "Rooftop Terrace",
        "Business Center"
      ],
      services: [
        "24/7 Concierge",
        "Housekeeping",
        "Room Service",
        "Business Center",
        "Valet Parking"
      ],
      contactInfo: "+1 212 555 7890 | info@nyluxurysuites.com",
      capacity: "2-6 guests per suite",
      rating: "4.8",
      checkInTime: "15:00",
      checkOutTime: "11:00",
      policies: "Flexible cancellation policy\nMinimum 2-night stay",
      type: "service"
    }
  ];

  useEffect(() => {
    const findItem = () => {
      setLoading(true);
      
      // Check sample items first
      const foundItem = sampleItems.find(p => p.id === productId);
      
      if (foundItem) {
        setItem(foundItem);
        
        // Find related items (same category and country)
        const related = sampleItems
          .filter(p => p.id !== productId && p.category === foundItem.category && p.country === foundItem.country)
          .slice(0, 4);
        setRelatedItems(related);
      } else {
        // If not found in samples, check localStorage
        const allBusinesses = JSON.parse(localStorage.getItem('verifiedBusinesses')) || [];
        let allItems = [];
        
        allBusinesses.forEach(business => {
          const businessProducts = JSON.parse(localStorage.getItem(`products_${business.id}`)) || [];
          const businessServices = JSON.parse(localStorage.getItem(`services_${business.id}`)) || [];
          allItems = [...allItems, ...businessProducts, ...businessServices];
        });

        const storedItem = allItems.find(p => p.id === productId);
        
        if (storedItem) {
          setItem(storedItem);
          const related = allItems
            .filter(p => p.id !== productId && p.category === storedItem.category && p.country === storedItem.country)
            .slice(0, 4);
          setRelatedItems(related);
        } else {
          navigate('/search');
        }
      }
      
      setLoading(false);
    };

    findItem();
  }, [productId, navigate]);

  const getItemImages = (item) => {
    if (item.images && item.images.length > 0) {
      return item.images;
    }
    
    // Default images based on category
    switch(item.category) {
      case 'Electronics & Devices':
        return [
          "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800",
          "https://images.pexels.com/photos/303383/pexels-photo-303383.jpeg?auto=compress&cs=tinysrgb&w=800"
        ];
      case 'General Goods':
        return [
          "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=800",
          "https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=800"
        ];
      case 'Building & Hotels':
        return [
          "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800",
          "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800"
        ];
      default:
        return [
          "https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=800"
        ];
    }
  };

  const itemImages = item ? getItemImages(item) : [];

  const handleContactBusiness = () => {
    const phoneNumber = item.businessPhone || "+255754000000";
    const email = item.businessEmail || `${item.business?.toLowerCase().replace(/\s+/g, '')}@email.com`;
    const address = item.businessAddress || item.address;
    
    alert(`Contact Information:\n\nBusiness: ${item.business}\nPhone: ${phoneNumber}\nEmail: ${email}\nAddress: ${address}, ${item.city}, ${item.country}`);
  };

  const handleGetDirections = () => {
    // Kwanza, jaribu kutumia coordinates ikiwa zipo
    if (item.location && item.location.lat && item.location.lng) {
      const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${item.location.lat},${item.location.lng}`;
      window.open(mapsUrl, '_blank');
    } 
    // Kisha jaribu kutumia anwani kamili ikiwa ipo
    else if (item.address || (item.city && item.country)) {
      // Tengeneza anwani kamili kutoka kwa sehemu zote zilizopo
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
    // Mwisho, jaribu kutumia jina la biashara na eneo
    else if (item.business && item.country) {
      const locationQuery = `${item.business}, ${item.city || item.region || ''}, ${item.country}`;
      const encodedQuery = encodeURIComponent(locationQuery.trim());
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`;
      window.open(mapsUrl, '_blank');
    }
    // Ikiwa hakuna data ya eneo, onyesha taarifa
    else {
      alert('Samahani, hakuna taarifa ya eneo inayopatikana kwa huduma hii. Tafadhali wasiliana na biashara moja kwa moja.');
    }
  };

  const renderStars = (rating) => {
    const numRating = typeof rating === 'string' ? parseFloat(rating) : (rating || 4.0);
    return Array.from({ length: 5 }, (_, index) => (
      <i
        key={index}
        className={`fas fa-star ${index < Math.floor(numRating) ? 'text-warning' : 'text-muted'}`}
      ></i>
    ));
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Electronics & Devices':
        return 'fa-microchip text-primary';
      case 'General Goods':
        return 'fa-tshirt text-warning';
      case 'Building & Hotels':
        return 'fa-building text-success';
      default:
        return 'fa-box text-secondary';
    }
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case 'Electronics & Devices':
        return 'primary';
      case 'General Goods':
        return 'warning';
      case 'Building & Hotels':
        return 'success';
      default:
        return 'secondary';
    }
  };

  const getCountryFlag = (countryName) => {
    const country = countries.find(c => c.name === countryName);
    const flagEmojis = {
      'TZ': '🇹🇿', 'KE': '🇰🇪', 'UG': '🇺🇬', 'US': '🇺🇸', 'GB': '🇬🇧',
      'EU': '🇪🇺', 'JP': '🇯🇵', 'CN': '🇨🇳', 'IN': '🇮🇳', 'ZA': '🇿🇦',
      'NG': '🇳🇬', 'ET': '🇪🇹', 'RW': '🇷🇼', 'BI': '🇧🇮', 'CD': '🇨🇩'
    };
    return flagEmojis[country?.code] || '🏳️';
  };

  const formatPrice = (item) => {
    if (item.type === 'service') {
      return `${item.currencySymbol || '$'} ${item.priceRange} ${item.currency ? `(${item.currency})` : ''}`;
    }
    return `${item.currencySymbol || '$'} ${item.price?.toLocaleString() || '0'} ${item.currency ? `(${item.currency})` : ''}`;
  };

  const formatSpecification = (spec) => {
    if (!spec.includes(':')) return { key: spec, value: '' };
    
    const colonIndex = spec.indexOf(':');
    const key = spec.substring(0, colonIndex).trim();
    const value = spec.substring(colonIndex + 1).trim();
    
    return { key, value };
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <h5>Loading Item Details...</h5>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <i className="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
          <h3>Item Not Found</h3>
          <p className="text-muted">The item you're looking for doesn't exist.</p>
          <button className="btn btn-primary" onClick={() => navigate('/search')}>
            <i className="fas fa-arrow-left me-2"></i>
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  const categoryColor = getCategoryColor(item.category);
  const categoryIcon = getCategoryIcon(item.category);

  return (
    <div className="min-vh-100" style={{ background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)" }}>
      {/* Navigation */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <div className="container">
          <Link className="navbar-brand fw-bold text-primary" to="/">
            <i className="fas fa-globe-americas me-2"></i>
            ProductFinder
          </Link>
          <div className="navbar-nav ms-auto">
            <Link className="nav-link" to="/">
              <i className="fas fa-home me-1"></i> Home
            </Link>
            <Link className="nav-link" to="/search">
              <i className="fas fa-search me-1"></i> Search
            </Link>
          </div>
        </div>
      </nav>

      {/* Item Details */}
      <div className="container py-4">
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/" className="text-decoration-none">
                <i className="fas fa-home me-1"></i>Home
              </Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/search" className="text-decoration-none">Search</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/search" className="text-decoration-none">{item.category}</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/search" className="text-decoration-none">{item.country}</Link>
            </li>
            <li className="breadcrumb-item active">{item.name}</li>
          </ol>
        </nav>

        <div className="row g-4">
          {/* Item Images */}
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <div className="text-center mb-3">
                  <img 
                    src={itemImages[selectedImage]} 
                    alt={item.name}
                    className="img-fluid rounded-3"
                    style={{ maxHeight: '400px', objectFit: 'contain', width: '100%' }}
                  />
                </div>
                
                {/* Image Thumbnails */}
                {itemImages.length > 1 && (
                  <div className="row g-2">
                    {itemImages.map((img, index) => (
                      <div key={index} className="col-3">
                        <img
                          src={img}
                          alt={`${item.name} view ${index + 1}`}
                          className={`img-thumbnail cursor-pointer ${selectedImage === index ? `border-${categoryColor}` : ''}`}
                          style={{ height: '80px', objectFit: 'cover', width: '100%' }}
                          onClick={() => setSelectedImage(index)}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Item Info */}
                <div className="mt-3">
                  <div className="d-flex justify-content-between align-items-center">
                    {item.type === 'product' ? (
                      <span className={`badge ${item.stock > 0 ? 'bg-success' : 'bg-danger'} fs-6`}>
                        {item.stock > 0 ? '🟢 In Stock' : '🔴 Out of Stock'}
                      </span>
                    ) : (
                      <span className="badge bg-info fs-6">
                        <i className="fas fa-concierge-bell me-1"></i>
                        Service Available
                      </span>
                    )}
                    <span className="badge bg-secondary text-capitalize">{item.condition || 'Available'}</span>
                  </div>
                  {item.type === 'product' && (
                    <div className="mt-2">
                      <small className="text-muted">
                        <i className="fas fa-box me-1"></i>
                        {item.stock} units available
                      </small>
                      {item.brand && (
                        <small className="text-muted ms-3">
                          <i className="fas fa-tag me-1"></i>
                          Brand: {item.brand}
                        </small>
                      )}
                    </div>
                  )}
                  {item.serviceType && (
                    <div className="mt-2">
                      <span className="badge bg-primary">{item.serviceType}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Item Info */}
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <h1 className="h2 fw-bold text-dark mb-2">{item.name}</h1>
                
                {/* Category and Rating */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="d-flex align-items-center gap-2">
                    <span className={`badge bg-${categoryColor}`}>
                      <i className={`fas ${categoryIcon} me-2`}></i>
                      {item.category}
                    </span>
                    <span className="badge bg-light text-dark">
                      {getCountryFlag(item.country)} {item.country}
                    </span>
                  </div>
                  <div className="d-flex align-items-center">
                    <div className="me-2">
                      {renderStars(item.rating || 4.0)}
                    </div>
                    <span className="text-muted">({item.reviews || 0} reviews)</span>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-4">
                  <h2 className={`text-${categoryColor} fw-bold`}>
                    {formatPrice(item)}
                  </h2>
                  {item.type === 'product' && <small className="text-muted">Inclusive of VAT</small>}
                </div>

                {/* Location Information */}
                <div className="card bg-light border-0 mb-4">
                  <div className="card-body">
                    <h6 className="fw-bold mb-3">
                      <i className="fas fa-map-marker-alt me-2 text-primary"></i>
                      Location Information
                    </h6>
                    <div className="row small">
                      <div className="col-md-6 mb-2">
                        <strong>Country:</strong> {getCountryFlag(item.country)} {item.country}
                      </div>
                      <div className="col-md-6 mb-2">
                        <strong>Region:</strong> {item.region}
                      </div>
                      <div className="col-md-6 mb-2">
                        <strong>City:</strong> {item.city}
                      </div>
                      <div className="col-md-6 mb-2">
                        <strong>Address:</strong> {item.address}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Info */}
                {item.type === 'service' && (
                  <div className="mb-4">
                    <div className="row">
                      {item.capacity && (
                        <div className="col-6">
                          <small className="text-muted">
                            <i className="fas fa-users me-1"></i>
                            {item.capacity}
                          </small>
                        </div>
                      )}
                      {item.rating && (
                        <div className="col-6">
                          <small className="text-muted">
                            <i className="fas fa-star me-1"></i>
                            {item.rating} Star Rating
                          </small>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="d-grid gap-2 mb-4">
                  <button 
                    className={`btn btn-${categoryColor} btn-lg py-3`}
                    onClick={handleContactBusiness}
                  >
                    <i className="fas fa-phone me-2"></i>
                    Contact Business
                  </button>
                  <button 
                    className="btn btn-outline-primary btn-lg py-3"
                    onClick={handleGetDirections}
                  >
                    <i className="fas fa-map-marker-alt me-2"></i>
                    Get Directions
                  </button>
                </div>

                {/* Business Info */}
                <div className="card bg-light border-0">
                  <div className="card-body">
                    <h6 className="fw-bold mb-3">
                      <i className="fas fa-store me-2"></i>
                      {item.business}
                    </h6>
                    <div className="row small text-muted">
                      <div className="col-12 mb-2">
                        <i className="fas fa-map-marker-alt me-1"></i>
                        {item.address}, {item.city}, {item.region}, {item.country}
                      </div>
                      <div className="col-6">
                        <i className="fas fa-star me-1"></i>
                        {item.rating || 4.0}/5 Rating
                      </div>
                      <div className="col-6">
                        <i className="fas fa-check-circle me-1"></i>
                        Verified Business
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Item Tabs */}
        <div className="row mt-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-header bg-white border-0">
                <ul className="nav nav-tabs card-header-tabs">
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${activeTab === 'details' ? 'active' : ''}`}
                      onClick={() => setActiveTab('details')}
                    >
                      <i className="fas fa-info-circle me-2"></i>
                      {item.type === 'service' ? 'Service Details' : 'Product Details'}
                    </button>
                  </li>
                  {item.type === 'product' && item.requiresSpecifications && (
                    <li className="nav-item">
                      <button 
                        className={`nav-link ${activeTab === 'specs' ? 'active' : ''}`}
                        onClick={() => setActiveTab('specs')}
                      >
                        <i className="fas fa-list-alt me-2"></i>
                        Specifications
                      </button>
                    </li>
                  )}
                  {item.type === 'service' && (
                    <li className="nav-item">
                      <button 
                        className={`nav-link ${activeTab === 'amenities' ? 'active' : ''}`}
                        onClick={() => setActiveTab('amenities')}
                      >
                        <i className="fas fa-concierge-bell me-2"></i>
                        Amenities & Services
                      </button>
                    </li>
                  )}
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${activeTab === 'reviews' ? 'active' : ''}`}
                      onClick={() => setActiveTab('reviews')}
                    >
                      <i className="fas fa-star me-2"></i>
                      Reviews ({item.reviews || 0})
                    </button>
                  </li>
                </ul>
              </div>
              
              <div className="card-body p-4">
                {activeTab === 'details' && (
                  <div className="fade-in">
                    <h5 className="fw-bold mb-3">
                      {item.type === 'service' ? 'Service Description' : 'Product Description'}
                    </h5>
                    <p className="lead" style={{ lineHeight: '1.6' }}>{item.description}</p>
                    
                    {item.features && item.features.length > 0 && (
                      <>
                        <h6 className="fw-bold mt-4 mb-3">
                          <i className="fas fa-check-circle me-2 text-success"></i>
                          Key Features
                        </h6>
                        <div className="row">
                          {item.features.map((feature, index) => (
                            <div key={index} className="col-md-6 mb-2">
                              <i className="fas fa-check text-success me-2"></i>
                              {feature}
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    {/* Additional info for General Goods */}
                    {item.category === 'General Goods' && (
                      <div className="mt-4">
                        <h6 className="fw-bold mb-3">Product Information</h6>
                        <div className="row">
                          {item.size && (
                            <div className="col-md-4 mb-2">
                              <strong>Size:</strong> {item.size}
                            </div>
                          )}
                          {item.color && (
                            <div className="col-md-4 mb-2">
                              <strong>Color:</strong> {item.color}
                            </div>
                          )}
                          {item.material && (
                            <div className="col-md-4 mb-2">
                              <strong>Material:</strong> {item.material}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Additional info for Building & Hotels */}
                    {item.category === 'Building & Hotels' && (
                      <div className="mt-4">
                        <h6 className="fw-bold mb-3">Service Information</h6>
                        <div className="row">
                          {item.capacity && (
                            <div className="col-md-6 mb-2">
                              <strong>Capacity:</strong> {item.capacity}
                            </div>
                          )}
                          {item.checkInTime && (
                            <div className="col-md-3 mb-2">
                              <strong>Check-in:</strong> {item.checkInTime}
                            </div>
                          )}
                          {item.checkOutTime && (
                            <div className="col-md-3 mb-2">
                              <strong>Check-out:</strong> {item.checkOutTime}
                            </div>
                          )}
                        </div>
                        {item.contactInfo && (
                          <div className="mt-3">
                            <strong>Contact:</strong> {item.contactInfo}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'specs' && item.type === 'product' && item.requiresSpecifications && (
                  <div className="fade-in">
                    <h5 className="fw-bold mb-3">Technical Specifications</h5>
                    
                    {item.specifications && item.specifications.length > 0 ? (
                      <div className="table-responsive">
                        <table className="table table-striped">
                          <tbody>
                            {item.specifications.map((spec, index) => {
                              const { key, value } = formatSpecification(spec);
                              return (
                                <tr key={index}>
                                  <td className="fw-bold" style={{ width: '40%', backgroundColor: '#f8f9fa' }}>{key}</td>
                                  <td>{value}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <i className="fas fa-info-circle fa-2x text-muted mb-3"></i>
                        <p className="text-muted">No specifications provided for this product.</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'amenities' && item.type === 'service' && (
                  <div className="fade-in">
                    <h5 className="fw-bold mb-3">Amenities & Services</h5>
                    
                    {item.amenities && item.amenities.length > 0 && (
                      <>
                        <h6 className="fw-bold mb-3">
                          <i className="fas fa-home me-2 text-primary"></i>
                          Amenities & Facilities
                        </h6>
                        <div className="row">
                          {item.amenities.map((amenity, index) => (
                            <div key={index} className="col-md-6 mb-2">
                              <i className="fas fa-check text-success me-2"></i>
                              {amenity}
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    {item.services && item.services.length > 0 && (
                      <>
                        <h6 className="fw-bold mt-4 mb-3">
                          <i className="fas fa-concierge-bell me-2 text-primary"></i>
                          Services Offered
                        </h6>
                        <div className="row">
                          {item.services.map((service, index) => (
                            <div key={index} className="col-md-6 mb-2">
                              <i className="fas fa-star text-warning me-2"></i>
                              {service}
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    {item.policies && (
                      <>
                        <h6 className="fw-bold mt-4 mb-3">
                          <i className="fas fa-file-contract me-2 text-primary"></i>
                          Policies & Terms
                        </h6>
                        <div className="bg-light p-3 rounded">
                          {item.policies.split('\n').map((policy, index) => (
                            <p key={index} className="mb-1">{policy}</p>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="fade-in">
                    <h5 className="fw-bold mb-3">Customer Reviews</h5>
                    <div className="text-center py-4">
                      <div className="display-1 text-warning mb-2">{item.rating || 4.0}</div>
                      <div className="mb-2">{renderStars(item.rating || 4.0)}</div>
                      <p className="text-muted">Based on {item.reviews || 0} reviews</p>
                    </div>
                    
                    {(item.reviews || 0) > 0 ? (
                      <div className="border-top pt-3">
                        {[1, 2, 3].map(review => (
                          <div key={review} className="mb-4 p-3 border rounded">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <div>
                                <span className="fw-bold">Customer {review}</span>
                                <div className="ms-2 d-inline">{renderStars(4.5)}</div>
                              </div>
                              <small className="text-muted">2 days ago</small>
                            </div>
                            <p className="text-muted mb-1">
                              {review === 1 && "Excellent quality! The product exceeded my expectations. Fast delivery and great customer service."}
                              {review === 2 && "Good value for money. Everything works perfectly as described. Would recommend to others."}
                              {review === 3 && "Satisfied with the purchase. Everything was exactly as shown in the pictures."}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-5">
                        <i className="fas fa-comments fa-3x text-muted mb-3"></i>
                        <h6 className="text-muted">No reviews yet</h6>
                        <p className="text-muted">Be the first to review this {item.type === 'service' ? 'service' : 'product'}!</p>
                        <button className="btn btn-outline-primary">
                          <i className="fas fa-pen me-2"></i>
                          Write a Review
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Items */}
        {relatedItems.length > 0 && (
          <div className="row mt-5">
            <div className="col-12">
              <h4 className="fw-bold mb-4">
                <i className="fas fa-th-large me-2"></i>
                Related {item.category} in {item.country}
              </h4>
              <div className="row g-3">
                {relatedItems.map(relatedItem => (
                  <div key={relatedItem.id} className="col-md-6 col-lg-3">
                    <div 
                      className="card border-0 shadow-sm rounded-4 h-100 cursor-pointer product-card"
                      onClick={() => navigate(`/product/${relatedItem.id}`)}
                    >
                      <img 
                        src={getItemImages(relatedItem)[0]} 
                        alt={relatedItem.name}
                        className="card-img-top rounded-top-4"
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                      <div className="card-body">
                        <h6 className="card-title text-dark">{relatedItem.name}</h6>
                        <p className={`text-${getCategoryColor(relatedItem.category)} fw-bold mb-2`}>
                          {formatPrice(relatedItem)}
                        </p>
                        <div className="d-flex justify-content-between align-items-center">
                          <span className={`badge bg-${getCategoryColor(relatedItem.category)}`}>
                            {relatedItem.serviceType || relatedItem.category}
                          </span>
                          <small className="text-muted">
                            {getCountryFlag(relatedItem.country)} {relatedItem.city}
                          </small>
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

      {/* Add CDN Links */}
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet" />
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

      <style>
        {`
          .cursor-pointer { cursor: pointer; }
          .breadcrumb { background: transparent; }
          .nav-tabs .nav-link { color: #495057; border: none; }
          .nav-tabs .nav-link.active { 
            color: #0d6efd; 
            border-bottom: 3px solid #0d6efd;
            background: transparent;
          }
          .card { transition: transform 0.2s; }
          .card:hover { transform: translateY(-2px); }
          .img-thumbnail { transition: border-color 0.2s; }
          .img-thumbnail:hover { border-color: #0d6efd; }
          .product-card { transition: all 0.3s ease; }
          .product-card:hover { 
            transform: translateY(-5px); 
            box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
          }
          .fade-in {
            animation: fadeIn 0.5s ease-in;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}

export default ProductDetailPage;