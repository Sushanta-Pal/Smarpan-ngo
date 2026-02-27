import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Linkedin, Mail, ArrowRight } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { fetchTeamMembers } from '../lib/supabase'
import { SectionHeading, LoadingSpinner } from '../components/animated/index.jsx'

export default function Team() {
  
  // 1. THIS SINGLE LINE REPLACES YOUR ENTIRE CUSTOM HOOK!
  // It handles fetching, caching, loading states, and background updates automatically.
  const { data: members = [], isLoading: loading } = useQuery({
    queryKey: ['teamMembers'], // The unique name for this cache
    queryFn: fetchTeamMembers, // The function from your supabase.js file
  })

  // 3D Modern Premium Team Card with Advanced Animations
  const StrictTeamCard = ({ member }) => {
    const [imageError, setImageError] = useState(false)
    const [isHovered, setIsHovered] = useState(false)
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

    const handleMouseMove = (e) => {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      setMousePosition({ x: x * 20, y: y * 20 })
    }

    const handleMouseLeave = () => {
      setIsHovered(false)
      setMousePosition({ x: 0, y: 0 })
    }

    const containerVariants = {
      initial: { opacity: 0, y: 40 },
      animate: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.6, type: 'spring', stiffness: 100 }
      },
      hover: {
        y: -20,
        transition: { duration: 0.3 }
      }
    }

    const imageVariants = {
      initial: { scale: 0.8, opacity: 0 },
      animate: { 
        scale: 1, 
        opacity: 1,
        transition: { duration: 0.7, delay: 0.1 }
      },
      hover: { scale: 1.05 }
    }

    const textVariants = {
      initial: { opacity: 0 },
      animate: { 
        opacity: 1,
        transition: { duration: 0.5, delay: 0.2 }
      }
    }

    return (
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          perspective: '1200px',
          rotateX: isHovered ? mousePosition.y : 0,
          rotateY: isHovered ? -mousePosition.x : 0,
        }}
        transition={{ rotateX: { type: 'spring', stiffness: 300, damping: 30 }, rotateY: { type: 'spring', stiffness: 300, damping: 30 } }}
        className="relative h-full min-h-[480px] group"
      >
        {/* Main Card */}
        <div className="relative w-full h-full bg-gradient-to-br from-slate-50 via-white to-slate-50 rounded-3xl overflow-hidden shadow-2xl">
          {/* Animated background gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br from-indigo-50 via-transparent to-orange-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
          
          {/* Glassmorphism background effect */}
          <div className="absolute inset-0 backdrop-blur-0 group-hover:backdrop-blur-sm transition-all duration-500" />

          {/* Top gradient bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-orange-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Floating particles effect */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-indigo-400 rounded-full opacity-0 group-hover:opacity-30"
                animate={isHovered ? {
                  x: [0, Math.random() * 200 - 100, 0],
                  y: [0, Math.random() * 200 - 100, 0],
                } : {}}
                transition={{
                  duration: 3 + i,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                style={{
                  left: `${20 + i * 30}%`,
                  top: `${30 + i * 20}%`
                }}
              />
            ))}
          </div>

          {/* Content Container */}
          <div className="relative z-10 flex flex-col items-center gap-6 p-8 h-full justify-between">
            {/* Image Section with 3D effect */}
            <div className="relative flex-shrink-0">
              <motion.div
                variants={imageVariants}
                className="relative"
              >
                {/* Glow background */}
                <motion.div
                  className="absolute -inset-4 bg-gradient-to-r from-indigo-400 via-purple-400 to-orange-400 rounded-full opacity-0 group-hover:opacity-75 blur-lg transition-all duration-500"
                  animate={isHovered ? { rotate: 360 } : { rotate: 0 }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                />

                {/* Image wrapper with border */}
                <div className="relative w-48 h-48 rounded-full overflow-hidden ring-4 ring-white shadow-2xl group-hover:ring-8 group-hover:ring-indigo-200 transition-all duration-300 flex items-center justify-center bg-gradient-to-br from-indigo-100 to-orange-100">
                  {member.image_url && !imageError ? (
                    <motion.img
                      src={member.image_url}
                      alt={member.name}
                      className="w-full h-full object-contain"
                      onError={() => setImageError(true)}
                      whileHover={{ scale: 1.15 }}
                      transition={{ duration: 0.4 }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-200 to-orange-200 flex items-center justify-center text-8xl">
                      👤
                    </div>
                  )}

                  {/* Overlay shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                    animate={isHovered ? { x: ['-100%', '100%'] } : {}}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  />
                </div>

                {/* Status badge */}
                <motion.div
                  className="absolute -bottom-2 -right-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-full p-3 shadow-lg ring-4 ring-white"
                  animate={isHovered ? { scale: 1.2 } : { scale: 1 }}
                  whileHover={{ scale: 1.3 }}
                >
                  ✓
                </motion.div>
              </motion.div>
            </div>

            {/* Text Content Section */}
            <motion.div
              variants={textVariants}
              className="flex flex-col items-center gap-3 text-center flex-grow justify-center"
            >
              <div>
                <motion.h3
                  className="text-2xl font-black text-slate-900 mb-1 bg-gradient-to-r from-indigo-600 to-orange-600 bg-clip-text text-transparent"
                  animate={isHovered ? { y: -2 } : { y: 0 }}
                >
                  {member.name}
                </motion.h3>
                <motion.p
                  className="text-sm font-semibold text-indigo-600 group-hover:text-orange-600 transition-colors duration-300"
                  animate={isHovered ? { y: 2 } : { y: 0 }}
                >
                  {member.position}
                </motion.p>
              </div>

              {/* Experience badge */}
              {member.years_experience && (
                <motion.div
                  className="inline-block px-4 py-1 bg-gradient-to-r from-indigo-100 to-orange-100 rounded-full text-xs font-semibold text-indigo-700"
                  animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
                >
                  {member.years_experience} years exp
                </motion.div>
              )}

              {/* Bio/Description */}
              {member.bio && (
                <p className="text-xs text-gray-600 line-clamp-2 group-hover:text-gray-700 transition-colors">
                  {member.bio}
                </p>
              )}
            </motion.div>

            {/* Action Buttons Section */}
            <motion.div
              className="flex gap-4 mt-auto pt-6 border-t border-gray-200 group-hover:border-indigo-200 transition-colors w-full justify-center relative z-20"
              animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
            >
              {member.linkedin_url && (
                <motion.a
                  href={member.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.15, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:from-blue-200"
                  title="LinkedIn"
                >
                  <Linkedin size={20} className="group-hover:animate-pulse" />
                </motion.a>
              )}
              
              {member.email && (
                <motion.a
                  href={`mailto:${member.email}`}
                  whileHover={{ scale: 1.15, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 rounded-full bg-gradient-to-br from-orange-100 to-orange-50 text-orange-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:from-orange-200"
                  title="Email"
                >
                  <Mail size={20} />
                </motion.a>
              )}

              {member.linkedin_url && (
                <motion.a
                  href={member.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.15, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-50 text-indigo-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:from-indigo-200"
                  title="Connect"
                >
                  <ArrowRight size={20} />
                </motion.a>
              )}
            </motion.div>
          </div>

          {/* Hover glow effect */}
          <motion.div
            className="absolute inset-0 rounded-3xl pointer-events-none group-hover:shadow-[inset_0_0_60px_rgba(99,102,241,0.2)] transition-shadow duration-500"
          />
        </div>
      </motion.div>
    )
  }

  const mockTeam = [
    { 
      id: 1, 
      name: 'Rajesh Kumar', 
      position: 'Founder & Director', 
      bio: 'Visionary leader with 15+ years in education',
      specialty: 'Education Leadership',
      years_experience: 15,
      email: 'rajesh@samarpan.org',
      phone: '+91-9876543210',
      location: 'New Delhi, India',
      linkedin_url: 'https://linkedin.com/in/rajesh-kumar',
      image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'
    },
    { 
      id: 2, 
      name: 'Priya Singh', 
      position: 'Head of Programs', 
      bio: 'Educational expert passionate about innovative methodologies',
      specialty: 'Program Development',
      years_experience: 12,
      email: 'priya@samarpan.org',
      phone: '+91-9876543211',
      location: 'New Delhi, India',
      linkedin_url: 'https://linkedin.com/in/priya-singh',
      image_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop'
    },
    { 
      id: 3, 
      name: 'Amit Patel', 
      position: 'Operations Manager', 
      bio: 'Ensures smooth running of all initiatives',
      specialty: 'Operations',
      years_experience: 10,
      email: 'amit@samarpan.org',
      phone: '+91-9876543212',
      location: 'New Delhi, India',
      linkedin_url: 'https://linkedin.com/in/amit-patel',
      image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop'
    },
    { 
      id: 4, 
      name: 'Neha Sharma', 
      position: 'Community Coordinator', 
      bio: 'Bridges gap between communities and programs',
      specialty: 'Community Engagement',
      years_experience: 8,
      email: 'neha@samarpan.org',
      phone: '+91-9876543213',
      location: 'New Delhi, India',
      linkedin_url: 'https://linkedin.com/in/neha-sharma',
      image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'
    },
    { 
      id: 5, 
      name: 'Vikram Singh', 
      position: 'Volunteer Coordinator', 
      bio: 'Mobilizes and supports our volunteer network',
      specialty: 'Volunteer Management',
      years_experience: 9,
      email: 'vikram@samarpan.org',
      phone: '+91-9876543214',
      location: 'New Delhi, India',
      linkedin_url: 'https://linkedin.com/in/vikram-singh',
      image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop'
    },
    { 
      id: 6, 
      name: 'Deepika Reddy', 
      position: 'Content Creator', 
      bio: 'Shares our stories with the world',
      specialty: 'Digital Marketing',
      years_experience: 7,
      email: 'deepika@samarpan.org',
      phone: '+91-9876543215',
      location: 'New Delhi, India',
      linkedin_url: 'https://linkedin.com/in/deepika-reddy',
      image_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop'
    },
  ]

  const displayMembers = members.length > 0 ? members : mockTeam
  const core_member = displayMembers

  const renderMembers = (startIdx, endIdx, wrapperClass) => {
    const start = Math.max(0, startIdx)
    const end = Math.min(core_member.length - 1, endIdx)
    if (start > end) return null
    return core_member.slice(start, end + 1).map((m) => (
      <div key={m.id} className="inline-block">
        <StrictTeamCard member={m} />
      </div>
    ))
  }

  return (
    <div>

      {/* Team Section */}
      <section className="relative py-24 container mx-auto px-4 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-full blur-3xl opacity-30 -z-10" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-100 to-orange-50 rounded-full blur-3xl opacity-30 -z-10" />

        <SectionHeading title="Core Team Members" subtitle="Dedicated individuals making a difference" />

        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {/* First 2 members - Showcase leaders */}
            <div className="top-row-wrapper grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
              {renderMembers(0, 1, 'top-row-wrapper')}
            </div>

            {/* Next 4 members in responsive grid */}
            <div className="circle-wrapper grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {renderMembers(2, 5, 'circle-wrapper')}
            </div>

            {/* Next 10 members (6–15) in 3-column layout */}
            <div className="three-cols-wrapper grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {renderMembers(6, 14, 'three-cols-wrapper')}
            </div>

            {/* Next 2 members (16–17) in row */}
            <div className="top-row-wrapper grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
              {renderMembers(15, 16, 'top-row-wrapper')}
            </div>

            {/* Remaining members after 17 in 3-column layout */}
            {core_member.length > 17 && (
              <div className="three-cols-wrapper grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {renderMembers(17, core_member.length - 1, 'three-cols-wrapper')}
              </div>
            )}
          </>
        )}
      </section>

      {/* Testimonial */}
      <section className="py-20 bg-gradient-to-r from-orange-50 to-red-50">
        <div className="container mx-auto px-4">
          <SectionHeading title="Why We Do This" subtitle="Testimonials from our team" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { quote: 'Every child deserves access to quality education. That belief drives everything we do.', author: 'Rajesh Kumar', role: 'Founder' },
              { quote: 'Seeing students transform through education is the greatest reward we could ask for.', author: 'Priya Singh', role: 'Head of Programs' },
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="bg-white p-8 rounded-lg shadow-lg"
              >
                <p className="text-lg text-gray-600 mb-4 italic">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-2xl mr-4">
                    👤
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{testimonial.author}</p>
                    <p className="text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Us */}
      <section className="py-20 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl font-black mb-4 text-slate-900">Join Our Team</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            We're always looking for passionate individuals to join us in our mission to transform education.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-orange-600 text-white px-8 py-4 rounded-full font-bold hover:bg-orange-700 transition-all inline-block"
          >
            View Open Positions
          </motion.button>
        </motion.div>
      </section>
    </div>
  )
}