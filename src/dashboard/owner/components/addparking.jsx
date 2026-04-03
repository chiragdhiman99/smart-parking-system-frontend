import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";

const parkingIcons = [
  { icon: "🏢", label: "Commercial" },
  { icon: "🏬", label: "Mall" },
  { icon: "🏨", label: "Hotel" },
  { icon: "🚇", label: "Metro" },
  { icon: "🏥", label: "Hospital" },
  { icon: "🏫", label: "Office" },
  { icon: "🌳", label: "Garden" },
  { icon: "🏛️", label: "Public" },
];

const cities = ["Mumbai", "Delhi", "Bangalore", "Noida", "Gurugram", "Pune"];

const amenitiesList = [
  { key: "cctv", label: "CCTV", icon: "📹" },
  { key: "security", label: "24hr Security", icon: "💂" },
  { key: "evCharging", label: "EV Charging", icon: "⚡" },
  { key: "covered", label: "Covered", icon: "🏠" },
  { key: "wheelchair", label: "Wheelchair", icon: "♿" },
  { key: "carWash", label: "Car Wash", icon: "🚿" },
];

const AddParkingForm = ({ onClose, onSubmit, ownerid }) => {
  const token = localStorage.getItem("token");
  const decode = jwtDecode(token);
  const [guidelines, setGuidelines] = useState(null);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    icon: "🏢",
    name: "",
    address: "",
    city: "",
    ownerId: decode.userId,
    latitude: "",
    longitude: "",
    areaSqm: "",
    twoWheelerSlots: "",
    fourWheelerSlots: "",
    vehicleTypes: [],
    rentalRules: "",
    pricing: {
      "2-wheeler": { hourly: "", daily: "", monthly: "" },
      "4-wheeler": { hourly: "", daily: "", monthly: "" },
    },

    amenities: {
      cctv: false,
      security: false,
      evCharging: false,
      covered: false,
      wheelchair: false,
      carWash: false,
    },
    availability: {
      openTime: "06:00",
      closeTime: "23:00",
      days: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
    },
    autoApprove: true,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleVehicleType = (type) => {
    setForm((prev) => ({
      ...prev,
      vehicleTypes: prev.vehicleTypes.includes(type)
        ? prev.vehicleTypes.filter((v) => v !== type)
        : [...prev.vehicleTypes, type],
    }));
  };

  const handlePricing = (vehicleType, period, value) => {
    setForm((prev) => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        [vehicleType]: { ...prev.pricing[vehicleType], [period]: value },
      },
    }));
  };

  const handleImages = (e) => {
    const selected = [...e.target.files];
    setImages((prev) => [...prev, ...selected]);
    const urls = selected.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...urls]);
  };

  const uploadImages = async () => {
    const uploadedUrls = await Promise.all(
      images.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "parking-upload");
        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/dvk6auu6m/image/upload`,
          formData,
        );
        return res.data.secure_url;
      }),
    );
    return uploadedUrls;
  };

  const handleAmenity = (key) => {
    setForm((prev) => ({
      ...prev,
      amenities: { ...prev.amenities, [key]: !prev.amenities[key] },
    }));
  };

  const handleDay = (day) => {
    setForm((prev) => ({
      ...prev,
      availability: {
        ...prev.availability,
        days: prev.availability.days.includes(day)
          ? prev.availability.days.filter((d) => d !== day)
          : [...prev.availability.days, day],
      },
    }));
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Parking name is required";
    if (!form.address.trim()) newErrors.address = "Address is required";
    if (!form.city) newErrors.city = "City is required";
    if (!form.areaSqm) errors.areaSqm = "Area is required";
    if (!form.twoWheelerSlots)
      errors.twoWheelerSlots = "2-Wheeler slots required";
    if (!form.fourWheelerSlots)
      errors.fourWheelerSlots = "4-Wheeler slots required";
    if (form.vehicleTypes.length === 0)
      newErrors.vehicleTypes = "Select at least one vehicle type";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    form.vehicleTypes.forEach((type) => {
      if (!form.pricing[type].hourly) newErrors[`${type}_hourly`] = "Required";
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const dayShort = {
    Monday: "Mon",
    Tuesday: "Tue",
    Wednesday: "Wed",
    Thursday: "Thu",
    Friday: "Fri",
    Saturday: "Sat",
    Sunday: "Sun",
  };
  const handleSubmit = async () => {
    const urls = await uploadImages();

    const cleanedPricing = {};
    form.vehicleTypes.forEach((type) => {
      cleanedPricing[type] = {
        hourly: Number(form.pricing[type].hourly),
        daily: Number(form.pricing[type].daily),
        monthly: Number(form.pricing[type].monthly),
      };
    });

    const cleanedForm = {
      ...form,
      images: urls,
      coordinates: {
        lat: Number(form.latitude),
        lng: Number(form.longitude),
      },
      twoWheelerSlots: Number(form.twoWheelerSlots),
      fourWheelerSlots: Number(form.fourWheelerSlots),
      areaSqm: Number(form.areaSqm),
      pricing: cleanedPricing,
    };

    axios
      .post("http://localhost:5000/api/parkings", cleanedForm)
      .then((res) => {
        onClose();
        toast.success("Parking added successfully!");
      })
      .catch(() => {
        toast.error("Failed to add parking. Please try again.");
      });
  };

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/pricing`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data && res.data.length > 0) setGuidelines(res.data[0]);
      })
      .catch(() => {
        toast.error("Failed to fetch pricing guidelines.");
      });
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-lg font-black text-gray-900">
              Add Parking Lot
            </h2>
            <p className="text-xs text-gray-400">Step {step} of 3</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 cursor-pointer transition-all"
          >
            ✕
          </button>
        </div>

        <div className="px-6 pt-4">
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`flex-1 h-1.5 rounded-full transition-all ${s <= step ? "bg-[#3B82F6]" : "bg-gray-100"}`}
              />
            ))}
          </div>
          <div className="flex justify-between mt-1.5">
            {["Basic Info", "Pricing", "Settings"].map((label, i) => (
              <span
                key={i}
                className={`text-[10px] font-semibold ${i + 1 <= step ? "text-blue-600" : "text-gray-400"}`}
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="p-6 flex flex-col gap-5">
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col gap-4"
            >
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                  Parking Icon
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {parkingIcons.map((item) => (
                    <button
                      key={item.icon}
                      onClick={() => handleChange("icon", item.icon)}
                      className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all cursor-pointer ${
                        form.icon === item.icon
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-100 hover:border-gray-200"
                      }`}
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <span className="text-[10px] font-semibold text-gray-500">
                        {item.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">
                  Parking Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="e.g. Infinity Mall Parking"
                  className={`w-full border-2 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 outline-none transition-colors ${errors.name ? "border-red-400" : "border-gray-200 focus:border-blue-400"}`}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">✕ {errors.name}</p>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">
                  Address
                </label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  placeholder="Full address with landmark"
                  className={`w-full border-2 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 outline-none transition-colors ${errors.address ? "border-red-400" : "border-gray-200 focus:border-blue-400"}`}
                />
                {errors.address && (
                  <p className="text-red-500 text-xs mt-1">
                    ✕ {errors.address}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">
                    Latitude
                  </label>
                  <input
                    type="text"
                    value={form.latitude}
                    onChange={(e) => handleChange("latitude", e.target.value)}
                    placeholder="e.g. 28.6246"
                    className="w-full border-2 rounded-xl px-4 py-3 text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">
                    Longitude
                  </label>
                  <input
                    type="text"
                    value={form.longitude}
                    onChange={(e) => handleChange("longitude", e.target.value)}
                    placeholder="e.g. 77.0586"
                    className="w-full border-2 rounded-xl px-4 py-3 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">
                    City
                  </label>
                  <select
                    value={form.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                    className={`w-full border-2 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 outline-none transition-colors cursor-pointer ${errors.city ? "border-red-400" : "border-gray-200 focus:border-blue-400"}`}
                  >
                    <option value="">Select city</option>
                    {cities.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  {errors.city && (
                    <p className="text-red-500 text-xs mt-1">✕ {errors.city}</p>
                  )}
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">
                    Area (sqm)
                  </label>
                  <input
                    type="number"
                    value={form.areaSqm}
                    onChange={(e) => handleChange("areaSqm", e.target.value)}
                    placeholder="e.g. 250"
                    min="1"
                    className={`w-full border-2 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 outline-none transition-colors ${errors.areaSqm ? "border-red-400" : "border-gray-200 focus:border-blue-400"}`}
                  />
                  {errors.areaSqm && (
                    <p className="text-red-500 text-xs mt-1">
                      ✕ {errors.areaSqm}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">
                    2-Wheeler Slots
                  </label>
                  <input
                    type="number"
                    value={form.twoWheelerSlots}
                    onChange={(e) =>
                      handleChange("twoWheelerSlots", e.target.value)
                    }
                    placeholder="e.g. 90"
                    min="1"
                    className={`w-full border-2 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 outline-none transition-colors ${errors.twoWheelerSlots ? "border-red-400" : "border-gray-200 focus:border-blue-400"}`}
                  />
                  {errors.twoWheelerSlots && (
                    <p className="text-red-500 text-xs mt-1">
                      ✕ {errors.twoWheelerSlots}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">
                    4-Wheeler Slots
                  </label>
                  <input
                    type="number"
                    value={form.fourWheelerSlots}
                    onChange={(e) =>
                      handleChange("fourWheelerSlots", e.target.value)
                    }
                    placeholder="e.g. 19"
                    min="1"
                    className={`w-full border-2 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 outline-none transition-colors ${errors.fourWheelerSlots ? "border-red-400" : "border-gray-200 focus:border-blue-400"}`}
                  />
                  {errors.fourWheelerSlots && (
                    <p className="text-red-500 text-xs mt-1">
                      ✕ {errors.fourWheelerSlots}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                  Vehicle Types
                </label>
                <div className="flex gap-3">
                  {["2-wheeler", "4-wheeler"].map((type) => (
                    <button
                      key={type}
                      onClick={() => handleVehicleType(type)}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-bold transition-all cursor-pointer ${
                        form.vehicleTypes.includes(type)
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-200 text-gray-500 hover:border-gray-300"
                      }`}
                    >
                      {type === "2-wheeler" ? "🏍️" : "🚗"} {type}
                    </button>
                  ))}
                </div>
                {errors.vehicleTypes && (
                  <p className="text-red-500 text-xs mt-1">
                    ✕ {errors.vehicleTypes}
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col gap-5"
            >
              {form.vehicleTypes.map((type) => (
                <div
                  key={type}
                  className="bg-gray-50 rounded-2xl p-4 border border-gray-100"
                >
                  <p className="text-sm font-black text-gray-900 mb-3">
                    {type === "4-wheeler" ? "🚗 4-Wheeler" : "🏍️ 2-Wheeler"}{" "}
                    Pricing
                  </p>

                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { key: "hourly", label: "Per Hour" },
                      { key: "daily", label: "Per Day" },
                      { key: "monthly", label: "Per Month" },
                    ].map((period) => (
                      <div key={period.key}>
                        <label className="text-[10px] font-bold text-gray-400 mb-1 block uppercase">
                          {period.label}
                        </label>
                        <div
                          className={`flex items-center border-2 rounded-xl px-3 py-2.5 bg-white transition-colors ${errors[`${type}_${period.key}`] ? "border-red-400" : "border-gray-200 focus-within:border-blue-400"}`}
                        >
                          <span className="text-xs text-gray-400 mr-1">₹</span>
                          <input
                            type="number"
                            value={form.pricing[type][period.key]}
                            onChange={(e) =>
                              handlePricing(type, period.key, e.target.value)
                            }
                            placeholder="0"
                            min="0"
                            className="flex-1 outline-none text-sm font-bold text-gray-700 bg-transparent w-full"
                          />
                        </div>
                        {errors[`${type}_${period.key}`] && (
                          <p className="text-red-500 text-[10px] mt-0.5">
                            Required
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  {guidelines && guidelines[type] && (
                    <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-xl px-3 py-2.5 flex items-start gap-2">
                      <span className="text-sm">💡</span>
                      <div>
                        <p className="text-xs font-bold text-yellow-800">
                          Recommended Range
                        </p>
                        <p className="text-xs text-yellow-700 mt-0.5">
                          Hourly: ₹{guidelines[type].hourly.min} - ₹
                          {guidelines[type].hourly.max}
                          &nbsp;·&nbsp; Daily: ₹{guidelines[type].daily.min} - ₹
                          {guidelines[type].daily.max}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col gap-5"
            >
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">
                  Rental Rules
                </label>
                <textarea
                  value={form.rentalRules}
                  onChange={(e) => handleChange("rentalRules", e.target.value)}
                  placeholder="e.g. Minimum booking 1 hour. No entry after 10pm. Cancellation must be done 2 hours before."
                  rows={4}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 outline-none focus:border-blue-400 transition-colors resize-none"
                />
                <p className="text-xs text-gray-400 mt-1">
                  These rules will be shown to drivers before booking.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">
                  Parking Images
                </label>

                <div
                  className={`border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center gap-2 transition-all ${
                    images.length >= 5
                      ? "border-gray-100 bg-gray-50 cursor-not-allowed opacity-50"
                      : "border-gray-200 hover:border-blue-400 cursor-pointer"
                  }`}
                  onClick={() =>
                    images.length < 5 &&
                    document.getElementById("parkingImages").click()
                  }
                >
                  <span className="text-3xl">🖼️</span>
                  <p className="text-sm font-bold text-gray-500">
                    Click to add images
                  </p>
                  <p className="text-xs text-gray-400">JPG, PNG supported</p>
                  <input
                    id="parkingImages"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImages}
                  />
                </div>

                <div className="flex gap-2 flex-wrap mt-3">
                  {previews.map((url, i) => (
                    <div key={i} className="relative">
                      <img
                        src={url}
                        className="w-16 h-16 object-cover rounded-xl border-2 border-gray-100"
                      />
                      <button
                        onClick={() => {
                          setImages((prev) =>
                            prev.filter((_, idx) => idx !== i),
                          );
                          setPreviews((prev) =>
                            prev.filter((_, idx) => idx !== i),
                          );
                        }}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-[10px] flex items-center justify-center cursor-pointer hover:bg-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-gray-400 mt-1.5 text-right">
                  {images.length}/5 images added
                </p>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                  Amenities
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {amenitiesList.map((amenity) => (
                    <button
                      key={amenity.key}
                      onClick={() => handleAmenity(amenity.key)}
                      className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-semibold transition-all cursor-pointer ${
                        form.amenities[amenity.key]
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-200 text-gray-500 hover:border-gray-300"
                      }`}
                    >
                      <span>{amenity.icon}</span>
                      {amenity.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                  Open Days
                </label>
                <div className="flex gap-1.5 flex-wrap">
                  {days.map((day) => (
                    <button
                      key={day}
                      onClick={() => handleDay(day)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        form.availability.days.includes(day)
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      {dayShort[day]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                  Timings
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-gray-400 mb-1 block">
                      Open Time
                    </label>
                    <input
                      type="time"
                      value={form.availability.openTime}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          availability: {
                            ...prev.availability,
                            openTime: e.target.value,
                          },
                        }))
                      }
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 outline-none focus:border-blue-400 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400 mb-1 block">
                      Close Time
                    </label>
                    <input
                      type="time"
                      value={form.availability.closeTime}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          availability: {
                            ...prev.availability,
                            closeTime: e.target.value,
                          },
                        }))
                      }
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 outline-none focus:border-blue-400 transition-colors"
                    />
                  </div>
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
                  onClick={() => handleChange("autoApprove", !form.autoApprove)}
                  className={`w-12 h-6 rounded-full transition-all cursor-pointer relative ${form.autoApprove ? "bg-blue-500" : "bg-gray-200"}`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${form.autoApprove ? "left-7" : "left-1"}`}
                  />
                </button>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <p className="text-xs font-black text-blue-800 mb-2">Summary</p>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{form.icon}</span>
                  <span className="text-sm font-bold text-gray-900">
                    {form.name}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  📍 {form.address}, {form.city}
                </p>
                <p className="text-xs text-gray-500">
                  🅿️ {form.totalSlots} slots · {form.vehicleTypes.join(", ")}
                </p>
              </div>
            </motion.div>
          )}
        </div>

        <div className="p-6 border-t border-gray-100 flex gap-3 sticky bottom-0 bg-white">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 border-2 border-gray-200 text-gray-700 font-bold py-3 rounded-xl text-sm cursor-pointer hover:bg-gray-50 transition-all"
            >
              ← Back
            </button>
          )}
          {step < 3 ? (
            <button
              onClick={handleNext}
              className="flex-1 bg-[#3B82F6] hover:bg-blue-600 text-white font-bold py-3 rounded-xl text-sm cursor-pointer transition-all"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex-1 bg-[#3B82F6] hover:bg-blue-600 text-white font-bold py-3 rounded-xl text-sm cursor-pointer transition-all shadow-[0_4px_16px_rgba(59,130,246,0.3)]"
            >
              Submit for approval
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AddParkingForm;
