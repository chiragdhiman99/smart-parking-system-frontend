import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
});

const Testimonials = () => {
  const [reviews, setReviews] = useState([]);

  const colors = [
    "from-green-400 to-green-600",
    "from-blue-400 to-blue-600",
    "from-purple-400 to-purple-600",
  ];

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/reviews")
      .then((res) => {
        setReviews(
          res.data.reviews.slice(0, 3).map((r, i) => ({
            initials: r.userName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase(),
            color: colors[i % colors.length],
            name: r.userName,
            role: r.role || "Verified User",
            text: r.comment,
            rating: r.rating,
            tag: r.role === "driver" ? "🚗 Driver" : "🏢 Owner",
          })),
        );
      })
      .catch((err) => {
        toast.error("Failed to load reviews. Please try again later.");
      });
  }, []);

  return (
    <section className="py-20 px-6 lg:px-16 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div {...fadeUp()} className="mb-10">
          <span className="inline-block bg-green-50 text-green-700 text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-lg mb-3">
            Reviews
          </span>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">
            What Our <span className="text-[#22C55E]">Users Say</span>
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {reviews.map((t, i) => (
            <motion.div
              key={i}
              {...fadeUp(i * 0.1)}
              whileHover={{
                y: -4,
                boxShadow: "0 8px 32px rgba(34,197,94,0.08)",
              }}
              className="bg-white border border-gray-200 rounded-2xl p-6 cursor-pointer transition-shadow duration-200"
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-11 h-11 bg-gradient-to-br ${t.color} rounded-xl flex items-center justify-center text-white font-bold text-sm`}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.role}</p>
                </div>
              </div>
              <p className="text-yellow-400 text-sm mb-3">
                {"⭐".repeat(t.rating)}
              </p>
              <p className="text-sm text-gray-500 leading-relaxed italic mb-4">
                "{t.text}"
              </p>
              <span className="bg-green-50 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-lg">
                {t.tag}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
