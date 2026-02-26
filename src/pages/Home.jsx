import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Heart, Calendar, Users, Zap, Target, Award } from 'lucide-react'
import { Link } from 'react-router-dom'
import { HeroSection, AnimatedCard, SectionHeading, StaggerContainer, StaggerItem, FloatingShapes, LoadingSpinner } from '../components/animated/index.jsx'
import { fetchEvents } from '../lib/supabase'

export default function Home() {
  const [featuredEvents, setFeaturedEvents] = useState([])
  const [loading, setLoading] = useState(true)

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

  const features = [
    { icon: Heart, title: 'Our Mission', desc: 'Providing free quality education to underprivileged children.', color: 'bg-orange-100 text-orange-600' },
    { icon: Calendar, title: 'Events & Programs', desc: 'Regular learning drives and educational activities.', color: 'bg-yellow-100 text-yellow-600' },
    { icon: Users, title: 'Community', desc: 'Join thousands of volunteers making a difference.', color: 'bg-red-100 text-red-600' },
  ]

  const stats = [
    { label: 'Children Educated', value: '5000+' },
    { label: 'Active Volunteers', value: '500+' },
    { label: 'Learning Centers', value: '15+' },
    { label: 'Years of Service', value: '10+' },
  ]

  return (
    <div>
      {/* Hero Section */}
      <HeroSection title="SAMARPAN" subtitle="EK SOCH, EK VISWAS">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <Link
            to="/donate"
            className="inline-block bg-white text-orange-600 px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl transition-all hover:scale-105"
          >
            Support Our Mission
          </Link>
        </motion.div>
      </HeroSection>

      {/* Features Section */}
      <section className="py-20 container mx-auto px-4">
        <SectionHeading title="What We Do" subtitle="Making education accessible to every child" />
        <StaggerContainer>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((item, i) => (
              <StaggerItem key={i}>
                <AnimatedCard className="text-center h-full">
                  <div className="p-8">
                    <div className={`p-4 rounded-full w-fit mx-auto mb-6 ${item.color}`}>
                      <item.icon size={32} />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-slate-900">{item.title}</h3>
                    <p className="text-gray-600">{item.desc}</p>
                  </div>
                </AnimatedCard>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="container mx-auto px-4">
          <SectionHeading title="Our Impact" className="text-white" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-black mb-2">{stat.value}</div>
                <p className="text-white/80">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-20 container mx-auto px-4">
        <SectionHeading title="Upcoming Events" subtitle="Join us in making a difference" />
        {loading ? (
          <LoadingSpinner />
        ) : featuredEvents.length > 0 ? (
          <StaggerContainer>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredEvents.map((event, i) => (
                <StaggerItem key={event.id || i}>
                  <AnimatedCard>
                    <div className="p-6">
                      <div className="mb-4">
                        <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-semibold">
                          {event.event_type || 'Event'}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold mb-2 text-slate-900">{event.title}</h3>
                      <p className="text-gray-600 mb-4">{event.description}</p>
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <Calendar size={16} className="mr-2" />
                        {new Date(event.event_date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Users size={16} className="mr-2" />
                        {event.expected_attendees || 'TBA'} participants
                      </div>
                    </div>
                  </AnimatedCard>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No events scheduled yet. Check back soon!</p>
          </div>
        )}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link
            to="/events"
            className="inline-block bg-orange-600 text-white px-8 py-3 rounded-full font-bold hover:bg-orange-700 transition-all hover:scale-105"
          >
            View All Events <ArrowRight className="inline ml-2" size={20} />
          </Link>
        </motion.div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-5xl font-black mb-4">Ready to Make a Difference?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join our community of volunteers and donors in transforming lives through education.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Link
                to="/donate"
                className="bg-orange-600 text-white px-8 py-4 rounded-full font-bold hover:bg-orange-700 transition-all hover:scale-105 inline-block"
              >
                Donate Now
              </Link>
              <Link
                to="/contact"
                className="bg-white text-slate-900 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-all hover:scale-105 inline-block"
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