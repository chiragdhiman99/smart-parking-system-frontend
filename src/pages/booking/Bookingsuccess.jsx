import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";

const PARTICLES_TOP = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${5 + i * 5.2}%`,
  delay: `${(i * 0.09).toFixed(2)}s`,
  color: ["#22c55e", "#f97316", "#facc15", "#3b82f6", "#ec4899", "#a855f7"][
    i % 6
  ],
  size: `${8 + (i % 4) * 5}px`,
  shape: i % 3,
}));

const PARTICLES_BOTTOM = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  left: `${8 + i * 6.5}%`,
  delay: `${0.3 + i * 0.1}s`,
  color: ["#f97316", "#22c55e", "#a855f7", "#facc15", "#3b82f6", "#ec4899"][
    i % 6
  ],
  size: `${7 + (i % 3) * 6}px`,
  shape: (i + 1) % 3,
}));

export default function BookingSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { bg, userdetails } = location.state || {};

  const [phase, setPhase] = useState(0);
  const [countdown, setCountdown] = useState(4);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 100);
    const t2 = setTimeout(() => setPhase(2), 700);
    const t3 = setTimeout(() => setPhase(3), 1400);
    const t4 = setTimeout(() => setPhase(4), 2000);
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (phase < 4) return;
    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(interval);
          navigate("/booking/receipt", { state: { bg, userdetails } });
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phase]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        position: "relative",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(34,197,94,0.15) 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          animation: "pulse-orb 2s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          animation: "pulse-orb 3s ease-in-out infinite reverse",
        }}
      />

      {PARTICLES_TOP.map((p) => (
        <div
          key={`top-${p.id}`}
          style={{
            position: "absolute",
            left: p.left,
            top: "-20px",
            width: p.size,
            height:
              p.shape === 2
                ? p.size
                : p.shape === 1
                  ? `${parseInt(p.size) * 0.6}px`
                  : p.size,
            background: p.color,
            borderRadius: p.shape === 0 ? "50%" : p.shape === 1 ? "2px" : "0",
            transform: p.shape === 2 ? "rotate(45deg)" : "none",
            opacity: phase >= 2 ? 1 : 0,
            animation:
              phase >= 2
                ? `fall-down 2.5s ${p.delay} ease-in forwards`
                : "none",
            boxShadow: `0 0 8px ${p.color}88`,
            zIndex: 10,
          }}
        />
      ))}

      {PARTICLES_BOTTOM.map((p) => (
        <div
          key={`bot-${p.id}`}
          style={{
            position: "absolute",
            left: p.left,
            bottom: "-20px",
            width: p.size,
            height: p.shape === 1 ? `${parseInt(p.size) * 0.6}px` : p.size,
            background: p.color,
            borderRadius: p.shape === 0 ? "50%" : p.shape === 1 ? "2px" : "0",
            transform: p.shape === 2 ? "rotate(45deg)" : "none",
            opacity: phase >= 2 ? 1 : 0,
            animation:
              phase >= 2
                ? `shoot-up 2.5s ${p.delay} ease-out forwards`
                : "none",
            boxShadow: `0 0 8px ${p.color}88`,
            zIndex: 10,
          }}
        />
      ))}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0px",
          zIndex: 20,
          opacity: phase >= 1 ? 1 : 0,
          transform:
            phase >= 1
              ? "scale(1) translateY(0)"
              : "scale(0.8) translateY(30px)",
          transition: "all 0.6s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        <div
          style={{
            position: "relative",
            marginBottom: "8px",
            animation:
              phase >= 3
                ? "character-bounce 0.8s ease-in-out infinite alternate"
                : "none",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "28px",
              left: "-34px",
              width: "32px",
              height: "10px",
              background: "#fbbf24",
              borderRadius: "5px",
              transform: phase >= 3 ? "rotate(-50deg)" : "rotate(-10deg)",
              transition: "transform 0.5s ease",
              transformOrigin: "right center",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "28px",
              right: "-34px",
              width: "32px",
              height: "10px",
              background: "#fbbf24",
              borderRadius: "5px",
              transform: phase >= 3 ? "rotate(50deg)" : "rotate(10deg)",
              transition: "transform 0.5s ease",
              transformOrigin: "left center",
            }}
          />

          <div
            style={{
              width: "70px",
              height: "80px",
              background: "linear-gradient(180deg, #22c55e 0%, #16a34a 100%)",
              borderRadius: "18px 18px 14px 14px",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              paddingBottom: "4px",
              boxShadow: "0 8px 32px rgba(34,197,94,0.4)",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-44px",
                width: "52px",
                height: "52px",
                background: "#fbbf24",
                borderRadius: "50%",
                boxShadow: "0 4px 16px rgba(251,191,36,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
                <div
                  style={{
                    width: "8px",
                    height: phase >= 3 ? "5px" : "8px",
                    background: "#1e1b4b",
                    borderRadius: "50%",
                    transition: "height 0.3s ease",
                  }}
                />
                <div
                  style={{
                    width: "8px",
                    height: phase >= 3 ? "5px" : "8px",
                    background: "#1e1b4b",
                    borderRadius: "50%",
                    transition: "height 0.3s ease",
                  }}
                />
              </div>
              <div
                style={{
                  width: "22px",
                  height: "10px",
                  borderBottom: "3px solid #1e1b4b",
                  borderRadius: "0 0 12px 12px",
                  marginTop: "-4px",
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <div
                style={{
                  width: "16px",
                  height: "22px",
                  background: "#16a34a",
                  borderRadius: "0 0 8px 8px",
                  animation:
                    phase >= 3
                      ? "leg-left 0.6s ease-in-out infinite alternate"
                      : "none",
                }}
              />
              <div
                style={{
                  width: "16px",
                  height: "22px",
                  background: "#16a34a",
                  borderRadius: "0 0 8px 8px",
                  animation:
                    phase >= 3
                      ? "leg-right 0.6s ease-in-out infinite alternate"
                      : "none",
                }}
              />
            </div>
          </div>

          {phase >= 3 &&
            ["⭐", "✨", "🎉", "⚡"].map((emoji, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  fontSize: "18px",
                  top: `${[-20, -10, 10, 0][i]}px`,
                  left: `${[-40, 80, -50, 85][i]}px`,
                  animation: `star-pulse 1s ${i * 0.2}s ease-in-out infinite alternate`,
                }}
              >
                {emoji}
              </div>
            ))}
        </div>

        <div
          style={{
            width: "90px",
            height: "90px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #22c55e, #16a34a)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow:
              "0 0 40px rgba(34,197,94,0.6), 0 0 80px rgba(34,197,94,0.2)",
            marginBottom: "24px",
            marginTop: "20px",
            opacity: phase >= 2 ? 1 : 0,
            transform: phase >= 2 ? "scale(1)" : "scale(0)",
            transition: "all 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.3s",
            animation:
              phase >= 3 ? "ring-pulse 1.5s ease-in-out infinite" : "none",
          }}
        >
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
            <path
              d="M8 22L18 32L36 12"
              stroke="white"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="50"
              strokeDashoffset={phase >= 2 ? "0" : "50"}
              style={{ transition: "stroke-dashoffset 0.6s ease 0.5s" }}
            />
          </svg>
        </div>

        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div
            style={{
              fontSize: "13px",
              fontWeight: "700",
              letterSpacing: "4px",
              color: "#22c55e",
              textTransform: "uppercase",
              marginBottom: "8px",
              opacity: phase >= 3 ? 1 : 0,
              transform: phase >= 3 ? "translateY(0)" : "translateY(10px)",
              transition: "all 0.5s ease 0.2s",
            }}
          >
            Payment Successful
          </div>

          <div
            style={{
              fontSize: "36px",
              fontWeight: "900",
              color: "white",
              lineHeight: "1.1",
              marginBottom: "10px",
              opacity: phase >= 3 ? 1 : 0,
              transform: phase >= 3 ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.5s ease 0.3s",
            }}
          >
            Booking
            <br />
            <span
              style={{
                background: "linear-gradient(90deg, #22c55e, #f97316)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Confirmed! 🎉
            </span>
          </div>

          <div
            style={{
              fontSize: "15px",
              color: "#94a3b8",
              fontWeight: "500",
              opacity: phase >= 4 ? 1 : 0,
              transform: phase >= 4 ? "translateY(0)" : "translateY(10px)",
              transition: "all 0.5s ease",
            }}
          >
            {userdetails?.parkingName || "Your parking"} · Slot{" "}
            {userdetails?.slot?.label || "—"}
          </div>
        </div>

        {phase >= 4 && (
          <div
            style={{
              width: "220px",
              opacity: 1,
              animation: "fade-in 0.4s ease",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <span style={{ color: "#64748b", fontSize: "12px" }}>
                Taking you to receipt...
              </span>
              <span
                style={{
                  color: "#f97316",
                  fontSize: "12px",
                  fontWeight: "700",
                }}
              >
                {countdown}s
              </span>
            </div>
            <div
              style={{
                height: "4px",
                background: "#1e293b",
                borderRadius: "2px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  background: "linear-gradient(90deg, #22c55e, #f97316)",
                  borderRadius: "2px",
                  width: `${(countdown / 4) * 100}%`,
                  transition: "width 1s linear",
                }}
              />
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fall-down {
          0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(540deg); opacity: 0; }
        }
        @keyframes shoot-up {
          0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(-110vh) rotate(-540deg); opacity: 0; }
        }
        @keyframes pulse-orb {
          0%, 100% { transform: translate(-50%,-50%) scale(1); }
          50%       { transform: translate(-50%,-50%) scale(1.15); }
        }
        @keyframes ring-pulse {
          0%, 100% { box-shadow: 0 0 40px rgba(34,197,94,0.6), 0 0 80px rgba(34,197,94,0.2); }
          50%       { box-shadow: 0 0 60px rgba(34,197,94,0.9), 0 0 120px rgba(34,197,94,0.4); }
        }
        @keyframes character-bounce {
          0%   { transform: translateY(0px); }
          100% { transform: translateY(-10px); }
        }
        @keyframes leg-left {
          0%   { transform: rotate(-15deg); }
          100% { transform: rotate(15deg); }
        }
        @keyframes leg-right {
          0%   { transform: rotate(15deg); }
          100% { transform: rotate(-15deg); }
        }
        @keyframes star-pulse {
          0%   { transform: scale(0.8) rotate(-10deg); opacity: 0.6; }
          100% { transform: scale(1.3) rotate(10deg); opacity: 1; }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
