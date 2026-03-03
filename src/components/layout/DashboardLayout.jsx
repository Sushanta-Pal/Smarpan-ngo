import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  GraduationCap, 
  Image as ImageIcon, 
  Menu, 
  LogOut,
  ChevronRight,
  ClipboardList, 
  BookTemplate
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SidebarLink = ({ to, icon: Icon, label, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) => `
      flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
      ${isActive 
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
        : 'text-gray-500 hover:bg-indigo-50 hover:text-indigo-600'}
    `}
  >
    <Icon className="w-5 h-5 shrink-0" />
    <span className="font-medium">{label}</span>
    <ChevronRight className={`ml-auto w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity`} />
  </NavLink>
);

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear admin auth token
    localStorage.removeItem('samarpan_admin');
    navigate('/admin/login');
  };

  const navItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'Overview' },
    { to: '/admin/events', icon: Calendar, label: 'Events' },
    { to: '/admin/team', icon: Users, label: 'Team Members' },
    { to: '/admin/routines', icon: ClipboardList, label: 'Volunteer Routines' },
    { to: '/admin/volunteers', icon: Users, label: 'Volunteers Registry' }, // NEW
    { to: '/admin/templates', icon: Calendar, label: 'Master Schedule' },
    { to: '/admin/alumni', icon: GraduationCap, label: 'Alumni' },
    { to: '/admin/gallery', icon: ImageIcon, label: 'Gallery' },
    // We will add the Volunteer Routine link here in the next step!
  ];

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 w-72 bg-white border-r border-gray-100 z-50 transition-transform duration-300 transform
        lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                S
              </div>
              <h1 className="text-xl font-black text-gray-800 tracking-tight">SAMARPAN ADMIN</h1>
            </div>

            <nav className="space-y-2">
              {navItems.map((item) => (
                <SidebarLink 
                  key={item.to} 
                  {...item} 
                  onClick={() => setIsSidebarOpen(false)} 
                />
              ))}
            </nav>
          </div>

          <div className="mt-auto p-6 border-t border-gray-100">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors font-medium"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 text-gray-400 hover:bg-gray-50 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-bold text-gray-800 leading-none">Super Admin</p>
              <p className="text-xs text-gray-500">Active Now</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-indigo-100 border-2 border-white shadow-sm flex items-center justify-center text-indigo-700 font-bold overflow-hidden">
               {/* Placeholder Admin Avatar */}
               <span className="font-bold">A</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 overflow-y-auto custom-scrollbar">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;