import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

const getInitials = (name) => {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const AnalyticsTab = ({
  userbookings,
  ownerparking,
  totalearnings,
  revenuegraph,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col gap-6"
  >
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        {
          label: "Total Revenue",
          value: `₹${totalearnings}`,
          icon: "💰",
          color: "bg-green-50 text-green-700",
        },
        {
          label: "This Month",
          value: `₹${userbookings
            .filter(
              (b) => new Date(b.createdAt).getMonth() === new Date().getMonth(),
            )
            .reduce((t, b) => t + Number(b.amount.replace("₹", "")), 0)}`,
          icon: "📅",
          color: "bg-blue-50 text-blue-700",
        },
        {
          label: "Total Bookings",
          value: userbookings.length,
          icon: "📋",
          color: "bg-purple-50 text-purple-700",
        },
        {
          label: "Avg Occupancy",
          value: `${
            ownerparking.length > 0
              ? Math.round(
                  (ownerparking.reduce(
                    (t, p) => t + (p.totalSlots - p.availableSlots),
                    0,
                  ) /
                    ownerparking.reduce((t, p) => t + p.totalSlots, 0)) *
                    100,
                )
              : 0
          }%`,
          icon: "📈",
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
          <p className="text-2xl font-black text-gray-900">{stat.value}</p>
          <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
        </motion.div>
      ))}
    </div>

    <div className="bg-white rounded-2xl p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-black text-gray-900">
            Revenue Overview
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Daily earnings breakdown
          </p>
        </div>
        <span className="text-xs font-bold bg-blue-50 text-blue-700 px-3 py-1.5 rounded-xl">
          ₹{totalearnings} Total
        </span>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={revenuegraph} barSize={40}>
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "#9CA3AF" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#111827" }}
            tickLine={false}
            tickFormatter={(v) => `₹${v}`}
          />
          <Tooltip
            cursor={{ fill: "#F3F4F6" }}
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid #E5E7EB",
              fontSize: "12px",
            }}
            formatter={(value) => [`₹${value}`, "Revenue"]}
          />
          <Bar dataKey="amount" fill="#3B82F6" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>

    <div className="bg-white rounded-2xl p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-black text-gray-900">
            City Wise Occupancy
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">Occupancy % per city</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={["Delhi", "Noida", "Gurgaon", "Faridabad", "Ghaziabad"].map(
            (city) => {
              const cityParkings = ownerparking.filter((p) => p.city === city);
              const totalSlots = cityParkings.reduce(
                (t, p) => t + p.totalSlots,
                0,
              );
              const occupied = cityParkings.reduce(
                (t, p) => t + (p.totalSlots - p.availableSlots),
                0,
              );
              return {
                city,
                occupancy:
                  totalSlots > 0
                    ? Math.round((occupied / totalSlots) * 100)
                    : 0,
              };
            },
          )}
        >
          <XAxis
            dataKey="city"
            tick={{ fontSize: 11, fill: "#9CA3AF" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#111827" }}
            tickLine={false}
            tickFormatter={(v) => `${v}%`}
            domain={[0, 100]}
          />
          <Tooltip
            formatter={(value) => [`${value}%`, "Occupancy"]}
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid #E5E7EB",
              fontSize: "12px",
            }}
          />
          <Line
            type="monotone"
            dataKey="occupancy"
            stroke="#22C55E"
            strokeWidth={2}
            dot={{ fill: "#22C55E", r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
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
}) => (
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
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-xl bg-[#3B82F6]">
            {getInitials(userData.fullName)}
          </div>
        )}
        <div>
          <p className="text-lg font-black text-gray-900">
            {userData.fullName}
          </p>
          <p className="text-sm text-gray-400">{userData.email}</p>
          <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
            🏢 Owner
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
              className="border-2 border-blue-400 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 w-full outline-none"
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
            Role
          </label>
          <div className="border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50">
            {userData.role}
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
              className="border-2 border-blue-400 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 w-full outline-none"
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
              className="flex-1 bg-[#3B82F6] hover:bg-blue-600 text-white font-bold py-3 rounded-xl text-sm transition-all cursor-pointer"
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
            className="w-full bg-[#3B82F6] hover:bg-blue-600 text-white font-bold py-3 rounded-xl text-sm transition-all cursor-pointer mt-2"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  </motion.div>
);

export { AnalyticsTab, ProfileTab };
