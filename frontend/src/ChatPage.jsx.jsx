// src/ChatPage.jsx - STICKER ICON REMOVED
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
  const fileInputRef = useRef(null);

  // Sample product data
  const sampleProductInfo = {
    productId: "sample-1",
    productName: "Dell Latitude Laptop",
    productImage: "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=600",
    businessName: "TechHub Tanzania",
    businessPhone: "+255 789 123 456",
    price: "1,200,000",
    currency: "TSh",
    category: "Electronics & Devices"
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

  // Load product info
  useEffect(() => {
    try {
      const chatData = JSON.parse(localStorage.getItem('currentChatProduct'));
      setProductInfo(chatData || sampleProductInfo);
      
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
        },
        {
          id: 3,
          text: `The price is ${chatData?.currency || 'TSh'} ${chatData?.price || '1,200,000'} and it's available for viewing. Would you like to know more details?`,
          sender: "business",
          timestamp: new Date().toISOString(),
          type: "text"
        }
      ];
      
      setMessages(welcomeMessages);
      
    } catch (error) {
      console.error("Error loading chat data:", error);
      setProductInfo(sampleProductInfo);
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

    // Simulate business response
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
      setIsRecording(true);
      
      // Simulate recording for 3 seconds
      setTimeout(() => {
        setIsRecording(false);
        
        const voiceMessage = {
          id: Date.now(),
          text: "🎤 Voice message",
          sender: "user",
          timestamp: new Date().toISOString(),
          type: "audio",
          duration: "0:03"
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
      }, 3000);
      
    } catch (error) {
      console.error("Error starting recording:", error);
      alert("Voice recording not supported in this browser.");
    }
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileType = file.type.split('/')[0];
    if (fileType !== 'image' && fileType !== 'video') {
      alert('Please select an image or video file.');
      return;
    }

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
    e.target.value = '';

    // Simulate business response
    setTimeout(() => {
      const businessResponse = {
        id: Date.now() + 1,
        text: fileType === 'image' ? "Nice photo! Thanks for sharing." : "Great video! This helps a lot.",
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
    
    setTimeout(() => {
      setCallStatus("connected");
    }, 3000);
  };

  // Start video call
  const startVideoCall = () => {
    setIsCalling(true);
    setIsVideoCall(true);
    setCallStatus("calling");
    
    setTimeout(() => {
      setCallStatus("connected");
    }, 3000);
  };

  // End call
  const endCall = () => {
    setIsCalling(false);
    setCallStatus("idle");
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Render message content
  const renderMessageContent = (message) => {
    switch (message.type) {
      case "text":
        return (
          <div>
            <p className="mb-0" style={{ lineHeight: '1.4', fontSize: '14px' }}>{message.text}</p>
          </div>
        );
      
      case "audio":
        return (
          <div className="d-flex align-items-center gap-3">
            <div className="bg-success rounded-circle d-flex align-items-center justify-content-center" 
                 style={{ width: '40px', height: '40px' }}>
              <i className="fas fa-play text-white"></i>
            </div>
            <div className="flex-grow-1">
              <div className="bg-secondary bg-opacity-25 rounded" style={{ height: '6px', width: '100%' }}></div>
            </div>
            <small className="text-muted">{message.duration}</small>
          </div>
        );
      
      case "image":
        return (
          <div>
            <img 
              src={message.fileUrl || "https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=600"} 
              alt="Shared"
              className="rounded-3"
              style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover' }}
            />
          </div>
        );
      
      case "video":
        return (
          <div className="position-relative">
            <div 
              className="rounded-3 bg-dark d-flex align-items-center justify-content-center"
              style={{ width: '200px', height: '150px' }}
            >
              <i className="fas fa-play-circle text-white fa-2x"></i>
            </div>
            <small className="position-absolute bottom-0 end-0 m-2 text-white">
              <i className="fas fa-play me-1"></i>
              Play
            </small>
          </div>
        );
      
      default:
        return <p className="mb-0" style={{ fontSize: '14px' }}>{message.text}</p>;
    }
  };

  return (
    <div className="d-flex flex-column vh-100 bg-white">
      {/* WhatsApp-like Header */}
      <div className="bg-success text-white py-2 px-3 shadow-sm" style={{ height: '60px' }}>
        <div className="d-flex align-items-center justify-content-between h-100">
          {/* Left side - Back button and Business info */}
          <div className="d-flex align-items-center">
            <button 
              className="btn btn-link text-white p-0 me-3"
              onClick={() => navigate(-1)}
              style={{ textDecoration: 'none' }}
            >
              <i className="fas fa-arrow-left"></i>
            </button>
            <div>
              <h6 className="mb-0 fw-bold" style={{ fontSize: '16px' }}>
                {productInfo?.businessName || "Business"}
              </h6>
              <small className="opacity-75" style={{ fontSize: '12px' }}>
                Online • {productInfo?.productName}
              </small>
            </div>
          </div>

          {/* Right side - Call buttons */}
          <div className="d-flex align-items-center gap-2">
            <button 
              className="btn btn-link text-white p-1"
              onClick={startVoiceCall}
              style={{ textDecoration: 'none' }}
            >
              <i className="fas fa-phone-alt"></i>
            </button>
            <button 
              className="btn btn-link text-white p-1"
              onClick={startVideoCall}
              style={{ textDecoration: 'none' }}
            >
              <i className="fas fa-video"></i>
            </button>
            <button className="btn btn-link text-white p-1">
              <i className="fas fa-ellipsis-v"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Call Interface Overlay */}
      {isCalling && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark d-flex align-items-center justify-content-center z-3">
          <div className="text-center text-white">
            <div className="mb-4">
              <div className="bg-success rounded-circle p-4 mb-3 mx-auto d-flex align-items-center justify-content-center" 
                   style={{width: '80px', height: '80px'}}>
                <i className={`fas ${isVideoCall ? 'fa-video' : 'fa-phone'} fa-2x`}></i>
              </div>
              <h4 className="fw-bold mb-2">
                {callStatus === "calling" ? "Calling..." : "Call Connected"}
              </h4>
              <p className="mb-1">{productInfo?.businessName}</p>
              <small className="text-light opacity-75">
                {isVideoCall ? "Video call" : "Voice call"}
              </small>
            </div>
            
            <div className="d-flex justify-content-center gap-4 mb-4">
              <div className="text-center">
                <button className="btn btn-light rounded-circle p-3 mb-2 d-flex align-items-center justify-content-center mx-auto"
                        style={{width: '50px', height: '50px'}}>
                  <i className="fas fa-microphone-slash text-dark"></i>
                </button>
                <small>Mute</small>
              </div>
              
              {isVideoCall && (
                <div className="text-center">
                  <button className="btn btn-light rounded-circle p-3 mb-2 d-flex align-items-center justify-content-center mx-auto"
                          style={{width: '50px', height: '50px'}}>
                    <i className="fas fa-video-slash text-dark"></i>
                  </button>
                  <small>Video</small>
                </div>
              )}
              
              <div className="text-center">
                <button className="btn btn-light rounded-circle p-3 mb-2 d-flex align-items-center justify-content-center mx-auto"
                        style={{width: '50px', height: '50px'}}>
                  <i className="fas fa-volume-up text-dark"></i>
                </button>
                <small>Speaker</small>
              </div>
            </div>
            
            <button 
              className="btn btn-danger rounded-circle p-3 d-flex align-items-center justify-content-center mx-auto"
              style={{width: '60px', height: '60px'}}
              onClick={endCall}
            >
              <i className="fas fa-phone-slash fa-lg"></i>
            </button>
            
            <p className="mt-3 text-light opacity-75">02:30</p>
          </div>
        </div>
      )}

      {/* Chat Messages Area - WHITE BACKGROUND */}
      <div 
        className="flex-grow-1 p-3 bg-white"
        style={{ 
          overflowY: 'auto'
        }}
      >
        <div className="d-flex flex-column gap-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`d-flex flex-column ${message.sender === "user" ? "align-items-end" : "align-items-start"}`}
            >
              {/* Message Bubble */}
              <div
                className={`rounded-3 p-3 ${
                  message.sender === "user" 
                    ? "bg-primary text-white" 
                    : "bg-light text-dark border"
                }`}
                style={{ 
                  maxWidth: '80%',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                }}
              >
                {renderMessageContent(message)}
              </div>
              
              {/* Timestamp - DIRECTLY BELOW EACH MESSAGE BUBBLE */}
              <div 
                className={`mt-1 ${message.sender === "user" ? "text-end" : "text-start"}`}
                style={{ 
                  width: '80%',
                  padding: '0 8px'
                }}
              >
                <small 
                  className="text-muted"
                  style={{ fontSize: '11px' }}
                >
                  {formatTime(message.timestamp)}
                </small>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input Area - ONLY EMOJI ICON INSIDE INPUT */}
      <div className="bg-light border-top p-3">
        <div className="container-fluid px-0">
          <form onSubmit={sendMessage}>
            <div className="position-relative">
              {/* Single Emoji Icon inside input - LEFT SIDE */}
              <div className="position-absolute start-0 top-50 translate-middle-y ms-3"
                   style={{ zIndex: 2 }}>
                <button
                  type="button"
                  className="btn btn-link text-muted p-1"
                  style={{ width: '35px', height: '35px' }}
                >
                  <i className="fas fa-smile"></i>
                </button>
              </div>

              {/* Message Input - WITH PADDING FOR ICON */}
              <input
                type="text"
                className="form-control rounded-pill border-0"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                style={{ 
                  padding: '14px 100px 14px 50px', // Less padding since only one icon
                  backgroundColor: 'white',
                  fontSize: '16px',
                  border: '1px solid #e0e0e0 !important',
                  minHeight: '50px',
                  lineHeight: '1.5'
                }}
              />

              {/* Icons inside input - RIGHT SIDE */}
              <div className="position-absolute end-0 top-50 translate-middle-y d-flex align-items-center gap-1 me-2"
                   style={{ zIndex: 2 }}>
                {/* Attachment Button */}
                <div className="position-relative">
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileUpload}
                    className="position-absolute top-0 start-0 w-100 h-100 opacity-0"
                    style={{ cursor: 'pointer', zIndex: 1 }}
                    id="file-upload"
                    ref={fileInputRef}
                  />
                  <label 
                    htmlFor="file-upload"
                    className="btn btn-link text-muted p-1 d-flex align-items-center justify-content-center"
                    style={{ width: '35px', height: '35px', cursor: 'pointer' }}
                  >
                    <i className="fas fa-paperclip"></i>
                  </label>
                </div>

                {/* Send/Record Button */}
                {newMessage.trim() ? (
                  <button
                    type="submit"
                    className="btn btn-success rounded-circle d-flex align-items-center justify-content-center"
                    style={{ 
                      width: '40px', 
                      height: '40px'
                    }}
                  >
                    <i className="fas fa-paper-plane"></i>
                  </button>
                ) : (
                  <button
                    type="button"
                    className={`btn rounded-circle d-flex align-items-center justify-content-center ${
                      isRecording ? 'btn-danger' : 'btn-success'
                    }`}
                    style={{ 
                      width: '40px', 
                      height: '40px'
                    }}
                    onClick={startRecording}
                  >
                    <i className={`fas ${isRecording ? 'fa-stop' : 'fa-microphone'}`}></i>
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Custom WhatsApp-like Styles */}
      <style jsx>{`
        .vh-100 {
          height: 100vh;
        }
        
        /* WhatsApp green theme */
        .bg-success {
          background-color: #075E54 !important;
        }
        
        .btn-success {
          background-color: #25D366 !important;
          border-color: #25D366 !important;
        }
        
        /* Message bubbles */
        .bg-primary {
          background-color: #25D366 !important;
          border-color: #25D366 !important;
        }
        
        /* Clean white background for messages area */
        .bg-white {
          background-color: #ffffff !important;
        }
        
        /* Light grey for business messages */
        .bg-light {
          background-color: #f0f0f0 !important;
        }
        
        /* Custom scrollbar */
        .flex-grow-1::-webkit-scrollbar {
          width: 6px;
        }
        
        .flex-grow-1::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        
        .flex-grow-1::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 3px;
        }
        
        .flex-grow-1::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
        
        /* Mobile optimizations */
        @media (max-width: 768px) {
          .container-fluid {
            padding-left: 0;
            padding-right: 0;
          }
          
          .p-3 {
            padding: 16px !important;
          }
          
          .gap-3 > * {
            margin-bottom: 12px;
          }
          
          /* Larger input for mobile */
          .form-control {
            font-size: 16px !important;
            padding: 16px 100px 16px 50px !important;
          }
        }
        
        /* Extra small devices */
        @media (max-width: 576px) {
          .p-3 {
            padding: 12px !important;
          }
          
          .form-control {
            padding: 14px 90px 14px 45px !important;
          }
        }
        
        /* Input focus styles */
        .form-control:focus {
          box-shadow: 0 0 0 2px rgba(37, 211, 102, 0.25);
          border-color: #25D366 !important;
        }
        
        /* Smooth transitions */
        .btn, .form-control {
          transition: all 0.2s ease-in-out;
        }
      `}</style>
    </div>
  );
}

export default ChatPage;