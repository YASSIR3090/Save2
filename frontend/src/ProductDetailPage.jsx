// src/ProductDetailPage.jsx - WITH AUTOPLAY CONTROLLED CAROUSEL
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Carousel } from 'react-bootstrap';

function ProductDetailPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [relatedItems, setRelatedItems] = useState([]);
  const [activeTab, setActiveTab] = useState("details");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0); // For controlled carousel

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

      // Add sample items for demonstration
      const sampleItems = [
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
          businessName: "MobileWorld Tanzania",
          businessPhone: "+255 754 987 654",
          businessEmail: "sales@mobileworld.co.tz",
          businessAddress: "Mlimani City Mall, Dar es Salaam",
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
        // General Goods
        {
          id: "gen-1",
          name: "Men's Running Shoes",
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
          businessName: "Fashion House Dar",
          businessPhone: "+255 762 111 222",
          businessEmail: "contact@fashionhousedar.co.tz",
          businessAddress: "Masaki, Dar es Salaam",
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
        // Building & Hotels
        {
          id: "hotel-1",
          name: "Serengeti Luxury Hotel",
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
          businessName: "Prime Properties Tanzania",
          businessPhone: "+255 712 345 678",
          businessEmail: "bookings@kilimanjarosuites.com",
          businessAddress: "City Center, Dar es Salaam",
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
        }
      ];

      // Combine all items
      const combinedItems = [...sampleItems, ...allItems];
      
      // Find the requested item
      const foundItem = combinedItems.find(item => item.id === productId);
      
      if (foundItem) {
        setItem(foundItem);
        
        // Find related items (same category and country)
        const related = combinedItems
          .filter(p => 
            p.id !== productId && 
            p.category === foundItem.category && 
            p.country === foundItem.country
          )
          .slice(0, 4);
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

  useEffect(() => {
    loadItemData();
  }, [loadItemData]);

  // Handle carousel selection
  const handleSelect = (selectedIndex, e) => {
    setActiveIndex(selectedIndex);
  };

  // Handle manual image navigation
  const handleImageNavigation = (index) => {
    setActiveIndex(index);
  };

  const getItemImages = (item) => {
    if (item && item.images && item.images.length > 0) {
      return item.images;
    }
    
    // Default images based on category
    if (item) {
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
    else if (item.businessName && item.country) {
      const locationQuery = `${item.businessName}, ${item.city || item.region || ''}, ${item.country}`;
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
    if (!category) return 'fa-box text-secondary';
    
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
    if (!category) return 'secondary';
    
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
    if (!countryName) return '🏳️';
    
    const country = countries.find(c => c.name === countryName);
    const flagEmojis = {
      'TZ': '🇹🇿', 'KE': '🇰🇪', 'UG': '🇺🇬', 'US': '🇺🇸', 'GB': '🇬🇧',
      'EU': '🇪🇺', 'CN': '🇨🇳', 'IN': '🇮🇳', 'ZA': '🇿🇦'
    };
    return flagEmojis[country?.code] || '🏳️';
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

  if (error || !item) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <i className="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
          <h3>{error || "Item Not Found"}</h3>
          <p className="text-muted">The item you're looking for doesn't exist or may have been removed.</p>
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
          
        </div>
      </nav>

      {/* Item Details */}
      <div className="container py-4">
        {/* Improved Breadcrumb - Only Home */}
        <div className="d-flex align-items-center mb-4">
          <Link 
            to="/" 
            className="d-flex align-items-center text-decoration-none text-primary fw-bold"
            style={{ fontSize: '1.1rem' }}
          >
            <i className="fas fa-home me-2"></i>
            Home
          </Link>
          <span className="mx-3 text-muted" style={{ fontSize: '1.2rem' }}>/</span>
          <div className="d-flex align-items-center">
            <i className={`fas ${categoryIcon} me-2 text-${categoryColor}`}></i>
            <span className="text-dark fw-bold">{item.name}</span>
          </div>
        </div>

        <div className="row g-4">
          {/* Item Images - NOW USING AUTOPLAY CONTROLLED CAROUSEL */}
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                {/* Main Carousel with Autoplay */}
                <Carousel 
                  activeIndex={activeIndex}
                  onSelect={handleSelect}
                  interval={3000} // 3 seconds autoplay
                  indicators={false}
                  controls={itemImages.length > 1}
                  touch={true}
                  wrap={true}
                  pause={false} // Continue autoplay on hover
                >
                  {itemImages.map((img, index) => (
                    <Carousel.Item key={index}>
                      <div className="text-center" style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img 
                          src={img} 
                          alt={`${item.name} - View ${index + 1}`}
                          className="img-fluid rounded-3"
                          style={{ 
                            maxHeight: '400px', 
                            objectFit: 'contain', 
                            width: '100%' 
                          }}
                          onError={(e) => {
                            e.target.src = 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=800';
                          }}
                        />
                      </div>
                    </Carousel.Item>
                  ))}
                </Carousel>

                {/* Custom Image Navigation - Thumbnails */}
                {itemImages.length > 1 && (
                  <div className="mt-3">
                    <div className="d-flex justify-content-center flex-wrap gap-2">
                      {itemImages.map((img, index) => (
                        <div 
                          key={index}
                          className={`cursor-pointer border rounded-2 p-1 ${activeIndex === index ? 'border-primary border-2' : 'border-secondary'}`}
                          onClick={() => handleImageNavigation(index)}
                          style={{ 
                            width: '60px', 
                            height: '60px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.1)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                        >
                          <img 
                            src={img} 
                            alt={`Thumbnail ${index + 1}`}
                            className="img-fluid rounded-1"
                            style={{ 
                              width: '100%', 
                              height: '100%', 
                              objectFit: 'cover' 
                            }}
                            onError={(e) => {
                              e.target.src = 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=150';
                            }}
                          />
                        </div>
                      ))}
                    </div>
                    
                    {/* Image Counter */}
                    <div className="text-center mt-2">
                      <small className="text-muted">
                        Image {activeIndex + 1} of {itemImages.length}
                      </small>
                    </div>
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
                        <strong>Region:</strong> {item.region || 'Not specified'}
                      </div>
                      <div className="col-md-6 mb-2">
                        <strong>City:</strong> {item.city || 'Not specified'}
                      </div>
                      <div className="col-md-6 mb-2">
                        <strong>Address:</strong> {item.address || 'Not specified'}
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
                      {item.businessName || item.business}
                    </h6>
                    <div className="row small text-muted">
                      <div className="col-12 mb-2">
                        <i className="fas fa-map-marker-alt me-1"></i>
                        {item.businessAddress || item.address}, {item.city}, {item.region}, {item.country}
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
                <ul className="nav nav-tabs nav-tabs-custom border-0">
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${activeTab === 'details' ? 'active' : ''}`}
                      onClick={() => setActiveTab('details')}
                    >
                      <i className="fas fa-info-circle me-2"></i>
                      Details
                    </button>
                  </li>
                  {item.requiresSpecifications && (
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
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${activeTab === 'features' ? 'active' : ''}`}
                      onClick={() => setActiveTab('features')}
                    >
                      <i className="fas fa-star me-2"></i>
                      Features
                    </button>
                  </li>
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
                </ul>
              </div>
              <div className="card-body p-4">
                {activeTab === 'details' && (
                  <div>
                    <h5 className="fw-bold mb-3">Description</h5>
                    <p className="text-muted" style={{ lineHeight: '1.8' }}>
                      {item.description || 'No description available.'}
                    </p>
                    {item.type === 'service' && item.policies && (
                      <div className="mt-4">
                        <h6 className="fw-bold">Policies</h6>
                        <pre className="text-muted small" style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                          {item.policies}
                        </pre>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'specs' && item.specifications && (
                  <div>
                    <h5 className="fw-bold mb-3">Technical Specifications</h5>
                    <div className="row">
                      {item.specifications.map((spec, index) => {
                        const { key, value } = formatSpecification(spec);
                        return (
                          <div key={index} className="col-md-6 mb-3">
                            <div className="d-flex justify-content-between border-bottom pb-2">
                              <span className="fw-medium text-muted">{key}</span>
                              <span className="fw-bold text-dark">{value}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {activeTab === 'features' && (
                  <div>
                    <h5 className="fw-bold mb-3">
                      {item.type === 'service' ? 'Services & Features' : 'Product Features'}
                    </h5>
                    <div className="row">
                      {(item.features || []).map((feature, index) => (
                        <div key={index} className="col-md-6 mb-2">
                          <div className="d-flex align-items-center">
                            <i className="fas fa-check-circle text-success me-2"></i>
                            <span>{feature}</span>
                          </div>
                        </div>
                      ))}
                      {item.size && (
                        <div className="col-md-6 mb-2">
                          <div className="d-flex align-items-center">
                            <i className="fas fa-ruler-combined text-primary me-2"></i>
                            <span>Size: {item.size}</span>
                          </div>
                        </div>
                      )}
                      {item.color && (
                        <div className="col-md-6 mb-2">
                          <div className="d-flex align-items-center">
                            <i className="fas fa-palette text-warning me-2"></i>
                            <span>Color: {item.color}</span>
                          </div>
                        </div>
                      )}
                      {item.material && (
                        <div className="col-md-6 mb-2">
                          <div className="d-flex align-items-center">
                            <i className="fas fa-cube text-info me-2"></i>
                            <span>Material: {item.material}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'amenities' && item.type === 'service' && (
                  <div>
                    <div className="row">
                      <div className="col-md-6">
                        <h6 className="fw-bold mb-3">Amenities</h6>
                        <div className="row">
                          {(item.amenities || []).map((amenity, index) => (
                            <div key={index} className="col-12 mb-2">
                              <div className="d-flex align-items-center">
                                <i className="fas fa-check text-success me-2"></i>
                                <span>{amenity}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <h6 className="fw-bold mb-3">Services</h6>
                        <div className="row">
                          {(item.services || []).map((service, index) => (
                            <div key={index} className="col-12 mb-2">
                              <div className="d-flex align-items-center">
                                <i className="fas fa-concierge-bell text-primary me-2"></i>
                                <span>{service}</span>
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

        {/* Related Items */}
        {relatedItems.length > 0 && (
          <div className="row mt-4">
            <div className="col-12">
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-header bg-white border-0">
                  <h5 className="fw-bold mb-0">
                    <i className="fas fa-th-large me-2"></i>
                    Related Items
                  </h5>
                </div>
                <div className="card-body">
                  <div className="row g-3">
                    {relatedItems.map(relatedItem => (
                      <div key={relatedItem.id} className="col-md-6 col-lg-3">
                        <div 
                          className="card h-100 border-0 shadow-sm rounded-3 cursor-pointer"
                          onClick={() => navigate(`/product/${relatedItem.id}`)}
                          style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                          <div className="position-relative">
                            <img 
                              src={getItemImages(relatedItem)[0]} 
                              className="card-img-top rounded-top-3"
                              alt={relatedItem.name}
                              style={{ height: '200px', objectFit: 'cover' }}
                              onError={(e) => {
                                e.target.src = 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=800';
                              }}
                            />
                            <div className="position-absolute top-0 start-0 m-2">
                              <span className={`badge bg-${getCategoryColor(relatedItem.category)}`}>
                                <i className={`fas ${getCategoryIcon(relatedItem.category)} me-1`}></i>
                                {relatedItem.category}
                              </span>
                            </div>
                          </div>
                          <div className="card-body d-flex flex-column">
                            <h6 className="card-title fw-bold text-dark">{relatedItem.name}</h6>
                            <p className="card-text text-primary fw-bold mb-2">
                              {formatPrice(relatedItem)}
                            </p>
                            <div className="mt-auto">
                              <div className="d-flex justify-content-between align-items-center small text-muted">
                                <span>
                                  <i className="fas fa-map-marker-alt me-1"></i>
                                  {relatedItem.city}
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
    </div>
  );
}

export default ProductDetailPage;