// src/BusinessAuth.jsx
import React, { useState } from "react";
import { useNavigate, Link } from 'react-router-dom';

function BusinessAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "",
    email: "",
    phone: "",
    address: "",
    country: "Tanzania",
    region: "Dar es Salaam",
    district: "",
    password: "123456", // Default password for testing
    confirmPassword: "123456",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Demo businesses for quick testing
  const demoBusinesses = [
    {
      id: "1",
      businessName: "TechHub Tanzania",
      email: "tech@demo.com",
      password: "123456",
      businessType: "Electronics",
      phone: "712345678",
      address: "Samora Avenue, Dar es Salaam",
      region: "Dar es Salaam",
      country: "Tanzania",
      status: "verified"
    },
    {
      id: "2", 
      businessName: "MobileWorld",
      email: "mobile@demo.com",
      password: "123456",
      businessType: "Electronics",
      phone: "712345679",
      address: "Mlimani City, Dar es Salaam",
      region: "Dar es Salaam",
      country: "Tanzania",
      status: "verified"
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simulate API call
    setTimeout(() => {
      if (isLogin) {
        // Login logic - Check against demo businesses
        const business = demoBusinesses.find(b => 
          b.email === formData.email && b.password === formData.password
        );
        
        if (business) {
          localStorage.setItem('businessAuthenticated', 'true');
          localStorage.setItem('currentBusiness', JSON.stringify(business));
          navigate('/business-dashboard');
        } else {
          // Also check localStorage for registered businesses
          const storedBusinesses = JSON.parse(localStorage.getItem('verifiedBusinesses')) || [];
          const storedBusiness = storedBusinesses.find(b => 
            b.email === formData.email && b.password === formData.password
          );
          
          if (storedBusiness) {
            localStorage.setItem('businessAuthenticated', 'true');
            localStorage.setItem('currentBusiness', JSON.stringify(storedBusiness));
            navigate('/business-dashboard');
          } else {
            setError("Invalid credentials. Try: tech@demo.com / 123456");
          }
        }
      } else {
        // Registration logic - Auto-verify for testing
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match");
          setLoading(false);
          return;
        }

        if (formData.password.length < 6) {
          setError("Password must be at least 6 characters");
          setLoading(false);
          return;
        }

        const newBusiness = {
          id: Date.now().toString(),
          businessName: formData.businessName,
          businessType: formData.businessType,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          country: formData.country,
          region: formData.region,
          district: formData.district,
          password: formData.password,
          status: "verified", // Auto-verify for testing
          registrationDate: new Date().toISOString().split('T')[0],
        };

        const existingBusinesses = JSON.parse(localStorage.getItem('verifiedBusinesses')) || [];
        
        if (existingBusinesses.some(b => b.email === formData.email)) {
          setError("Business with this email already exists");
          setLoading(false);
          return;
        }

        existingBusinesses.push(newBusiness);
        localStorage.setItem('verifiedBusinesses', JSON.stringify(existingBusinesses));
        
        // Auto-login after registration
        localStorage.setItem('businessAuthenticated', 'true');
        localStorage.setItem('currentBusiness', JSON.stringify(newBusiness));
        
        alert("Business registered successfully! Redirecting to dashboard...");
        navigate('/business-dashboard');
      }
      setLoading(false);
    }, 1000);
  };

  const tanzaniaRegions = [
    "Arusha", "Dar es Salaam", "Dodoma", "Geita", "Iringa", "Kagera", "Katavi", "Kigoma",
    "Kilimanjaro", "Lindi", "Manyara", "Mara", "Mbeya", "Morogoro", "Mtwara", "Mwanza",
    "Njombe", "Pemba North", "Pemba South", "Pwani", "Rukwa", "Ruvuma", "Shinyanga",
    "Simiyu", "Singida", "Songwe", "Tabora", "Tanga", "Zanzibar Central/South",
    "Zanzibar North", "Zanzibar Urban/West"
  ];

  const businessTypes = [
    "Retail Store", "Wholesaler", "Manufacturer", "Distributor", "Service Provider",
    "E-commerce", "Supermarket", "Specialty Store", "Other"
  ];

  // Quick login for testing
  const quickLogin = (email, password) => {
    setFormData(prev => ({ ...prev, email, password }));
    setTimeout(() => {
      const business = demoBusinesses.find(b => b.email === email && b.password === password);
      if (business) {
        localStorage.setItem('businessAuthenticated', 'true');
        localStorage.setItem('currentBusiness', JSON.stringify(business));
        navigate('/business-dashboard');
      }
    }, 500);
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100 py-4"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-10 col-lg-8">
            <div className="card shadow border-0 rounded-4 overflow-hidden">
              <div className="card-header bg-primary text-white text-center py-4">
                <div className="d-flex justify-content-center align-items-center mb-3">
                  <div className="bg-white bg-opacity-25 rounded-circle d-flex align-items-center justify-content-center me-3" 
                       style={{ width: "60px", height: "60px" }}>
                    <i className="fas fa-store fs-3"></i>
                  </div>
                  <div>
                    <h3 className="mb-0">Business Portal</h3>
                    <p className="mb-0 mt-2 opacity-75">
                      {isLogin ? "Login to your business account" : "Register your business"}
                    </p>
                  </div>
                </div>

                {/* Quick Test Buttons */}
                {isLogin && (
                  <div className="mt-3">
                    <small className="d-block mb-2">Quick Test Accounts:</small>
                    <div className="d-flex gap-2 justify-content-center">
                      <button 
                        className="btn btn-sm btn-outline-light"
                        onClick={() => quickLogin("tech@demo.com", "123456")}
                      >
                        TechHub
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-light" 
                        onClick={() => quickLogin("mobile@demo.com", "123456")}
                      >
                        MobileWorld
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="card-body p-4 p-md-5">
                {error && (
                  <div className="alert alert-danger d-flex align-items-center" role="alert">
                    <i className="fas fa-exclamation-circle me-2"></i>
                    {error}
                  </div>
                )}

                {/* Demo Info */}
                <div className="alert alert-info d-flex align-items-center">
                  <i className="fas fa-info-circle me-2"></i>
                  <div>
                    <strong>Demo Mode:</strong> No verification required. Use quick test accounts or register new business.
                    <br/>
                    <small>Default password: <code>123456</code></small>
                  </div>
                </div>

                {/* Toggle between Login and Register */}
                <div className="text-center mb-4">
                  <div className="btn-group" role="group">
                    <button
                      type="button"
                      className={`btn ${isLogin ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => setIsLogin(true)}
                    >
                      <i className="fas fa-sign-in-alt me-2"></i>Business Login
                    </button>
                    <button
                      type="button"
                      className={`btn ${!isLogin ? 'btn-success' : 'btn-outline-success'}`}
                      onClick={() => setIsLogin(false)}
                    >
                      <i className="fas fa-user-plus me-2"></i>Business Register
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSubmit}>
                  {isLogin ? (
                    /* Login Form */
                    <div className="row">
                      <div className="col-12 mb-3">
                        <label htmlFor="email" className="form-label">
                          <i className="fas fa-envelope me-2"></i>Business Email
                        </label>
                        <input
                          type="email"
                          className="form-control rounded-3"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          placeholder="tech@demo.com"
                        />
                      </div>
                      
                      <div className="col-12 mb-4">
                        <label htmlFor="password" className="form-label">
                          <i className="fas fa-lock me-2"></i>Password
                        </label>
                        <input
                          type="password"
                          className="form-control rounded-3"
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                          placeholder="123456"
                        />
                        <small className="text-muted">Default password: 123456</small>
                      </div>
                    </div>
                  ) : (
                    /* Registration Form */
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="businessName" className="form-label">
                          Business Name *
                        </label>
                        <input
                          type="text"
                          className="form-control rounded-3"
                          id="businessName"
                          name="businessName"
                          value={formData.businessName}
                          onChange={handleInputChange}
                          required
                          placeholder="Your Business Name"
                        />
                      </div>
                      
                      <div className="col-md-6 mb-3">
                        <label htmlFor="businessType" className="form-label">
                          Business Type *
                        </label>
                        <select
                          className="form-select rounded-3"
                          id="businessType"
                          name="businessType"
                          value={formData.businessType}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select Business Type</option>
                          {businessTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>

                      <div className="col-md-6 mb-3">
                        <label htmlFor="email" className="form-label">Email *</label>
                        <input
                          type="email"
                          className="form-control rounded-3"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          placeholder="yourbusiness@email.com"
                        />
                      </div>

                      <div className="col-md-6 mb-3">
                        <label htmlFor="phone" className="form-label">Phone *</label>
                        <div className="input-group">
                          <span className="input-group-text">+255</span>
                          <input
                            type="tel"
                            className="form-control rounded-3"
                            id="phone"
                            name="phone"
                            placeholder="712345678"
                            pattern="[0-9]{9}"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-12 mb-3">
                        <label htmlFor="address" className="form-label">Full Address *</label>
                        <input
                          type="text"
                          className="form-control rounded-3"
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          required
                          placeholder="Street address"
                        />
                      </div>

                      <div className="col-md-4 mb-3">
                        <label htmlFor="country" className="form-label">Country *</label>
                        <input
                          type="text"
                          className="form-control rounded-3"
                          id="country"
                          name="country"
                          value={formData.country}
                          readOnly
                        />
                      </div>

                      <div className="col-md-4 mb-3">
                        <label htmlFor="region" className="form-label">Region *</label>
                        <select
                          className="form-select rounded-3"
                          id="region"
                          name="region"
                          value={formData.region}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select Region</option>
                          {tanzaniaRegions.map(region => (
                            <option key={region} value={region}>{region}</option>
                          ))}
                        </select>
                      </div>

                      <div className="col-md-4 mb-3">
                        <label htmlFor="district" className="form-label">District *</label>
                        <input
                          type="text"
                          className="form-control rounded-3"
                          id="district"
                          name="district"
                          value={formData.district}
                          onChange={handleInputChange}
                          required
                          placeholder="District name"
                        />
                      </div>

                      <div className="col-md-6 mb-3">
                        <label htmlFor="password" className="form-label">Password *</label>
                        <input
                          type="password"
                          className="form-control rounded-3"
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                          placeholder="123456"
                        />
                        <small className="text-muted">Minimum 6 characters</small>
                      </div>

                      <div className="col-md-6 mb-3">
                        <label htmlFor="confirmPassword" className="form-label">Confirm Password *</label>
                        <input
                          type="password"
                          className="form-control rounded-3"
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          required
                          placeholder="123456"
                        />
                      </div>
                    </div>
                  )}

                  <div className="d-grid gap-2 mt-4">
                    <button
                      type="submit"
                      className="btn btn-primary py-2 fw-bold rounded-3"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          {isLogin ? "Signing In..." : "Registering..."}
                        </>
                      ) : (
                        <>
                          <i className={`fas ${isLogin ? 'fa-sign-in-alt' : 'fa-user-plus'} me-2`}></i>
                          {isLogin ? "Business Login" : "Register Business"}
                        </>
                      )}
                    </button>
                  </div>
                </form>

                <div className="text-center mt-4">
                  <Link to="/" className="btn btn-link text-decoration-none me-3">
                    <i className="fas fa-arrow-left me-1"></i> Back to Home
                  </Link>
                  
                  {isLogin && (
                    <button className="btn btn-link text-decoration-none" onClick={() => setIsLogin(false)}>
                      Don't have a business account? Register
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BusinessAuth;