import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Toaster } from "react-hot-toast";
import ProtectedAdminRoute from "./pages/auth/protectedadminroute";

const Landing = lazy(() => import("./pages/Landing"));
const Search = lazy(() => import("./pages/Search"));
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const ParkingDetail = lazy(() => import("./pages/ParkingDetail"));
const NotFound = lazy(() => import("./pages/NotFound"));
const DriverDashboard = lazy(
  () => import("./dashboard/driver/DriverDashboard"),
);
const OwnerDashboard = lazy(() => import("./dashboard/owner/ownerdashboard"));
const HowItWorks = lazy(() => import("./pages/Howitworks"));
const BookingProcessing = lazy(
  () => import("./pages/booking/Bookingprocessing"),
);
const Payment = lazy(() => import("./pages/Payment"));
const BookingSuccess = lazy(() => import("./pages/booking/Bookingsuccess"));
const BookingReceipt = lazy(() => import("./pages/booking/Bookingreciept"));
const ReviewsPage = lazy(() => import("./pages/Reviewssection"));
const AdminLogin = lazy(() => import("./pages/auth/adminlogin"));
const AdminDashboard = lazy(() => import("./dashboard/admin/admindashboard"));

function App() {
  return (
    <>
      <Toaster position="top-center" />

      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center h-screen gap-3">
            <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 text-sm">Loading...</p>
          </div>
        }
      >
        {" "}
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/search" element={<Search />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/parking/:id" element={<ParkingDetail />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/driver/dashboard" element={<DriverDashboard />} />
          <Route path="/owner/dashboard" element={<OwnerDashboard />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/processing/booking" element={<BookingProcessing />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/booking/success" element={<BookingSuccess />} />
          <Route path="/booking/receipt" element={<BookingReceipt />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
