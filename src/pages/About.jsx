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
    { year: '2014', title: 'Started with 50 students', desc: 'Began our journey with a small group of dedicated volunteers.' },
    { year: '2016', title: 'Expanded to 5 centers', desc: 'Successfully established learning centers in underserved communities.' },
    { year: '2018', title: 'Reached 1000+ students', desc: 'Impacted over a thousand students through various programs.' },
    { year: '2020', title: 'Digital Initiative', desc: 'Launched online learning during the pandemic.' },
    { year: '2022', title: '5000+ students', desc: 'Expanded reach to 15 learning centers across the region.' },
    { year: '2024', title: 'Community Leaders', desc: 'Many alumni now volunteer and lead community initiatives.' },
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
              SAMARPAN began with a simple belief: every child deserves quality education, regardless of their economic background. Founded in 2014, we started with just 50 students and a handful of passionate volunteers.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Today, we've grown into a vibrant community of educators, volunteers, and donors committed to breaking the cycle of poverty through education. Our work spans across 15 learning centers, touching the lives of over 5000 students annually.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl p-12"
          >
            <div className="text-6xl font-black text-orange-600 mb-4">5K+</div>
            <p className="text-2xl font-bold text-slate-900 mb-4">Students Impacted</p>
            <p className="text-gray-700">Since our inception, we've provided free quality education to thousands of underprivileged children across multiple communities.</p>
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
              { value: '5000+', label: 'Students Educated' },
              { value: '500+', label: 'Active Volunteers' },
              { value: '15+', label: 'Learning Centers' },
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
    </div>
  )
}