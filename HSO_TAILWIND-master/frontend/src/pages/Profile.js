import React, { useState, useEffect, useRef } from 'react';
import { FaUserCircle, FaSearch, FaCog, FaBell, FaFileAlt, FaClipboardList, FaPaintBrush, FaExclamationCircle, FaBars, FaChartBar, FaEdit, FaChartLine } from 'react-icons/fa'; 
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState(() => localStorage.getItem('displayName') || 'Health and Safety Office'); // Default Display Name
  const [email, setEmail] = useState(() => localStorage.getItem('email') || 'mseufhso@gmail.com'); // Default Email
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState(() => localStorage.getItem('profilePicture')); // Load from local storage
  const [preview, setPreview] = useState(profilePicture);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const settingsMenuRef = useRef(null); // Define the ref for the settings menu
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light'); // Theme state

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

  const handlePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result); // Save the image as Base64
        setPreview(reader.result);
        localStorage.setItem('profilePicture', reader.result); // Save to local storage
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setShowModal(true); // Show the confirmation modal
  };

  const handleConfirmSave = () => {
    // Save changes to local storage
    localStorage.setItem('displayName', displayName);
    localStorage.setItem('email', email);
    
    // Handle actual save logic here (for display name and email)
    console.log({ displayName, email, currentPassword, newPassword });
    setShowModal(false); // Close the modal after saving
  };

  const handleCancelSave = () => {
    setShowModal(false); // Close the modal without saving
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken'); // Adjust as necessary for your auth method
    navigate('/login'); // Redirect to login page
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme); // Update the attribute in the HTML
  };

  return (
    <div className={`flex min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'} overflow-hidden`}>
      {/* Sidebar */}
      <aside
        className={`shadow-md w-64 fixed top-0 left-0 h-full z-10 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
        style={{
          background: theme === 'dark' ? '#2d2d2d' : 'linear-gradient(120deg, #4a0909, #4a0909, #fcd7d4, #610c0c)',
          backgroundSize: '200% 200%',
        }}
      >
        <div className="p-4 text-center border-b border-black"> {/* Set border color to black */}
          <img 
            src="/images/BELL.png" 
            alt="Logo" 
            className={`h-12 mx-auto`} 
          />
        </div>
        <nav className="mt-6">
          <ul className="space-y-1">
            <li>
              <a onClick={() => navigate('/dashboard')} className="flex items-center px-4 py-2 text-white hover:bg-gray-400 transition-colors duration-300 rounded">
                <FaChartBar className="w-5 h-5 mr-2" />
                Dashboard
              </a>
            </li>
            <li>
              <a onClick={() => navigate('/reports')} className="flex items-center px-4 py-2 text-white hover:bg-gray-400 transition-colors duration-300 rounded">
                <FaExclamationCircle className="w-5 h-5 mr-2" />
                Incident Report
              </a>
            </li>
            <li>
              <a onClick={() => navigate('/create')} className="flex items-center px-4 py-2 text-white hover:bg-gray-400 transition-colors duration-300 rounded">
                <FaFileAlt className="w-5 h-5 mr-2" />
                Create Announcements
              </a>
            </li>
            <li>
              <a onClick={() => navigate('/upload')} className="flex items-center px-4 py-2 text-white hover:bg-gray-400 transition-colors duration-300 rounded">
                <FaClipboardList className="w-5 h-5 mr-2" />
                Upload Programs
              </a>
            </li>
            <li>
              <a onClick={() => navigate('/color')} className="flex items-center px-4 py-2 text-white hover:bg-gray-400 transition-colors duration-300 rounded">
                <FaPaintBrush className="w-5 h-5 mr-2" />
                Color Wheel Legend
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 md:ml-64 flex flex-col">
        <div className="flex-1 flex flex-col"> {/* Ensure this container can grow */}
          {/* Navbar */}
          <div className={`flex justify-between items-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-maroon'} p-2 rounded-lg shadow mb-4`}>
            <div className="flex items-center">
              <FaSearch className="w-4 h-4 mr-1 text-white" />
              <input
                type="text"
                placeholder="Search"
                className={`bg-gray-100 border-0 p-1 rounded-lg flex-grow focus:outline-none focus:ring focus:ring-gray-200 text-sm ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} // Update search term
              />
            </div>
            <div className="flex items-center space-x-2 relative">
              <FaChartLine className="w-5 h-5 text-white hover:text-yellow-400 cursor-pointer" onClick={() => navigate('/analytics')} />
              <FaBell className="w-5 h-5 text-white hover:text-yellow-400 cursor-pointer" />
              <FaUserCircle 
                className="w-5 h-5 text-white hover:text-yellow-400 cursor-pointer" 
                onClick={() => navigate('/profile')} // Navigate to profile on click
              />
              <div className="relative">
                <FaCog 
                  className="w-5 h-5 text-white hover:text-yellow-400 cursor-pointer" 
                  onClick={() => setShowSettingsMenu(!showSettingsMenu)} 
                />
                {showSettingsMenu && (
                  <div className="absolute right-0 mt-2 bg-white shadow-md rounded-lg z-10" ref={settingsMenuRef}>
                    <ul className="py-2">
                      <li className={`px-4 py-2 ${theme === 'dark' ? 'text-black' : 'text-gray-800'} hover:bg-gray-200 cursor-pointer`} onClick={() => navigate('/settings')}>Settings</li>
                      <li className={`px-4 py-2 ${theme === 'dark' ? 'text-black' : 'text-gray-800'} hover:bg-gray-200 cursor-pointer`}>Help</li>
                      <li className={`px-4 py-2 ${theme === 'dark' ? 'text-black' : 'text-gray-800'} hover:bg-gray-200 cursor-pointer`} onClick={handleLogout}>Logout</li>
                    </ul>
                  </div>
                )}
              </div>
              <FaBars className="w-5 h-5 text-white hover:text-yellow-400 cursor-pointer md:hidden" onClick={() => setIsOpen(!isOpen)} />
            </div>
          </div>

          {/* Profile Settings Form */}
          <div className={`flex-grow p-6 border border-black rounded-lg shadow-md overflow-y-auto ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} text-black`}>
            <h1 className={`text-2xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Information Display</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Profile Picture Section */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Profile Preview"
                      className="w-24 h-24 rounded-full border border-black object-cover" // Change border color to black
                    />
                  ) : (
                    <FaUserCircle className="w-24 h-24 text-gray-300" />
                  )}
                  {/* Edit Icon */}
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
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-black'} cursor-pointer`} onClick={() => navigate('/settings')}>
                    Go to Settings
                  </p>
                </div>
              </div>

              {/* Display Name Section */}
              <div>
                <label className="block text-gray-400 mb-1" htmlFor="display-name">Display Name</label>
                <input
                  type="text"
                  id="display-name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className={`w-full p-2 border border-black rounded focus:outline-none focus:ring focus:ring-blue-200 ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`} // Set border color to black in default mode
                  required
                />
              </div>

              {/* Email Section */}
              <div>
                <label className="block text-gray-400 mb-1" htmlFor="email">Email address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full p-2 border border-black rounded focus:outline-none focus:ring focus:ring-blue-200 ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`} // Set border color to black in default mode
                  required
                />
              </div>

              {/* Password Change Section */}
              <h2 className={`text-lg font-semibold mt-6 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Change Password</h2>
              <div>
                <label className="block text-gray-400 mb-1" htmlFor="current-password">Current Password</label>
                <input
                  type="password"
                  id="current-password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className={`w-full p-2 border border-black rounded focus:outline-none focus:ring focus:ring-blue-200 ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`} // Set border color to black in default mode
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1" htmlFor="new-password">New Password</label>
                <input
                  type="password"
                  id="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={`w-full p-2 border border-black rounded focus:outline-none focus:ring focus:ring-blue-200 ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`} // Set border color to black in default mode
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1" htmlFor="confirm-password">Confirm Password</label>
                <input
                  type="password"
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full p-2 border border-black rounded focus:outline-none focus:ring focus:ring-blue-200 ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`} // Set border color to black in default mode
                />
              </div>

              {/* Submit Button */}
              <button type="submit" className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition duration-200">
                Save Changes
              </button>
            </form>
          </div>

          {/* Confirmation Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-sm mx-auto">
                <h2 className="text-lg font-semibold mb-4 text-black">Confirm Changes</h2> {/* Change text color to black */}
                <p className="text-black">Are you sure you want to save these changes?</p> {/* Change text color to black */}
                <div className="flex justify-end mt-4">
                  <button onClick={handleCancelSave} className="mr-2 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">Cancel</button>
                  <button onClick={handleConfirmSave} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Confirm</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Profile;

//