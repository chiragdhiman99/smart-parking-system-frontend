import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Search,
  ParkingSquare,
  ClipboardList,
  Car,
  FilePen,
  Building2,
  CheckCircle,
  Banknote,
  Zap,
  Lock,
  MapPin,
  BarChart2,
  Bike,
  Clock,
} from "lucide-react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { useEffect } from "react";

const driverSteps = [
  {
    step: "01",
    icon: <Search className="w-7 h-7 text-green-500" />,
    title: "Search Nearby",
    desc: "Enter your location, city or landmark to find available parking spots near you in real-time.",
  },
  {
    step: "02",
    icon: <ParkingSquare className="w-7 h-7 text-green-500" />,
    title: "Pick a Slot",
    desc: "Browse the live slot grid, see which slots are free, and select the one that works best for you.",
  },
  {
    step: "03",
    icon: <ClipboardList className="w-7 h-7 text-green-500" />,
    title: "Book It",
    desc: "Confirm your booking with your vehicle details, date and time. Instant confirmation — no waiting.",
  },
  {
    step: "04",
    icon: <Car className="w-7 h-7 text-green-500" />,
    title: "Park & Go",
    desc: "Head to the parking, show your booking, and park stress-free. It's that simple.",
  },
];
const ownerSteps = [
  {
    step: "01",
    icon: <FilePen className="w-7 h-7 text-blue-500" />,
    title: "Create Account",
    desc: "Sign up as an owner in seconds using your email or Google account.",
  },
  {
    step: "02",
    icon: <Building2 className="w-7 h-7 text-blue-500" />,
    title: "List Your Space",
    desc: "Add your parking lot details — location, slots, pricing, timings and vehicle types.",
  },
  {
    step: "03",
    icon: <CheckCircle className="w-7 h-7 text-blue-500" />,
    title: "Accept Bookings",
    desc: "Get notified when drivers book your space. Accept or auto-approve based on your preference.",
  },
  {
    step: "04",
    icon: <Banknote className="w-7 h-7 text-blue-500" />,
    title: "Start Earning",
    desc: "Track your bookings and earnings from your dashboard. Money directly to your account.",
  },
];

const features = [
  {
    icon: <Zap className="w-6 h-6 text-yellow-500" />,
    title: "Real-Time Slots",
    desc: "Live availability updates so you never arrive at a full lot.",
  },
  {
    icon: <Lock className="w-6 h-6 text-gray-600" />,
    title: "Secure Booking",
    desc: "Your booking is confirmed instantly and stored safely.",
  },
  {
    icon: <MapPin className="w-6 h-6 text-red-500" />,
    title: "GPS Precision",
    desc: "Exact parking location with map view and directions.",
  },
  {
    icon: <BarChart2 className="w-6 h-6 text-purple-500" />,
    title: "Owner Analytics",
    desc: "Track earnings, occupancy and booking trends easily.",
  },
  {
    icon: <Bike className="w-6 h-6 text-green-500" />,
    title: "Multi-Vehicle",
    desc: "Support for both 2-wheelers and 4-wheelers.",
  },
  {
    icon: <Clock className="w-6 h-6 text-blue-500" />,
    title: "Flexible Hours",
    desc: "Book by the hour, day or month — your choice.",
  },
];

const HowItWorks = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs font-bold px-4 py-2 rounded-full mb-6"
          >
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            Simple. Fast. Reliable.
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-5xl font-black text-gray-900 mb-4"
          >
            How <span className="text-[#22C55E]">SlotHub</span> Works
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 text-base max-w-xl mx-auto"
          >
            Whether you're looking for parking or want to earn from your space —
            SlotHub makes it effortless.
          </motion.p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16 flex flex-col gap-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-green-50 border border-green-200 rounded-xl flex items-center justify-center text-xl">
              <Car className="text-green-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-green-600 uppercase tracking-wider">
                For Drivers
              </p>
              <h2 className="text-xl font-black text-gray-900">
                Find & Book Parking in 4 Steps
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {driverSteps.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-white rounded-2xl p-5 border border-gray-100 relative overflow-hidden"
              >
                <p className="text-5xl font-black text-gray-50 absolute top-3 right-3 leading-none select-none">
                  {item.step}
                </p>
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="text-sm font-black text-gray-900 mb-1.5">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="mt-6">
            <button
              onClick={() => navigate("/search")}
              className="bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold px-6 py-3 rounded-xl text-sm transition-all cursor-pointer"
            >
              Find Parking Now →
            </button>
          </div>
        </motion.div>

        <div className="border-t border-gray-200" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-center text-xl">
              🏢
            </div>
            <div>
              <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                For Owners
              </p>
              <h2 className="text-xl font-black text-gray-900">
                List Your Space & Start Earning
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ownerSteps.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-white rounded-2xl p-5 border border-gray-100 relative overflow-hidden"
              >
                <p className="text-5xl font-black text-gray-50 absolute top-3 right-3 leading-none select-none">
                  {item.step}
                </p>
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="text-sm font-black text-gray-900 mb-1.5">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="mt-6">
            <button
              onClick={() => navigate("/logind")}
              className="bg-[#3B82F6] hover:bg-blue-600 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all cursor-pointer"
            >
              List Your Space →
            </button>
          </div>
        </motion.div>

        <div className="border-t border-gray-200" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-center mb-8">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Why SlotHub
            </p>
            <h2 className="text-xl font-black text-gray-900">
              Everything You Need
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {features.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="bg-white rounded-2xl p-5 border border-gray-100 flex items-start gap-3"
              >
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <h3 className="text-sm font-black text-gray-900 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-[#22C55E] to-[#16A34A] rounded-2xl p-10 text-white text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative z-10">
            <h2 className="text-2xl font-black mb-2">Ready to Get Started?</h2>
            <p className="text-green-100 text-sm mb-6">
              Join thousands of drivers and owners already using SlotHub.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <button
                onClick={() => navigate("/search")}
                className="bg-white text-green-600 font-bold px-6 py-2.5 rounded-xl text-sm cursor-pointer hover:bg-green-50 transition-all"
              >
                Find Parking
              </button>
              <button
                onClick={() => navigate("/login")}
                className="bg-white/20 text-white font-bold px-6 py-2.5 rounded-xl text-sm cursor-pointer hover:bg-white/30 transition-all"
              >
                List Your Space
              </button>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default HowItWorks;
