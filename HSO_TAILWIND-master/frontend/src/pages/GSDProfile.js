import React, { useState, useEffect, useRef } from 'react';
import { FaUserCircle, FaSearch, FaCog, FaBell, FaFileAlt, FaClipboardList, FaPaintBrush, FaExclamationCircle, FaBars, FaChartBar, FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const GProfile = () => {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState(''); 
  const [email, setEmail] = useState(''); 
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState(() => localStorage.getItem('profilePicture')); 
  const [preview, setPreview] = useState(profilePicture);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const settingsMenuRef = useRef(null); 
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light'); 

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          console.error('User not authenticated:', authError?.message);
          navigate('/login'); 
          return;
        }

        const { data, error } = await supabase
          .from('Account')
          .select('first_name, email')
          .eq('email', user.email)
          .single();

        if (error || !data) {
          console.error('Error fetching user data:', error?.message);
          return;
        }

        setDisplayName(data.first_name || 'N/A');
        setEmail(data.email || 'N/A');
      } catch (error) {
        console.error('Error fetching user information:', error.message);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handlePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
        setPreview(reader.result);
        localStorage.setItem('profilePicture', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsMenuRef.current && !settingsMenuRef.current.contains(event.target)) {
        setShowSettingsMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  const handleSubmit = (event) => {
    event.preventDefault();
    setShowModal(true); 
  };

  const handleConfirmSave = async () => {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
  
      if (authError || !user) {
        console.error('User not authenticated:', authError?.message);
        return;
      }
  
      const { error: updateError } = await supabase
        .from('Account')
        .update({
          first_name: displayName,      
          email: email,                 
          image_url: profilePicture,   
        })
        .eq('email', user.email); 
  
      if (updateError) {
        console.error('Error updating profile:', updateError.message);
        alert('Failed to save changes. Please try again.');
        return;
      }
  

      alert('Profile updated successfully!');
      setShowModal(false); 
      console.log('Updated values:', { displayName, email, profilePicture });
    } catch (error) {
      console.error('Error saving changes:', error.message);
      alert('An unexpected error occurred. Please try again.');
    }
  };
  
  

  const handleCancelSave = () => {
    setShowModal(false); 
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    navigate('/login'); 
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme); 
  };

  return (
    <div className={`flex min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'} overflow-hidden`}>
      <aside
        className={`shadow-md w-64 fixed top-0 left-0 h-full z-10 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
        style={{
          background: theme === 'dark' ? '#2d2d2d' : 'linear-gradient(120deg, #4a0909, #4a0909, #fcd7d4, #610c0c)',
          backgroundSize: '200% 200%',
        }}
      >
        <div className="p-4 text-center border-b border-gray-300">
          <img 
            src="/images/BELL.png" 
            alt="Logo" 
            className="h-12 mx-auto" 
          />
        </div>
        <nav className="mt-6">
          <ul className="space-y-1">
            <li>
              <a 
                onClick={() => navigate('/gsd')} 
                className={`flex items-center px-4 py-2 text-white ${window.location.pathname === '/dashboard' ? 'bg-gray-400' : 'hover:bg-gray-400'} transition-colors duration-300 rounded`}>
                <FaChartBar className="w-5 h-5 mr-2" />
                Dashboard
              </a>
            </li>
            <li>
              <a onClick={() => navigate('/greports')} className={`flex items-center px-4 py-2 text-white ${window.location.pathname === '/reports' ? 'bg-gray-400' : 'hover:bg-gray-400'} transition-colors duration-300 rounded`}>
                <FaExclamationCircle className="w-5 h-5 mr-2" />
                Incident Report
              </a>
            </li>
            <li>
              <a onClick={() => navigate('/gcolor')} className={`flex items-center px-4 py-2 text-white ${window.location.pathname === '/color' ? 'bg-gray-400' : 'hover:bg-gray-400'} transition-colors duration-300 rounded`}>
                <FaPaintBrush className="w-5 h-5 mr-2" />
                Color Wheel Legend
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="flex-1 p-4 md:ml-64 flex flex-col">
        <div className="flex-1 flex flex-col"> 
          <div className={`flex justify-between items-center p-2 rounded-lg shadow mb-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-maroon'}`}>
            <div className="flex items-center">
              <FaSearch className="w-4 h-4 mr-1 text-white" />
              <input
                type="text"
                placeholder="Search"
                className="bg-gray-100 border-0 p-1 rounded-lg flex-grow focus:outline-none focus:ring focus:ring-gray-200 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} 
              />
            </div>
            <div className="flex items-center space-x-2 relative">
              <FaBell className="w-5 h-5 text-white hover:text-yellow-400 cursor-pointer" onClick={() => navigate('/gNotification')} />
              <FaUserCircle className="w-5 h-5 text-white hover:text-yellow-400 cursor-pointer" onClick={() => navigate('/gprofile')} />
              <div className="relative">
                <FaCog className="w-5 h-5 text-white hover:text-yellow-400 cursor-pointer" onClick={() => setShowSettingsMenu(!showSettingsMenu)} />
                {showSettingsMenu && (
                  <div className="absolute right-0 mt-2 bg-white shadow-md rounded-lg z-10" ref={settingsMenuRef}>
                    <ul className="py-2">
                      <li className={`px-4 py-2 ${theme === 'dark' ? 'text-black' : 'text-gray-800'} hover:bg-gray-200 cursor-pointer`} onClick={() => navigate('/gsettings')}>Settings</li>
                      <li className={`px-4 py-2 ${theme === 'dark' ? 'text-black' : 'text-gray-800'} hover:bg-gray-200 cursor-pointer`} onClick={() => navigate('/ghelp')}>Help</li>
                      <li className={`px-4 py-2 ${theme === 'dark' ? 'text-black' : 'text-gray-800'} hover:bg-gray-200 cursor-pointer`} onClick={handleLogout}>Logout</li>
                    </ul>
                  </div>
                )}
              </div>
              <FaBars className="w-5 h-5 text-white hover:text-yellow-400 cursor-pointer md:hidden" onClick={() => setIsOpen(!isOpen)} />
            </div>
          </div>

          <div className={`flex-grow p-6 border border-black rounded-lg shadow-md overflow-y-auto ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} text-black`}>
            <h1 className={`text-2xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Information Display</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Profile Preview"
                      className="w-24 h-24 rounded-full border border-black object-cover" 
                    />
                  ) : (
                    <FaUserCircle className="w-24 h-24 text-gray-300" />
                  )}
                  <label htmlFor="profile-picture" className="absolute bottom-0 right-0 bg-gray-700 rounded-full p-1 cursor-pointer">
                    <FaEdit className="text-white w-5 h-5" />
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    id="profile-picture"
                    onChange={handlePictureChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                <div>
                  <p className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{displayName}</p>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-black'}`}>{email}</p>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-black'} cursor-pointer`} onClick={() => navigate('/gsettings')}>
                    Go to Settings
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-gray-400 mb-1" htmlFor="display-name">Display Name</label>
                <input
                  type="text"
                  id="display-name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-gray-200 text-sm ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1" htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-gray-200 text-sm ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
                />
              </div>

              <button type="submit" className={`mt-4 px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-maroon text-white'}`}>
                Save Changes
              </button>
            </form>
          </div>
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-md w-1/3">
            <h2 className="text-xl font-semibold mb-4">Confirm Changes</h2>
            <p>Are you sure you want to save these changes?</p>
            <div className="flex justify-between mt-4">
              <button onClick={handleConfirmSave} className="px-4 py-2 bg-green-500 text-white rounded-lg">
                Yes, Save
              </button>
              <button onClick={handleCancelSave} className="px-4 py-2 bg-red-500 text-white rounded-lg">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GProfile;
