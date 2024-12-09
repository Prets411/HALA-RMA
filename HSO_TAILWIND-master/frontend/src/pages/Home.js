import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    // Add keyframes for the moving background effect for each card
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes moveBackground {
        0% { transform: translateX(0) translateY(0); }
        50% { transform: translateX(-50%) translateY(-50%); }
        100% { transform: translateX(0) translateY(0); }
      }
    `;
    document.head.appendChild(style);
  }, []);

  // Shake animation for logo
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes shake {
        0% { transform: translate(1px, 1px) rotate(0deg); }
        10% { transform: translate(-1px, -2px) rotate(-1deg); }
        20% { transform: translate(-3px, 0px) rotate(1deg); }
        30% { transform: translate(3px, 2px) rotate(0deg); }
        40% { transform: translate(1px, -1px) rotate(1deg); }
        50% { transform: translate(-1px, 2px) rotate(-1deg); }
        60% { transform: translate(-3px, 1px) rotate(0deg); }
        70% { transform: translate(3px, 1px) rotate(-1deg); }
        80% { transform: translate(-1px, -1px) rotate(1deg); }
        90% { transform: translate(1px, 2px) rotate(0deg); }
        100% { transform: translate(1px, -2px) rotate(-1deg); }
      }
    `;
    document.head.appendChild(style);

    const triggerShake = () => {
      setShake(true);
      setTimeout(() => setShake(false), 500); // Shake duration
    };

    triggerShake(); // Initial shake
    const shakeInterval = setInterval(triggerShake, 10000); // Shake every 10 seconds

    return () => clearInterval(shakeInterval);
  }, []);

  const isActive = (path) => location.pathname === path;

  const handleLearnMore = () => {
    navigate('/about');
  };

  return (
    <>
      {/* Navbar Implementation */}
      <nav
        style={{
          backgroundColor: 'rgba(255, 255, 255)',
          padding: '15px 30px',
          position: 'fixed',
          top: 0,
          width: '100%',
          zIndex: 1000,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)',
          transition: 'background 0.3s ease',
        }}
      >
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <div>
            <img
              src="/images/HALRMA.png"
              alt="Logo"
              className={`h-12 ${shake ? 'animate-shake' : ''}`}
              style={{
                height: '60px',
                cursor: 'pointer',
                transition: 'transform 0.3s ease',
                animation: shake ? 'shake 0.5s' : 'none',
              }}
            />
          </div>

          {/* Desktop Menu */}
          <div className="navbar-right hidden md:flex space-x-8">
            <Link
              to="/"
              style={navLinkStyle(isActive('/'))}
            >
              Home
            </Link>
            <Link
              to="/about"
              style={navLinkStyle(isActive('/about'))}
            >
              About
            </Link>
            <Link
              to="/login"
              style={navLinkStyle(isActive('/login'))}
            >
              Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-maroon focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16m-7 6h7'}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden space-y-2 text-center bg-white p-4">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              style={navLinkStyle(isActive('/'))}
            >
              Home
            </Link>
            <Link
              to="/about"
              onClick={() => setIsOpen(false)}
              style={navLinkStyle(isActive('/about'))}
            >
              About
            </Link>
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              style={navLinkStyle(isActive('/login'))}
            >
              Login
            </Link>
          </div>
        )}
      </nav>

      {/* Main Home Content */}
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-gray-200 to-gray-100 bg-[length:200%_200%] animate-[gradientBackground_10s_ease_infinite] pt-24">
        <div className="flex flex-col md:flex-row items-center justify-between max-w-6xl w-full mb-12 px-4 md:px-0 pt-24 md:pt-32 pb-12">
          {/* Left Section */}
          <div className="flex-1 text-left md:text-left px-2 md:px-4 md:pr-16">
            <h1 className="text-4xl md:text-5xl font-bold text-maroon mb-4 md:mb-6 text-center md:text-left">
              HALA!RMA
            </h1>
            <p className="text-base md:text-lg text-gray-700 mb-4 md:mb-6 text-center md:text-left">
              is a web and mobile application designed for the Health and Safety Office, facilitating prompt
              information dissemination during critical events or unforeseen emergencies.
            </p>
            <div className="flex justify-center md:justify-start">
              <button
                onClick={handleLearnMore}
                className="bg-maroon text-white py-2 px-6 rounded-full hover:bg-yellow-500 transition transform hover:scale-105"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>

        {/* Info Cards with Moving Gradient Background */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 w-full max-w-6xl px-4 md:px-0 pb-12">
          {/* Card 1 */}
          <div className="relative bg-white shadow-lg rounded-lg p-6 text-center w-full md:w-1/3 overflow-hidden transform transition-transform hover:scale-105 flex flex-col justify-between z-0">
            <div className="absolute top-0 left-0 w-[200%] h-[200%] bg-[linear-gradient(120deg,rgba(255,215,0,0.5),rgba(255,165,0,0.5),rgba(72,209,204,0.5))] opacity-30 animate-[moveBackground_8s_linear_infinite] z-0"></div>
            <h2 className="text-xl font-bold text-maroon mb-2 relative z-1">Real-time Updates</h2>
            <p className="text-gray-600 relative z-1">Health & Safety Office is now just one notification away from reaching the university community.</p>
          </div>

          {/* Card 2 */}
          <div className="relative bg-white shadow-lg rounded-lg p-6 text-center w-full md:w-1/3 overflow-hidden transform transition-transform hover:scale-105 flex flex-col justify-between z-0">
            <div className="absolute top-0 left-0 w-[200%] h-[200%] bg-[linear-gradient(120deg,rgba(255,215,0,0.5),rgba(255,165,0,0.5),rgba(72,209,204,0.5))] opacity-30 animate-[moveBackground_8s_linear_infinite] z-0"></div>
            <h2 className="text-xl font-bold text-maroon mb-2 relative z-1">Timely Responses</h2>
            <p className="text-gray-600 relative z-1">Prompt responses during emergencies and hazardous situations without requiring an office visit.</p>
          </div>

          {/* Card 3 */}
          <div className="relative bg-white shadow-lg rounded-lg p-6 text-center w-full md:w-1/3 overflow-hidden transform transition-transform hover:scale-105 flex flex-col justify-between z-0">
            <div className="absolute top-0 left-0 w-[200%] h-[200%] bg-[linear-gradient(120deg,rgba(255,215,0,0.5),rgba(255,165,0,0.5),rgba(72,209,204,0.5))] opacity-30 animate-[moveBackground_8s_linear_infinite] z-0"></div>
            <h2 className="text-xl font-bold text-maroon mb-2 relative z-1">Enhanced Safety</h2>
            <p className="text-gray-600 relative z-1">Collaboration with GSD and MDS to implement enhanced safety measures campus-wide.</p>
          </div>
        </div>
      </div>
    </>
  );
}

// Helper function for nav link styles
const navLinkStyle = (isActive) => ({
  color: isActive ? 'gold' : 'maroon',
  fontSize: '18px',
  textTransform: 'uppercase',
  fontWeight: '500',
  position: 'relative',
  padding: '5px 10px',
  transition: 'color 0.3s ease',
  textDecoration: 'none',
  fontWeight: isActive ? '700' : '500',
  ...(isActive && {
    borderBottom: '2px solid gold',
  }),
  ':hover': {
    color: 'gold',
  },
});

//