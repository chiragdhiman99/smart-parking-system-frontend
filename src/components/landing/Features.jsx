import { motion } from "framer-motion";
import { Map, Zap, BadgeDollarSign } from "lucide-react";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
});

const features = [
  {
    icon: <Map className="w-5 h-5 text-green-600" />,
    bg: "bg-green-50",
    title: "Live Interactive Map",
    desc: "See all nearby parking in real-time. Available slots update live on the map.",
  },
  {
    icon: <Zap className="w-5 h-5 text-blue-600" />,
    bg: "bg-blue-50",
    title: "Instant Slot Booking",
    desc: "Reserve your slot in under 30 seconds. QR confirmation instantly on screen.",
  },
  {
    icon: <BadgeDollarSign className="w-5 h-5 text-red-500" />,
    bg: "bg-red-50",
    title: "Transparent Pricing",
    desc: "No hidden charges. Hourly, daily, or monthly rates — always clear before booking.",
  },
];

const slotStatuses = [
  "oc",
  "av",
  "rs",
  "av",
  "oc",
  "av",
  "av",
  "oc",
  "av",
  "mt",
  "rs",
  "av",
  "oc",
  "sl",
  "av",
];
const slotLabels = [
  "A1",
  "A2",
  "A3",
  "A4",
  "A5",
  "B1",
  "B2",
  "B3",
  "B4",
  "B5",
  "C1",
  "C2",
  "C3",
  "C4",
  "C5",
];
const slotStyles = {
  av: "bg-green-50 border-green-200 text-green-700",
  oc: "bg-red-50 border-red-200 text-red-500",
  rs: "bg-yellow-50 border-yellow-200 text-yellow-600",
  sl: "bg-green-500 border-green-500 text-white",
  mt: "bg-gray-100 border-gray-200 text-gray-400",
};

const Features = () => {
  return (
    <section className="py-20 px-6 lg:px-16 bg-gray-50">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div {...fadeUp()}>
          <span className="inline-block bg-green-50 text-green-700 text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-lg mb-3">
            Why SlotHub
          </span>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-10">
            Everything You Need
            <br />
            to <span className="text-[#22C55E]">Park Smart</span>
          </h2>
          <div className="flex flex-col gap-4">
            {features.map((f, i) => (
              <motion.div
                key={i}
                {...fadeUp(i * 0.1)}
                whileHover={{ x: 6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex items-start gap-4 bg-white border border-gray-200 rounded-2xl p-5 cursor-pointer hover:border-green-300 transition-colors duration-200"
              >
                <div
                  className={`w-12 h-12 ${f.bg} rounded-xl flex items-center justify-center text-xl flex-shrink-0`}
                >
                  {f.icon}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-1">
                    {f.title}
                  </h4>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div {...fadeUp(0.2)} className="hidden lg:block">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-900">
                Infinity Mall — Floor G
              </h3>
              <span className="flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />{" "}
                LIVE
              </span>
            </div>
            <div className="grid grid-cols-5 gap-2 mb-5">
              {slotStatuses.map((status, i) => (
                <div
                  key={i}
                  className={`h-10 rounded-lg border flex items-center justify-center text-[11px] font-bold cursor-pointer transition-all hover:scale-105 ${slotStyles[status]}`}
                >
                  {slotLabels[i]}
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              {[
                { color: "bg-green-500", label: "Available" },
                { color: "bg-red-500", label: "Occupied" },
                { color: "bg-yellow-500", label: "Reserved" },
                { color: "bg-gray-300", label: "Maintenance" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 text-xs text-gray-500"
                >
                  <span className={`w-2.5 h-2.5 ${item.color} rounded-sm`} />
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
