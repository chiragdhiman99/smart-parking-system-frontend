import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
});

const benefits = [
  "List your space in under 5 minutes",
  "Set your own price and availability",
  "Auto-approve or manually review bookings",
  "Track earnings with a detailed dashboard",
];

const ownerStats = [
  { num: "₹8K", label: "Avg Monthly Earning", color: "text-green-600" },
  { num: "500+", label: "Active Owners", color: "text-blue-600" },
  { num: "4.8★", label: "Owner Rating", color: "text-yellow-600" },
  { num: "24hr", label: "Support Available", color: "text-orange-600" },
];

const OwnerSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 px-6 lg:px-16 bg-gray-50">
      <div className="max-w-7xl mx-auto bg-white border border-gray-200 rounded-3xl p-10 lg:p-14 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div {...fadeUp()}>
          <span className="inline-block bg-green-50 text-green-700 text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-lg mb-4">
            For Parking Owners
          </span>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-4">
            Turn Empty Space
            <br />
            into <span className="text-[#22C55E]">Extra Income</span>
          </h2>
          <p className="text-gray-500 leading-relaxed mb-7">
            List your unused parking slots on SlotHub and start earning passive
            income. Thousands of drivers are looking for spots near your
            location right now.
          </p>
          <div className="flex flex-col gap-3 mb-8">
            {benefits.map((b, i) => (
              <div
                key={i}
                className="flex items-center gap-3 text-sm text-gray-600"
              >
                <div className="w-6 h-6 bg-green-50 rounded-lg flex items-center justify-center text-green-600 text-xs flex-shrink-0">
                  ✓
                </div>
                {b}
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate("/login")}
            className="bg-[#22C55E] cursor-pointer hover:bg-[#16A34A] text-white font-bold px-8 py-3.5 rounded-xl transition-colors duration-200 shadow-[0_4px_16px_rgba(34,197,94,0.3)]"
          >
            List Your Parking Space →
          </button>
        </motion.div>

        <motion.div {...fadeUp(0.2)} className="grid grid-cols-2 gap-4">
          {ownerStats.map((s, i) => (
            <div
              key={i}
              className="bg-gray-50 border border-gray-200 rounded-2xl p-5 text-center"
            >
              <p className={`text-1xl sm:text-2xl font-black ${s.color}`}>{s.num}</p>
              <p className="text-xs text-gray-400 mt-1.5">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default OwnerSection;
