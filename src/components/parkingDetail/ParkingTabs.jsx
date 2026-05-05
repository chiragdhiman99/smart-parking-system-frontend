import { motion } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import SlotGrid from "./SlotGrid";
import {
  Camera,
  Shield,
  Zap,
  Home,
  Accessibility,
  Droplets,
  LayoutList,
  ParkingSquare,
  BadgeDollarSign,
  Map,
  ImageIcon,
  Check,
  X,
  Clock,
  MapPin,
  Car,
  Bike,
  ScrollText,
} from "lucide-react";

const amenityConfig = {
  cctv: { icon: Camera, label: "CCTV Surveillance" },
  security: { icon: Shield, label: "24hr Security" },
  evCharging: { icon: Zap, label: "EV Charging" },
  covered: { icon: Home, label: "Covered Parking" },
  wheelchair: { icon: Accessibility, label: "Wheelchair Access" },
  carWash: { icon: Droplets, label: "Car Wash" },
};

const dayShort = {
  Monday: "Mon",
  Tuesday: "Tue",
  Wednesday: "Wed",
  Thursday: "Thu",
  Friday: "Fri",
  Saturday: "Sat",
  Sunday: "Sun",
};

const TABS = [
  { id: "overview", label: "Overview", icon: LayoutList },
  { id: "slots", label: "Slot Grid", icon: ParkingSquare },
  { id: "pricing", label: "Pricing", icon: BadgeDollarSign },
  { id: "map", label: "Location", icon: Map },
  { id: "photos", label: "Photos", icon: ImageIcon },
];

