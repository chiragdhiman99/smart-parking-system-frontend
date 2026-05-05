import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  MapPin,
  Zap,
  Bike,
  Car,
  Check,
  CreditCard,
  Building2,
  Wallet,
  Smartphone,
  Lock,
  ShieldCheck,
  IndianRupee,
  Star,
} from "lucide-react";

import { io } from "socket.io-client";
const socket = io("https://smart-parking-system-backend-oco6.onrender.com");

const paymentMethods = [
  {
    id: "upi",
    label: "UPI",
    Icon: IndianRupee,
    desc: "Google Pay, PhonePe, Paytm & more",
    iconBg: "bg-purple-100",
    iconText: "text-purple-600",
  },
  {
    id: "card",
    label: "Credit / Debit Card",
    Icon: CreditCard,
    desc: "Visa, Mastercard, RuPay",
    iconBg: "bg-blue-100",
    iconText: "text-blue-600",
  },
  {
    id: "netbanking",
    label: "Net Banking",
    Icon: Building2,
    desc: "All major Indian banks",
    iconBg: "bg-green-100",
    iconText: "text-green-600",
  },
  {
    id: "wallet",
    label: "Mobile Wallet",
    Icon: Wallet,
    desc: "Paytm, Amazon Pay, Mobikwik",
    iconBg: "bg-yellow-100",
    iconText: "text-yellow-600",
  },
];

