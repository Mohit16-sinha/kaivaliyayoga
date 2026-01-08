import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Announcement from './components/Announcement';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

import Dashboard from './pages/Dashboard';
import Classes from './pages/Classes';
import AdminClasses from './pages/AdminClasses';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <div className='relative font-secondary text-earth-900 bg-earth-100 min-h-screen'>
      <Announcement />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/classes" element={<Classes />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/classes" element={<AdminClasses />} />
      </Routes>
    </div>
  );
}

export default App;
