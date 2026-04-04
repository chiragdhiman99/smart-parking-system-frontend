import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Hero = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState("all");
  const [loading, setLoading] = useState(false);
  const quickTags = [
    "4-Wheeler",
    "2-Wheeler",
    "EV Charging",
    "Near Metro",
    "Near Office",
  ];

  const handlefindparking = () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const long = position.coords.longitude;
        navigate("/search", {
          state: {
            lat,
            long,
            searchQuery,
            activeTag,
          },
        });
      },
      (error) => {
        setLoading(false);
        navigate("/search", { state: { searchQuery, activeTag } });
      },
    );
  };
  return (
    <section className="min-h-[calc(100vh-72px)] px-6 lg:px-16 py-16 lg:py-0 flex items-center relative overflow-hidden bg-white">
      {loading && (
        <div className="fixed top-0 left-0 w-full h-1 z-50 bg-gray-200">
          <div
            className="h-full bg-green-500"
            style={{
              animation: "loadingBar 3s ease-in-out forwards",
            }}
          />
        </div>
      )}

      <div className="absolute top-0 right-0 w-[520px] h-[520px] bg-green-50 rounded-full blur-2xl opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-green-50 border border-green-200 px-4 py-2 rounded-full mb-6"
          >
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-green-700 text-sm font-semibold">
              Real-Time Parking Solutions
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl lg:text-6xl font-black text-gray-900 leading-[1.08] tracking-tight mb-5"
          >
            Find & <span className="text-[#22C55E]">Book</span>
            <br />
            Parking Spots
            <br />
            Near You Instantly
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-500 text-lg leading-relaxed mb-8 max-w-lg"
          >
            A smart platform connecting drivers with private parking owners near
            metro stations, offices, and commercial hubs.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center bg-white border-2 border-gray-200 rounded-2xl p-1.5 sm:p-2 mb-4 w-full max-w-xs sm:max-w-md shadow-sm focus-within:border-green-400 transition-colors duration-200"
          >
            <div className="flex items-center gap-1 sm:gap-2 flex-1 px-2 sm:px-3 min-w-0">
              <span className="text-gray-400 text-sm sm:text-base flex-shrink-0">
                📍
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by location, landmark or city..."
                className="flex-1 min-w-0 outline-none text-xs sm:text-sm font-medium text-gray-700 placeholder-gray-400 bg-transparent placeholder:text-[10px] placeholder:sm:text-xs placeholder:md:text-sm truncate"
              />
            </div>

            <button
              onClick={() => handlefindparking()}
              className="bg-[#22C55E] cursor-pointer hover:bg-[#16A34A] text-white font-bold text-[9px] sm:text-xs md:text-sm px-2 sm:px-4 md:px-5 py-1.5 sm:py-2.5 md:py-3 rounded-xl transition-colors duration-200 whitespace-nowrap flex-shrink-0 flex items-center gap-1.5"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-white" />
                  Finding...
                </>
              ) : (
                "Find Parking"
              )}
            </button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap gap-2 mb-8"
          >
            {quickTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
                  activeTag === tag
                    ? "bg-green-50 border-green-300 text-green-700"
                    : "bg-white border-gray-200 text-gray-500 hover:border-green-300 hover:text-green-700"
                }`}
              >
                {tag}
              </button>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex items-center gap-4"
          >
            <div className="flex">
              {["#22C55E", "#3B82F6", "#F59E0B", "#8B5CF6"].map((color, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-white -ml-2 first:ml-0 flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: color }}
                >
                  {["R", "P", "A", "N"][i]}
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500">
              <strong className="text-gray-900">50,000+</strong> drivers already
              parking smarter ⭐ 4.9/5
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="hidden lg:flex relative justify-center items-center h-[540px]"
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.45 }}
            className="absolute top-8 left-4 bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-lg z-10"
          >
            <p className="text-xs font-semibold text-gray-500 mb-1">
              📍 Infinity Mall
            </p>
            <p className="text-xl font-black text-[#22C55E]">
              12{" "}
              <span className="text-sm font-semibold text-gray-500">
                free slots
              </span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.55 }}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-lg z-10 min-w-[140px]"
          >
            <p className="text-xs font-bold text-gray-700 mb-2">Availability</p>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="w-2 h-2 bg-green-500 rounded-sm" /> Available{" "}
                <strong>42%</strong>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="w-2 h-2 bg-red-500 rounded-sm" /> Occupied{" "}
                <strong>38%</strong>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="w-2 h-2 bg-yellow-500 rounded-sm" /> Reserved{" "}
                <strong>20%</strong>
              </div>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 6.5, ease: "easeInOut" }}
            className="w-[290px] bg-white border border-gray-200 rounded-3xl shadow-[0_18px_45px_rgba(15,23,42,0.12)] overflow-hidden z-20 will-change-transform"
          >
            <div className="bg-gradient-to-br from-green-50 to-green-100 px-6 pt-8 pb-6 text-center">
              <span className="text-7xl">🚗</span>
              <h3 className="font-black text-gray-900 mt-3 mb-1">
                Real-Time Parking
                <br />
                at Your Fingertips
              </h3>
              <p className="text-xs text-gray-500">
                Find and reserve spots with real-time availability
              </p>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5 mb-3">
                <span className="text-gray-400 text-sm">📍</span>
                <span className="text-xs text-gray-400 font-medium">
                  Enter destination
                </span>
              </div>
              <p className="text-sm font-bold text-gray-800 mb-2">
                Nearby Spots
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  {
                    bg: "from-green-50 to-green-100",
                    emoji: "🅿️",
                    name: "Car Parking",
                    price: "₹40/hr",
                    rating: "4.7",
                    dist: "0.8km",
                  },
                  {
                    bg: "from-gray-50 to-gray-100",
                    emoji: "🏢",
                    name: "Office Park",
                    price: "₹30/hr",
                    rating: "4.6",
                    dist: "1.2km",
                  },
                ].map((spot, i) => (
                  <div
                    key={i}
                    className="bg-gray-50 rounded-xl overflow-hidden border border-gray-100"
                  >
                    <div
                      className={`h-14 bg-gradient-to-br ${spot.bg} flex items-center justify-center text-2xl relative`}
                    >
                      {spot.emoji}
                      <span className="absolute top-1 left-1 bg-white/90 text-yellow-500 text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                        ⭐{spot.rating}
                      </span>
                    </div>
                    <div className="p-2">
                      <p className="text-[10px] font-bold text-gray-800">
                        {spot.name}
                      </p>
                      <p className="text-xs font-black text-[#22C55E]">
                        {spot.price}
                      </p>
                      <p className="text-[9px] text-gray-400">{spot.dist}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.65 }}
            className="absolute bottom-12 right-4 bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-lg z-10"
          >
            <span className="text-xs bg-green-50 text-green-700 font-bold px-2 py-1 rounded-lg">
              💰 Best Nearby
            </span>
            <p className="text-xl font-black text-[#22C55E] mt-1">₹30/hr</p>
            <p className="text-xs text-gray-400">Phoenix Mall · 0.8km</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
