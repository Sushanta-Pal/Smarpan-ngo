import { motion } from 'framer-motion'

export const AnimatedCard = ({ children, delay = 0, hoverScale = true, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    whileHover={hoverScale ? { y: -5, boxShadow: '0 10px 30px rgba(0,0,0,0.3)' } : {}}
    className={`bg-white rounded-xl shadow-lg overflow-hidden ${className}`}
  >
    {children}
  </motion.div>
)

export const AnimatedSection = ({ children, className = '' }) => (
  <motion.section
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8 }}
    className={className}
  >
    {children}
  </motion.section>
)

export const SectionHeading = ({ title, subtitle, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className={`text-center mb-16 ${className}`}
  >
    <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-4">{title}</h2>
    {subtitle && <p className="text-xl text-gray-600">{subtitle}</p>}
  </motion.div>
)

export const AnimatedText = ({ children, delay = 0, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    className={className}
  >
    {children}
  </motion.div>
)

export const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-20">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full"
    />
  </div>
)

export const HeroSection = ({ title, subtitle, backgroundGradient = 'from-orange-600 to-red-600', children }) => (
  <section className={`relative h-[80vh] flex items-center justify-center text-white bg-slate-900 overflow-hidden`}>
    <div className={`absolute inset-0 bg-gradient-to-r ${backgroundGradient} opacity-50 z-10`} />
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="relative z-20 text-center px-4"
    >
      <h1 className="text-6xl md:text-8xl font-black mb-4">{title}</h1>
      {subtitle && <p className="text-2xl mb-8">{subtitle}</p>}
      {children}
    </motion.div>
  </section>
)

export const FloatingShapes = () => (
  <>
    <motion.div
      animate={{ y: [0, -20, 0] }}
      transition={{ duration: 4, repeat: Infinity }}
      className="absolute top-20 left-10 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl"
    />
    <motion.div
      animate={{ y: [0, 20, 0] }}
      transition={{ duration: 5, repeat: Infinity }}
      className="absolute bottom-20 right-10 w-40 h-40 bg-red-500/10 rounded-full blur-3xl"
    />
  </>
)

export const StaggerContainer = ({ children, delay = 0 }) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    variants={{
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.2,
          delayChildren: delay,
        },
      },
    }}
  >
    {children}
  </motion.div>
)

export const StaggerItem = ({ children, index = 0 }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    }}
    transition={{ duration: 0.5 }}
  >
    {children}
  </motion.div>
)
