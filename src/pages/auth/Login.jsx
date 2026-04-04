import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const Login = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("driver");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [showRolePopup, setShowRolePopup] = useState(false);

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });

  const validateEmail = (email) => {
    if (!email) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Minimum 6 characters";
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Real-time validation
    if (name === "email")
      setErrors((prev) => ({
        ...prev,
        email: validateEmail(value),
        general: "",
      }));
    if (name === "password")
      setErrors((prev) => ({
        ...prev,
        password: validatePassword(value),
        general: "",
      }));
  };

  const handleLogin = async () => {
    const emailErr = validateEmail(form.email);
    const passwordErr = validatePassword(form.password);

    if (emailErr || passwordErr) {
      setErrors({ email: emailErr, password: passwordErr, general: "" });
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("https://smart-parking-system-backend-oco6.onrender.com/api/auth/login", {
        email: form.email,
        password: form.password,
        role: activeTab,
      });

      localStorage.setItem("token", res.data.token);
      const role = res.data.role;
      navigate("/" + role + "/dashboard");
    } catch (err) {
      setErrors({
        email: "",
        password: "",
        general: "Invalid email or password",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "https://smart-parking-system-backend-oco6.onrender.com/api/auth/google";
    setShowRolePopup(true);
  };

  return (
    <>
      {showRolePopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 shadow-xl text-center max-w-sm w-full mx-4">
            <h2 className="text-xl font-black text-gray-900 mb-1">
              You are a...?
            </h2>
            <p className="text-gray-400 text-sm mb-6">
              Select your role to continue with Google
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setShowRolePopup(false);
                  window.location.href =
                    "https://smart-parking-system-backend-oco6.onrender.com/api/auth/google?role=driver";
                }}
                className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold py-4 rounded-xl text-base transition-all cursor-pointer"
              >
                🚗 I'm a Driver
              </button>
              <button
                onClick={() => {
                  setShowRolePopup(false);
                  window.location.href =
                    "https://smart-parking-system-backend-oco6.onrender.com/api/auth/google?role=owner";
                }}
                className="w-full border-2 border-gray-200 hover:border-green-400 text-gray-700 font-bold py-4 rounded-xl text-base transition-all cursor-pointer"
              >
                🏢 I'm a Parking Owner
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gray-50 flex">
        <div className="hidden lg:flex flex-col justify-start gap-16 w-[45%] bg-gradient-to-br from-green-700 via-green-600 to-green-500 p-12 relative overflow-hidden">
          <div className="absolute top-[-80px] right-[-80px] w-[300px] h-[300px] bg-white/5 rounded-full" />
          <div className="absolute bottom-[-60px] left-[-60px] w-[250px] h-[250px] bg-white/5 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-white/3 rounded-full" />

          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-2.5 cursor-pointer w-fit relative z-10"
          >
            <div className="w-9 h-9 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
              <span className="text-white font-black text-base">S</span>
            </div>
            <span className="text-[20px] font-black text-white tracking-tight">
              SlotHub
            </span>
          </div>

          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-5xl mb-6">🅿️</div>
              <h2 className="text-4xl font-black text-white leading-tight mb-4">
                Your Parking
                <br />
                Spot is Waiting
              </h2>
              <p className="text-green-100 text-base leading-relaxed mb-8 max-w-sm">
                Join 50,000+ drivers who are already parking smarter across 10+
                Indian cities.
              </p>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { num: "500+", label: "Locations" },
                  { num: "4.9★", label: "Rating" },
                  { num: "50K+", label: "Drivers" },
                ].map((s, i) => (
                  <div
                    key={i}
                    className="bg-white/10 backdrop-blur rounded-2xl p-4 text-center"
                  >
                    <p className="text-xl font-black text-white">{s.num}</p>
                    <p className="text-xs text-green-100 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <p className="text-green-200 text-xs absolute bottom-8 left-12 z-10">
            © 2026 SlotHub Technologies Pvt. Ltd.
          </p>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <div
              onClick={() => navigate("/")}
              className="flex lg:hidden items-center gap-2 cursor-pointer mb-8"
            >
              <div className="w-8 h-8 bg-[#22C55E] rounded-[10px] flex items-center justify-center">
                <span className="text-white font-black text-sm">S</span>
              </div>
              <span className="text-lg font-black text-gray-900">
                Slot<span className="text-[#22C55E]">Hub</span>
              </span>
            </div>

            <div className="mb-8">
              <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-1">
                Welcome back! 👋
              </h1>
              <p className="text-gray-500 text-sm">
                Login to your SlotHub account
              </p>
            </div>

            <div className="flex bg-gray-100 rounded-2xl p-1 mb-8">
              {["driver", "owner"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setErrors({ email: "", password: "", general: "" });
                  }}
                  className={`cursor-pointer flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 capitalize ${
                    activeTab === tab
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab === "driver" ? "🚗 Driver" : "🏢 Owner"}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                  Email Address
                </label>
                <div
                  className={`flex items-center border-2 rounded-xl px-4 py-3 transition-colors duration-200 bg-white ${
                    errors.email
                      ? "border-red-400"
                      : "border-gray-200 focus-within:border-[#22C55E]"
                  }`}
                >
                  <span className="text-gray-400 mr-2 text-sm">✉️</span>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder={
                      activeTab === "driver"
                        ? "driver@gmail.com"
                        : "owner@owner.com"
                    }
                    className="flex-1 outline-none text-sm text-gray-800 placeholder-gray-300 bg-transparent font-medium"
                  />
                </div>
                <AnimatePresence>
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="text-red-500 text-xs font-medium mt-1 ml-1"
                    >
                      ✕ {errors.email}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <div className="flex justify-between mb-1.5">
                  <label className="text-xs font-semibold text-gray-600">
                    Password
                  </label>
                  <span className="text-xs text-[#22C55E] font-semibold cursor-pointer hover:text-green-700">
                    Forgot password?
                  </span>
                </div>
                <div
                  className={`flex items-center border-2 rounded-xl px-4 py-3 transition-colors duration-200 bg-white ${
                    errors.password
                      ? "border-red-400"
                      : "border-gray-200 focus-within:border-[#22C55E]"
                  }`}
                >
                  <span className="text-gray-400 mr-2 text-sm">🔒</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="flex-1 outline-none text-sm text-gray-800 placeholder-gray-300 bg-transparent font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 cursor-pointer hover:text-gray-600 ml-2 transition-colors"
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-5 h-5"
                      >
                        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-5 h-5"
                      >
                        <path d="m3 3 18 18" />
                        <path d="M10.6 10.5a3 3 0 0 0 4 4" />
                        <path d="M9.4 5.2A10.9 10.9 0 0 1 12 5c6.5 0 10 7 10 7a17.7 17.7 0 0 1-2.2 3.1" />
                        <path d="M6.7 6.7C4.1 8.2 2.5 12 2.5 12A17.4 17.4 0 0 0 7 16.9" />
                      </svg>
                    )}
                  </button>
                </div>
                <AnimatePresence>
                  {errors.password && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="text-red-500 text-xs font-medium mt-1 ml-1"
                    >
                      ✕ {errors.password}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <AnimatePresence>
                {errors.general && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="text-red-500 text-xs font-medium ml-1"
                  >
                    ✕ {errors.general}
                  </motion.p>
                )}
              </AnimatePresence>

              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full cursor-pointer bg-[#22C55E] hover:bg-[#16A34A] disabled:opacity-70 text-white font-bold py-3.5 rounded-xl transition-all duration-200 shadow-[0_4px_16px_rgba(34,197,94,0.3)] hover:shadow-[0_8px_24px_rgba(34,197,94,0.4)] flex items-center justify-center gap-2 text-sm"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Logging in...
                  </>
                ) : (
                  <>Login to SlotHub →</>
                )}
              </button>
            </div>

            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 font-medium">
                or continue with
              </span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <button
              onClick={handleGoogleLogin}
              className="w-full border-2 border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 hover:shadow-md text-gray-700 font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-sm cursor-pointer active:scale-[0.98]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                className="w-5 h-5"
              >
                <path
                  fill="#FFC107"
                  d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"
                />
                <path
                  fill="#FF3D00"
                  d="m6.3 14.7 6.6 4.8C14.7 16 19.1 13 24 13c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.5 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
                />
                <path
                  fill="#4CAF50"
                  d="M24 44c5.4 0 10.3-2 14-5.3l-6.5-5.5C29.6 35 26.9 36 24 36c-5.2 0-9.6-3.3-11.3-8H6.1C9.4 35.6 16.2 44 24 44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.3 5.5l6.5 5.5C41.1 36.1 44 30.5 44 24c0-1.3-.1-2.6-.4-3.9z"
                />
              </svg>
              Continue with Google
            </button>

            <p className="text-center text-sm text-gray-500 mt-6">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-[#22C55E] font-bold hover:text-green-700 transition-colors"
              >
                Create one free →
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
      {showRolePopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 shadow-xl text-center max-w-sm w-full mx-4">
            <h2 className="text-xl font-black text-gray-900 mb-1">
              You are a...?
            </h2>
            <p className="text-gray-400 text-sm mb-6">
              Select your role to continue with Google
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setShowRolePopup(false);
                  window.location.href =
                    "https://smart-parking-system-backend-oco6.onrender.com/api/auth/google?role=driver";
                }}
                className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold py-4 rounded-xl text-base transition-all cursor-pointer"
              >
                🚗 I'm a Driver
              </button>
              <button
                onClick={() => {
                  setShowRolePopup(false);
                  window.location.href =
                    "https://smart-parking-system-backend-oco6.onrender.com/api/auth/google?role=owner";
                }}
                className="w-full border-2 border-gray-200 hover:border-green-400 text-gray-700 font-bold py-4 rounded-xl text-base transition-all cursor-pointer"
              >
                🏢 I'm a Parking Owner
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
