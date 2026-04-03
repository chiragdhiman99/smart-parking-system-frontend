import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import ParkingHero from "../components/parkingDetail/ParkingHero";
import ParkingTabs from "../components/parkingDetail/ParkingTabs";
import BookingCard from "../components/parkingDetail/BookingCard";
import axios from "axios";

const cardThemes = [
  { bg: "from-green-100 to-green-200", emoji: "🛍️" },
  { bg: "from-blue-100 to-blue-200", emoji: "🚇" },
  { bg: "from-orange-100 to-orange-200", emoji: "🏢" },
  { bg: "from-amber-100 to-amber-200", emoji: "🏬" },
  { bg: "from-red-100 to-red-200", emoji: "🏛️" },
  { bg: "from-teal-100 to-teal-200", emoji: "🌳" },
];

const mockSlots = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  label: `${String.fromCharCode(65 + Math.floor(i / 5))}${(i % 5) + 1}`,
  status:
    i % 7 === 0
      ? "occupied"
      : i % 11 === 0
        ? "reserved"
        : i % 13 === 0
          ? "maintenance"
          : "available",
}));

const ParkingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [parking, setParking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedVehicle, setSelectedVehicle] = useState("4-wheeler");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingDate, setBookingDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [fromTime, setFromTime] = useState("09:00");
  const [toTime, setToTime] = useState("11:00");
  const [bookedSlots, setBookedSlots] = useState([]);
  const [totalSlots, setTotalSlots] = useState(0);
  const theme = cardThemes[id.length % cardThemes.length];
  const url = window.location.href;
  const parkingid = url.split("/").pop();
  const bg = location.state?.bg;
  const distance = location.state?.distance;

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/parkings/${parkingid}`)
      .then((response) => {
        const total =
          Number(response.data.twoWheelerSlots) +
          Number(response.data.fourWheelerSlots);

        setTotalSlots(total);

        
        setParking(response.data);
        setLoading(false);
      })
      .catch((error) => {
        toast.error("Failed to load parking details. Please try again later.");
      });
  }, []);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/bookings/parking/${parkingid}`)
      .then((response) => {
        const arr = response.data
          .filter((slot) => slot.bookingStatus === "confirmed")
          .map((slot) => slot.slot);
        setBookedSlots(arr);
      })
      .catch((error) => {
        
      });
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm font-medium">
            Loading parking details...
          </p>
        </div>
      </div>
    );

  if (!parking)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-3">🅿️</p>
          <p className="text-gray-700 font-bold">Parking not found</p>
          <button
            onClick={() => navigate("/search")}
            className="mt-4 text-green-600 font-semibold text-sm"
          >
            ← Back to Search
          </button>
        </div>
      </div>
    );

  const availableslots = totalSlots - bookedSlots.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <ParkingHero
        parking={parking}
        totalSlots={totalSlots}
        theme={bg}
        navigate={navigate}
        availableslots={availableslots}
        distance={distance}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-16 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left — Tabs + Content */}
          <div className="lg:col-span-2">
            <ParkingTabs
              activeTab={activeTab}
              totalSlots={totalSlots}
              setActiveTab={setActiveTab}
              parking={parking}
              mockSlots={mockSlots}
              selectedSlot={selectedSlot}
              setSelectedSlot={setSelectedSlot}
              bookedSlots={bookedSlots}
              availableslots={availableslots}
            />
          </div>

          <div className="lg:col-span-1">
            <BookingCard
              parking={parking}
              theme={bg}
              selectedVehicle={selectedVehicle}
              setSelectedVehicle={setSelectedVehicle}
              selectedSlot={selectedSlot}
              bookingDate={bookingDate}
              setBookingDate={setBookingDate}
              fromTime={fromTime}
              setFromTime={setFromTime}
              toTime={toTime}
              setToTime={setToTime}
              availableslots={availableslots}
              ownerId={parking.ownerId}
              blockedDates={parking.blockedDates}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParkingDetail;
