import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react'
import { HeroSection, AnimatedCard, SectionHeading, StaggerContainer, StaggerItem, LoadingSpinner } from '../components/animated/index.jsx'
import { useQuery } from '@tanstack/react-query'
import { fetchGalleryImages } from '../lib/supabase'


  export default function Gallery() {
  const { data: images = [], isLoading: loading } = useQuery({
    queryKey: ['galleryImages'],
    queryFn: fetchGalleryImages,
  })
  const [selectedImage, setSelectedImage] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [filter, setFilter] = useState('all')

 

  const categoryFilters = ['all']
  // Just use the images array directly from React Query! No mock data needed.
  const filteredImages = filter === 'all' ? images : images.filter(img => img.category === filter)
  const handleNextImage = () => {
    if (selectedImage?.images) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedImage.images.length)
    }
  }

  const handlePrevImage = () => {
    if (selectedImage?.images) {
      setCurrentImageIndex((prev) => (prev - 1 + selectedImage.images.length) % selectedImage.images.length)
    }
  }

  return (
    <div>
      {/* Hero */}
      <HeroSection
        title="Our Gallery"
        subtitle="Moments of Impact and Growth"
        backgroundGradient="from-purple-600 to-pink-600"
      />

      {/* Filter */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {categoryFilters.map((cat) => (
              <motion.button
                key={cat}
                onClick={() => setFilter(cat)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-8 py-3 rounded-full font-bold capitalize transition-all shadow-md ${
                  filter === cat
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'bg-gray-100 text-slate-900 hover:bg-gray-200'
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20 container mx-auto px-4">
        <SectionHeading title="Photo Gallery" subtitle="Celebrating our journey together" />

        {loading ? (
          <LoadingSpinner />
        ) : filteredImages.length > 0 ? (
          <StaggerContainer>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredImages.map((image, i) => (
                <StaggerItem key={image.id || i}>
                  <motion.div
                    whileHover={{ y: -12, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
                    onClick={() => {
                      setSelectedImage(image)
                      setCurrentImageIndex(0)
                    }}
                    className="cursor-pointer h-full"
                  >
                    <AnimatedCard>
                      <div className="overflow-hidden h-full flex flex-col bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
                        {/* Image Section with Enhanced Overlay */}
                        {image.image_url ? (
                          <div className="relative h-64 bg-gradient-to-br from-purple-300 to-pink-300 overflow-hidden group">
                            <img
                              src={image.image_url}
                              alt={image.title}
                              loading="lazy"
                              crossOrigin="anonymous"
                              className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-500"
                              onError={(e) => {
                                e.target.style.display = 'none'
                                e.target.parentElement.innerHTML += '<div class="w-full h-full flex items-center justify-center text-white font-bold bg-gradient-to-br from-purple-300 to-pink-300"><div class="text-6xl">📸</div></div>'
                              }}
                            />
                            {/* Enhanced Overlay on Hover */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-300" />
                            
                            {/* Image Count Badge */}
                            {image.images && image.images.length > 1 && (
                              <motion.div 
                                whileHover={{ scale: 1.1 }}
                                className="absolute top-4 right-4 bg-white bg-opacity-95 text-purple-600 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg"
                              >
                                <ImageIcon size={16} />
                                {image.images.length} Photos
                              </motion.div>
                            )}
                          </div>
                        ) : (
                          <div className="relative h-64 bg-gradient-to-br from-purple-300 to-pink-300 overflow-hidden group flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-6xl mb-4">📸</div>
                              <p className="text-white font-semibold">{image.title}</p>
                            </div>
                          </div>
                        )}
                        
                        {/* Content Section */}
                        <div className="p-7 flex-1 flex flex-col">
                          {/* Category Badge */}
                          <div className="mb-4">
                            <motion.span 
                              whileHover={{ scale: 1.05 }}
                              className="inline-block bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
                            >
                              🖼️ Gallery
                            </motion.span>
                          </div>
                          
                          {/* Title */}
                          <h3 className="text-2xl font-black mb-3 text-slate-900 line-clamp-2 group-hover:text-purple-600 transition-colors duration-300">
                            {image.title}
                          </h3>
                          
                          {/* Image Count Info */}
                          {image.images && image.images.length > 0 && (
                            <p className="text-sm text-gray-500 mb-4 font-semibold">
                              ✨ {image.images.length} {image.images.length === 1 ? 'photo' : 'photos'}
                            </p>
                          )}
                          
                          {/* Description */}
                          <p className="text-gray-600 mb-6 line-clamp-2 text-sm leading-relaxed flex-1 font-medium">
                            Click to view all moments from this collection
                          </p>

                          {/* Action Button */}
                          <motion.button
                            whileHover={{ 
                              scale: 1.02,
                              boxShadow: "0 10px 25px -5px rgba(168, 85, 247, 0.3)"
                            }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center justify-center gap-2 text-sm shadow-md group"
                          >
                            <span>View Collection</span>
                            <motion.div
                              className="group-hover:translate-x-1 transition-transform"
                            >
                              <ChevronRight size={16} />
                            </motion.div>
                          </motion.button>
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
              <ImageIcon size={64} className="mx-auto text-gray-300 mb-4" />
              <p className="text-2xl text-gray-600">No photos available</p>
              <p className="text-gray-500 mt-2">Check back soon for new moments!</p>
            </motion.div>
          </div>
        )}
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-6 flex items-center justify-between z-10">
                <h2 className="text-3xl font-black text-white">{selectedImage.title}</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedImage(null)}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all"
                >
                  <X size={24} />
                </motion.button>
              </div>

              <div className="p-8">
                {/* Image Gallery */}
                {selectedImage.images && selectedImage.images.length > 0 ? (
                  <div className="mb-8">
                    <div className="relative bg-black rounded-xl overflow-hidden mb-4">
                      <div className="aspect-video flex items-center justify-center bg-gray-800">
                        <img
                          key={selectedImage.images[currentImageIndex]}
                          src={selectedImage.images[currentImageIndex]}
                          alt={`${selectedImage.title} - Image ${currentImageIndex + 1}`}
                          loading="lazy"
                          crossOrigin="anonymous"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none'
                            e.target.parentElement.innerHTML += '<div class="w-full h-full flex items-center justify-center text-white font-bold text-2xl"><span>Unable to Load Image</span></div>'
                          }}
                        />
                      </div>

                      {/* Navigation Buttons */}
                      {selectedImage.images.length > 1 && (
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
                            {currentImageIndex + 1} / {selectedImage.images.length}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Thumbnail Strip */}
                    {selectedImage.images.length > 1 && (
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {selectedImage.images.map((img, idx) => (
                          <motion.button
                            key={idx}
                            whileHover={{ scale: 1.05 }}
                            onClick={() => setCurrentImageIndex(idx)}
                            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                              idx === currentImageIndex
                                ? 'border-purple-600 ring-2 ring-purple-300'
                                : 'border-gray-300 hover:border-purple-600'
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
                ) : (
                  <div className="flex items-center justify-center h-96 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl mb-8">
                    <div className="text-center">
                      <div className="text-8xl mb-4">📸</div>
                      <p className="text-xl text-gray-600 font-semibold">No images in this collection</p>
                    </div>
                  </div>
                )}

                {/* Description Section */}
                <div className="border-t-2 border-gray-100 pt-6 mt-6">
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">Collection Details</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {selectedImage.images && selectedImage.images.length > 0
                      ? `This collection contains ${selectedImage.images.length} beautiful ${selectedImage.images.length === 1 ? 'moment' : 'moments'} captured from our community. Explore each photo to see the details.`
                      : 'This collection will showcase our special moments soon.'}
                  </p>
                  <div className="flex gap-4 mt-6">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedImage(null)}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-bold hover:from-purple-700 hover:to-pink-700 transition-all"
                    >
                      Close Gallery
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}