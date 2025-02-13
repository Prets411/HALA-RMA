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
  const [action_taken, setActionTaken] = useState("");

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
        closeImageModal();
      }
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target)) {
        setShowFilterMenu(false);
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

  const handleSendReport = async (index) => {
    const selectedDepartment = incidentReports[index].selectedDepartment;
    const selectedReport = incidentReports[index];

    if (selectedDepartment && action_taken.trim() !== "") 
      { 
      const updatedReports = [...incidentReports];
      updatedReports[index].status = "Ongoing";
      updatedReports[index].office = selectedDepartment;
      updatedReports[index].action_taken = action_taken; // Add action_taken here
      setIncidentReports(updatedReports);

      try {
        const { error } = await supabase
          .from('incidents')
          .update({
            status: 'Resolved', 
            office: selectedDepartment, 
            action_taken: action_taken,
          })
          .eq('id', selectedReport.id);

        if (error) throw error;

        alert(`Report ${selectedReport.id} sent to: ${selectedDepartment} with action_taken: ${action_taken}`);
      } catch (err) {
        console.error('Error updating incident:', err);
        alert('There was an error sending the report.');
      }
    } else {
      alert('Please provide a action_taken for the report.');
    }
  };

  const filteredReports = incidentReports.filter(report => {
    const matchesSearchTerm =
      (report.name && report.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (report.location && report.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (report.description && report.description.toLowerCase().includes(searchTerm.toLowerCase()));
  
    const matchesStatus = selectedStatus === "All" || report.status === selectedStatus;
  
    return matchesSearchTerm && matchesStatus;
  });

  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
    setShowFilterMenu(false);
  };

  const handleSort = () => {
    const sortedReports = [...incidentReports].sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
    setIncidentReports(sortedReports);
  };

    const [showFullDetails, setShowFullDetails] = useState({}); 
  
    const toggleDetails = (index) => {
      setShowFullDetails((prevState) => ({
        ...prevState,
        [index]: !prevState[index],
      }));
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
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2 relative">
            <FaBell className="w-5 h-5 text-white hover:text-yellow-400 cursor-pointer" onClick={() => navigate('/mNotification')} />
            <FaUserCircle 
                className="w-5 h-5 text-white hover:text-yellow-400 cursor-pointer" 
                onClick={() => navigate('/mprofile')}
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


        {/* Incident reports */}
        <div className="mt-6">
                   <div className="flex justify-between items-center mb-4">
                     <h2 className="text-2xl font-bold">{theme === 'dark' ? 'Incident Reports' : <span className="text-maroon">Incident Reports</span>}</h2>
                     <div className="relative">
                       <button 
                         className={`flex items-center ${theme === 'dark' ? 'bg-gray-600 text-white' : 'bg-gray-300 text-gray-700'} px-4 py-2 rounded shadow hover:bg-blue-200`}
                         onClick={() => setShowFilterMenu(!showFilterMenu)}
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
          <div className="space-y-4">
            {filteredReports.map((report, index) => (
              <div key={report.id} className={`bg-white shadow-md rounded-md p-4 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}`}>
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Report Number: {report.id}</h3>
                  <p><strong>Location:</strong> {report.location}</p>
                  <button onClick={() => toggleDetails(index)} className="text-sm text-gray-500">
                    {showFullDetails[index] ? "Hide Details" : "Show Details"}
                  </button>
                </div>
                {showFullDetails[index] && (
                  <div className="mt-2 text-sm text-gray-700">
                    <img 
                      src={report.image} 
                      alt="Incident" 
                      className="w-20 h-20 object-cover cursor-pointer rounded" 
                      onClick={() => handleImageClick(report.image)} 
                    />
                    <p><strong>Subject:</strong> {report.subject}</p>
                    <p><strong>Location:</strong> {report.location}</p>
                    <p><strong>Description:</strong> {report.description}</p>
                    <p><strong>Status:</strong> {report.status}</p>
                    <div className="flex mt-2">
                      <input
                        type="text"
                        placeholder="Action Taken"
                        value={action_taken}
                        onChange={(e) => setActionTaken(e.target.value)}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div className="flex mt-2 space-x-2">
                      <select
                        value={report.selectedDepartment || ""}
                        onChange={(e) => handleDepartmentChange(index, e.target.value)}
                        className="p-2 border rounded-md"
                      >
                        <option value="">Select Department</option>
                        <option value="Department A">Health and Safety Office</option>

                      </select>
                      <button
                        onClick={() => handleSendReport(index)}
                        className="px-4 py-2 bg-maroon text-white py-2 px-4 hover:bg-yellow-500 hover:text-white transition-all mt-4 rounded-md"
                      >
                        Send Report
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Modal for showing image */}
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
