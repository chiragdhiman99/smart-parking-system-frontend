import { motion } from "framer-motion";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
});

const steps = [
  {
    n: "01",
    icon: "🔍",
    title: "Search Location",
    desc: "Enter your destination and see all nearby parking spots on an interactive live map.",
  },
  {
    n: "02",
    icon: "🅿️",
    title: "Choose Your Slot",
    desc: "Filter by price, vehicle type, timing, and distance. Pick your preferred slot.",
  },
  {
    n: "03",
    icon: "✅",
    title: "Confirm Booking",
    desc: "Reserve your slot instantly and get a booking confirmation with QR code.",
  },
  {
    n: "04",
    icon: "🚗",
    title: "Park & Go!",
    desc: "Show QR code at entry gate and park stress-free. No more searching!",
  },
];

const HowItWorks = () => {
  return (
    <section className="px-6 lg:px-16 bg-gray-50">
      {" "}
      <div className="max-w-7xl mx-auto">
        <motion.div {...fadeUp()} className="mb-20">
          <span className="inline-block bg-green-50 text-green-700 text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-lg mb-3">
            Simple Process
          </span>
          <h2 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
            Park in <span className="text-[#22C55E]">4 Easy Steps</span>
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              {...fadeUp(i * 0.1)}
              whileHover={{
                y: -4,
                boxShadow: "0 16px 48px rgba(34,197,94,0.1)",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-white border border-gray-200 rounded-2xl p-6 cursor-pointer"
            >
              <p className="text-6xl font-black text-green-100 leading-none mb-3">
                {step.n}
              </p>
              <div className="w-11 h-11 bg-green-50 rounded-xl flex items-center justify-center text-xl mb-4">
                {step.icon}
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
