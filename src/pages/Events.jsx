import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, MapPin, Users, ArrowRight, Filter, X, ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react'
import { HeroSection, AnimatedCard, SectionHeading, StaggerContainer, StaggerItem, LoadingSpinner } from '../components/animated/index.jsx'
import { useQuery } from '@tanstack/react-query'
import { fetchEvents } from '../lib/supabase'

export default function Events() {
  // 1. Replaced useEvents with React Query
  const { data: events = [], isLoading: loading } = useQuery({
    queryKey: ['events'],
    queryFn: fetchEvents,
  })
  
  const [filteredEvents, setFilteredEvents] = useState([])
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    if (selectedFilter === 'all') {
      setFilteredEvents(events)
    } else if (selectedFilter === 'upcoming') {
      setFilteredEvents(events.filter(e => new Date(e.event_date) > new Date()))
    } else {
      setFilteredEvents(events.filter(e => e.event_type === selectedFilter))
    }
  }, [events, selectedFilter])

  const eventTypes = ['all']

  const handleNextImage = () => {
    if (selectedEvent?.images) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedEvent.images.length)
    }
  }

  const handlePrevImage = () => {
    if (selectedEvent?.images) {
      setCurrentImageIndex((prev) => (prev - 1 + selectedEvent.images.length) % selectedEvent.images.length)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div>
      {/* Hero */}
      <HeroSection
        title="Events & Programs"
        subtitle="Join us in making a difference through our events and initiatives"
        backgroundGradient="from-yellow-600 to-orange-600"
      />

      {/* Filter Section */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 justify-center items-center">
            <Filter size={20} className="text-orange-600" />
            {eventTypes.map((type) => (
              <motion.button
                key={type}
                onClick={() => setSelectedFilter(type)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-2 rounded-full font-semibold capitalize transition-all ${
                  selectedFilter === type
                    ? 'bg-orange-600 text-white shadow-lg'
                    : 'bg-gray-100 text-slate-900 hover:bg-gray-200'
                }`}
              >
                {type}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-20 container mx-auto px-4">
        <SectionHeading title="Our Events" subtitle="Explore all our programs, initiatives and celebrations" />

        {loading ? (
          <LoadingSpinner />
        ) : filteredEvents.length > 0 ? (
          <StaggerContainer>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event, i) => (
                <StaggerItem key={event.id || i}>
                  <motion.div
                    whileHover={{ y: -12, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
                    onClick={() => {
                      setSelectedEvent(event)
                      setCurrentImageIndex(0)
                    }}
                    className="cursor-pointer h-full"
                  >
                    <AnimatedCard>
                      <div className="overflow-hidden h-full flex flex-col bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
                        {/* Image Section with Enhanced Overlay */}
                        {event.image_url && (
                          <div className="relative h-64 bg-gradient-to-br from-orange-300 to-red-300 overflow-hidden group">
                            <img 
                              src={event.image_url} 
                              alt={event.title}
                              loading="lazy"
                              crossOrigin="anonymous"
                              className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-500"
                              onError={(e) => {
                                e.target.style.display = 'none'
                                e.target.parentElement.innerHTML += '<div class="w-full h-full flex items-center justify-center text-white font-bold bg-gradient-to-br from-orange-300 to-red-300"><span>Loading Image...</span></div>'
                              }}
                            />
                            {/* Enhanced Overlay on Hover */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-300" />
                            
                            {/* Image Count Badge */}
                            {event.images && event.images.length > 1 && (
                              <motion.div 
                                whileHover={{ scale: 1.1 }}
                                className="absolute top-4 right-4 bg-white bg-opacity-95 text-orange-600 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg"
                              >
                                <ImageIcon size={16} />
                                {event.images.length} Photos
                              </motion.div>
                            )}
                            
                            {/* Date Badge */}
                            <motion.div 
                              whileHover={{ scale: 1.05 }}
                              className="absolute bottom-4 left-4 bg-orange-600 bg-opacity-95 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-lg"
                            >
                              {new Date(event.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </motion.div>
                          </div>
                        )}
                        
                        {/* Content Section */}
                        <div className="p-7 flex-1 flex flex-col">
                          {/* Category Badge */}
                          <div className="mb-4 flex items-center gap-2">
                            <motion.span 
                              whileHover={{ scale: 1.05 }}
                              className="inline-block bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
                            >
                              🎉 Event
                            </motion.span>
                          </div>
                          
                          {/* Title */}
                          <h3 className="text-2xl font-black mb-3 text-slate-900 line-clamp-2 group-hover:text-orange-600 transition-colors duration-300">
                            {event.title}
                          </h3>
                          
                          {/* Description */}
                          <p className="text-gray-600 mb-5 line-clamp-3 text-sm leading-relaxed flex-1 font-medium">
                            {event.description}
                          </p>
                          
                          {/* Date and Info Section */}
                          <div className="space-y-3 mb-6 pt-5 border-t-2 border-gray-100">
                            <div className="flex items-center text-gray-800 text-sm font-semibold">
                              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                                <Calendar size={18} className="text-orange-600" />
                              </div>
                              <span>{formatDate(event.event_date)}</span>
                            </div>
                          </div>

                          {/* Action Button */}
                          <motion.button
                            whileHover={{ 
                              scale: 1.02,
                              boxShadow: "0 10px 25px -5px rgba(234, 88, 12, 0.3)"
                            }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-gradient-to-r from-orange-600 to-orange-700 text-white py-3 px-4 rounded-xl font-bold hover:from-orange-700 hover:to-orange-800 transition-all duration-300 flex items-center justify-center gap-2 text-sm shadow-md group"
                          >
                            <span>View Full Event</span>
                            <motion.div
                              className="group-hover:translate-x-1 transition-transform"
                            >
                              <ArrowRight size={16} />
                            </motion.div>
                          </motion.button>
                          
                          {/* Additional Info */}
                          <div className="mt-4 text-center text-xs text-gray-500 font-medium">
                            {event.images && event.images.length > 0 && (
                              <p>✨ Click to see all {event.images.length} moments</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </AnimatedCard>
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
              <Calendar size={64} className="mx-auto text-gray-300 mb-4" />
              <p className="text-2xl text-gray-600">No events found</p>
              <p className="text-gray-500 mt-2">Check back soon for upcoming programs!</p>
            </motion.div>
          </div>
        )}
      </section>

      {/* Event Details Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-orange-600 to-red-600 px-8 py-6 flex items-center justify-between z-10">
                <h2 className="text-3xl font-black text-white">{selectedEvent.title}</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedEvent(null)}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all"
                >
                  <X size={24} />
                </motion.button>
              </div>

              <div className="p-8">
                {/* Image Gallery */}
                {selectedEvent.images && selectedEvent.images.length > 0 && (
                  <div className="mb-8">
                    <div className="relative bg-black rounded-xl overflow-hidden mb-4">
                      <div className="aspect-video flex items-center justify-center bg-gray-800">
                        <img
                          key={selectedEvent.images[currentImageIndex]}
                          src={selectedEvent.images[currentImageIndex]}
                          alt={`${selectedEvent.title} - Image ${currentImageIndex + 1}`}
                          loading="lazy"
                          crossOrigin="anonymous"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none'
                            e.target.parentElement.innerHTML += '<div class="w-full h-full flex items-center justify-center text-white font-bold"><span>Unable to Load Image</span></div>'
                          }}
                        />
                      </div>

                      {/* Navigation Buttons */}
                      {selectedEvent.images.length > 1 && (
                        <>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handlePrevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-black p-2 rounded-full transition-all z-10"
                          >
                            <ChevronLeft size={24} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleNextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-black p-2 rounded-full transition-all z-10"
                          >
                            <ChevronRight size={24} />
                          </motion.button>

                          {/* Image Counter */}
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-60 text-white px-4 py-2 rounded-full text-sm font-semibold">
                            {currentImageIndex + 1} / {selectedEvent.images.length}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Thumbnail Strip */}
                    {selectedEvent.images.length > 1 && (
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {selectedEvent.images.map((img, idx) => (
                          <motion.button
                            key={idx}
                            whileHover={{ scale: 1.05 }}
                            onClick={() => setCurrentImageIndex(idx)}
                            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                              idx === currentImageIndex
                                ? 'border-orange-600 ring-2 ring-orange-300'
                                : 'border-gray-300 hover:border-orange-600'
                            }`}
                          >
                            <img
                              src={img}
                              alt={`Thumbnail ${idx + 1}`}
                              loading="lazy"
                              crossOrigin="anonymous"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none'
                              }}
                            />
                          </motion.button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Event Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 pb-8 border-b border-gray-200">
                  <div className="flex items-start gap-4">
                    <div className="bg-orange-100 p-3 rounded-lg flex-shrink-0">
                      <Calendar size={24} className="text-orange-600" />
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm font-semibold uppercase">Date</p>
                      <p className="text-lg font-bold text-slate-900 mt-1">{formatDate(selectedEvent.event_date)}</p>
                    </div>
                  </div>
                </div>

                {/* Event Description */}
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">About This Event</h3>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {selectedEvent.description}
                    </p>
                  </div>
                </div>

                {/* Close Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedEvent(null)}
                  className="w-full mt-8 bg-orange-600 text-white py-3 rounded-lg font-bold hover:bg-orange-700 transition-all"
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-orange-100 to-red-100">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-black mb-4 text-slate-900">Can't find what you're looking for?</h2>
            <p className="text-xl text-gray-600 mb-8">Subscribe to our newsletter for updates on new programs and events.</p>
            <div className="max-w-md mx-auto flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border-2 border-orange-300 focus:outline-none focus:border-orange-600"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-all"
              >
                Subscribe
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}