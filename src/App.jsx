import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Components (Keep these static as they are on every page)
import Navbar from './components/shared/Navbar';
import Footer from './components/shared/Footer';

// Lazy Load Pages for better performance (Code Splitting)
const Home = React.lazy(() => import('./pages/Home'));
const About = React.lazy(() => import('./pages/About'));
const Events = React.lazy(() => import('./pages/Events'));
const Gallery = React.lazy(() => import('./pages/Gallery'));
const Team = React.lazy(() => import('./pages/Team'));
const Alumni = React.lazy(() => import('./pages/Alumni'));
const Contact = React.lazy(() => import('./pages/Contact'));
const Donate = React.lazy(() => import('./pages/Donate'));
const VolunteerLogin = React.lazy(() => import('./pages/VolunteerLogin'));
const Routine = React.lazy(() => import('./pages/Routine'));
const Marketplace = React.lazy(() => import('./pages/Marketplace'));
// const NotFound = React.lazy(() => import('./pages/NotFound')); // Your custom 404 component

function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true); // Prevents redirect flicker on reload

  useEffect(() => {
    const savedUser = localStorage.getItem('samarpan_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setAuthLoading(false); // Auth check is complete
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('samarpan_user');
    setUser(null);
  };

  // Don't render routes until we know if the user is logged in or not
  if (authLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>; 
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar user={user} onLogout={handleLogout} />
        
        <main className="flex-grow">
          {/* Suspense provides a fallback UI while lazy components are downloading */}
          <Suspense fallback={<div className="text-center p-10">Loading page...</div>}>
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
              
              {/* Auth Routes */}
              <Route 
                path="/login" 
                element={!user ? <VolunteerLogin onLogin={setUser} /> : <Navigate to="/routine" replace />} 
              />

              {/* Protected Routes */}
              <Route 
                path="/routine" 
                element={user ? <Routine loggedInUserId={user.id} /> : <Navigate to="/login" replace />} 
              />
              <Route 
                path="/marketplace" 
                element={user ? <Marketplace loggedInUserId={user.id} /> : <Navigate to="/login" replace />} 
              />

              {/* Catch-all Default Route for 404s */}
              <Route path="*" element={<Home />} />
            </Routes>
          </Suspense>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;