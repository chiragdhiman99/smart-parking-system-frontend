import { Suspense, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import { lazy } from 'react';
import axios from "axios";
import toast from "react-hot-toast";
const AdminOverview = lazy(() => import("./components/adminOverview"));
import AdminSections from "./components/adminSection";
import ManageParkingLocations from "./components/parkinglocation";
import PricingGuidelines from "./PricingGuidelines";

export const navItems = [
  { id: "overview", label: "Overview", icon: "🏠" },
  { id: "bookings", label: "Bookings", icon: "📋" },
  { id: "owners", label: "Owners", icon: "🏢" },
  { id: "parkings", label: "Parking Locations", icon: "📍" },
  { id: "users", label: "Users", icon: "👥" },
  { id: "pricing", label: "Pricing Guidelines", icon: "💰" },
  { id: "settings", label: "Settings", icon: "⚙️" },
];

export const getInitials = (name) => {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export const statusStyle = {
  active: "bg-green-50 text-green-700 border border-green-200",
  completed: "bg-blue-50 text-blue-700 border border-blue-200",
  cancelled: "bg-red-50 text-red-500 border border-red-200",
  pending: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  confirmed: "bg-emerald-50 text-emerald-700 border border-emerald-200",
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [bookingdata, setBookingData] = useState([]);
  const [parkingData, setParkingData] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [totalslots, settotalslots] = useState(0);
  const [occupiedslots, setoccupiedslots] = useState(0);
  const [linedata, setlinedata] = useState([]);
  const [params] = useSearchParams();
  const urlToken = params.get("token");

  useEffect(() => {
    if (urlToken) localStorage.setItem("token", urlToken);
  }, [urlToken]);

  const token = localStorage.getItem("adminToken");
  const decoded = token ? jwtDecode(token) : null;

  useEffect(() => {
    axios
      .get(`https://smart-parking-system-backend-oco6.onrender.com/api/admin/user/${decoded?.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUserData(res.data))
      .catch(() => toast.error("Failed to load user data."));
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeNav]);

  useEffect(() => {
    axios
      .get(`https://smart-parking-system-backend-oco6.onrender.com/api/bookings/get/bookingsss`)
      .then((res) => {
        const occupied = res.data.filter(
          (b) => b.bookingStatus === "confirmed",
        ).length;
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
        const last7 = res.data.filter(
          (b) => new Date(b.createdAt) >= sevenDaysAgo,
        );
        const chartdata = last7
          .reduce((result, booking) => {
            const date = new Date(booking.createdAt).toLocaleDateString(
              "en-IN",
              { day: "numeric", month: "short" },
            );
            const amt = Number(booking.amount.replace("₹", "").trim());
            const existing = result.find((item) => item.date === date);
            if (existing) {
              existing.bookings += 1;
              existing.revenue += amt;
            } else result.push({ date, bookings: 1, revenue: amt });
            return result;
          }, [])
          .sort((a, b) => new Date(a.date) - new Date(b.date));
        setlinedata(chartdata);
        setoccupiedslots(occupied);
        setBookingData(res.data);
      })
      .catch(() => toast.error("Failed to load booking data."));
  }, []);

  useEffect(() => {
    axios
      .get(`https://smart-parking-system-backend-oco6.onrender.com/api/parkings`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setParkingData(res.data);
        const total = res.data.reduce(
          (t, p) =>
            t +
            Number(p.twoWheelerSlots || 0) +
            Number(p.fourWheelerSlots || 0),
          0,
        );
        settotalslots(total);
      })
      .catch(() => toast.error("Failed to load parking data."));
  }, []);

  useEffect(() => {
    axios
      .get(`https://smart-parking-system-backend-oco6.onrender.com/api/auth/users`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setAllUsers(res.data))
      .catch(() => toast.error("Failed to load users."));
  }, []);

  useEffect(() => {
    axios
      .get(`https://smart-parking-system-backend-oco6.onrender.com/api/notifications`)
      .then((res) => {
        const filtered = res.data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .filter((n) => n.role === "admin");
        setNotifications(filtered);
      })
      .catch(() => toast.error("Failed to load notifications."));
  }, []);

  const markAllRead = () => {
    axios
      .put(`https://smart-parking-system-backend-oco6.onrender.com/api/notifications/read/role/admin`)
      .then(() =>
        setNotifications((prev) => prev.map((n) => ({ ...n, isread: true }))),
      )
      .catch(() => toast.error("Failed to mark notifications as read."));
  };

  if (!userData)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-100 flex flex-col h-screen transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-9 h-9 bg-[#ef4444] rounded-xl flex items-center justify-center">
              <span className="text-white font-black text-base">S</span>
            </div>
            <span className="text-lg font-black text-gray-900">
              Slot<span className="text-[#ef4444]">Hub</span>
            </span>
          </div>
        </div>

        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            {userData.photo ? (
              <img
                src={userData.photo}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-xl object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm bg-[#ef4444]">
                {getInitials(userData.adminName)}
              </div>
            )}
            <div>
              <p className="text-sm font-bold text-gray-900">
                {userData.adminName}
              </p>
              <span className="text-[10px] font-semibold bg-red-50 text-red-600 px-2 py-0.5 rounded-full">
                Admin
              </span>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveNav(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeNav === item.id
                  ? "bg-[#ef4444] text-white shadow-[0_4px_12px_rgba(239,68,68,0.3)]"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
            className="w-full text-red-500 hover:bg-red-50 font-semibold py-2.5 rounded-xl text-sm transition-all cursor-pointer"
          >
            Logout →
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="flex-1 min-w-0 lg:ml-64">
        <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 cursor-pointer"
            >
              ☰
            </button>
            <div>
              <h1 className="text-lg font-black text-gray-900">
                {navItems.find((n) => n.id === activeNav)?.label}
              </h1>
              <p className="text-xs text-gray-400">Welcome back, Admin! 👋</p>
            </div>
          </div>

          <div className="flex items-center gap-3 relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-2 text-gray-400 hover:text-red-500 transition-all duration-200 cursor-pointer group"
            >
              <span className="text-xl group-hover:scale-110 inline-block transition-transform duration-200">
                🔔
              </span>
              {notifications.filter((n) => !n.isread).length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {notifications.filter((n) => !n.isread).length}
                </span>
              )}
            </button>

            <AnimatePresence>
              {notifOpen && (
                <div className="absolute top-14 right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800">
                      Notifications
                    </h3>
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                      {notifications.filter((n) => !n.isread).length} new
                    </span>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                    {notifications.length === 0 ? (
                      <p className="text-center text-gray-400 text-sm py-6">
                        No new notifications!
                      </p>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif._id}
                          className={`px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition cursor-pointer ${!notif.isread ? "bg-red-50" : ""}`}
                        >
                          <span className="text-xl mt-0.5">
                            {notif.isread ? "🔔" : "🔴"}
                          </span>
                          <div className="flex-1">
                            <p className="text-sm text-gray-700">
                              {notif.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(notif.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                          {!notif.isread && (
                            <span className="w-2 h-2 bg-red-500 rounded-full mt-1.5 shrink-0" />
                          )}
                        </div>
                      ))
                    )}
                  </div>
                  <div
                    onClick={markAllRead}
                    className="px-4 py-2 border-t border-gray-100 text-center"
                  >
                    <button className="text-xs text-red-500 hover:text-red-600 font-medium">
                      Mark all as read
                    </button>
                  </div>
                </div>
              )}
            </AnimatePresence>

            {userData.photo ? (
              <img
                src={userData.photo}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-xl object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm bg-[#ef4444]">
                {getInitials(userData.adminName)}
              </div>
            )}
          </div>
        </div>

        <div className="p-6 max-w-6xl mx-auto">
          {activeNav === "overview" && (
            <Suspense fallback={<div>Loading...</div>}>
            <AdminOverview
              bookingdata={bookingdata}
              parkingData={parkingData}
              allUsers={allUsers}
              totalslots={totalslots}
              occupiedslots={occupiedslots}
              linedata={linedata}
              setActiveNav={setActiveNav}
            />
            </Suspense>
          )}
          {(activeNav === "bookings" ||
            activeNav === "owners" ||
            activeNav === "users" ||
            activeNav === "settings") && (
            <AdminSections
              activeNav={activeNav}
              bookingdata={bookingdata}
              setBookingData={setBookingData}
              parkingData={parkingData}
              setParkingData={setParkingData}
              allUsers={allUsers}
              setAllUsers={setAllUsers}
              userData={userData}
              setUserData={setUserData}
              token={token}
              decoded={decoded}
            />
          )}
          {activeNav === "parkings" && <ManageParkingLocations />}
          {activeNav === "pricing" && <PricingGuidelines />}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
