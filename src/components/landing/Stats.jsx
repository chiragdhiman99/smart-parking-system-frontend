import { motion } from 'framer-motion'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }
})

const stats = [
  { num: '500+', label: 'Parking Locations' },
  { num: '12K+', label: 'Available Slots' },
  { num: '50K+', label: 'Happy Drivers' },
  { num: '10+', label: 'Cities Covered' },
  { num: '4.9★', label: 'User Rating' },
]

const Stats = () => {
  return (
    <section className="border-y mt-10 border-gray-100 bg-white py-8 px-6 lg:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 text-center">
        {stats.map((s, i) => (
          <motion.div key={i} {...fadeUp(i * 0.07)}>
            <p className="text-3xl font-black text-gray-900 tracking-tight">{s.num}</p>
            <p className="text-sm text-gray-400 font-medium mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default Stats