import React, { useState, useEffect, useRef } from 'react';
import { FaUserCircle, FaSearch, FaCog, FaBell, FaFileAlt, FaClipboardList, FaPaintBrush, FaExclamationCircle, FaBars, FaChartBar, FaChartLine } from 'react-icons/fa'; 
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2'; 

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [shake, setShake] = useState(false);
  const settingsMenuRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [announcements, setAnnouncements] = useState([]); 
  const [programs, setPrograms] = useState([])
  const [monthlyReportsData, setMonthlyReportsData] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [resolvedReports, setResolvedReports] = useState(0);
  const [pendingReports, setPendingReports] = useState(0);
  const [openReports, setOpenReports] = useState(0); 
  const [setMonthlyReportCounts, setReportsTimelineData] = useState([]);


  useEffect(() => {
    const fetchAnnouncements = async () => {
      const { data, error } = await supabase
      .from('announcements')
      .select();

      if (error) {
        setAnnouncements([]);
        console.log(error);
      }
      if (data) {
        setAnnouncements(data);
      }
    };

    const fetchPrograms = async () => {
      const { data, error } = await supabase
      .from('programs')
      .select();

      if (error) {
        setPrograms([]);
        console.log(error);
      }
      if (data) {
        setPrograms(data);
      }
    };

    fetchAnnouncements();
    fetchPrograms();
  }, []);

  useEffect(() => {
    fetchUserTypes();
    fetchIncidentStatus();  

  }, []);

  const today = new Date(); 
  const todayDate = today.getDate(); 

  useEffect(() => {
    const shakeInterval = setInterval(() => {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }, 10000);

    return () => clearInterval(shakeInterval);
  }, []);

  const handleDateClick = (day) => {
    const newDate = new Date(calendarYear, currentMonth, day);
    setSelectedDate(newDate);
  };

  const handleMonthChange = (increment) => {
    let newMonth = currentMonth + increment;
    let newYear = calendarYear;

    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }

    setCurrentMonth(newMonth);
    setCalendarYear(newYear);
  };

  const handleLogout = () => {
    navigate('/login');
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [programsModalVisible, setProgramsModalVisible] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);

  const handleShowMoreAnnouncement = (announcement) => {
    setSelectedAnnouncement(announcement);
    setModalVisible(true);
  };

  const closeAnnouncementModal = () => {
    setModalVisible(false);
    setSelectedAnnouncement(null);
  };

  const handleShowMoreProgram = (program) => {
    setSelectedProgram(program);
    setProgramsModalVisible(true);
  };

  const closeProgramModal = () => {
    setModalVisible(false);
    setSelectedProgram(null);
  };

  const [filter, setFilter] = useState("recent");

  const handleSortChange = (event) => {
    setFilter(event.target.value);
  };

  const sortedAnnouncements = (() => {
    let filtered = announcements;
  
    switch (filter) {
      case 'oldest':
        filtered = [...filtered].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        break;
      case 'recent':
        filtered = [...filtered].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case 'text-red-600':
        filtered = filtered.filter(announcement => announcement.color === 'red');
        break;
      case 'text-orange-600':
        filtered = filtered.filter(announcement => announcement.color === 'orange');
        break;
      case 'text-yellow-600':
        filtered = filtered.filter(announcement => announcement.color === 'yellow');
        break;
      case 'text-green-600':
        filtered = filtered.filter(announcement => announcement.color === 'green');
        break;
      case 'text-blue-600':
        filtered = filtered.filter(announcement => announcement.color === 'blue');
        break;
      default:
        break;
    }
  
    return filtered;
  })();

  const [programFilter, setProgramFilter] = useState("newest");

  const sortedPrograms = (() => {
    let filteredPrograms = programs;

    switch (programFilter) {
      case 'oldest':
        filteredPrograms = [...filteredPrograms].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        break;
      case 'newest':
        filteredPrograms = [...filteredPrograms].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      default:
        break;
    }

    return filteredPrograms;
  })();


  const filteredAnnouncements = sortedAnnouncements.filter(announcement => {
    const text = (announcement.title || "").toLowerCase();  
    const details = (announcement.content || "").toLowerCase();  
    return text.includes(searchTerm.toLowerCase()) || details.includes(searchTerm.toLowerCase());
  });

  const filteredPrograms = sortedPrograms.filter(program => {
    const text = (program.title || "").toLowerCase(); 
    const details = (program.what || "").toLowerCase();  
    return text.includes(searchTerm.toLowerCase()) || details.includes(searchTerm.toLowerCase());
  });

  const fetchUserTypes = async () => {
    try {
      const { data, error } = await supabase.from("account").select("user_type");
      if (error) throw error;
      setTotalUsers(data.length);
    } catch (error) {
      console.error("Error fetching user types:", error.message);
    }
  };

  const fetchIncidentStatus = async () => {
    try {
      const { data, error } = await supabase
        .from("incidents")
        .select("status, created_at");
  
      if (error) throw error;
  
      const monthlyCounts = processMonthlyData(data);
  
      setResolvedReports(monthlyCounts.resolved.reduce((a, b) => a + b, 0));
      setPendingReports(monthlyCounts.pending.reduce((a, b) => a + b, 0));
      setOpenReports(monthlyCounts.open.reduce((a, b) => a + b, 0));
  

      prepareChartData(monthlyCounts);
    } catch (error) {
      console.error("Error fetching incidents:", error.message);
    }
  };

  
  const processMonthlyData = (data) => {
    const resolved = Array(12).fill(0);
    const pending = Array(12).fill(0);
    const open = Array(12).fill(0);
  
    data.forEach((incident) => {
      const month = new Date(incident.created_at).getMonth();
  
      if (incident.status === "Resolved") resolved[month]++;
      if (incident.status === "Ongoing") pending[month]++;
      if (incident.status === "Open") open[month]++;
    });
  
    return { resolved, pending, open };
  };

  const prepareChartData = ({ resolved, pending, open }) => {
    setMonthlyReportsData({
      labels: [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ],
      datasets: [
        {
          label: "Resolved Reports",
          data: resolved,
          backgroundColor: "rgba(75, 192, 192, 0.5)",
          borderColor: "rgba(75, 192, 192, 1)",
          fill: true,
        },
        {
          label: "Ongoing Reports",
          data: pending,
          backgroundColor: "rgba(255, 206, 86, 0.5)",
          borderColor: "rgba(255, 206, 86, 1)",
          fill: true,
        },
        {
          label: "Open Reports",
          data: open,
          backgroundColor: "rgba(255, 99, 132, 0.5)",
          borderColor: "rgba(255, 99, 132, 1)",
          fill: true,
        },
      ],
    });

    setMonthlyReportsData({
      labels: [
        "January", "February", "March", "April", "May", "June", 
        "July", "August", "September", "October", "November", "December"
      ],
      datasets: [
        {
          label: "Monthly Reports",
          data: monthlyCounts, 
          backgroundColor: "rgba(75, 192, 192, 0.5)",
        },
        {
          label: "Pending Reports",
          data: [0, pending, 0],
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
        {
          label: "Resolved Reports",
          data: [0, resolved, 0],
          backgroundColor: "rgba(75, 192, 192, 0.5)",
        },
      ],
    });
  };


    const [currentAnnouncementPage, setCurrentAnnouncementPage] = useState(1);
    const announcementsPerPage = 8;
    
    const [currentProgramPage, setCurrentProgramPage] = useState(1);
    const programsPerPage = 8;
    
    const paginatedAnnouncements = filteredAnnouncements.slice(
      (currentAnnouncementPage - 1) * announcementsPerPage,
      currentAnnouncementPage * announcementsPerPage
    );

    const paginatedPrograms = filteredPrograms.slice(
      (currentProgramPage - 1) * programsPerPage,
      currentProgramPage * programsPerPage
    );

    const handleAnnouncementPageChange = (page) => {
      setCurrentAnnouncementPage(page);
    };

    const handleProgramPageChange = (page) => {
      setCurrentProgramPage(page);
    };


        
  return (
    <div className={`flex min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'} overflow-hidden`}>
      <aside
        className={`shadow-md w-64 fixed top-0 left-0 h-full z-10 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
        style={{
          background: theme === 'dark' ? '#2d2d2d' : '#4a0909',
        }}
      >
        <div className="p-4 text-center border-b border-gray-300">
          <img 
            src="/images/BELL.png" 
            alt="Logo" 
            className={`h-12 mx-auto ${shake ? 'animate-shake' : ''}`} 
          />
        </div>
        <nav className="mt-6">
          <ul className="space-y-1">
            <li>
              <a onClick={() => navigate('/dashboard')} className="flex items-center px-4 py-2 text-white bg-gray-400 rounded"> 
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

        <div className="mt-24 mb-4 px-2">
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-300 h-76">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">{`${new Date(calendarYear, currentMonth).toLocaleString('default', { month: 'long' })} ${calendarYear}`}</h2>
            <div className="flex justify-between mb-1">
              <button onClick={() => handleMonthChange(-1)} className="text-gray-600 hover:text-gray-900 text-xs">◀</button>
              <span className="font-bold text-sm">{new Date(calendarYear, currentMonth).toLocaleString('default', { month: 'long' })}</span>
              <button onClick={() => handleMonthChange(1)} className="text-gray-600 hover:text-gray-900 text-xs">▶</button>
            </div>
            <div className="grid grid-cols-7 gap-0.5">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center font-bold text-sm">{day}</div>
              ))}
              {[...Array(new Date(calendarYear, currentMonth, 1).getDay())].map((_, index) => (
                <div key={index} className="border p-0 text-center h-8"></div>
              ))}
              {[...Array(new Date(calendarYear, currentMonth + 1, 0).getDate())].map((_, index) => {
                const day = index + 1;
                const isToday = day === todayDate;
                return (
                  <div
                    key={index}
                    className={`border p-0 text-center cursor-pointer hover:bg-gray-200 h-8 ${isToday ? 'bg-yellow-300' : ''}`}
                    onClick={() => handleDateClick(day)}
                  >
                    <span className="text-xs">{day}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </aside>

      <main className={`flex-1 p-4 md:ml-64 flex flex-col ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'} overflow-y-auto`}
      style={{ height: '100vh' }}>
      <div className="flex-1 flex flex-col">
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

        <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-maroon'} text-left `}>Analytics</h3>
        <br></br>
        <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-100 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Total Active Users</h3>
            <p className="text-2xl">{totalUsers}</p>
            </div>
            <div className="bg-blue-100 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Open Reports</h3>
            <p className="text-2xl">{openReports}</p>
            </div>
            <div className="bg-red-100 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Ongoing Reports</h3>
            <p className="text-2xl">{pendingReports}</p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Resolved Reports</h3>
            <p className="text-2xl">{resolvedReports}</p>
            </div>

            <div className="monthly-reports-section">
              {monthlyReportsData && monthlyReportsData.datasets && (
                <Line 
                    data={monthlyReportsData}
                    options={{
                        responsive: true,
                        plugins: {
                            legend: { position: 'top' },
                            title: { display: true, text: 'Monthly Reports' },
                        },
                        scales: { y: { beginAtZero: true } }
                    }}
                    style={{ width: '100%', height: '400px' }}
                />
            )}
            </div>
        </div>

        <div className="flex justify-between items-center">
          <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-maroon'} text-center`}>Announcements</h3>
          <select className={`border rounded p-1 ${
          theme === 'dark' 
        ? 'bg-gray-700 text-white border-gray-500' 
        : 'bg-white text-black border-gray-300'
        }`} value={filter} onChange={handleSortChange}>
            <option value="all">All</option>
            <option value="oldest">Oldest</option>
            <option value="recent">Recent</option>
            <option value="text-red-600">Red</option>
            <option value="text-orange-600">Orange</option>
            <option value="text-yellow-600">Yellow</option>
            <option value="text-green-600">Green</option>
            <option value="text-blue-600">Blue</option>
          </select>
        </div>

        <div className="flex flex-wrap justify-between mt-2 overflow-y-auto" style={{ maxHeight: '250px' }}>
          {paginatedAnnouncements.length === 0 ? (
            <div className="text-center text-gray-500">No announcements found</div>
          ) : (
            paginatedAnnouncements.map((announcement) => (
              <div
              key={announcement.id}
              className={`border ${theme === 'dark' ? 'border-white' : 'border-maroon'} rounded-lg p-2 flex flex-col m-2`}
              style={{ backgroundColor: theme === 'dark' ? '#4a4a4a' : 'white', width: 'calc(50% - 16px)', maxWidth: '180px' }}
            >
              {announcement.images ? (
                <img
                  src={Array.isArray(announcement.images) ? announcement.images[0] : announcement.images}
                  alt={announcement.title}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/150';
                  }} 
                  className="h-24 w-full object-cover mb-2 rounded-lg"
                />
              ) : (
                <p className="text-gray-500 text-sm">No image available</p>
              )}
              <h4
                className="font-semibold text-sm"
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {announcement.title}
              </h4>
              <button
                className={`w-full bg-maroon text-white py-2 px-4 rounded-md hover:bg-yellow-500 hover:text-white transition-all mt-4`}
                onClick={() => handleShowMoreAnnouncement(announcement)}
              >
                Show More
              </button>
            </div>
            

            ))
          )}
        </div>

        <div className="flex justify-center mt-4">
        {Array(Math.ceil(filteredAnnouncements.length / announcementsPerPage))
          .fill()
          .map((_, i) => (
            <button
              key={i}
              className={`mx-1 px-2 py-1 rounded ${
                currentAnnouncementPage === i + 1
                  ? 'bg-maroon text-white'
                  : 'bg-gray-200 text-black hover:bg-maroon hover:text-white transition-all' 
              }`}
              onClick={() => setCurrentAnnouncementPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
      </div>


            <br/>
              <hr/>
            <br/>
          <div className="flex justify-between items-center">
            <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-maroon'} text-center`}>Programs</h3>
            <select
              className={`border rounded p-1 ${
                theme === 'dark' 
              ? 'bg-gray-700 text-white border-gray-500' 
              : 'bg-white text-black border-gray-300'
              }`}
              value={programFilter}
              onChange={(e) => setProgramFilter(e.target.value)} 
            >
              <option value="all">All</option>
              <option value="oldest">Oldest</option>
              <option value="newest">Newest</option>
            </select>
          </div>

          <div className="flex flex-wrap justify-between mt-2 overflow-y-auto" style={{ maxHeight: '250px' }}>
            {paginatedPrograms.length === 0 ? (
              <div className="text-center text-gray-500">No programs found</div>
            ) : (
              paginatedPrograms.map((program) => (
                <div
                key={program.id}
                className={`border ${theme === 'dark' ? 'border-white' : 'border-maroon'} rounded-lg p-2 flex flex-col m-2`}
                style={{ backgroundColor: theme === 'dark' ? '#4a4a4a' : 'white', width: 'calc(50% - 16px)', maxWidth: '180px' }}
              >
                {program.images ? (
                  <img
                    src={
                      Array.isArray(program.images)
                        ? program.images[0]
                        : typeof program.images === 'string' && program.images.startsWith('[')
                        ? JSON.parse(program.images)[0]
                        : program.images
                    }
                    alt={program.who}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/150';
                    }}
                    className="h-24 w-full object-cover mb-2 rounded-lg"
                  />
                ) : (
                  <p className="text-gray-500 text-sm">No image available</p>
                )}
              
                <h4
                  className="font-semibold text-sm"
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {program.who}
                </h4>
              
                <button
                  className={`w-full bg-maroon text-white py-2 px-4 rounded-md hover:bg-yellow-500 hover:text-white transition-all mt-4`}
                  onClick={() => handleShowMoreProgram(program)}
                >
                  Show More
                </button>
              </div>
              ))
            )}
          </div>

          <div className="flex justify-center mt-4">
          {Array(Math.ceil(filteredPrograms.length / programsPerPage))
            .fill()
            .map((_, i) => (
              <button
                key={i}
                className={`mx-1 px-2 py-1 rounded ${
                  currentProgramPage === i + 1
                    ? 'bg-maroon text-white' 
                    : 'bg-gray-200 text-black hover:bg-maroon hover:text-white transition-all' 
                }`}
                onClick={() => setCurrentProgramPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
        </div>
        </div>

      </main>
        {/* Announcement Modal */}
        {modalVisible && selectedAnnouncement && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-4 max-w-lg w-full">
              <img
                src={Array.isArray(selectedAnnouncement.images) ? selectedAnnouncement.images[0] : selectedAnnouncement.images}
                alt={selectedAnnouncement.title}
                onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }} 
                className="h-48 w-full object-cover mb-2"
              />
              <h2
                className="text-lg font-bold"
                style={{ color: 'black' }} 
              >
                {selectedAnnouncement.title}
              </h2>
              <p className="text-gray-700">{selectedAnnouncement.content}</p>
              <p className="text-gray-500 text-xs">{selectedAnnouncement.created_at}</p>
              <button
                className={`w-full bg-maroon text-white py-2 px-4 rounded-md hover:bg-yellow-500 hover:text-white transition-all mt-4`}
                onClick={closeAnnouncementModal}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {programsModalVisible && selectedProgram && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-4 max-w-lg w-full">
              {selectedProgram.images ? (
                <img
                  src={
                    Array.isArray(selectedProgram.images)
                      ? selectedProgram.images[0]
                      : typeof selectedProgram.images === 'string' && selectedProgram.images.startsWith('[')
                      ? JSON.parse(selectedProgram.images)[0]
                      : selectedProgram.images
                  }
                  alt={selectedProgram.who}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/150'; 
                  }}
                  className="h-48 w-full object-cover mb-2 rounded-lg"
                />
              ) : (
                <p className="text-gray-500 text-sm">No image available</p>
              )}
              <h2 className="text-lg font-bold" style={{ color: 'black' }}>
              {selectedProgram.who}
              </h2>
              <p className="text-black">{selectedProgram.what}</p>
              <p className="text-gray-500 text-xs">When: {selectedProgram.when_date} at {selectedProgram.when_time}</p>
              <p className="text-gray-500 text-xs">Where: {selectedProgram.where}</p>
              <button
                className={`w-full bg-maroon text-white py-2 px-4 rounded-md hover:bg-yellow-500 hover:text-white transition-all mt-4`}
                onClick={closeProgramModal}
              >
                Close
              </button>
            </div>
          </div>
        )}

<style jsx>{`
    .animate-shake {
      animation: shake 0.5s;
    }
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
    @media (max-width: 768px) {
      .flex-col {
        flex-direction: column;
      }
      .flex-wrap {
        flex-wrap: wrap;
      }
      .overflow-hidden {
        overflow: hidden;
      }
    }
  `}
  </style>
    </div>
  );
}
