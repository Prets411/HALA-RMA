import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [shake, setShake] = useState(false);
  const [otp, setOtp] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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

  const handleNavClick = (path) => {
    navigate(`/${path}`);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase
      .from('Account')
      .select('email')
      .eq('email', email)
      .single();

    if (error || !data) {
      setErrorMessage('This email is not registered. Please check the email.');
      return;
    }

    const { otpError } = await supabase.auth.signInWithOtp({ email });

    if (otpError) {
      console.error('Error sending OTP:', otpError.message);
      setErrorMessage('Error sending OTP, please try again.');
    } else {
      setOtpSent(true);
      setErrorMessage('');
    }
  };

  const handleOtpSubmit = async (e, otp) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email',
      });

      if (error) {
        console.error('Error verifying OTP:', error.message);
        setErrorMessage('Invalid OTP. Please try again.');
        return;
      }

      const { data, error: userError } = await supabase
        .from('Account')
        .select('user_type')
        .eq('email', email)
        .single();

      if (userError || !data) {
        console.error('Error fetching user data:', userError?.message);
        setErrorMessage('Error fetching user data. Please try again.');
        return;
      }

      if (data.user_type === 'Admin') {
        navigate('/dashboard');
      } else if (data.user_type === 'GSD') {
        navigate('/gsd');
      } else if (data.user_type === 'MDS') {
        navigate('/mds');
      } else {
        setErrorMessage('Unauthorized access: User not allowed.');
      }
    } catch (error) {
      console.error('OTP verification failed:', error.message);
      setErrorMessage('An unexpected error occurred. Please try again.');
    }
  };

  const goBack = () => {
    setOtpSent(false);
    setErrorMessage('');
  };

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

  const isActive = (path) => window.location.pathname === path;

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center bg-[length:200%_200%] animate-gradientMove"
      style={{
        background: 'linear-gradient(120deg, #4a0909, #ffffff, #610c0c)',
        backgroundSize: '200% 200%',
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
            <Link to="/" style={navLinkStyle(isActive('/'))}>
              Home
            </Link>
            <Link to="/about" style={navLinkStyle(isActive('/about'))}>
              About
            </Link>
            <Link to="/login" style={navLinkStyle(isActive('/login'))}>
              Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-maroon focus:outline-none">
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
            <Link to="/" onClick={() => setIsOpen(false)} style={navLinkStyle(isActive('/'))}>
              Home
            </Link>
            <Link to="/about" onClick={() => setIsOpen(false)} style={navLinkStyle(isActive('/about'))}>
              About
            </Link>
            <Link to="/login" onClick={() => setIsOpen(false)} style={navLinkStyle(isActive('/login'))}>
              Login
            </Link>
          </div>
        )}
      </nav>

      {/* Main Container */}
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-xl overflow-hidden flex flex-col md:flex-row mt-16">
        {/* Left Section */}
        <div className="w-full md:w-3/5 bg-maroon text-white flex flex-col justify-center items-center p-10">
          <div className="w-full max-w-sm">
            <img src="/images/HAL RMA.png" alt="HALA!RMA Logo" className="max-h-48 mb-6" />
            <h3 className="text-lg md:text-1xl font-bold mb-4 whitespace-nowrap">
              <span className="text-blue-400">Simplify</span>, <span className="text-yellow-500">Inform</span>,{' '}
              <span className="text-orange-400">Empower</span>: Your Information Solution.
            </h3>
            <p className="text-sm leading-2 text-white text-justify">
              HALA!RMA is an application designed for the Health and Safety Office, facilitating prompt information dissemination during critical events or unforeseen emergencies. It offers real-time updates to the university community, ensuring timely responses and enhanced safety measures campus-wide.
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-2/5 bg-white flex flex-col justify-center items-center p-10">
          <h2 className="text-2xl text-maroon font-bold mb-8 shadow-text">Welcome Back, <span className="text-yellow-500">ADMIN!</span></h2>

          {errorMessage && (
            <div className="w-full max-w-sm p-4 mb-4 text-red-500 bg-red-100 rounded-md">
              <strong>{errorMessage}</strong>
              </div>
            )}

          {!otpSent ? (
            <form className="w-full max-w-sm" onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email:"
                className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                className="w-full bg-yellow-500 text-white p-3 rounded-md hover:bg-yellow-400"
              >
                Send OTP
              </button>
            </form>
          ) : (
            <div>
              <h3 className="text-lg mb-4">Enter the OTP sent to your email</h3>
              <form className="w-full max-w-sm" onSubmit={(e) => handleOtpSubmit(e, otp)}>
                <input
                  type="text"
                  placeholder="OTP:"
                  className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-yellow-500 text-white p-3 rounded-md hover:bg-yellow-400"
                >
                  Submit OTP
                </button>
              </form>
                        {/* Show the "Back" button if there is an error message */}
          {errorMessage && (
            <button
              onClick={goBack}
              className="w-full mt-4 bg-red-500 text-white p-3 rounded-md hover:bg-red-400"
            >
              Back to Email Entry
            </button>
          )}
            </div>
            
          )}

        </div>
      </div>
    </div>
  );
}


// Adding the keyframe animation for diagonal movement
const style = document.createElement('style');

style.innerHTML = `
  @keyframes gradientMove {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  .animate-gradientMove {
    animation: gradientMove 10s ease infinite;
  }
`;

document.head.appendChild(style);

//