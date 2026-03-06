import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Phone, MapPin, Send, Briefcase } from 'lucide-react'
import { HeroSection, SectionHeading, LoadingSpinner } from '../components/animated/index.jsx'
import { submitContactForm } from '../lib/supabase'

export default function Contact() {
  // 1. Added 'interest' to the initial state
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    interest: 'General Inquiry', // Default value
    subject: '', 
    message: '' 
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Options for the dropdown
  const interestOptions = [
    'General Inquiry',
    'Apply to Volunteer',
    'Sponsor a Child',
    'Become a Teacher/Mentor',
    'Partner with Us',
    'Alumni Support'
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      // Submitting the new 'interest' field to Supabase
      const result = await submitContactForm({
        ...formData,
        submitted_at: new Date().toISOString(),
      })
      if (result && result.success !== false) { // Assuming no explicit false means success
        setSubmitted(true)
        setFormData({ name: '', email: '', interest: 'General Inquiry', subject: '', message: '' })
        setTimeout(() => setSubmitted(false), 5000)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setLoading(false)
    }
  }

  const contactInfo = [
    { icon: Mail, title: 'Email', value: 'hithaldia.samarpan@gmail.com', action: 'mailto:hithaldia.samarpan@gmail.com' },
    { icon: Phone, title: 'Phone', value: '+91-6297604029', action: 'tel:+916297604029' },
    { icon: MapPin, title: 'Address', value: 'Haldia, West Bengal, India', action: '#' },
  ]

  return (
    <div>
      {/* Hero */}
      <HeroSection
        title="Get in Touch"
        subtitle="We'd love to hear from you. Join us in making a difference."
        backgroundGradient="from-blue-600 to-cyan-600"
      />

      {/* Contact Grid */}
      <section className="py-20 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {contactInfo.map((info, i) => (
            <motion.a
              key={i}
              href={info.action}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-2xl transition-all cursor-pointer block border border-gray-100"
            >
              <div className="p-4 rounded-full w-fit mx-auto mb-6 bg-blue-100 text-blue-600">
                <info.icon size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-slate-900">{info.title}</h3>
              <p className="text-gray-600">{info.value}</p>
            </motion.a>
          ))}
        </div>

        {/* Contact Form */}
        <div className="max-w-3xl mx-auto">
          <SectionHeading title="Send us a Message" subtitle="Select your interest and let us know how you want to help" />
          
          <AnimatePresence>
            {submitted && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className="mb-8 p-5 bg-green-50 text-green-700 rounded-xl border border-green-200 text-center font-bold shadow-sm flex items-center justify-center gap-2"
              >
                <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">✓</div>
                Thank you! Your application/message has been recorded. We'll contact you soon.
              </motion.div>
            )}
          </AnimatePresence>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-xl p-8 md:p-10 space-y-6 border border-gray-100"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-slate-800 font-bold mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-slate-800 font-bold mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* New Dropdown Field for Interest / Role */}
              <div>
                <label className="block text-slate-800 font-bold mb-2 flex items-center gap-2">
                  <Briefcase size={18} className="text-blue-600"/>
                  Area of Interest
                </label>
                <select
                  name="interest"
                  value={formData.interest}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-700 font-medium cursor-pointer"
                >
                  {interestOptions.map((option, idx) => (
                    <option key={idx} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  placeholder="What is this about?"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-800 font-bold mb-2">Your Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none"
                placeholder="Tell us a little about yourself or your inquiry..."
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
                  Processing...
                </>
              ) : (
                <>
                  <Send size={22} />
                  Submit Application / Message
                </>
              )}
            </motion.button>
          </motion.form>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <SectionHeading title="Frequently Asked Questions" subtitle="Quick answers to common questions" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              { q: 'How can I volunteer?', a: 'Select "Apply to Volunteer" in the form above. Our team will review your application and contact you for onboarding.' },
              { q: 'How can I donate?', a: 'Visit our Donate page to contribute to our mission securely online.' },
              { q: 'Can I sponsor a child?', a: 'Yes! Select "Sponsor a Child" in the contact form, and we will send you the sponsorship details.' },
              { q: 'How are funds utilized?', a: 'All funds go directly to education materials, infrastructure for our learning centers, and essential operations.' },
            ].map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">Q</div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{faq.q}</h3>
                    <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}