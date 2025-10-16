// src/ChatPage.jsx - FIXED VERSION WITH SAMPLE DATA
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function ChatPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [productInfo, setProductInfo] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isCalling, setIsCalling] = useState(false);
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [callStatus, setCallStatus] = useState("idle");
  const messagesEndRef = useRef(null);

  // Sample product data - FALLBACK DATA
  const sampleProductInfo = {
    productId: "sample-1",
    productName: "Dell Latitude Laptop",
    productImage: "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=600",
    businessName: "TechHub Tanzania",
    businessPhone: "+255 789 123 456",
    price: "1,200,000",
    currency: "TSh",
    category: "Electronics & Devices",
    timestamp: new Date().toISOString()
  };

  // Sample business responses
  const businessResponses = [
    "Hello! Thank you for your interest in our product.",
    "We'd be happy to help you with that.",
    "The price is negotiable depending on quantity.",
    "We offer free delivery within the city.",
    "The product comes with a 1-year warranty.",
    "We have this item in stock right now.",
    "Would you like to schedule a viewing?",
    "We can arrange a meeting for tomorrow.",
    "What specific features are you interested in?",
    "We accept all major payment methods."
  ];

  // Load product info - WITH FALLBACK
  useEffect(() => {
    try {
      const chatData = JSON.parse(localStorage.getItem('currentChatProduct'));
      if (chatData) {
        setProductInfo(chatData);
        console.log("Chat data loaded:", chatData);
      } else {
        // Use sample data if no localStorage data
        setProductInfo(sampleProductInfo);
        console.log("Using sample product data");
      }
      
      // Add welcome messages
      const welcomeMessages = [
        {
          id: 1,
          text: `Hello! I'm interested in your ${chatData?.productName || sampleProductInfo.productName}. Can you tell me more about it?`,
          sender: "user",
          timestamp: new Date().toISOString(),
          type: "text"
        },
        {
          id: 2,
          text: `Hello! Thank you for your interest in our ${chatData?.productName || sampleProductInfo.productName}. I'd be happy to help you. What would you like to know?`,
          sender: "business",
          timestamp: new Date().toISOString(),
          type: "text"
        }
      ];
      
      setMessages(welcomeMessages);
      
    } catch (error) {
      console.error("Error loading chat data:", error);
      // Fallback to sample data
      setProductInfo(sampleProductInfo);
      
      const fallbackMessages = [
        {
          id: 1,
          text: `Hello! I'm interested in your ${sampleProductInfo.productName}. Can you tell me more about it?`,
          sender: "user",
          timestamp: new Date().toISOString(),
          type: "text"
        },
        {
          id: 2,
          text: `Hello! Thank you for your interest in our ${sampleProductInfo.productName}. I'd be happy to help you. What would you like to know?`,
          sender: "business",
          timestamp: new Date().toISOString(),
          type: "text"
        }
      ];
      
      setMessages(fallbackMessages);
    }
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Send text message
  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: newMessage,
      sender: "user",
      timestamp: new Date().toISOString(),
      type: "text"
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage("");

    // Simulate business response after 1-3 seconds
    setTimeout(() => {
      const randomResponse = businessResponses[Math.floor(Math.random() * businessResponses.length)];
      const businessMessage = {
        id: Date.now() + 1,
        text: randomResponse,
        sender: "business",
        timestamp: new Date().toISOString(),
        type: "text"
      };
      setMessages(prev => [...prev, businessMessage]);
    }, 1000 + Math.random() * 2000);
  };

  // Start voice recording
  const startRecording = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("Voice recording is not supported in your browser.");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      recorder.start();
      setIsRecording(true);
      
      setTimeout(() => {
        if (recorder.state === "recording") {
          recorder.stop();
          stream.getTracks().forEach(track => track.stop());
          setIsRecording(false);
          
          // Add voice message to chat
          const voiceMessage = {
            id: Date.now(),
            text: "🎤 Voice message",
            sender: "user",
            timestamp: new Date().toISOString(),
            type: "audio",
            duration: "0:05"
          };
          
          setMessages(prev => [...prev, voiceMessage]);
          
          // Simulate business response
          setTimeout(() => {
            const businessResponse = {
              id: Date.now() + 1,
              text: "Thanks for the voice message! I'll check it right away.",
              sender: "business",
              timestamp: new Date().toISOString(),
              type: "text"
            };
            setMessages(prev => [...prev, businessResponse]);
          }, 1500);
        }
      }, 3000); // Record for 3 seconds
      
    } catch (error) {
      console.error("Error starting recording:", error);
      alert("Microphone access is required for voice messages. Please allow microphone permissions.");
    }
  };

  // Handle file upload (images/videos)
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileType = file.type.split('/')[0];
    if (fileType !== 'image' && fileType !== 'video') {
      alert('Please select an image or video file.');
      return;
    }

    // Create a blob URL for the file
    const fileUrl = URL.createObjectURL(file);

    const mediaMessage = {
      id: Date.now(),
      text: fileType === 'image' ? '📷 Photo' : '🎥 Video',
      fileUrl: fileUrl,
      fileName: file.name,
      fileType: fileType,
      sender: "user",
      timestamp: new Date().toISOString(),
      type: fileType
    };

    setMessages(prev => [...prev, mediaMessage]);
    setSelectedFile(null);

    // Clear file input
    e.target.value = '';

    // Simulate business response
    setTimeout(() => {
      const businessResponse = {
        id: Date.now() + 1,
        text: fileType === 'image' 
          ? "Thanks for sharing the photo! The product looks great." 
          : "Thanks for the video! This helps a lot.",
        sender: "business",
        timestamp: new Date().toISOString(),
        type: "text"
      };
      setMessages(prev => [...prev, businessResponse]);
    }, 2000);
  };

  // Start voice call
  const startVoiceCall = () => {
    setIsCalling(true);
    setIsVideoCall(false);
    setCallStatus("calling");
    
    // Add call started message
    const callMessage = {
      id: Date.now(),
      text: "📞 Voice call started...",
      sender: "system",
      timestamp: new Date().toISOString(),
      type: "system"
    };
    
    setMessages(prev => [...prev, callMessage]);
    
    // Simulate call ringing
    setTimeout(() => {
      setCallStatus("connected");
    }, 3000);
  };

  // Start video call
  const startVideoCall = () => {
    setIsCalling(true);
    setIsVideoCall(true);
    setCallStatus("calling");
    
    // Add call started message
    const callMessage = {
      id: Date.now(),
      text: "📹 Video call started...",
      sender: "system",
      timestamp: new Date().toISOString(),
      type: "system"
    };
    
    setMessages(prev => [...prev, callMessage]);
    
    // Simulate call ringing
    setTimeout(() => {
      setCallStatus("connected");
    }, 3000);
  };

  // End call
  const endCall = () => {
    setIsCalling(false);
    setCallStatus("idle");
    
    // Add call ended message
    const callMessage = {
      id: Date.now(),
      text: `📞 ${isVideoCall ? 'Video call' : 'Voice call'} ended. Duration: 2:30`,
      sender: "system",
      timestamp: new Date().toISOString(),
      type: "system"
    };
    
    setMessages(prev => [...prev, callMessage]);
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Render message content based on type
  const renderMessageContent = (message) => {
    switch (message.type) {
      case "text":
        return <p className="mb-1" style={{ lineHeight: '1.4' }}>{message.text}</p>;
      
      case "audio":
        return (
          <div className="d-flex align-items-center gap-2">
            <button 
              className="btn btn-primary rounded-circle p-2 d-flex align-items-center justify-content-center"
              style={{ width: '40px', height: '40px' }}
              onClick={() => {
                // Simulate playing audio
                alert("Playing voice message...");
              }}
            >
              <i className="fas fa-play" style={{ fontSize: '12px' }}></i>
            </button>
            <div className="flex-grow-1">
              <div className="bg-primary bg-opacity-25 rounded" style={{ height: '4px', width: '100%' }}></div>
            </div>
            <small>{message.duration || '0:05'}</small>
          </div>
        );
      
      case "image":
        return (
          <div>
            <img 
              src={message.fileUrl || "https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=600"} 
              alt="Shared image"
              className="rounded-3 mb-2"
              style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'cover' }}
            />
            <small className="text-muted d-block">
              <i className="fas fa-image me-1"></i>
              {message.fileName || 'photo.jpg'}
            </small>
          </div>
        );
      
      case "video":
        return (
          <div>
            <div 
              className="rounded-3 mb-2 bg-dark d-flex align-items-center justify-content-center"
              style={{ width: '200px', height: '150px' }}
            >
              <i className="fas fa-play-circle text-white fa-2x"></i>
            </div>
            <small className="text-muted d-block">
              <i className="fas fa-video me-1"></i>
              {message.fileName || 'video.mp4'}
            </small>
          </div>
        );
      
      case "system":
        return <p className="mb-1 text-center">{message.text}</p>;
      
      default:
        return <p className="mb-1">{message.text}</p>;
    }
  };

  return (
    <div className="min-vh-100 bg-light" style={{ paddingBottom: '80px' }}>
      {/* Call Interface Overlay */}
      {isCalling && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center z-3"
          style={{ backgroundColor: 'rgba(0,0,0,0.9)' }}
        >
          <div className="text-center text-white">
            <div className="mb-4">
              <i className={`fas ${isVideoCall ? 'fa-video' : 'fa-phone'} fa-4x text-primary mb-3`}></i>
              <h3 className="fw-bold">
                {callStatus === "calling" ? "Calling..." : "Call Connected"}
              </h3>
              <p className="text-light">
                {productInfo?.businessName || "Business"}
                <br />
                {isVideoCall ? "Video Call" : "Voice Call"}
              </p>
            </div>
            
            <div className="d-flex justify-content-center gap-3 mb-4">
              <div className="text-center">
                <div className="bg-primary rounded-circle p-3 mb-2 mx-auto d-flex align-items-center justify-content-center" style={{width: '50px', height: '50px'}}>
                  <i className="fas fa-microphone text-white"></i>
                </div>
                <small>Mute</small>
              </div>
              
              {isVideoCall && (
                <div className="text-center">
                  <div className="bg-info rounded-circle p-3 mb-2 mx-auto d-flex align-items-center justify-content-center" style={{width: '50px', height: '50px'}}>
                    <i className="fas fa-video text-white"></i>
                  </div>
                  <small>Video</small>
                </div>
              )}
              
              <div className="text-center">
                <div className="bg-success rounded-circle p-3 mb-2 mx-auto d-flex align-items-center justify-content-center" style={{width: '50px', height: '50px'}}>
                  <i className="fas fa-volume-up text-white"></i>
                </div>
                <small>Speaker</small>
              </div>
            </div>
            
            <button 
              className="btn btn-danger btn-lg rounded-circle p-3 d-flex align-items-center justify-content-center"
              style={{width: '60px', height: '60px'}}
              onClick={endCall}
            >
              <i className="fas fa-phone-slash"></i>
            </button>
            
            <p className="mt-3 text-muted">02:30</p>
          </div>
        </div>
      )}

      {/* Header */}
      <nav className="navbar navbar-light bg-white shadow-sm sticky-top">
        <div className="container">
          <div className="d-flex align-items-center w-100">
            <button 
              className="btn btn-outline-secondary border-0 me-3"
              onClick={() => navigate(-1)}
            >
              <i className="fas fa-arrow-left"></i>
            </button>
            
            <div className="flex-grow-1">
              <h6 className="fw-bold mb-0">{productInfo?.businessName || "Business"}</h6>
              <small className="text-muted">
                Online • {formatTime(new Date())}
              </small>
            </div>
            
            <div className="d-flex gap-2">
              <button 
                className="btn btn-outline-primary rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: '40px', height: '40px' }}
                onClick={startVoiceCall}
              >
                <i className="fas fa-phone"></i>
              </button>
              <button 
                className="btn btn-outline-primary rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: '40px', height: '40px' }}
                onClick={startVideoCall}
              >
                <i className="fas fa-video"></i>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Product Info Bar */}
      <div className="bg-white border-bottom py-2">
        <div className="container">
          <div className="d-flex align-items-center gap-3">
            <img 
              src={productInfo?.productImage || "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=600"} 
              alt={productInfo?.productName || "Product"}
              className="rounded"
              style={{ width: '50px', height: '50px', objectFit: 'cover' }}
            />
            <div className="flex-grow-1">
              <h6 className="fw-bold mb-0 small">{productInfo?.productName || "Product Name"}</h6>
              <p className="text-success fw-bold mb-0 small">
                {productInfo?.currency || "TSh"} {productInfo?.price || "0"}
              </p>
            </div>
            <button 
              className="btn btn-outline-primary btn-sm"
              onClick={() => navigate(-1)}
            >
              View Product
            </button>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div 
        className="container py-3"
        style={{ height: 'calc(100vh - 200px)', overflowY: 'auto' }}
      >
        <div className="d-flex flex-column gap-3">
          {messages.length > 0 ? (
            messages.map((message) => (
              <div
                key={message.id}
                className={`d-flex ${message.sender === "user" ? "justify-content-end" : "justify-content-start"}`}
              >
                <div
                  className={`rounded-4 p-3 position-relative ${
                    message.sender === "user" 
                      ? "bg-primary text-white" 
                      : message.sender === "system"
                      ? "bg-light text-center text-muted border-0"
                      : "bg-white border"
                  }`}
                  style={{ 
                    maxWidth: '70%',
                    boxShadow: message.sender !== "system" ? '0 2px 8px rgba(0,0,0,0.1)' : 'none'
                  }}
                >
                  {renderMessageContent(message)}
                  
                  {/* Timestamp */}
                  <small 
                    className={`position-absolute bottom-0 ${
                      message.sender === "user" ? "start-0" : "end-0"
                    } translate-${message.sender === "user" ? "start" : "end"} m-2 ${
                      message.sender === "user" ? "text-white-50" : "text-muted"
                    }`}
                    style={{ fontSize: '0.7rem' }}
                  >
                    {formatTime(message.timestamp)}
                  </small>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-5">
              <div className="spinner-border text-primary mb-3"></div>
              <p className="text-muted">Loading messages...</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-white border-top py-3 fixed-bottom">
        <div className="container">
          <form onSubmit={sendMessage} className="d-flex align-items-center gap-2">
            {/* File Upload Button */}
            <div className="position-relative">
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileUpload}
                className="position-absolute top-0 start-0 w-100 h-100 opacity-0"
                style={{ cursor: 'pointer', zIndex: 1 }}
                id="file-upload"
              />
              <label 
                htmlFor="file-upload"
                className="btn btn-outline-secondary border-0 rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: '45px', height: '45px', cursor: 'pointer' }}
              >
                <i className="fas fa-paperclip"></i>
              </label>
            </div>

            {/* Voice Message Button */}
            <button
              type="button"
              className={`btn border-0 rounded-circle d-flex align-items-center justify-content-center ${
                isRecording ? 'btn-danger' : 'btn-outline-secondary'
              }`}
              style={{ width: '45px', height: '45px' }}
              onClick={startRecording}
            >
              <i className={`fas ${isRecording ? 'fa-stop' : 'fa-microphone'}`}></i>
            </button>

            {/* Message Input */}
            <div className="flex-grow-1">
              <input
                type="text"
                className="form-control rounded-pill border-0"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                style={{ 
                  padding: '12px 20px',
                  backgroundColor: '#f8f9fa'
                }}
              />
            </div>

            {/* Send Button */}
            <button
              type="submit"
              className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: '45px', height: '45px' }}
              disabled={!newMessage.trim()}
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </form>

          {/* Quick Actions */}
          <div className="d-flex justify-content-center gap-2 mt-3 flex-wrap">
            <button 
              className="btn btn-outline-primary btn-sm rounded-pill px-3"
              onClick={() => setNewMessage("Is this item still available?")}
            >
              📦 Available?
            </button>
            <button 
              className="btn btn-outline-primary btn-sm rounded-pill px-3"
              onClick={() => setNewMessage("What's the best price?")}
            >
              💰 Best Price
            </button>
            <button 
              className="btn btn-outline-primary btn-sm rounded-pill px-3"
              onClick={() => setNewMessage("Can I see more photos?")}
            >
              📷 More Photos
            </button>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .fixed-bottom {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: white;
          z-index: 2;
          border-top: 1px solid #dee2e6;
        }
        
        /* Ensure messages container has proper spacing */
        .container:first-of-type {
          padding-bottom: 120px;
        }
      `}</style>
    </div>
  );
}

export default ChatPage;