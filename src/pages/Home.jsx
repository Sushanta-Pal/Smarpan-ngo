import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Heart, Calendar, Users, Zap, Target, Award, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AnimatedCard, SectionHeading, StaggerContainer, StaggerItem, LoadingSpinner } from '../components/animated/index.jsx'
import { fetchEvents } from '../lib/supabase'

// 5 High-Quality Placeholder Images for the Slider (You can replace URLs with your actual photos)
const heroSlides = [
  {
    url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop',
    timestamp: 'Est. 2015',
    caption: 'The Journey Begins at HIT Campus'
  },
  {
    url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2070&auto=format&fit=crop',
    timestamp: '2018 Milestone',
    caption: 'Reaching 100+ Students'
  },
  {
    url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2070&auto=format&fit=crop',
    timestamp: '2020 Adaptation',
    caption: 'Digital Learning During Covid'
  },
  {
    url: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=2070&auto=format&fit=crop',
    timestamp: '2022 Expansion',
    caption: 'Opening New Learning Centers'
  },
  {
    url: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=2070&auto=format&fit=crop',
    timestamp: 'Present Day',
    caption: '15+ Centers & Growing Strong'
  }
]

export default function Home() {
  const [featuredEvents, setFeaturedEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)

  // Fetch Events
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const events = await fetchEvents()
        setFeaturedEvents(events.slice(0, 3))
      } catch (error) {
        console.error('Error loading events:', error)
      } finally {
        setLoading(false)
      }
    }
    loadEvents()
  }, [])

  // Auto-advance the Hero Slider every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const features = [
    { icon: Heart, title: 'Our Mission', desc: 'Providing free quality education to underprivileged children.', color: 'bg-orange-100 text-orange-600' },
    { icon: Calendar, title: 'Events & Programs', desc: 'Regular learning drives and educational activities.', color: 'bg-yellow-100 text-yellow-600' },
    { icon: Users, title: 'Community', desc: 'Join thousands of volunteers making a difference.', color: 'bg-red-100 text-red-600' },
  ]

  const stats = [
    { label: 'Children Educated', value: '100+' },
    { label: 'Active Volunteers', value: '50+' },
    { label: 'Learning Centers', value: '15+' },
    { label: 'Years of Service', value: '10+' },
  ]

  return (
    <div className="bg-gray-50">
      
      {/* PROFESSIONAL HERO SLIDER SECTION */}
      <section className="relative h-[85vh] md:h-[90vh] w-full overflow-hidden bg-slate-900 flex items-center justify-center">
        {/* Animated Background Images */}
        <AnimatePresence mode="wait">
          <motion.img
            key={currentSlide}
            src={heroSlides[currentSlide].url}
            alt={heroSlides[currentSlide].caption}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>

        {/* Elegant Dark Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 z-10" />

        {/* Hero Content */}
        <div className="relative z-20 text-center px-4 max-w-5xl mx-auto mt-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <h1 className="text-6xl md:text-8xl font-black text-white mb-4 tracking-tight drop-shadow-2xl">
              SAMARPAN
            </h1>
            <p className="text-2xl md:text-3xl font-bold text-orange-400 mb-12 tracking-widest drop-shadow-lg uppercase">
              Ek Soch, Ek Viswas
            </p>

            {/* Dynamic Timestamp & Caption Badge */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="inline-flex flex-col md:flex-row items-center gap-3 md:gap-6 bg-white/10 backdrop-blur-md border border-white/20 px-8 py-4 rounded-full shadow-2xl"
              >
                <div className="flex items-center gap-2 text-orange-400 font-bold">
                  <Clock size={20} />
                  <span>{heroSlides[currentSlide].timestamp}</span>
                </div>
                <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-white/50" />
                <span className="text-white font-medium text-lg">
                  {heroSlides[currentSlide].caption}
                </span>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Slider Indicator Dots */}
        <div className="absolute bottom-10 left-0 right-0 z-20 flex justify-center gap-3">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`transition-all duration-500 rounded-full ${
                currentSlide === idx 
                  ? 'w-10 h-3 bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.8)]' 
                  : 'w-3 h-3 bg-white/50 hover:bg-white'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 container mx-auto px-4">
        <SectionHeading title="What We Do" subtitle="Making education accessible to every child" />
        <StaggerContainer>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((item, i) => (
              <StaggerItem key={i}>
                <AnimatedCard className="text-center h-full border border-gray-100 shadow-sm hover:shadow-xl transition-all">
                  <div className="p-10">
                    <div className={`p-5 rounded-full w-fit mx-auto mb-6 ${item.color}`}>
                      <item.icon size={32} />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-slate-900">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                  </div>
                </AnimatedCard>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-gradient-to-r from-orange-600 via-orange-500 to-red-600 text-white relative overflow-hidden">
        {/* Decorative background circle */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <SectionHeading title="Our Impact" className="text-white" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 max-w-5xl mx-auto">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <div className="text-5xl md:text-6xl font-black mb-3 drop-shadow-lg">{stat.value}</div>
                <p className="text-white/90 font-medium tracking-wide uppercase text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events (Changed to "Our Events") */}
      <section className="py-24 container mx-auto px-4">
        <SectionHeading title="Our Events" subtitle="Join us in making a difference" />
        {loading ? (
          <LoadingSpinner />
        ) : featuredEvents.length > 0 ? (
          <StaggerContainer>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredEvents.map((event, i) => (
                <StaggerItem key={event.id || i}>
                  <AnimatedCard className="border border-gray-100 shadow-sm hover:shadow-2xl transition-all">
                    <div className="p-8">
                      <div className="mb-6">
                        <span className="bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                          {event.event_type || 'Event'}
                        </span>
                      </div>
                      <h3 className="text-2xl font-black mb-3 text-slate-900 line-clamp-2">{event.title}</h3>
                      <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">{event.description}</p>
                      
                      <div className="pt-6 border-t border-gray-100 space-y-3">
                        <div className="flex items-center text-sm text-gray-600 font-medium">
                          <Calendar size={18} className="mr-3 text-orange-500" />
                          {new Date(event.event_date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                        <div className="flex items-center text-sm text-gray-600 font-medium">
                          <Users size={18} className="mr-3 text-orange-500" />
                          {event.expected_attendees || 'TBA'} participants expected
                        </div>
                      </div>
                    </div>
                  </AnimatedCard>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm max-w-2xl mx-auto">
            <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-lg text-gray-500 font-medium">No events scheduled yet. Check back soon!</p>
          </div>
        )}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-16"
        >
          <Link
            to="/events"
            className="inline-flex items-center justify-center bg-slate-900 text-white px-8 py-4 rounded-full font-bold hover:bg-orange-600 transition-colors shadow-lg hover:shadow-xl group"
          >
            Explore All Events 
            <ArrowRight className="inline ml-2 group-hover:translate-x-1 transition-transform" size={20} />
          </Link>
        </motion.div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl text-gray-400 mb-10 leading-relaxed">
              Join our community of volunteers and donors in transforming lives through education. Every little effort counts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/donate"
                className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-10 py-4 rounded-full font-bold hover:shadow-lg hover:shadow-orange-500/30 transition-all hover:-translate-y-1 inline-block"
              >
                Donate Now
              </Link>
              <Link
                to="/contact"
                className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-10 py-4 rounded-full font-bold hover:bg-white hover:text-slate-900 transition-all hover:-translate-y-1 inline-block"
              >
                Get Involved
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}