import React, { useState, useRef, useEffect } from 'react';
import { FaUserCircle, FaSearch, FaCog, FaBell, FaBars, FaChartBar, FaExclamationCircle, FaFileAlt, FaClipboardList, FaPaintBrush, FaChartLine } from 'react-icons/fa'; 
import { useNavigate, useLocation } from 'react-router-dom';

const GColorLegend = () => {
    const navigate = useNavigate();
    const location = useLocation(); // Get the current location
    const [menuActive, setMenuActive] = useState(false);
    const [showSettingsMenu, setShowSettingsMenu] = useState(false);
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
    const sideMenuRef = useRef(null);
    const settingsMenuRef = useRef(null);

    const colors = [
        { 
            name: 'Red', 
            meaning: 'Represents Critical Alerts',
            description: 'Urgent and immediate danger requiring immediate action. Examples include natural disasters like earthquakes, tsunamis, or severe storms.' 
        },
        { 
            name: 'Orange', 
            meaning: 'Represents High Alerts', 
            description: 'Significant threats or emergencies that require attention. Examples include evacuation notices or hazardous conditions.' 
        },
        { 
            name: 'Yellow', 
            meaning: 'Represents Moderate Alerts', 
            description: 'Situations with potential risks or hazards that require caution. Examples include weather advisories or localized disruptions.' 
        },
        { 
            name: 'Green', 
            meaning: 'Represents Low Alerts', 
            description: 'Informational notices or updates with minimal impact. Examples include general safety reminders or community updates.' 
        },
        { 
            name: 'Blue', 
            meaning: 'Represents Informational Alerts', 
            description: 'Non-emergency notices or informational updates. Examples include community events or service announcements.' 
        },
    ];

    const toggleMenu = () => {
        setMenuActive(prev => !prev);
    };

    const toggleSettingsMenu = () => {
        setShowSettingsMenu(prev => !prev);
    };

    const handleLogout = () => {
        // Log out logic (e.g., clear tokens, redirect)
        window.location.href = "/"; // Adjust the path if necessary
    };

    // Close the settings menu if the user clicks outside of it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (settingsMenuRef.current && !settingsMenuRef.current.contains(event.target)) {
                setShowSettingsMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className={`flex min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'} overflow-hidden`}>
            {/* Sidebar */}
            <aside
                className={`shadow-md w-64 fixed top-0 left-0 h-full z-10 transition-transform duration-300 ${menuActive ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
                style={{
                    background: theme === 'dark' ? '#2d2d2d' : 'linear-gradient(120deg, #4a0909, #4a0909, #fcd7d4, #610c0c)',
                    backgroundSize: '200% 200%',
                }}
                ref={sideMenuRef}
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
                            <a onClick={() => navigate('/gsd')} className={`flex items-center px-4 py-2 text-white ${location.pathname === '/dashboard' ? 'bg-gray-400' : 'hover:bg-gray-400'} transition-colors duration-300 rounded`}>
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
            <main className="flex-1 p-4 md:ml-64 flex flex-col">
                {/* Navbar */}
                <nav className={`flex justify-between items-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-maroon'} p-2 rounded-lg shadow mb-4`}>
                    <div className="flex items-center">
                        <FaSearch className="w-4 h-4 mr-1 text-white" />
                        <input
                            type="text"
                            placeholder="Search"
                            className={`border-0 p-1 rounded-lg flex-grow focus:outline-none focus:ring focus:ring-gray-200 text-sm ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100'}`}
                        />
                    </div>
                    <div className="flex items-center space-x-2 relative">
                        <FaBell className="w-5 h-5 text-white hover:text-yellow-400 cursor-pointer" onClick={() => navigate('/gnotification')} />
                        <FaUserCircle 
                            className="w-5 h-5 text-white hover:text-yellow-400 cursor-pointer" 
                            onClick={() => navigate('/gprofile')} // Navigate to profile on click
                        />
                        <div className="relative">
                            <FaCog 
                                className="w-5 h-5 text-white hover:text-yellow-400 cursor-pointer" 
                                onClick={toggleSettingsMenu} 
                            />
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
                        <FaBars className="w-5 h-5 text-white hover:text-yellow-400 cursor-pointer md:hidden" onClick={toggleMenu} />
                    </div>
                </nav>

                {/* Color Legend Section */}
                <div className={`flex-grow rounded-lg p-2 shadow flex-grow flex flex-col items-center mb-2 border-2 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} border-gray-300`}>
                    <h2 className={`text-2xl font-bold text-center ${theme === 'dark' ? 'text-white' : 'text-maroon'} mb-2 w-full`}>COLOR LEGEND</h2>
                    <p className={`text-center ${theme === 'dark' ? 'text-gray-400' : 'text-black'}`}>List of colors and their corresponding meanings</p>
                </div>

                <div className={`flex-grow rounded-lg p-4 shadow flex flex-col md:flex-row items-center border-2 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} border-gray-300`}>
                    {/* Color Wheel Container */}
                    <div className="color-wheel-container flex justify-center items-center w-full md:w-1/2 mb-4 md:mb-0">
                        <svg viewBox="0 0 32 32" className="color-wheel animate-rotate" style={{ width: '280px', height: '280px' }}>
                            <g>
                                <path d="M16 0 A16 16 0 0 1 30.78 9.94 L16 16 Z" fill="red" />
                                <path d="M30.78 9.94 A16 16 0 0 1 25.71 30.78 L16 16 Z" fill="orange" />
                                <path d="M25.71 30.78 A16 16 0 0 1 6.29 30.78 L16 16 Z" fill="yellow" />
                                <path d="M6.29 30.78 A16 16 0 0 1 1.22 9.94 L16 16 Z" fill="green" />
                                <path d="M1.22 9.94 A16 16 0 0 1 16 0 L16 16 Z" fill="blue" />
                            </g>
                        </svg>
                    </div>

                    {/* Legend details */}
                    <div className="legend-container flex flex-col justify-center items-center md:w-1/2">
                        {colors.map((color) => (
                            <div key={color.name} className={`legend-item flex justify-between p-4 m-2 rounded-lg shadow hover:shadow-lg transition-shadow duration-200 w-full border-2 ${theme === 'dark' ? 'border-blue-600' : 'border-blue-200'} hover:border-blue-500`}>
                                <span style={{ color: color.name.toLowerCase(), fontWeight: 'bold' }}>{color.name}:</span> 
                                <div className="flex-grow text-right">
                                    <p className={`${theme === 'dark' ? 'text-white' : 'text-black'}`}>{color.meaning}</p>
                                    <p className="text-sm text-gray-500">{color.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <style jsx>{`
                .color-wheel {
                    border-radius: 50%; /* Ensure it's a perfect circle */
                    transform-origin: center;
                    animation: rotate 10s infinite linear; /* Rotate animation */
                }

                @keyframes rotate {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }
            `}</style>
        </div>
    );
};

export default GColorLegend;

//