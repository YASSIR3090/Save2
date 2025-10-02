// src/HomePage.jsx
import React from "react";
import { Link } from 'react-router-dom';

function HomePage() {
  const bgImageUrl = "https://images.pexels.com/photos/3184454/pexels-photo-3184454.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
  
  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${bgImageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Add CDN links in the component */}
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet" />
      
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10 text-center">
            {/* Logo and Heading */}
            <div className="mb-5">
              <div className="display-1 fw-bold text-warning mb-3">
                <i className="fas fa-globe-americas me-3"></i>
                ProductFinder
              </div>
              <h1 className="text-white display-4 fw-bold mb-3">Find Products Worldwide</h1>
              <p className="text-white lead mb-5">
                Connect with verified businesses globally. Know exactly where products are available in real-time.
              </p>
            </div>
            
            {/* Login Options */}
            <div className="row justify-content-center">
              <div className="col-lg-5 col-md-6 mb-4">
                <div className="card shadow border-0 rounded-4 h-100 hover-card bg-light">
                  <div className="card-body p-5 text-center">
                    <div className="bg-warning bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-4" 
                         style={{ width: "90px", height: "90px" }}>
                      <i className="fas fa-search text-warning fs-1"></i>
                    </div>
                    <h3 className="card-title mb-3 text-dark">Product Search</h3>
                    <p className="card-text text-muted mb-4">
                      Search for products worldwide. See real-time availability and exact locations on interactive maps.
                    </p>
                    <Link to="/search" className="btn btn-warning btn-lg w-100 py-3 fw-bold text-dark">
                      <i className="fas fa-search me-2"></i> 
                      Search Products
                    </Link>
                  </div>
                </div>
              </div>
              
              <div className="col-lg-5 col-md-6 mb-4">
                <div className="card shadow border-0 rounded-4 h-100 hover-card bg-light">
                  <div className="card-body p-5 text-center">
                    <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-4" 
                         style={{ width: "90px", height: "90px" }}>
                      <i className="fas fa-store text-success fs-1"></i>
                    </div>
                    <h3 className="card-title mb-3 text-dark">Business Portal</h3>
                    <p className="card-text text-muted mb-4">
                      Verified businesses can list products, manage inventory, and reach customers globally.
                    </p>
                    <Link to="/business-auth" className="btn btn-success btn-lg w-100 py-3 fw-bold">
                      <i className="fas fa-sign-in-alt me-2"></i> 
                      Business Login
                    </Link>
                    <div className="mt-3">
                      <small className="text-muted">
                        Business registration requires verification
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Additional Services */}
            <div className="mt-5 pt-4">
              <div className="row justify-content-center">
                <div className="col-md-4 mb-3">
                  <div className="d-flex align-items-center text-white">
                    <div className="bg-white bg-opacity-25 rounded-circle d-flex align-items-center justify-content-center me-3" 
                         style={{ width: "50px", height: "50px" }}>
                      <i className="fas fa-map-marker-alt"></i>
                    </div>
                    <div>
                      <h5 className="mb-0">GPS Locations</h5>
                      <small>Exact product locations</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="d-flex align-items-center text-white">
                    <div className="bg-white bg-opacity-25 rounded-circle d-flex align-items-center justify-content-center me-3" 
                         style={{ width: "50px", height: "50px" }}>
                      <i className="fas fa-check-circle"></i>
                    </div>
                    <div>
                      <h5 className="mb-0">Verified Sellers</h5>
                      <small>Trusted businesses only</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="d-flex align-items-center text-white">
                    <div className="bg-white bg-opacity-25 rounded-circle d-flex align-items-center justify-content-center me-3" 
                         style={{ width: "50px", height: "50px" }}>
                      <i className="fas fa-globe"></i>
                    </div>
                    <div>
                      <h5 className="mb-0">Global Reach</h5>
                      <small>Products worldwide</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Support Information */}
            <div className="mt-5">
              <p className="text-white mb-2">
                Need assistance? Contact our support team
              </p>
              <div className="d-flex justify-content-center gap-3">
                <a href="mailto:support@productfinder.com" className="text-white text-decoration-none">
                  <i className="fas fa-envelope me-1"></i> support@productfinder.com
                </a>
                <span className="text-white">|</span>
                <a href="tel:+255754000000" className="text-white text-decoration-none">
                  <i className="fas fa-phone me-1"></i> +255 754 000 000
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add Bootstrap JS */}
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
      
      <style>
        {`
          .hover-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .hover-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.175) !important;
          }
          .card {
            border: none;
          }
          .btn {
            border-radius: 10px;
          }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          }
        `}
      </style>
    </div>
  );
}

export default HomePage;