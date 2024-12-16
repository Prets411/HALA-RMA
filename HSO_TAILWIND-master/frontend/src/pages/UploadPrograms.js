import React, { useState, useEffect, useRef } from 'react';
import { FaUserCircle, FaSearch, FaCog, FaBell, FaFileAlt, FaClipboardList, FaPaintBrush, FaExclamationCircle, FaBars, FaChartBar, FaChartLine } from 'react-icons/fa'; 
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function UploadPrograms() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [who, setWho] = useState(""); 
  const [what, setWhat] = useState(""); 
  const [whenDate, setWhenDate] = useState(""); 
  const [whenTime, setWhenTime] = useState(""); 
  const [where, setWhere] = useState(""); 
  const [otherLocation, setOtherLocation] = useState(""); 
  const [images, setImages] = useState([]); 
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const [showPostConfirmation, setShowPostConfirmation] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const settingsMenuRef = useRef(null);
  const [additionalText, setAdditionalText] = useState("");

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

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleLogout = () => {
    navigate('/login');
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    setImages((prevImages) => [...prevImages, ...files]);
  };

  const handleWhoChange = (event) => {
    setWho(event.target.value);
  };

  const handleWhatChange = (event) => {
    setWhat(event.target.value);
  };

  const handleWhenDateChange = (event) => {
    const dateValue = event.target.value;
    const isValidDateFormat = /^\d{4}-\d{2}-\d{2}$/.test(dateValue);
    const year = dateValue.split('-')[0]; 
    if (isValidDateFormat && year.length === 4) {
      setWhenDate(dateValue);
    }
  };

  const handleWhenTimeChange = (event) => {
    setWhenTime(event.target.value);
  };

  const handleWhereChange = (event) => {
    setWhere(event.target.value);
    if (event.target.value !== "Others") {
      setOtherLocation(""); // Reset otherLocation when a different option is selected
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setShowPostConfirmation(true);
  };

  const handleAdditionalTextChange = (event) => {
    setAdditionalText(event.target.value); // Update state when text input changes
  };
  const postDataToSupabase = async () => {
    try {
      // Upload images to Supabase Storage
      const uploadedImageUrls = await uploadImages(images);
    
      // Insert the program data into Supabase table
      const { error } = await supabase
        .from('programs')
        .insert([
          {
            who,
            what,
            when_date: whenDate,
            when_time: whenTime,
            where: where === "Others" ? otherLocation : where,
            forms: additionalText,
            images: uploadedImageUrls, // Store uploaded image URLs as an array
            created_at: new Date().toISOString(),
            color: 'blue', // Default color value
          },
        ]);
    
      if (error) throw error;
    
      // Reset the form after successful submission
      alert('Program uploaded successfully!');
      resetForm();
      setShowPostConfirmation(false);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error posting data:', error.message);
      alert('Error posting program: ' + error.message);
    }
  };
  

  const uploadImages = async (files) => {
    const imageUrls = [];
    for (let file of files) {
      const filePath = `Programs/${Date.now()}_${file.name}`; // Upload path under "IMAGES/Programs/"
  
      // Upload the image to Supabase Storage
      const { error } = await supabase.storage
        .from('IMAGES') // Correct bucket name
        .upload(filePath, file);
  
      if (error) {
        console.error('Error uploading image:', error.message);
      } else {
        // Retrieve the public URL of the uploaded file
        const { data } = supabase.storage
          .from('IMAGES')
          .getPublicUrl(filePath);
  
        if (data) {
          imageUrls.push(data.publicUrl);
        }
      }
    }
    return imageUrls;
  };

  const confirmPost = () => {
    postDataToSupabase();
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
    setWho("");
    setWhat("");
    setWhenDate("");
    setWhenTime("");
    setWhere("");
    setOtherLocation(""); // Reset otherLocation
    setImages([]); 
  };

  const removeImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index)); 
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
            <FaBell className="w-5 h-5 text-white hover:text-yellow-400 cursor-pointer" onClick={() => navigate('/Notification')} />
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

        {/* Upload Program Form */}
        <div className={`bg-gray-50 p-6 rounded-lg shadow-md border border-gray-500 flex-grow flex flex-col ${theme === 'dark' ? 'bg-gray-800 text-white' : ''}`} style={{ height: '500px', overflowY: 'auto' }}>
          <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-maroon'}`}>Upload Program</h2>
          <form onSubmit={handleSubmit} className="space-y-4 flex-grow">
            <div>
              <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>WHO:</label>
              <textarea 
                className={`border rounded-lg w-full p-2 text-sm flex-grow h-20 mb-2 border border-blue-300 ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
                value={who}
                onChange={handleWhoChange}
                required
              />
            </div>
            <div>
              <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>WHAT:</label>
              <textarea 
                className={`border rounded-lg w-full p-2 text-sm flex-grow h-20 mb-2 border border-blue-300 ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
                value={what}
                onChange={handleWhatChange}
                required
              />
            </div>
            <div>
              <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>WHEN:</label>
              <div className="flex space-x-2">
                <input 
                  type="date"
                  value={whenDate}
                  onChange={handleWhenDateChange}
                  className={`border rounded-lg p-2 w-full ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
                  required
                />
                <input 
                  type="time"
                  value={whenTime}
                  onChange={handleWhenTimeChange}
                  className={`border rounded-lg p-2 w-full ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
                  required
                />
              </div>
            </div>
            <div>
              <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>WHERE:</label>
              <select 
                className={`border rounded-lg w-full border-gray-400 p-3 text-sm ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
                value={where} 
                onChange={handleWhereChange}
                required
              >
                <option value="" disabled>Select Campus Area</option>
                <option value="Main Campus">Main Campus</option>
                <option value="Gymnasium">Gymnasium</option>
                <option value="Basic Education Building">Basic Education Building</option>
                <option value="Library">Library</option>
                <option value="St. Bonaventure Student Center">St. Bonaventure Student Center</option>
                <option value="Student Lounge">Student Lounge</option>
                <option value="AEC Little Theater">AEC Little Theater</option>
                <option value="Others">Others</option> {/* Add Others option */}
              </select>
              {where === "others" && ( // Conditional rendering of input when "Others" is selected
                <input 
                  type="text"
                  value={otherLocation}
                  onChange={(e) => setOtherLocation(e.target.value)}
                  placeholder="Specify other location"
                  className={`mt-2 border rounded-lg w-full p-2 ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
                />
              )}
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
            <div>
            <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>Forms:</label>
            <textarea
              className={`border rounded-lg w-full p-2 text-sm flex-grow h-20 border border-blue-300 ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
              value={additionalText}
              onChange={handleAdditionalTextChange} // Handle text input change
              placeholder="Enter additional details or notes here..."
            />
          </div>
            <div className="flex justify-between mt-2">
              <button 
                type="button" 
                onClick={handleCancel} 
                className="px-4 mt-2 py-4 bg-gray-400 text-white rounded hover:bg-gray-500 transition duration-300"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className={`px-2 mt-2 py-2 bg-maroon text-white rounded-lg transition duration-300 ${who && what && whenDate && whenTime && where ? '' : 'bg-gray-400 text-gray-600 cursor-not-allowed'}`}
                disabled={!who || !what || !whenDate || !whenTime || !where} 
              >
                Upload Program
              </button>
            </div>
          </form>
        </div>

        {/* Cancel Confirmation Modal */}
        {showCancelConfirmation && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded-lg">
              <p>Are you sure you want to cancel the program upload?</p>
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
              <p>Are you sure you want to post this program?</p>
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

