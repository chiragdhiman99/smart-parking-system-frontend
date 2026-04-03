import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "Find Parking", path: "/search" },
      { label: "What our users say", path: "/reviews" },
    { label: "How It Works", path: "/how-it-works" },
  
  ];

  const token = localStorage.getItem("token");
  const decoded = token ? jwtDecode(token) : null;
  const role = decoded?.role || null;
  

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/98 backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.07)] border-b border-gray-100"
            : "bg-white/70 backdrop-blur-lg"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-[72px] flex items-center justify-between">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            onClick={() => navigate("/")}
            className="flex items-center gap-3 cursor-pointer select-none"
          >
            <div className="relative w-[40px] h-[40px]">
              <div className="w-full h-full bg-[#22C55E] rounded-[12px] flex items-center justify-center shadow-[0_4px_16px_rgba(34,197,94,0.4)]">
                <span className="text-white font-black text-[18px] tracking-tight">
                  S
                </span>
              </div>
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#22C55E] rounded-full border-2 border-white">
                <span className="absolute inset-0 bg-[#22C55E] rounded-full animate-ping opacity-75"></span>
              </span>
            </div>
            <div className="flex flex-col leading-none gap-[3px]">
              <span className="text-[21px] font-black text-gray-900 tracking-tight">
                Slot<span className="text-[#22C55E]">Hub</span>
              </span>
              <span className="text-[9px] font-bold text-gray-400 tracking-[2.5px] uppercase">
                Smart Parking
              </span>
            </div>
          </motion.div>
 
          <ul className="hidden md:flex items-center gap-1">
            {navLinks.map((link, i) => (
              <motion.li
                key={link.label}
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.08 + i * 0.08,
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <Link
                  to={link.path}
                  className={`px-5 py-2.5 text-[15px] font-semibold rounded-xl transition-colors duration-200 ${
                    location.pathname === link.path
                      ? "bg-green-50 text-[#16A34A]"
                      : "text-gray-500 hover:text-[#22C55E]"
                  }`}
                >
                  {link.label}
                </Link>
              </motion.li>
            ))}
          </ul>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: 0.35,
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="hidden md:flex items-center gap-3"
          >
            {token ? (
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 28px rgba(34,197,94,0.4)",
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                onClick={() => navigate(`/${role}/dashboard`)}
                className="px-6 py-2.5 cursor-pointer rounded-xl text-[15px] font-bold text-white bg-[#22C55E] hover:bg-[#16A34A] transition-colors duration-200 shadow-[0_4px_16px_rgba(34,197,94,0.35)]"
              >
                Dashboard →
              </motion.button>
            ) : (
              <>
                <motion.button
                  whileHover={{
                    scale: 1.04,
                    borderColor: "#22C55E",
                    color: "#16A34A",
                  }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  onClick={() => navigate("/login")}
                  className="px-6 py-2.5 rounded-xl cursor-pointer text-[15px] font-semibold text-gray-700 border-[1.5px] border-gray-200 bg-white shadow-sm"
                >
                  Login
                </motion.button>

                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 10px 28px rgba(34,197,94,0.4)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  onClick={() => navigate("/register")}
                  className="px-6 py-2.5 cursor-pointer rounded-xl text-[15px] font-bold text-white bg-[#22C55E] hover:bg-[#16A34A] transition-colors duration-200 shadow-[0_4px_16px_rgba(34,197,94,0.35)] flex items-center gap-2"
                >
                  Get Started
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.8,
                      ease: "easeInOut",
                    }}
                    className="inline-block"
                  >
                    →
                  </motion.span>
                </motion.button>
              </>
            )}
          </motion.div>

          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-[5px] rounded-xl hover:bg-gray-100 transition-colors"
          >
            <motion.span
              animate={mobileOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="w-5 h-[2px] bg-gray-700 rounded-full block"
            />
            <motion.span
              animate={
                mobileOpen ? { opacity: 0, x: -8 } : { opacity: 1, x: 0 }
              }
              transition={{ duration: 0.2 }}
              className="w-5 h-[2px] bg-gray-700 rounded-full block"
            />
            <motion.span
              animate={
                mobileOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }
              }
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="w-5 h-[2px] bg-gray-700 rounded-full block"
            />
          </motion.button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-[72px] left-0 right-0 z-50 bg-white/98 backdrop-blur-2xl border-b border-gray-100 shadow-2xl md:hidden"
          >
            <div className="px-6 py-5 flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3.5 text-[15px] font-semibold text-gray-600 hover:text-[#16A34A] hover:bg-green-50 rounded-xl transition-all duration-200"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <div className="flex gap-2.5 mt-4 pt-4 border-t border-gray-100">
                {token ? (
                  <button
                    onClick={() => {
                      navigate(`/${role}/dashboard`);
                      setMobileOpen(false);
                    }}
                    className="flex-1 py-3 rounded-xl text-[15px] font-bold text-white bg-[#22C55E]"
                  >
                    Dashboard →
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        navigate("/login");
                        setMobileOpen(false);
                      }}
                      className="flex-1 py-3 rounded-xl text-[15px] font-semibold text-gray-700 border-[1.5px] border-gray-200"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        navigate("/register");
                        setMobileOpen(false);
                      }}
                      className="flex-1 py-3 rounded-xl text-[15px] font-bold text-white bg-[#22C55E]"
                    >
                      Get Started →
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-[72px]" />
    </>
  );
};

export default Navbar;
