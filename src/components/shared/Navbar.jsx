import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Heart } from 'lucide-react'

const Navbar = () => {
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
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-orange-500 p-2 rounded-lg"><Heart className="text-white" /></div>
          <span className="text-xl font-bold">SAMARPAN</span>
        </Link>
        <nav className="hidden md:flex gap-8">
          {navItems.map(item => (
            <Link key={item.name} to={item.href} className="hover:text-orange-500 font-medium">{item.name}</Link>
          ))}
        </nav>
        <Link to="/donate" className="hidden md:block bg-orange-500 text-white px-6 py-2 rounded-lg">Donate</Link>
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>{isOpen ? <X /> : <Menu />}</button>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="md:hidden bg-white border-t p-4 flex flex-col gap-4">
            {navItems.map(item => (
              <Link key={item.name} to={item.href} onClick={() => setIsOpen(false)}>{item.name}</Link>
            ))}
            <Link to="/donate" className="bg-orange-500 text-white p-2 rounded text-center">Donate</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
export default Navbar