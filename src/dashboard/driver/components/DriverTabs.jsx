import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import {
  ClipboardList,
  Banknote,
  Trophy,
  Car,
  ParkingSquare,
  Search,
  AlertTriangle,
  Clock,
  Star,
  Wallet,
  History,
  ChevronRight,
  CheckCircle,
  PartyPopper,
  UserCircle,
} from "lucide-react";

const statusStyle = {
  active: "bg-green-50 text-green-700 border border-green-200",
  completed: "bg-blue-50 text-blue-700 border border-blue-200",
  cancelled: "bg-red-50 text-red-500 border border-red-200",
  pending: "bg-yellow-50 text-yellow-700 border border-yellow-200",
};

const OverviewTab = ({
  bookingdata,
  totalspent,
  myAvgRating,
  userData,
  setActiveNav,
}) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6"
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Bookings",
            value: bookingdata.length,
            icon: <ClipboardList className="w-5 h-5" />,
            color: "bg-blue-50 text-blue-700",
          },
          {
            label: "Total Spent",
            value: totalspent,
            icon: <Banknote className="w-5 h-5" />,
            color: "bg-green-50 text-green-700",
          },
          {
            label: "Your Rating",
            value: myAvgRating + " ⭐",
            icon: <Trophy className="w-5 h-5" />,
            color: "bg-yellow-50 text-yellow-700",
          },
          {
            label: "Role",
            value: userData.role,
            icon: <Car className="w-5 h-5" />,
            color: "bg-purple-50 text-purple-700",
          },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white rounded-2xl p-5 border border-gray-100"
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-3 ${stat.color}`}
            >
              {stat.icon}
            </div>
            <p className="text-2xl font-black text-gray-900">
              {typeof stat.value === "number" ? (
                <CountUp start={0} end={stat.value} duration={1} />
              ) : (
                stat.value
              )}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-black text-gray-900">Recent Bookings</p>
          <button
            onClick={() => setActiveNav("bookings")}
            className="text-xs font-bold text-[#22C55E] cursor-pointer hover:text-[#16A34A] transition-colors duration-200 flex items-center gap-1"
          >
            View All <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {bookingdata.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center">
            <ParkingSquare className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm font-bold text-gray-500">No bookings yet</p>
            <p className="text-xs text-gray-400 mt-1">
              Find a parking spot to get started
            </p>
          </div>
        ) : (
          bookingdata
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 3)
            .map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-2xl border border-gray-100 px-4 py-3 flex items-center gap-3"
              >
                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-black text-blue-700">
                    {booking.slot}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-gray-900">
                    Slot {booking.slot}
                  </p>
                  <p className="text-xs text-gray-400">
                    {booking.date} · {booking.fromTime} – {booking.toTime}
                  </p>
                </div>
                <div className="text-right flex-shrink-0 flex flex-col items-end gap-1">
                  <p className="text-sm font-black text-gray-900">
                    {booking.amount}
                  </p>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      statusStyle[booking.bookingStatus] ||
                      "bg-gray-50 text-gray-500 border-gray-200"
                    }`}
                  >
                    {booking.bookingStatus.charAt(0).toUpperCase() +
                      booking.bookingStatus.slice(1)}
                  </span>
                </div>
              </div>
            ))
        )}
      </div>

      <button
        onClick={() => navigate("/search")}
        className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 rounded-2xl text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
      >
        <Search className="w-4 h-4" /> Find Parking{" "}
        <ChevronRight className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