const ParkingTabs = ({
  activeTab,
  setActiveTab,
  parking,
  totalSlots,
  mockSlots,
  selectedSlot,
  setSelectedSlot,
  bookedSlots,
  availableslots,
  setSelectedVehicle,
}) => {
  const updatedSlots = parking.slots.map((slot) => {
    if ((bookedSlots ?? []).includes(slot.label)) {
      return { ...slot, status: "occupied" };
    }
    return slot;
  });

  return (
    <>
      <div className="bg-white border-b border-gray-200 sticky top-[72px] z-30">
        <div className="max-w-7xl overflow-x-auto scrollbar-hidden mx-auto px-6 lg:px-16">
          <div className="flex gap-1">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-4 text-sm font-semibold border-b-2 transition-all duration-200 ${
                    activeTab === tab.id
                      ? "border-[#22C55E] text-[#16A34A]"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Icon size={15} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {activeTab === "overview" && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-gray-200 p-6"
            >
              <h2 className="text-base font-black text-gray-900 mb-4">
                Amenities & Features
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.entries(parking.amenities || {}).map(
                  ([key, enabled]) => {
                    const IconComp = amenityConfig[key]?.icon;
                    return (
                      <div
                        key={key}
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                          enabled
                            ? "border-green-200 bg-green-50"
                            : "border-gray-100 bg-gray-50 opacity-50"
                        }`}
                      >
                        {IconComp && (
                          <IconComp
                            size={18}
                            className={`shrink-0 ${enabled ? "text-green-600" : "text-gray-400"}`}
                          />
                        )}
                        <div className="min-w-0">
                          <p
                            className={`text-xs font-bold truncate ${enabled ? "text-gray-900" : "text-gray-400"}`}
                          >
                            {amenityConfig[key]?.label}
                          </p>
                          <p
                            className={`text-[10px] flex items-center gap-1 ${enabled ? "text-green-600" : "text-gray-400"}`}
                          >
                            {enabled ? (
                              <>
                                <Check size={10} /> Available
                              </>
                            ) : (
                              <>
                                <X size={10} /> Not Available
                              </>
                            )}
                          </p>
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            </motion.div>

            {parking.rentalRules && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-gray-200 p-6"
              >
                <h2 className="text-base font-black text-gray-900 mb-4 flex items-center gap-2">
                  <ScrollText size={16} /> Rules & Policies
                </h2>
                <div className="flex flex-col gap-2">
                  {parking.rentalRules.split("\n").map((rule, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5 text-sm">•</span>
                      <p className="text-sm text-gray-600">
                        {rule.replace(/^[-•]\s*/, "")}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl border border-gray-200 p-6"
            >
              <h2 className="text-base font-black text-gray-900 mb-4">
                Open Days
              </h2>
              <div className="flex gap-2 flex-wrap">
                {[
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ].map((day) => {
                  const isOpen = parking.availability?.days?.includes(day);
                  return (
                    <div
                      key={day}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold ${
                        isOpen
                          ? "bg-green-50 border border-green-200 text-green-700"
                          : "bg-gray-50 border border-gray-200 text-gray-400"
                      }`}
                    >
                      {dayShort[day]}
                    </div>
                  );
                })}
              </div>
              <p className="text-sm text-gray-500 mt-3 flex items-center gap-1.5">
                <Clock size={14} /> Timings:{" "}
                <strong className="text-gray-800">
                  {parking.availability?.openTime} –{" "}
                  {parking.availability?.closeTime}
                </strong>
              </p>
            </motion.div>
          </>
        )}

        {activeTab === "slots" && (
          <>
            <div className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-400 inline-block"></span>
                <span className="text-sm font-semibold text-gray-700">
                  Available:{" "}
                  <strong className="text-green-600">{availableslots}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-400 inline-block"></span>
                <span className="text-sm font-semibold text-gray-700">
                  Occupied:{" "}
                  <strong className="text-red-500">
                    {totalSlots - availableslots}
                  </strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-gray-300 inline-block"></span>
                <span className="text-sm font-semibold text-gray-700">
                  Total: <strong className="text-gray-700">{totalSlots}</strong>
                </span>
              </div>
            </div>

            <SlotGrid
              parking={parking}
              bookedSlots={bookedSlots}
              selectedSlot={selectedSlot}
              setSelectedSlot={setSelectedSlot}
              setSelectedVehicle={setSelectedVehicle}
            />
          </>
        )}

        {activeTab === "pricing" && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-200 p-6"
          >
            <h2 className="text-base font-black text-gray-900 mb-5">
              Pricing Plans
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {parking.vehicleTypes?.map((v) => {
                const p = parking.pricing?.[v] || {};
                return (
                  <div
                    key={v}
                    className="border-2 border-gray-100 rounded-2xl p-5 hover:border-green-300 transition-colors"
                  >
                    <p className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-1.5">
                      {v === "4-wheeler" ? (
                        <Car size={15} />
                      ) : (
                        <Bike size={15} />
                      )}
                      {v === "4-wheeler" ? "4-Wheeler" : "2-Wheeler"}
                    </p>
                    <div className="flex flex-col gap-3">
                      {[
                        { label: "Hourly", value: p.hourly, unit: "/hr" },
                        { label: "Daily", value: p.daily, unit: "/day" },
                        { label: "Monthly", value: p.monthly, unit: "/mo" },
                      ].map((plan, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                        >
                          <span className="text-sm text-gray-500">
                            {plan.label}
                          </span>
                          <span className="text-lg font-black text-[#22C55E]">
                            ₹{plan.value}
                            <span className="text-xs font-semibold text-gray-400">
                              {plan.unit}
                            </span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {activeTab === "map" && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-200 p-6"
          >
            <h2 className="text-base font-black text-gray-900 mb-2">
              Location on Map
            </h2>
            <p className="text-sm text-gray-500 mb-4 flex items-center gap-1.5">
              <MapPin size={14} /> {parking.address}
            </p>
            <div className="h-[400px] rounded-2xl overflow-hidden">
              <MapContainer
                center={[parking.coordinates.lat, parking.coordinates.lng]}
                zoom={15}
                style={{ height: "400px", width: "100%" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker
                  position={[parking.coordinates.lat, parking.coordinates.lng]}
                >
                  <Popup>{parking.name}</Popup>
                </Marker>
              </MapContainer>
            </div>
          </motion.div>
        )}

        {activeTab === "photos" && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-200 p-6"
          >
            <h2 className="text-base font-black text-gray-900 mb-4">
              Parking Photos
            </h2>
            {parking.images && parking.images.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {parking.images.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt={`Parking image ${i + 1}`}
                    className="w-full h-40 object-cover rounded-xl border border-gray-100"
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-8">
                No photos uploaded yet.
              </p>
            )}
          </motion.div>
        )}
      </div>
    </>
  );
};

export default ParkingTabs;
