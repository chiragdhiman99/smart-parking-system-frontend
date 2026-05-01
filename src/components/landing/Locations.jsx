import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { ParkingSquare, MapPin, Star, Circle } from "lucide-react";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
});
const bgColors = [
  "from-green-100 to-emerald-200",
  "from-blue-100 to-sky-200",
  "from-purple-100 to-violet-200",
  "from-orange-100 to-amber-200",
];

const Locations = () => {
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const url =
      "https://smart-parking-system-backend-oco6.onrender.com/api/parkings";
    axios
      .get(url)
      .then((res) => {
        const data = res.data;
        setLocations(
          data.slice(0, 4).map((loc, i) => ({
            id: loc._id,
            name: loc.name,
            city: loc.city,
            rating: loc.rating,
            price: `₹${loc.pricing?.["4-wheeler"]?.hourly || 0}/hr`,
            slots: loc.availableSlots || 0,
            total: loc.availableSlots || 0,
            bg: bgColors[i % bgColors.length],
            emoji: loc.icon || null,
            badge: loc.availableSlots > 0 ? "green" : "yellow",
          })),
        );
      })
      .catch((err) => {
        toast.error("Failed to load locations. Please try again later.");
      });
  }, []);

  return (
    <section className="py-20 px-6 lg:px-16 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          {...fadeUp()}
          className="flex justify-between items-end mb-10"
        >
          <div>
            <span className="inline-block bg-green-50 text-green-700 text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-lg mb-3">
              Top Spots
            </span>
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">
              Popular <span className="text-[#22C55E]">Locations</span>
            </h2>
          </div>
          <button
            onClick={() => navigate("/search")}
            className=" cursor-pointer text-green-700 text-sm font-bold hover:text-green-900 transition-colors"
          >
            View All →
          </button>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {locations.map((loc, i) => (
            <motion.div
              key={i}
              {...fadeUp(i * 0.08)}
              whileHover={{
                y: -4,
                boxShadow: "0 12px 40px rgba(34,197,94,0.1)",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              onClick={() =>
                navigate(`/parking/${loc.id}`, {
                  state: { bg: loc.bg },
                })
              }
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden cursor-pointer"
            >
              <div
                className={`h-36 bg-gradient-to-br ${loc.bg} flex items-center justify-center text-5xl relative`}
              >
                {loc.emoji ? (
                  loc.emoji
                ) : (
                  <ParkingSquare className="w-12 h-12 text-green-600" />
                )}
                <span
                  className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 ${loc.badge === "green" ? "bg-white text-green-700" : "bg-white text-yellow-600"}`}
                >
                  <Circle
                    className={`w-2.5 h-2.5 fill-current ${loc.badge === "green" ? "text-green-500" : "text-yellow-500"}`}
                  />
                  {loc.slots} Free
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-sm font-bold text-gray-900 mb-1">
                  {loc.name}
                </h3>
                <p className="text-xs text-gray-400 mb-3 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {loc.city}
                  <span className="mx-1">·</span>
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />{" "}
                  {loc.rating}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-base font-black text-[#22C55E]">
                    {loc.price}
                  </span>
                  <span className="text-xs text-gray-400">
                    {loc.total} total slots
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Locations;
