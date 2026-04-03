import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const token = localStorage.getItem("adminToken");

const PricingGuidelines = () => {
  const [guidelines, setGuidelines] = useState({
    "2-wheeler": { hourly: { min: "", max: "" }, daily: { min: "", max: "" } },
    "4-wheeler": { hourly: { min: "", max: "" }, daily: { min: "", max: "" } },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const isFormComplete =
    guidelines["2-wheeler"].hourly.min &&
    guidelines["2-wheeler"].hourly.max &&
    guidelines["2-wheeler"].daily.min &&
    guidelines["2-wheeler"].daily.max &&
    guidelines["4-wheeler"].hourly.min &&
    guidelines["4-wheeler"].hourly.max &&
    guidelines["4-wheeler"].daily.min &&
    guidelines["4-wheeler"].daily.max;
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/pricing`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data) {
          setGuidelines({
            "2-wheeler": {
              hourly: {
                min: res.data["2-wheeler"]?.hourly?.min || "",
                max: res.data["2-wheeler"]?.hourly?.max || "",
              },
              daily: {
                min: res.data["2-wheeler"]?.daily?.min || "",
                max: res.data["2-wheeler"]?.daily?.max || "",
              },
            },
            "4-wheeler": {
              hourly: {
                min: res.data["4-wheeler"]?.hourly?.min || "",
                max: res.data["4-wheeler"]?.hourly?.max || "",
              },
              daily: {
                min: res.data["4-wheeler"]?.daily?.min || "",
                max: res.data["4-wheeler"]?.daily?.max || "",
              },
            },
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleChange = (vehicle, type, field, value) => {
    setGuidelines((prev) => ({
      ...prev,
      [vehicle]: {
        ...prev[vehicle],
        [type]: {
          ...prev[vehicle][type],
          [field]: value,
        },
      },
    }));
  };

  const handleSave = () => {
    setSaving(true);
    axios
      .put(`http://localhost:5000/api/pricing`, guidelines, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        toast.success("Pricing guidelines saved successfully!");
      })
      .catch((err) => {
        setSaving(false);
        toast.error("Failed to save pricing guidelines. Please try again.");
      });
  };

  if (loading)
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  const vehicles = [
    { key: "2-wheeler", label: "2-Wheeler", icon: "🛵" },
    { key: "4-wheeler", label: "4-Wheeler", icon: "🚗" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6 max-w-2xl"
    >
      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl px-5 py-4 flex items-start gap-3">
        <span className="text-lg">💡</span>
        <div>
          <p className="text-sm font-bold text-yellow-800">
            Soft Pricing Guidelines
          </p>
          <p className="text-xs text-yellow-700 mt-0.5">
            These ranges will be shown to owners as a recommendation when they
            add their parking. Owners can set any price — but you can approve or
            reject based on their pricing.
          </p>
        </div>
      </div>

      {vehicles.map((vehicle, vi) => (
        <motion.div
          key={vehicle.key}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: vi * 0.08 }}
          className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-lg">
              {vehicle.icon}
            </div>
            <p className="text-sm font-black text-gray-900">
              {vehicle.label} Pricing Range
            </p>
          </div>

          <div className="p-5 flex flex-col gap-5">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                Hourly (₹)
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-400 mb-1.5 block">
                    Min Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={guidelines[vehicle.key].hourly.min}
                      onChange={(e) =>
                        handleChange(
                          vehicle.key,
                          "hourly",
                          "min",
                          e.target.value,
                        )
                      }
                      placeholder="10"
                      className="border-2 border-gray-100 focus:border-red-400 rounded-xl pl-7 pr-4 py-3 text-sm font-medium text-gray-700 w-full outline-none transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 mb-1.5 block">
                    Max Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={guidelines[vehicle.key].hourly.max}
                      onChange={(e) =>
                        handleChange(
                          vehicle.key,
                          "hourly",
                          "max",
                          e.target.value,
                        )
                      }
                      placeholder="50"
                      className="border-2 border-gray-100 focus:border-red-400 rounded-xl pl-7 pr-4 py-3 text-sm font-medium text-gray-700 w-full outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
              {guidelines[vehicle.key].hourly.min &&
                guidelines[vehicle.key].hourly.max && (
                  <div className="mt-2 bg-gray-50 rounded-xl px-3 py-2">
                    <p className="text-xs text-gray-500">
                      Owner will see:{" "}
                      <span className="font-bold text-gray-700">
                        💡 Recommended hourly: ₹
                        {guidelines[vehicle.key].hourly.min} - ₹
                        {guidelines[vehicle.key].hourly.max}
                      </span>
                    </p>
                  </div>
                )}
            </div>

            <div className="h-px bg-gray-100" />

            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                Daily (₹)
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-400 mb-1.5 block">
                    Min Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={guidelines[vehicle.key].daily.min}
                      onChange={(e) =>
                        handleChange(
                          vehicle.key,
                          "daily",
                          "min",
                          e.target.value,
                        )
                      }
                      placeholder="100"
                      className="border-2 border-gray-100 focus:border-red-400 rounded-xl pl-7 pr-4 py-3 text-sm font-medium text-gray-700 w-full outline-none transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 mb-1.5 block">
                    Max Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={guidelines[vehicle.key].daily.max}
                      onChange={(e) =>
                        handleChange(
                          vehicle.key,
                          "daily",
                          "max",
                          e.target.value,
                        )
                      }
                      placeholder="300"
                      className="border-2 border-gray-100 focus:border-red-400 rounded-xl pl-7 pr-4 py-3 text-sm font-medium text-gray-700 w-full outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
              {guidelines[vehicle.key].daily.min &&
                guidelines[vehicle.key].daily.max && (
                  <div className="mt-2 bg-gray-50 rounded-xl px-3 py-2">
                    <p className="text-xs text-gray-500">
                      Owner will see:{" "}
                      <span className="font-bold text-gray-700">
                        💡 Recommended daily: ₹
                        {guidelines[vehicle.key].daily.min} - ₹
                        {guidelines[vehicle.key].daily.max}
                      </span>
                    </p>
                  </div>
                )}
            </div>
          </div>
        </motion.div>
      ))}

      <button
        onClick={handleSave}
        disabled={saving || !isFormComplete} 
        className={`w-full py-3.5 rounded-2xl text-sm font-bold transition-all duration-200 ${
          !isFormComplete
            ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
            : saved
              ? "bg-green-500 text-white cursor-pointer"
              : "bg-[#ef4444] hover:bg-red-600 text-white shadow-md shadow-red-200 cursor-pointer"
        } active:scale-95`}
      >
        {saving
          ? "Saving..."
          : saved
            ? "✅ Saved Successfully!"
            : "Save Guidelines"}
      </button>
    </motion.div>
  );
};

export default PricingGuidelines;
