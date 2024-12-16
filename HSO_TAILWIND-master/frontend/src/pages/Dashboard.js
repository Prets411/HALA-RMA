import React, { useState, useEffect, useRef } from 'react';
import { FaUserCircle, FaSearch, FaCog, FaBell, FaFileAlt, FaClipboardList, FaPaintBrush, FaExclamationCircle, FaBars, FaChartBar, FaChartLine } from 'react-icons/fa'; 
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

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

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const { data, error } = await supabase
      .from('announcements')
      .select();

      if(error){
        setAnnouncements([]);
        console.log(error);
      }
      if(data){
        setAnnouncements(data);
      }
    } 

    const fetchPrograms = async () => {
      const {data,error} = await supabase
      .from('programs')
      .select();

      if(error){
        setAnnouncements([]);
        console.log(error);
      }
      if(data){
        setPrograms(data);
      }
    }
    fetchAnnouncements();
    fetchPrograms();
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

  const [filter, setFilter] = useState("all");

  const handleSortChange = (event) => {
    setFilter(event.target.value);
  };

  const sortedAnnouncements = (() => {
    let filtered = announcements;

    switch (filter) {
      case 'oldest':
        filtered = [...filtered].sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case 'recent':
        filtered = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));
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

  const [programFilter, setProgramFilter] = useState("all");

  const sortedPrograms = (() => {
    let filteredPrograms = programs;

    switch (programFilter) {
      case 'oldest':
        filteredPrograms = [...filteredPrograms].sort((a, b) => new Date(a.created_at) - new Date(b.date));
        break;
      case 'newest':
        filteredPrograms = [...filteredPrograms].sort((a, b) => new Date(b.created_at) - new Date(a.date));
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

      <main className={`flex-1 p-4 md:ml-64 flex flex-col ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'} overflow-y-auto`}>
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
              <FaChartLine className="w-5 h-5 text-white hover:text-yellow-400 cursor-pointer" onClick={() => navigate('/Analytics')} />
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

          {/* Announcements Card Container */}
          <div className={`shadow-md border ${theme === 'dark' ? 'border-white' : 'border-gray-900'} rounded-lg p-2 mb-4 flex flex-col`}>
            <div className="flex justify-between items-center">
              <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-maroon'} text-center`}>Announcements</h3>
              <select className="border border-gray-300 rounded p-1" value={filter} onChange={handleSortChange}>
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

            <div className="flex flex-wrap justify-between mt-2 overflow-y-auto" style={{ maxHeight: '350px' }}>
              {filteredAnnouncements.length === 0 ? (
                <div className="text-center text-gray-500">No announcements found</div>
              ) : (
                filteredAnnouncements.map((announcement) => (
                  <div 
                    key={announcement.id} 
                    className={`border ${theme === 'dark' ? 'border-white' : 'border-maroon'} rounded-lg p-2 flex flex-col m-2`}
                    style={{ backgroundColor: theme === 'dark' ? '#4a4a4a' : 'white', width: 'calc(50% - 16px)', maxWidth: '180px' }} 
                  >
                    <img src={announcement.images} alt={announcement.title} className="h-24 w-full object-cover mb-2" />
                    <h4 className= 'font-semibold'>{announcement.title}</h4>
                    <p className="text-xs">{announcement.content}</p>
                    <p className="text-gray-500 text-xs">{announcement.created_at} at {announcement.time}</p>
                    <button className={`border ${theme === 'dark' ? 'border-white' : 'border-maroon'} ${theme === 'dark' ? 'text-white' : 'text-maroon'} font-normal py-1 px-2 rounded mt-2 mx-auto block`}
                    onClick={() => handleShowMoreAnnouncement(announcement)}
                  >Show More
                  </button>
                  </div>
                ))
              )}
            </div>
          </div>

                {/* Programs Card Container */}
                <div className={`shadow-md border ${theme === 'dark' ? 'border-white' : 'border-gray-900'} rounded-lg p-2 mb-4 flex flex-col`}>
            <div className="flex justify-between items-center">
              <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-maroon'} text-center`}>Programs</h3>
              {/* Programs Sorting Dropdown */}
              <select className="border border-gray-300 rounded p-1" value={programFilter} onChange={setProgramFilter}>
                <option value="all">All</option>
                <option value="oldest">Oldest</option>
                <option value="newest">Newest</option>
              </select>
            </div>
            <div className="flex flex-wrap justify-between mt-2 overflow-y-auto" style={{ maxHeight: '350px' }}>
            {filteredPrograms.length === 0 ? (
                <div className="text-center text-gray-500">No programs found</div>
              ) : (
                filteredPrograms.map((program) => (
                  <div 
                    key={program.id} 
                    className={`border ${theme === 'dark' ? 'border-white' : 'border-maroon'} rounded-lg p-2 flex flex-col m-2`}
                    style={{ backgroundColor: theme === 'dark' ? '#4a4a4a' : 'white', width: 'calc(50% - 16px)', maxWidth: '180px' }} 
                  >
                  <img src={program.images} alt={program.who} className="h-24 w-full object-cover mb-2" />
                  <h4 className="font-semibold">{program.who}</h4>
                  <p className="text-gray-500 text-xs">When: {program.when_date} at {program.when_time}</p>
                  <p className="text-gray-500 text-xs">Where: {program.where}</p>
                  <p className="text-gray-500 text-xs">Who: {program.who}</p>
                    <button className={`border ${theme === 'dark' ? 'border-white' : 'border-maroon'} ${theme === 'dark' ? 'text-white' : 'text-maroon'} font-normal py-1 px-2 rounded mt-2 mx-auto block`}
                    onClick={() => handleShowMoreProgram(program)}
                  >Show More
                  </button>
                  </div>
                ))
              )}    
            </div>
          </div>
        </div>

        

     
      </main>
         {/* Announcement Modal */}
         {modalVisible && selectedAnnouncement && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg p-4 max-w-lg w-full">
          <h2 className={`text-lg font-bold ${selectedAnnouncement.color}`}>{selectedAnnouncement.title}</h2>
          <img src={selectedAnnouncement.images} alt={selectedAnnouncement.title} className="h-48 w-full object-cover mb-2" />
          <p className={`${selectedAnnouncement.color}`}>{selectedAnnouncement.content}</p>
          <p className="text-gray-500 text-xs">{selectedAnnouncement.created_at}</p>
          <button className={`border ${theme === 'dark' ? 'border-white' : 'border-maroon'} ${theme === 'dark' ? 'text-white' : 'text-maroon'} font-normal py-1 px-2 rounded mt-2 mx-auto block`}
                    onClick={closeAnnouncementModal}>
                      Close
                  </button>
            </div>
          </div>
        )}
        {/* Modal for Programs */}
      {programsModalVisible && selectedProgram && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-4 max-w-lg w-full">
            <h2 className={`text-lg font-bold`}>{selectedProgram.who}</h2>
            <img src={selectedProgram.images} alt={selectedProgram.who} className="h-48 w-full object-cover mb-2" />
            <p className="text-black">{selectedProgram.what}</p>
            <p className="text-gray-500 text-xs">When: {selectedProgram.when_date} at {selectedProgram.when_time}</p>
            <p className="text-gray-500 text-xs">Where: {selectedProgram.where}</p>
            <p className="text-gray-500 text-xs">Who: {selectedProgram.who}</p>
            <button className={`border ${theme === 'dark' ? 'border-white' : 'border-maroon'} ${theme === 'dark' ? 'text-white' : 'text-maroon'} font-normal py-1 px-2 rounded mt-2 mx-auto block`}
                    onClick={closeProgramModal}>
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
  `}</style>
    </div>
  );
}
