// src/Pages/Dashboard1.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { motion } from "framer-motion";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Dashboard1() {
  const [user, setUser] = useState(null);
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isNavbarScrolled, setIsNavbarScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false); // New state for dark mode
  const recognitionRef = useRef(null);
  const navigate = useNavigate();

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

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        handleVoiceSearch(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      recognitionRef.current.start();
    } else {
      alert("Speech recognition not supported in this browser.");
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      setIsListening(false);
      recognitionRef.current.stop();
    }
  };

  const handleVoiceSearch = (query) => {
    setSearchQuery(query);
    
    if (query.length > 0) {
      const results = movies.filter((movie) =>
        movie.title.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  // Generate 100 mock Hollywood 2025 movies
  const generateMovies = () => {
    const genres = ["Action", "Drama", "Comedy", "Sci-Fi", "Thriller"];
    const moviesArray = [];
    for (let i = 1; i <= 100; i++) {
      moviesArray.push({
        id: i.toString(),
        title: `Movie ${i} (2025)`,
        genre: genres[Math.floor(Math.random() * genres.length)],
        year: 2025,
        rating: (Math.random() * 2 + 3).toFixed(1),
        featured: Math.random() > 0.7,
        thumbnail: `https://picsum.photos/400/600?random=${i}`,
        fileUrl: `https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4`,
      });
    }
    return moviesArray;
  };

  useEffect(() => {
    const userEmail = localStorage.getItem("currentUser");
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const currentUser = users.find((u) => u.email === userEmail);
    if (currentUser) setUser(currentUser);

    const storedMovies =
      JSON.parse(localStorage.getItem("movies")) || generateMovies();
    setMovies(storedMovies);
  }, []);

  const handlePlayMovie = (movie) => {
    navigate(`/movie/${movie.id}`);
  };

  const handleBuyMovie = (movie) => {
    if (!user) return alert("Please log in first!");
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const currentUser = users.find((u) => u.email === user.email);

    if (!currentUser.purchasedMovies) currentUser.purchasedMovies = [];
    if (!currentUser.purchasedMovies.includes(movie.id)) {
      currentUser.purchasedMovies.push(movie.id);
      localStorage.setItem("users", JSON.stringify(users));
      setUser(currentUser);

      alert(`You bought ${movie.title} for $0.20`);

      const link = document.createElement("a");
      link.href = movie.fileUrl;
      link.download = movie.title + ".mp4";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Handle search input changes
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 0) {
      const results = movies.filter((movie) =>
        movie.title.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowSearchResults(false);
  };

  const handleSearchResultClick = (movie) => {
    if (user?.purchasedMovies?.includes(movie.id)) {
      handlePlayMovie(movie);
    } else {
      handleBuyMovie(movie);
    }
    clearSearch();
  };

  const featuredMovies = movies.filter((m) => m.featured);

  // Updated slider settings for center mode with 3 movies
  const sliderSettings = {
    className: "center",
    centerMode: true,
    infinite: true,
    centerPadding: "60px",
    slidesToShow: 3,
    speed: 500,
    dots: true,
    autoplay: true,
    autoplaySpeed: 4000,
    beforeChange: (current, next) => setCurrentSlide(next),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          centerPadding: "40px"
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerMode: true,
          centerPadding: "60px"
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          centerMode: true,
          centerPadding: "30px"
        }
      }
    ]
  };

  return (
    <div className={`dashboard-container min-vh-100 text-white ${darkMode ? 'dark-mode' : ''}`} style={{ background: darkMode ? "linear-gradient(135deg, #1A2930 0%, #0A1A29 30%, #1A2930 100%)" : "linear-gradient(135deg, #E5E4E2 0%, #C0C0C0 30%, #E5E4E2 100%)" }}>
      {/* Navbar with Platinum/Dark theme */}
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
            {/* Top row - Search bar and user controls */}
            <div className="d-flex justify-content-between align-items-center w-100 mb-2">
              {/* MovieBox logo */}
              <Link className="navbar-brand fw-bold fs-2 mb-0" to="/dashboard" style={{ color: darkMode ? '#F5F5F5' : '#4A4A4A' }}>
                <i className="fas fa-film me-2" style={{ color: '#D4AF37' }}></i>MovieBox
              </Link>

              {/* Search Bar - Platinum/Dark style */}
              <div className="d-flex position-relative mx-auto" style={{ width: "50%", maxWidth: "600px" }}>
                <div className="input-group rounded-pill shadow-sm w-100" style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
                  <span className="input-group-text rounded-pill border-0" style={{ background: darkMode ? "rgba(40, 55, 65, 0.8)" : "rgba(255,255,255,0.8)" }}>
                    <i className="fas fa-search" style={{ color: darkMode ? '#A8A8A8' : '#7F7F7F' }}></i>
                  </span>
                  <input
                    type="text"
                    className="form-control border-0 rounded-0"
                    placeholder="Search for movies, series..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    style={{ 
                      background: darkMode ? "rgba(40, 55, 65, 0.8)" : "rgba(255,255,255,0.8)",
                      outline: "none", 
                      boxShadow: "none",
                      color: darkMode ? '#F5F5F5' : '#4A4A4A'
                    }}
                  />
                  <button
                    className={`btn rounded-0 border-0`}
                    onClick={isListening ? stopListening : startListening}
                    type="button"
                    style={{ 
                      background: isListening 
                        ? "#A8A8A8" 
                        : (darkMode ? "rgba(40, 55, 65, 0.8)" : "rgba(255,255,255,0.8)"), 
                      color: isListening ? 'white' : (darkMode ? '#A8A8A8' : '#7F7F7F') 
                    }}
                  >
                    <i className={`fas ${isListening ? 'fa-microphone-slash' : 'fa-microphone'}`}></i>
                  </button>
                  {searchQuery && (
                    <button
                      className="btn rounded-pill rounded-start-0 border-0"
                      onClick={clearSearch}
                      style={{ 
                        background: darkMode ? "rgba(40, 55, 65, 0.8)" : "rgba(255,255,255,0.8)", 
                        color: darkMode ? '#A8A8A8' : '#7F7F7F' 
                      }}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  )}
                </div>

                {/* Search Results Dropdown */}
                {showSearchResults && searchResults.length > 0 && (
                  <div className="search-results-dropdown position-absolute top-100 start-0 end-0 border-0 mt-1 rounded shadow-lg z-3" style={{ 
                    background: darkMode ? "rgba(26, 41, 48, 0.95)" : "rgba(255, 255, 255, 0.95)", 
                    backdropFilter: "blur(10px)", 
                    border: darkMode ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)" 
                  }}>
                    <div className="p-2 border-bottom" style={{ borderColor: darkMode ? "rgba(200, 200, 200, 0.3) !important" : "rgba(127, 127, 127, 0.3) !important" }}>
                      <small className={darkMode ? "text-light" : "text-muted"} style={{ color: darkMode ? '#C8C8C8' : '#7F7F7F' }}>{searchResults.length} results found</small>
                      <button className="btn btn-sm float-end" onClick={clearSearch} style={{ 
                        background: darkMode ? "rgba(60, 80, 90, 0.5)" : "rgba(240, 240, 240, 0.5)", 
                        color: darkMode ? '#C8C8C8' : '#7F7F7F',
                        border: darkMode ? "1px solid rgba(200,200,200,0.2)" : "1px solid rgba(127,127,127,0.2)"
                      }}>
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                    <div className="search-results-list" style={{ maxHeight: "300px", overflowY: "auto" }}>
                      {searchResults.map((movie) => (
                        <div
                          key={movie.id}
                          className="p-2 border-bottom search-result-item"
                          onClick={() => handleSearchResultClick(movie)}
                          style={{ 
                            cursor: "pointer", 
                            borderColor: darkMode ? "rgba(200, 200, 200, 0.3) !important" : "rgba(127, 127, 127, 0.3) !important" 
                          }}
                        >
                          <div className="d-flex align-items-center">
                            <img
                              src={movie.thumbnail}
                              alt={movie.title}
                              className="rounded me-2"
                              style={{ width: "40px", height: "60px", objectFit: "cover" }}
                            />
                            <div className="flex-grow-1">
                              <div className="fw-bold text-truncate" style={{ color: darkMode ? '#F5F5F5' : '#4A4A4A' }}>{movie.title}</div>
                              <div className="d-flex justify-content-between align-items-center">
                                <span className="badge" style={{ 
                                  background: darkMode ? "linear-gradient(135deg, #2D4A5B 0%, #1E3A4C 100%)" : "linear-gradient(135deg, #E5E4E2 0%, #C0C0C0 100%)", 
                                  color: darkMode ? '#E0E0E0' : '#4A4A4A' 
                                }}>{movie.genre}</span>
                                <span className="small" style={{ color: '#D4AF37' }}>
                                  <i className="fas fa-star me-1"></i>
                                  {movie.rating}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

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

                {user && (
                  <span className="me-3 d-none d-md-block" style={{ color: darkMode ? '#F5F5F5' : '#4A4A4A' }}>
                    <i className="fas fa-user-circle me-1" style={{ color: '#D4AF37' }}></i>Hi, {user.fullName || user.firstName}
                  </span>
                )}
                <Link to="/" className="btn btn-sm text-white" style={{ background: "linear-gradient(135deg, #A8A8A8 0%, #7F7F7F 100%)" }}>
                  <i className="fas fa-sign-out-alt me-1" style={{ color: '#FFD700' }}></i> Logout
                </Link>
              </div>
            </div>

            {/* Bottom row - Navigation menu */}
            <div className="d-flex justify-content-center w-100">
             

              <div className="collapse navbar-collapse justify-content-center" id="navbarContent">
                <ul className="navbar-nav mb-2 mb-lg-0">
                  <li className="nav-item">
                    <Link className="nav-link active mx-2" to="/dashboard" style={{ color: darkMode ? '#F5F5F5' : '#4A4A4A' }}>
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
                    <Link className="nav-link mx-2" to="/industries" style={{ color: darkMode ? '#F5F5F5' : '#4A4A4A' }}>
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

      {/* Main content */}
      <main className="container-fluid py-4">
        
         
    

        {/* Featured Movies Carousel */}
        {featuredMovies.length > 0 && (
          <div className="mb-5 featured-carousel-container">
            <h3 className={darkMode ? "text-light mb-4 text-center" : "text-dark mb-4 text-center"}>
              <i className="fas fa-crown me-2" style={{ color: '#D4AF37' }}></i>Featured Movies
            </h3>
            <Slider {...sliderSettings}>
              {featuredMovies.map((movie, index) => {
                // Determine if this is the center slide based on currentSlide
                const isCenterSlide = index === currentSlide;
                
                return (
                  <div key={movie.id} className="px-2 featured-slide">
                    <motion.div 
                      className="h-100"
                      whileHover={{ scale: isCenterSlide ? 1.05 : 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className={`movie-card rounded-4 shadow overflow-hidden position-relative h-100 ${isCenterSlide ? 'center-slide' : 'side-slide'}`} style={{ 
                        background: darkMode 
                          ? "linear-gradient(135deg, rgba(40, 55, 65, 0.7) 0%, rgba(30, 45, 55, 0.9) 100%)" 
                          : "linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.9) 100%)", 
                        backdropFilter: "blur(10px)",
                        color: darkMode ? '#F5F5F5' : '#4A4A4A'
                      }}>
                        <div
                          className="movie-thumbnail rounded-top"
                          style={{
                            backgroundImage: `url(${movie.thumbnail})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            height: isCenterSlide ? "450px" : "380px",
                          }}
                        >
                          <div className="movie-overlay d-flex flex-column justify-content-end align-items-center p-4 bg-gradient-to-top">
                            <h5 className={`text-center text-white mb-2 ${isCenterSlide ? 'fs-3' : 'fs-5'}`}>{movie.title}</h5>
                            <div className="d-flex justify-content-center align-items-center mb-3">
                              <span className="badge me-2" style={{ 
                                background: darkMode 
                                  ? "linear-gradient(135deg, #2D4A5B 0%, #1E3A4C 100%)" 
                                  : "linear-gradient(135deg, #E5E4E2 0%, #C0C0C0 100%)", 
                                color: darkMode ? '#E0E0E0' : '#4A4A4A' 
                              }}>{movie.genre}</span>
                              <span style={{ color: '#D4AF37' }}>
                                <i className="fas fa-star me-1"></i>
                                {movie.rating}
                              </span>
                            </div>
                            {user?.purchasedMovies?.includes(movie.id) ? (
                              <button className={`btn ${isCenterSlide ? 'btn-lg' : 'btn-sm'} rounded-pill px-4 shadow text-white`} onClick={() => handlePlayMovie(movie)} style={{ background: "linear-gradient(135deg, #7F7F7F 0%, #4A4A4A 100%)" }}>
                                <i className="fas fa-play me-2"></i> Play Now
                              </button>
                            ) : (
                              <button className={`btn ${isCenterSlide ? 'btn-lg' : 'btn-sm'} rounded-pill px-4 shadow text-white`} onClick={() => handleBuyMovie(movie)} style={{ background: "linear-gradient(135deg, #A8A8A8 0%, #7F7F7F 100%)" }}>
                                <i className="fas fa-shopping-cart me-2"></i> $0.20
                              </button>
                            )}
                          </div>
                        </div>
                        {isCenterSlide && (
                          <div className="position-absolute top-0 end-0 m-3">
                            <span className="badge fs-6 text-white" style={{ 
                              background: darkMode 
                                ? "linear-gradient(135deg, #2D4A5B 0%, #1E3A4C 100%)" 
                                : "linear-gradient(135deg, #E5E4E2 0%, #C0C0C0 100%)", 
                              color: darkMode ? '#E0E0E0' : '#4A4A4A' 
                            }}>
                              <i className="fas fa-crown me-1" style={{ color: '#D4AF37' }}></i> Featured
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </Slider>
          </div>
        )}

        {/* All Movies Grid */}
        <div>
          <h3 className={darkMode ? "text-light mb-3" : "text-dark mb-3"}>
            <i className="fas fa-film me-2" style={{ color: "#D4AF37" }}></i>All Movies 2025
          </h3>
          <div className="row g-4">
            {movies.map((movie, index) => (
              <motion.div
                key={movie.id}
                className="col-xl-2 col-lg-3 col-md-4 col-sm-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.01 }}
                whileHover={{ scale: 1.05, rotate: 1 }}
              >
                <div className="movie-card rounded-s-shape shadow h-100 overflow-hidden position-relative" style={{ 
                  background: darkMode 
                    ? "linear-gradient(135deg, rgba(40, 55, 65, 0.7) 0%, rgba(30, 45, 55, 0.9) 100%)" 
                    : "linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.9) 100%)", 
                  backdropFilter: "blur(10px)",
                  border: darkMode ? "1px solid rgba(60,80,90,0.5)" : "1px solid rgba(255,255,255,0.5)",
                  color: darkMode ? '#F5F5F5' : '#4A4A4A'
                }}>
                  {/* Corner decoration */}
                  <div className="position-absolute top-0 end-0 s-shape-corner" style={{
                    width: "30px",
                    height: "30px",
                    borderLeft: darkMode ? "2px solid #506874" : "2px solid #C0C0C0",
                    borderBottom: darkMode ? "2px solid #506874" : "2px solid #C0C0C0",
                    borderBottomLeftRadius: "10px"
                  }}></div>
                  
                  <div
                    className="movie-thumbnail rounded-s-shape-top"
                    style={{
                      backgroundImage: `url(${movie.thumbnail})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      height: "280px",
                    }}
                  >
                    <div className="movie-overlay d-flex justify-content-center align-items-center bg-dark bg-opacity-50 opacity-0 hover-opacity-100 transition-all">
                      {user?.purchasedMovies?.includes(movie.id) ? (
                        <button className="btn btn-lg rounded-circle shadow text-white" onClick={() => handlePlayMovie(movie)} style={{ background: "linear-gradient(135deg, #7F7F7F 0%, #4A4A4A 100%)" }}>
                          <i className="fas fa-play"></i>
                        </button>
                      ) : (
                        <button className="btn shadow text-white" onClick={() => handleBuyMovie(movie)} style={{ background: "linear-gradient(135deg, #A8A8A8 0%, #7F7F7F 100%)" }}>
                          <i className="fas fa-shopping-cart"></i>
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="p-3">
                    <h6 className="text-truncate fw-bold mb-2" style={{ color: darkMode ? '#F5F5F5' : '#4A4A4A' }}>{movie.title}</h6>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="badge rounded-pill" style={{ 
                        background: darkMode 
                          ? "linear-gradient(135deg, #2D4A5B 0%, #1E3A4C 100%)" 
                          : "linear-gradient(135deg, #E5E4E2 0%, #C0C0C0 100%)", 
                        color: darkMode ? '#E0E0E0' : '#4A4A4A' 
                      }}>{movie.genre}</span>
                      <span className="small d-flex align-items-center" style={{ color: '#D4AF37' }}>
                        <i className="fas fa-star me-1"></i>
                        {movie.rating}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* Font Awesome */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />

      {/* Bootstrap JS */}
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

      {/* Custom CSS */}
      <style>
        {`
          body {
            background: linear-gradient(135deg, #E5E4E2 0%, #C0C0C0 30%, #E5E4E2 100%) !important;
            background-attachment: fixed;
            color: #4A4A4A;
            transition: background 0.3s ease, color 0.3s ease;
          }
          
          body.dark-mode {
            background: linear-gradient(135deg, #1A2930 0%, #0A1A29 30%, #1A2930 100%) !important;
            color: #F5F5F5;
          }

          .search-container .form-control:focus {
            border-color: #C0C0C0;
            box-shadow: 0 0 0 0.2rem rgba(192, 192, 192, 0.25);
          }

          .search-result-item:hover {
            background-color: rgba(229, 228, 226, 0.5) !important;
          }
          
          .dark-mode .search-result-item:hover {
            background-color: rgba(40, 55, 65, 0.5) !important;
          }

          .search-results-dropdown {
            z-index: 1000;
          }

          .movie-overlay {
            transition: all 0.3s ease;
            height: 100%;
            opacity: 0;
            background: linear-gradient(to top, rgba(127, 127, 127, 0.8) 0%, rgba(127, 127, 127, 0.4) 50%, rgba(0,0,0,0) 100%) !important;
          }
          
          .movie-card:hover .movie-overlay {
            opacity: 1 !important;
          }

          /* Custom scrollbar */
          .search-results-list::-webkit-scrollbar {
            width: 8px;
          }
          .search-results-list::-webkit-scrollbar-track {
            background: rgba(229, 228, 226, 0.5);
          }
          .dark-mode .search-results-list::-webkit-scrollbar-track {
            background: rgba(40, 55, 65, 0.5);
          }
          .search-results-list::-webkit-scrollbar-thumb {
            background: #C0C0C0;
            border-radius: 4px;
          }
          .dark-mode .search-results-list::-webkit-scrollbar-thumb {
            background: #506874;
          }

          .navbar-nav .nav-link {
            transition: color 0.2s;
          }

          .navbar-nav .nav-link:hover {
            color: #7F7F7F !important;
          }
          
          .dark-mode .navbar-nav .nav-link:hover {
            color: #A8A8A8 !important;
          }

          .rounded-pill {
            border-radius: 50rem !important;
          }

          /* Featured Movies Carousel Enhancements */
          .featured-carousel-container {
            padding: 0 40px;
          }
          
          .featured-slide {
            transition: transform 0.5s ease, opacity 0.5s ease;
            padding: 30px 10px;
          }
          
          .center-slide {
            transform: scale(1.15);
            z-index: 5;
            opacity: 1 !important;
          }
          
          .side-slide {
            transform: scale(0.85);
            opacity: 0.7;
          }
          
          .center-slide .movie-card {
            box-shadow: 0 15px 35px rgba(0,0,0,0.25) !important;
          }
          
          .slick-slide {
            transition: all 0.5s ease;
          }
          
          .slick-dots {
            bottom: -40px;
          }
          
          .slick-dots li button:before {
            font-size: 12px;
            color: #C0C0C0;
          }
          
          .dark-mode .slick-dots li button:before {
            color: #506874;
          }
          
          .slick-dots li.slick-active button:before {
            color: #7F7F7F;
          }
          
          .dark-mode .slick-dots li.slick-active button:before {
            color: #A8A8A8;
          }

          /* S-shape corners */
          .rounded-s-shape {
            border-radius: 15px;
            position: relative;
          }
          
          .rounded-s-shape-top {
            border-radius: 15px 15px 0 0;
          }
          
          .s-shape-corner {
            border-radius: 0 0 0 15px;
          }

          /* Responsive adjustments */
          @media (max-width: 768px) {
            .featured-carousel-container {
              padding: 0 15px;
            }
            
            .center-slide {
              transform: scale(1.05);
            }
            
            .side-slide {
              transform: scale(0.9);
            }
          }
        `}
      </style>
    </div>
  );
}

export default Dashboard1;