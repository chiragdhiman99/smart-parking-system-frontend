import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(
        "https://smart-parking-system-backend-oco6.onrender.com/api/admin/login",
        { email, password },
      );
      localStorage.setItem("adminToken", res.data.accessToken);
      window.location.href = "/admin/dashboard";
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen font-sans">
      {/* Left Panel - hidden on mobile */}
      <div className="hidden md:flex w-[45%] bg-gradient-to-br from-green-800 to-green-500 text-white p-10 flex-col relative overflow-hidden">
        <div className="flex items-center gap-2 z-10">
          <div className="bg-white text-green-500 font-extrabold text-lg w-9 h-9 rounded-lg flex items-center justify-center">
            S
          </div>
          <span className="text-xl font-bold">SlotHub</span>
        </div>

        <div className="my-auto z-10">
          <div className="text-5xl mb-4">🅿️</div>
          <h1 className="text-4xl font-extrabold leading-tight mb-3">
            Admin Control <br /> Center
          </h1>
          <p className="text-sm opacity-80 leading-relaxed mb-8 max-w-xs">
            Manage your entire parking platform from one powerful dashboard.
          </p>
          <div className="flex gap-4">
            {[
              ["500+", "Locations"],
              ["4.9★", "Rating"],
              ["50K+", "Drivers"],
            ].map(([val, label]) => (
              <div
                key={label}
                className="bg-white/20 backdrop-blur-md rounded-xl px-5 py-3 flex flex-col items-center"
              >
                <span className="text-lg font-extrabold">{val}</span>
                <span className="text-xs opacity-80 mt-1">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute w-[300px] h-[300px] rounded-full bg-white/10 top-[-80px] right-[-80px]" />
        <div className="absolute w-[200px] h-[200px] rounded-full bg-white/10 bottom-10 right-8" />
      </div>

      {/* Right Panel */}
      <div className="flex-1 bg-gray-100 flex items-center justify-center p-4 sm:p-8 md:p-10">
        {/* Mobile top branding */}
        <div className="w-full max-w-md">
          <div className="flex md:hidden items-center gap-2 justify-center mb-6">
            <div className="bg-green-500 text-white font-extrabold text-lg w-9 h-9 rounded-lg flex items-center justify-center">
              S
            </div>
            <span className="text-xl font-bold text-gray-800">SlotHub</span>
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-8 md:p-10 w-full shadow-lg">
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-5">
              <span className="text-2xl">🛡️</span>
            </div>

            <h2 className="text-2xl font-extrabold text-gray-900 mb-1">
              Admin Login
            </h2>
            <p className="text-sm text-gray-400 mb-6">
              Restricted access — authorized personnel only
            </p>

            <form onSubmit={handleLogin} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">
                  Email Address
                </label>
                <div className="flex items-center border border-gray-300 rounded-xl px-4 bg-gray-50 focus-within:border-green-500">
                  <span className="mr-2 opacity-50">✉️</span>
                  <input
                    type="email"
                    placeholder="admin@slothub.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1 bg-transparent py-3 outline-none text-sm"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">
                  Password
                </label>
                <div className="flex items-center border border-gray-300 rounded-xl px-4 bg-gray-50 focus-within:border-green-500">
                  <span className="mr-2 opacity-50">🔒</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="flex-1 bg-transparent py-3 outline-none text-sm"
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="ml-2 cursor-pointer opacity-50"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </span>
                </div>
              </div>

              <div className="relative h-4">
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-0 left-0 text-red-500 text-xs font-medium"
                    >
                      ✕ {error}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`py-4 rounded-xl text-white font-bold text-sm transition bg-gradient-to-r from-green-500 to-green-800 shadow-md ${
                  loading
                    ? "opacity-80 cursor-not-allowed"
                    : "hover:scale-[1.02]"
                }`}
              >
                {loading ? "Verifying..." : "Login to Admin Panel →"}
              </button>
            </form>

            <p className="mt-6 text-xs text-gray-400 text-center leading-relaxed">
              🔐 This page is for authorized admins only. Unauthorized access
              attempts are logged.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
