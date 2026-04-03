import { QRCodeSVG } from "qrcode.react";

const ReceiptPDFTemplate = ({
  targetRef,
  bookingId,
  qrData,
  issuedAt,
  userdetails,
  activeAmenities,
  convenience,
  gst,
  total,
}) => (
  <div
    ref={targetRef}
    style={{
      position: "fixed",
      top: "-9999px",
      left: "-9999px",
      width: "794px",
      background: "white",
      fontFamily: "'Segoe UI', sans-serif",
      color: "#0f172a",
    }}
  >
    <div
      style={{
        background: "#0f172a",
        padding: "32px 48px 28px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}
    >
      <div>
        <div
          style={{
            fontSize: "11px",
            color: "#94a3b8",
            letterSpacing: "4px",
            textTransform: "uppercase",
            marginBottom: "6px",
          }}
        >
          SlotHub — Smart Parking
        </div>
        <div
          style={{
            fontSize: "28px",
            fontWeight: "900",
            color: "white",
            letterSpacing: "-0.5px",
          }}
        >
          Booking Receipt
        </div>
        <div
          style={{
            marginTop: "16px",
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
            }}
          />
          <span
            style={{
              fontSize: "12px",
              color: "#22c55e",
              fontWeight: "700",
              letterSpacing: "2px",
            }}
          >
            CONFIRMED & PAID
          </span>
        </div>
      </div>
      <div style={{ textAlign: "center" }}>
        <div
          style={{ background: "white", padding: "6px", borderRadius: "8px" }}
        >
          <QRCodeSVG value={qrData} size={90} />
        </div>
        <div
          style={{
            fontSize: "9px",
            color: "#64748b",
            marginTop: "6px",
            letterSpacing: "1px",
          }}
        >
          SCAN TO VERIFY
        </div>
      </div>
    </div>

    <div
      style={{
        background: "#f8fafc",
        borderBottom: "2px dashed #e2e8f0",
        padding: "16px 48px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <div
          style={{
            fontSize: "9px",
            color: "#94a3b8",
            letterSpacing: "3px",
            textTransform: "uppercase",
            marginBottom: "4px",
          }}
        >
          Booking ID
        </div>
        <div
          style={{
            fontSize: "22px",
            fontWeight: "900",
            letterSpacing: "4px",
            color: "#0f172a",
          }}
        >
          {bookingId}
        </div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div
          style={{
            fontSize: "9px",
            color: "#94a3b8",
            letterSpacing: "2px",
            textTransform: "uppercase",
            marginBottom: "4px",
          }}
        >
          Issued On
        </div>
        <div style={{ fontSize: "13px", fontWeight: "600", color: "#0f172a" }}>
          {issuedAt}
        </div>
      </div>
    </div>

    <div style={{ padding: "28px 48px" }}>
      <div
        style={{
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderLeft: "4px solid #0f172a",
          borderRadius: "8px",
          padding: "16px 20px",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            fontSize: "9px",
            color: "#94a3b8",
            letterSpacing: "2px",
            textTransform: "uppercase",
            marginBottom: "6px",
          }}
        >
          Parking Location
        </div>
        <div
          style={{
            fontSize: "18px",
            fontWeight: "800",
            color: "#0f172a",
            marginBottom: "4px",
          }}
        >
          {userdetails?.parkingName || "N/A"}
        </div>
        <div style={{ fontSize: "12px", color: "#64748b" }}>
          📍 {userdetails?.address}
          {userdetails?.city ? `, ${userdetails.city}` : ""}
        </div>
      </div>

      <div style={{ marginBottom: "24px" }}>
        <div
          style={{
            fontSize: "9px",
            color: "#94a3b8",
            letterSpacing: "3px",
            textTransform: "uppercase",
            marginBottom: "12px",
          }}
        >
          Booking Details
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "10px",
          }}
        >
          {[
            {
              label: "Slot",
              value: `Slot ${userdetails?.slot?.label || "N/A"}`,
            },
            { label: "Vehicle", value: userdetails?.vehicle || "N/A" },
            { label: "Date", value: userdetails?.date || "N/A" },
            { label: "From", value: userdetails?.fromTime || "N/A" },
            { label: "To", value: userdetails?.toTime || "N/A" },
            {
              label: "Duration",
              value: userdetails?.duration || "N/A",
              highlight: true,
            },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                padding: "12px 14px",
                background: item.highlight ? "#f0fdf4" : "white",
              }}
            >
              <div
                style={{
                  fontSize: "9px",
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  marginBottom: "5px",
                }}
              >
                {item.label}
              </div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "700",
                  color: item.highlight ? "#16a34a" : "#0f172a",
                }}
              >
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ borderTop: "1px dashed #e2e8f0", margin: "20px 0" }} />

\      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "24px",
          marginBottom: "24px",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "9px",
              color: "#94a3b8",
              letterSpacing: "3px",
              textTransform: "uppercase",
              marginBottom: "12px",
            }}
          >
            Payment Breakdown
          </div>
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
                borderBottom: "1px solid #f1f5f9",
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
              marginTop: "10px",
              padding: "12px 16px",
              background: "#0f172a",
              borderRadius: "8px",
            }}
          >
            <span
              style={{ fontSize: "13px", fontWeight: "700", color: "white" }}
            >
              Total Paid
            </span>
            <span
              style={{ fontSize: "20px", fontWeight: "900", color: "#f97316" }}
            >
              ₹{total}
            </span>
          </div>
        </div>

        <div>
          {activeAmenities.length > 0 && (
            <>
              <div
                style={{
                  fontSize: "9px",
                  color: "#94a3b8",
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                  marginBottom: "12px",
                }}
              >
                Amenities
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "6px",
                  marginBottom: "16px",
                }}
              >
                {activeAmenities.map((a) => (
                  <span
                    key={a}
                    style={{
                      background: "#f0fdf4",
                      color: "#16a34a",
                      border: "1px solid #bbf7d0",
                      fontSize: "11px",
                      fontWeight: "600",
                      padding: "4px 12px",
                      borderRadius: "100px",
                    }}
                  >
                    ✓ {a}
                  </span>
                ))}
              </div>
            </>
          )}
          <div
            style={{
              fontSize: "9px",
              color: "#94a3b8",
              letterSpacing: "3px",
              textTransform: "uppercase",
              marginBottom: "12px",
            }}
          >
            Payment Method
          </div>
          <div
            style={{
              border: "1px solid #bbf7d0",
              background: "#f0fdf4",
              borderRadius: "8px",
              padding: "12px 14px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#22c55e",
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
                PAID VIA
              </div>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: "700",
                  color: "#16a34a",
                }}
              >
                Razorpay • Successful
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      style={{
        background: "#0f172a",
        padding: "16px 48px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <div style={{ fontSize: "16px", fontWeight: "900", color: "white" }}>
          SlotHub 🅿️
        </div>
        <div style={{ fontSize: "10px", color: "#475569", marginTop: "2px" }}>
          Smart Parking System
        </div>
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "10px", color: "#475569" }}>
          This is a system generated receipt
        </div>
        <div style={{ fontSize: "10px", color: "#475569" }}>
          No signature required
        </div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: "11px", color: "#f97316", fontWeight: "600" }}>
          support@SlotHub.in
        </div>
        <div style={{ fontSize: "10px", color: "#475569", marginTop: "2px" }}>
          www.SlotHub.in
        </div>
      </div>
    </div>
  </div>
);

export default ReceiptPDFTemplate;
