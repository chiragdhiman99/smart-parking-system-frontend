import { motion } from "framer-motion";
import CountUp from "react-countup";
const statusStyle = {
  confirmed: "bg-green-50 text-green-700 border border-green-200",
  completed: "bg-blue-50 text-blue-700 border border-blue-200",
  cancelled: "bg-red-50 text-red-500 border border-red-200",
  pending: "bg-yellow-50 text-yellow-700 border border-yellow-200",
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

const OverviewTab = ({
  userbookings,
  ownerparking,
  totalearnings,
  totalslots,
  userData,
  setActiveNav,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col gap-6"
  >
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        {
          label: "Total Earnings",
          value: totalearnings,
          icon: "💰",
          color: "bg-green-50 text-green-700",
          prefix: "₹",
        },
        {
          label: "Total Bookings",
          value: userbookings.length,
          icon: "📋",
          color: "bg-blue-50 text-blue-700",
        },
        {
          label: "My Parkings",
          value: ownerparking.length,
          icon: "🅿️",
          color: "bg-purple-50 text-purple-700",
        },
        {
          label: "Active Slots",
          value: totalslots,
          icon: "✅",
          color: "bg-yellow-50 text-yellow-700",
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
              <CountUp start={0} end={stat.value} prefix={stat.prefix || ""} />
            ) : (
              stat.value
            )}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
        </motion.div>
      ))}
    </div>

    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 text-white text-center relative overflow-hidden">
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      <div className="relative z-10">
        {ownerparking.length === 0 ? (
          <>
            <p className="text-4xl mb-3">🏢</p>
            <h3 className="text-xl font-black mb-2">Start Earning Today!</h3>
            <p className="text-blue-100 text-sm mb-5">
              List your parking space and start earning from day one.
            </p>
            <button
              onClick={() => setActiveNav("parkings")}
              className="bg-white text-blue-600 font-bold px-6 py-2.5 rounded-xl text-sm cursor-pointer hover:bg-blue-50 transition-all"
            >
              + Add Your First Parking
            </button>
          </>
        ) : (
          <>
            <p className="text-4xl mb-3">🎉</p>
            <h3 className="text-xl font-black mb-2">
              You're Live, {userData.fullName.split(" ")[0]}!
            </h3>
            <p className="text-blue-100 text-sm">
              Your {ownerparking.length} parking
              {ownerparking.length > 1 ? "s" : ""} with {totalslots} slots are
              active and ready for bookings.
            </p>
          </>
        )}
      </div>
    </div>

    <div>
      <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
        Recent Bookings
      </h2>
      {userbookings.length === 0 ? (
        <div className="bg-gray-50 rounded-2xl p-8 text-center border border-gray-100">
          <p className="text-3xl mb-2">📋</p>
          <p className="text-sm font-bold text-gray-500">No bookings yet</p>
          <p className="text-xs text-gray-400 mt-1">
            Bookings will appear here once customers start booking
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {userbookings
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 3)
            .map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center font-black text-blue-600 text-sm">
                    {getInitials(booking.userName)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      {booking.userName}
                    </p>
                    <p className="text-xs text-gray-400">
                      Slot {booking.slot} · {booking.date}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-gray-900">
                    {booking.amount}
                  </p>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusStyle[booking.bookingStatus] || "bg-gray-100 text-gray-500"}`}
                  >
                    {booking.bookingStatus}
                  </span>
                </div>
              </div>
            ))}
          {userbookings.length > 3 && (
            <button
              onClick={() => setActiveNav("bookings")}
              className="text-blue-600 text-sm font-semibold text-center py-2"
            >
              View all {userbookings.length} bookings →
            </button>
          )}
        </div>
      )}
    </div>
  </motion.div>
);

const ParkingsTab = ({
  ownerparking,
  setShowForm,
  handleEdit,
  handleDeleteParking,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col gap-4"
  >
    <div className="flex items-center justify-between mb-2">
      <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
        My Parking Lots
      </h2>
      <button
        onClick={() => setShowForm(true)}
        className="bg-[#3B82F6] text-white font-bold px-4 py-2 rounded-xl text-xs cursor-pointer hover:bg-blue-600 transition-all"
      >
        + Add New Parking
      </button>
    </div>

    {ownerparking.length > 0 ? (
      <div className="grid gap-4">
        {ownerparking.map((parking) => (
          <div
            key={parking._id}
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{parking.icon}</span>
                <div>
                  <h3 className="text-lg font-black text-gray-900">
                    {parking.name}
                  </h3>
                  <p className="text-xs text-gray-400">📍 {parking.address}</p>
                </div>
              </div>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full ${
                  parking.status === "approved"
                    ? "bg-green-50 text-green-700"
                    : parking.status === "rejected"
                      ? "bg-red-50 text-red-500"
                      : "bg-yellow-50 text-yellow-700"
                }`}
              >
                {parking.status === "approved"
                  ? "✅ Approved"
                  : parking.status === "rejected"
                    ? "❌ Rejected"
                    : "⏳ Pending"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm mb-4">
              <p className="text-gray-500">
                🅿️ Slots:{" "}
                <span className="font-bold text-gray-900">
                  {parking.totalSlots}/{parking.totalSlots}
                </span>
              </p>
              <p className="text-gray-500">
                🚗 Types:{" "}
                <span className="font-bold text-gray-900">
                  {parking.vehicleTypes.join(", ")}
                </span>
              </p>
              <p className="text-gray-500">
                ⏰ Time:{" "}
                <span className="font-bold text-gray-900">
                  {parking.availability.openTime} -{" "}
                  {parking.availability.closeTime}
                </span>
              </p>
              <p className="text-gray-500">
                ⚡ Auto:{" "}
                <span className="font-bold text-gray-900">
                  {parking.autoApprove ? "Yes" : "No"}
                </span>
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-3 mb-4">
              <p className="text-xs font-bold text-gray-400 mb-2">Pricing</p>
              <div className="flex justify-between text-xs">
                {parking.vehicleTypes.includes("2-wheeler") && (
                  <div>
                    <p className="font-bold">🏍️ 2W</p>
                    <p>₹{parking.pricing?.["2-wheeler"]?.hourly || 0}/hr</p>
                    <p>₹{parking.pricing?.["2-wheeler"]?.daily || 0}/day</p>
                  </div>
                )}
                {parking.vehicleTypes.includes("4-wheeler") && (
                  <div>
                    <p className="font-bold">🚗 4W</p>
                    <p>₹{parking.pricing?.["4-wheeler"]?.hourly || 0}/hr</p>
                    <p>₹{parking.pricing?.["4-wheeler"]?.daily || 0}/day</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(parking)}
                className="flex-1 cursor-pointer bg-blue-50 text-blue-600 font-bold py-2 rounded-xl text-xs hover:bg-blue-100"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteParking(parking._id)}
                className="flex-1 cursor-pointer bg-red-50 text-red-500 font-bold py-2 rounded-xl text-xs hover:bg-red-100"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="bg-gray-50 rounded-2xl p-12 text-center border-2 border-dashed border-gray-200">
        <p className="text-4xl mb-3">🅿️</p>
        <p className="text-sm font-bold text-gray-500">
          No parking lots added yet
        </p>
        <p className="text-xs text-gray-400 mt-1 mb-5">
          Add your first parking lot to start accepting bookings
        </p>
        <button
          onClick={() => setShowForm(true)}
          className="bg-[#3B82F6] text-white font-bold px-6 py-2.5 rounded-xl text-sm cursor-pointer hover:bg-blue-600 transition-all"
        >
          + Add Parking Lot
        </button>
      </div>
    )}
  </motion.div>
);

