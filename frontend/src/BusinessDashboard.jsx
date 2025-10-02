// src/BusinessDashboard.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";

function BusinessDashboard() {
  const [business, setBusiness] = useState(null);
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [activeCategory, setActiveCategory] = useState("electronics");
  const [showProductForm, setShowProductForm] = useState(false);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [showGeneralForm, setShowGeneralForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalServices: 0,
    inStock: 0,
    outOfStock: 0,
    viewsToday: 0
  });

  // Product Form State (Electronics & Devices)
  const [productForm, setProductForm] = useState({
    name: "",
    category: "Electronics & Devices",
    price: "",
    currency: "USD",
    stock: "",
    description: "",
    specifications: "",
    features: "",
    brand: "",
    condition: "new",
    country: "Tanzania",
    region: "",
    city: "",
    address: "",
    images: [],
    imagePreviews: []
  });

  // General Goods Form State
  const [generalForm, setGeneralForm] = useState({
    name: "",
    category: "General Goods",
    price: "",
    currency: "USD",
    stock: "",
    description: "",
    features: "",
    brand: "",
    condition: "new",
    size: "",
    color: "",
    material: "",
    country: "Tanzania",
    region: "",
    city: "",
    address: "",
    images: [],
    imagePreviews: []
  });

  // Service Form State (Building & Hotels)
  const [serviceForm, setServiceForm] = useState({
    name: "",
    category: "Building & Hotels",
    serviceType: "Hotel",
    priceRange: "",
    currency: "USD",
    description: "",
    amenities: "",
    services: "",
    country: "Tanzania",
    region: "",
    city: "",
    address: "",
    contactInfo: "",
    capacity: "",
    rating: "",
    checkInTime: "14:00",
    checkOutTime: "12:00",
    policies: "",
    images: [],
    imagePreviews: []
  });

  // Categories
  const categories = {
    "electronics": {
      name: "Electronics & Devices",
      type: "product",
      icon: "fa-microchip",
      color: "primary",
      description: "Laptops, smartphones, electronics with specifications"
    },
    "general": {
      name: "General Goods", 
      type: "product",
      icon: "fa-tshirt",
      color: "warning",
      description: "Clothing, shoes, items without technical specifications"
    },
    "building": {
      name: "Building & Hotels",
      type: "service",
      icon: "fa-building",
      color: "success",
      description: "Hotels, apartments, luxury properties with services"
    }
  };

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

  // Regions by Country (Sample data - you can expand this)
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

  // Service Types for Buildings/Hotels
  const serviceTypes = [
    "Hotel", "Luxury Apartment", "Vacation Rental", "Conference Center", 
    "Restaurant", "Event Space", "Office Building", "Resort", "Boutique Hotel", "Other"
  ];

  const conditions = ["New", "Used - Like New", "Used - Good", "Used - Fair", "Refurbished"];
  const sizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "One Size","All size"];
  const colors = ["Black", "White", "Red", "Blue", "Green", "Yellow", "Pink", "Purple", "Brown", "Gray", "Multi-color","All color"];
  const materials = ["Cotton", "Polyester", "Leather", "Silk", "Wool", "Denim", "Linen", "Synthetic", "Mixed","Other"];

  const navigate = useNavigate();
  const managementSectionRef = useRef(null);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('businessAuthenticated') === 'true';
    const businessData = JSON.parse(localStorage.getItem('currentBusiness'));
    
    if (!isAuthenticated || !businessData) {
      navigate('/business-auth');
      return;
    }

    setBusiness(businessData);
    loadData(businessData.id);
  }, [navigate]);

  const loadData = (businessId) => {
    const savedProducts = JSON.parse(localStorage.getItem(`products_${businessId}`)) || [];
    const savedServices = JSON.parse(localStorage.getItem(`services_${businessId}`)) || [];
    
    setProducts(savedProducts);
    setServices(savedServices);
    updateStats(savedProducts, savedServices);
  };

  const handleLogout = () => {
    localStorage.removeItem('businessAuthenticated');
    localStorage.removeItem('currentBusiness');
    navigate('/');
  };

  // Scroll to management section when category is selected
  const scrollToManagementSection = () => {
    if (managementSectionRef.current) {
      managementSectionRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Handle category change with smooth scroll
  const handleCategoryChange = (categoryKey) => {
    setActiveCategory(categoryKey);
    setShowProductForm(false);
    setShowGeneralForm(false);
    setShowServiceForm(false);
    setEditingItem(null);
    
    // Scroll to management section after state update
    setTimeout(() => {
      scrollToManagementSection();
    }, 100);
  };

  // Helper function to generate random coordinates (for demo purposes)
  const getRandomLat = () => {
    // Toa coordinates za kieneo kulingana na nchi
    const currentCountry = productForm.country || generalForm.country || serviceForm.country;
    switch(currentCountry) {
      case 'Tanzania': return -6.3690 + (Math.random() * 2 - 1); // Dar es Salaam area
      case 'Kenya': return -1.2921 + (Math.random() * 2 - 1); // Nairobi area
      case 'Uganda': return 0.3476 + (Math.random() * 2 - 1); // Kampala area
      case 'United States': return 40.7128 + (Math.random() * 4 - 2); // New York area
      case 'United Kingdom': return 51.5074 + (Math.random() * 2 - 1); // London area
      default: return 0 + (Math.random() * 10 - 5); // Default worldwide
    }
  };

  const getRandomLng = () => {
    // Toa coordinates za kieneo kulingana na nchi
    const currentCountry = productForm.country || generalForm.country || serviceForm.country;
    switch(currentCountry) {
      case 'Tanzania': return 34.8888 + (Math.random() * 2 - 1); // Tanzania area
      case 'Kenya': return 36.8219 + (Math.random() * 2 - 1); // Kenya area
      case 'Uganda': return 32.5825 + (Math.random() * 2 - 1); // Uganda area
      case 'United States': return -74.0060 + (Math.random() * 4 - 2); // New York area
      case 'United Kingdom': return -0.1278 + (Math.random() * 2 - 1); // London area
      default: return 0 + (Math.random() * 10 - 5); // Default worldwide
    }
  };

  // Electronics & Devices Management
  const handleProductFormChange = (e) => {
    const { name, value } = e.target;
    setProductForm(prev => ({ ...prev, [name]: value }));
  };

  const handleProductImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = [];
    
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          newPreviews.push(e.target.result);
          if (newPreviews.length === files.length) {
            setProductForm(prev => ({
              ...prev,
              images: [...prev.images, ...files],
              imagePreviews: [...prev.imagePreviews, ...newPreviews]
            }));
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeProductImage = (index) => {
    setProductForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      imagePreviews: prev.imagePreviews.filter((_, i) => i !== index)
    }));
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    
    const selectedCountry = countries.find(c => c.name === productForm.country);
    
    const newProduct = {
      id: editingItem ? editingItem.id : Date.now().toString(),
      name: productForm.name,
      category: productForm.category,
      price: parseInt(productForm.price),
      currency: productForm.currency,
      currencySymbol: selectedCountry?.currencySymbol || "$",
      stock: parseInt(productForm.stock),
      description: productForm.description,
      specifications: productForm.specifications.split('\n').filter(spec => spec.trim() !== ''),
      features: productForm.features.split('\n').filter(feature => feature.trim() !== ''),
      brand: productForm.brand,
      condition: productForm.condition,
      country: productForm.country,
      region: productForm.region,
      city: productForm.city,
      address: productForm.address,
      location: { lat: getRandomLat(), lng: getRandomLng() }, // Simulated location
      images: productForm.imagePreviews,
      businessId: business.id,
      businessName: business.businessName,
      lastUpdated: new Date().toISOString().split('T')[0],
      status: "active",
      rating: 4.0,
      reviews: 0,
      type: "product",
      requiresSpecifications: true
    };

    let updatedProducts;
    if (editingItem) {
      updatedProducts = products.map(p => p.id === editingItem.id ? newProduct : p);
    } else {
      updatedProducts = [...products, newProduct];
    }

    setProducts(updatedProducts);
    localStorage.setItem(`products_${business.id}`, JSON.stringify(updatedProducts));
    resetProductForm();
    updateStats(updatedProducts, services);
    alert(editingItem ? "Electronics product updated successfully!" : "Electronics product added successfully!");
  };

  // General Goods Management
  const handleGeneralFormChange = (e) => {
    const { name, value } = e.target;
    setGeneralForm(prev => ({ ...prev, [name]: value }));
  };

  const handleGeneralImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = [];
    
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          newPreviews.push(e.target.result);
          if (newPreviews.length === files.length) {
            setGeneralForm(prev => ({
              ...prev,
              images: [...prev.images, ...files],
              imagePreviews: [...prev.imagePreviews, ...newPreviews]
            }));
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeGeneralImage = (index) => {
    setGeneralForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      imagePreviews: prev.imagePreviews.filter((_, i) => i !== index)
    }));
  };

  const handleAddGeneral = (e) => {
    e.preventDefault();
    
    const selectedCountry = countries.find(c => c.name === generalForm.country);
    
    const newProduct = {
      id: editingItem ? editingItem.id : Date.now().toString(),
      name: generalForm.name,
      category: generalForm.category,
      price: parseInt(generalForm.price),
      currency: generalForm.currency,
      currencySymbol: selectedCountry?.currencySymbol || "$",
      stock: parseInt(generalForm.stock),
      description: generalForm.description,
      features: generalForm.features.split('\n').filter(feature => feature.trim() !== ''),
      brand: generalForm.brand,
      condition: generalForm.condition,
      size: generalForm.size,
      color: generalForm.color,
      material: generalForm.material,
      country: generalForm.country,
      region: generalForm.region,
      city: generalForm.city,
      address: generalForm.address,
      location: { lat: getRandomLat(), lng: getRandomLng() }, // Simulated location
      images: generalForm.imagePreviews,
      businessId: business.id,
      businessName: business.businessName,
      lastUpdated: new Date().toISOString().split('T')[0],
      status: "active",
      rating: 4.0,
      reviews: 0,
      type: "product",
      requiresSpecifications: false
    };

    let updatedProducts;
    if (editingItem) {
      updatedProducts = products.map(p => p.id === editingItem.id ? newProduct : p);
    } else {
      updatedProducts = [...products, newProduct];
    }

    setProducts(updatedProducts);
    localStorage.setItem(`products_${business.id}`, JSON.stringify(updatedProducts));
    resetGeneralForm();
    updateStats(updatedProducts, services);
    alert(editingItem ? "General product updated successfully!" : "General product added successfully!");
  };

  // Service Management (Hotels/Buildings)
  const handleServiceFormChange = (e) => {
    const { name, value } = e.target;
    setServiceForm(prev => ({ ...prev, [name]: value }));
  };

  const handleServiceImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = [];
    
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          newPreviews.push(e.target.result);
          if (newPreviews.length === files.length) {
            setServiceForm(prev => ({
              ...prev,
              images: [...prev.images, ...files],
              imagePreviews: [...prev.imagePreviews, ...newPreviews]
            }));
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeServiceImage = (index) => {
    setServiceForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      imagePreviews: prev.imagePreviews.filter((_, i) => i !== index)
    }));
  };

  const handleAddService = (e) => {
    e.preventDefault();
    
    const selectedCountry = countries.find(c => c.name === serviceForm.country);
    
    const newService = {
      id: editingItem ? editingItem.id : Date.now().toString(),
      name: serviceForm.name,
      category: serviceForm.category,
      serviceType: serviceForm.serviceType,
      priceRange: serviceForm.priceRange,
      currency: serviceForm.currency,
      currencySymbol: selectedCountry?.currencySymbol || "$",
      description: serviceForm.description,
      amenities: serviceForm.amenities.split('\n').filter(amenity => amenity.trim() !== ''),
      services: serviceForm.services.split('\n').filter(service => service.trim() !== ''),
      country: serviceForm.country,
      region: serviceForm.region,
      city: serviceForm.city,
      address: serviceForm.address,
      location: { lat: getRandomLat(), lng: getRandomLng() }, // Simulated location
      contactInfo: serviceForm.contactInfo,
      capacity: serviceForm.capacity,
      rating: serviceForm.rating || "5",
      checkInTime: serviceForm.checkInTime,
      checkOutTime: serviceForm.checkOutTime,
      policies: serviceForm.policies,
      images: serviceForm.imagePreviews,
      businessId: business.id,
      businessName: business.businessName,
      lastUpdated: new Date().toISOString().split('T')[0],
      status: "active",
      type: "service"
    };

    let updatedServices;
    if (editingItem) {
      updatedServices = services.map(s => s.id === editingItem.id ? newService : s);
    } else {
      updatedServices = [...services, newService];
    }

    setServices(updatedServices);
    localStorage.setItem(`services_${business.id}`, JSON.stringify(updatedServices));
    resetServiceForm();
    updateStats(products, updatedServices);
    alert(editingItem ? "Service updated successfully!" : "Service added successfully!");
  };

  const resetProductForm = () => {
    setProductForm({
      name: "",
      category: "Electronics & Devices",
      price: "",
      currency: "USD",
      stock: "",
      description: "",
      specifications: "",
      features: "",
      brand: "",
      condition: "new",
      country: "Tanzania",
      region: "",
      city: "",
      address: "",
      images: [],
      imagePreviews: []
    });
    setEditingItem(null);
    setShowProductForm(false);
  };

  const resetGeneralForm = () => {
    setGeneralForm({
      name: "",
      category: "General Goods",
      price: "",
      currency: "USD",
      stock: "",
      description: "",
      features: "",
      brand: "",
      condition: "new",
      size: "",
      color: "",
      material: "",
      country: "Tanzania",
      region: "",
      city: "",
      address: "",
      images: [],
      imagePreviews: []
    });
    setEditingItem(null);
    setShowGeneralForm(false);
  };

  const resetServiceForm = () => {
    setServiceForm({
      name: "",
      category: "Building & Hotels",
      serviceType: "Hotel",
      priceRange: "",
      currency: "USD",
      description: "",
      amenities: "",
      services: "",
      country: "Tanzania",
      region: "",
      city: "",
      address: "",
      contactInfo: "",
      capacity: "",
      rating: "",
      checkInTime: "14:00",
      checkOutTime: "12:00",
      policies: "",
      images: [],
      imagePreviews: []
    });
    setEditingItem(null);
    setShowServiceForm(false);
  };

  const updateStats = (productsList, servicesList) => {
    const totalProducts = productsList.length;
    const totalServices = servicesList.length;
    const inStock = productsList.filter(p => p.stock > 0).length;
    const outOfStock = productsList.filter(p => p.stock === 0).length;

    setStats({
      totalProducts,
      totalServices,
      inStock,
      outOfStock,
      viewsToday: Math.floor(Math.random() * 50)
    });
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    
    if (item.category === "Electronics & Devices") {
      setProductForm({
        name: item.name,
        category: item.category,
        price: item.price.toString(),
        currency: item.currency || "USD",
        stock: item.stock.toString(),
        description: item.description,
        specifications: item.specifications?.join('\n') || "",
        features: item.features?.join('\n') || "",
        brand: item.brand || "",
        condition: item.condition || "new",
        country: item.country || "Tanzania",
        region: item.region || "",
        city: item.city || "",
        address: item.address || "",
        images: item.images || [],
        imagePreviews: item.images || []
      });
      setShowProductForm(true);
      setActiveCategory('electronics');
    } else if (item.category === "General Goods") {
      setGeneralForm({
        name: item.name,
        category: item.category,
        price: item.price.toString(),
        currency: item.currency || "USD",
        stock: item.stock.toString(),
        description: item.description,
        features: item.features?.join('\n') || "",
        brand: item.brand || "",
        condition: item.condition || "new",
        size: item.size || "",
        color: item.color || "",
        material: item.material || "",
        country: item.country || "Tanzania",
        region: item.region || "",
        city: item.city || "",
        address: item.address || "",
        images: item.images || [],
        imagePreviews: item.images || []
      });
      setShowGeneralForm(true);
      setActiveCategory('general');
    } else {
      setServiceForm({
        name: item.name,
        category: item.category,
        serviceType: item.serviceType || "Hotel",
        priceRange: item.priceRange || "",
        currency: item.currency || "USD",
        description: item.description,
        amenities: item.amenities?.join('\n') || "",
        services: item.services?.join('\n') || "",
        country: item.country || "Tanzania",
        region: item.region || "",
        city: item.city || "",
        address: item.address || "",
        contactInfo: item.contactInfo || "",
        capacity: item.capacity || "",
        rating: item.rating || "",
        checkInTime: item.checkInTime || "14:00",
        checkOutTime: item.checkOutTime || "12:00",
        policies: item.policies || "",
        images: item.images || [],
        imagePreviews: item.images || []
      });
      setShowServiceForm(true);
      setActiveCategory('building');
    }
  };

  const handleDeleteItem = (itemId, category) => {
    if (window.confirm(`Are you sure you want to delete this item?`)) {
      if (category === "Electronics & Devices" || category === "General Goods") {
        const updatedProducts = products.filter(p => p.id !== itemId);
        setProducts(updatedProducts);
        localStorage.setItem(`products_${business.id}`, JSON.stringify(updatedProducts));
        updateStats(updatedProducts, services);
      } else {
        const updatedServices = services.filter(s => s.id !== itemId);
        setServices(updatedServices);
        localStorage.setItem(`services_${business.id}`, JSON.stringify(updatedServices));
        updateStats(products, updatedServices);
      }
      alert("Item deleted successfully!");
    }
  };

  // Handle view item details
  const handleViewItem = (itemId) => {
    navigate(`/product/${itemId}`);
  };

  // Filter items based on active category
  const getFilteredItems = () => {
    if (activeCategory === 'electronics') {
      return products.filter(item => item.category === "Electronics & Devices");
    } else if (activeCategory === 'general') {
      return products.filter(item => item.category === "General Goods");
    } else {
      return services;
    }
  };

  // Get currency symbol for a country
  const getCurrencyForCountry = (countryName) => {
    const country = countries.find(c => c.name === countryName);
    return country ? country.currency : "USD";
  };

  // Handle country change in forms
  const handleCountryChange = (formType, countryName) => {
    const currency = getCurrencyForCountry(countryName);
    
    if (formType === 'product') {
      setProductForm(prev => ({ ...prev, country: countryName, currency }));
    } else if (formType === 'general') {
      setGeneralForm(prev => ({ ...prev, country: countryName, currency }));
    } else {
      setServiceForm(prev => ({ ...prev, country: countryName, currency }));
    }
  };

  if (!business) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const currentItems = getFilteredItems();
  const currentCategory = categories[activeCategory];

  return (
    <div className="min-vh-100" style={{ 
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      minHeight: '100vh'
    }}>
      {/* Add CDN Links */}
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet" />
      
      {/* Header */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark bg-opacity-75">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">
            <i className="fas fa-globe-americas me-2"></i>
            ProductFinder Business
          </Link>
          
          <div className="navbar-nav ms-auto">
            <div className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#!" role="button" data-bs-toggle="dropdown">
                <i className="fas fa-store me-1"></i> {business.businessName}
              </a>
              <ul className="dropdown-menu">
                <li><a className="dropdown-item" href="#!" onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt me-2"></i> Logout
                </a></li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      <div className="container-fluid py-4">
        <div className="row">
          {/* Sidebar */}
          <div className="col-lg-3 mb-4">
            <div className="card shadow border-0 rounded-4">
              <div className="card-header bg-primary text-white rounded-top-4">
                <h5 className="mb-0">
                  <i className="fas fa-chart-line me-2"></i>
                  Business Dashboard
                </h5>
              </div>
              <div className="card-body">
                <div className="nav flex-column nav-pills">
                  <button 
                    className={`nav-link text-start mb-2 ${activeTab === "dashboard" ? "active" : ""}`}
                    onClick={() => setActiveTab("dashboard")}
                  >
                    <i className="fas fa-tachometer-alt me-2"></i> Dashboard
                  </button>
                  <button 
                    className={`nav-link text-start mb-2 ${activeTab === "management" ? "active" : ""}`}
                    onClick={() => {
                      setActiveTab("management");
                      // Scroll to management section after tab change
                      setTimeout(() => {
                        scrollToManagementSection();
                      }, 100);
                    }}
                  >
                    <i className="fas fa-cogs me-2"></i> Content Management
                  </button>
                </div>
              </div>
            </div>

            {/* Category Selection */}
            {activeTab === "management" && (
              <div className="card shadow border-0 rounded-4 mt-4">
                <div className="card-header bg-secondary text-white">
                  <h6 className="mb-0">Select Category</h6>
                </div>
                <div className="card-body">
                  {Object.entries(categories).map(([key, category]) => (
                    <button
                      key={key}
                      className={`btn btn-${category.color} w-100 text-start mb-2 ${activeCategory === key ? 'active' : ''}`}
                      onClick={() => handleCategoryChange(key)}
                    >
                      <i className={`fas ${category.icon} me-2`}></i>
                      {category.name}
                      <br />
                      <small className="opacity-75">{category.description}</small>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="card shadow border-0 rounded-4 mt-4">
              <div className="card-body">
                <h6 className="mb-3">Quick Stats</h6>
                <div className="row text-center">
                  <div className="col-6 mb-3">
                    <div className="bg-primary bg-opacity-10 rounded p-2">
                      <div className="fw-bold text-primary">{stats.totalProducts}</div>
                      <small className="text-muted">Products</small>
                    </div>
                  </div>
                  <div className="col-6 mb-3">
                    <div className="bg-success bg-opacity-10 rounded p-2">
                      <div className="fw-bold text-success">{stats.totalServices}</div>
                      <small className="text-muted">Services</small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="bg-warning bg-opacity-10 rounded p-2">
                      <div className="fw-bold text-warning">{stats.inStock}</div>
                      <small className="text-muted">In Stock</small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="bg-info bg-opacity-10 rounded p-2">
                      <div className="fw-bold text-info">{stats.viewsToday}</div>
                      <small className="text-muted">Views Today</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-lg-9">
            {/* Dashboard Tab */}
            {activeTab === "dashboard" && (
              <div className="card shadow border-0 rounded-4 mb-4">
                <div className="card-body">
                  <h4 className="mb-4">Welcome back, {business.businessName}!</h4>
                  
                  <div className="row">
                    <div className="col-md-3 mb-4">
                      <div className="card bg-primary text-white">
                        <div className="card-body text-center">
                          <i className="fas fa-microchip fa-2x mb-3"></i>
                          <h5>Electronics</h5>
                          <h2>{products.filter(p => p.category === "Electronics & Devices").length}</h2>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-md-3 mb-4">
                      <div className="card bg-warning text-white">
                        <div className="card-body text-center">
                          <i className="fas fa-tshirt fa-2x mb-3"></i>
                          <h5>General Goods</h5>
                          <h2>{products.filter(p => p.category === "General Goods").length}</h2>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-3 mb-4">
                      <div className="card bg-success text-white">
                        <div className="card-body text-center">
                          <i className="fas fa-building fa-2x mb-3"></i>
                          <h5>Hotels & Buildings</h5>
                          <h2>{services.length}</h2>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-md-3 mb-4">
                      <div className="card bg-info text-white">
                        <div className="card-body text-center">
                          <i className="fas fa-eye fa-2x mb-3"></i>
                          <h5>Views Today</h5>
                          <h2>{stats.viewsToday}</h2>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Global Presence */}
                  <div className="card mt-4 border-0 shadow-sm">
                    <div className="card-header bg-white">
                      <h5 className="mb-0">
                        <i className="fas fa-globe-americas me-2 text-primary"></i>
                        Global Presence
                      </h5>
                    </div>
                    <div className="card-body">
                      <div className="row text-center">
                        <div className="col-md-2 col-4 mb-3">
                          <div className="border rounded p-3">
                            <i className="fas fa-flag-usa fa-2x text-primary mb-2"></i>
                            <div className="fw-bold">{products.filter(p => p.country === "United States").length + services.filter(s => s.country === "United States").length}</div>
                            <small className="text-muted">USA</small>
                          </div>
                        </div>
                        <div className="col-md-2 col-4 mb-3">
                          <div className="border rounded p-3">
                            <i className="fas fa-flag fa-2x text-success mb-2"></i>
                            <div className="fw-bold">{products.filter(p => p.country === "Tanzania").length + services.filter(s => s.country === "Tanzania").length}</div>
                            <small className="text-muted">Tanzania</small>
                          </div>
                        </div>
                        <div className="col-md-2 col-4 mb-3">
                          <div className="border rounded p-3">
                            <i className="fas fa-flag fa-2x text-danger mb-2"></i>
                            <div className="fw-bold">{products.filter(p => p.country === "Kenya").length + services.filter(s => s.country === "Kenya").length}</div>
                            <small className="text-muted">Kenya</small>
                          </div>
                        </div>
                        <div className="col-md-2 col-4 mb-3">
                          <div className="border rounded p-3">
                            <i className="fas fa-flag fa-2x text-warning mb-2"></i>
                            <div className="fw-bold">{products.filter(p => p.country === "Uganda").length + services.filter(s => s.country === "Uganda").length}</div>
                            <small className="text-muted">Uganda</small>
                          </div>
                        </div>
                        <div className="col-md-2 col-4 mb-3">
                          <div className="border rounded p-3">
                            <i className="fas fa-flag fa-2x text-info mb-2"></i>
                            <div className="fw-bold">{products.filter(p => p.country === "United Kingdom").length + services.filter(s => s.country === "United Kingdom").length}</div>
                            <small className="text-muted">UK</small>
                          </div>
                        </div>
                        <div className="col-md-2 col-4 mb-3">
                          <div className="border rounded p-3">
                            <i className="fas fa-globe fa-2x text-secondary mb-2"></i>
                            <div className="fw-bold">{products.filter(p => !["United States", "Tanzania", "Kenya", "Uganda", "United Kingdom"].includes(p.country)).length + services.filter(s => !["United States", "Tanzania", "Kenya", "Uganda", "United Kingdom"].includes(s.country)).length}</div>
                            <small className="text-muted">Others</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Content Management Tab */}
            {activeTab === "management" && (
              <div ref={managementSectionRef} className="card shadow border-0 rounded-4">
                <div className="card-header bg-white">
                  <div className="d-flex justify-content-between align-items-center">
                    <h4 className="mb-0">
                      <i className={`fas ${currentCategory.icon} me-2 text-${currentCategory.color}`}></i>
                      {currentCategory.name} Management
                    </h4>
                    <button 
                      className={`btn btn-${currentCategory.color}`}
                      onClick={() => {
                        if (activeCategory === 'electronics') {
                          setShowProductForm(true);
                          setShowGeneralForm(false);
                          setShowServiceForm(false);
                          setEditingItem(null);
                        } else if (activeCategory === 'general') {
                          setShowGeneralForm(true);
                          setShowProductForm(false);
                          setShowServiceForm(false);
                          setEditingItem(null);
                        } else {
                          setShowServiceForm(true);
                          setShowProductForm(false);
                          setShowGeneralForm(false);
                          setEditingItem(null);
                        }
                      }}
                    >
                      <i className="fas fa-plus me-2"></i>
                      Add New
                    </button>
                  </div>
                </div>

                <div className="card-body">
                  {/* Electronics & Devices Form */}
                  {activeCategory === 'electronics' && showProductForm && (
                    <div className="card mb-4 border-0 shadow-sm">
                      <div className="card-header bg-primary text-white">
                        <h5 className="mb-0">
                          <i className="fas fa-microchip me-2"></i>
                          {editingItem ? "Edit Electronics Product" : "Add New Electronics Product"}
                        </h5>
                      </div>
                      <div className="card-body">
                        <form onSubmit={handleAddProduct}>
                          <div className="row">
                            <div className="col-md-6 mb-3">
                              <label className="form-label">Product Name *</label>
                              <input
                                type="text"
                                className="form-control"
                                name="name"
                                value={productForm.name}
                                onChange={handleProductFormChange}
                                required
                              />
                            </div>
                            <div className="col-md-6 mb-3">
                              <label className="form-label">Brand</label>
                              <input
                                type="text"
                                className="form-control"
                                name="brand"
                                value={productForm.brand}
                                onChange={handleProductFormChange}
                              />
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-4 mb-3">
                              <label className="form-label">Price *</label>
                              <input
                                type="number"
                                className="form-control"
                                name="price"
                                value={productForm.price}
                                onChange={handleProductFormChange}
                                required
                              />
                            </div>
                            <div className="col-md-4 mb-3">
                              <label className="form-label">Currency</label>
                              <select
                                className="form-select"
                                name="currency"
                                value={productForm.currency}
                                onChange={handleProductFormChange}
                              >
                                {countries.map(country => (
                                  <option key={country.code} value={country.currency}>
                                    {country.currency} ({country.currencySymbol})
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="col-md-4 mb-3">
                              <label className="form-label">Stock Quantity *</label>
                              <input
                                type="number"
                                className="form-control"
                                name="stock"
                                value={productForm.stock}
                                onChange={handleProductFormChange}
                                required
                              />
                            </div>
                          </div>

                          <div className="mb-3">
                            <label className="form-label">Description *</label>
                            <textarea
                              className="form-control"
                              name="description"
                              rows="3"
                              value={productForm.description}
                              onChange={handleProductFormChange}
                              required
                            ></textarea>
                          </div>

                          <div className="mb-3">
                            <label className="form-label">Technical Specifications (one per line)</label>
                            <textarea
                              className="form-control"
                              name="specifications"
                              rows="4"
                              value={productForm.specifications}
                              onChange={handleProductFormChange}
                              placeholder="Processor: Intel Core i7
RAM: 16GB DDR4
Storage: 512GB SSD
Display: 15.6 inch FHD"
                            ></textarea>
                          </div>

                          <div className="mb-3">
                            <label className="form-label">Key Features (one per line)</label>
                            <textarea
                              className="form-control"
                              name="features"
                              rows="3"
                              value={productForm.features}
                              onChange={handleProductFormChange}
                              placeholder="Backlit keyboard
Fingerprint reader
Long battery life
Lightweight design"
                            ></textarea>
                          </div>

                          <div className="row">
                            <div className="col-md-4 mb-3">
                              <label className="form-label">Condition</label>
                              <select
                                className="form-select"
                                name="condition"
                                value={productForm.condition}
                                onChange={handleProductFormChange}
                              >
                                {conditions.map(condition => (
                                  <option key={condition} value={condition.toLowerCase()}>
                                    {condition}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="col-md-4 mb-3">
                              <label className="form-label">Country *</label>
                              <select
                                className="form-select"
                                name="country"
                                value={productForm.country}
                                onChange={(e) => handleCountryChange('product', e.target.value)}
                                required
                              >
                                {countries.map(country => (
                                  <option key={country.code} value={country.name}>
                                    {country.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="col-md-4 mb-3">
                              <label className="form-label">Region/State</label>
                              <select
                                className="form-select"
                                name="region"
                                value={productForm.region}
                                onChange={handleProductFormChange}
                              >
                                <option value="">Select Region</option>
                                {regionsByCountry[productForm.country]?.map(region => (
                                  <option key={region} value={region}>{region}</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-6 mb-3">
                              <label className="form-label">City</label>
                              <input
                                type="text"
                                className="form-control"
                                name="city"
                                value={productForm.city}
                                onChange={handleProductFormChange}
                              />
                            </div>
                            <div className="col-md-6 mb-3">
                              <label className="form-label">Address</label>
                              <input
                                type="text"
                                className="form-control"
                                name="address"
                                value={productForm.address}
                                onChange={handleProductFormChange}
                              />
                            </div>
                          </div>

                          <div className="mb-3">
                            <label className="form-label">Product Images</label>
                            <input
                              type="file"
                              className="form-control"
                              multiple
                              accept="image/*"
                              onChange={handleProductImageChange}
                            />
                            <div className="mt-2">
                              {productForm.imagePreviews.map((preview, index) => (
                                <div key={index} className="position-relative d-inline-block me-2 mb-2">
                                  <img src={preview} alt="Preview" className="rounded" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                                  <button
                                    type="button"
                                    className="btn btn-danger btn-sm position-absolute top-0 end-0"
                                    onClick={() => removeProductImage(index)}
                                  >
                                    <i className="fas fa-times"></i>
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="d-flex gap-2">
                            <button type="submit" className="btn btn-primary">
                              <i className="fas fa-save me-2"></i>
                              {editingItem ? "Update Product" : "Add Product"}
                            </button>
                            <button type="button" className="btn btn-secondary" onClick={resetProductForm}>
                              <i className="fas fa-times me-2"></i>
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}

                  {/* General Goods Form */}
                  {activeCategory === 'general' && showGeneralForm && (
                    <div className="card mb-4 border-0 shadow-sm">
                      <div className="card-header bg-warning text-white">
                        <h5 className="mb-0">
                          <i className="fas fa-tshirt me-2"></i>
                          {editingItem ? "Edit General Product" : "Add New General Product"}
                        </h5>
                      </div>
                      <div className="card-body">
                        <form onSubmit={handleAddGeneral}>
                          <div className="row">
                            <div className="col-md-6 mb-3">
                              <label className="form-label">Product Name *</label>
                              <input
                                type="text"
                                className="form-control"
                                name="name"
                                value={generalForm.name}
                                onChange={handleGeneralFormChange}
                                required
                              />
                            </div>
                            <div className="col-md-6 mb-3">
                              <label className="form-label">Brand</label>
                              <input
                                type="text"
                                className="form-control"
                                name="brand"
                                value={generalForm.brand}
                                onChange={handleGeneralFormChange}
                              />
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-4 mb-3">
                              <label className="form-label">Price *</label>
                              <input
                                type="number"
                                className="form-control"
                                name="price"
                                value={generalForm.price}
                                onChange={handleGeneralFormChange}
                                required
                              />
                            </div>
                            <div className="col-md-4 mb-3">
                              <label className="form-label">Currency</label>
                              <select
                                className="form-select"
                                name="currency"
                                value={generalForm.currency}
                                onChange={handleGeneralFormChange}
                              >
                                {countries.map(country => (
                                  <option key={country.code} value={country.currency}>
                                    {country.currency} ({country.currencySymbol})
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="col-md-4 mb-3">
                              <label className="form-label">Stock Quantity *</label>
                              <input
                                type="number"
                                className="form-control"
                                name="stock"
                                value={generalForm.stock}
                                onChange={handleGeneralFormChange}
                                required
                              />
                            </div>
                          </div>

                          <div className="mb-3">
                            <label className="form-label">Description *</label>
                            <textarea
                              className="form-control"
                              name="description"
                              rows="3"
                              value={generalForm.description}
                              onChange={handleGeneralFormChange}
                              required
                            ></textarea>
                          </div>

                          <div className="mb-3">
                            <label className="form-label">Features (one per line)</label>
                            <textarea
                              className="form-control"
                              name="features"
                              rows="3"
                              value={generalForm.features}
                              onChange={handleGeneralFormChange}
                              placeholder="Comfortable fit
Durable material
Easy to clean
Water resistant"
                            ></textarea>
                          </div>

                          <div className="row">
                            <div className="col-md-4 mb-3">
                              <label className="form-label">Condition</label>
                              <select
                                className="form-select"
                                name="condition"
                                value={generalForm.condition}
                                onChange={handleGeneralFormChange}
                              >
                                {conditions.map(condition => (
                                  <option key={condition} value={condition.toLowerCase()}>
                                    {condition}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="col-md-4 mb-3">
                              <label className="form-label">Size</label>
                              <select
                                className="form-select"
                                name="size"
                                value={generalForm.size}
                                onChange={handleGeneralFormChange}
                              >
                                <option value="">Select Size</option>
                                {sizes.map(size => (
                                  <option key={size} value={size}>{size}</option>
                                ))}
                              </select>
                            </div>
                            <div className="col-md-4 mb-3">
                              <label className="form-label">Color</label>
                              <select
                                className="form-select"
                                name="color"
                                value={generalForm.color}
                                onChange={handleGeneralFormChange}
                              >
                                <option value="">Select Color</option>
                                {colors.map(color => (
                                  <option key={color} value={color}>{color}</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-4 mb-3">
                              <label className="form-label">Material</label>
                              <select
                                className="form-select"
                                name="material"
                                value={generalForm.material}
                                onChange={handleGeneralFormChange}
                              >
                                <option value="">Select Material</option>
                                {materials.map(material => (
                                  <option key={material} value={material}>{material}</option>
                                ))}
                              </select>
                            </div>
                            <div className="col-md-4 mb-3">
                              <label className="form-label">Country *</label>
                              <select
                                className="form-select"
                                name="country"
                                value={generalForm.country}
                                onChange={(e) => handleCountryChange('general', e.target.value)}
                                required
                              >
                                {countries.map(country => (
                                  <option key={country.code} value={country.name}>
                                    {country.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="col-md-4 mb-3">
                              <label className="form-label">Region/State</label>
                              <select
                                className="form-select"
                                name="region"
                                value={generalForm.region}
                                onChange={handleGeneralFormChange}
                              >
                                <option value="">Select Region</option>
                                {regionsByCountry[generalForm.country]?.map(region => (
                                  <option key={region} value={region}>{region}</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-6 mb-3">
                              <label className="form-label">City</label>
                              <input
                                type="text"
                                className="form-control"
                                name="city"
                                value={generalForm.city}
                                onChange={handleGeneralFormChange}
                              />
                            </div>
                            <div className="col-md-6 mb-3">
                              <label className="form-label">Address</label>
                              <input
                                type="text"
                                className="form-control"
                                name="address"
                                value={generalForm.address}
                                onChange={handleGeneralFormChange}
                              />
                            </div>
                          </div>

                          <div className="mb-3">
                            <label className="form-label">Product Images</label>
                            <input
                              type="file"
                              className="form-control"
                              multiple
                              accept="image/*"
                              onChange={handleGeneralImageChange}
                            />
                            <div className="mt-2">
                              {generalForm.imagePreviews.map((preview, index) => (
                                <div key={index} className="position-relative d-inline-block me-2 mb-2">
                                  <img src={preview} alt="Preview" className="rounded" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                                  <button
                                    type="button"
                                    className="btn btn-danger btn-sm position-absolute top-0 end-0"
                                    onClick={() => removeGeneralImage(index)}
                                  >
                                    <i className="fas fa-times"></i>
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="d-flex gap-2">
                            <button type="submit" className="btn btn-warning">
                              <i className="fas fa-save me-2"></i>
                              {editingItem ? "Update Product" : "Add Product"}
                            </button>
                            <button type="button" className="btn btn-secondary" onClick={resetGeneralForm}>
                              <i className="fas fa-times me-2"></i>
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}

                  {/* Building & Hotels Form */}
                  {activeCategory === 'building' && showServiceForm && (
                    <div className="card mb-4 border-0 shadow-sm">
                      <div className="card-header bg-success text-white">
                        <h5 className="mb-0">
                          <i className="fas fa-building me-2"></i>
                          {editingItem ? "Edit Service" : "Add New Service"}
                        </h5>
                      </div>
                      <div className="card-body">
                        <form onSubmit={handleAddService}>
                          <div className="row">
                            <div className="col-md-6 mb-3">
                              <label className="form-label">Service Name *</label>
                              <input
                                type="text"
                                className="form-control"
                                name="name"
                                value={serviceForm.name}
                                onChange={handleServiceFormChange}
                                required
                              />
                            </div>
                            <div className="col-md-6 mb-3">
                              <label className="form-label">Service Type *</label>
                              <select
                                className="form-select"
                                name="serviceType"
                                value={serviceForm.serviceType}
                                onChange={handleServiceFormChange}
                                required
                              >
                                {serviceTypes.map(type => (
                                  <option key={type} value={type}>{type}</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-6 mb-3">
                              <label className="form-label">Price Range</label>
                              <input
                                type="text"
                                className="form-control"
                                name="priceRange"
                                value={serviceForm.priceRange}
                                onChange={handleServiceFormChange}
                                placeholder="e.g., $100-$200 per night"
                              />
                            </div>
                            <div className="col-md-6 mb-3">
                              <label className="form-label">Currency</label>
                              <select
                                className="form-select"
                                name="currency"
                                value={serviceForm.currency}
                                onChange={handleServiceFormChange}
                              >
                                {countries.map(country => (
                                  <option key={country.code} value={country.currency}>
                                    {country.currency} ({country.currencySymbol})
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="mb-3">
                            <label className="form-label">Description *</label>
                            <textarea
                              className="form-control"
                              name="description"
                              rows="3"
                              value={serviceForm.description}
                              onChange={handleServiceFormChange}
                              required
                            ></textarea>
                          </div>

                          <div className="mb-3">
                            <label className="form-label">Amenities (one per line)</label>
                            <textarea
                              className="form-control"
                              name="amenities"
                              rows="3"
                              value={serviceForm.amenities}
                              onChange={handleServiceFormChange}
                              placeholder="Free WiFi
Swimming Pool
Air Conditioning
Restaurant
Fitness Center"
                            ></textarea>
                          </div>

                          <div className="mb-3">
                            <label className="form-label">Services Offered (one per line)</label>
                            <textarea
                              className="form-control"
                              name="services"
                              rows="3"
                              value={serviceForm.services}
                              onChange={handleServiceFormChange}
                              placeholder="Room Service
Laundry Service
Airport Transfer
Tour Booking
Conference Facilities"
                            ></textarea>
                          </div>

                          <div className="row">
                            <div className="col-md-4 mb-3">
                              <label className="form-label">Country *</label>
                              <select
                                className="form-select"
                                name="country"
                                value={serviceForm.country}
                                onChange={(e) => handleCountryChange('service', e.target.value)}
                                required
                              >
                                {countries.map(country => (
                                  <option key={country.code} value={country.name}>
                                    {country.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="col-md-4 mb-3">
                              <label className="form-label">Region/State</label>
                              <select
                                className="form-select"
                                name="region"
                                value={serviceForm.region}
                                onChange={handleServiceFormChange}
                              >
                                <option value="">Select Region</option>
                                {regionsByCountry[serviceForm.country]?.map(region => (
                                  <option key={region} value={region}>{region}</option>
                                ))}
                              </select>
                            </div>
                            <div className="col-md-4 mb-3">
                              <label className="form-label">City</label>
                              <input
                                type="text"
                                className="form-control"
                                name="city"
                                value={serviceForm.city}
                                onChange={handleServiceFormChange}
                              />
                            </div>
                          </div>

                          <div className="mb-3">
                            <label className="form-label">Address</label>
                            <input
                              type="text"
                              className="form-control"
                              name="address"
                              value={serviceForm.address}
                              onChange={handleServiceFormChange}
                            />
                          </div>

                          <div className="row">
                            <div className="col-md-6 mb-3">
                              <label className="form-label">Contact Information</label>
                              <input
                                type="text"
                                className="form-control"
                                name="contactInfo"
                                value={serviceForm.contactInfo}
                                onChange={handleServiceFormChange}
                                placeholder="Phone, email, etc."
                              />
                            </div>
                            <div className="col-md-6 mb-3">
                              <label className="form-label">Capacity</label>
                              <input
                                type="text"
                                className="form-control"
                                name="capacity"
                                value={serviceForm.capacity}
                                onChange={handleServiceFormChange}
                                placeholder="e.g., 100 guests, 50 rooms"
                              />
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-4 mb-3">
                              <label className="form-label">Rating</label>
                              <select
                                className="form-select"
                                name="rating"
                                value={serviceForm.rating}
                                onChange={handleServiceFormChange}
                              >
                                <option value="">Select Rating</option>
                                <option value="5">★★★★★ (5)</option>
                                <option value="4">★★★★☆ (4)</option>
                                <option value="3">★★★☆☆ (3)</option>
                                <option value="2">★★☆☆☆ (2)</option>
                                <option value="1">★☆☆☆☆ (1)</option>
                              </select>
                            </div>
                            <div className="col-md-4 mb-3">
                              <label className="form-label">Check-in Time</label>
                              <input
                                type="time"
                                className="form-control"
                                name="checkInTime"
                                value={serviceForm.checkInTime}
                                onChange={handleServiceFormChange}
                              />
                            </div>
                            <div className="col-md-4 mb-3">
                              <label className="form-label">Check-out Time</label>
                              <input
                                type="time"
                                className="form-control"
                                name="checkOutTime"
                                value={serviceForm.checkOutTime}
                                onChange={handleServiceFormChange}
                              />
                            </div>
                          </div>

                          <div className="mb-3">
                            <label className="form-label">Policies</label>
                            <textarea
                              className="form-control"
                              name="policies"
                              rows="3"
                              value={serviceForm.policies}
                              onChange={handleServiceFormChange}
                              placeholder="Cancellation policy, check-in requirements, etc."
                            ></textarea>
                          </div>

                          <div className="mb-3">
                            <label className="form-label">Service Images</label>
                            <input
                              type="file"
                              className="form-control"
                              multiple
                              accept="image/*"
                              onChange={handleServiceImageChange}
                            />
                            <div className="mt-2">
                              {serviceForm.imagePreviews.map((preview, index) => (
                                <div key={index} className="position-relative d-inline-block me-2 mb-2">
                                  <img src={preview} alt="Preview" className="rounded" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                                  <button
                                    type="button"
                                    className="btn btn-danger btn-sm position-absolute top-0 end-0"
                                    onClick={() => removeServiceImage(index)}
                                  >
                                    <i className="fas fa-times"></i>
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="d-flex gap-2">
                            <button type="submit" className="btn btn-success">
                              <i className="fas fa-save me-2"></i>
                              {editingItem ? "Update Service" : "Add Service"}
                            </button>
                            <button type="button" className="btn btn-secondary" onClick={resetServiceForm}>
                              <i className="fas fa-times me-2"></i>
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}

                  {/* Items List */}
                  <div className="card border-0 shadow-sm">
                    <div className="card-header bg-white">
                      <h5 className="mb-0">
                        <i className={`fas ${currentCategory.icon} me-2 text-${currentCategory.color}`}></i>
                        {currentCategory.name} List ({currentItems.length})
                      </h5>
                    </div>
                    <div className="card-body">
                      {currentItems.length === 0 ? (
                        <div className="text-center py-5">
                          <i className={`fas ${currentCategory.icon} fa-4x text-muted mb-3`}></i>
                          <h5 className="text-muted">No {currentCategory.name.toLowerCase()} found</h5>
                          <p className="text-muted">Click "Add New" to add your first item</p>
                        </div>
                      ) : (
                        <div className="row">
                          {currentItems.map(item => (
                            <div key={item.id} className="col-md-6 col-lg-4 mb-4">
                              <div className="card h-100 shadow-sm border-0">
                                {item.images && item.images.length > 0 && (
                                  <img 
                                    src={item.images[0]} 
                                    className="card-img-top" 
                                    alt={item.name}
                                    style={{ height: '200px', objectFit: 'cover' }}
                                  />
                                )}
                                <div className="card-body">
                                  <h6 className="card-title">{item.name}</h6>
                                  <p className="card-text small text-muted mb-2">
                                    {item.description.length > 100 
                                      ? `${item.description.substring(0, 100)}...` 
                                      : item.description}
                                  </p>
                                  
                                  <div className="d-flex justify-content-between align-items-center mb-2">
                                    <span className="fw-bold text-primary">
                                      {item.currencySymbol || '$'}{item.price}
                                      {item.priceRange && ` - ${item.priceRange}`}
                                    </span>
                                    {item.stock !== undefined && (
                                      <span className={`badge ${item.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
                                        {item.stock > 0 ? `${item.stock} in stock` : 'Out of stock'}
                                      </span>
                                    )}
                                  </div>

                                  <div className="small text-muted mb-3">
                                    <div><i className="fas fa-map-marker-alt me-1"></i> {item.city || item.region}, {item.country}</div>
                                    {item.condition && (
                                      <div><i className="fas fa-tag me-1"></i> {item.condition}</div>
                                    )}
                                    {item.serviceType && (
                                      <div><i className="fas fa-building me-1"></i> {item.serviceType}</div>
                                    )}
                                  </div>

                                  <div className="d-flex gap-2">
                                    <button
                                      className="btn btn-outline-primary btn-sm flex-fill"
                                      onClick={() => handleEditItem(item)}
                                    >
                                      <i className="fas fa-edit me-1"></i> Edit
                                    </button>
                                    <button
                                      className="btn btn-outline-info btn-sm flex-fill"
                                      onClick={() => handleViewItem(item.id)}
                                    >
                                      <i className="fas fa-eye me-1"></i> View
                                    </button>
                                    <button
                                      className="btn btn-outline-danger btn-sm"
                                      onClick={() => handleDeleteItem(item.id, item.category)}
                                    >
                                      <i className="fas fa-trash"></i>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bootstrap JS */}
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    </div>
  );
}

export default BusinessDashboard;