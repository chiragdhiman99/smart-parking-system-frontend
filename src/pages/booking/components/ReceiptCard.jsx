import { QRCodeSVG } from "qrcode.react";

const InfoCell = ({ icon, label, value, green, isMobile }) => (
  <div
    style={{
      background: "#f8fafc",
      borderRadius: "10px",
      padding: isMobile ? "10px 12px" : "10px 14px",
      border: "1px solid #f1f5f9",
    }}
  >
    <div
      style={{
        fontSize: "9px",
        color: "#94a3b8",
        textTransform: "uppercase",
        letterSpacing: "1.2px",
        marginBottom: "4px",
      }}
    >
      {icon} {label}
    </div>
    <div
      style={{
        fontSize: isMobile ? "12px" : "13px",
        fontWeight: "700",
        color: green ? "#16a34a" : "#0f172a",
      }}
    >
      {value}
    </div>
  </div>
);

const ReceiptCard = ({
  bookingId,
  qrData,
  issuedAt,
  userdetails,
  activeAmenities,
  convenience,
  gst,
  total,
  isMobile,
  toPDF,
  navigate,
}) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "1fr 340px",
      gap: "14px",
      flex: isMobile ? "none" : 1,
      minHeight: 0,
    }}
  >
    <div
      style={{
        background: "white",
        borderRadius: "18px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
      }}
    >
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          padding: isMobile ? "16px 20px 18px" : "18px 28px 20px",
          position: "relative",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            right: "-20px",
            top: "-20px",
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.03)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: "40px",
            bottom: "-40px",
            width: "90px",
            height: "90px",
            borderRadius: "50%",
            background: "rgba(249,115,22,0.10)",
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "relative",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "9px",
                color: "#475569",
                letterSpacing: "3px",
                textTransform: "uppercase",
                marginBottom: "4px",
              }}
            >
              SlotHub
            </div>
            <div
              style={{
                fontSize: isMobile ? "18px" : "20px",
                fontWeight: "900",
                color: "white",
                lineHeight: "1.2",
              }}
            >
              Booking Receipt
            </div>
          </div>
          <div
            style={{
              background: "rgba(34,197,94,0.15)",
              border: "1px solid rgba(34,197,94,0.3)",
              borderRadius: "100px",
              padding: "6px 12px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <div
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: "#22c55e",
                boxShadow: "0 0 6px #22c55e",
              }}
            />
            <span
              style={{ fontSize: "11px", color: "#22c55e", fontWeight: "700" }}
            >
              CONFIRMED
            </span>
          </div>
        </div>

        <div
          style={{
            marginTop: "12px",
            background: "rgba(255,255,255,0.06)",
            borderRadius: "10px",
            padding: "10px 14px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "9px",
                color: "#64748b",
                letterSpacing: "2px",
                textTransform: "uppercase",
              }}
            >
              Booking ID
            </div>
            <div
              style={{
                fontSize: isMobile ? "15px" : "18px",
                fontWeight: "900",
                color: "white",
                letterSpacing: "2px",
                marginTop: "3px",
              }}
            >
              {bookingId}
            </div>
          </div>
          <div
            style={{ background: "white", padding: "6px", borderRadius: "8px" }}
          >
            <QRCodeSVG value={qrData} size={30} />
          </div>
        </div>
      </div>

      <div
        style={{
          position: "relative",
          height: "16px",
          background: "white",
          flexShrink: 0,
        }}
      >
        <svg
          viewBox="0 0 800 16"
          preserveAspectRatio="none"
          style={{
            position: "absolute",
            top: "-16px",
            left: 0,
            width: "100%",
            height: "16px",
          }}
        >
          <path
            d="M0,0 L0,16 L800,16 L800,0 L785,8 L770,0 L755,8 L740,0 L725,8 L710,0 L695,8 L680,0 L665,8 L650,0 L635,8 L620,0 L605,8 L590,0 L575,8 L560,0 L545,8 L530,0 L515,8 L500,0 L485,8 L470,0 L455,8 L440,0 L425,8 L410,0 L395,8 L380,0 L365,8 L350,0 L335,8 L320,0 L305,8 L290,0 L275,8 L260,0 L245,8 L230,0 L215,8 L200,0 L185,8 L170,0 L155,8 L140,0 L125,8 L110,0 L95,8 L80,0 L65,8 L50,0 L35,8 L20,0 L0,0Z"
            fill="white"
          />
        </svg>
        <div
          style={{
            position: "absolute",
            left: "-10px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            background: "#e8edf5",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: "-10px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            background: "#e8edf5",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "16px",
            right: "16px",
            borderTop: "1.5px dashed #e2e8f0",
          }}
        />
      </div>

      <div
        style={{
          padding: isMobile ? "8px 20px 14px" : "8px 28px 14px",
          flex: isMobile ? "none" : 1,
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          minHeight: 0,
        }}
      >
        <div
          style={{
            background: "#f8fafc",
            borderRadius: "12px",
            padding: "10px 14px",
            border: "1px solid #f1f5f9",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              fontSize: "9px",
              color: "#94a3b8",
              letterSpacing: "2px",
              textTransform: "uppercase",
              marginBottom: "4px",
            }}
          >
            Parking Location
          </div>
          <div
            style={{
              fontSize: isMobile ? "14px" : "15px",
              fontWeight: "800",
              color: "#0f172a",
              marginBottom: "2px",
              textTransform: "capitalize",
            }}
          >
            {userdetails?.parkingName || "N/A"}
          </div>
          <div style={{ fontSize: "12px", color: "#64748b" }}>
            📍 {userdetails?.address}
            {userdetails?.city ? `, ${userdetails.city}` : ""}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: "8px",
            flexShrink: 0,
          }}
        >
          <InfoCell
            icon="🎫"
            label="Slot"
            value={`Slot ${userdetails?.slot?.label || "N/A"}`}
            isMobile={isMobile}
          />
          <InfoCell
            icon="🚗"
            label="Vehicle"
            value={userdetails?.vehicle || "N/A"}
            isMobile={isMobile}
          />
          <InfoCell
            icon="📅"
            label="Date"
            value={userdetails?.date || "N/A"}
            isMobile={isMobile}
          />
          <InfoCell
            icon="🕐"
            label="From"
            value={userdetails?.fromTime || "N/A"}
            isMobile={isMobile}
          />
          <InfoCell
            icon="🕑"
            label="To"
            value={userdetails?.toTime || "N/A"}
            isMobile={isMobile}
          />
          <InfoCell
            icon="⏱"
            label="Duration"
            value={userdetails?.duration || "N/A"}
            green
            isMobile={isMobile}
          />
        </div>

        {activeAmenities.length > 0 && (
          <div style={{ flexShrink: 0 }}>
            <div
              style={{
                fontSize: "9px",
                color: "#94a3b8",
                letterSpacing: "2px",
                textTransform: "uppercase",
                marginBottom: "6px",
              }}
            >
              Amenities
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {activeAmenities.map((a) => (
                <span
                  key={a}
                  style={{
                    background: "#f0fdf4",
                    color: "#16a34a",
                    border: "1px solid #bbf7d0",
                    fontSize: "11px",
                    fontWeight: "600",
                    padding: "3px 10px",
                    borderRadius: "100px",
                  }}
                >
                  ✓ {a}
                </span>
              ))}
            </div>
          </div>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "4px",
            padding: "8px 0",
            borderTop: "1px dashed #e2e8f0",
            marginTop: isMobile ? "4px" : "auto",
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: "10px", color: "#94a3b8" }}>
            🕐 Issued: {issuedAt}
          </span>
          <span
            style={{ fontSize: "10px", color: "#22c55e", fontWeight: "700" }}
          >
            ✓ Paid via Razorpay
          </span>
        </div>
      </div>

      <div
        style={{
          background: "linear-gradient(135deg, #0f172a, #1e293b)",
          padding: isMobile ? "10px 20px" : "12px 28px",
          flexShrink: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div
            style={{ fontSize: "9px", color: "#475569", marginBottom: "1px" }}
          >
            Powered by
          </div>
          <div style={{ fontSize: "14px", fontWeight: "900", color: "white" }}>
            SlotHub 🅿️
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div
            style={{ fontSize: "9px", color: "#475569", marginBottom: "1px" }}
          >
            Need help?
          </div>
          <div
            style={{ fontSize: "11px", color: "#f97316", fontWeight: "600" }}
          >
            support@slothub.in
          </div>
        </div>
      </div>
    </div>

    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        minHeight: 0,
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "18px",
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #0f172a, #1e293b)",
            padding: "14px 20px",
          }}
        >
          <div
            style={{
              fontSize: "9px",
              color: "#475569",
              letterSpacing: "2px",
              textTransform: "uppercase",
              marginBottom: "2px",
            }}
          >
            Payment
          </div>
          <div style={{ fontSize: "16px", fontWeight: "900", color: "white" }}>
            Breakdown
          </div>
        </div>
        <div style={{ padding: "14px 18px" }}>
          {[
            { label: "Parking Fee", value: userdetails?.totalPrice || "₹0" },
            { label: "Convenience Fee", value: `₹${convenience}` },
            { label: "GST (18%)", value: `₹${gst}` },
          ].map((row) => (
            <div
              key={row.label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "8px 0",
                borderBottom: "1px dashed #e2e8f0",
              }}
            >
              <span style={{ fontSize: "13px", color: "#64748b" }}>
                {row.label}
              </span>
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#0f172a",
                }}
              >
                {row.value}
              </span>
            </div>
          ))}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "12px",
              padding: "12px 16px",
              background: "linear-gradient(135deg, #0f172a, #1e293b)",
              borderRadius: "12px",
            }}
          >
            <span
              style={{ fontSize: "14px", fontWeight: "700", color: "white" }}
            >
              Total Paid
            </span>
            <span
              style={{ fontSize: "24px", fontWeight: "900", color: "#f97316" }}
            >
              ₹{total}
            </span>
          </div>

          <div
            style={{
              marginTop: "10px",
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              borderRadius: "10px",
              padding: "10px 14px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#22c55e",
                boxShadow: "0 0 6px #22c55e",
                flexShrink: 0,
              }}
            />
            <div>
              <div
                style={{
                  fontSize: "9px",
                  color: "#94a3b8",
                  letterSpacing: "1px",
                }}
              >
                PAYMENT METHOD
              </div>
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  color: "#16a34a",
                }}
              >
                Razorpay • Paid Successfully
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
        <button
          onClick={() => navigate("/search")}
          className="hover:scale-105 transition-all duration-200"
          style={{
            flex: 1,
            padding: "12px 8px",
            background: "white",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            fontSize: "12px",
            fontWeight: "700",
            color: "#0f172a",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          🔍 More Parking
        </button>
        <button
          onClick={toPDF}
          className="hover:scale-105 transition-all duration-200"
          style={{
            flex: 1,
            padding: "12px 8px",
            background: "linear-gradient(135deg, #f97316, #ea580c)",
            border: "none",
            borderRadius: "12px",
            fontSize: "12px",
            fontWeight: "700",
            color: "white",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(249,115,22,0.35)",
          }}
        >
          🖨️ Print
        </button>
      </div>
    </div>
  </div>
);

export default ReceiptCard;
