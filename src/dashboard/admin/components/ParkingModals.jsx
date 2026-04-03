import { useState } from "react";
import { motion } from "framer-motion";

export const EditModal = ({ parking, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: parking.name || "",
    address: parking.address || "",
    twoWheelerSlots: parking.twoWheelerSlots || 0,
    fourWheelerSlots: parking.fourWheelerSlots || 0,
    pricing: {
      "2-wheeler": {
        hourly: parking.pricing?.["2-wheeler"]?.hourly || 0,
        daily: parking.pricing?.["2-wheeler"]?.daily || 0,
      },
      "4-wheeler": {
        hourly: parking.pricing?.["4-wheeler"]?.hourly || 0,
        daily: parking.pricing?.["4-wheeler"]?.daily || 0,
      },
    },
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSave(parking._id, form);
    onClose();
  };

  return (
    <>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 overflow-y-auto">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, scale: 0.88, y: 20 }}
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
            <div className="p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-black text-gray-900 mb-4 sm:mb-5">
                Edit Parking Location
              </h2>

              <div className="flex flex-col gap-3 sm:gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 mb-1.5 block uppercase tracking-wider">
                    Location Name
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="border-2 border-gray-100 focus:border-red-400 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-medium text-gray-700 w-full outline-none transition-all"
                    placeholder="e.g. Mall Road Parking"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-400 mb-1.5 block uppercase tracking-wider">
                    Address
                  </label>
                  <input
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    className="border-2 border-gray-100 focus:border-red-400 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-medium text-gray-700 w-full outline-none transition-all"
                    placeholder="Full address"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-400 mb-1.5 block uppercase tracking-wider">
                      2W Slots
                    </label>
                    <input
                      name="twoWheelerSlots"
                      type="number"
                      value={form.twoWheelerSlots}
                      onChange={handleChange}
                      className="border-2 border-gray-100 focus:border-red-400 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-medium text-gray-700 w-full outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 mb-1.5 block uppercase tracking-wider">
                      4W Slots
                    </label>
                    <input
                      name="fourWheelerSlots"
                      type="number"
                      value={form.fourWheelerSlots}
                      onChange={handleChange}
                      className="border-2 border-gray-100 focus:border-red-400 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-medium text-gray-700 w-full outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      label: "2W Hourly (₹)",
                      value: form.pricing["2-wheeler"].hourly,
                      onChange: (val) =>
                        setForm({
                          ...form,
                          pricing: {
                            ...form.pricing,
                            "2-wheeler": { ...form.pricing["2-wheeler"], hourly: val },
                          },
                        }),
                    },
                    {
                      label: "2W Daily (₹)",
                      value: form.pricing["2-wheeler"].daily,
                      onChange: (val) =>
                        setForm({
                          ...form,
                          pricing: {
                            ...form.pricing,
                            "2-wheeler": { ...form.pricing["2-wheeler"], daily: val },
                          },
                        }),
                    },
                    {
                      label: "4W Hourly (₹)",
                      value: form.pricing["4-wheeler"].hourly,
                      onChange: (val) =>
                        setForm({
                          ...form,
                          pricing: {
                            ...form.pricing,
                            "4-wheeler": { ...form.pricing["4-wheeler"], hourly: val },
                          },
                        }),
                    },
                    {
                      label: "4W Daily (₹)",
                      value: form.pricing["4-wheeler"].daily,
                      onChange: (val) =>
                        setForm({
                          ...form,
                          pricing: {
                            ...form.pricing,
                            "4-wheeler": { ...form.pricing["4-wheeler"], daily: val },
                          },
                        }),
                    },
                  ].map((field) => (
                    <div key={field.label}>
                      <label className="text-xs font-bold text-gray-400 mb-1.5 block uppercase tracking-wider">
                        {field.label}
                      </label>
                      <input
                        type="number"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="border-2 border-gray-100 focus:border-red-400 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-medium text-gray-700 w-full outline-none transition-all"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 mt-5 sm:mt-6">
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 active:scale-95 transition-all duration-150 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 active:scale-95 transition-all duration-150 cursor-pointer shadow-md shadow-red-200"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export const DeleteModal = ({ parking, onClose, onConfirm }) => (
  <>
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    />
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <motion.div
        className="w-full max-w-sm"
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
          transition: { type: "spring", stiffness: 320, damping: 25 },
        }}
        exit={{ opacity: 0, scale: 0.9, y: 10, transition: { duration: 0.18 } }}
      >
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-red-400 via-red-500 to-rose-500" />
          <div className="p-5 sm:p-6">
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </div>
            <div className="text-center mb-5">
              <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-1">
                Delete Location?
              </h2>
              <p className="text-sm text-gray-500">
                Are you sure you want to delete{" "}
                <span className="font-bold text-gray-700">{parking.name}</span>?
                This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 active:scale-95 transition-all duration-150 cursor-pointer"
              >
                No
              </button>
              <button
                onClick={() => {
                  onConfirm(parking._id);
                  onClose();
                }}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 active:scale-95 transition-all duration-150 cursor-pointer shadow-md shadow-red-200"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </>
);