import React, { useState, useEffect, useRef } from 'react';
import { FaUserCircle, FaSearch, FaCog, FaBell, FaFileAlt, FaClipboardList, FaPaintBrush, FaExclamationCircle, FaBars, FaChartBar, FaSort, FaChartLine } from 'react-icons/fa'; 
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function GIncidentReport() {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location
  const [isOpen, setIsOpen] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const settingsMenuRef = useRef(null);
  const modalRef = useRef(null);
  const filterMenuRef = useRef(null);

  // State for search term and selected status
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All"); // Default is All

  // State for incident reports
  const [incidentReports, setIncidentReports] = useState([]);

  useEffect(() => {
    // Fetch incident reports from Supabase with filters
    const fetchReports = async () => {
      try {
        const { data, error } = await supabase
          .from('incidents')
          .select('*')
          .eq('status', 'Ongoing') // Only fetch reports with status 'Ongoing'
          .eq('office', 'General Services Department'); // Only fetch reports for 'General Services Department'
  
        if (error) throw error;
  
        setIncidentReports(data);
      } catch (err) {
        console.error('Error fetching incident reports:', err);
      }
    };
  
    fetchReports();
  }, []);
  

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsMenuRef.current && !settingsMenuRef.current.contains(event.target)) {
        setShowSettingsMenu(false);
      }
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeImageModal(); // Close modal if clicked outside
      }
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target)) {
        setShowFilterMenu(false); // Close filter menu if clicked outside
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

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setSelectedImage(null);
  };

  const handleDepartmentChange = (index, value) => {
    const updatedReports = [...incidentReports];
    updatedReports[index].selectedDepartment = value;   
    setIncidentReports(updatedReports);
  };

  const handleSendReport = async (reportId) => {
    try {
      // Update the incident's status to 'Resolved' and office to 'Health and Safety Office'
      const { error } = await supabase
        .from('incidents')
        .update({
          status: 'Resolved',
          office: 'Health and Safety Office',
        })
        .eq('id', reportId);

      if (error) throw error;

      // Update the local state to reflect the change
      setIncidentReports(prevReports =>
        prevReports.filter(report => report.id !== reportId) // Remove the resolved report
      );

      alert(`Report ${reportId} marked as Resolved.`);
    } catch (err) {
      console.error('Error updating incident report:', err);
      alert('Error updating the report. Please try again.');
    }
  };

  const filteredReports = incidentReports.filter(report => {
    // Ensure the fields are not undefined before calling toLowerCase()
    const matchesSearchTerm =
      (report.name && report.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (report.location && report.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (report.description && report.description.toLowerCase().includes(searchTerm.toLowerCase()));
  
    const matchesStatus = selectedStatus === "All" || report.status === selectedStatus;
  
    return matchesSearchTerm && matchesStatus;
  });

  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
    setShowFilterMenu(false); // Close the filter menu after selecting
  };

  const handleSort = () => {
    // Implement sorting logic here
    const sortedReports = [...incidentReports].sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
    setIncidentReports(sortedReports);
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
                onClick={() => navigate('/gsd')} 
                className={`flex items-center px-4 py-2 text-white ${location.pathname === '/dashboard' ? 'bg-gray-400' : 'hover:bg-gray-400'} transition-colors duration-300 rounded`}>
                <FaChartBar className="w-5 h-5 mr-2" />
                Dashboard
              </a>
            </li>
            <li>
              <a onClick={() => navigate('/greports')} className={`flex items-center px-4 py-2 text-white ${location.pathname === '/reports' ? 'bg-gray-400' : 'hover:bg-gray-400'} transition-colors duration-300 rounded`}>
                <FaExclamationCircle className="w-5 h-5 mr-2" />
                Incident Report
              </a>
            </li>

            <li>
              <a onClick={() => navigate('/gcolor')} className={`flex items-center px-4 py-2 text-white ${location.pathname === '/color' ? 'bg-gray-400' : 'hover:bg-gray-400'} transition-colors duration-300 rounded`}>
                <FaPaintBrush className="w-5 h-5 mr-2" />
                Color Wheel Legend
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className={`flex-1 p-4 md:ml-64 flex flex-col ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
        {/* Search bar and user settings */}
        <div className={`flex justify-between items-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-maroon'} p-2 rounded-lg shadow mb-4`}>
          <div className="flex items-center">
            <FaSearch className="w-4 h-4 mr-1 text-white" />
            <input
              type="text"
              placeholder="Search"
              className={`border-0 p-1 rounded-lg flex-grow focus:outline-none focus:ring focus:ring-gray-200 text-sm ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100'}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} // Update search term
            />
          </div>
          <div className="flex items-center space-x-2 relative">
            <FaBell className="w-5 h-5 text-white hover:text-yellow-400 cursor-pointer" onClick={() => navigate('/gNotification')} />
            <FaUserCircle 
                className="w-5 h-5 text-white hover:text-yellow-400 cursor-pointer" 
                onClick={() => navigate('/gprofile')} // Navigate to profile on click
            />
            <div className="relative">
              <FaCog 
                className="w-5 h-5 text-white hover:text-yellow-400 cursor-pointer" 
                onClick={() => setShowSettingsMenu(!showSettingsMenu)} 
              />
              {showSettingsMenu && (
                <div className={`absolute right-0 mt-2 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md rounded-lg z-10`} ref={settingsMenuRef}>
                  <ul className="py-2">
                      <li className={`px-4 py-2 ${theme === 'dark' ? 'text-white' : 'text-black'} hover:bg-gray-200 cursor-pointer`} onClick={() => navigate('/gsettings')}>Settings</li>
                      <li className={`px-4 py-2 ${theme === 'dark' ? 'text-white' : 'text-black'} hover:bg-gray-200 cursor-pointer`} onClick={() => navigate('/ghelp')}>Help</li>
                      <li className={`px-4 py-2 ${theme === 'dark' ? 'text-white' : 'text-black'} hover:bg-gray-200 cursor-pointer`} onClick={handleLogout}>Logout</li>
                  </ul>
                </div>
              )}
            </div>
            <FaBars className="w-5 h-5 text-white hover:text-yellow-400 cursor-pointer md:hidden" onClick={() => setIsOpen(!isOpen)} />
          </div>
        </div>

        {/* Incident Reports Display */}
        <div className={`bg-gray-50 p-4 rounded-lg shadow-md border border-gray-500 flex-grow flex flex-col ${theme === 'dark' ? 'bg-gray-800' : ''}`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">{theme === 'dark' ? 'Incident Reports' : <span className="text-maroon">Incident Reports</span>}</h2>
            <div className="relative">
              <button 
                className={`flex items-center ${theme === 'dark' ? 'bg-gray-600 text-white' : 'bg-gray-300 text-gray-700'} px-4 py-2 rounded shadow hover:bg-blue-200`}
                onClick={() => setShowFilterMenu(!showFilterMenu)} // Toggle filter menu
              >
                <FaSort className="mr-2" /> Sort/Filter
              </button>
              {showFilterMenu && (
                <div className={`absolute right-0 mt-2 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md rounded-lg p-4 z-10`} ref={filterMenuRef}>
                  <h4 className="text-lg font-semibold text-center">Filter by Status</h4>
                  <br/>
                  <div className="flex flex-col space-y-2">
                    <button 
                      className={`w-full px-4 py-2 rounded ${selectedStatus === "All" ? 'bg-gray-400 text-white' : 'bg-gray-200'} hover:bg-gray-200`} 
                      onClick={() => handleStatusFilter("All")}
                    >
                      All
                    </button>
                    <button 
                      className={`w-full px-4 py-2 rounded ${selectedStatus === "Open" ? 'bg-blue-400 text-white' : 'bg-gray-200'} hover:bg-blue-200`} 
                      onClick={() => handleStatusFilter("Open")}
                    >
                      Open
                    </button>
                    <button 
                      className={`w-full px-4 py-2 rounded ${selectedStatus === "Ongoing" ? 'bg-orange-400 text-white' : 'bg-gray-200'} hover:bg-orange-200`} 
                      onClick={() => handleStatusFilter("Ongoing")}
                    >
                      Ongoing
                    </button>
                    <button 
                      className={`w-full px-4 py-2 rounded ${selectedStatus === "Resolved" ? 'bg-green-400 text-white' : 'bg-gray-200'} hover:bg-green-200`} 
                      onClick={() => handleStatusFilter("Resolved")}
                    >
                      Resolved
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="overflow-y-scroll flex-grow" style={{ maxHeight: '600px' }}>
            {filteredReports.length > 0 ? (
              filteredReports.map((report, index) => (
                <div key={report.id} className={`border border-blue-300 p-4 mb-4 rounded shadow hover:shadow-lg transition-shadow duration-200 flex justify-between items-start ${theme === 'dark' ? 'bg-gray-700' : ''}`}>
                  <div className="flex flex-col">
                    <img 
                      src={report.image} 
                      alt="Incident" 
                      className="w-20 h-20 object-cover cursor-pointer rounded" 
                      onClick={() => handleImageClick(report.image)} 
                    />
                    <p className="mt-1 font-semibold text-sm">Report Number: {report.id}</p>
                    <p className="text-xs">Location: {report.location}</p>
                    <p className="text-xs">Date: {report.date_observed}</p>
                    <p className="text-xs">Time: {report.time_observed}</p>
                    <p className="text-xs">Description: {report.description}</p>
                    <p className="mt-1 font-semibold text-xs">Status: {report.status}</p> {/* Display Status */}
                  </div>
                  {/* Dropdown for GSD and MDS */}
                  <div className="flex flex-col ml-2">
                  <button
                    onClick={() => handleSendReport(report.id)}
                    className={`mt-2 w-full px-2 py-1 rounded ${report.selectedDepartment ? 'bg-maroon text-white' : 'bg-gray-300 text-gray-600'}`} 
                  >
                    Send Report
                  </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600">No incident reports available.</p>
            )}
          </div>
        </div>

        {/* Image Modal */}
        {showImageModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`} ref={modalRef}>
              <button className="absolute top-2 right-2" onClick={closeImageModal}>Close</button>
              <img src={selectedImage} alt="Selected Incident" className="w-full h-auto" />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
