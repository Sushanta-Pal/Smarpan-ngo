import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Heart } from 'lucide-react'

const Navbar = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false)
  
  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Events', href: '/events' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Team', href: '/team' },
    { name: 'Alumni', href: '/alumni' },
    { name: 'Contact', href: '/contact' },
  ]

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-orange-500 p-2 rounded-lg">
            <Heart size={20} className="text-white fill-current" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">SAMARPAN</span>
        </Link>

        {/* Desktop Main Navigation */}
        <nav className="hidden md:flex gap-6 lg:gap-8 items-center">
          {navItems.map(item => (
            <Link 
              key={item.name} 
              to={item.href} 
              className="text-gray-600 hover:text-orange-500 font-medium transition-colors text-sm lg:text-base"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth & Donate Section */}
        <div className="hidden md:flex items-center gap-4">
          {!user ? (
            <Link to="/login" className="text-indigo-600 font-bold hover:text-indigo-800 text-sm lg:text-base px-2">
              Volunteer Login
            </Link>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/routine" className="font-bold text-gray-700 hover:text-indigo-600 text-sm">
                My Routine
              </Link>
              <Link to="/marketplace" className="font-bold text-gray-700 hover:text-indigo-600 text-sm">
                Marketplace
              </Link>
              <div className="flex items-center gap-3 border-l-2 pl-4 border-gray-200">
                <span className="text-sm font-medium text-gray-500">
                  Hi, {user.name.split(' ')[0]} {/* Shows just their first name */}
                </span>
                <button 
                  onClick={onLogout} 
                  className="text-sm text-red-600 font-bold hover:underline"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
          
          <Link 
            to="/donate" 
            className="bg-orange-500 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-orange-600 transition-colors shadow-sm"
          >
            Donate
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-gray-600 p-2" 
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }} 
            exit={{ opacity: 0, height: 0 }} 
            className="md:hidden bg-white border-t overflow-hidden"
          >
            <div className="p-4 flex flex-col gap-4">
              {navItems.map(item => (
                <Link 
                  key={item.name} 
                  to={item.href} 
                  onClick={() => setIsOpen(false)}
                  className="text-gray-700 font-medium hover:text-orange-500"
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile Auth Section */}
              <div className="border-t border-gray-100 pt-4 mt-2 flex flex-col gap-4">
                {!user ? (
                  <Link 
                    to="/login" 
                    onClick={() => setIsOpen(false)} 
                    className="font-bold text-indigo-600"
                  >
                    Volunteer Login
                  </Link>
                ) : (
                  <>
                    <Link 
                      to="/routine" 
                      onClick={() => setIsOpen(false)} 
                      className="font-bold text-gray-800"
                    >
                      My Routine
                    </Link>
                    <Link 
                      to="/marketplace" 
                      onClick={() => setIsOpen(false)} 
                      className="font-bold text-gray-800"
                    >
                      Shift Marketplace
                    </Link>
                    <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <span className="text-sm font-medium text-gray-600">Logged in as {user.name}</span>
                      <button 
                        onClick={() => { onLogout(); setIsOpen(false); }} 
                        className="text-red-600 font-bold text-sm"
                      >
                        Logout
                      </button>
                    </div>
                  </>
                )}
                
                <Link 
                  to="/donate" 
                  onClick={() => setIsOpen(false)} 
                  className="bg-orange-500 text-white p-3 rounded-lg text-center font-bold mt-2 shadow-sm"
                >
                  Donate to SAMARPAN
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Navbar