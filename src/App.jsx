import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Components
import Navbar from './components/shared/Navbar';
import Footer from './components/shared/Footer';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Events from './pages/Events';
import Gallery from './pages/Gallery';
import Team from './pages/Team';
import Alumni from './pages/Alumni';
import Contact from './pages/Contact';
import Donate from './pages/Donate';

// Volunteer Portal Pages
import VolunteerLogin from './pages/VolunteerLogin';
import Routine from './pages/Routine';
import Marketplace from './pages/Marketplace';

function App() {
  const [user, setUser] = useState(null);

  // When the app loads, check if they already logged in previously
  useEffect(() => {
    const savedUser = localStorage.getItem('samarpan_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('samarpan_user');
    setUser(null);
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Pass the user state and logout function to the Navbar */}
        <Navbar user={user} onLogout={handleLogout} />
        
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/events" element={<Events />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/team" element={<Team />} />
            <Route path="/alumni" element={<Alumni />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/donate" element={<Donate />} />
            
            {/* Login Route: If already logged in, send them straight to their routine */}
            <Route 
              path="/login" 
              element={!user ? <VolunteerLogin onLogin={setUser} /> : <Navigate to="/routine" />} 
            />

            {/* Protected Routes: Only accessible if `user` is not null */}
            <Route 
              path="/routine" 
              element={user ? <Routine loggedInUserId={user.id} /> : <Navigate to="/login" />} 
            />
            
            <Route 
              path="/marketplace" 
              element={user ? <Marketplace loggedInUserId={user.id} /> : <Navigate to="/login" />} 
            />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;