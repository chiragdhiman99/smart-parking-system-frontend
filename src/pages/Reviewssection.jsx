import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import toast from "react-hot-toast";

const positions = [
  { top: "20px", left: "1%", width: "22%" },
  { top: "10px", left: "26%", width: "20%" },
  { top: "15px", left: "50%", width: "21%" },
  { top: "20px", left: "74%", width: "24%" },
  { top: "200px", left: "3%", width: "21%" },
  { top: "190px", left: "28%", width: "22%" },
  { top: "205px", left: "54%", width: "20%" },
  { top: "195px", right: "1%", width: "22%" },
  { top: "380px", left: "15%", width: "22%" },
  { top: "370px", left: "42%", width: "21%" },
  { top: "385px", left: "67%", width: "22%" },
];

const floatStyles = [
  "float 4s ease-in-out infinite",
  "float 5s ease-in-out infinite",
  "float 4.5s ease-in-out infinite",
  "float 3.8s ease-in-out infinite",
  "float 5.2s ease-in-out infinite",
  "float 4.2s ease-in-out infinite",
  "float 4.8s ease-in-out infinite",
  "float 3.5s ease-in-out infinite",
  "float 4.6s ease-in-out infinite",
  "float 4s ease-in-out infinite",
  "float 5s ease-in-out infinite",
];

const avatarColors = [
  { bg: "#dcfce7", color: "#166534" },
  { bg: "#dbeafe", color: "#1e40af" },
  { bg: "#ede9fe", color: "#5b21b6" },
  { bg: "#fef9c3", color: "#854d0e" },
  { bg: "#fce7f3", color: "#9d174d" },
  { bg: "#d1fae5", color: "#065f46" },
  { bg: "#ffedd5", color: "#9a3412" },
  { bg: "#dcfce7", color: "#166534" },
  { bg: "#dbeafe", color: "#1e40af" },
  { bg: "#ede9fe", color: "#5b21b6" },
  { bg: "#fef9c3", color: "#854d0e" },
];

const getInitials = (name) => {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const ReviewCard = ({ review, i, isMobile }) => {
  const av = avatarColors[i] || avatarColors[0];
  const pos = positions[i] || positions[0];

  const cardContent = (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "9px",
          marginBottom: "4px",
        }}
      >
        <div
          style={{
            width: "34px",
            height: "34px",
            borderRadius: "50%",
            background: av.bg,
            color: av.color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px",
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {getInitials(review.userName)}
        </div>
        <div>
          <div style={{ fontSize: "13px", fontWeight: 700, color: "#111" }}>
            {review.userName}
          </div>
          <div style={{ fontSize: "10px", color: "#888" }}>
            {review.role || "Driver"}
          </div>
        </div>
      </div>
      <div
        style={{
          color: "#f59e0b",
          fontSize: "12px",
          margin: "7px 0 6px",
          letterSpacing: "1px",
        }}
      >
        {"★".repeat(review.rating)}
        {"☆".repeat(5 - review.rating)}
      </div>
      <p
        style={{ fontSize: "12px", color: "#555", lineHeight: 1.6, margin: 0 }}
      >
        "{review.comment}"
      </p>
      <div
        style={{
          fontSize: "10px",
          color: "#16a34a",
          fontWeight: 600,
          marginTop: "8px",
        }}
      >
        ✓ Verified
      </div>
    </>
  );

  if (isMobile) {
    return (
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          border: "1px solid #e8f5e9",
          padding: "16px 18px",
        }}
      >
        {cardContent}
      </div>
    );
  }

  return (
    <div className="review-card" style={{ ...pos, animation: floatStyles[i] }}>
      {cardContent}
    </div>
  );
};

const ReviewsPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const [reviews, setReviews] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/reviews")
      .then((res) => setReviews(res.data.reviews))
      .catch(() =>
        toast.error("Failed to load reviews. Please try again later."),
      );
  }, []);

  return (
    <div
      style={{
        background: "#f8fdf8",
        minHeight: "100vh",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
        .review-card {
          position: absolute;
          background: white;
          border-radius: 16px;
          border: 1px solid #e8f5e9;
          padding: 16px 18px;
          cursor: default;
          will-change: transform;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .review-card:hover {
          border-color: #86efac;
          box-shadow: 0 8px 24px rgba(34,197,94,0.1);
          animation-play-state: paused;
        }
      `}</style>

      <Navbar />

      <div
        style={{
          textAlign: "center",
          padding: isMobile ? "40px 20px 24px" : "52px 40px 24px",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: "20px",
            padding: "6px 14px",
            fontSize: "12px",
            color: "#16a34a",
            fontWeight: 600,
            marginBottom: "18px",
          }}
        >
          <div
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: "#22c55e",
            }}
          />
          Real User Reviews
        </div>

        <h1
          style={{
            fontSize: isMobile ? "28px" : "42px",
            fontWeight: 800,
            color: "#111",
            lineHeight: 1.15,
            marginBottom: "10px",
          }}
        >
          What Our <span style={{ color: "#22c55e" }}>Drivers</span>
          <br />
          Are Saying
        </h1>

        <p
          style={{
            fontSize: isMobile ? "13px" : "15px",
            color: "#666",
            maxWidth: "480px",
            margin: "0 auto 20px",
            lineHeight: 1.6,
          }}
        >
          Trusted by thousands of drivers across the city. Here's what they say
          about SlotHub.
        </p>

        <div
          style={{
            display: "flex",
            gap: isMobile ? "16px" : "32px",
            justifyContent: "center",
            marginBottom: "36px",
            flexWrap: "wrap",
          }}
        >
          {[
            ["4.9", "Avg Rating"],
            ["2.4k+", "Total Reviews"],
            ["98%", "Satisfaction"],
          ].map(([num, label], i) => (
            <div
              key={i}
              style={{
                textAlign: "center",
                padding: i === 1 ? `0 ${isMobile ? "16px" : "32px"}` : "0",
                borderLeft: i === 1 ? "1px solid #e2e8f0" : "none",
                borderRight: i === 1 ? "1px solid #e2e8f0" : "none",
              }}
            >
              <div
                style={{
                  fontSize: isMobile ? "20px" : "24px",
                  fontWeight: 800,
                  color: "#22c55e",
                }}
              >
                {num}
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "#888",
                  fontWeight: 500,
                  marginTop: "2px",
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {isMobile ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: " 1fr",
            gap: "12px",
            padding: "0 16px 40px",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          {reviews.slice(0, 11).map((review, i) => (
            <ReviewCard
              key={review._id}
              review={review}
              i={i}
              isMobile={true}
            />
          ))}
        </div>
      ) : (
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "640px",
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 20px",
          }}
        >
          {reviews.slice(0, 11).map((review, i) => (
            <ReviewCard
              key={review._id}
              review={review}
              i={i}
              isMobile={false}
            />
          ))}
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ReviewsPage;
