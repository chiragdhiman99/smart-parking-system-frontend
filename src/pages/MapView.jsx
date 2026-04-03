import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const userIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const MapView = ({ parkings, userlat, userlong }) => {
  const navigate = useNavigate();
  const center = [28.6139, 77.209];
  const [showList, setShowList] = useState(false);

  return (
    <div className="flex flex-col gap-3 h-auto">
      <div className="flex sm:hidden gap-2">
        <button
          onClick={() => setShowList(false)}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            !showList ? "bg-[#22C55E] text-white" : "bg-gray-100 text-gray-600"
          }`}
        >
          🗺️ Map
        </button>
        <button
          onClick={() => setShowList(true)}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            showList ? "bg-[#22C55E] text-white" : "bg-gray-100 text-gray-600"
          }`}
        >
          📋 List ({parkings.length})
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 h-[500px] sm:h-[600px]">
        <div
          className={`${
            showList ? "flex" : "hidden"
          } sm:flex w-full sm:w-[300px] lg:w-[340px] sm:min-w-[300px] lg:min-w-[340px] overflow-y-auto flex-col gap-3 pr-1`}
        >
          {parkings.map((parking) => (
            <div
              key={parking._id}
              onClick={() =>
                navigate(`/parking/${parking._id}`, {
                  state: { bg: parking.bg, distance: parking.distance },
                })
              }
              className="bg-white border border-gray-200 rounded-2xl p-3 sm:p-4 cursor-pointer hover:border-green-400 transition-all duration-200 flex-shrink-0"
            >
              <div className="flex justify-between items-start mb-1">
                <p className="text-xs sm:text-sm font-bold text-gray-900 flex-1 pr-2 leading-tight">
                  {parking.name}
                </p>
                {parking.distance && (
                  <span className="text-[10px] sm:text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-lg whitespace-nowrap flex-shrink-0">
                    📍 {parking.distance} km
                  </span>
                )}
              </div>
              <p className="text-[10px] sm:text-xs text-gray-400 mb-2">
                {parking.address}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm font-black text-[#22C55E]">
                  Rs.{parking.price}/hr
                </span>
                <span
                  className={`text-[10px] sm:text-xs font-bold px-2 py-1 rounded-lg ${
                    parking.badge === "green"
                      ? "bg-green-50 text-green-700"
                      : parking.badge === "yellow"
                        ? "bg-yellow-50 text-yellow-700"
                        : "bg-red-50 text-red-500"
                  }`}
                >
                  {parking.slots > 0 ? `${parking.slots} free` : "Full"}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div
          className={`${
            showList ? "hidden" : "flex"
          } sm:flex flex-1 rounded-2xl overflow-hidden border border-gray-200`}
        >
          <MapContainer
            center={center}
            zoom={11}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {userlat && userlong && (
              <Marker
                position={[parseFloat(userlat), parseFloat(userlong)]}
                icon={userIcon}
              >
                <Popup>
                  <b>Your Location</b>
                </Popup>
              </Marker>
            )}

            {parkings.map((parking) => (
              <Marker
                key={parking._id}
                position={[
                  parseFloat(parking.coordinates?.lat),
                  parseFloat(parking.coordinates?.lng),
                ]}
                icon={redIcon}
              >
                <Popup>
                  <div style={{ minWidth: "140px" }}>
                    <p style={{ fontWeight: "bold", marginBottom: "4px" }}>
                      {parking.name}
                    </p>
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#555",
                        marginBottom: "2px",
                      }}
                    >
                      Rs.{parking.price}/hr
                    </p>
                    <p style={{ fontSize: "12px", color: "#22C55E" }}>
                      {parking.slots} slots free
                    </p>
                    {parking.distance && (
                      <p style={{ fontSize: "12px", color: "#888" }}>
                        📍 {parking.distance} km away
                      </p>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default MapView;
