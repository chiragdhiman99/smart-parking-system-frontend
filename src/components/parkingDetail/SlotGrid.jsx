import { motion } from "framer-motion";
import { useCallback } from "react";

const slotStatusStyle = {
  available:
    "bg-green-50 border-green-300 text-green-700 hover:bg-green-100 cursor-pointer",
  occupied: "bg-red-50 border-red-200 text-red-400 cursor-not-allowed",
  reserved: "bg-yellow-50 border-yellow-300 text-yellow-600 cursor-not-allowed",
  maintenance: "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed",
};

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

const SlotGrid = ({
  parking,
  bookedSlots = [],
  selectedSlot,
  setSelectedSlot,
}) => {
  const fourWheelerCount = Number(parking?.fourWheelerSlots) || 0;
  const twoWheelerCount = Number(parking?.twoWheelerSlots) || 0;

  const carSlots = Array.from({ length: fourWheelerCount }, (_, i) => ({
    id: i + 1,
    label: `C${i + 1}`,
    type: "car",
    status: bookedSlots.includes(`C${i + 1}`) ? "occupied" : "available",
  }));

  const bikeSlots = Array.from({ length: twoWheelerCount }, (_, i) => ({
    id: fourWheelerCount + i + 1,
    label: `B${i + 1}`,
    type: "bike",
    status: bookedSlots.includes(`B${i + 1}`) ? "occupied" : "available",
  }));

  const carRows = chunk(carSlots, 2);
  const bikeLeft = bikeSlots.slice(0, Math.ceil(bikeSlots.length / 2));
  const bikeRight = bikeSlots.slice(Math.ceil(bikeSlots.length / 2));
  const bikeLeftRows = chunk(bikeLeft, 2);
  const bikeRightRows = chunk(bikeRight, 2);

  const handleSelect = useCallback(
    (slot) => {
      if (slot.status !== "available") return;
      setSelectedSlot(selectedSlot?.id === slot.id ? null : slot);
    },
    [selectedSlot, setSelectedSlot],
  );

  const SlotBox = ({ slot, isWide }) => (
    <div
      onClick={() => handleSelect(slot)}
      className={`
        border-2 rounded-xl flex items-center justify-center font-black transition-all duration-150
        text-[10px] sm:text-xs
        ${isWide ? "w-10 h-8 sm:w-14 sm:h-11" : "w-8 h-7 sm:w-10 sm:h-8"}
        ${slotStatusStyle[slot.status]}
        ${selectedSlot?.id === slot.id ? "ring-2 ring-green-500 ring-offset-1 scale-105" : ""}
      `}
    >
      {slot.label}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6"
    >
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm sm:text-base font-black text-gray-900">
          Live Slot Grid
        </h2>
        <span className="flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 text-xs font-bold px-2.5 sm:px-3 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />{" "}
          LIVE
        </span>
      </div>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 sm:mb-5">
        Floor G — Ground Level
      </p>

      <div className="w-full overflow-x-auto pb-2">
        <div className="flex gap-2 sm:gap-3 min-w-max mx-auto w-fit px-1">
          {carSlots.length > 0 && (
            <div className="flex-shrink-0">
              <p className="text-[10px] sm:text-xs font-bold text-green-600 mb-2 text-center">
                🚗 4-Wheeler
              </p>
              <div className="flex flex-col gap-1.5 sm:gap-2">
                {carRows.map((row, ri) => (
                  <div key={ri} className="flex gap-1.5 sm:gap-2">
                    {row.map((slot) => (
                      <SlotBox key={slot.id} slot={slot} isWide={true} />
                    ))}
                  </div>
                ))}
              </div>
              <p className="text-[9px] text-gray-300 text-center mt-2 uppercase tracking-widest">
                Time-based
              </p>
            </div>
          )}

          <div className="flex-shrink-0 flex flex-col items-center w-7 sm:w-10">
            <p
              className="text-[8px] sm:text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2"
              style={{
                writingMode: "vertical-rl",
                transform: "rotate(180deg)",
              }}
            >
              Driver Lane
            </p>
            <div className="flex-1 w-full bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-evenly py-3 min-h-[80px] sm:min-h-[100px]">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-4 sm:w-6 h-1.5 sm:h-2 bg-gray-200 rounded-full"
                />
              ))}
            </div>
          </div>

          {bikeLeftRows.length > 0 && (
            <div className="flex-shrink-0">
              <p className="text-[10px] sm:text-xs font-bold text-blue-500 mb-2 text-center">
                🛵 2-Wheeler
              </p>
              <div className="flex flex-col gap-1 sm:gap-1.5">
                {bikeLeftRows.map((row, ri) => (
                  <div key={ri} className="flex gap-1 sm:gap-1.5">
                    {row.map((slot) => (
                      <SlotBox key={slot.id} slot={slot} isWide={false} />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {bikeSlots.length > 0 && (
            <div className="flex-shrink-0 flex flex-col items-center w-6 sm:w-8">
              <p
                className="text-[8px] sm:text-[9px] font-bold text-blue-300 uppercase mb-2"
                style={{
                  writingMode: "vertical-rl",
                  transform: "rotate(180deg)",
                }}
              >
                Aisle
              </p>
              <div className="flex-1 w-full bg-blue-50 border-2 border-dashed border-blue-100 rounded-xl flex flex-col items-center justify-evenly py-3 min-h-[80px] sm:min-h-[100px]">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-3 sm:w-4 h-1 sm:h-1.5 bg-blue-100 rounded-full"
                  />
                ))}
              </div>
            </div>
          )}

          {bikeRightRows.length > 0 && (
            <div className="flex-shrink-0">
              <p className="text-[10px] sm:text-xs font-bold text-blue-500 mb-2 text-center">
                🛵 2-Wheeler
              </p>
              <div className="flex flex-col gap-1 sm:gap-1.5">
                {bikeRightRows.map((row, ri) => (
                  <div key={ri} className="flex gap-1 sm:gap-1.5">
                    {row.map((slot) => (
                      <SlotBox key={slot.id} slot={slot} isWide={false} />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 sm:gap-4 pt-4 mt-4 border-t border-gray-100">
        {[
          { color: "bg-green-500", label: "Available" },
          { color: "bg-red-400", label: "Occupied" },
          { color: "bg-yellow-500", label: "Reserved" },
          { color: "bg-gray-300", label: "Maintenance" },
        ].map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-1.5 text-[11px] sm:text-xs text-gray-500"
          >
            <span
              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${item.color} rounded-sm`}
            />
            {item.label}
          </div>
        ))}
      </div>

      {selectedSlot && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 bg-green-50 border border-green-200 rounded-xl p-3 sm:p-4 flex items-center justify-between"
        >
          <div>
            <p className="text-sm font-bold text-green-800">
              Slot {selectedSlot.label} Selected ✅
            </p>
            <p className="text-xs text-green-600">Tap "Book Now" to confirm</p>
          </div>
          <button
            onClick={() => setSelectedSlot(null)}
            className="text-green-600 text-xs font-bold"
          >
            Change
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SlotGrid;
