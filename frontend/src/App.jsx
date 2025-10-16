// src/App.jsx - UPDATED WITH CHAT ROUTE
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import './App.css';
import HomePage from './HomePage1.jsx';
import BusinessDashboard from './BusinessDashboard.jsx';
import ProductDetailPage from './ProductDetailPage.jsx';
import SearchResultsPage from './SearchResultsPage.jsx';
import BusinessListingPage from './BusinessListingPage.jsx';
import ChatPage from './ChatPage.jsx'; // ADD CHAT PAGE IMPORT

// Zoom restoration component
function ZoomRestorer() {
  useEffect(() => {
    const restoreZoom = () => {
      // Multiple methods to ensure zoom is 100%
      document.body.style.zoom = "1";
      document.documentElement.style.zoom = "1";
      document.body.style.transform = "scale(1)";
    };
    
    // Restore zoom on mount
    restoreZoom();
    
    // Restore on route changes
    const interval = setInterval(restoreZoom, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  return null;
}

// Protected Route for businesses
const BusinessProtectedRoute = ({ children }) => {
  const isBusinessAuthenticated = localStorage.getItem('businessAuthenticated') === 'true';
  return isBusinessAuthenticated ? children : <Navigate to="/business-auth" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <ZoomRestorer />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:productId" element={<ProductDetailPage />} />
        <Route path="/search-results" element={<SearchResultsPage />} />
        <Route path="/chat" element={<ChatPage />} /> {/* ADD CHAT ROUTE */}
        
        {/* Protected Business Routes */}
        <Route
          path="/business-dashboard"
          element={
            <BusinessProtectedRoute>
              <BusinessDashboard />
            </BusinessProtectedRoute>
          }
        />
        
        {/* ADD BUSINESS LISTING ROUTE - FIX FOR CATEGORY LINKS */}
        <Route
          path="/business-listing/:category"
          element={
            <BusinessProtectedRoute>
              <BusinessListingPage />
            </BusinessProtectedRoute>
          }
        />
        
        {/* Redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Global CDN Links */}
      <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" rel="stylesheet" />
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet" />
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    </BrowserRouter>
  );
}

export default App;