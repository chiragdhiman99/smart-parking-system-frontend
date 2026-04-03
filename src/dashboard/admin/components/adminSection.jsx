import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";

const statusStyle = {
  active: "bg-green-50 text-green-700 border border-green-200",
  completed: "bg-blue-50 text-blue-700 border border-blue-200",
  cancelled: "bg-red-50 text-red-500 border border-red-200",
  pending: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  confirmed: "bg-emerald-50 text-emerald-700 border border-emerald-200",
};

const getInitials = (name) => {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const AdminSections = ({
  activeNav,
  bookingdata,
  setBookingData,
  parkingData,
  setParkingData,
  allUsers,
  setAllUsers,
  userData,
  setUserData,
  token,
  decoded,
}) => {
  const [filter, setFilter] = useState("all");
  const [ownerFilter, setOwnerFilter] = useState("all");
  const [userSearch, setUserSearch] = useState("");
  const [cancelModal, setCancelModal] = useState(null);
  const [banLoading, setBanLoading] = useState(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");

  const filteredBookings = bookingdata.filter((b) =>
    filter === "all" ? true : b.bookingStatus === filter,
  );

  const filteredOwners = parkingData.filter((o) =>
    ownerFilter === "all" ? true : o.status === ownerFilter,
  );

  const filteredUsers = allUsers.filter((user) => {
    const q = userSearch.toLowerCase();
    return (
      user.fullName?.toLowerCase().includes(q) ||
      user.email?.toLowerCase().includes(q)
    );
  });

  const handleCancelBooking = async (bookingid) => {
    try {
      await axios.put(
        `http://localhost:5000/api/bookings/cancel/${bookingid}`,
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
      toast.error("Failed to cancel booking.");
    }
  };

  const handleVerifyOwner = (parkingId, status) => {
    axios
      .put(
        `http://localhost:5000/api/parkings/update/${parkingId}`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then(() => {
        setParkingData((prev) =>
          prev.map((p) => (p._id === parkingId ? { ...p, status } : p)),
        );
        toast.success("Status updated successfully!");
      })
      .catch(() => toast.error("Failed to update status."));
  };

  const handleBanUser = (userId, currentStatus) => {
    const newStatus = currentStatus === "banned" ? "active" : "banned";
    setBanLoading(userId);
    axios
      .put(
        `http://localhost:5000/api/auth/user/${userId}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then(() => {
        setAllUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, status: newStatus } : u)),
        );
        setBanLoading(null);
        toast.success(
          `User ${newStatus === "banned" ? "banned" : "unbanned"} successfully!`,
        );
      })
      .catch(() => {
        setBanLoading(null);
        toast.error("Failed to update user status.");
      });
  };

  const handleSave = () => {
    axios
      .put(
        `http://localhost:5000/api/auth/user/${decoded.userId}`,
        { fullName: editName, phone: editPhone },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then((res) => {
        setUserData(res.data);
        setEditingProfile(false);
        toast.success("Profile updated successfully!");
      })
      .catch(() => toast.error("Failed to update profile."));
  };

  return (
    <>
      {activeNav === "bookings" && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4"
        >
          <div className="flex gap-2 flex-wrap mb-4">
            {["all", "confirmed", "pending", "completed", "cancelled"].map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-1.5 rounded-full text-sm font-bold transition cursor-pointer ${filter === status ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ),
            )}
          </div>

          {filteredBookings.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-3">📋</p>
              <p className="text-sm font-bold text-gray-500">
                No bookings found
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {filteredBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
                >
                  <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl font-black text-red-600">
                        {booking.slot}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-base font-black text-gray-900">
                          Slot {booking.slot}
                        </p>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusStyle[booking.bookingStatus] || "bg-gray-50 text-gray-500 border-gray-200"}`}
                        >
                          {booking.bookingStatus?.charAt(0).toUpperCase() +
                            booking.bookingStatus?.slice(1)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 font-medium">
                        {booking.userEmail}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(booking.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="sm:text-right flex-shrink-0">
                      <p className="text-xl font-black text-gray-900">
                        {booking.amount}
                      </p>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${booking.paymentStatus === "success" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}
                      >
                        {booking.paymentStatus === "success"
                          ? "✓ Paid"
                          : "Failed"}
                      </span>
                    </div>
                  </div>

                  <div className="mx-5 mb-4 bg-gray-50 rounded-xl px-4 py-3 flex items-center gap-3">
                    <div className="text-center">
                      <p className="text-[10px] text-gray-400 mb-0.5">From</p>
                      <p className="text-lg font-black text-gray-900">
                        {booking.fromTime}
                      </p>
                    </div>
                    <div className="flex-1 flex items-center gap-2">
                      <div className="flex-1 h-0.5 bg-gray-200 rounded" />
                      <span className="text-[10px] text-gray-400 whitespace-nowrap">
                        {(() => {
                          const [fh, fm] = booking.fromTime
                            ?.split(":")
                            .map(Number) || [0, 0];
                          const [th, tm] = booking.toTime
                            ?.split(":")
                            .map(Number) || [0, 0];
                          const diff = th * 60 + tm - (fh * 60 + fm);
                          const hrs = (diff / 60).toFixed(1);
                          return `${hrs} hr${hrs != 1 ? "s" : ""}`;
                        })()}
                      </span>
                      <div className="flex-1 h-0.5 bg-gray-200 rounded" />
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] text-gray-400 mb-0.5">To</p>
                      <p className="text-lg font-black text-gray-900">
                        {booking.toTime}
                      </p>
                    </div>
                  </div>

                  <div className="px-5 pb-4">
                    <p className="text-[10px] text-gray-300 font-mono truncate">
                      ID: {booking.paymentId}
                    </p>
                  </div>

                  {booking.bookingStatus === "confirmed" && (
                    <div className="px-5 pb-4">
                      <button
                        onClick={() => setCancelModal(booking)}
                        className="w-full py-2.5 cursor-pointer rounded-xl text-sm font-bold border border-red-200 text-red-500 bg-red-50 hover:bg-red-500 hover:text-white transition-all duration-200 active:scale-95"
                      >
                        Cancel Booking
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {activeNav === "owners" && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4"
        >
          <div className="flex gap-2 flex-wrap">
            {["all", "pending", "approved", "rejected"].map((status) => (
              <button
                key={status}
                onClick={() => setOwnerFilter(status)}
                className={`px-4 py-1.5 rounded-full text-sm font-bold transition cursor-pointer ${ownerFilter === status ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          {filteredOwners.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
              <p className="text-3xl mb-3">🏢</p>
              <p className="text-sm font-bold text-gray-500">No owners found</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filteredOwners.map((owner, i) => (
                <motion.div
                  key={owner._id || i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="bg-white rounded-2xl border border-gray-100 p-5"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-sm bg-[#ef4444] flex-shrink-0">
                      {owner.name?.charAt(0).toUpperCase() || "P"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black text-gray-900">
                        {owner.name || "—"}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {owner.address}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        🅿️ {owner.totalSlots} total slots
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        owner.status === "approved"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : owner.status === "rejected"
                            ? "bg-red-50 text-red-500 border-red-200"
                            : "bg-yellow-50 text-yellow-700 border-yellow-200"
                      }`}
                    >
                      {owner.status === "approved"
                        ? "✅ Approved"
                        : owner.status === "rejected"
                          ? "❌ Rejected"
                          : "⏳ Pending"}
                    </span>
                  </div>
                  {owner.status === "pending" && (
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleVerifyOwner(owner._id, "approved")}
                        className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-green-50 text-green-700 border border-green-200 hover:bg-green-500 hover:text-white transition-all cursor-pointer"
                      >
                        ✅ Approve
                      </button>
                      <button
                        onClick={() => handleVerifyOwner(owner._id, "rejected")}
                        className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-red-50 text-red-500 border border-red-200 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                      >
                        ❌ Reject
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {activeNav === "users" && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4"
        >
          <p className="text-sm font-black text-gray-900">
            All Users
            <span className="ml-2 text-xs font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
              {filteredUsers.length}
            </span>
          </p>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              🔍
            </span>
            <input
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full bg-white border border-gray-100 rounded-2xl pl-10 pr-4 py-3 text-sm font-medium text-gray-700 outline-none focus:border-red-300 transition-all"
            />
            {userSearch && (
              <button
                onClick={() => setUserSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {filteredUsers.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
              <p className="text-3xl mb-3">👥</p>
              <p className="text-sm font-bold text-gray-500">
                {userSearch
                  ? "No users found for this search"
                  : "No users found"}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filteredUsers.map((user, i) => {
                const userBookingCount = bookingdata.filter(
                  (b) => b.userEmail === user.email,
                ).length;
                return (
                  <motion.div
                    key={user._id || i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="bg-white rounded-2xl border border-gray-100 px-5 py-4 flex items-center gap-4"
                  >
                    {user.photo ? (
                      <img
                        src={user.photo}
                        referrerPolicy="no-referrer"
                        className="w-11 h-11 rounded-xl object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-black text-sm bg-[#ef4444] flex-shrink-0">
                        {getInitials(user.fullName)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black text-gray-900">
                        {user.fullName || "—"}
                      </p>
                      <p className="text-xs truncate text-gray-400">
                        {user.email}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        📋 {userBookingCount} booking
                        {userBookingCount !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0 flex flex-col items-end gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${user.role === "admin" ? "bg-red-50 text-red-600" : "bg-gray-100 text-gray-500"}`}
                      >
                        {user.role === "driver" ? "🚗 Driver" : "🏠 Owner"}
                      </span>
                      {user.role !== "admin" && (
                        <button
                          onClick={() => handleBanUser(user._id, user.status)}
                          disabled={banLoading === user._id}
                          className={`text-[11px] font-bold px-3 py-1 rounded-full border transition-all cursor-pointer ${user.status === "banned" ? "bg-green-50 text-green-600 border-green-200 hover:bg-green-500 hover:text-white" : "bg-red-50 text-red-500 border-red-200 hover:bg-red-500 hover:text-white"}`}
                        >
                          {banLoading === user._id
                            ? "..."
                            : user.status === "banned"
                              ? "✅ Unban"
                              : "🚫 Ban"}
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      )}

      {activeNav === "settings" && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 max-w-lg"
        >
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center gap-4 mb-6">
              {userData.photo ? (
                <img
                  src={userData.photo}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-2xl object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-xl bg-[#ef4444]">
                  {getInitials(userData.adminName)}
                </div>
              )}
              <div>
                <p className="text-lg font-black text-gray-900">
                  {userData.adminName}
                </p>
                <p className="text-sm text-gray-400">{userData.email}</p>
                <span className="text-xs font-semibold bg-red-50 text-red-600 px-2 py-0.5 rounded-full">
                  🛡 Super Admin
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold text-gray-400 mb-1.5 block uppercase tracking-wider">
                  Full Name
                </label>
                {editingProfile ? (
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="border-2 border-red-400 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 w-full outline-none"
                  />
                ) : (
                  <div className="border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50">
                    {userData.adminName}
                  </div>
                )}
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 mb-1.5 block uppercase tracking-wider">
                  Email
                </label>
                <div className="border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50">
                  {userData.email}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 mb-1.5 block uppercase tracking-wider">
                  Phone Number
                </label>
                {editingProfile ? (
                  <input
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="Enter phone number"
                    className="border-2 border-red-400 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 w-full outline-none"
                  />
                ) : (
                  <div className="border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50">
                    {userData.phone || "Not added yet"}
                  </div>
                )}
              </div>

              {editingProfile ? (
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleSave}
                    className="flex-1 bg-[#ef4444] hover:bg-red-600 text-white font-bold py-3 rounded-xl text-sm transition-all cursor-pointer"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setEditingProfile(false);
                      setEditName(userData.fullName);
                      setEditPhone(userData.phone || "");
                    }}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-3 rounded-xl text-sm transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setEditingProfile(true);
                    setEditName(userData.fullName);
                    setEditPhone(userData.phone || "");
                  }}
                  className="w-full bg-[#ef4444] hover:bg-red-600 text-white font-bold py-3 rounded-xl text-sm transition-all cursor-pointer mt-2"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {cancelModal && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCancelModal(null)}
            />
            <motion.div
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm px-4"
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                transition: { type: "spring", stiffness: 320, damping: 25 },
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
                y: 10,
                transition: { duration: 0.18 },
              }}
            >
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="h-1.5 bg-gradient-to-r from-red-400 via-red-500 to-rose-500" />
                <div className="p-6 text-center">
                  <div className="w-14 h-14 rounded-full bg-red-50 border-2 border-red-100 flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-7 h-7 text-red-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-lg font-bold text-gray-800 mb-1">
                    Cancel Booking?
                  </h2>
                  <p className="text-sm text-gray-500 mb-5">
                    Are you sure you want to cancel this booking?
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setCancelModal(null)}
                      className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 cursor-pointer text-sm font-semibold hover:bg-gray-50 transition-all"
                    >
                      No
                    </button>
                    <button
                      onClick={() => handleCancelBooking(cancelModal._id)}
                      className="flex-1 cursor-pointer py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-all"
                    >
                      Yes, Cancel
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminSections;
