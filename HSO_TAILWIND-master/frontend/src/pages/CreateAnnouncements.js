import React, { useState, useEffect, useRef } from 'react';
import { FaUserCircle, FaSearch, FaCog, FaBell, FaFileAlt, FaClipboardList, FaPaintBrush, FaExclamationCircle, FaBars, FaChartBar, FaChartLine } from 'react-icons/fa'; 
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function CreateAnnouncements() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [announcementTitle, setAnnouncementTitle] = useState(""); // State for announcement title
  const [announcement, setAnnouncement] = useState("");
  const [images, setImages] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const [showPostConfirmation, setShowPostConfirmation] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const settingsMenuRef = useRef(null);
  
  async function uploadImage(file) {
    const { data, error } = await supabase.storage
      .from('IMAGES')
      .upload('Announcements/' + file.name, file);
    
    if (error) {
      console.error("Error uploading image:", error);
      return;
    }
    
    console.log('Image uploaded:', data);
  }

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

  const handleLogout = () => {
    navigate('/login');
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    const validImages = files.filter(file => file.size <= 5 * 1024 * 1024 && file.type.startsWith('image/')); // Check size and type
    if (validImages.length < files.length) {
      alert('Some files are invalid (either too large or not images).');
    }
    setImages(prevImages => [...prevImages, ...validImages]);
  };
  

  const handleAnnouncementChange = (event) => {
    setAnnouncement(event.target.value);
  };

  const handleTitleChange = (event) => { // Handle title input change
    setAnnouncementTitle(event.target.value);
  };

  const handleColorChange = (event) => {
    setSelectedColor(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setShowPostConfirmation(true);
  };

  const confirmPost = async () => {
    try {
      // Call the function to insert announcement data
      const result = await postAnnouncement();
      if (!result || result.error) {  // Check if result or result.error exists
        alert(`Failed to post announcement: ${result ? result.error.message : 'Unknown error'}`);
      } else {
        alert('Announcement posted successfully!');
        resetForm();
        setShowPostConfirmation(false);
        navigate('/dashboard');
      }
    } catch (error) {
      alert(`An error occurred: ${error.message}`);
    }
  };
  
  const postAnnouncement = async () => {
    try {
      // Get the current user from Supabase
      const response = await supabase.auth.getUser();
  
      // Check for any errors in retrieving user data
      if (response.error) {
        console.error('Authentication error:', response.error.message);
        return { error: response.error }; 
      }
  
      const user = response.data?.user;
  
     
      if (!user) {
        console.error('User not authenticated.');
        return { error: { message: 'User not authenticated.' } }; 
      }
  
     
      const { data: announcementData, error: insertError } = await supabase
        .from('announcements')
        .insert([
          {
            title: announcementTitle,
            content: announcement,
            created_by: user.id, 
            color: selectedColor,
            images: images.map((image) => image.name), 
            created_at: new Date().toISOString(),
          },
        ]);

    
      if (insertError) {
        console.error('Error posting announcement:', insertError.message);
        return { error: insertError };
      }
  
      console.log('Announcement posted successfully:', announcementData);
    
      return { data: announcementData };
    } catch (error) {
      console.error('Unexpected error:', error.message);
      return { error: { message: error.message } }; 
    }
  };
  
  
  
  const cancelPost = () => {
    setShowPostConfirmation(false);
  };

  const handleCancel = () => {
    setShowCancelConfirmation(true);
  };

  const confirmCancel = () => {
    resetForm();
    setShowCancelConfirmation(false);
    navigate('/dashboard'); 
  };

  const cancelCancel = () => {
    setShowCancelConfirmation(false);
  };

  const resetForm = () => {
    setAnnouncementTitle(""); // Reset title
    setAnnouncement("");
    setImages([]);
    setSelectedColor("");
  };

  const removeImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const textColor = {
    red: 'text-red-600',
    orange: 'text-orange-600',
    yellow: 'text-yellow-600',
    green: 'text-green-600',
    blue: 'text-blue-600',
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <div className={`flex min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'} overflow-hidden`}>
      {/* Sidebar */}
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
                onClick={() => navigate('/dashboard')} 
                className={`flex items-center px-4 py-2 text-white ${window.location.pathname === '/dashboard' ? 'bg-gray-400' : 'hover:bg-gray-400'} transition-colors duration-300 rounded`}>
                <FaChartBar className="w-5 h-5 mr-2" />
                Dashboard
              </a>
            </li>
            <li>
              <a onClick={() => navigate('/reports')} className={`flex items-center px-4 py-2 text-white ${window.location.pathname === '/reports' ? 'bg-gray-400' : 'hover:bg-gray-400'} transition-colors duration-300 rounded`}>
                <FaExclamationCircle className="w-5 h-5 mr-2" />
                Incident Report
              </a>
            </li>
            <li>
              <a 
                onClick={() => navigate('/create')} 
                className={`flex items-center px-4 py-2 text-white ${window.location.pathname === '/create' ? 'bg-gray-400' : 'hover:bg-gray-400'} transition-colors duration-300 rounded`}>
                <FaFileAlt className="w-5 h-5 mr-2" />
                Create Announcements
              </a>
            </li>
            <li>
              <a onClick={() => navigate('/upload')} className={`flex items-center px-4 py-2 text-white ${window.location.pathname === '/upload' ? 'bg-gray-400' : 'hover:bg-gray-400'} transition-colors duration-300 rounded`}>
                <FaClipboardList className="w-5 h-5 mr-2" />
                Upload Programs
              </a>
            </li>
            <li>
              <a onClick={() => navigate('/color')} className={`flex items-center px-4 py-2 text-white ${window.location.pathname === '/color' ? 'bg-gray-400' : 'hover:bg-gray-400'} transition-colors duration-300 rounded`}>
                <FaPaintBrush className="w-5 h-5 mr-2" />
                Color Wheel Legend
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 md:ml-64 flex flex-col">
        {/* Search bar and user settings */}
        <div className={`flex justify-between items-center ${theme === 'dark' ? 'bg-gray-700 text-black-700' : 'bg-maroon text-white'} p-2 rounded-lg shadow mb-4`}>
          <div className="flex items-center">
            <FaSearch className="w-4 h-4 mr-1 text-white" />
            <input
              type="text"
              placeholder="Search"
              className="bg-gray-100 border-0 p-1 rounded-lg flex-grow focus:outline-none focus:ring focus:ring-gray-200 text-sm"
            />
          </div>
          <div className="flex items-center space-x-2 relative">
            <FaChartLine className="w-5 h-5 text-white hover:text-yellow-400 cursor-pointer" onClick={() => navigate('/analytics')} />
            <FaBell className="w-5 h-5 text-white hover:text-yellow-400 cursor-pointer" />
            <FaUserCircle 
                className="w-5 h-5 text-white hover:text-yellow-400 cursor-pointer" 
                onClick={() => navigate('/profile')} 
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
                  <li className={`px-4 py-2 ${theme === 'dark' ? 'text-black' : 'text-gray-800'} hover:bg-gray-200 cursor-pointer`} onClick={() => navigate('/help')}>Help</li>
                  <li className={`px-4 py-2 ${theme === 'dark' ? 'text-black' : 'text-gray-800'} hover:bg-gray-200 cursor-pointer`} onClick={handleLogout}>Logout</li>
                </ul>
              </div>
            )}
            </div>
            <FaBars className="w-5 h-5 text-white hover:text-yellow-400 cursor-pointer md:hidden" onClick={() => setIsOpen(!isOpen)} />
          </div>
        </div>

        {/* Create Announcement Form */}
        <div className={`bg-gray-50 p-6 rounded-lg shadow-md border border-gray-500 flex-grow flex flex-col ${theme === 'dark' ? 'bg-gray-800 text-white' : ''}`} style={{ height: '500px', overflowY: 'auto' }}>
          <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-maroon'}`}>Create Announcement</h2>
          <form onSubmit={handleSubmit} className="space-y-4 flex-grow">
            <div>
              <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>Title:</label>
              <input 
                type="text"
                className={`border rounded-lg w-full p-2 text-sm border-gray-400 ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-700'}`}
                value={announcementTitle}
                onChange={handleTitleChange} // Handle title input change
                required
              />
            </div>
            <div>
              <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>Announcement:</label>
              <textarea 
                className={`border rounded-lg w-full p-2 text-sm flex-grow h-48 mb-2 border border-blue-300 ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'}`} 
                value={announcement}
                onChange={handleAnnouncementChange}
                required
              />
            </div>
            <div>
              <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>Upload Image:</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange} 
                className="border rounded-lg w-full border-gray-400 p-4 text-sm" 
                multiple 
              />
              <div className={`mt-2 text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-500'}`}>
                {images.length > 0 ? `${images.length} files selected` : 'No files chosen'}
              </div>
            </div>

            {/* Display uploaded images */}
            <div className="mt-4">
              {images.length > 0 && (
                <div>
                  <h3 className={`text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>Uploaded Images:</h3>
                  <ul className="list-disc pl-5">
                    {images.map((file, index) => (
                      <li key={index} className="flex justify-between items-center mb-2">
                        <span>{file.name}</span>
                        <button type="button" onClick={() => removeImage(index)} className="text-red-500 hover:underline">Remove</button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex-grow">
                <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>Select Color Code:</label>
                <select 
                  className={`border rounded-lg w-full border-gray-400 ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-700'} p-3 text-sm`} 
                  value={selectedColor} 
                  onChange={handleColorChange}
                  required 
                >
                  <option value="" disabled>Select Color</option>
                  <option value="red" className="text-red-600">Red - Important</option>
                  <option value="orange" className="text-orange-600">Orange - Urgent</option>
                  <option value="yellow" className="text-yellow-600">Yellow - Warning</option>
                  <option value="green" className="text-green-600">Green - General Info</option>
                  <option value="blue" className="text-blue-600">Blue - Informational</option>
                </select>
              </div>
              <button 
                className="mt-8 h-10 px-2 bg-blue-500 text-white rounded hover:bg-blue-600 ml-6 text-sm" // Adjust height only
                onClick={() => navigate('/color')} 
              >
                View Color Legend
              </button>
            </div>

            <div className="flex justify-between mt-2">
              <button 
                type="button" 
                onClick={handleCancel} 
                className="px-4 mt-4 py-4 bg-gray-400 text-white rounded hover:bg-gray-500 transition duration-300"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className={`px-2 mt-4 py-2 bg-maroon text-white rounded-lg transition duration-300 ${selectedColor && announcement && announcementTitle ? '' : 'bg-gray-400 text-gray-600 cursor-not-allowed'}`}
                disabled={!selectedColor || !announcement || !announcementTitle} 
              >
                Post Announcement
              </button>
            </div>
          </form>
        </div>

        {/* Cancel Confirmation Modal */}
        {showCancelConfirmation && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded-lg">
              <p>Are you sure you want to cancel the announcement?</p>
              <div className="flex justify-end mt-4">
                <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded mr-2" onClick={cancelCancel}>No</button>
                <button className="px-4 py-2 bg-red-500 text-white rounded" onClick={confirmCancel}>Yes</button>
              </div>
            </div>
          </div>
        )}

        {/* Post Confirmation Modal */}
        {showPostConfirmation && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded-lg">
              <p>Are you sure you want to post this announcement?</p>
              <div className="flex justify-end mt-4">
                <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded mr-2" onClick={cancelPost}>No</button>
                <button className="px-4 py-2 bg-green-500 text-white rounded" onClick={confirmPost}>Yes</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

  