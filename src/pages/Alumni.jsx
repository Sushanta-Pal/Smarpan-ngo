import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Award, Briefcase, GraduationCap, Linkedin, X, Trophy, Target, BookOpen } from 'lucide-react'
import { HeroSection, SectionHeading, StaggerContainer, StaggerItem, LoadingSpinner, AnimatedCard } from '../components/animated/index.jsx'
import { useAlumni } from '../lib/hooks'

export default function Alumni() {
  const { alumni, loading } = useAlumni()
  const [selectedAlumnus, setSelectedAlumnus] = useState(null)

  const mockAlumni = [
    { 
      id: 1, 
      name: 'Aisha Mohammad', 
      graduation_year: 2020, 
      current_role: 'Software Engineer',
      achievement: 'Working at leading tech company',
      success_story: 'SAMARPAN gave me the foundation to dream big. Today I code for change and help others in my community.',
      company_name: 'TechCorp Solutions',
      location: 'Bangalore, India',
      linkedin_url: 'https://linkedin.com/in/aisha-mohammad',
      image_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
      is_featured: true
    },
    { 
      id: 2, 
      name: 'Ravi Kumar', 
      graduation_year: 2019, 
      current_role: 'Medical Doctor',
      achievement: 'Doctor at Government Hospital',
      success_story: 'Free education opened doors I never knew existed. Now helping others in underserved communities.',
      company_name: 'Government Medical Center',
      location: 'Mumbai, India',
      linkedin_url: 'https://linkedin.com/in/ravi-kumar',
      image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      is_featured: true
    },
    { 
      id: 3, 
      name: 'Priya Sharma', 
      graduation_year: 2021, 
      current_role: 'Teacher',
      achievement: 'Teaching at Government School',
      success_story: 'I give back by teaching underprivileged students like I once was. Education is my passion.',
      company_name: 'Government School Delhi',
      location: 'Delhi, India',
      linkedin_url: 'https://linkedin.com/in/priya-sharma',
      image_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
      is_featured: false
    },
    { 
      id: 4, 
      name: 'Arjun Singh', 
      graduation_year: 2018, 
      current_role: 'Entrepreneur',
      achievement: 'Founded education tech startup',
      success_story: 'Education changed my life. Now I want to change others through technology and innovation.',
      company_name: 'EduTech Innovations',
      location: 'Pune, India',
      linkedin_url: 'https://linkedin.com/in/arjun-singh',
      image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
      is_featured: true
    },
    { 
      id: 5, 
      name: 'Deepa Nair', 
      graduation_year: 2022, 
      current_role: 'Community Organizer',
      achievement: 'Active volunteer and mentor',
      success_story: 'Giving back to SAMARPAN and mentoring new students. Paying it forward is my mission.',
      company_name: 'SAMARPAN NGO',
      location: 'Hyderabad, India',
      linkedin_url: 'https://linkedin.com/in/deepa-nair',
      image_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
      is_featured: false
    },
    { 
      id: 6, 
      name: 'Karthik Reddy', 
      graduation_year: 2017, 
      current_role: 'NGO Director',
      achievement: 'Leading community development',
      success_story: 'Leading community development initiatives inspired by SAMARPAN. Building a better future.',
      company_name: 'Community Development Foundation',
      location: 'Chennai, India',
      linkedin_url: 'https://linkedin.com/in/karthik-reddy',
      image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      is_featured: true
    },
  ]

  const displayAlumni = alumni.length > 0 ? alumni : mockAlumni

  return (
    <div>
      {/* Hero */}
      <HeroSection
        title="Our Alumni"
        subtitle="Success Stories of Our Students"
        backgroundGradient="from-green-600 to-orange-600"
      />

      {/* Impact Stats */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-orange-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { value: '5K+', label: 'Alumni Network' },
              { value: '85%', label: 'Success Rate' },
              { value: '500+', label: 'Volunteer Contributors' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-5xl font-black mb-2">{stat.value}</div>
                <p className="text-white/80">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Alumni Stories */}
      <section className="py-20 container mx-auto px-4">
        <SectionHeading title="Alumni Success Stories" subtitle="Transforming lives, transforming society" />

        {loading ? (
          <LoadingSpinner />
        ) : displayAlumni.length > 0 ? (
          <StaggerContainer>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayAlumni.map((person, i) => (
                <StaggerItem key={person.id || i}>
                  <motion.div
                    initial={{ opacity: 0, rotateY: -20 }}
                    whileInView={{ opacity: 1, rotateY: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    whileHover={{ 
                      y: -20,
                      rotateY: 5,
                      boxShadow: "0 25px 50px rgba(0, 0, 0, 0.3)"
                    }}
                    onClick={() => setSelectedAlumnus(person)}
                    className="cursor-pointer h-full perspective"
                    style={{ perspective: "1000px" }}
                  >
                    <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 h-full flex flex-col border border-gray-100">
                      {/* Premium Image Section */}
                      <div className="relative h-80 overflow-hidden bg-gradient-to-br from-green-400 via-green-500 to-orange-500">
                        {person.image_url ? (
                          <img 
                            src={person.image_url} 
                            alt={person.name}
                            loading="lazy"
                            crossOrigin="anonymous"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            onError={(e) => {
                              e.target.style.display = 'none'
                              e.target.parentElement.innerHTML += '<div class="w-full h-full flex items-center justify-center text-8xl bg-gradient-to-br from-green-400 via-green-500 to-orange-500">🎓</div>'
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-8xl bg-gradient-to-br from-green-400 via-green-500 to-orange-500">🎓</div>
                        )}
                        
                        {/* Dark Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Floating Badge - Graduation Year */}
                        <motion.div 
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 text-xs font-bold text-green-700 shadow-lg"
                        >
                          Batch {person.graduation_year}
                        </motion.div>

                        {/* Featured Star Badge */}
                        <motion.div 
                          whileHover={{ scale: 1.2, rotate: 12 }}
                          animate={{ rotate: [0, 5, 0], scale: [1, 1.05, 1] }}
                          transition={{ duration: 3, repeat: Infinity }}
                          className="absolute top-4 left-4 bg-yellow-400 rounded-full p-3 shadow-lg"
                        >
                          <Trophy size={18} className="text-white" fill="white" />
                        </motion.div>
                      </div>

                      {/* Content Section - Enhanced Design */}
                      <div className="p-8 flex-grow flex flex-col relative">
                        {/* Accent Line */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-orange-500 to-transparent" />

                        {/* Name and Role */}
                        <div className="mb-4">
                          <h3 className="text-3xl font-black text-slate-900 mb-2 bg-gradient-to-r from-green-600 to-orange-600 bg-clip-text text-transparent">
                            {person.name}
                          </h3>
                          <div className="flex items-center gap-2 mb-2">
                            <Briefcase size={18} className="text-orange-600 flex-shrink-0" />
                            <p className="text-sm font-bold text-gray-700">
                              {person.current_role}
                            </p>
                          </div>
                        </div>

                        {/* Company Badge */}
                        {person.company_name && (
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="mb-4 inline-block bg-gradient-to-r from-green-100 to-orange-100 text-green-800 px-4 py-2 rounded-full text-xs font-bold"
                          >
                            🏢 {person.company_name}
                          </motion.div>
                        )}

                        {/* Achievement Highlight */}
                        {person.achievement && (
                          <div className="mb-5 p-4 bg-gradient-to-br from-green-50 to-orange-50 rounded-xl border-l-4 border-green-600">
                            <div className="flex items-start gap-3">
                              <Award size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                              <p className="text-sm font-semibold text-gray-800">{person.achievement}</p>
                            </div>
                          </div>
                        )}

                        {/* Story Preview */}
                        <p className="text-gray-700 text-sm leading-relaxed mb-6 flex-grow italic border-l-2 border-green-300 pl-4">
                          "{person.success_story}"
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex gap-3 mt-auto">
                          <motion.button
                            whileHover={{ 
                              scale: 1.05,
                              boxShadow: "0 10px 25px rgba(34, 197, 94, 0.3)"
                            }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedAlumnus(person)
                            }}
                            className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4 rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
                          >
                            <Target size={16} />
                            Full Story
                          </motion.button>
                          {person.linkedin_url && (
                            <motion.a
                              href={person.linkedin_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              whileHover={{ 
                                scale: 1.1,
                                boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)"
                              }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => e.stopPropagation()}
                              className="p-3 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-all shadow-md hover:shadow-lg"
                              title="View on LinkedIn"
                            >
                              <Linkedin size={20} />
                            </motion.a>
                          )}
                        </div>
                      </div>

                      {/* Card Footer Accent */}
                      <div className="h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent" />
                    </div>
                  </motion.div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        ) : (
          <div className="text-center py-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <GraduationCap size={64} className="mx-auto text-gray-300 mb-4" />
              <p className="text-2xl text-gray-600">No alumni data available</p>
              <p className="text-gray-500 mt-2">Alumni stories coming soon!</p>
            </motion.div>
          </div>
        )}
      </section>

        {/* Alumni Detail Modal - Enhanced with 3D Effects */}
        <AnimatePresence>
          {selectedAlumnus && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAlumnus(null)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              >
                {/* Premium Modal Header with Image */}
                <div className="relative h-96 bg-gradient-to-br from-green-400 via-green-500 to-orange-500 overflow-hidden">
                  {selectedAlumnus.image_url ? (
                    <img 
                      src={selectedAlumnus.image_url} 
                      alt={selectedAlumnus.name}
                      loading="lazy"
                      crossOrigin="anonymous"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.parentElement.innerHTML += '<div class="w-full h-full flex items-center justify-center text-9xl bg-gradient-to-br from-green-400 via-green-500 to-orange-500">🎓</div>'
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-9xl bg-gradient-to-br from-green-400 via-green-500 to-orange-500">🎓</div>
                  )}
                  
                  {/* Dark Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Close Button */}
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedAlumnus(null)}
                    className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-full p-3 hover:bg-white transition-all shadow-lg"
                  >
                    <X size={24} className="text-gray-900" />
                  </motion.button>

                  {/* Floating Badge */}
                  <motion.div 
                    animate={{ rotate: [0, 5, 0], scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute bottom-6 left-6 bg-yellow-400 rounded-full p-4 shadow-lg"
                  >
                    <Trophy size={24} className="text-white" fill="white" />
                  </motion.div>
                </div>

                {/* Enhanced Modal Content */}
                <div className="p-10">
                  {/* Top Section - Name and Title */}
                  <div className="mb-8">
                    <motion.h2 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-5xl font-black text-slate-900 mb-3 bg-gradient-to-r from-green-600 to-orange-600 bg-clip-text text-transparent"
                    >
                      {selectedAlumnus.name}
                    </motion.h2>
                    
                    <div className="flex flex-wrap gap-4 mb-4">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center gap-2 bg-gradient-to-r from-green-100 to-green-50 px-5 py-3 rounded-full"
                      >
                        <Briefcase size={20} className="text-green-600" />
                        <p className="font-bold text-green-700">{selectedAlumnus.current_role}</p>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center gap-2 bg-gradient-to-r from-orange-100 to-orange-50 px-5 py-3 rounded-full"
                      >
                        <GraduationCap size={20} className="text-orange-600" />
                        <p className="font-bold text-orange-700">Batch {selectedAlumnus.graduation_year}</p>
                      </motion.div>
                    </div>
                  </div>

                  {/* Two Column Layout */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    {/* Main Story - Takes 2 columns */}
                    <div className="lg:col-span-2">
                      <div className="mb-8">
                        <h3 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-2">
                          <span className="text-3xl">📖</span>
                          Success Journey
                        </h3>
                        <div className="p-6 bg-gradient-to-br from-green-50 to-orange-50 rounded-2xl border-2 border-green-200">
                          <p className="text-gray-800 leading-relaxed text-lg italic">
                            "{selectedAlumnus.success_story}"
                          </p>
                        </div>
                      </div>

                      {/* Achievement Highlight */}
                      {selectedAlumnus.achievement && (
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border-l-4 border-blue-600"
                        >
                          <div className="flex items-start gap-4">
                            <div className="p-3 bg-blue-600 rounded-lg">
                              <Award size={24} className="text-white" fill="white" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-blue-700 mb-1">ACHIEVEMENT</p>
                              <p className="text-xl font-bold text-gray-900">{selectedAlumnus.achievement}</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {/* Right Column - Details */}
                    <div className="space-y-4">
                      {/* Company Card */}
                      {selectedAlumnus.company_name && (
                        <motion.div
                          whileHover={{ scale: 1.05, y: -5 }}
                          className="p-5 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl border-2 border-orange-200 shadow-md"
                        >
                          <p className="text-xs font-bold text-orange-700 mb-2 uppercase tracking-wide">🏢 Organization</p>
                          <p className="text-lg font-black text-gray-900">{selectedAlumnus.company_name}</p>
                        </motion.div>
                      )}

                      {/* Year Badge */}
                      <motion.div
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200 shadow-md text-center"
                      >
                        <p className="text-xs font-bold text-purple-700 mb-2 uppercase tracking-wide">� Batch Year</p>
                        <p className="text-4xl font-black text-purple-600">{selectedAlumnus.graduation_year}</p>
                      </motion.div>

                      {/* LinkedIn Button */}
                      {selectedAlumnus.linkedin_url && (
                        <motion.a
                          href={selectedAlumnus.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.05, y: -5 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-full p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
                        >
                          <Linkedin size={20} />
                          Connect
                        </motion.a>
                      )}
                    </div>
                  </div>

                  {/* Action Footer */}
                  <div className="pt-6 border-t-2 border-gray-100">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedAlumnus(null)}
                      className="w-full py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-xl hover:shadow-lg transition-all"
                    >
                      ← Back to Alumni
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      {/* Alumni Programs - Staying Connected */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4">
          <SectionHeading title="Alumni Programs" subtitle="Staying connected and giving back" />
          <StaggerContainer>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: BookOpen, title: 'Mentorship Program', desc: 'Alumni mentoring current students' },
                { icon: Award, title: 'Leadership Forum', desc: 'Monthly meetups and skill sharing' },
                { icon: Star, title: 'Giving Back', desc: 'Scholarship & support for new students' },
              ].map((prog, i) => (
                <StaggerItem key={i}>
                  <AnimatedCard className="text-center h-full">
                    <div className="p-8">
                      <div className="p-4 rounded-full w-fit mx-auto mb-6 bg-green-100 text-green-600">
                        <prog.icon size={32} />
                      </div>
                      <h3 className="text-2xl font-bold mb-3 text-slate-900">{prog.title}</h3>
                      <p className="text-gray-600">{prog.desc}</p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        className="mt-6 text-green-600 font-semibold hover:text-green-700 transition-colors"
                      >
                        Learn More →
                      </motion.button>
                    </div>
                  </AnimatedCard>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </div>
      </section>

      {/* Join Alumni Network */}
      <section className="py-20 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl font-black mb-4 text-slate-900">Join the Alumni Network</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect with fellow alumni, share your success story, and help us transform more lives.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-green-600 text-white px-8 py-4 rounded-full font-bold hover:bg-green-700 transition-all inline-block"
            >
              Register as Alumni
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white border-2 border-green-600 text-green-600 px-8 py-4 rounded-full font-bold hover:bg-green-50 transition-all inline-block"
            >
              Share Your Story
            </motion.button>
          </div>
        </motion.div>
      </section>
    </div>
  )
}