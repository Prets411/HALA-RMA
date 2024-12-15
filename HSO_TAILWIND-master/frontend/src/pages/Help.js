import React, { useState, useEffect, useRef } from 'react';
import { FaUserCircle, FaSearch, FaCog, FaBell, FaFileAlt, FaClipboardList, FaPaintBrush, FaExclamationCircle, FaBars, FaChartBar, FaChartLine } from 'react-icons/fa'; 
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Help() {
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

    return(
        <div>
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
           
         </div>
       </main>


 
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
 