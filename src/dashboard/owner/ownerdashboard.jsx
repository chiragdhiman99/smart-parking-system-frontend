import { useEffect, useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import toast from "react-hot-toast";
import { useCallback } from "react";
import { lazy, Suspense } from "react";
import AddParkingForm from "./components/addparking";
import OwnerSidebar, { navItems, getInitials } from "./components/OwnerSidebar";
import { EditParkingModal } from "./components/OwnerModals";
import { OverviewTab, ParkingsTab, BookingsTab } from "./components/OwnerTabs";
import {
  AnalyticsTab,
  ProfileTab,
} from "./components/OwnerAnalyticsAndProfile";

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [ownerparking, setOwnerParking] = useState([]);
  const [params] = useSearchParams();
  const urlToken = params.get("token");
  const [editingProfile, setEditingProfile] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [userbookings, setUserBookings] = useState([]);
  const [bookingFilter, setBookingFilter] = useState("All");
  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [editingParking, setEditingParking] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeNav]);

  useEffect(() => {
    if (urlToken) localStorage.setItem("token", urlToken);
  }, [urlToken]);

  const token = urlToken || localStorage.getItem("token");
  const decoded = token ? jwtDecode(token) : null;

  useEffect(() => {
    if (!decoded) return;
    axios
      .get(
        `https://smart-parking-system-backend-oco6.onrender.com/api/auth/user/${decoded.userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then((res) => setUserData(res.data))
      .catch(() =>
        toast.error("Failed to fetch user data. Please log in again."),
      );
  }, [decoded?.userId]);

  useEffect(() => {
    if (!decoded?.userId) return;
    axios
      .get(
        `https://smart-parking-system-backend-oco6.onrender.com/api/parkings/owner/${decoded.userId}`,
      )
      .then((res) => setOwnerParking(res.data))
      .catch(() => setOwnerParking([]));
  }, [decoded?.userId]);

  useEffect(() => {
    const tab = params.get("tab");
    if (tab) setActiveNav(tab);
  }, []);

  useEffect(() => {
    if (!decoded?.userId) return;
    axios
      .get(
        `https://smart-parking-system-backend-oco6.onrender.com/api/bookings/${decoded.userId}`,
      )
      .then((res) => setUserBookings(res.data))
      .catch(() =>
        toast.error("Failed to fetch your bookings. Please try again."),
      );
  }, []);

  useEffect(() => {
    if (!decoded?.userId) return;
    axios
      .get(
        `https://smart-parking-system-backend-oco6.onrender.com/api/notifications/${decoded.userId}`,
      )
      .then((res) =>
        setNotifications(res.data.filter((n) => n.role === "owner")),
      )
      .catch(() =>
        toast.error("Failed to fetch notifications. Please try again."),
      );
  }, []);

  const markAllRead = useCallback(() => {
    axios
      .put(
        `https://smart-parking-system-backend-oco6.onrender.com/api/notifications/read/${decoded.userId}`,
      )
      .then(() =>
        setNotifications((prev) => prev.map((n) => ({ ...n, isread: true }))),
      )
      .catch(() =>
        toast.error("Failed to mark notifications as read. Please try again."),
      );
  }, [decoded?.userId]);

  const handleSave = useCallback(() => {
    axios
      .put(
        `https://smart-parking-system-backend-oco6.onrender.com/api/auth/user/${decoded.userId}`,
        { fullName: editName, phone: editPhone },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then((res) => {
        setUserData(res.data);
        setEditingProfile(false);
        toast.success("Profile updated successfully!");
      })
      .catch(() => toast.error("Failed to update profile. Please try again."));
  }, [decoded?.userId, editName, editPhone, token]);

  const handleEdit = useCallback((parking) => {
    setEditingParking(parking);
    setEditForm({
      name: parking.name,
      address: parking.address,
      openTime: parking.availability?.openTime,
      closeTime: parking.availability?.closeTime,
      hourly4w: parking.pricing?.["4-wheeler"]?.hourly,
      daily4w: parking.pricing?.["4-wheeler"]?.daily,
      hourly2w: parking.pricing?.["2-wheeler"]?.hourly,
      daily2w: parking.pricing?.["2-wheeler"]?.daily,
      amenities: parking.amenities,
      days: parking.availability?.days,
      autoApprove: parking.autoApprove,
      blockedDates: parking.blockedDates || [],
      fourWheelerSlots: parking.fourWheelerSlots || 0,
      twoWheelerSlots: parking.twoWheelerSlots || 0,
    });
  }, []);

  const handleSaveEdit = useCallback(() => {
    axios
      .put(
        `https://smart-parking-system-backend-oco6.onrender.com/api/parkings/${editingParking._id}`,
        {
          name: editForm.name,
          address: editForm.address,
          availability: {
            openTime: editForm.openTime,
            closeTime: editForm.closeTime,
            days: editForm.days,
          },
          pricing: {
            "4-wheeler": {
              hourly: Number(editForm.hourly4w),
              daily: Number(editForm.daily4w),
            },
            "2-wheeler": {
              hourly: Number(editForm.hourly2w),
              daily: Number(editForm.daily2w),
            },
          },
          amenities: editForm.amenities,
          autoApprove: editForm.autoApprove,
          blockedDates: editForm.blockedDates,
          fourWheelerSlots: Number(editForm.fourWheelerSlots),
          twoWheelerSlots: Number(editForm.twoWheelerSlots),
        },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then((res) => {
        setOwnerParking((prev) =>
          prev.map((p) => (p._id === editingParking._id ? res.data : p)),
        );
        setEditingParking(null);
        toast.success("Parking updated successfully!");
      })
      .catch(() => toast.error("Failed to update parking. Please try again."));
  }, [editingParking, editForm, token]);

  const handleDeleteParking = useCallback(
    (parkingId) => {
      axios
        .delete(
          `https://smart-parking-system-backend-oco6.onrender.com/api/parkings/${parkingId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )
        .then(() => {
          setOwnerParking((prev) => prev.filter((p) => p._id !== parkingId));
          toast.success("Parking deleted successfully!");
        })
        .catch(() =>
          toast.error("Failed to delete parking. Please try again."),
        );
    },
    [token],
  );

  const totalearnings = useMemo(() => {
    return userbookings.reduce(
      (total, b) => total + Number(b.amount.replace("₹", "")),
      0,
    );
  }, [userbookings]);

  const totalslots = useMemo(() => {
    return ownerparking.reduce((total, p) => total + p.availableSlots, 0);
  }, [ownerparking]);
  const filteredBookings = useMemo(() => {
    return bookingFilter === "All"
      ? userbookings
      : userbookings.filter(
          (b) => b.bookingStatus?.toLowerCase() === bookingFilter.toLowerCase(),
        );
  }, [userbookings, bookingFilter]);

  const map = {};
  userbookings.forEach((b) => {
    const date = new Date(b.createdAt).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    const amount = Number(b.amount.replace("₹", ""));
    map[date] = (map[date] || 0) + amount;
  });
  const revenuegraph = Object.entries(map).map(([date, amount]) => ({
    date,
    amount,
  }));

  if (!userData)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      {showForm && (
        <AddParkingForm
          onClose={() => setShowForm(false)}
          onSubmit={() => setShowForm(false)}
        />
      )}

      <EditParkingModal
        editingParking={editingParking}
        setEditingParking={setEditingParking}
        editForm={editForm}
        setEditForm={setEditForm}
        handleSaveEdit={handleSaveEdit}
      />

      <OwnerSidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        userData={userData}
        decoded={decoded}
        setShowForm={setShowForm}
      />

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
              <p className="text-xs text-gray-400">
                Welcome back, {userData.fullName.split(" ")[0]}! 👋
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-2 text-gray-400 hover:text-orange-500 transition-all duration-200 cursor-pointer group"
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
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute top-14 right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800">
                      Notifications
                    </h3>
                    <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-medium">
                      {notifications.filter((n) => !n.isread).length} new
                    </span>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-gray-50 [&::-webkit-scrollbar]:hidden">
                    {notifications.length === 0 ? (
                      <p className="text-center text-gray-400 text-sm py-6">
                        No new notifications!
                      </p>
                    ) : (
                      notifications.map((notif) => (
                        <motion.div
                          key={notif._id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.15 }}
                          className={`px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition cursor-pointer ${!notif.isread ? "bg-orange-50" : ""}`}
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
                            <span className="w-2 h-2 bg-orange-500 rounded-full mt-1.5 shrink-0" />
                          )}
                        </motion.div>
                      ))
                    )}
                  </div>
                  <div
                    onClick={markAllRead}
                    className="px-4 py-2 border-t border-gray-100 text-center"
                  >
                    <button className="text-xs text-orange-500 hover:text-orange-600 font-medium">
                      Mark all as read
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {userData.photo ? (
              <img
                src={userData.photo}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-xl object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm bg-[#3B82F6]">
                {getInitials(userData.fullName)}
              </div>
            )}
          </div>
        </div>

        <div className="p-6 max-w-6xl mx-auto">
          {activeNav === "overview" && (
            <OverviewTab
              userbookings={userbookings}
              ownerparking={ownerparking}
              totalearnings={totalearnings}
              totalslots={totalslots}
              userData={userData}
              setActiveNav={setActiveNav}
            />
          )}
          {activeNav === "parkings" && (
            <ParkingsTab
              ownerparking={ownerparking}
              setShowForm={setShowForm}
              handleEdit={handleEdit}
              handleDeleteParking={handleDeleteParking}
            />
          )}
          {activeNav === "bookings" && (
            <BookingsTab
              userbookings={userbookings}
              filteredBookings={filteredBookings}
              bookingFilter={bookingFilter}
              setBookingFilter={setBookingFilter}
              totalearnings={totalearnings}
            />
          )}
          {activeNav === "analytics" && (
            <AnalyticsTab
              userbookings={userbookings}
              ownerparking={ownerparking}
              totalearnings={totalearnings}
              revenuegraph={revenuegraph}
            />
          )}
          {activeNav === "profile" && (
            <ProfileTab
              userData={userData}
              editingProfile={editingProfile}
              setEditingProfile={setEditingProfile}
              editName={editName}
              setEditName={setEditName}
              editPhone={editPhone}
              setEditPhone={setEditPhone}
              handleSave={handleSave}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default OwnerDashboard;
