// src/Pages/FilmIndustries.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function FilmIndustries() {
  const [isNavbarScrolled, setIsNavbarScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Handle navbar scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsNavbarScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Initialize dark mode from localStorage or system preference
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedDarkMode !== null) {
      setDarkMode(savedDarkMode === 'true');
    } else {
      setDarkMode(systemPrefersDark);
    }
  }, []);

  // Apply dark mode class to body when darkMode changes
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // Toggle dark mode function
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const industries = [
    { 
      country: "United States", 
      flag: "https://flagcdn.com/us.svg", 
      percentage: 86,
      description: "Hollywood - Global film industry leader with cutting-edge CGI and innovation",
      color: "#dc3545", // Vibrant red
      industryName: "Hollywood"
    },
    { 
      country: "China", 
      flag: "https://flagcdn.com/cn.svg", 
      percentage: 68,
      description: "Rapidly growing film industry with massive production scale and investment",
      color: "#ffc107", // Yellow
      industryName: "Chinese Cinema"
    },
    { 
      country: "France", 
      flag: "https://flagcdn.com/fr.svg", 
      percentage: 62,
      description: "Renowned for artistic films, auteur cinema, and cultural storytelling",
      color: "#17a2b8", // Teal
      industryName: "French Cinema"
    },
    { 
      country: "United Kingdom", 
      flag: "https://flagcdn.com/gb.svg", 
      percentage: 58,
      description: "Known for innovative modern films and compelling storytelling heritage",
      color: "#6f42c1", // Purple
      industryName: "British Cinema"
    },
    { 
      country: "Japan", 
      flag: "https://flagcdn.com/jp.svg", 
      percentage: 54,
      description: "Anime and Japanese films lead in creativity and cultural preservation",
      color: "#e83e8c", // Pink
      industryName: "Japanese Cinema"
    },
    { 
      country: "India", 
      flag: "https://flagcdn.com/in.svg", 
      percentage: 52,
      description: "Bollywood - Largest film producer worldwide, famous for music and drama",
      color: "#28a745", // Green
      industryName: "Bollywood"
    },
    { 
      country: "South Korea", 
      flag: "https://flagcdn.com/kr.svg", 
      percentage: 48,
      description: "K-wave gained massive international popularity in films and TV series",
      color: "#20c997", // Cyan
      industryName: "Korean Cinema"
    },
    { 
      country: "Italy", 
      flag: "https://flagcdn.com/it.svg", 
      percentage: 42,
      description: "Historic film industry known for neorealism and cinematic artistry",
      color: "#fd7e14", // Orange
      industryName: "Italian Cinema"
    },
    { 
      country: "Germany", 
      flag: "https://flagcdn.com/de.svg", 
      percentage: 38,
      description: "Influential cinema with strong storytelling and technical excellence",
      color: "#6c757d", // Gray
      industryName: "German Cinema"
    },
    { 
      country: "Spain", 
      flag: "https://flagcdn.com/es.svg", 
      percentage: 36,
      description: "Vibrant film industry known for passionate storytelling and unique style",
      color: "#6610f2", // Indigo
      industryName: "Spanish Cinema"
    }
  ];

  return (
    <div className={`film-industries-page min-vh-100 ${darkMode ? 'dark-mode' : ''}`} style={{ background: darkMode ? "linear-gradient(135deg, #0f0c29, #302b63, #24243e)" : "linear-gradient(135deg, #E5E4E2 0%, #C0C0C0 30%, #E5E4E2 100%)" }}>
      {/* Enhanced Navbar */}
      <nav className={`navbar navbar-expand-lg px-3 fixed-top shadow transition-all ${isNavbarScrolled ? 'scrolled' : ''}`} style={{ 
        background: isNavbarScrolled 
          ? (darkMode ? 'rgba(15, 25, 35, 0.95)' : 'rgba(255, 255, 255, 0.95)') 
          : (darkMode ? 'rgba(26, 41, 48, 0.9)' : 'rgba(229, 228, 226, 0.9)'),
        transition: 'all 0.3s ease',
        paddingTop: '1rem',
        paddingBottom: '1rem',
        zIndex: 1000,
        borderBottom: isNavbarScrolled ? (darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)') : 'none'
      }}>
        <div className="container-fluid">
          <div className="d-flex flex-column w-100">
            {/* Top row - Logo and user controls */}
            <div className="d-flex justify-content-between align-items-center w-100 mb-2">
              {/* MovieBox logo */}
              <Link className="navbar-brand fw-bold fs-2 mb-0" to="/dashboard" style={{ color: darkMode ? '#F5F5F5' : '#4A4A4A' }}>
                <i className="fas fa-film me-2" style={{ color: '#D4AF37' }}></i>MovieBox
              </Link>

              {/* User controls */}
              <div className="d-flex align-items-center">
                {/* Dark mode toggle button */}
                <button 
                  className="btn me-3 rounded-circle p-2 d-flex align-items-center justify-content-center"
                  onClick={toggleDarkMode}
                  style={{ 
                    background: darkMode ? "rgba(60, 80, 90, 0.5)" : "rgba(240, 240, 240, 0.5)",
                    width: "40px", 
                    height: "40px",
                    border: darkMode ? "1px solid rgba(200,200,200,0.2)" : "1px solid rgba(127,127,127,0.2)"
                  }}
                  aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                >
                  <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'}`} style={{ color: darkMode ? '#FFD700' : '#4A4A4A' }}></i>
                </button>

                <Link to="/" className="btn btn-sm text-white" style={{ background: "linear-gradient(135deg, #A8A8A8 0%, #7F7F7F 100%)" }}>
                  <i className="fas fa-sign-out-alt me-1" style={{ color: '#FFD700' }}></i> Logout
                </Link>
              </div>
            </div>

            {/* Bottom row - Navigation menu */}
            <div className="d-flex justify-content-center w-100">
              <button 
                className="navbar-toggler d-lg-none" 
                type="button" 
                data-bs-toggle="collapse" 
                data-bs-target="#navbarContent"
                style={{ borderColor: darkMode ? "rgba(200, 200, 200, 0.5)" : "rgba(127, 127, 127, 0.5)" }}
              >
                <span className="navbar-toggler-icon" style={{ filter: darkMode ? "invert(1)" : "invert(0)" }}></span>
              </button>

              <div className="collapse navbar-collapse justify-content-center" id="navbarContent">
                <ul className="navbar-nav mb-2 mb-lg-0">
                  <li className="nav-item">
                    <Link className="nav-link mx-2" to="/dashboard" style={{ color: darkMode ? '#F5F5F5' : '#4A4A4A' }}>
                      <i className="fas fa-home me-1" style={{ color: '#D4AF37' }}></i>Home
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link mx-2" to="/movies" style={{ color: darkMode ? '#F5F5F5' : '#4A4A4A' }}>
                      <i className="fas fa-list me-1" style={{ color: '#FF6B6B' }}></i>Movies
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link mx-2" to="/my-list" style={{ color: darkMode ? '#F5F5F5' : '#4A4A4A' }}>
                      <i className="fas fa-bookmark me-1" style={{ color: '#4ECDC4' }}></i>My List
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link mx-2" to="/profile" style={{ color: darkMode ? '#F5F5F5' : '#4A4A4A' }}>
                      <i className="fas fa-user me-1" style={{ color: '#45B7D1' }}></i>Profile
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link mx-2" to="/settings" style={{ color: darkMode ? '#F5F5F5' : '#4A4A4A' }}>
                      <i className="fas fa-cog me-1" style={{ color: '#F9A826' }}></i>Settings
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link active mx-2" to="/industries" style={{ color: darkMode ? '#F5F5F5' : '#4A4A4A' }}>
                      <i className="fas fa-globe me-1" style={{ color: '#6C5CE7' }}></i>Film Industries
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Add padding to account for fixed navbar */}
      <div style={{ paddingTop: '120px' }}></div>

      {/* Main Content */}
      <div className="container-fluid py-4">
        <div className="row">
          <div className="col-12">
            {/* Header Section */}
            <div className="text-center mb-5 px-3">
              <h1 className={`display-4 fw-bold mb-3 ${darkMode ? 'text-white' : 'text-dark'}`}>
                <i className="fas fa-globe me-3" style={{ color: '#D4AF37' }}></i>
                Global Film Industries Ranking
              </h1>
              <p className={`lead mb-4 ${darkMode ? 'text-light' : 'text-dark'}`}>
                Top Film Industries Worldwide Based on Quality and Influence
              </p>
              <div className="d-flex justify-content-center">
                <div className={`rounded-pill px-4 py-2 ${darkMode ? 'bg-dark bg-opacity-50' : 'bg-light bg-opacity-50'}`}>
                  <span className={darkMode ? 'text-warning' : 'text-dark'}>
                    <i className="fas fa-info-circle me-2"></i>
                    Quality scores based on production value, innovation, and global impact
                  </span>
                </div>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="row mb-5">
              <div className="col-md-3 col-6 mb-4">
                <div className={`card stats-card ${darkMode ? 'bg-dark border-primary' : 'bg-light border-primary'}`}>
                  <div className="card-body text-center py-4">
                    <i className="fas fa-film fa-2x mb-3" style={{ color: '#D4AF37' }}></i>
                    <h3 className={darkMode ? 'text-white' : 'text-dark'}>10</h3>
                    <p className={darkMode ? 'text-muted' : 'text-dark'}>Leading Countries</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3 col-6 mb-4">
                <div className={`card stats-card ${darkMode ? 'bg-dark border-success' : 'bg-light border-success'}`}>
                  <div className="card-body text-center py-4">
                    <i className="fas fa-trophy fa-2x mb-3" style={{ color: '#28a745' }}></i>
                    <h3 className={darkMode ? 'text-white' : 'text-dark'}>86%</h3>
                    <p className={darkMode ? 'text-muted' : 'text-dark'}>Top Quality Score</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3 col-6 mb-4">
                <div className={`card stats-card ${darkMode ? 'bg-dark border-warning' : 'bg-light border-warning'}`}>
                  <div className="card-body text-center py-4">
                    <i className="fas fa-users fa-2x mb-3" style={{ color: '#ffc107' }}></i>
                    <h3 className={darkMode ? 'text-white' : 'text-dark'}>3B+</h3>
                    <p className={darkMode ? 'text-muted' : 'text-dark'}>Annual Viewers</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3 col-6 mb-4">
                <div className={`card stats-card ${darkMode ? 'bg-dark border-info' : 'bg-light border-info'}`}>
                  <div className="card-body text-center py-4">
                    <i className="fas fa-dollar-sign fa-2x mb-3" style={{ color: '#17a2b8' }}></i>
                    <h3 className={darkMode ? 'text-white' : 'text-dark'}>150B+</h3>
                    <p className={darkMode ? 'text-muted' : 'text-dark'}>Annual Revenue</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Industries Ranking */}
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="section-header d-flex justify-content-between align-items-center mb-4">
                  <h2 className={darkMode ? "text-white" : "text-dark"}>
                    <i className="fas fa-ranking-star me-2" style={{ color: '#D4AF37' }}></i>
                    Film Industry Quality Ranking
                  </h2>
                  <span className="badge" style={{ background: "linear-gradient(135deg, #A8A8A8 0%, #7F7F7F 100%)", color: 'white' }}>2024 Quality Ratings</span>
                </div>

                {industries.map((industry, index) => (
                  <div key={index} className={`card industry-card mb-4 border-0 ${darkMode ? 'dark-card' : 'light-card'}`}>
                    <div className="card-body">
                      <div className="row align-items-center">
                        <div className="col-md-1 col-2">
                          <div className="position-relative">
                            <div className="rank-badge" style={{ 
                              background: index === 0 
                                ? "linear-gradient(135deg, #FFD700 0%, #D4AF37 100%)" 
                                : index === 1
                                ? "linear-gradient(135deg, #C0C0C0 0%, #A8A8A8 100%)"
                                : index === 2
                                ? "linear-gradient(135deg, #CD7F32 0%, #A55A2B 100%)"
                                : "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)"
                            }}>
                              {index + 1}
                            </div>
                          </div>
                        </div>
                        <div className="col-md-1 col-3">
                          <img
                            src={industry.flag}
                            alt={industry.country}
                            className="flag-img rounded shadow"
                            style={{ width: "50px", height: "35px", objectFit: "cover" }}
                          />
                        </div>
                        <div className="col-md-4 col-7">
                          <h5 className={darkMode ? "text-white" : "text-dark"}>{industry.country}</h5>
                          <p className={`small mb-1 fw-bold ${darkMode ? 'text-light' : 'text-dark'}`}>
                            {industry.industryName}
                          </p>
                          <p className={`small mb-0 ${darkMode ? 'text-muted' : 'text-secondary'}`}>{industry.description}</p>
                        </div>
                        <div className="col-md-6 col-12 mt-3 mt-md-0">
                          <div className="d-flex align-items-center">
                            <div className="flex-grow-1 me-3">
                              <div className="progress-container">
                                <div className="progress" style={{ height: "20px", borderRadius: "10px", overflow: 'visible' }}>
                                  <div 
                                    className="progress-bar" 
                                    role="progressbar" 
                                    style={{ 
                                      width: `${industry.percentage}%`,
                                      background: `linear-gradient(135deg, ${industry.color} 0%, ${industry.color}99 100%)`,
                                      borderRadius: "10px",
                                      boxShadow: `0 0 15px ${industry.color}80`,
                                      position: 'relative',
                                      overflow: 'visible'
                                    }}
                                    aria-valuenow={industry.percentage} 
                                    aria-valuemin="0" 
                                    aria-valuemax="100"
                                  >
                                    <div className="progress-indicator" style={{ 
                                      position: 'absolute', 
                                      right: '0', 
                                      top: '-25px',
                                      background: industry.color,
                                      color: 'white',
                                      padding: '2px 6px',
                                      borderRadius: '4px',
                                      fontSize: '12px',
                                      fontWeight: 'bold',
                                      boxShadow: `0 2px 5px ${industry.color}80`
                                    }}>
                                      {industry.percentage}%
                                    </div>
                                  </div>
                                </div>
                                <div className="progress-labels d-flex justify-content-between mt-1">
                                  <small className={darkMode ? "text-muted" : "text-secondary"}>0%</small>
                                  <small className={darkMode ? "text-muted" : "text-secondary"}>50%</small>
                                  <small className={darkMode ? "text-muted" : "text-secondary"}>100%</small>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Info */}
            <div className="row mt-5">
              <div className="col-lg-8 mx-auto">
                <div className={`card ${darkMode ? 'bg-dark border-warning' : 'bg-light border-warning'}`}>
                  <div className="card-body text-center py-4">
                    <h4 className={darkMode ? "text-white" : "text-dark"}>
                      <i className="fas fa-lightbulb me-2" style={{ color: '#D4AF37' }}></i>
                      How is Film Quality Measured?
                    </h4>
                    <p className={darkMode ? "text-light" : "text-dark"}>
                      Quality scores are based on comprehensive analysis of production value, 
                      technical innovation, storytelling excellence, cultural impact, and 
                      international recognition. Hollywood leads with technical innovation and 
                      global distribution, while other industries excel in specific genres and 
                      cultural storytelling that resonates worldwide.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          .film-industries-page {
            background-attachment: fixed;
            transition: background 0.3s ease;
          }
          
          .industry-card {
            backdrop-filter: blur(10px);
            border-radius: 15px;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          
          .dark-card {
            background: rgba(0, 0, 0, 0.5) !important;
          }
          
          .light-card {
            background: rgba(255, 255, 255, 0.7) !important;
          }
          
          .industry-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          }
          
          .stats-card {
            border-radius: 15px;
            transition: transform 0.3s ease;
          }
          
          .stats-card:hover {
            transform: translateY(-5px);
          }
          
          .progress {
            border-radius: 10px;
            overflow: visible;
            background: ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
          }
          
          .progress-bar {
            position: relative;
            overflow: visible;
            transition: width 1.5s ease-in-out;
          }
          
          .rank-badge {
            width: 35px;
            height: 35px;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 16px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
          }
          
          .flag-img {
            border: 2px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
            transition: transform 0.3s ease;
          }
          
          .industry-card:hover .flag-img {
            transform: scale(1.1);
          }
          
          .section-header {
            padding-bottom: 10px;
            border-bottom: 2px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
          }
          
          .progress-container {
            position: relative;
          }
          
          .progress-indicator {
            animation: pulse 2s infinite;
          }
          
          @keyframes pulse {
            0% { transform: translateY(0); }
            50% { transform: translateY(-3px); }
            100% { transform: translateY(0); }
          }
          
          @media (max-width: 768px) {
            .percentage-display {
              min-width: 40px;
              text-align: center;
            }
          }
        `}
      </style>
    </div>
  );
}

export default FilmIndustries;