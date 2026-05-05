import { motion } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Calendar,
  CheckCircle,
  XCircle,
  Bike,
  Car,
  Zap,
} from "lucide-react";

const ParkingHero = ({
  parking,
  totalSlots,
  theme,
  navigate,
  availableslots,
  distance,
}) => {
  const availPercent = Math.round((availableslots / totalSlots) * 100);

  return (
    <div className={`bg-gradient-to-br ${theme} relative overflow-hidden`}>
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 70% 50%, white 0%, transparent 60%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-16 pt-6">
        <button
          onClick={() => navigate("/search")}
          className="flex cursor-pointer items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold text-sm bg-white/70 backdrop-blur px-4 py-2 rounded-xl transition-colors"
        >
          <ArrowLeft size={16} /> Back to search
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-16 py-8 flex flex-col lg:flex-row gap-8 items-start">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full lg:w-[340px] flex-shrink-0 bg-white rounded-3xl overflow-hidden shadow-xl border border-white/50"
        >
          <div className="relative h-48 overflow-hidden">
            <div
              className={`w-full h-full bg-gradient-to-br ${theme} flex items-center justify-center`}
            >
              <span className="text-7xl">{parking.icon}</span>
            </div>

            <div
              className={`absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold backdrop-blur bg-white/90 ${
                availableslots > 0 ? "text-green-700" : "text-red-500"
              }`}
            >
              {availableslots > 0 ? (
                <CheckCircle size={13} className="text-green-500" />
              ) : (
                <XCircle size={13} className="text-red-500" />
              )}
              {availableslots > 0 ? `${availableslots} Slots Free` : "Full"}
            </div>

            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2.5 py-1.5 rounded-xl text-xs font-bold text-gray-700 flex items-center gap-1">
              <MapPin size={12} />
              {distance ? `${distance}km` : "—"}
            </div>
          </div>

          <div className="p-4">
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                <span>Availability</span>
                <span className="font-bold">
                  {availableslots}/{totalSlots} free
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    availPercent > 50
                      ? "bg-green-500"
                      : availPercent > 20
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }`}
                  style={{ width: `${availPercent}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex-1"
        >
          <div className="flex flex-wrap gap-2 mb-3">
            {parking.vehicleTypes?.map((v) => (
              <span
                key={v}
                className="bg-white/80 backdrop-blur text-gray-700 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5"
              >
                {v === "2-wheeler" ? <Bike size={13} /> : <Car size={13} />}
                {v}
              </span>
            ))}
            {parking.autoApprove && (
              <span className="bg-green-500/20 text-green-800 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                <Zap size={13} /> Instant Confirm
              </span>
            )}
          </div>

          <h1 className="text-3xl lg:text-4xl font-black text-gray-900 mb-2 leading-tight">
            {parking.name}
          </h1>

          <p className="text-gray-600 font-medium mb-4 flex items-center gap-1.5">
            <MapPin size={15} /> {parking.address}
          </p>

          <div className="flex items-center gap-3 mb-5">
            <div className="bg-white/80 backdrop-blur px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Clock size={15} />
              Open: <strong>{parking.availability?.openTime}</strong> –{" "}
              <strong>{parking.availability?.closeTime}</strong>
            </div>
            <div className="bg-white/80 backdrop-blur px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Calendar size={15} />
              {parking.availability?.days?.length === 7
                ? "Open All Week"
                : `${parking.availability?.days?.length} days/week`}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {parking.vehicleTypes?.map((v) => {
              const p = parking.pricing?.[v] || {};
              return (
                <div
                  key={v}
                  className="bg-white/90 backdrop-blur rounded-2xl px-5 py-3 border border-white/50 shadow-sm"
                >
                  <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                    {v === "4-wheeler" ? <Car size={12} /> : <Bike size={12} />}
                    {v}
                  </p>
                  <p className="text-xl font-black text-[#22C55E]">
                    ₹{p.hourly}
                    <span className="text-xs font-semibold text-gray-400">
                      /hr
                    </span>
                  </p>
                  <p className="text-xs text-gray-400">
                    ₹{p.daily}/day · ₹{p.monthly}/mo
                  </p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ParkingHero;
