import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FiSearch } from "react-icons/fi";
import Navbar from "../components/common/Navbar";
import axios from "axios";
import MapView from "./MapView";

const cardThemes = [
  { bg: "from-green-50 to-green-100" },
  { bg: "from-blue-50 to-blue-100" },
  { bg: "from-orange-50 to-orange-100" },
  { bg: "from-amber-50 to-amber-100" },
  { bg: "from-red-50 to-red-100" },
  { bg: "from-teal-50 to-teal-100" },
];

const getAmenityKeys = (amenities = {}) =>
  Object.entries(amenities)
    .filter(([, enabled]) => enabled)
    .map(([key]) => {
      if (key === "evCharging") return "ev";
      if (key === "carWash") return "carwash";
      return key;
    });

const getBadge = (availableSlots, totalSlots) => {
  if (availableSlots <= 0) return "red";
  if (availableSlots <= Math.max(3, Math.floor(totalSlots * 0.2)))
    return "yellow";
  return "green";
};

const formatParkings = (parkings = []) =>
  parkings.map((parking, index) => {
    const theme = cardThemes[index % cardThemes.length];
    return {
      ...parking,
      reviews: parking.totalReviews,
      slots: parking.availableSlots,
      total: parking.totalSlots,
      price:
        parking.pricing?.["4-wheeler"]?.hourly ??
        parking.pricing?.["2-wheeler"]?.hourly ??
        0,
      price2w: parking.pricing?.["2-wheeler"]?.hourly ?? null,
      amenities: getAmenityKeys(parking.amenities),
      bg: theme.bg,
      emoji: parking.icon || theme.emoji,
      close: parking.availability?.closeTime ?? "",
      badge: getBadge(parking.availableSlots, parking.totalSlots),
    };
  });

const getDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(1);
};

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchparams] = useSearchParams();
  const query = searchparams.get("q");
  const vehicle = searchparams.get("vehicle");

  const userlat = location.state?.lat || sessionStorage.getItem("userlat");
  const userlong = location.state?.long || sessionStorage.getItem("userlong");

  const [searchQuery, setSearchQuery] = useState(
    location.state?.searchQuery || "",
  );
  const [selectedVehicle, setSelectedVehicle] = useState(
    location.state?.activeTag || "All",
  );
  const [parkings, setParkings] = useState([]);
  const [outOfRange, setOutOfRange] = useState(false);
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [sortBy, setSortBy] = useState("rating");
  const [viewMode, setViewMode] = useState("grid");

  const cities = [
    "All Cities",
    "Delhi",
    "Noida",
    "Gurgaon",
    "Faridabad",
    "Ghaziabad",
  ];
  const vehicles = ["All", "2-Wheeler", "4-Wheeler"];

  useEffect(() => {
    if (query) setSearchQuery(query);
    const matchedCity = cities.find((city) => city.toLowerCase() === query);
    if (matchedCity) setSelectedCity(matchedCity);
    if (vehicle) setSelectedVehicle(vehicle);
  }, [query, vehicle]);

  useEffect(() => {
    if (location.state?.searchQuery) {
      const q = location.state.searchQuery.trim().toLowerCase();
      const matchedCity = cities.find((city) => city.toLowerCase() === q);
      if (matchedCity) setSelectedCity(matchedCity);
    }
  }, []);

  useEffect(() => {
    axios.get("https://smart-parking-system-backend-oco6.onrender.com/api/parkings").then((response) => {
      let data = response.data.filter(
        (parking) => parking.status === "approved",
      );
      if (userlat && userlong) {
        sessionStorage.setItem("userlat", userlat);
        sessionStorage.setItem("userlong", userlong);
        data = data.map((parking) => ({
          ...parking,
          distance: getDistance(
            parseFloat(userlat),
            parseFloat(userlong),
            parseFloat(parking.coordinates.lat),
            parseFloat(parking.coordinates.lng),
          ),
        }));
        data.sort((a, b) => a.distance - b.distance);
        if (data[0].distance > 50) {
          setOutOfRange(true);
        }
      }
      setParkings(formatParkings(data));
    });
  }, []);

  const filteredParkings = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const normalizedVehicle =
      selectedVehicle === "2-Wheeler"
        ? "2-wheeler"
        : selectedVehicle === "4-Wheeler"
          ? "4-wheeler"
          : null;

    const filtered = parkings.filter((parking) => {
      const matchesQuery =
        !q ||
        parking.name.toLowerCase().includes(q) ||
        parking.address.toLowerCase().includes(q) ||
        parking.city.toLowerCase().includes(q);
      const matchesCity =
        selectedCity === "All Cities" || parking.city === selectedCity;
      const matchesVehicle =
        !normalizedVehicle || parking.vehicleTypes?.includes(normalizedVehicle);
      return matchesQuery && matchesCity && matchesVehicle;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "price") return a.price - b.price;
      if (sortBy === "distance")
        return parseFloat(a.distance) - parseFloat(b.distance);
      if (sortBy === "slots") return b.slots - a.slots;
      return b.rating - a.rating;
    });
  }, [parkings, searchQuery, selectedCity, selectedVehicle, sortBy]);

  const hasNoResults = filteredParkings.length === 0;
  const hasActiveFilters =
    searchQuery.trim() ||
    selectedCity !== "All Cities" ||
    selectedVehicle !== "All";

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCity("All Cities");
    setSelectedVehicle("All");
    setSortBy("rating");
    setViewMode("grid");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="bg-white border-b border-gray-200 sticky top-[72px] z-40">
        <div className="max-w-7xl mx-auto px-6 lg:px-16 py-4">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 w-full">
            <div className="flex-1 flex items-center bg-gray-50 border-2 border-gray-200 rounded-xl px-2 sm:px-4 py-2 sm:py-2.5 focus-within:border-green-400 transition-colors duration-200 min-w-0">
              <span className="text-gray-400 mr-1 sm:mr-2 text-xs sm:text-sm flex-shrink-0">
                🔍
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by location, landmark or city..."
                className="flex-1 min-w-0 outline-none text-xs sm:text-sm font-medium text-gray-700 placeholder-gray-400 bg-transparent placeholder:text-[10px] placeholder:sm:text-xs placeholder:md:text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-gray-400 hover:text-gray-600 ml-1 sm:ml-2 flex-shrink-0 text-xs sm:text-sm"
                >
                  ✕
                </button>
              )}
            </div>
            <button className="bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold px-3 sm:px-6 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm transition-colors duration-200 whitespace-nowrap flex-shrink-0">
              Search
            </button>
          </div>

          <div className="flex items-center cursor-pointer justify-between gap-3 flex-wrap">
            <div className="flex flex-col overflow-x-auto scrollbar-hide gap-2">
              <div className="flex items-center bg-gray-100 rounded-xl p-1 overflow-x-auto scrollbar-hide w-full">
                {cities.map((city) => (
                  <button
                    key={city}
                    onClick={() => {
                      setSelectedCity(city);
                      if (city === "All Cities") setSearchQuery("");
                    }}
                    className={`px-2 sm:px-3 cursor-pointer py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                      selectedCity === city
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 w-full">
                <div className="flex items-center bg-gray-100 rounded-xl p-1 overflow-x-auto scrollbar-hide flex-1">
                  {vehicles.map((v) => (
                    <button
                      key={v}
                      onClick={() => setSelectedVehicle(v)}
                      className={`px-2 sm:px-3 cursor-pointer py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                        selectedVehicle === v
                          ? "bg-white text-gray-900 shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl text-[10px] sm:text-xs font-semibold text-gray-600 bg-gray-100 border-none outline-none cursor-pointer flex-shrink-0"
                >
                  <option value="rating">Top Rated</option>
                  <option value="price">Lowest Price</option>
                  <option value="distance">Nearest</option>
                  <option value="slots">Most Available</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-gray-500">
                {filteredParkings.length} results found
              </span>
              <div className="flex items-center bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    viewMode === "grid"
                      ? "bg-white shadow-sm text-gray-900"
                      : "text-gray-500"
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    viewMode === "list"
                      ? "bg-white shadow-sm text-gray-900"
                      : "text-gray-500"
                  }`}
                >
                  List
                </button>
                <button
                  onClick={() => setViewMode("map")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    viewMode === "map"
                      ? "bg-white shadow-sm text-gray-900"
                      : "text-gray-500"
                  }`}
                >
                  Map
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-16 py-8">
        {outOfRange && (
          <div className="text-center py-4 bg-yellow-50 border border-yellow-200 rounded-xl mb-6">
            <p className="text-sm font-bold text-yellow-700">
              📍 We currently serve Delhi NCR only!
            </p>
            <p className="text-xs text-yellow-600 mt-1">
              Showing all available parkings for your reference
            </p>
          </div>
        )}

        {hasNoResults && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-2xl rounded-3xl border border-gray-200 bg-white p-6 text-center shadow-sm sm:p-8"
          >
            <motion.div
              animate={{ scale: [1, 1.03, 1] }}
              transition={{
                repeat: Infinity,
                duration: 3.8,
                ease: "easeInOut",
              }}
              className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-2xl"
            >
              <FiSearch className="text-emerald-600" />
            </motion.div>
            <h2 className="text-2xl font-black text-gray-900">
              No results found
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-500 sm:text-base">
              Try changing your search, city, or vehicle filter to see more
              parking spots.
            </p>
            {hasActiveFilters && (
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {searchQuery.trim() && (
                  <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600">
                    {searchQuery}
                  </span>
                )}
                {selectedCity !== "All Cities" && (
                  <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                    {selectedCity}
                  </span>
                )}
                {selectedVehicle !== "All" && (
                  <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                    {selectedVehicle}
                  </span>
                )}
              </div>
            )}
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                onClick={handleResetFilters}
                className="rounded-2xl bg-[#22C55E] px-5 py-3 text-sm font-bold text-white transition-colors duration-200 hover:bg-[#16A34A]"
              >
                Clear Filters
              </button>
              <button
                onClick={() => navigate("/")}
                className="rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-700 transition-colors duration-200 hover:border-gray-300 hover:bg-gray-50"
              >
                Go Home
              </button>
            </div>
          </motion.div>
        )}

        {!hasNoResults && viewMode === "grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredParkings.map((parking, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                whileHover={{
                  y: -4,
                  boxShadow: "0 12px 40px rgba(34,197,94,0.1)",
                }}
                onClick={() =>
                  navigate(`/parking/${parking._id}`, {
                    state: { bg: parking.bg, distance: parking.distance },
                  })
                }
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden cursor-pointer transition-shadow duration-200"
              >
                <div
                  className={`h-44 bg-gradient-to-br ${parking.bg} flex items-center justify-center text-6xl relative`}
                >
                  {parking.emoji}
                  <div
                    className={`absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold ${
                      parking.badge === "green"
                        ? "bg-white text-green-700"
                        : parking.badge === "yellow"
                          ? "bg-white text-yellow-600"
                          : "bg-white text-red-500"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        parking.badge === "green"
                          ? "bg-green-500"
                          : parking.badge === "yellow"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                    />
                    {parking.slots > 0 ? `${parking.slots} Free` : "Full"}
                  </div>
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2.5 py-1.5 rounded-xl text-xs font-bold text-gray-700">
                    {parking.distance ? `📍 ${parking.distance} km` : null}
                  </div>
                  <div className="absolute bottom-3 left-3 flex gap-1.5">
                    {parking.vehicleTypes.map((vehicleType) => (
                      <span
                        key={vehicleType}
                        className="bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold text-gray-700"
                      >
                        {vehicleType}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-sm font-bold text-gray-900 leading-tight flex-1 pr-2">
                      {parking.name}
                    </h3>
                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg flex-shrink-0">
                      <span className="text-xs font-bold text-gray-700">
                        {parking.rating}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mb-3">
                    {parking.address}
                  </p>
                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <div>
                      <span className="text-lg font-black text-[#22C55E]">
                        Rs.{parking.price}/hr
                      </span>
                      <span className="text-xs text-gray-400 ml-1">
                        4-wheeler
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/parking/${parking._id}`);
                      }}
                      className="bg-[#22C55E] cursor-pointer hover:bg-[#16A34A] text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors duration-200"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        {!hasNoResults && viewMode === "list" && (
          <div className="flex flex-col gap-4">
            {filteredParkings.map((parking, index) => (
              <motion.div
                key={parking._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ x: 4 }}
                onClick={() =>
                  navigate(`/parking/${parking._id}`, {
                    state: { bg: parking.bg, distance: parking.distance },
                  })
                }
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden cursor-pointer hover:border-green-300 transition-all duration-200 flex"
              >
                <div
                  className={`w-24 sm:w-40 flex-shrink-0 bg-gradient-to-br ${parking.bg} flex items-center justify-center text-3xl sm:text-5xl relative`}
                >
                  {parking.emoji}
                  <div
                    className={`absolute bottom-2 left-2 text-[10px] font-bold px-2 py-1 rounded-lg ${
                      parking.badge === "green"
                        ? "bg-white text-green-700"
                        : parking.badge === "yellow"
                          ? "bg-white text-yellow-600"
                          : "bg-white text-red-500"
                    }`}
                  >
                    {parking.slots > 0 ? `${parking.slots} Free` : "Full"}
                  </div>
                </div>

                <div className="flex-1 p-3 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="text-sm sm:text-base font-bold text-gray-900 leading-tight">
                        {parking.name}
                      </h3>
                      <div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded-lg flex-shrink-0">
                        <span className="text-xs font-bold text-gray-700">
                          {parking.rating}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-400">
                      {parking.address}{" "}
                      {parking.distance ? `· 📍 ${parking.distance} km` : ""}
                    </p>
                  </div>

                  <div className="text-left sm:text-right flex-shrink-0">
                    <p className="text-lg sm:text-xl font-black text-[#22C55E]">
                      Rs.{parking.price}/hr
                    </p>
                    <p className="text-xs text-gray-400 mb-2 sm:mb-3">
                      {parking.total} total slots
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/parking/${parking._id}`);
                      }}
                      className="bg-[#22C55E] hover:bg-[#16A34A] text-white text-xs sm:text-sm font-bold px-3 sm:px-5 py-1.5 sm:py-2 rounded-xl transition-colors duration-200"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!hasNoResults && viewMode === "map" && (
          <MapView
            parkings={filteredParkings}
            userlat={userlat}
            userlong={userlong}
          />
        )}
      </div>
    </div>
  );
};

export default Search;
