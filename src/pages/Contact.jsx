import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Phone, MapPin, Send } from 'lucide-react'
import { HeroSection, SectionHeading, LoadingSpinner } from '../components/animated/index.jsx'
import { submitContactForm } from '../lib/supabase'

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const result = await submitContactForm({
        ...formData,
        submitted_at: new Date().toISOString(),
      })
      if (result.success) {
        setSubmitted(true)
        setFormData({ name: '', email: '', subject: '', message: '' })
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
    { icon: MapPin, title: 'Address', value: 'Haldia, India', action: '#' },
  ]

  return (
    <div>
      {/* Hero */}
      <HeroSection
        title="Get in Touch"
        subtitle="We'd love to hear from you"
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
              className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-2xl transition-all cursor-pointer block"
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
        <div className="max-w-2xl mx-auto">
          <SectionHeading title="Send us a Message" subtitle="We'll get back to you as soon as possible" />
          
          {submitted && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8 p-4 bg-green-100 text-green-700 rounded-lg border-2 border-green-300 text-center font-semibold"
            >
              ✓ Thank you! Your message has been sent successfully. We'll reply soon.
            </motion.div>
          )}

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className="bg-white rounded-xl shadow-lg p-8 space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-slate-900 font-semibold mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-slate-900 font-semibold mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 transition-colors"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-900 font-semibold mb-2">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 transition-colors"
                placeholder="What is this about?"
              />
            </div>

            <div>
              <label className="block text-slate-900 font-semibold mb-2">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="6"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 transition-colors resize-none"
                placeholder="Tell us more about your inquiry..."
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={20} />
                  Send Message
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              { q: 'How can I volunteer?', a: 'Fill out the contact form or visit our events page to join volunteer activities.' },
              { q: 'How can I donate?', a: 'Visit our Donate page to contribute to our mission or sponsor a student.' },
              { q: 'Can I sponsor a child?', a: 'Yes! We have sponsorship programs. Contact us for more details.' },
              { q: 'How are funds utilized?', a: 'All funds go directly to education, infrastructure, and teacher salaries.' },
            ].map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-lg p-6 shadow-md"
              >
                <h3 className="text-lg font-bold text-slate-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}