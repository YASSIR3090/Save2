// src/BusinessListingPage.jsx - WITH IMAGE UPLOAD FUNCTIONALITY
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

function BusinessListingPage() {
  const { category } = useParams();
  const navigate = useNavigate();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const fileInputRef = useRef(null);
  
  // Product Form State
  const [productForm, setProductForm] = useState({
    name: "",
    category: category || "",
    price: "",
    currency: "TZS",
    stock: "",
    description: "",
    images: [],
    brand: "",
    condition: "new",
    specifications: [""],
    features: [""]
  });

  // Service Form State (for Building & Hotels)
  const [serviceForm, setServiceForm] = useState({
    name: "",
    category: category || "",
    serviceType: "",
    priceRange: "",
    currency: "USD",
    description: "",
    images: [],
    amenities: [""],
    services: [""],
    contactInfo: "",
    capacity: "",
    checkInTime: "14:00",
    checkOutTime: "12:00",
    policies: ""
  });

  // Vehicle Specific Form State
  const [vehicleForm, setVehicleForm] = useState({
    name: "",
    category: "Vehicles",
    price: "",
    currency: "TZS",
    stock: "",
    description: "",
    images: [],
    brand: "",
    condition: "new",
    vehicleType: "suv",
    year: new Date().getFullYear().toString(),
    mileage: "",
    fuelType: "petrol",
    transmission: "automatic",
    color: "",
    features: [""],
    specifications: [""]
  });

  // Category configurations
  const categoryConfig = {
    "electronics": {
      name: "Electronics & Devices",
      type: "product",
      requiresSpecifications: true,
      icon: "fa-microchip",
      color: "primary",
      description: "List laptops, smartphones, electronics with specifications"
    },
    "general": {
      name: "General Goods", 
      type: "product",
      requiresSpecifications: false,
      icon: "fa-tshirt",
      color: "warning",
      description: "List clothing, shoes, items without technical specifications"
    },
    "vehicles": {
      name: "Vehicles",
      type: "product",
      requiresSpecifications: true,
      icon: "fa-car",
      color: "danger",
      description: "List cars, motorcycles, bicycles, airplanes, vehicles"
    },
    "building": {
      name: "Building & Hotels",
      type: "service",
      requiresSpecifications: false,
      icon: "fa-building",
      color: "success",
      description: "List hotels, apartments, luxury properties with services"
    }
  };

  // Initialize page
  useEffect(() => {
    const initializePage = () => {
      const isAuthenticated = localStorage.getItem('businessAuthenticated') === 'true';
      const businessData = JSON.parse(localStorage.getItem('currentBusiness'));
      
      if (!isAuthenticated || !businessData) {
        navigate('/business-auth');
        return;
      }

      setBusiness(businessData);
      
      // Set category in forms
      if (category) {
        const categoryName = categoryConfig[category]?.name || category;
        setProductForm(prev => ({ ...prev, category: categoryName }));
        setServiceForm(prev => ({ ...prev, category: categoryName }));
        setVehicleForm(prev => ({ ...prev, category: categoryName }));
      }
    };

    initializePage();
  }, [category, navigate]);

  // Handle file upload
  const handleImageUpload = (event, formType) => {
    const files = Array.from(event.target.files);
    
    if (files.length === 0) return;

    // Validate file types and sizes
    const validFiles = files.filter(file => {
      const isValidType = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB max
      
      if (!isValidType) {
        alert(`File ${file.name} is not a supported image type. Please use JPEG, PNG, or WebP.`);
        return false;
      }
      
      if (!isValidSize) {
        alert(`File ${file.name} is too large. Maximum size is 5MB.`);
        return false;
      }
      
      return true;
    });

    if (validFiles.length === 0) return;

    // Convert images to base64 for storage
    validFiles.forEach(file => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const imageData = e.target.result;
        
        if (formType === 'product') {
          setProductForm(prev => ({
            ...prev,
            images: [...prev.images, imageData]
          }));
        } else if (formType === 'service') {
          setServiceForm(prev => ({
            ...prev,
            images: [...prev.images, imageData]
          }));
        } else if (formType === 'vehicle') {
          setVehicleForm(prev => ({
            ...prev,
            images: [...prev.images, imageData]
          }));
        }
      };
      
      reader.readAsDataURL(file);
    });

    // Reset file input
    event.target.value = '';
  };

  // Remove uploaded image
  const removeImage = (formType, index) => {
    if (formType === 'product') {
      setProductForm(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
    } else if (formType === 'service') {
      setServiceForm(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
    } else if (formType === 'vehicle') {
      setVehicleForm(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
    }
  };

  // Handle product form changes
  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProductForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle service form changes
  const handleServiceChange = (e) => {
    const { name, value } = e.target;
    setServiceForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle vehicle form changes
  const handleVehicleChange = (e) => {
    const { name, value } = e.target;
    setVehicleForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle specifications input
  const handleSpecificationChange = (formType, index, value) => {
    if (formType === 'product') {
      const newSpecifications = [...productForm.specifications];
      newSpecifications[index] = value;
      setProductForm(prev => ({
        ...prev,
        specifications: newSpecifications
      }));
    } else if (formType === 'vehicle') {
      const newSpecifications = [...vehicleForm.specifications];
      newSpecifications[index] = value;
      setVehicleForm(prev => ({
        ...prev,
        specifications: newSpecifications
      }));
    }
  };

  const addSpecification = (formType) => {
    if (formType === 'product') {
      setProductForm(prev => ({
        ...prev,
        specifications: [...prev.specifications, ""]
      }));
    } else if (formType === 'vehicle') {
      setVehicleForm(prev => ({
        ...prev,
        specifications: [...prev.specifications, ""]
      }));
    }
  };

  const removeSpecification = (formType, index) => {
    if (formType === 'product') {
      const newSpecifications = productForm.specifications.filter((_, i) => i !== index);
      setProductForm(prev => ({
        ...prev,
        specifications: newSpecifications
      }));
    } else if (formType === 'vehicle') {
      const newSpecifications = vehicleForm.specifications.filter((_, i) => i !== index);
      setVehicleForm(prev => ({
        ...prev,
        specifications: newSpecifications
      }));
    }
  };

  // Handle features input
  const handleFeatureChange = (formType, index, value) => {
    if (formType === 'product') {
      const newFeatures = [...productForm.features];
      newFeatures[index] = value;
      setProductForm(prev => ({
        ...prev,
        features: newFeatures
      }));
    } else if (formType === 'vehicle') {
      const newFeatures = [...vehicleForm.features];
      newFeatures[index] = value;
      setVehicleForm(prev => ({
        ...prev,
        features: newFeatures
      }));
    } else if (formType === 'service') {
      const newFeatures = [...serviceForm.features];
      newFeatures[index] = value;
      setServiceForm(prev => ({
        ...prev,
        features: newFeatures
      }));
    }
  };

  const addFeature = (formType) => {
    if (formType === 'product') {
      setProductForm(prev => ({
        ...prev,
        features: [...prev.features, ""]
      }));
    } else if (formType === 'vehicle') {
      setVehicleForm(prev => ({
        ...prev,
        features: [...prev.features, ""]
      }));
    } else if (formType === 'service') {
      setServiceForm(prev => ({
        ...prev,
        features: [...prev.features, ""]
      }));
    }
  };

  const removeFeature = (formType, index) => {
    if (formType === 'product') {
      const newFeatures = productForm.features.filter((_, i) => i !== index);
      setProductForm(prev => ({
        ...prev,
        features: newFeatures
      }));
    } else if (formType === 'vehicle') {
      const newFeatures = vehicleForm.features.filter((_, i) => i !== index);
      setVehicleForm(prev => ({
        ...prev,
        features: newFeatures
      }));
    } else if (formType === 'service') {
      const newFeatures = serviceForm.features.filter((_, i) => i !== index);
      setServiceForm(prev => ({
        ...prev,
        features: newFeatures
      }));
    }
  };

  // Handle amenities input
  const handleAmenityChange = (index, value) => {
    const newAmenities = [...serviceForm.amenities];
    newAmenities[index] = value;
    setServiceForm(prev => ({
      ...prev,
      amenities: newAmenities
    }));
  };

  const addAmenity = () => {
    setServiceForm(prev => ({
      ...prev,
      amenities: [...prev.amenities, ""]
    }));
  };

  const removeAmenity = (index) => {
    const newAmenities = serviceForm.amenities.filter((_, i) => i !== index);
    setServiceForm(prev => ({
      ...prev,
      amenities: newAmenities
    }));
  };

  // Handle services input
  const handleServiceItemChange = (index, value) => {
    const newServices = [...serviceForm.services];
    newServices[index] = value;
    setServiceForm(prev => ({
      ...prev,
      services: newServices
    }));
  };

  const addServiceItem = () => {
    setServiceForm(prev => ({
      ...prev,
      services: [...prev.services, ""]
    }));
  };

  const removeServiceItem = (index) => {
    const newServices = serviceForm.services.filter((_, i) => i !== index);
    setServiceForm(prev => ({
      ...prev,
      services: newServices
    }));
  };

  // Generate unique ID
  const generateId = () => {
    return `${category}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  // Update verifiedBusinesses with new items
  const updateVerifiedBusinesses = (newItem) => {
    try {
      const verifiedBusinesses = JSON.parse(localStorage.getItem('verifiedBusinesses')) || [];
      const businessIndex = verifiedBusinesses.findIndex(b => b.id === business.id);
      
      if (businessIndex !== -1) {
        const updatedBusiness = { ...verifiedBusinesses[businessIndex] };
        
        if (!updatedBusiness.items) updatedBusiness.items = [];
        updatedBusiness.items.push({
          id: newItem.id,
          name: newItem.name,
          category: newItem.category,
          type: newItem.type
        });
        
        verifiedBusinesses[businessIndex] = updatedBusiness;
        localStorage.setItem('verifiedBusinesses', JSON.stringify(verifiedBusinesses));
      }
    } catch (error) {
      console.error("Error updating verified businesses:", error);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");

    // Validate images
    const currentImages = currentCategory.type === 'service' ? serviceForm.images : 
                         (category === 'vehicles' ? vehicleForm.images : productForm.images);
    
    if (currentImages.length === 0) {
      alert("Please upload at least one image for your listing.");
      setLoading(false);
      return;
    }

    try {
      const currentCategory = categoryConfig[category];
      let newItem;

      if (currentCategory.type === 'service') {
        // Handle service submission (Building & Hotels)
        newItem = {
          id: generateId(),
          ...serviceForm,
          type: "service",
          business: business.businessName,
          businessName: business.businessName,
          businessPhone: business.phone,
          businessEmail: business.email,
          businessAddress: business.address,
          location: business.location || { lat: -6.7924, lng: 39.2083 },
          address: business.address,
          country: business.country,
          region: business.region,
          city: business.city,
          lastUpdated: new Date().toISOString().split('T')[0],
          rating: "5",
          reviews: 0,
          featured: true,
          requiresSpecifications: false,
          // Filter out empty values
          amenities: serviceForm.amenities.filter(amenity => amenity.trim() !== ""),
          services: serviceForm.services.filter(service => service.trim() !== ""),
          features: serviceForm.features.filter(feature => feature.trim() !== "")
        };

        // Save to localStorage
        const existingServices = JSON.parse(localStorage.getItem(`services_${business.id}`)) || [];
        const updatedServices = [...existingServices, newItem];
        localStorage.setItem(`services_${business.id}`, JSON.stringify(updatedServices));

        // Update verified businesses
        updateVerifiedBusinesses(newItem);

      } else if (category === 'vehicles') {
        // Handle vehicle submission
        newItem = {
          id: generateId(),
          ...vehicleForm,
          type: "product",
          business: business.businessName,
          businessName: business.businessName,
          businessPhone: business.phone,
          businessEmail: business.email,
          businessAddress: business.address,
          location: business.location || { lat: -6.7924, lng: 39.2083 },
          address: business.address,
          country: business.country,
          region: business.region,
          city: business.city,
          lastUpdated: new Date().toISOString().split('T')[0],
          rating: 4.8,
          reviews: 0,
          featured: true,
          requiresSpecifications: true,
          // Filter out empty values
          features: vehicleForm.features.filter(feature => feature.trim() !== ""),
          specifications: vehicleForm.specifications.filter(spec => spec.trim() !== "")
        };

        // Save to localStorage
        const existingProducts = JSON.parse(localStorage.getItem(`products_${business.id}`)) || [];
        const updatedProducts = [...existingProducts, newItem];
        localStorage.setItem(`products_${business.id}`, JSON.stringify(updatedProducts));

        // Update verified businesses
        updateVerifiedBusinesses(newItem);

      } else {
        // Handle product submission (Electronics & General Goods)
        newItem = {
          id: generateId(),
          ...productForm,
          type: "product",
          business: business.businessName,
          businessName: business.businessName,
          businessPhone: business.phone,
          businessEmail: business.email,
          businessAddress: business.address,
          location: business.location || { lat: -6.7924, lng: 39.2083 },
          address: business.address,
          country: business.country,
          region: business.region,
          city: business.city,
          lastUpdated: new Date().toISOString().split('T')[0],
          rating: 4.5,
          reviews: 0,
          featured: true,
          requiresSpecifications: currentCategory.requiresSpecifications,
          // Filter out empty values
          features: productForm.features.filter(feature => feature.trim() !== ""),
          specifications: productForm.specifications.filter(spec => spec.trim() !== "")
        };

        // Save to localStorage
        const existingProducts = JSON.parse(localStorage.getItem(`products_${business.id}`)) || [];
        const updatedProducts = [...existingProducts, newItem];
        localStorage.setItem(`products_${business.id}`, JSON.stringify(updatedProducts));

        // Update verified businesses
        updateVerifiedBusinesses(newItem);
      }

      // Force refresh of all data
      localStorage.setItem('dataLastUpdated', Date.now().toString());
      
      setSuccessMessage(`Successfully listed ${currentCategory.name.toLowerCase()}! It will appear in search results immediately.`);
      
      // Reset form
      if (currentCategory.type === 'service') {
        setServiceForm({
          name: "",
          category: currentCategory.name,
          serviceType: "",
          priceRange: "",
          currency: "USD",
          description: "",
          images: [],
          amenities: [""],
          services: [""],
          features: [""],
          contactInfo: "",
          capacity: "",
          checkInTime: "14:00",
          checkOutTime: "12:00",
          policies: ""
        });
      } else if (category === 'vehicles') {
        setVehicleForm({
          name: "",
          category: "Vehicles",
          price: "",
          currency: "TZS",
          stock: "",
          description: "",
          images: [],
          brand: "",
          condition: "new",
          vehicleType: "suv",
          year: new Date().getFullYear().toString(),
          mileage: "",
          fuelType: "petrol",
          transmission: "automatic",
          color: "",
          features: [""],
          specifications: [""]
        });
      } else {
        setProductForm({
          name: "",
          category: currentCategory.name,
          price: "",
          currency: "TZS",
          stock: "",
          description: "",
          images: [],
          brand: "",
          condition: "new",
          specifications: [""],
          features: [""]
        });
      }

      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        navigate('/business-dashboard');
      }, 3000);

    } catch (error) {
      console.error("Error saving item:", error);
      alert("Error saving item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Get current category configuration
  const currentCategory = categoryConfig[category];

  if (!business || !currentCategory) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Get current form images based on category
  const currentFormImages = currentCategory.type === 'service' ? serviceForm.images : 
                           (category === 'vehicles' ? vehicleForm.images : productForm.images);

  return (
    <div className="min-vh-100" style={{ 
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      minHeight: '100vh'
    }}>
      {/* Header */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark bg-opacity-75">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/business-dashboard">
            <i className="fas fa-arrow-left me-2"></i>
            Back to Dashboard
          </Link>
          <div className="d-flex align-items-center">
            <span className="text-light me-3">
              <i className="fas fa-store me-1"></i>
              {business.businessName}
            </span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10 col-xl-8">
            {/* Header Card */}
            <div className="card shadow-lg border-0 mb-4">
              <div className="card-body text-center p-4">
                <div className={`bg-${currentCategory.color} bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3`} 
                     style={{ width: '80px', height: '80px' }}>
                  <i className={`fas ${currentCategory.icon} fa-2x text-${currentCategory.color}`}></i>
                </div>
                <h2 className="fw-bold text-dark mb-2">List New {currentCategory.name}</h2>
                <p className="text-muted mb-0">{currentCategory.description}</p>
              </div>
            </div>

            {/* Success Message */}
            {successMessage && (
              <div className="alert alert-success alert-dismissible fade show" role="alert">
                <i className="fas fa-check-circle me-2"></i>
                {successMessage}
                <button type="button" className="btn-close" onClick={() => setSuccessMessage("")}></button>
              </div>
            )}

            {/* Listing Form */}
            <div className="card shadow-lg border-0">
              <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                  
                  {/* Common Fields for All Categories */}
                  <div className="row mb-4">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">Name/Title *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder={`Enter ${currentCategory.name.toLowerCase()} name`}
                        required
                        value={currentCategory.type === 'service' ? serviceForm.name : (category === 'vehicles' ? vehicleForm.name : productForm.name)}
                        onChange={(e) => {
                          if (currentCategory.type === 'service') {
                            handleServiceChange(e);
                          } else if (category === 'vehicles') {
                            handleVehicleChange(e);
                          } else {
                            handleProductChange(e);
                          }
                        }}
                        name="name"
                      />
                    </div>

                    {currentCategory.type === 'service' ? (
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Service Type *</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g., 5-Star Hotel, Luxury Apartment"
                          required
                          value={serviceForm.serviceType}
                          onChange={handleServiceChange}
                          name="serviceType"
                        />
                      </div>
                    ) : (
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Brand *</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter brand name"
                          required
                          value={category === 'vehicles' ? vehicleForm.brand : productForm.brand}
                          onChange={(e) => {
                            if (category === 'vehicles') {
                              handleVehicleChange(e);
                            } else {
                              handleProductChange(e);
                            }
                          }}
                          name="brand"
                        />
                      </div>
                    )}
                  </div>

                  {/* Price Information */}
                  <div className="row mb-4">
                    {currentCategory.type === 'service' ? (
                      <>
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-bold">Price Range *</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="e.g., 150-300"
                            required
                            value={serviceForm.priceRange}
                            onChange={handleServiceChange}
                            name="priceRange"
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-bold">Currency</label>
                          <select
                            className="form-select"
                            value={serviceForm.currency}
                            onChange={handleServiceChange}
                            name="currency"
                          >
                            <option value="USD">USD ($)</option>
                            <option value="TZS">TZS (TSh)</option>
                            <option value="KES">KES (KSh)</option>
                          </select>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="col-md-4 mb-3">
                          <label className="form-label fw-bold">Price *</label>
                          <input
                            type="number"
                            className="form-control"
                            placeholder="Enter price"
                            required
                            value={category === 'vehicles' ? vehicleForm.price : productForm.price}
                            onChange={(e) => {
                              if (category === 'vehicles') {
                                handleVehicleChange(e);
                              } else {
                                handleProductChange(e);
                              }
                            }}
                            name="price"
                          />
                        </div>
                        <div className="col-md-4 mb-3">
                          <label className="form-label fw-bold">Currency</label>
                          <select
                            className="form-select"
                            value={category === 'vehicles' ? vehicleForm.currency : productForm.currency}
                            onChange={(e) => {
                              if (category === 'vehicles') {
                                handleVehicleChange(e);
                              } else {
                                handleProductChange(e);
                              }
                            }}
                            name="currency"
                          >
                            <option value="TZS">TZS (TSh)</option>
                            <option value="USD">USD ($)</option>
                            <option value="KES">KES (KSh)</option>
                          </select>
                        </div>
                        <div className="col-md-4 mb-3">
                          <label className="form-label fw-bold">Stock Quantity *</label>
                          <input
                            type="number"
                            className="form-control"
                            placeholder="Enter quantity"
                            required
                            value={category === 'vehicles' ? vehicleForm.stock : productForm.stock}
                            onChange={(e) => {
                              if (category === 'vehicles') {
                                handleVehicleChange(e);
                              } else {
                                handleProductChange(e);
                              }
                            }}
                            name="stock"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  {/* Vehicle Specific Fields */}
                  {category === 'vehicles' && (
                    <div className="row mb-4">
                      <div className="col-md-3 mb-3">
                        <label className="form-label fw-bold">Vehicle Type *</label>
                        <select
                          className="form-select"
                          value={vehicleForm.vehicleType}
                          onChange={handleVehicleChange}
                          name="vehicleType"
                          required
                        >
                          <option value="suv">SUV</option>
                          <option value="sedan">Sedan</option>
                          <option value="hatchback">Hatchback</option>
                          <option value="truck">Truck</option>
                          <option value="motorcycle">Motorcycle</option>
                        </select>
                      </div>
                      <div className="col-md-3 mb-3">
                        <label className="form-label fw-bold">Year *</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="e.g., 2023"
                          value={vehicleForm.year}
                          onChange={handleVehicleChange}
                          name="year"
                          required
                        />
                      </div>
                      <div className="col-md-3 mb-3">
                        <label className="form-label fw-bold">Mileage *</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g., 0 km"
                          value={vehicleForm.mileage}
                          onChange={handleVehicleChange}
                          name="mileage"
                          required
                        />
                      </div>
                      <div className="col-md-3 mb-3">
                        <label className="form-label fw-bold">Fuel Type *</label>
                        <select
                          className="form-select"
                          value={vehicleForm.fuelType}
                          onChange={handleVehicleChange}
                          name="fuelType"
                          required
                        >
                          <option value="petrol">Petrol</option>
                          <option value="diesel">Diesel</option>
                          <option value="electric">Electric</option>
                          <option value="hybrid">Hybrid</option>
                        </select>
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label fw-bold">Transmission *</label>
                        <select
                          className="form-select"
                          value={vehicleForm.transmission}
                          onChange={handleVehicleChange}
                          name="transmission"
                          required
                        >
                          <option value="automatic">Automatic</option>
                          <option value="manual">Manual</option>
                        </select>
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label fw-bold">Color *</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g., White"
                          value={vehicleForm.color}
                          onChange={handleVehicleChange}
                          name="color"
                          required
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label fw-bold">Condition *</label>
                        <select
                          className="form-select"
                          value={vehicleForm.condition}
                          onChange={handleVehicleChange}
                          name="condition"
                          required
                        >
                          <option value="new">New</option>
                          <option value="used">Used</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Condition Field for Products */}
                  {currentCategory.type === 'product' && category !== 'vehicles' && (
                    <div className="row mb-4">
                      <div className="col-md-6">
                        <label className="form-label fw-bold">Condition *</label>
                        <select
                          className="form-select"
                          value={productForm.condition}
                          onChange={handleProductChange}
                          name="condition"
                          required
                        >
                          <option value="new">New</option>
                          <option value="used">Used</option>
                          <option value="refurbished">Refurbished</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Service Specific Fields */}
                  {currentCategory.type === 'service' && (
                    <div className="row mb-4">
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Capacity *</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g., 100 guests, 50 rooms"
                          value={serviceForm.capacity}
                          onChange={handleServiceChange}
                          name="capacity"
                          required
                        />
                      </div>
                      <div className="col-md-3 mb-3">
                        <label className="form-label fw-bold">Check-in Time *</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g., 14:00"
                          value={serviceForm.checkInTime}
                          onChange={handleServiceChange}
                          name="checkInTime"
                          required
                        />
                      </div>
                      <div className="col-md-3 mb-3">
                        <label className="form-label fw-bold">Check-out Time *</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g., 12:00"
                          value={serviceForm.checkOutTime}
                          onChange={handleServiceChange}
                          name="checkOutTime"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  <div className="mb-4">
                    <label className="form-label fw-bold">Description *</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      placeholder={`Describe this ${currentCategory.name.toLowerCase()} in detail`}
                      required
                      value={currentCategory.type === 'service' ? serviceForm.description : (category === 'vehicles' ? vehicleForm.description : productForm.description)}
                      onChange={(e) => {
                        if (currentCategory.type === 'service') {
                          handleServiceChange(e);
                        } else if (category === 'vehicles') {
                          handleVehicleChange(e);
                        } else {
                          handleProductChange(e);
                        }
                      }}
                      name="description"
                    ></textarea>
                  </div>

                  {/* Image Upload Section - CRITICAL NEW FEATURE */}
                  <div className="mb-4">
                    <label className="form-label fw-bold">Upload Images *</label>
                    <small className="text-muted d-block mb-2">
                      Upload product/service images (JPEG, PNG, WebP, max 5MB per image)
                    </small>
                    
                    {/* File Upload Input */}
                    <div className="mb-3">
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="form-control"
                        accept=".jpg,.jpeg,.png,.webp"
                        multiple
                        onChange={(e) => handleImageUpload(e, currentCategory.type === 'service' ? 'service' : (category === 'vehicles' ? 'vehicle' : 'product'))}
                        style={{ display: 'none' }}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-primary w-100 py-3"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <i className="fas fa-cloud-upload-alt me-2"></i>
                        Click to Upload Images
                      </button>
                      <div className="text-center mt-2">
                        <small className="text-muted">
                          Supported formats: JPG, JPEG, PNG, WebP | Max size: 5MB per image
                        </small>
                      </div>
                    </div>

                    {/* Image Preview Gallery */}
                    {currentFormImages.length > 0 && (
                      <div className="mt-3">
                        <h6 className="fw-bold mb-3">Uploaded Images ({currentFormImages.length})</h6>
                        <div className="row g-3">
                          {currentFormImages.map((image, index) => (
                            <div key={index} className="col-6 col-md-4 col-lg-3">
                              <div className="card position-relative">
                                <img
                                  src={image}
                                  alt={`Preview ${index + 1}`}
                                  className="card-img-top"
                                  style={{ height: '120px', objectFit: 'cover' }}
                                />
                                <button
                                  type="button"
                                  className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1"
                                  onClick={() => removeImage(currentCategory.type === 'service' ? 'service' : (category === 'vehicles' ? 'vehicle' : 'product'), index)}
                                  style={{ width: '30px', height: '30px', borderRadius: '50%' }}
                                >
                                  <i className="fas fa-times"></i>
                                </button>
                                <div className="card-body p-2 text-center">
                                  <small className="text-muted">Image {index + 1}</small>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Specifications (Electronics & Vehicles) */}
                  {(category === 'electronics' || category === 'vehicles') && (
                    <div className="mb-4">
                      <label className="form-label fw-bold">
                        Technical Specifications *
                      </label>
                      <small className="text-muted d-block mb-2">
                        Add specifications in format: "Key: Value" (e.g., "Processor: Intel Core i7")
                      </small>
                      {(category === 'electronics' ? productForm.specifications : vehicleForm.specifications).map((spec, index) => (
                        <div key={index} className="input-group mb-2">
                          <input
                            type="text"
                            className="form-control"
                            placeholder={`e.g., ${category === 'electronics' ? 'Processor: Intel Core i7' : 'Engine: 4.6L V8'}`}
                            value={spec}
                            onChange={(e) => handleSpecificationChange(category === 'electronics' ? 'product' : 'vehicle', index, e.target.value)}
                            required
                          />
                          <button
                            type="button"
                            className="btn btn-outline-danger"
                            onClick={() => removeSpecification(category === 'electronics' ? 'product' : 'vehicle', index)}
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => addSpecification(category === 'electronics' ? 'product' : 'vehicle')}
                      >
                        <i className="fas fa-plus me-1"></i>
                        Add Specification
                      </button>
                    </div>
                  )}

                  {/* Features */}
                  <div className="mb-4">
                    <label className="form-label fw-bold">
                      {currentCategory.type === 'service' ? 'Amenities & Features *' : 'Key Features *'}
                    </label>
                    
                    {currentCategory.type === 'service' ? (
                      <>
                        {/* Amenities for Services */}
                        <h6 className="fw-bold mt-3 mb-2">Amenities</h6>
                        {serviceForm.amenities.map((amenity, index) => (
                          <div key={index} className="input-group mb-2">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="e.g., Swimming Pool, Free WiFi"
                              value={amenity}
                              onChange={(e) => handleAmenityChange(index, e.target.value)}
                              required
                            />
                            <button
                              type="button"
                              className="btn btn-outline-danger"
                              onClick={() => removeAmenity(index)}
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm me-2 mb-3"
                          onClick={addAmenity}
                        >
                          <i className="fas fa-plus me-1"></i>
                          Add Amenity
                        </button>

                        {/* Services for Services */}
                        <h6 className="fw-bold mt-3 mb-2">Services</h6>
                        {serviceForm.services.map((service, index) => (
                          <div key={index} className="input-group mb-2">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="e.g., Airport Transfer, Room Service"
                              value={service}
                              onChange={(e) => handleServiceItemChange(index, e.target.value)}
                              required
                            />
                            <button
                              type="button"
                              className="btn btn-outline-danger"
                              onClick={() => removeServiceItem(index)}
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm mb-3"
                          onClick={addServiceItem}
                        >
                          <i className="fas fa-plus me-1"></i>
                          Add Service
                        </button>

                        {/* Features for Services */}
                        <h6 className="fw-bold mt-3 mb-2">Features</h6>
                        {serviceForm.features.map((feature, index) => (
                          <div key={index} className="input-group mb-2">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="e.g., Ocean View, Private Balcony"
                              value={feature}
                              onChange={(e) => handleFeatureChange('service', index, e.target.value)}
                              required
                            />
                            <button
                              type="button"
                              className="btn btn-outline-danger"
                              onClick={() => removeFeature('service', index)}
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => addFeature('service')}
                        >
                          <i className="fas fa-plus me-1"></i>
                          Add Feature
                        </button>
                      </>
                    ) : (
                      /* Features for Products and Vehicles */
                      <>
                        {(category === 'vehicles' ? vehicleForm.features : productForm.features).map((feature, index) => (
                          <div key={index} className="input-group mb-2">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="e.g., Backlit Keyboard, Sunroof"
                              value={feature}
                              onChange={(e) => handleFeatureChange(category === 'vehicles' ? 'vehicle' : 'product', index, e.target.value)}
                              required
                            />
                            <button
                              type="button"
                              className="btn btn-outline-danger"
                              onClick={() => removeFeature(category === 'vehicles' ? 'vehicle' : 'product', index)}
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => addFeature(category === 'vehicles' ? 'vehicle' : 'product')}
                        >
                          <i className="fas fa-plus me-1"></i>
                          Add Feature
                        </button>
                      </>
                    )}
                  </div>

                  {/* Service Policies */}
                  {currentCategory.type === 'service' && (
                    <div className="mb-4">
                      <label className="form-label fw-bold">Policies & Information *</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        placeholder="Enter policies, cancellation terms, etc."
                        value={serviceForm.policies}
                        onChange={handleServiceChange}
                        name="policies"
                        required
                      ></textarea>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="d-grid">
                    <button
                      type="submit"
                      className={`btn btn-${currentCategory.color} btn-lg py-3 fw-bold`}
                      disabled={loading || currentFormImages.length === 0}
                    >
                      {loading ? (
                        <>
                          <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                          Listing...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-plus me-2"></i>
                          List {currentCategory.name} ({currentFormImages.length} {currentFormImages.length === 1 ? 'image' : 'images'})
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Help Text */}
            <div className="text-center mt-4">
              <p className="text-light small">
                <i className="fas fa-info-circle me-1"></i>
                Your listing will be visible to customers immediately after submission and will appear in search results.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BusinessListingPage;