const BookingsTab = ({
  filteredBookings,
  filter,
  setFilter,
  navigate,
  setCancelModal,
  setReportModal,
}) => (
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
            className={`px-4 py-1.5 rounded-full text-sm font-bold transition ${
              filter === status
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ),
      )}
    </div>

    {filteredBookings.length === 0 ? (
      <div className="text-center py-16 text-gray-400">
        <ClipboardList className="w-10 h-10 mx-auto mb-3 text-gray-300" />
        <p className="text-sm font-bold text-gray-500">No bookings yet</p>
        <p className="text-xs text-gray-400 mt-1">
          Book a parking spot to see it here
        </p>
        <button
          onClick={() => navigate("/search")}
          className="mt-4 bg-[#22C55E] text-white font-bold px-6 py-2.5 rounded-xl text-sm cursor-pointer flex items-center gap-1.5 mx-auto"
        >
          Find Parking <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    ) : (
      <div className="flex flex-col gap-4">
        {filteredBookings.map((booking) => (
          <div
            key={booking._id}
            className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
          >
            <div className="p-5 flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-black text-blue-700">
                  {booking.slot}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-base font-black text-gray-900">
                    Slot {booking.slot}
                  </p>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      statusStyle[booking.bookingStatus] ||
                      "bg-gray-50 text-gray-500 border-gray-200"
                    }`}
                  >
                    {booking.bookingStatus.charAt(0).toUpperCase() +
                      booking.bookingStatus.slice(1)}
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  {new Date(booking.date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xl font-black text-gray-900">
                  {booking.amount}
                </p>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 justify-end ${
                    booking.paymentStatus === "success"
                      ? "bg-green-50 text-green-600"
                      : "bg-red-50 text-red-500"
                  }`}
                >
                  {booking.paymentStatus === "success" ? (
                    <>
                      <CheckCircle className="w-3 h-3" /> Paid
                    </>
                  ) : (
                    "Failed"
                  )}
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
                    const [fh, fm] = booking.fromTime.split(":").map(Number);
                    const [th, tm] = booking.toTime.split(":").map(Number);
                    const diff = th * 60 + tm - (fh * 60 + fm);
                    return `${diff / 60} hr${diff / 60 !== 1 ? "s" : ""}`;
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

            {booking.bookingStatus === "completed" && (
              <button
                onClick={() => setReportModal(booking)}
                className="w-full py-2 cursor-pointer rounded-xl text-xs font-bold border border-orange-200 text-orange-500 bg-orange-50 hover:bg-orange-500 hover:text-white transition-all duration-200 active:scale-95 flex items-center justify-center gap-1.5"
              >
                <AlertTriangle className="w-3.5 h-3.5" /> Report an Issue
              </button>
            )}
          </div>
        ))}
      </div>
    )}
  </motion.div>
);

const HistoryTab = ({
  bookingdata,
  totalspent,
  reviewedBookings,
  setReviewModal,
  navigate,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col gap-6"
  >
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {[
        {
          label: "Total Parkings",
          value: bookingdata.length,
          icon: <ParkingSquare className="w-5 h-5" />,
          color: "bg-blue-50 text-blue-700",
        },
        {
          label: "Total Spent",
          value: `₹${totalspent}`,
          icon: <Wallet className="w-5 h-5" />,
          color: "bg-green-50 text-green-700",
        },
        {
          label: "Total Hours",
          value: `${bookingdata
            .reduce((acc, b) => {
              const [fh, fm] = b.fromTime.split(":").map(Number);
              const [th, tm] = b.toTime.split(":").map(Number);
              return acc + (th * 60 + tm - (fh * 60 + fm)) / 60;
            }, 0)
            .toFixed(1)}h`,
          icon: <Clock className="w-5 h-5" />,
          color: "bg-purple-50 text-purple-700",
        },
      ].map((stat, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl p-4 border border-gray-100 flex flex-col gap-2"
        >
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center text-base ${stat.color}`}
          >
            {stat.icon}
          </div>
          <p className="text-xl font-black text-gray-900">{stat.value}</p>
          <p className="text-xs text-gray-400">{stat.label}</p>
        </div>
      ))}
    </div>

    <div className="flex flex-col gap-3">
      <p className="text-sm font-black text-gray-900">All Parkings</p>

      {bookingdata.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
          <History className="w-8 h-8 mx-auto mb-3 text-gray-300" />
          <p className="text-sm font-bold text-gray-500">No history yet</p>
          <p className="text-xs text-gray-400 mt-1">
            Your parking history will appear here
          </p>
          <button
            onClick={() => navigate("/search")}
            className="mt-4 bg-[#22C55E] text-white font-bold px-6 py-2.5 rounded-xl text-sm cursor-pointer flex items-center gap-1.5 mx-auto"
          >
            Find Parking <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        [...bookingdata]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map((booking) => (
            <div
              key={booking._id}
              className="bg-white rounded-2xl border border-gray-100 px-4 py-4 flex flex-col gap-3"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    booking.bookingStatus === "completed"
                      ? "bg-blue-50"
                      : booking.bookingStatus === "cancelled"
                        ? "bg-red-50"
                        : "bg-green-50"
                  }`}
                >
                  <span
                    className={`text-sm font-black ${
                      booking.bookingStatus === "completed"
                        ? "text-blue-700"
                        : booking.bookingStatus === "cancelled"
                          ? "text-red-500"
                          : "text-green-700"
                    }`}
                  >
                    {booking.slot}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-gray-900">
                    Slot {booking.slot}
                  </p>
                  <p className="text-xs text-gray-400">
                    {booking.date} · {booking.fromTime} – {booking.toTime}
                  </p>
                  <p className="text-[10px] text-gray-300 font-mono mt-0.5 truncate">
                    {booking.paymentId}
                  </p>
                </div>

                <div className="text-right flex-shrink-0 flex flex-col items-end gap-1.5">
                  <p className="text-sm font-black text-gray-900">
                    {booking.amount}
                  </p>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      statusStyle[booking.bookingStatus] ||
                      "bg-gray-50 text-gray-500 border-gray-200"
                    }`}
                  >
                    {booking.bookingStatus.charAt(0).toUpperCase() +
                      booking.bookingStatus.slice(1)}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {(() => {
                      const [fh, fm] = booking.fromTime.split(":").map(Number);
                      const [th, tm] = booking.toTime.split(":").map(Number);
                      const diff = th * 60 + tm - (fh * 60 + fm);
                      return `${diff / 60}h parked`;
                    })()}
                  </span>
                </div>
              </div>

              {reviewedBookings.includes(booking._id) ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-green-50 border border-green-200 rounded-xl"
                >
                  <p className="text-sm text-green-700 font-medium">
                    Thank you for your review!
                  </p>
                  <PartyPopper className="w-4 h-4 text-green-600" />
                </motion.div>
              ) : (
                booking.bookingStatus === "completed" && (
                  <div
                    onClick={() => setReviewModal(booking)}
                    className="flex items-center gap-3 border border-dashed border-gray-400 rounded-xl px-4 py-2.5 cursor-text hover:border-green-400 transition-all group"
                  >
                    <span className="text-gray-400 text-sm group-hover:text-yellow-400 transition-colors flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5" />
                      ))}
                    </span>
                    <span className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors">
                      Add a review...
                    </span>
                  </div>
                )
              )}
            </div>
          ))
      )}
    </div>
  </motion.div>
);

const ProfileTab = ({
  userData,
  editingProfile,
  setEditingProfile,
  editName,
  setEditName,
  editPhone,
  setEditPhone,
  handleSave,
}) => {
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
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
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-xl bg-[#22C55E]">
              {getInitials(userData.fullName)}
            </div>
          )}
          <div>
            <p className="text-lg font-black text-gray-900">
              {userData.fullName}
            </p>
            <p className="text-sm text-gray-400">{userData.email}</p>
            <span className="text-xs font-semibold bg-green-50 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1 w-fit">
              <Car className="w-3 h-3" /> Driver
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
                className="border-2 border-green-400 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 w-full outline-none"
              />
            ) : (
              <div className="border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50">
                {userData.fullName}
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
                className="border-2 border-green-400 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 w-full outline-none"
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
                className="flex-1 bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold py-3 rounded-xl text-sm transition-all cursor-pointer"
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
              className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold py-3 rounded-xl text-sm transition-all cursor-pointer mt-2"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export { OverviewTab, BookingsTab, HistoryTab, ProfileTab };
