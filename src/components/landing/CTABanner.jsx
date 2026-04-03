import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
});

const CTABanner = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 px-6 lg:px-16 bg-white">
      <motion.div
        {...fadeUp()}
        className="max-w-7xl mx-auto bg-gradient-to-r from-green-700 via-green-600 to-green-500 rounded-3xl px-10 lg:px-16 py-16 flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 80% 50%, white 0%, transparent 60%)",
          }}
        />
        <div className="relative z-10">
          <h2 className="text-3xl lg:text-4xl font-black text-white tracking-tight mb-3">
            Ready to Never Circle
            <br />
            the Block Again?
          </h2>
          <p className="text-green-100 text-lg">
            Join 50,000+ drivers across 10+ Indian cities.
          </p>
        </div>
        <div className="flex gap-3 relative z-10 flex-shrink-0">
          <button
            onClick={() => navigate("/search")}
            className="bg-white cursor-pointer text-green-700 font-bold px-7 py-3.5 rounded-xl hover:shadow-xl transition-all duration-200"
          >
            Find Parking →
          </button>
          <button
            onClick={() => navigate("/login")}
            className="border-2 cursor-pointer border-white/50 text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-white/10 transition-all duration-200"
          >
            List Your Space
          </button>
        </div>
      </motion.div>
    </section>
  );
};

export default CTABanner;
