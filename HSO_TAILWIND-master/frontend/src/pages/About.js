import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useNavigate, Link, useLocation } from 'react-router-dom';

export default function AboutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [shake, setShake] = useState(false);
  const [activeLink, setActiveLink] = useState('about');
  const [contentVisible, setContentVisible] = useState({
    features: false,
    howItWorks: false,
    significance: false,
    mission: false,
    contact: false,
    team: false,
  });

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes moveBackground {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
    `;
    document.head.appendChild(style);
  }, []);

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
      setTimeout(() => setShake(false), 500);
    };

    triggerShake();
    const shakeInterval = setInterval(triggerShake, 10000);

    return () => clearInterval(shakeInterval);
  }, []);

  const isActive = (path) => location.pathname === path;

  const handleNavClick = (link) => {
    setActiveLink(link);
    navigate(`/${link}`);
  };

  const toggleContent = (section) => {
    setContentVisible((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center pt-20"
      style={{
        background: 'linear-gradient(120deg, #f9f9f9, #f0f0f0)',
        backgroundSize: '200% 200%',
        animation: 'gradientBackground 10s ease infinite',
      }}
    >
      {/* Navbar */}
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
              onClick={() => handleNavClick('home')}
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

      {/* Main Content */}
      <div className="flex flex-col items-center w-full max-w-6xl py-24 px-4">
        {/* Intro Section */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-maroon mb-2">About HALA!RMA</h1>
          <p className="text-black max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            HALA!RMA is a real-time emergency communication platform designed to keep the university community safe and
            informed during critical events. Our mission is to streamline safety communications, ensuring timely responses
            and enhancing campus preparedness.
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {/* Features Section */}
          <div className="relative bg-white p-6 rounded-lg shadow-lg transition-transform hover:scale-105 hover:bg-[linear-gradient(120deg,rgba(173,216,230,0.2),rgba(255,255,255,0.5),rgba(0,191,255,0.2))] hover:bg-[length:200%_200%] hover:animate-[moveBackground_8s_linear_infinite]">
            <div className="relative z-10 flex justify-between items-center">
              <h2
                className="text-lg font-semibold text-maroon cursor-pointer hover:text-gold transition-colors"
                onClick={() => toggleContent('features')}
              >
                App Key Features
              </h2>
              {contentVisible.features ? (
                <FaChevronUp className="cursor-pointer" onClick={() => toggleContent('features')} />
              ) : (
                <FaChevronDown className="cursor-pointer" onClick={() => toggleContent('features')} />
              )}
            </div>
            {contentVisible.features && (
              <ul className="list-none pl-5 text-sm text-black mt-4">
                <li>✔️ <strong>Real-time Updates:</strong> Instant emergency alerts.</li>
                <li>✔️ <strong>Multi-Channel Communication:</strong> Alerts delivered via multiple platforms.</li>
                <li>✔️ <strong>Collaboration:</strong> Coordinated efforts with local safety agencies.</li>
              </ul>
            )}
          </div>

          {/* How It Works Section */}
          <div className="relative bg-white p-6 rounded-lg shadow-lg transition-transform hover:scale-105 hover:bg-[linear-gradient(120deg,rgba(173,216,230,0.2),rgba(255,255,255,0.5),rgba(0,191,255,0.2))] hover:bg-[length:200%_200%] hover:animate-[moveBackground_8s_linear_infinite]">
            <div className="relative z-10 flex justify-between items-center">
              <h2
                className="text-lg font-semibold text-maroon cursor-pointer hover:text-gold transition-colors"
                onClick={() => toggleContent('howItWorks')}
              >
                How The App Works
              </h2>
              {contentVisible.howItWorks ? (
                <FaChevronUp className="cursor-pointer" onClick={() => toggleContent('howItWorks')} />
              ) : (
                <FaChevronDown className="cursor-pointer" onClick={() => toggleContent('howItWorks')} />
              )}
            </div>
            {contentVisible.howItWorks && (
              <ul className="list-none pl-5 text-sm text-black mt-4">
                <li>✔️ Report an emergency through the app.</li>
                <li>✔️ HSO verifies the event and sends alerts.</li>
                <li>✔️ Community receives real-time notifications.</li>
                <li>✔️ Updates are shared as the situation evolves.</li>
              </ul>
            )}
          </div>

          {/* Significance Section */}
          <div className="relative bg-white p-6 rounded-lg shadow-lg transition-transform hover:scale-105 hover:bg-[linear-gradient(120deg,rgba(173,216,230,0.5),rgba(255,255,255,0.5),rgba(0,191,255,0.5))] hover:bg-[length:200%_200%] hover:animate-[moveBackground_8s_linear_infinite]">
            <div className="relative z-10 flex justify-between items-center">
              <h2
                className="text-lg font-semibold text-maroon cursor-pointer hover:text-gold transition-colors"
                onClick={() => toggleContent('significance')}
              >
                Significance of HALA!RMA
              </h2>
              {contentVisible.significance ? (
                <FaChevronUp className="cursor-pointer" onClick={() => toggleContent('significance')} />
              ) : (
                <FaChevronDown className="cursor-pointer" onClick={() => toggleContent('significance')} />
              )}
            </div>
            {contentVisible.significance && (
              <p className="text-sm text-black mt-4">
                HALA!RMA enhances campus safety by providing timely and accurate information, enabling proactive measures
                during emergencies.
              </p>
            )}
          </div>

          {/* Mission Section */}
          <div className="relative bg-white p-6 rounded-lg shadow-lg transition-transform hover:scale-105 hover:bg-[linear-gradient(120deg,rgba(173,216,230,0.5),rgba(255,255,255,0.5),rgba(0,191,255,0.5))] hover:bg-[length:200%_200%] hover:animate-[moveBackground_8s_linear_infinite]">
            <div className="relative z-10 flex justify-between items-center">
              <h2
                className="text-lg font-semibold text-maroon cursor-pointer hover:text-gold transition-colors"
                onClick={() => toggleContent('mission')}
              >
                Our Mission
              </h2>
              {contentVisible.mission ? (
                <FaChevronUp className="cursor-pointer" onClick={() => toggleContent('mission')} />
              ) : (
                <FaChevronDown className="cursor-pointer" onClick={() => toggleContent('mission')} />
              )}
            </div>
            {contentVisible.mission && (
              <p className="text-sm text-black mt-4">
                Our mission is to simplify campus safety communication, ensuring that everyone can stay informed and prepared
                during emergencies.
              </p>
            )}
          </div>

          {/* Contact Section */}
          <div className="relative bg-white p-6 rounded-lg shadow-lg transition-transform hover:scale-105 hover:bg-[linear-gradient(120deg,rgba(173,216,230,0.5),rgba(255,255,255,0.5),rgba(0,191,255,0.5))] hover:bg-[length:200%_200%] hover:animate-[moveBackground_8s_linear_infinite]">
            <div className="relative z-10 flex justify-between items-center">
              <h2
                className="text-lg font-semibold text-maroon cursor-pointer hover:text-gold transition-colors"
                onClick={() => toggleContent('contact')}
              >
                Contact Information
              </h2>
              {contentVisible.contact ? (
                <FaChevronUp className="cursor-pointer" onClick={() => toggleContent('contact')} />
              ) : (
                <FaChevronDown className="cursor-pointer" onClick={() => toggleContent('contact')} />
              )}
            </div>
            {contentVisible.contact && (
              <div className="text-sm text-black mt-4">
                <p>Email: <a href="mailto:support@halarma.com" className="text-blue-500 underline">support@halarma.com</a></p>
                <p>Phone: (123) 456-7890</p>
              </div>
            )}
          </div>

          {/* New Team Section */}
          <div className="relative bg-white p-6 rounded-lg shadow-lg transition-transform hover:scale-105 hover:bg-[linear-gradient(120deg,rgba(173,216,230,0.5),rgba(255,255,255,0.5),rgba(0,191,255,0.5))] hover:bg-[length:200%_200%] hover:animate-[moveBackground_8s_linear_infinite]">
            <div className="relative z-10 flex justify-between items-center">
              <h2
                className="text-lg font-semibold text-maroon cursor-pointer hover:text-gold transition-colors"
                onClick={() => toggleContent('team')}
              >
                Meet the Team
              </h2>
              {contentVisible.team ? (
                <FaChevronUp className="cursor-pointer" onClick={() => toggleContent('team')} />
              ) : (
                <FaChevronDown className="cursor-pointer" onClick={() => toggleContent('team')} />
              )}
            </div>
            {contentVisible.team && (
              <ul className="list-none pl-5 text-sm text-black mt-4">
                <li>✔️ <strong>Bartiana, Fritz</strong> </li>
                <li>✔️ <strong>Mendones, Adrienne S.</strong> </li>
                <li>✔️ <strong>Oreto, Glenn D.</strong> </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
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