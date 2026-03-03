import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layouts & Static Components
import Navbar from './components/shared/Navbar';
import Footer from './components/shared/Footer';
import DashboardLayout from './components/layout/DashboardLayout';

// Lazy Load Public Pages
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

// Lazy Load Admin Pages
const AdminLogin = React.lazy(() => import('./pages/admin/AdminLogin'));
const DashboardOverview = React.lazy(() => import('./pages/admin/DashboardOverview'));
const ManageEvents = React.lazy(() => import('./pages/admin/ManageEvents'));
const ManageTeam = React.lazy(() => import('./pages/admin/ManageTeam'));
const ManageAlumni = React.lazy(() => import('./pages/admin/ManageAlumni'));
const ManageGallery = React.lazy(() => import('./pages/admin/ManageGallery'));

// Simple wrapper to protect admin routes
const AdminProtectedRoute = ({ children }) => {
  const isAdmin = localStorage.getItem('samarpan_admin') === 'true';
  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('samarpan_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setAuthLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('samarpan_user');
    setUser(null);
  };

  if (authLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>; 
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* We hide the main public Navbar if we are in the admin section */}
        <Routes>
          <Route path="/admin/*" element={null} />
          <Route path="*" element={<Navbar user={user} onLogout={handleLogout} />} />
        </Routes>
        
        <main className="flex-grow">
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
              
              {/* Volunteer Auth Routes */}
              <Route 
                path="/login" 
                element={!user ? <VolunteerLogin onLogin={setUser} /> : <Navigate to="/routine" replace />} 
              />
              <Route 
                path="/routine" 
                element={user ? <Routine loggedInUserId={user.id} /> : <Navigate to="/login" replace />} 
              />
              <Route 
                path="/marketplace" 
                element={user ? <Marketplace loggedInUserId={user.id} /> : <Navigate to="/login" replace />} 
              />

              {/* ADMIN ROUTES */}
              <Route path="/admin/login" element={<AdminLogin />} />
              {/* <Route path="/admin/login" element={<div className="p-20 text-4xl font-bold text-red-600">TESTING ADMIN ROUTE</div>} /> */}
              
              <Route path="/admin" element={
                <AdminProtectedRoute>
                  <DashboardLayout />
                </AdminProtectedRoute>
              }>
                <Route index element={<DashboardOverview />} />
                <Route path="events" element={<ManageEvents />} />
                <Route path="team" element={<ManageTeam />} />
                <Route path="alumni" element={<ManageAlumni />} />
                <Route path="gallery" element={<ManageGallery />} />
              </Route>

              {/* Catch-all Default Route for 404s */}
              <Route path="*" element={<Home />} />
            </Routes>
          </Suspense>
        </main>
        
        {/* Hide main Footer in admin section */}
        <Routes>
          <Route path="/admin/*" element={null} />
          <Route path="*" element={<Footer />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;