const BookingsTab = ({
  userbookings,
  filteredBookings,
  bookingFilter,
  setBookingFilter,
  totalearnings,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col gap-4"
  >
    <div className="grid grid-cols-3 gap-4">
      {[
        {
          label: "Total",
          value: userbookings.length,
          color: "bg-blue-50 text-blue-700",
        },
        {
          label: "Confirmed",
          value: userbookings.filter((b) => b.bookingStatus === "confirmed")
            .length,
          color: "bg-green-50 text-green-700",
        },
        {
          label: "Earnings",
          value: `₹${totalearnings}`,
          color: "bg-purple-50 text-purple-700",
        },
      ].map((s, i) => (
        <div key={i} className={`rounded-2xl p-4 text-center ${s.color}`}>
          <p className="text-xl font-black">{s.value}</p>
          <p className="text-xs font-semibold mt-0.5">{s.label}</p>
        </div>
      ))}
    </div>

    <div className="flex bg-gray-100 rounded-xl p-1 gap-1 overflow-x-auto w-full [&::-webkit-scrollbar]:hidden">
      {["All", "confirmed", "pending", "completed", "cancelled"].map((tab) => (
        <button
          key={tab}
          onClick={() => setBookingFilter(tab)}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer capitalize ${
            bookingFilter === tab
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>

    {filteredBookings.length === 0 ? (
      <div className="bg-gray-50 rounded-2xl p-12 text-center border border-gray-100">
        <p className="text-4xl mb-3">📋</p>
        <p className="text-sm font-bold text-gray-500">No bookings found</p>
        <p className="text-xs text-gray-400 mt-1">
          Customer bookings will appear here
        </p>
      </div>
    ) : (
      <div className="flex flex-col gap-3">
        {filteredBookings.map((booking) => (
          <motion.div
            key={booking._id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center font-black text-blue-600">
                  {getInitials(booking.userName)}
                </div>
                <div>
                  <p className="text-sm font-black text-gray-900">
                    {booking.userName}
                  </p>
                  <p className="text-xs text-gray-400">{booking.userEmail}</p>
                  <p className="text-xs text-gray-400">
                    📞 {booking.userPhone}
                  </p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-lg font-black text-gray-900">
                  {booking.amount}
                </p>
                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${statusStyle[booking.bookingStatus] || "bg-gray-100 text-gray-500"}`}
                >
                  {booking.bookingStatus}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 rounded-xl p-3">
              <div>
                <p className="text-[10px] text-gray-400 font-semibold uppercase">
                  Slot
                </p>
                <p className="text-sm font-black text-gray-900">
                  🅿️ {booking.slot}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-semibold uppercase">
                  Date
                </p>
                <p className="text-sm font-bold text-gray-900">
                  📅 {booking.date}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-semibold uppercase">
                  From
                </p>
                <p className="text-sm font-bold text-gray-900">
                  🕐 {booking.fromTime}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-semibold uppercase">
                  To
                </p>
                <p className="text-sm font-bold text-gray-900">
                  🕐 {booking.toTime}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-400">
                Payment:{" "}
                <span
                  className={`font-bold ${booking.paymentStatus === "success" ? "text-green-600" : "text-red-500"}`}
                >
                  {booking.paymentStatus}
                </span>
              </p>
              <p className="text-xs text-gray-400">
                ID: {booking.paymentId?.slice(0, 16)}...
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    )}
  </motion.div>
);

export { OverviewTab, ParkingsTab, BookingsTab };
