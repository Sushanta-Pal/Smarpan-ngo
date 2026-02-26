import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Book, Users, Smile, ArrowRight } from 'lucide-react'
import { HeroSection, SectionHeading, StaggerContainer, StaggerItem, AnimatedCard } from '../components/animated/index.jsx'

export default function Donate() {
  const [selectedAmount, setSelectedAmount] = useState(null)
  const [selectedType, setSelectedType] = useState('one-time')

  const donationPlans = [
    { amount: 500, title: 'Basic', desc: 'Support 1 student\'s monthly learning', icon: Book },
    { amount: 2000, title: 'Standard', desc: 'Fund a workshop for 30 students', icon: Users },
    { amount: 5000, title: 'Premium', desc: 'Sponsor a student\'s full year', icon: Heart },
    { amount: 10000, title: 'Champion', desc: 'Support an entire learning center', icon: Smile },
  ]

  const impactPlan = [
    { icon: '📚', title: 'Your Impact', items: ['Books & Materials', 'Teacher Salaries', 'Infrastructure', 'Scholarships'] },
    { icon: '❤️', title: 'Benefits', items: ['Tax Deduction', 'Impact Reports', 'Direct Updates', 'Community Badge'] },
    { icon: '🎓', title: 'Commitment', items: ['Monthly Giving', 'Quarterly Reports', 'Volunteer Access', 'Recognition'] },
  ]

  const fundBreakdown = [
    { label: 'Education Programs', percent: 40, color: 'bg-blue-600' },
    { label: 'Infrastructure', percent: 25, color: 'bg-orange-600' },
    { label: 'Teacher Training', percent: 20, color: 'bg-green-600' },
    { label: 'Operations', percent: 15, color: 'bg-purple-600' },
  ]

  return (
    <div>
      {/* Hero */}
      <HeroSection
        title="Support Our Mission"
        subtitle="Every donation transforms lives"
        backgroundGradient="from-pink-600 to-orange-600"
      />

      {/* Donation Plans */}
      <section className="py-20 container mx-auto px-4">
        <SectionHeading title="Donation Plans" subtitle="Choose how you want to contribute" />

        {/* Donation Type Selector */}
        <div className="flex justify-center gap-4 mb-12">
          {['one-time', 'monthly'].map((type) => (
            <motion.button
              key={type}
              onClick={() => setSelectedType(type)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-8 py-3 rounded-full font-bold capitalize transition-all ${
                selectedType === type
                  ? 'bg-pink-600 text-white shadow-lg'
                  : 'bg-gray-100 text-slate-900 hover:bg-gray-200'
              }`}
            >
              {type.replace('-', ' ')} Donation
            </motion.button>
          ))}
        </div>

        <StaggerContainer>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {donationPlans.map((plan, i) => (
              <StaggerItem key={i}>
                <motion.div
                  onClick={() => setSelectedAmount(plan.amount)}
                  whileHover={{ scale: 1.05 }}
                  className={`cursor-pointer rounded-xl overflow-hidden transition-all ${
                    selectedAmount === plan.amount
                      ? 'ring-4 ring-pink-600 shadow-2xl'
                      : 'shadow-lg hover:shadow-xl'
                  }`}
                >
                  <div className="bg-gradient-to-br from-pink-100 to-orange-100 p-6 text-center">
                    <div className="p-3 rounded-full w-fit mx-auto mb-4 bg-pink-600 text-white text-2xl">
                      <plan.icon size={32} />
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 mb-2">₹{plan.amount.toLocaleString()}</h3>
                    <p className="text-lg font-bold text-slate-900 mb-2">{plan.title}</p>
                    <p className="text-gray-700 text-sm mb-4">{plan.desc}</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full bg-pink-600 text-white py-2 rounded-lg font-semibold hover:bg-pink-700 transition-all flex items-center justify-center gap-2"
                    >
                      Donate <ArrowRight size={16} />
                    </motion.button>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>

        {/* Custom Amount */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-lg text-gray-600 mb-4">Want to donate a custom amount?</p>
          <div className="flex justify-center gap-3 max-w-md mx-auto">
            <input
              type="number"
              placeholder="Enter amount (₹)"
              className="flex-1 px-4 py-3 border-2 border-pink-300 rounded-lg focus:outline-none focus:border-pink-600"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-pink-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-pink-700 transition-all"
            >
              Donate Now
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* Fund Breakdown */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4">
          <SectionHeading title="How Your Money is Used" subtitle="100% transparent fund allocation" />
          <div className="max-w-2xl mx-auto">
            {fundBreakdown.map((fund, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="mb-6"
              >
                <div className="flex justify-between mb-2">
                  <p className="font-bold text-slate-900">{fund.label}</p>
                  <p className="font-bold text-pink-600">{fund.percent}%</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${fund.percent}%` }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 + 0.3, duration: 0.8 }}
                    className={`h-full ${fund.color} rounded-full`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stories */}
      <section className="py-20 container mx-auto px-4">
        <SectionHeading title="Real Impact Stories" subtitle="See the difference your donation makes" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { amount: '₹500', story: 'Provides textbooks for 5 students for a month' },
            { amount: '₹2000', story: 'Conducts a full day workshop for 50 students' },
            { amount: '₹5000', story: 'Sponsors one child\'s complete education for a year' },
          ].map((impact, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-gradient-to-br from-pink-50 to-orange-50 rounded-xl p-8 text-center"
            >
              <div className="text-5xl font-black text-pink-600 mb-4">{impact.amount}</div>
              <p className="text-lg text-gray-700">{impact.story}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why Donate */}
      <section className="py-20 bg-gradient-to-r from-pink-600 to-orange-600 text-white">
        <div className="container mx-auto px-4">
          <SectionHeading title="Why Donate to SAMARPAN?" subtitle="Your questions answered" className="text-white" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {impactPlan.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <ul className="space-y-2">
                  {item.items.map((bullet, j) => (
                    <li key={j} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl font-black mb-4 text-slate-900">Ready to Make a Difference?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Your contribution, no matter the size, helps us provide quality education to underprivileged children.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-pink-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-pink-700 transition-all inline-block"
          >
            Donate Now
          </motion.button>
        </motion.div>
      </section>
    </div>
  )
}