import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Phone, Mail, Facebook, Instagram, Linkedin, Heart, ArrowUp } from 'lucide-react'

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  const teamMembers = [
    { name: 'Soumyadeep Taladhi', phone: '+91-6297604029' },
    { name: 'Rahul Gope', phone: '+91-9973669992' },
    { name: 'Kumar Abhishek', phone: '+91-7462875501' },
    { name: 'Harsh Kumar', phone: '+91-7856060388' }
  ]

  const stats = [
    { label: 'Students Impacted', number: '5000+' },
    { label: 'Team Members', number: '50+' },
    { label: 'Programs', number: '15+' }
  ]

  return (
    <footer className="bg-gradient-to-b from-slate-900 via-slate-800 to-black text-gray-200">
      {/* Stats Section */}
      <div className="bg-gradient-to-r from-green-600 to-orange-600 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-white">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-6"
              >
                <div className="text-4xl md:text-5xl font-black mb-2">
                  {stat.number}
                </div>
                <p className="text-sm font-semibold uppercase tracking-widest">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* About Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="lg:col-span-1"
          >
            <div className="flex items-center gap-2 mb-4">
              <Heart className="text-orange-500 fill-orange-500" size={28} />
              <h3 className="text-2xl font-black text-white">SAMARPAN</h3>
            </div>
            <p className="text-gray-400 leading-relaxed text-sm">
              Providing free education to underprivileged children. Every child deserves a chance to shine and reach their dreams.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="text-white font-bold mb-6 text-lg flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-green-500 to-orange-500 rounded-full"></span>
              Navigation
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  onClick={scrollToTop}
                  className="text-gray-400 hover:text-orange-500 transition-colors flex items-center gap-2 text-sm"
                >
                  <span>→</span> Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  onClick={scrollToTop}
                  className="text-gray-400 hover:text-orange-500 transition-colors flex items-center gap-2 text-sm"
                >
                  <span>→</span> About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/team"
                  onClick={scrollToTop}
                  className="text-gray-400 hover:text-orange-500 transition-colors flex items-center gap-2 text-sm"
                >
                  <span>→</span> Team
                </Link>
              </li>
              <li>
                <Link
                  to="/contact-us"
                  onClick={scrollToTop}
                  className="text-gray-400 hover:text-orange-500 transition-colors flex items-center gap-2 text-sm"
                >
                  <span>→</span> Contact Us
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="text-white font-bold mb-6 text-lg flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-green-500 to-orange-500 rounded-full"></span>
              Contact Us
            </h4>
            <div className="space-y-3">
              {teamMembers.map((member, i) => (
                <motion.a
                  key={i}
                  href={`tel:${member.phone.replace(/[- ]/g, '')}`}
                  whileHover={{ x: 4 }}
                  className="text-gray-400 hover:text-orange-500 transition-colors flex items-start gap-2 text-xs group"
                >
                  <Phone size={14} className="mt-1 flex-shrink-0" />
                  <div>
                    <p className="group-hover:text-orange-400">{member.name}</p>
                    <p className="font-semibold">{member.phone}</p>
                  </div>
                </motion.a>
              ))}
              <motion.a
                href="mailto:hithaldia.samarpan@gmail.com"
                whileHover={{ x: 4 }}
                className="text-gray-400 hover:text-orange-500 transition-colors flex items-start gap-2 text-xs group mt-4 pt-4 border-t border-gray-700"
              >
                <Mail size={14} className="mt-1 flex-shrink-0" />
                <span className="group-hover:text-orange-400">hithaldia.samarpan@gmail.com</span>
              </motion.a>
            </div>
          </motion.div>

          {/* Social & Copyright */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="text-white font-bold mb-6 text-lg flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-green-500 to-orange-500 rounded-full"></span>
              Connect With Us
            </h4>
            <div className="flex gap-4 mb-8">
              <motion.a
                href="https://www.facebook.com/samarpanathith"
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.2, rotate: 5 }}
                className="p-3 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg text-blue-400 hover:text-blue-300 transition-colors"
              >
                <Facebook size={20} />
              </motion.a>
              <motion.a
                href="https://www.instagram.com/samarpan_hit/"
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.2, rotate: 5 }}
                className="p-3 bg-gradient-to-br from-pink-500/20 to-pink-600/20 rounded-lg text-pink-400 hover:text-pink-300 transition-colors"
              >
                <Instagram size={20} />
              </motion.a>
              <motion.a
                href="https://www.linkedin.com/company/samarpanhit"
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.2, rotate: 5 }}
                className="p-3 bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 rounded-lg text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <Linkedin size={20} />
              </motion.a>
            </div>
            <p className="text-gray-500 text-xs">
              Copyright &copy; {new Date().getFullYear()} by Samarpan NGO. All rights reserved.
            </p>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent my-8"></div>

        {/* Footer Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-xs text-center md:text-left mb-4 md:mb-0">
            Empowering underprivileged children through education and skill development
          </p>
          <motion.button
            onClick={scrollToTop}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 rounded-full bg-gradient-to-r from-green-600 to-orange-600 text-white hover:shadow-lg transition-all"
            title="Back to top"
          >
            <ArrowUp size={20} />
          </motion.button>
        </div>
      </div>
    </footer>
  )
}

export default Footer