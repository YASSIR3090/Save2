// src/App.jsx - ADD THIS ROUTE
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import HomePage from './HomePage1.jsx';
import BusinessAuth from './BusinessAuth.jsx';
import ProductSearch from './ProductSearch.jsx';
import BusinessDashboard from './BusinessDashboard.jsx';
import ProductDetailPage from './ProductDetailPage.jsx';
import SearchResultsPage from './SearchResultsPage.jsx'; // ADD THIS IMPORT

// Protected Route for businesses
const BusinessProtectedRoute = ({ children }) => {
  const isBusinessAuthenticated = localStorage.getItem('businessAuthenticated') === 'true';
  return isBusinessAuthenticated ? children : <Navigate to="/business-auth" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/business-auth" element={<BusinessAuth />} />
        <Route path="/search" element={<ProductSearch />} />
        <Route path="/product/:productId" element={<ProductDetailPage />} />
        <Route path="/search-results" element={<SearchResultsPage />} /> {/* ADD THIS ROUTE */}
        
        {/* Protected Business Routes */}
        <Route
          path="/business-dashboard"
          element={
            <BusinessProtectedRoute>
              <BusinessDashboard />
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