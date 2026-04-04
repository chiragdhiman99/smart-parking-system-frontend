import { motion } from "framer-motion";
import CountUp from "react-countup";
import { useMemo } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const statusStyle = {
  active: "bg-green-50 text-green-700 border border-green-200",
  completed: "bg-blue-50 text-blue-700 border border-blue-200",
  cancelled: "bg-red-50 text-red-500 border border-red-200",
  pending: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  confirmed: "bg-emerald-50 text-emerald-700 border border-emerald-200",
};

const CustomLineTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl px-3 py-2 shadow-lg">
        <p className="text-xs font-bold text-gray-500 mb-1">{label}</p>
        <p className="text-sm font-black text-blue-600">
          {payload[0].value} bookings
        </p>
      </div>
    );
  }
  return null;
};

const CustomBarTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl px-3 py-2 shadow-lg">
        <p className="text-xs font-bold text-gray-500 mb-1">{label}</p>
        <p className="text-sm font-black text-red-500">₹{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

const AdminOverview = ({
  bookingdata,
  parkingData,
  allUsers,
  totalslots,
  occupiedslots,
  linedata,
  setActiveNav,
}) => {
  const occupied = totalslots - occupiedslots;

  const totalRevenue = useMemo(() => {
    return bookingdata.reduce((total, booking) => {
      const amt =
        typeof booking.amount === "string"
          ? Number(booking.amount.replace("₹", "").trim())
          : Number(booking.amount || 0);
      return total + (isNaN(amt) ? 0 : amt);
    }, 0);
  }, [bookingdata]);

  const stats = [
    {
      label: "Total Bookings",
      value: bookingdata.length,
      icon: "📋",
      color: "bg-blue-50 text-blue-700",
    },
    {
      label: "Total Revenue",
      value: totalRevenue,
      icon: "💰",
      color: "bg-red-50 text-red-600",
      prefix: "₹",
    },
    {
      label: "Total Slots",
      value: totalslots,
      icon: "🅿️",
      color: "bg-yellow-50 text-yellow-700",
    },
    {
      label: "Total Users",
      value: allUsers.length || 0,
      icon: "👥",
      color: "bg-purple-50 text-purple-700",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6"
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
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
                <CountUp start={0} end={stat.value} prefix={stat.prefix} />
              ) : (
                stat.value
              )}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="col-span-1 lg:col-span-2 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-black text-gray-900">Recent Bookings</p>
            <button
              onClick={() => setActiveNav("bookings")}
              className="text-xs font-bold text-[#ef4444] cursor-pointer hover:text-red-600 transition-colors duration-200"
            >
              View All →
            </button>
          </div>
          {bookingdata.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center">
              <p className="text-2xl mb-2">🅿️</p>
              <p className="text-sm font-bold text-gray-500">No bookings yet</p>
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
                  <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-black text-red-600">
                      {booking.slot}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] sm:text-sm font-black text-gray-900">
                      {booking.userEmail || `Slot ${booking.slot}`}
                    </p>
                    <p className="text-xs text-gray-400">
                      {booking.date} · {booking.fromTime} – {booking.toTime}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0 mt-7 flex flex-col items-end gap-1">
                    <p className="text-sm font-black text-gray-900">
                      {booking.amount}
                    </p>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusStyle[booking.bookingStatus] || "bg-gray-50 text-gray-500 border-gray-200"}`}
                    >
                      {booking.bookingStatus?.charAt(0).toUpperCase() +
                        booking.bookingStatus?.slice(1)}
                    </span>
                  </div>
                </div>
              ))
          )}
        </div>

        <div className="col-span-1 bg-white rounded-2xl border border-gray-100 p-4 flex flex-col gap-4 h-fit self-start mt-10">
          <p className="text-sm font-black text-gray-900">Slot Status</p>
          <div className="flex justify-between items-center bg-green-50 px-3 py-2 rounded-xl">
            <span className="text-xs font-bold text-green-600">Available</span>
            <span className="text-sm font-black text-green-700">
              {occupied}
            </span>
          </div>
          <div className="flex justify-between items-center bg-red-50 px-3 py-2 rounded-xl">
            <span className="text-xs font-bold text-red-600">Occupied</span>
            <span className="text-sm font-black text-red-700">
              {occupiedslots}
            </span>
          </div>
          <div className="flex justify-between items-center bg-yellow-50 px-3 py-2 rounded-xl">
            <span className="text-xs font-bold text-yellow-600">Reserved</span>
            <span className="text-sm font-black text-yellow-700">0</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-gray-100 p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-black text-gray-900">Booking Trends</p>
              <p className="text-xs text-gray-400 mt-0.5">Daily activity</p>
            </div>
            <span className="text-xs font-bold bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full">
              📋 Bookings
            </span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart
              data={linedata}
              margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "#9ca3af", fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#9ca3af", fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomLineTooltip />} />
              <Line
                type="monotone"
                dataKey="bookings"
                stroke="#3b82f6"
                strokeWidth={2.5}
                dot={{ fill: "#3b82f6", r: 5, strokeWidth: 2, stroke: "#fff" }}
                activeDot={{
                  r: 7,
                  fill: "#3b82f6",
                  stroke: "#fff",
                  strokeWidth: 2,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="bg-white rounded-2xl border border-gray-100 p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-black text-gray-900">Revenue Trends</p>
              <p className="text-xs text-gray-400 mt-0.5">Daily earnings</p>
            </div>
            <span className="text-xs font-bold bg-red-50 text-red-500 px-2.5 py-1 rounded-full">
              💰 Revenue
            </span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart
              data={linedata}
              margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "#9ca3af", fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#9ca3af", fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomBarTooltip />} />
              <Bar
                dataKey="revenue"
                fill="#ef4444"
                radius={[8, 8, 0, 0]}
                maxBarSize={52}
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <button
        onClick={() => setActiveNav("parkings")}
        className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 rounded-2xl text-sm transition-all cursor-pointer"
      >
        🅿️ Manage Parking location →
      </button>
    </motion.div>
  );
};

export default AdminOverview;
