import { useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { usePDF } from "react-to-pdf";

import ReceiptCard from "./components/ReceiptCard";
import ReceiptPDFTemplate from "./components/ReceiptPDFTemplate";

const amenitiesMap = {
  cctv: "CCTV Surveillance",
  security: "24hr Security",
  evCharging: "EV Charging",
  covered: "Covered Parking",
  wheelchair: "Wheelchair Access",
};

export default function BookingReceipt() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userdetails } = location.state || {};

  const bookingId = "PRK" + Date.now().toString().slice(-8);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const convenience = 2;
  const rawPrice = parseInt(userdetails?.totalPrice?.replace("₹", "") || 0);
  const gst = Math.round((rawPrice + convenience) * 0.18);
  const total = rawPrice + convenience + gst;

  const activeAmenities = userdetails?.amenities
    ? Object.entries(userdetails.amenities)
        .filter(([_, v]) => v)
        .map(([k]) => amenitiesMap[k] || k)
    : [];

  const now = new Date();
  const issuedAt = now.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const qrData = JSON.stringify({ bookingId, slot: userdetails?.slot?.label });

  const { toPDF, targetRef } = usePDF({ filename: `SlotHub_${bookingId}.pdf` });

  const sharedProps = {
    bookingId,
    qrData,
    issuedAt,
    userdetails,
    activeAmenities,
    convenience,
    gst,
    total,
  };

  return (
    <>
      <div
        style={{
          minHeight: "100vh",
          height: isMobile ? "auto" : "100vh",
          background: "linear-gradient(135deg, #f0f4f8 0%, #e8edf5 100%)",
          fontFamily: "'Segoe UI', sans-serif",
          display: "flex",
          flexDirection: "column",
          overflow: isMobile ? "auto" : "hidden",
          padding: isMobile ? "12px 14px 24px" : "12px 20px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px",
            flexShrink: 0,
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              background: "white",
              border: "1px solid #e2e8f0",
              padding: "7px 14px",
              borderRadius: "100px",
              fontSize: "12px",
              color: "#64748b",
              cursor: "pointer",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            }}
          >
            ← Back
          </button>
          <button
            onClick={toPDF}
            style={{
              background: "white",
              border: "1px solid #e2e8f0",
              padding: "7px 14px",
              borderRadius: "100px",
              fontSize: "12px",
              color: "#64748b",
              cursor: "pointer",
            }}
          >
            🖨️ Print
          </button>
        </div>

        <ReceiptCard
          {...sharedProps}
          isMobile={isMobile}
          toPDF={toPDF}
          navigate={navigate}
        />

        <style>{`@media print { body * { visibility: hidden; } }`}</style>
      </div>

      <ReceiptPDFTemplate {...sharedProps} targetRef={targetRef} />
    </>
  );
}
