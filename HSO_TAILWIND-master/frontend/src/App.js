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
import { supabase } from './supabaseClient';
import Analytics from './pages/Analytics';
import Help from './pages/Help';
import Notification from './pages/Notification';

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
      </Routes>
    </Router>
  );
}

export default App;
