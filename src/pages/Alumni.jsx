import React, { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Award, Briefcase, GraduationCap, Linkedin, X, Trophy, BookOpen, Search, ChevronDown, Building2 } from 'lucide-react'
import { HeroSection, SectionHeading, StaggerContainer, StaggerItem, LoadingSpinner } from '../components/animated/index.jsx'
import { useQuery } from '@tanstack/react-query'
import { fetchAlumni, supabase } from '../lib/supabase'

export default function Alumni() {
  const { data: alumni = [], isLoading: loading } = useQuery({
    queryKey: ['alumni'],
    queryFn: fetchAlumni,
  })
  
  const [selectedAlumnus, setSelectedAlumnus] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [visibleCount, setVisibleCount] = useState(12) // Performance: Load 12 initially

  // Reset pagination when searching
  useEffect(() => {
    setVisibleCount(12)
  }, [searchTerm])

  // Helper to convert relative DB paths to public Supabase URLs
  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path; 
    const cleanPath = path.replace(/^alumni\//, '');
    const { data } = supabase.storage.from('alumni').getPublicUrl(cleanPath);
    return data.publicUrl;
  };

  // Filter and Sort Logic based ONLY on accurate DB fields
  const filteredAndSortedAlumni = useMemo(() => {
    let result = [...alumni];

    if (searchTerm) {
      const lowerQuery = searchTerm.toLowerCase();
      result = result.filter(person => 
        (person.name && person.name.toLowerCase().includes(lowerQuery)) ||
        (person.company_name && person.company_name.toLowerCase().includes(lowerQuery)) ||
        (person.graduation_year && person.graduation_year.toString().includes(lowerQuery))
      );
    }

    // Sort Descending: Newest batches first
    result.sort((a, b) => {
      const yearA = a.graduation_year || 0;
      const yearB = b.graduation_year || 0;
      return yearB - yearA;
    });

    return result;
  }, [alumni, searchTerm]);

  const displayedAlumni = filteredAndSortedAlumni.slice(0, visibleCount);
  const hasMore = visibleCount < filteredAndSortedAlumni.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <HeroSection
        title="Our Alumni Network"
        subtitle="Discover the inspiring journeys of our graduates making a difference worldwide."
        backgroundGradient="from-green-700 via-green-600 to-orange-500"
      />

      {/* Main Directory */}
      <section className="py-16 container mx-auto px-4">
        <SectionHeading title="Meet Our Alumni" subtitle="Connect with the brightest minds from our batches" />

        {/* Pro Search Bar */}
        <div className="max-w-3xl mx-auto mb-16 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-orange-400 rounded-2xl blur opacity-25 group-focus-within:opacity-40 transition-opacity"></div>
            <div className="relative bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center overflow-hidden">
              <div className="pl-6 text-gray-400">
                <Search className="w-6 h-6" />
              </div>
              <input
                type="text"
                placeholder="Search by name, company, or batch (e.g., 2026)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-5 outline-none text-gray-700 text-lg bg-transparent font-medium placeholder-gray-400"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="pr-6 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              )}
            </div>
          </motion.div>
        </div>

        {/* Results Grid */}
        {loading ? (
          <LoadingSpinner />
        ) : displayedAlumni.length > 0 ? (
          <>
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              <AnimatePresence>
                {displayedAlumni.map((person) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    key={person.id}
                    className="flex h-full"
                  >
                    <div className="bg-white rounded-[2rem] overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 w-full flex flex-col border border-gray-100 group">
                      
                      {/* Image Section - Perfect Aspect Ratio */}
                      <div 
                        className="relative aspect-[4/5] overflow-hidden bg-gray-100 cursor-pointer"
                        onClick={() => setSelectedAlumnus(person)}
                      >
                        {person.image_url ? (
                          <img 
                            src={getImageUrl(person.image_url)} 
                            alt={person.name}
                            loading="lazy"
                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-in-out"
                            onError={(e) => {
                              e.target.style.display = 'none'
                              e.target.parentElement.innerHTML += '<div class="w-full h-full flex items-center justify-center text-7xl bg-gradient-to-br from-green-50 to-orange-50 text-green-200">🎓</div>'
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-7xl bg-gradient-to-br from-green-50 to-orange-50">🎓</div>
                        )}
                        
                        {/* Overlay Gradient for readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                        
                        {/* Top Badges */}
                        <div className="absolute top-4 inset-x-4 flex justify-between items-start pointer-events-none">
                          {person.is_featured ? (
                            <div className="bg-yellow-400 text-yellow-900 rounded-full p-2 shadow-lg backdrop-blur-md">
                              <Trophy size={16} fill="currentColor" />
                            </div>
                          ) : <div />}
                          
                          {/* Batch Badge */}
                          <div className="bg-white/95 backdrop-blur-md rounded-full px-4 py-1.5 text-xs font-bold text-green-700 shadow-sm border border-green-50">
                            Batch {person.graduation_year}
                          </div>
                        </div>
                      </div>

                      {/* Info Section Below Image */}
                      <div className="p-6 flex flex-col flex-grow bg-white relative z-10">
                        <div className="mb-4 flex-grow">
                          <h3 
                            className="text-2xl font-bold text-slate-900 mb-1 cursor-pointer hover:text-green-600 transition-colors line-clamp-1"
                            onClick={() => setSelectedAlumnus(person)}
                          >
                            {person.name}
                          </h3>
                          
                          <p className="text-green-600 font-semibold text-sm flex items-center gap-1.5 mb-2 line-clamp-1">
                            <Briefcase size={16} />
                            {person.current_role}
                          </p>

                          {person.company_name && person.company_name !== 'Not specified' && (
                            <p className="text-gray-500 font-medium text-sm flex items-center gap-1.5 line-clamp-1">
                              <Building2 size={16} />
                              {person.company_name}
                            </p>
                          )}
                        </div>

                        {/* Direct Action Buttons on Card */}
                        <div className="flex gap-3 pt-4 border-t border-gray-100 mt-auto">
                          {person.linkedin_url ? (
                            <a
                              href={person.linkedin_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 bg-[#0A66C2] hover:bg-[#004182] text-white py-2.5 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md text-sm"
                              onClick={(e) => e.stopPropagation()} // Prevents opening modal when clicking connect
                            >
                              <Linkedin size={18} /> Connect
                            </a>
                          ) : (
                            <div className="flex-1 bg-gray-50 text-gray-400 py-2.5 px-4 rounded-xl font-semibold flex items-center justify-center text-sm cursor-not-allowed border border-gray-100">
                              No LinkedIn
                            </div>
                          )}
                          <button
                            onClick={() => setSelectedAlumnus(person)}
                            className="bg-green-50 hover:bg-green-100 text-green-700 py-2.5 px-5 rounded-xl font-bold transition-colors text-sm border border-green-100"
                          >
                            Story
                          </button>
                        </div>
                      </div>

                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Load More Button for performance */}
            {hasMore && (
              <div className="mt-16 flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setVisibleCount(prev => prev + 12)}
                  className="flex items-center gap-2 px-8 py-4 bg-white text-green-600 font-bold rounded-full shadow-md border border-green-100 hover:bg-green-50 transition-colors"
                >
                  Load More Profiles <ChevronDown size={20} />
                </motion.button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm max-w-2xl mx-auto">
            <GraduationCap size={64} className="mx-auto text-gray-300 mb-6" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No profiles found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm ? "We couldn't find anyone matching your search criteria." : "Our alumni directory is currently empty."}
            </p>
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')} 
                className="bg-green-100 text-green-700 px-6 py-3 rounded-full font-bold hover:bg-green-200 transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </section>

      {/* Alumni Detail Modal */}
      <AnimatePresence>
        {selectedAlumnus && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedAlumnus(null)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-[2rem] max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col md:flex-row"
            >
              {/* Left Side: Image */}
              <div className="relative w-full md:w-2/5 h-64 md:h-auto bg-gray-100 shrink-0">
                {selectedAlumnus.image_url ? (
                  <img 
                    src={getImageUrl(selectedAlumnus.image_url)} 
                    alt={selectedAlumnus.name}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-8xl bg-gradient-to-br from-green-50 to-orange-50">🎓</div>
                )}
                
                {/* Mobile Close Button */}
                <button
                  onClick={() => setSelectedAlumnus(null)}
                  className="md:hidden absolute top-4 right-4 bg-white/80 backdrop-blur-md rounded-full p-2 hover:bg-white transition-all shadow-sm"
                >
                  <X size={20} className="text-gray-900" />
                </button>
              </div>

              {/* Right Side: Content */}
              <div className="p-8 md:p-10 flex-1 overflow-y-auto custom-scrollbar relative flex flex-col">
                {/* Desktop Close Button */}
                <button
                  onClick={() => setSelectedAlumnus(null)}
                  className="hidden md:block absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors"
                >
                  <X size={24} />
                </button>

                <div className="mb-6 pr-8">
                  <h2 className="text-4xl font-black text-slate-900 mb-2">
                    {selectedAlumnus.name}
                  </h2>
                  <p className="text-xl text-green-600 font-semibold mb-6 flex items-center gap-2">
                    <Briefcase size={20} /> {selectedAlumnus.current_role}
                  </p>
                  
                  <div className="flex flex-wrap gap-3 mb-8">
                    {selectedAlumnus.company_name && selectedAlumnus.company_name !== 'Not specified' && (
                      <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl text-slate-700 font-medium text-sm">
                        <Building2 size={16} /> {selectedAlumnus.company_name}
                      </div>
                    )}
                    <div className="flex items-center gap-2 bg-orange-50 text-orange-700 px-4 py-2 rounded-xl font-medium text-sm">
                      <GraduationCap size={16} /> Batch {selectedAlumnus.graduation_year}
                    </div>
                  </div>
                </div>

                <div className="mb-8 flex-grow">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 uppercase tracking-wider border-b border-gray-100 pb-2">Success Journey</h3>
                  <div className="relative pt-2">
                    {selectedAlumnus.success_story ? (
                      <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-wrap">
                        {selectedAlumnus.success_story}
                      </p>
                    ) : (
                      <p className="text-gray-400 italic">No story provided yet.</p>
                    )}
                  </div>
                </div>

                {/* Modal Connect Button */}
                <div className="pt-6 border-t border-gray-100 mt-auto">
                  {selectedAlumnus.linkedin_url && (
                    <motion.a
                      href={selectedAlumnus.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-4 bg-[#0A66C2] text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                    >
                      <Linkedin size={20} />
                      Connect on LinkedIn
                    </motion.a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}