import { useEffect, useState } from "react";
import { useLocation } from "react-router";

const steps = [
  "Securing your slot...",
  "Verifying availability...",
  "Confirming booking...",
];

export default function BookingProcessing() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 700);
    return () => clearInterval(interval);
  }, []);

  const location = useLocation();
  const bg = location.state?.bg;
  

  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-gradient-to-br ${bg || "from-green-100 to-green-200"}`}
    >
      {" "}
      <div style={styles.card}>
        <div style={styles.spinnerWrapper}>
          <div style={styles.outerRing} />
          <div style={styles.innerRing} />
          <div style={styles.carIcon}>🚗</div>
        </div>

        <h2 style={styles.title}>Processing...</h2>
        <p style={styles.subtitle} key={currentStep}>
          {steps[currentStep]}
        </p>

        <div style={styles.dotsRow}>
          {steps.map((_, i) => (
            <div
              key={i}
              style={{
                ...styles.dot,
                background: i <= currentStep ? "#22c55e" : "#d1fae5",
                transform: i === currentStep ? "scale(1.4)" : "scale(1)",
              }}
            />
          ))}
        </div>
      </div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');

        @keyframes spin-outer {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes spin-inner {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.3); }
          50%       { box-shadow: 0 0 0 16px rgba(34,197,94,0); }
        }

        .processing-subtitle {
          animation: fadeSlideUp 0.4s ease forwards;
        }
      `}</style>
    </div>
  );
}

const styles = {
  overlay: {
    fontFamily: "'Nunito', sans-serif",
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    background: "#ffffff",
    borderRadius: "28px",
    padding: "52px 48px 44px",
    textAlign: "center",
    boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
    width: "360px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
  },
  spinnerWrapper: {
    position: "relative",
    width: "96px",
    height: "96px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "8px",
  },
  outerRing: {
    position: "absolute",
    inset: 0,
    borderRadius: "50%",
    border: "4px solid transparent",
    borderTopColor: "#22c55e",
    borderRightColor: "#22c55e",
    animation: "spin-outer 1s linear infinite",
    boxShadow: "0 0 0 0 rgba(34,197,94,0.3)",
  },
  innerRing: {
    position: "absolute",
    inset: "12px",
    borderRadius: "50%",
    border: "3px solid transparent",
    borderBottomColor: "#86efac",
    borderLeftColor: "#86efac",
    animation: "spin-inner 0.8s linear infinite",
  },
  carIcon: {
    fontSize: "28px",
    position: "relative",
    zIndex: 1,
    animation: "pulse-glow 1.5s ease-in-out infinite",
  },
  title: {
    fontSize: "22px",
    fontWeight: "800",
    color: "#14532d",
    margin: 0,
    letterSpacing: "-0.3px",
  },
  subtitle: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#16a34a",
    margin: 0,
    animation: "fadeSlideUp 0.4s ease forwards",
  },
  dotsRow: {
    display: "flex",
    gap: "8px",
    marginTop: "8px",
  },
  dot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    transition: "all 0.3s ease",
  },
};
