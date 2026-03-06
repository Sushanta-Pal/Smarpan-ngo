import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Eye, Heart, Zap, Target, Award, Users, BookOpen } from 'lucide-react'
import { HeroSection, AnimatedCard, SectionHeading, StaggerContainer, StaggerItem, AnimatedText } from '../components/animated/index.jsx'

export default function About() {
  const values = [
    { icon: Eye, title: 'Vision', desc: 'A society where every child has access to quality education regardless of economic status.' },
    { icon: Heart, title: 'Mission', desc: 'Providing free, quality primary education to underprivileged children and breaking the cycle of poverty.' },
    { icon: Zap, title: 'Innovation', desc: 'Using modern teaching methods and technology to create engaging learning experiences.' },
    { icon: Target, title: 'Accountability', desc: 'Transparent operations and measurable impact in every program we undertake.' },
  ]

  const milestones = [
    { year: '2015', title: 'The Beginning', desc: 'Started our journey on Sunday, April 5, 2015, teaching 10 students at the Haldia Institute of Technology campus.' },
    { year: '2020', title: 'Digital Adaptation', desc: 'During the COVID-19 pandemic, we successfully shifted all our classes online to ensure uninterrupted learning.' },
    { year: '2021', title: 'First Community Centers', desc: 'Transitioned from online classes back to physical learning by opening centers in children\'s places in Gandhinagar.' },
    { year: '2023', title: 'Expanding Our Reach', desc: 'Added new dedicated learning places in communities like Khudiram and Avinandan.' },
    { year: 'Present', title: 'Growing Impact', desc: 'Currently operating 15+ active centers supported by a strong family of 100+ active members.' },
  ]

  return (
    <div>
      {/* Hero */}
      <HeroSection
        title="About SAMARPAN"
        subtitle="Transforming Lives Through Education"
        backgroundGradient="from-blue-600 to-orange-600"
      />

      {/* Our Story */}
      <section className="py-20 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-5xl font-black mb-6 text-slate-900">Our Story</h2>
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              SAMARPAN began with a simple belief: every child deserves quality education, regardless of their economic background. Our journey officially started on <strong>Sunday, April 5, 2015</strong>, with just 10 students whom we taught right inside the college campus at Haldia Institute of Technology.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              When the COVID-19 pandemic hit, we adapted by taking our classes online. Post-pandemic, we shifted into physical centers situated in children's places in Gandhinagar. Today, we've expanded to places like Khudiram, Avinandan, and more, growing into a vibrant community of 100+ active members managing 15+ learning centers.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl p-12"
          >
            <div className="text-6xl font-black text-orange-600 mb-4">150+</div>
            <p className="text-2xl font-bold text-slate-900 mb-4">Students Impacted</p>
            <p className="text-gray-700">Since our inception at the HIT campus, we've provided free quality education and guidance to over 150 underprivileged children across our centers.</p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4">
          <SectionHeading title="Our Core Values" subtitle="What Drives Our Mission" />
          <StaggerContainer>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, i) => (
                <StaggerItem key={i}>
                  <AnimatedCard className="h-full text-center">
                    <div className="p-8">
                      <div className="p-4 rounded-full w-fit mx-auto mb-6 bg-orange-100 text-orange-600">
                        <value.icon size={32} />
                      </div>
                      <h3 className="text-2xl font-bold mb-3 text-slate-900">{value.title}</h3>
                      <p className="text-gray-600">{value.desc}</p>
                    </div>
                  </AnimatedCard>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 container mx-auto px-4">
        <SectionHeading title="Our Journey" subtitle="Key Milestones in Our Growth" />
        <div className="space-y-12">
          {milestones.map((milestone, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`flex items-center gap-8 ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
            >
              <div className="hidden md:flex flex-1 items-center justify-center">
                <div className="w-4 h-4 bg-orange-600 rounded-full ring-8 ring-orange-100" />
              </div>
              <div className="flex-1">
                <AnimatedCard>
                  <div className="p-6">
                    <div className="text-orange-600 font-black text-2xl mb-2">{milestone.year}</div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{milestone.title}</h3>
                    <p className="text-gray-600">{milestone.desc}</p>
                  </div>
                </AnimatedCard>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Highlight */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '10+', label: 'Years Active' },
              { value: '150+', label: 'Students Impacted' },
              { value: '100+', label: 'Active Members' },
              { value: '15+', label: 'Active Centers' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-5xl font-black mb-2">{stat.value}</div>
                <p className="text-white/80 font-semibold">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}