import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { EditModal, DeleteModal } from "./ParkingModals";

const token = localStorage.getItem("adminToken");

const statusStyle = {
  approved: "bg-green-50 text-green-700 border border-green-200",
  pending: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  rejected: "bg-red-50 text-red-500 border border-red-200",
  inactive: "bg-gray-100 text-gray-500 border border-gray-200",
};

const ManageParkingLocations = () => {
  const [parkings, setParkings] = useState([]);
  const [filter, setFilter] = useState("all");
  const [editModal, setEditModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/parkings`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setParkings(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleStatusChange = (parkingId, status) => {
    axios
      .put(
        `http://localhost:5000/api/parkings/update/${parkingId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then(() => {
        setParkings((prev) =>
          prev.map((p) => (p._id === parkingId ? { ...p, status } : p)),
        );
        toast.success(
          status === "approved" ? "Parking approved!" : "Parking rejected!",
        );
      })
      .catch(() =>
        toast.error("Failed to update parking status. Please try again."),
      );
  };

  const handleEditSave = (parkingId, updatedData) => {
    axios
      .put(
        `http://localhost:5000/api/parkings/update/${parkingId}`,
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then(() => {
        setParkings((prev) =>
          prev.map((p) => (p._id === parkingId ? { ...p, ...updatedData } : p)),
        );
        toast.success("Parking updated successfully!");
      })
      .catch(() => toast.error("Failed to update parking. Please try again."));
  };

  const handleDelete = (parkingId) => {
    axios
      .delete(`http://localhost:5000/api/parkings/${parkingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setParkings((prev) => prev.filter((p) => p._id !== parkingId));
        toast.success("Parking deleted successfully!");
      })
      .catch(() => toast.error("Failed to delete parking. Please try again."));
  };

  const filtered = parkings.filter((p) =>
    filter === "all" ? true : p.status === filter,
  );
  const totalSlots = parkings.reduce(
    (acc, p) =>
      acc + Number(p.twoWheelerSlots || 0) + Number(p.fourWheelerSlots || 0),
    0,
  );
  const approvedCount = parkings.filter((p) => p.status === "approved").length;
  const pendingCount = parkings.filter((p) => p.status === "pending").length;

  if (loading)
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-4 sm:gap-6"
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: "Total Locations", value: parkings.length, icon: "📍", color: "bg-blue-50 text-blue-700" },
          { label: "Total Slots", value: totalSlots, icon: "🅿️", color: "bg-yellow-50 text-yellow-700" },
          { label: "Approved", value: approvedCount, icon: "✅", color: "bg-green-50 text-green-700" },
          { label: "Pending Approval", value: pendingCount, icon: "⏳", color: "bg-red-50 text-red-600" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100"
          >
            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-base sm:text-lg mb-2 sm:mb-3 ${stat.color}`}>
              {stat.icon}
            </div>
            <p className="text-xl sm:text-2xl font-black text-gray-900">{stat.value}</p>
            <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap">
        {["all", "pending", "approved", "rejected"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold transition cursor-pointer ${
              filter === status
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
          <p className="text-3xl mb-3">📍</p>
          <p className="text-sm font-bold text-gray-500">No parking locations found</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 sm:gap-4">
          {filtered.map((parking, i) => {
            const slots =
              Number(parking.twoWheelerSlots || 0) +
              Number(parking.fourWheelerSlots || 0);
            const initials =
              parking.name
                ?.split(" ")
                .map((w) => w[0])
                .join("")
                .toUpperCase()
                .slice(0, 2) || "PK";

            return (
              <motion.div
                key={parking._id || i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
              >
                <div className="p-4 sm:p-5 flex items-start gap-3 sm:gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                    <span className="text-base sm:text-lg font-black text-red-600">{initials}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <p className="text-sm sm:text-base font-black text-gray-900">{parking.name || "—"}</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusStyle[parking.status] || "bg-gray-100 text-gray-500 border border-gray-200"}`}>
                        {parking.status === "approved" ? "✅ Approved" : parking.status === "rejected" ? "❌ Rejected" : "⏳ Pending"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 truncate">{parking.address}</p>
                    <p className="text-xs text-gray-400 mt-0.5">👤 {parking.ownerName || parking.owner || "Owner"}</p>
                  </div>

                  {parking.status === "approved" && (
                    <div className="hidden sm:flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => setEditModal(parking)}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold border border-gray-200 text-gray-600 hover:bg-gray-50 transition cursor-pointer"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => setDeleteModal(parking)}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold border border-red-200 text-red-500 bg-red-50 hover:bg-red-500 hover:text-white transition cursor-pointer flex items-center gap-1.5"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                          <path d="M10 11v6M14 11v6" />
                          <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                {parking.status === "approved" && (
                  <div className="flex sm:hidden gap-2 px-4 pb-3">
                    <button onClick={() => setEditModal(parking)} className="flex-1 py-2 rounded-xl text-xs font-bold border border-gray-200 text-gray-600 hover:bg-gray-50 transition cursor-pointer">✏️ Edit</button>
                    <button onClick={() => setDeleteModal(parking)} className="flex-1 py-2 rounded-xl text-xs font-bold border border-red-200 text-red-500 bg-red-50 hover:bg-red-500 hover:text-white transition cursor-pointer">🗑️ Delete</button>
                  </div>
                )}

                <div className="mx-4 sm:mx-5 mb-4 bg-gray-50 rounded-xl px-3 sm:px-4 py-3 grid grid-cols-3 gap-2 sm:gap-4">
                  <div>
                    <p className="text-[10px] text-gray-400 mb-0.5">Total Slots</p>
                    <p className="text-xs sm:text-sm font-black text-gray-900">{slots}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 mb-0.5">2W Price</p>
                    <p className="text-[11px] sm:text-sm font-black text-gray-900">
                      ₹{parking.pricing?.["2-wheeler"]?.hourly || "—"}/hr
                      <span className="hidden sm:inline"> · ₹{parking.pricing?.["2-wheeler"]?.daily || "—"}/day</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 mb-0.5">4W Price</p>
                    <p className="text-[11px] sm:text-sm font-black text-gray-900">
                      ₹{parking.pricing?.["4-wheeler"]?.hourly || "—"}/hr
                      <span className="hidden sm:inline"> · ₹{parking.pricing?.["4-wheeler"]?.daily || "—"}/day</span>
                    </p>
                  </div>
                </div>

                {parking.occupiedSlots !== undefined && (
                  <div className="mx-4 sm:mx-5 mb-4">
                    <div className="flex justify-between mb-1">
                      <p className="text-[10px] text-gray-400">Occupancy</p>
                      <p className="text-[10px] text-gray-400 font-bold">{parking.occupiedSlots}/{slots} occupied</p>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          parking.occupiedSlots / slots > 0.7
                            ? "bg-red-500"
                            : parking.occupiedSlots / slots > 0.4
                              ? "bg-yellow-400"
                              : "bg-green-400"
                        }`}
                        style={{ width: `${(parking.occupiedSlots / slots) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {parking.status === "pending" && (
                  <div className="flex gap-2 px-4 sm:px-5 pb-4">
                    <button onClick={() => handleStatusChange(parking._id, "approved")} className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-green-50 text-green-700 border border-green-200 hover:bg-green-500 hover:text-white transition-all duration-200 cursor-pointer">✅ Approve</button>
                    <button onClick={() => handleStatusChange(parking._id, "rejected")} className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-red-50 text-red-500 border border-red-200 hover:bg-red-500 hover:text-white transition-all duration-200 cursor-pointer">❌ Reject</button>
                  </div>
                )}

                {parking.status === "rejected" && (
                  <div className="px-4 sm:px-5 pb-4">
                    <button onClick={() => handleStatusChange(parking._id, "approved")} className="w-full py-2.5 rounded-xl text-sm font-bold bg-green-50 text-green-700 border border-green-200 hover:bg-green-500 hover:text-white transition-all duration-200 cursor-pointer">✅ Approve Now</button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {editModal && (
          <EditModal
            parking={editModal}
            onClose={() => setEditModal(null)}
            onSave={handleEditSave}
          />
        )}
        {deleteModal && (
          <DeleteModal
            parking={deleteModal}
            onClose={() => setDeleteModal(null)}
            onConfirm={handleDelete}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ManageParkingLocations;