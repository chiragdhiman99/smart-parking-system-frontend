import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Search from "./pages/Search";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ParkingDetail from "./pages/ParkingDetail";
import NotFound from "./pages/NotFound";
import { Toaster } from "react-hot-toast";
import DriverDashboard from "./dashboard/driver/DriverDashboard";
import OwnerDashboard from "./dashboard/owner/ownerdashboard";
import HowItWorks from "./pages/Howitworks";
import BookingProcessing from "./pages/booking/Bookingprocessing";
import Payment from "./pages/Payment";
import BookingSuccess from "./pages/booking/Bookingsuccess";
import BookingReceipt from "./pages/booking/Bookingreciept";
import ReviewsPage from "./pages/Reviewssection";
import AdminLogin from "./pages/auth/adminlogin";
import ProtectedAdminRoute from "./pages/auth/protectedadminroute";
import AdminDashboard from "./dashboard/admin/admindashboard";

function App() {
  
  return (
    <>
      <Toaster position="top-center" />
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
    </>
  );
}

export default App;