export default function Payment() {
  const [selectedMethod, setSelectedMethod] = useState("upi");
  const [confirmed, setConfirmed] = useState(false);
  const [userinfo, setUserinfo] = useState({});
  const navigate = useNavigate();

  const location = useLocation();
  const bg = location.state?.bg;
  const userdetails = location.state?.userdetails;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const rawPrice = parseInt(userdetails?.totalPrice?.replace("₹", "") || 0);
  const convenience = 2;
  const gst = Math.round((rawPrice + convenience) * 0.18);
  const total = rawPrice + convenience + gst;

  const amenitiesMap = {
    cctv: "CCTV Surveillance",
    security: "24hr Security",
    evCharging: "EV Charging",
    covered: "Covered Parking",
    wheelchair: "Wheelchair Access",
  };
  const activeAmenities = userdetails?.amenities
    ? Object.entries(userdetails.amenities)
        .filter(([_, val]) => val === true)
        .map(([key]) => amenitiesMap[key] || key)
    : [];

  const token = localStorage.getItem("token");
  const jwtdecode = jwtDecode(token);
  const userid = jwtdecode?.userId;

  useEffect(() => {
    socket.emit("joinRoom", userid);
    socket.on("notification", (message) => {});
    return () => socket.off("notification");
  }, [userid]);

  useEffect(() => {
    axios
      .get(
        `https://smart-parking-system-backend-oco6.onrender.com/api/auth/user/${userid}`,
        { userid },
      )
      .then((res) => {
        setUserinfo(res.data);
      })
      .catch((err) => {
        toast.error("Failed to load user details. Please try again later.");
      });
  }, []);

  console.log("userdetails:", userdetails);
  console.log("total:", total);

  const handlePayment = async () => {
    try {
      const res = await fetch(
        "https://smart-parking-system-backend-oco6.onrender.com/api/payment/create-order",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: total }),
        },
      );
      const data = await res.json();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: "INR",
        name: "SlotHub",
        description: `Slot ${userdetails?.slot?.label} - ${userdetails?.parkingName}`,
        order_id: data.order.id,

        handler: async function (response) {
          const verifyRes = await fetch(
            "https://smart-parking-system-backend-oco6.onrender.com/api/payment/verify",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...response,
                userId: userid,
                ownerId: userdetails?.ownerId,
                username: userinfo.fullName,
                slotnumber: userdetails?.slot?.label,
                parkingname: userdetails?.parkingName,
                date: userdetails?.date,
                time: userdetails?.fromTime + " to " + userdetails?.toTime,
                amount: userdetails?.totalPrice,
              }),
            },
          );
          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            navigate("/booking/success", {
              state: { bg, userdetails },
            });
          }

          axios
            .post(
              "https://smart-parking-system-backend-oco6.onrender.com/api/bookings/create/booking",
              {
                userName: userinfo.fullName,
                userEmail: userinfo.email,
                parkingid: userdetails.parkingid,
                ownerid: userdetails.ownerId,
                userPhone: userinfo.phone,
                slot: userdetails?.slot?.label,
                vehicleNumber: userdetails?.vehicleNumber,
                date: userdetails?.date,
                fromTime: userdetails?.fromTime,
                toTime: userdetails?.toTime,
                amount: userdetails?.totalPrice,
                paymentId: response.razorpay_payment_id,
                paymentStatus: "success",
                bookingStatus: "confirmed",
              },
            )
            .then(() => console.log("Booking created successfully"))
            .catch(() =>
              toast.error("Failed to create booking. Please contact support."),
            );
        },

        prefill: { name: "", email: "", contact: "" },
        theme: { color: "#f97316" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment error:", err);
    }
  };

  const selectedMethodObj = paymentMethods.find((m) => m.id === selectedMethod);

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${bg || "from-orange-50 via-amber-50 to-orange-100"} font-sans px-4 py-8`}
    >
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate("/search")}
          className="flex cursor-pointer items-center gap-2 bg-white text-gray-600 text-sm font-medium px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-shadow mb-6"
        >
          <ArrowLeft size={15} /> Back to Search
        </button>

        <h1 className="text-2xl font-extrabold text-gray-900 mb-6 tracking-tight">
          Complete your <span className="text-orange-500">Booking</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 flex flex-col gap-5">
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center">
                  <MapPin size={14} className="text-amber-600" />
                </div>
                <h2 className="font-bold text-gray-800 text-base">
                  Slot Information
                </h2>
              </div>

              <div
                className={`flex items-center gap-3 bg-gradient-to-r ${bg || "from-orange-50 to-amber-50"} border border-orange-200 rounded-xl p-4 mb-4`}
              >
                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                  {userdetails?.icon || "🏢"}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-base capitalize">
                    {userdetails?.parkingName || "N/A"}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {userdetails?.address}
                    {userdetails?.city ? `, ${userdetails.city}` : ""}
                  </p>
                  <div className="flex gap-2 mt-1">
                    {userdetails?.autoApprove && (
                      <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Zap size={10} /> Instant Confirm
                      </span>
                    )}
                    <span className="bg-orange-100 text-orange-700 text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                      {userdetails?.vehicle === "2-wheeler" ? (
                        <Bike size={10} />
                      ) : (
                        <Car size={10} />
                      )}
                      {userdetails?.vehicle}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  {
                    label: "Slot",
                    value: `Slot ${userdetails?.slot?.label || "N/A"}`,
                  },
                  { label: "Date", value: userdetails?.date || "N/A" },
                  { label: "From", value: userdetails?.fromTime || "N/A" },
                  { label: "To", value: userdetails?.toTime || "N/A" },
                  { label: "Duration", value: userdetails?.duration || "N/A" },
                  {
                    label: "Total Price",
                    value: userdetails?.totalPrice || "N/A",
                    green: true,
                  },
                ].map((item) => (
                  <div key={item.label} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">
                      {item.label}
                    </p>
                    <p
                      className={`text-sm font-bold ${item.green ? "text-green-600" : "text-gray-900"}`}
                    >
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center">
                  <Check size={14} className="text-green-600" />
                </div>
                <h2 className="font-bold text-gray-800 text-base">
                  Amenities & Features
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {activeAmenities.length > 0 ? (
                  activeAmenities.map((a) => (
                    <span
                      key={a}
                      className="bg-green-50 text-green-700 border border-green-200 text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1"
                    >
                      <Check size={10} /> {a}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">No amenities listed</p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
                  <CreditCard size={14} className="text-blue-600" />
                </div>
                <h2 className="font-bold text-gray-800 text-base">
                  Select Payment Method
                </h2>
              </div>
              <div className="flex flex-col gap-3">
                {paymentMethods.map((method) => {
                  const Icon = method.Icon;
                  return (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-200 w-full
                        ${
                          selectedMethod === method.id
                            ? "border-orange-400 bg-orange-50"
                            : "border-gray-200 bg-white hover:border-orange-300"
                        }`}
                    >
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${method.iconBg}`}
                      >
                        <Icon size={18} className={method.iconText} />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 text-sm">
                          {method.label}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {method.desc}
                        </p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedMethod === method.id ? "border-orange-500" : "border-gray-300"}`}
                      >
                        {selectedMethod === method.id && (
                          <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-6">
              <h2 className="font-extrabold text-gray-900 text-lg mb-5">
                Payment Summary
              </h2>

              <div className="flex flex-col gap-1">
                {[
                  {
                    label: "Parking Fee",
                    value: userdetails?.totalPrice || "₹0",
                  },
                  { label: "Duration", value: userdetails?.duration || "N/A" },
                  { label: "Convenience Fee", value: `₹${convenience}` },
                  { label: "GST (18%)", value: `₹${gst}` },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex justify-between py-2.5 border-b border-dashed border-gray-100"
                  >
                    <span className="text-sm text-gray-500">{row.label}</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="h-px bg-gray-200 my-4" />

              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-900 text-base">
                  Total Payable
                </span>
                <span className="font-extrabold text-orange-500 text-2xl">
                  ₹{total}
                </span>
              </div>

              {selectedMethodObj && (
                <div className="mt-4 bg-gray-50 rounded-xl px-4 py-3 flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${selectedMethodObj.iconBg}`}
                  >
                    <selectedMethodObj.Icon
                      size={16}
                      className={selectedMethodObj.iconText}
                    />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">
                      Paying via
                    </p>
                    <p className="text-sm font-semibold text-gray-800">
                      {selectedMethodObj.label}
                    </p>
                  </div>
                </div>
              )}

              <button
                onClick={() => {
                  setConfirmed(true);
                  handlePayment();
                }}
                className="w-full mt-5 bg-gradient-to-r from-orange-500 to-orange-400 text-white font-bold text-base py-4 rounded-xl shadow-lg shadow-orange-200 hover:shadow-orange-300 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Lock size={15} /> Confirm & Pay ₹{total}
              </button>

              <p className="text-center text-xs text-gray-400 mt-3 flex items-center justify-center gap-1">
                <ShieldCheck size={13} /> 100% Secure & Encrypted Payment
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
