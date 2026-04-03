import { motion } from "framer-motion";

const EditParkingModal = ({
  editingParking,
  setEditingParking,
  editForm,
  setEditForm,
  handleSaveEdit,
}) => {
  if (!editingParking) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-lg font-black text-gray-900">Edit Parking</h2>
            <p className="text-xs text-gray-400">{editingParking.name}</p>
          </div>
          <button
            onClick={() => setEditingParking(null)}
            className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="p-6 flex flex-col gap-5">
          <div>
            <label className="text-xs font-bold text-gray-400 mb-1.5 block uppercase tracking-wider">
              Parking Name
            </label>
            <input
              value={editForm.name}
              onChange={(e) =>
                setEditForm({ ...editForm, name: e.target.value })
              }
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-400 mb-1.5 block uppercase tracking-wider">
              Address
            </label>
            <input
              value={editForm.address}
              onChange={(e) =>
                setEditForm({ ...editForm, address: e.target.value })
              }
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-400 mb-1.5 block uppercase tracking-wider">
                Open Time
              </label>
              <input
                type="time"
                value={editForm.openTime}
                onChange={(e) =>
                  setEditForm({ ...editForm, openTime: e.target.value })
                }
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 mb-1.5 block uppercase tracking-wider">
                Close Time
              </label>
              <input
                type="time"
                value={editForm.closeTime}
                onChange={(e) =>
                  setEditForm({ ...editForm, closeTime: e.target.value })
                }
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm"
              />
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
            <p className="text-sm font-black text-gray-900 mb-3">
              🚗 4-Wheeler Pricing
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Per Hour", key: "hourly4w" },
                { label: "Per Day", key: "daily4w" },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label className="text-[10px] font-bold text-gray-400 mb-1 block uppercase">
                    {label}
                  </label>
                  <div className="flex items-center border-2 border-gray-200 rounded-xl px-3 py-2.5 bg-white focus-within:border-blue-400">
                    <span className="text-xs text-gray-400 mr-1">₹</span>
                    <input
                      type="number"
                      value={editForm[key]}
                      onChange={(e) =>
                        setEditForm({ ...editForm, [key]: e.target.value })
                      }
                      className="flex-1 outline-none text-sm font-bold text-gray-700 bg-transparent"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
            <p className="text-sm font-black text-gray-900 mb-3">
              🏍️ 2-Wheeler Pricing
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Per Hour", key: "hourly2w" },
                { label: "Per Day", key: "daily2w" },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label className="text-[10px] font-bold text-gray-400 mb-1 block uppercase">
                    {label}
                  </label>
                  <div className="flex items-center border-2 border-gray-200 rounded-xl px-3 py-2.5 bg-white focus-within:border-blue-400">
                    <span className="text-xs text-gray-400 mr-1">₹</span>
                    <input
                      type="number"
                      value={editForm[key]}
                      onChange={(e) =>
                        setEditForm({ ...editForm, [key]: e.target.value })
                      }
                      className="flex-1 outline-none text-sm font-bold text-gray-700 bg-transparent"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
            <p className="text-sm font-black text-gray-900 mb-3">
              🅿️ Slot Count
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "4-Wheeler Slots", key: "fourWheelerSlots" },
                { label: "2-Wheeler Slots", key: "twoWheelerSlots" },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label className="text-[10px] font-bold text-gray-400 mb-1 block uppercase">
                    {label}
                  </label>
                  <div className="flex items-center border-2 border-gray-200 rounded-xl px-3 py-2.5 bg-white focus-within:border-blue-400">
                    <input
                      type="number"
                      min="0"
                      value={editForm[key]}
                      onChange={(e) =>
                        setEditForm({ ...editForm, [key]: e.target.value })
                      }
                      className="flex-1 outline-none text-sm font-bold text-gray-700 bg-transparent"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-400 mb-2 block uppercase tracking-wider">
              Amenities
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: "cctv", label: "CCTV", icon: "📹" },
                { key: "security", label: "24hr Security", icon: "💂" },
                { key: "evCharging", label: "EV Charging", icon: "⚡" },
                { key: "covered", label: "Covered", icon: "🏠" },
                { key: "wheelchair", label: "Wheelchair", icon: "♿" },
                { key: "carWash", label: "Car Wash", icon: "🚿" },
              ].map((amenity) => (
                <button
                  key={amenity.key}
                  onClick={() =>
                    setEditForm({
                      ...editForm,
                      amenities: {
                        ...editForm.amenities,
                        [amenity.key]: !editForm.amenities?.[amenity.key],
                      },
                    })
                  }
                  className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-semibold transition-all cursor-pointer ${
                    editForm.amenities?.[amenity.key]
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 text-gray-500"
                  }`}
                >
                  <span>{amenity.icon}</span>
                  {amenity.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-400 mb-2 block uppercase tracking-wider">
              Open Days
            </label>
            <div className="flex gap-1.5 flex-wrap">
              {[
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ].map((day) => (
                <button
                  key={day}
                  onClick={() => {
                    const days = editForm.days || [];
                    setEditForm({
                      ...editForm,
                      days: days.includes(day)
                        ? days.filter((d) => d !== day)
                        : [...days, day],
                    });
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    (editForm.days || []).includes(day)
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div>
              <p className="text-sm font-bold text-gray-900">
                Auto Approve Bookings
              </p>
              <p className="text-xs text-gray-400">
                Bookings will be confirmed instantly
              </p>
            </div>
            <button
              onClick={() =>
                setEditForm({ ...editForm, autoApprove: !editForm.autoApprove })
              }
              className={`w-12 h-6 rounded-full transition-all cursor-pointer relative ${editForm.autoApprove ? "bg-blue-500" : "bg-gray-200"}`}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${editForm.autoApprove ? "left-7" : "left-1"}`}
              />
            </button>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-400 mb-2 block uppercase tracking-wider">
              Block Dates
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                id="blockdate"
                className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm"
              />
              <button
                onClick={() => {
                  const date = document.getElementById("blockdate").value;
                  if (!date) return;
                  const blocked = editForm.blockedDates || [];
                  if (!blocked.includes(date)) {
                    setEditForm({
                      ...editForm,
                      blockedDates: [...blocked, date],
                    });
                  }
                  document.getElementById("blockdate").value = "";
                }}
                className="bg-red-50 text-red-500 font-bold px-4 py-2.5 rounded-xl text-xs cursor-pointer hover:bg-red-100"
              >
                Block
              </button>
            </div>
            {(editForm.blockedDates || []).length > 0 && (
              <div className="flex flex-wrap gap-2">
                {(editForm.blockedDates || []).map((date) => (
                  <div
                    key={date}
                    className="flex items-center gap-1 bg-red-50 text-red-500 text-xs font-bold px-3 py-1.5 rounded-xl"
                  >
                    🚫 {date}
                    <button
                      onClick={() =>
                        setEditForm({
                          ...editForm,
                          blockedDates: editForm.blockedDates.filter(
                            (d) => d !== date,
                          ),
                        })
                      }
                      className="ml-1 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 flex gap-3 sticky bottom-0 bg-white">
          <button
            onClick={() => setEditingParking(null)}
            className="flex-1 bg-gray-100 text-gray-600 font-bold py-3 rounded-xl text-sm cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveEdit}
            className="flex-1 bg-[#3B82F6] text-white font-bold py-3 rounded-xl text-sm cursor-pointer hover:bg-blue-600"
          >
            Save Changes
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export { EditParkingModal };
