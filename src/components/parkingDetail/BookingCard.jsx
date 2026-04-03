import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import toast from "react-hot-toast";
const BookingCard = ({
  parking,
  theme,
  selectedVehicle,
  setSelectedVehicle,
  selectedSlot,
  bookingDate,
  setBookingDate,
  fromTime,
  setFromTime,
  toTime,
  setToTime,
  availableslots,
  ownerId,
  blockedDates,
}) => {
  const navigate = useNavigate();
  const [bookedSlots, setBookedSlots] = useState([]);
  const [slotConflict, setSlotConflict] = useState(false);

  const [vehicleNumber, setVehicleNumber] = useState("");
  if (!parking) {
    return <p>Loading...</p>;
  }

  const price4w = parking?.pricing?.["4-wheeler"] || {};
  const price2w = parking?.pricing?.["2-wheeler"] || {};
  const currentPrice = selectedVehicle === "4-wheeler" ? price4w : price2w;

  const safeFromTime = fromTime || "00:00";
  const safeToTime = toTime || "00:00";

  const [fromHour, fromMinute] = safeFromTime.split(":").map(Number);
  const [toHour, toMinute] = safeToTime.split(":").map(Number);

  const fromTotalMinutes = fromHour * 60 + fromMinute;
  const toTotalMinutes = toHour * 60 + toMinute;

  const durationHours =
    toTotalMinutes > fromTotalMinutes
      ? (toTotalMinutes - fromTotalMinutes) / 60
      : 0;

  const formattedDuration = durationHours.toFixed(2);

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!vehicleNumber.trim())
      newErrors.vehicleNumber = "Vehicle number required";
    if (!selectedSlot) newErrors.slot = "Please select a slot from the grid";
    if (!bookingDate) newErrors.date = "Please select a date";
    if (!fromTime) newErrors.fromTime = "Select start time";
    if (!toTime) newErrors.toTime = "Select end time";
    if (durationHours <= 0)
      newErrors.duration = "End time must be after start time";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleconfirm = async () => {
    if (!validate()) return;
    try {
      const token = localStorage.getItem("token");

      await axios.get("http://localhost:5000/api/bookings/check/auth", {
        headers: { Authorization: `Bearer ${token}` },
      });

      navigate("/processing/booking", {
        state: { bg: theme },
      });
      setTimeout(() => {
        navigate("/payment", {
          state: {
            bg: theme,
            userdetails: {
              parkingid: parking?._id,
              vehicle: selectedVehicle,
              date: bookingDate,
              fromTime,
              toTime,
              slot: selectedSlot,
              duration: `${formattedDuration} hrs`,
              totalPrice: `₹${totalPrice}`,
              parkingName: parking?.name,
              address: parking?.address,
              city: parking?.city,
              ownerId: ownerId,
              state: parking?.state,
              pincode: parking?.pincode,
              icon: parking?.icon,
              vehicleNumber: vehicleNumber,
              image: parking?.image,

              amenities: parking?.amenities,
              features: parking?.features,
              vehicleTypes: parking?.vehicleTypes,
              pricing: parking?.pricing,

              autoApprove: parking?.autoApprove,
              totalSlots: parking?.totalSlots,
              rating: parking?.rating,
              contact: parking?.contact,
            },
          },
        });
      }, 4000);
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/login"); 
      }
    }
  };

  useEffect(() => {
    const url = "http://localhost:5000/api/parkings/" + parking._id;
    axios
      .put(url, { availableSlots: availableslots })
     
  }, [availableslots]);

  useEffect(() => {
    const url = "http://localhost:5000/api/bookings/parking/" + parking._id;
    axios
      .get(url)
      .then((res) => {
        const bookings = res.data;
        const bookedslots = bookings
          .filter((booking) => booking.bookingStatus === "confirmed")
          .map((b) => ({
            slot: b.slot,
            fromTime: b.fromTime,
            toTime: b.toTime,
            date: b.date,
          }));
        setBookedSlots(bookedslots);
      })
      .catch(() => {
        toast.error("Failed to fetch bookings");
      });
  }, []);

  const isSlotBooked = () => {
    const slotNumber = parseInt(selectedSlot?.label.replace("C", ""));

    if (slotNumber % 2 === 0) {
      const innerSlot = `C${slotNumber - 1}`;
      const innerBooking = bookedSlots.find(
        (booking) => booking.slot === innerSlot && booking.date === bookingDate,
      );
      if (innerBooking) {
        return innerBooking.fromTime < toTime && innerBooking.toTime > fromTime;
      }
    } else {
      const outerSlot = `C${slotNumber + 1}`;
      const outerBooking = bookedSlots.find(
        (booking) => booking.slot === outerSlot && booking.date === bookingDate,
      );
      if (outerBooking) {
        return outerBooking.fromTime < toTime && outerBooking.toTime > fromTime;
      }
    }

    return false;
  };

  useEffect(() => {
    if (selectedSlot && fromTime && toTime) {
      setSlotConflict(isSlotBooked());
    }
  }, [selectedSlot, fromTime, toTime, bookingDate]);

  const fromhour = parseInt(fromTime.split(":")[0]);
  const day = new Date(bookingDate).getDay();
  const isWeekend = day === 0 || day === 6;

  const occupancy =
    ((parking.totalSlots - availableslots) / parking.totalSlots) * 100;
  const multiplier =
    occupancy <= 30 ? 0.8 : occupancy <= 60 ? 1 : occupancy <= 80 ? 1.2 : 1.5;

  const isPeak =
    (fromhour >= 9 && fromhour < 11) || (fromhour >= 17 && fromhour < 20);
  const peakMultiplier = multiplier + (isPeak ? 0.3 : 0);
  const finalMultiplier = peakMultiplier + (isWeekend ? 0.2 : 0);
  const totalPrice = Math.round(
    (currentPrice.hourly || 0) * durationHours * finalMultiplier,
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 sticky top-[130px]">
      <h3 className="text-base font-black text-gray-900 mb-4">
        Book This Parking
      </h3>

      <div className="mb-4">
        <label className="text-xs font-bold text-gray-500 mb-2 block uppercase tracking-wider">
          Vehicle Type
        </label>
        <div className="flex gap-2">
          {parking.vehicleTypes?.map((v) => (
            <button
              key={v}
              onClick={() => setSelectedVehicle(v)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold border-2 ${
                selectedVehicle === v
                  ? "border-green-500 bg-green-50 text-green-700"
                  : "border-gray-200 text-gray-500"
              }`}
            >
              {v === "4-wheeler" ? "🚗" : "🏍️"} {v}
            </button>
          ))}
        </div>
      </div>

      <div className=" relative mb-4">
        <label className="text-xs font-bold text-gray-500 mb-2 block uppercase tracking-wider">
          Vehicle Number
        </label>
        <input
          type="text"
          value={vehicleNumber}
          onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
          placeholder="e.g. HP12 AB 1234"
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold tracking-widest uppercase"
        />
        <p className="absolute text-xs text-red-500 -bottom-4 left-0 h-4">
          {errors.vehicleNumber ? `⚠️ ${errors.vehicleNumber}` : ""}
        </p>
      </div>

      <div className=" relative mb-4">
        <label className="text-xs font-bold text-gray-500 mb-2 block uppercase tracking-wider">
          Date
        </label>
        <div className="relative">
          <DatePicker
            selected={bookingDate ? new Date(bookingDate) : null}
            onChange={(date) =>
              setBookingDate(date.toISOString().split("T")[0])
            }
            minDate={new Date()}
            excludeDates={(blockedDates || []).map((d) => new Date(d))}
            dateFormat="dd-MM-yyyy"
            className=" border-2 cursor-pointer border-gray-200 rounded-xl px-2 py-2.5 text-sm "
            placeholderText="Select date"
            id="datepicker"
          />
          <label
            htmlFor="datepicker"
            className="absolute cursor-pointer  top-1/2 left-38 -translate-y-1/2 text-gray-400"
          >
            📅
          </label>
        </div>
        <p className="absolute text-xs text-red-500 -bottom-4 left-0 h-4">
          {errors.date ? `⚠️ ${errors.date}` : ""}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <div>
          <label className="text-xs font-bold text-gray-500 mb-2 block uppercase tracking-wider">
            From
          </label>
          <input
            type="time"
            value={fromTime || ""}
            onChange={(e) => setFromTime(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-gray-500 mb-2 block uppercase tracking-wider">
            To
          </label>
          <input
            type="time"
            value={toTime || ""}
            onChange={(e) => setToTime(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm"
          />
        </div>
      </div>

      {errors.fromTime && (
        <p className="text-xs text-red-500 mt-1">⚠️ {errors.fromTime}</p>
      )}
      {errors.toTime && (
        <p className="text-xs text-red-500 mt-1">⚠️ {errors.toTime}</p>
      )}
      {errors.duration && (
        <p className="text-xs text-red-500 mt-1">⚠️ {errors.duration}</p>
      )}

      <div className=" relative mb-4 p-3 bg-gray-50 rounded-xl border">
        <p className="text-xs font-bold text-gray-500 mb-1">Selected Slot</p>

        {slotConflict ? (
          <p className="text-sm font-bold text-red-500">
            🚫 This slot is unavailable for the selected time window. Please
            choose a different time or slot.
          </p>
        ) : (
          <p className="text-sm font-black text-gray-800">
            {selectedSlot
              ? `Slot ${selectedSlot.label} ✅`
              : "Not selected — pick from grid"}
          </p>
        )}
        <p className="absolute text-xs text-red-500 -bottom-4 left-0 h-4">
          {errors.slot ? `⚠️ ${errors.slot}` : ""}
        </p>
      </div>

<br></br>
      <div className="mb-4 p-3 bg-green-50 rounded-xl border">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>
            ₹{currentPrice.hourly || 0}/hr × {formattedDuration} hrs
          </span>
          <span>₹{Math.round((currentPrice.hourly || 0) * durationHours)}</span>
        </div>
        {multiplier !== 1 && (
          <div className="flex justify-between text-xs mb-1">
            <span
              className={multiplier < 1 ? "text-green-600" : "text-red-500"}
            >
              {multiplier < 1
                ? "🟢 Low Demand Discount"
                : "🔴 High Demand Surge"}{" "}
              ({multiplier < 1 ? "-" : "+"}
              {Math.round(Math.abs((1 - multiplier) * 100))}%)
            </span>
            <span
              className={multiplier < 1 ? "text-green-600" : "text-red-500"}
            >
              {multiplier < 1 ? "-" : "+"}₹
              {Math.abs(
                Math.round(
                  (currentPrice.hourly || 0) * durationHours * multiplier,
                ) - Math.round((currentPrice.hourly || 0) * durationHours),
              )}
            </span>
          </div>
        )}

        {isPeak && (
          <div className="flex justify-between text-xs mb-1">
            <span className="text-red-500">🔴 Peak Hours Surge (+30%)</span>
            <span className="text-red-500">
              +₹
              {Math.abs(
                Math.round(
                  (currentPrice.hourly || 0) * durationHours * peakMultiplier,
                ) -
                  Math.round(
                    (currentPrice.hourly || 0) * durationHours * multiplier,
                  ),
              )}
            </span>
          </div>
        )}

        {isWeekend && (
          <div className="flex justify-between text-xs mb-1">
            <span className="text-red-500">🔴 Weekend Surge (+20%)</span>
            <span className="text-red-500">
              +₹
              {Math.abs(
                Math.round(
                  (currentPrice.hourly || 0) * durationHours * finalMultiplier,
                ) -
                  Math.round(
                    (currentPrice.hourly || 0) * durationHours * peakMultiplier,
                  ),
              )}
            </span>
          </div>
        )}

        <div className="flex justify-between text-sm font-black text-gray-900 pt-1 border-t mt-1">
          <span>Total</span>
          <span className="text-[#22C55E]">₹{totalPrice}</span>
        </div>

        {durationHours <= 0 && (
          <p className="mt-2 text-xs text-red-500">
            End time should be later than start time.
          </p>
        )}
      </div>

      <button
        onClick={handleconfirm}
        disabled={slotConflict} 
        className={`w-full font-black py-3.5 rounded-xl text-white ${
          slotConflict
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-[#22C55E] cursor-pointer"
        }`}
      >
        Confirm Booking →
      </button>

      <p className="text-center text-xs text-gray-400 mt-3">
        {parking?.autoApprove
          ? "⚡ Instant confirmation"
          : "⏳ Manual approval required"}
      </p>
    </div>
  );
};

export default BookingCard;
