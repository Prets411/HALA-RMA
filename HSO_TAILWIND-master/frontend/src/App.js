import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home'; 
import About from './pages/About'; 
import Login from './pages/Login'; 
import Dashboard from './pages/Dashboard';
import IncidentReport from './pages/IncidentReport';
import CreateAnnouncements from './pages/CreateAnnouncements';
import UploadPrograms from './pages/UploadPrograms';
import ColorLegend from './pages/ColorLegend';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Analytics from './pages/Analytics';
import Help from './pages/Help';
import Notification from './pages/Notification';
import GSD from './pages/GSDDashboard';
import GColorLegend from './pages/GSDColorLegend';
import GHelp from './pages/GSDHelp';
import GIncidentReport from './pages/GSDIncidentReport';
import GProfile from './pages/GSDProfile';
import GSettings from './pages/GSDSettings';
import GNotification from './pages/GSDNotification';
import MDS from './pages/MDSDashboard';
import MColorLegend from './pages/MDSColorLegend';
import MHelp from './pages/MDSHelp';
import MIncidentReport from './pages/MDSIncidentReport';
import MNotification from './pages/MDSNotification';
import MProfile from './pages/MDSProfile';
import MSettings from './pages/MDSSettings';

function App() {

  return (
    <Router>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} /> 
        <Route path="/reports" element={<IncidentReport />}/>
        <Route path="/create" element={<CreateAnnouncements />}/>
        <Route path="/upload" element={<UploadPrograms />}/>
        <Route path="/create" element={<CreateAnnouncements />}/>
        <Route path="/color" element={<ColorLegend />}/>
        <Route path="/profile" element={<Profile />}/>
        <Route path="/settings" element={<Settings />}/>
        <Route path="/analytics" element={<Analytics />}/>
        <Route path="/help" element={<Help />}/>
        <Route path="/notification" element={<Notification />}/>
        <Route path="/gsd" element={<GSD />}/>
        <Route path="/gcolor" element={<GColorLegend />}/>
        <Route path="/ghelp" element={<GHelp />}/>
        <Route path="/greports" element={<GIncidentReport />}/>
        <Route path="/gprofile" element={<GProfile />}/>
        <Route path="/gsettings" element={<GSettings />}/>
        <Route path="/gnotification" element={<GNotification />}/>
        <Route path="/mds" element={<MDS />}/>
        <Route path="/mcolor" element={<MColorLegend />}/>
        <Route path="/mhelp" element={<MHelp />}/>
        <Route path="/mreports" element={<MIncidentReport />}/>
        <Route path="/mprofile" element={<MProfile />}/>
        <Route path="/msettings" element={<MSettings />}/>
        <Route path="/mnotification" element={<MNotification />}/>
      </Routes>
    </Router>
  );
}

export default App;
