import { useEffect, useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import toast from "react-hot-toast";

import DriverSidebar, {
  navItems,
  getInitials,
} from "./components/DriverSidebar";
import {
  CancelModal,
  ReportModal,
  ReviewModal,
} from "./components/DriverModals";
import {
  OverviewTab,
  BookingsTab,
  HistoryTab,
  ProfileTab,
} from "./components/DriverTabs";
const DriverDashboard = () => {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [bookingdata, setBookingData] = useState([]);
  const [filter, setFilter] = useState("all");
  const [reviewModal, setReviewModal] = useState(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [params] = useSearchParams();
  const urlToken = params.get("token");
  const [reviewedBookings, setReviewedBookings] = useState([]);
  const [allreviews, setAllReviews] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [cancelModal, setCancelModal] = useState(null);
  const [reportModal, setReportModal] = useState(null);
  const [reportText, setReportText] = useState("");
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 2,
      message: "Your slot has been booked successfully! 🎉",
      isread: true,
      createdAt: new Date(),
    },
  ]);

  useEffect(() => {
    if (urlToken) localStorage.setItem("token", urlToken);
  }, [urlToken]);

  const token = urlToken || localStorage.getItem("token");
  const decoded = token ? jwtDecode(token) : null;

  useEffect(() => {
    if (!decoded) return;
    axios
      .get(`https://smart-parking-system-backend-oco6.onrender.com/api/auth/user/${decoded.userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUserData(res.data))
      .catch(() =>
        toast.error("Failed to fetch user data. Please log in again."),
      );
  }, [decoded?.userId]);

  useEffect(() => {
    if (!userData?.email) return;
    axios
      .get("https://smart-parking-system-backend-oco6.onrender.com/api/bookings/get/booking", {
        params: { userEmail: userData.email },
      })
      .then((res) => setBookingData(res.data))
      .catch(() =>
        toast.error("Failed to fetch booking data. Please try again."),
      );
  }, [userData]);

  useEffect(() => {
    if (!decoded) return;
    axios
      .get(`https://smart-parking-system-backend-oco6.onrender.com/api/notifications/${decoded.userId}`)
      .then((res) => {
        setNotifications(res.data.filter((n) => n.role === "user"));
      })
      .catch(() =>
        toast.error("Failed to fetch notifications. Please try again."),
      );
  }, []);

  useEffect(() => {
    axios
      .get("https://smart-parking-system-backend-oco6.onrender.com/api/reviews")
      .then((res) => {
        const reviews = res.data.reviews;
        setAllReviews(reviews);
        setReviewedBookings(reviews.map((r) => r.bookingId));
      })
      .catch(() => toast.error("Failed to fetch reviews. Please try again."));
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeNav]);

  const handleSave = () => {
    axios
      .put(
        `https://smart-parking-system-backend-oco6.onrender.com/api/auth/user/${decoded.userId}`,
        { fullName: editName, phone: editPhone, role: "driver" },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then((res) => {
        setUserData(res.data);
        setEditingProfile(false);
        toast.success("Profile updated successfully!");
      })
      .catch(() => toast.error("Failed to update profile. Please try again."));
  };

  const handleReportSubmit = async () => {
    if (!reportText.trim()) return;
    setReportSubmitting(true);
    try {
      await axios.post("https://smart-parking-system-backend-oco6.onrender.com/api/notifications", {
        userId: decoded.userId,
        message: `🚨 Issue Reported by ${userData.fullName}: "${reportText}" — Slot ${reportModal.slot} | Booking ID: ${reportModal._id}`,
        isread: false,
        role: "admin",
      });
      setReportModal(null);
      setReportText("");
      toast.success("Report submitted successfully!");
    } catch {
      toast.error("Failed to submit report. Please try again.");
    }
    setReportSubmitting(false);
  };

  const markAllRead = () => {
    axios
      .put(`https://smart-parking-system-backend-oco6.onrender.com/api/notifications/read/${decoded.userId}`)
      .then(() =>
        setNotifications((prev) => prev.map((n) => ({ ...n, isread: true }))),
      )
      .catch(() =>
        toast.error("Failed to mark notifications as read. Please try again."),
      );
  };

  const handleCancelBooking = async (bookingid) => {
    try {
      await axios.put(
        `https://smart-parking-system-backend-oco6.onrender.com/api/bookings/cancel/${bookingid}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setBookingData((prev) =>
        prev.map((b) =>
          b._id === bookingid ? { ...b, bookingStatus: "cancelled" } : b,
        ),
      );
      setCancelModal(null);
      toast.success("Booking cancelled successfully!");
    } catch {
      toast.error("Failed to cancel booking. Please try again.");
    }
  };

  const handlereviewsubmit = () => {
    axios
      .post("https://smart-parking-system-backend-oco6.onrender.com/api/reviews", {
        userId: decoded.userId,
        userName: userData.fullName,
        parkingId: reviewModal.parkingid,
        bookingId: reviewModal._id,
        rating: reviewRating,
        comment: reviewComment,
      })
      .then(() => {
        setReviewedBookings([...reviewedBookings, reviewModal._id]);
        setReviewModal(null);
        setReviewRating(0);
        setReviewComment("");
        toast.success("Review submitted successfully!");
      })
      .catch(() => toast.error("Failed to submit review. Please try again."));
  };

  const filteredBookings = useMemo(() => {
    return bookingdata.filter((b) =>
      filter === "all" ? true : b.bookingStatus === filter,
    );
  }, [bookingdata, filter]);

  const totalspent = useMemo(() => {
    return bookingdata.reduce(
      (total, booking) => total + Number(booking.amount.replace("₹", "")),
      0,
    );
  }, [bookingdata]);

  const myReviews = useMemo(() => {
    return allreviews.filter((r) => r.userId === decoded?.userId);
  }, [allreviews, decoded?.userId]);
  
  const myAvgRating = useMemo(() => {
    return myReviews.length > 0
      ? (
          myReviews.reduce((sum, r) => sum + r.rating, 0) / myReviews.length
        ).toFixed(1)
      : "N/A";
  }, [myReviews]);

  if (!userData)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <DriverSidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        userData={userData}
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
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm bg-[#22C55E]">
                {getInitials(userData.fullName)}
              </div>
            )}
          </div>
        </div>

        <div className="p-6 max-w-6xl mx-auto">
          {activeNav === "overview" && (
            <OverviewTab
              bookingdata={bookingdata}
              totalspent={totalspent}
              myAvgRating={myAvgRating}
              userData={userData}
              setActiveNav={setActiveNav}
            />
          )}

          {activeNav === "bookings" && (
            <BookingsTab
              filteredBookings={filteredBookings}
              filter={filter}
              setFilter={setFilter}
              navigate={navigate}
              setCancelModal={setCancelModal}
              setReportModal={setReportModal}
            />
          )}

          {activeNav === "history" && (
            <>
              <ReviewModal
                reviewModal={reviewModal}
                setReviewModal={setReviewModal}
                reviewRating={reviewRating}
                setReviewRating={setReviewRating}
                reviewComment={reviewComment}
                setReviewComment={setReviewComment}
                handlereviewsubmit={handlereviewsubmit}
              />
              <HistoryTab
                bookingdata={bookingdata}
                totalspent={totalspent}
                reviewedBookings={reviewedBookings}
                setReviewModal={setReviewModal}
                navigate={navigate}
              />
            </>
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

      <ReportModal
        reportModal={reportModal}
        setReportModal={setReportModal}
        reportText={reportText}
        setReportText={setReportText}
        handleReportSubmit={handleReportSubmit}
        reportSubmitting={reportSubmitting}
      />

      <CancelModal
        cancelModal={cancelModal}
        setCancelModal={setCancelModal}
        handleCancelBooking={handleCancelBooking}
      />
    </div>
  );
};

export default DriverDashboard;
