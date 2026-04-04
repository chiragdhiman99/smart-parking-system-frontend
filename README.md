<div align="center">

<img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
<img src="https://img.shields.io/badge/Vite-7.3-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
<img src="https://img.shields.io/badge/TailwindCSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
<img src="https://img.shields.io/badge/Deployed-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" />

<br/><br/>

```
 ___  _       _     _   _       _     
/ __|| |  ___| |_  | | | |_   _| |__  
\__ \| | / _ \ __| | |_| | | | | '_ \ 
|___/|_| \___/\__|  \___/|_|_|_|_.__/ 
```

# 🅿️ SlotHub — Smart Parking System

### *Find. Book. Park. Repeat.*

**A full-stack smart parking platform built with React + Node.js**  
Real-time slot booking | Multi-role dashboards | Google OAuth | Razorpay Payments

<br/>

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Visit_SlotHub-22c55e?style=for-the-badge)](https://smart-parking-system-frontend-kappa.vercel.app)
[![Backend API](https://img.shields.io/badge/⚡_Backend_API-Render-46e3b7?style=for-the-badge)](https://smart-parking-system-backend-oco6.onrender.com)

</div>

---

## 📸 Overview

SlotHub is a production-ready smart parking management system that connects **drivers**, **parking owners**, and **admins** through a seamless, role-based platform. Built with a focus on real-world usability, performance optimization, and clean architecture.

---

## ✨ Features at a Glance

| Feature | Description |
|---|---|
| 🔐 **Auth System** | JWT + Google OAuth 2.0 with role-based access |
| 🅿️ **Slot Booking** | Real-time parking slot search & booking |
| 💳 **Payments** | Razorpay payment gateway integration |
| 🗺️ **Maps** | Interactive maps with Leaflet.js |
| 📊 **Dashboards** | Separate dashboards for Driver, Owner & Admin |
| 📄 **PDF Receipts** | Auto-generated booking receipts |
| 📧 **Email Alerts** | Nodemailer booking confirmation emails |
| 📱 **Responsive** | Fully mobile-first responsive design |
| ⚡ **Optimized** | Lazy loading + code splitting for fast loads |
| 🔒 **Protected Routes** | Role-based route protection |

---

## 🏗️ Architecture & Roles

```
SlotHub
├── 👤 Driver
│   ├── Browse & search parking locations
│   ├── View slot availability on map
│   ├── Book slots with Razorpay payment
│   ├── Download PDF booking receipt
│   └── View booking history
│
├── 🏢 Owner
│   ├── Register & manage parking locations
│   ├── Set slot pricing & availability
│   ├── View bookings & revenue analytics
│   └── Manage profile
│
└── 🛡️ Admin
    ├── View all users, owners & bookings
    ├── Monitor platform revenue
    ├── Manage parking locations
    └── View analytics & trends
```

---

## 🛠️ Tech Stack

### Frontend
```
React 18          → UI Framework
Vite 7.3          → Build Tool & Dev Server
Tailwind CSS 3    → Utility-First Styling
Framer Motion     → Animations & Transitions
React Router v6   → Client-Side Routing
Axios             → HTTP Client
Recharts          → Data Visualization
Leaflet.js        → Interactive Maps
React-to-PDF      → PDF Receipt Generation
React Hot Toast   → Notifications
Lucide React      → Icon Library
JWT Decode        → Token Parsing
```

### Backend *(separate repo)*
```
Node.js + Express → Server
MongoDB + Mongoose → Database
Passport.js       → Google OAuth 2.0
Razorpay          → Payment Gateway
Nodemailer        → Email Service
bcryptjs          → Password Hashing
JSON Web Token    → Authentication
```

---

## ⚡ Performance Optimizations

This project was heavily optimized for production performance:

### Code Splitting & Lazy Loading
Every route is **lazy loaded** — initial bundle is ~400KB instead of 2MB+:

```jsx
// All routes use React.lazy()
const DriverDashboard = lazy(() => import("./dashboard/driver/DriverDashboard"));
const OwnerDashboard  = lazy(() => import("./dashboard/owner/ownerdashboard"));
const AdminDashboard  = lazy(() => import("./dashboard/admin/admindashboard"));
const Payment         = lazy(() => import("./pages/Payment"));
const ParkingDetail   = lazy(() => import("./pages/ParkingDetail"));
// ...and all other routes
```

### Manual Chunk Splitting (vite.config.js)
Heavy vendor libraries are split into separate cached chunks:

```js
manualChunks: {
  'react-vendor':     ['react', 'react-dom', 'react-router-dom'],
  'chart-vendor':     ['recharts'],
  'map-vendor':       ['leaflet', 'react-leaflet'],
  'animation-vendor': ['framer-motion'],
  'pdf-vendor':       ['react-to-pdf', 'jspdf'],
}
```

### Build Result
| Chunk | Size | Loads When |
|---|---|---|
| `react-vendor` | 48 kB | Always (cached) |
| `chart-vendor` | 372 kB | Admin/Owner dashboard only |
| `map-vendor` | 153 kB | Parking detail page only |
| `pdf-vendor` | 592 kB | Receipt page only |
| Initial JS | ~197 kB | First load |

> 💡 **Result**: Users only download what they need, when they need it.

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/chiragdhiman99/smart-parking-system-frontend
cd smart-parking-system-frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### Environment Variables

```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GOOGLE_MAPS_KEY=your_google_maps_api_key
```

### Run Locally

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

---

## 📁 Project Structure

```
src/
├── pages/
│   ├── Landing.jsx          # Home page
│   ├── Search.jsx           # Search parking
│   ├── ParkingDetail.jsx    # Slot detail + map
│   ├── Payment.jsx          # Razorpay checkout
│   ├── Howitworks.jsx       # Info page
│   ├── Reviewssection.jsx   # Reviews
│   └── auth/
│       ├── Login.jsx        # User login
│       ├── Register.jsx     # User register
│       ├── adminlogin.jsx   # Admin login
│       └── protectedadminroute.jsx
│
├── dashboard/
│   ├── driver/
│   │   └── DriverDashboard.jsx
│   ├── owner/
│   │   ├── ownerdashboard.jsx
│   │   └── components/
│   │       └── OwnerAnalyticsAndProfile.jsx
│   └── admin/
│       ├── admindashboard.jsx
│       └── components/
│           └── AdminOverview.jsx
│
├── pages/booking/
│   ├── Bookingprocessing.jsx
│   ├── Bookingsuccess.jsx
│   └── Bookingreciept.jsx
│
├── App.jsx                  # Routes + Suspense
└── main.jsx                 # Entry point
```

---

## 🔐 Authentication Flow

```
User clicks "Continue with Google"
        ↓
Frontend → Backend /api/auth/google
        ↓
Google OAuth 2.0 consent screen
        ↓
Backend /api/auth/google/callback
        ↓
JWT token generated (7d expiry)
        ↓
Redirect → /{role}/dashboard?token=...
        ↓
Token stored in localStorage
```

---

## 💳 Payment Flow

```
User selects slot & duration
        ↓
Amount calculated on frontend
        ↓
Razorpay order created via backend
        ↓
Razorpay checkout UI opens
        ↓
Payment success → Booking confirmed
        ↓
Email confirmation sent via Nodemailer
        ↓
PDF receipt available for download
```

---

## 🌐 Deployment

| Service | Platform | URL |
|---|---|---|
| Frontend | Vercel | [smart-parking-system-frontend-kappa.vercel.app](https://smart-parking-system-frontend-kappa.vercel.app) |
| Backend | Render | [smart-parking-system-backend-oco6.onrender.com](https://smart-parking-system-backend-oco6.onrender.com) |
| Database | MongoDB Atlas | Cloud hosted |

### Vercel Config (`vercel.json`)
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```
> Required for React Router to work on Vercel — all routes serve `index.html`.

---

## 📊 Key Implementation Highlights

### Role-Based Routing
```jsx
<Route
  path="/admin/dashboard"
  element={
    <ProtectedAdminRoute>
      <AdminDashboard />
    </ProtectedAdminRoute>
  }
/>
```

### Rate Limiting (Backend)
Admin login is protected with express-rate-limiter to prevent brute force attacks.

### JWT Expiry
Tokens expire in 7 days — users are automatically logged out after expiry.

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📬 Contact

**Chirag Dhiman**  
📧 dhimanchirag99@gmail.com  
🔗 [GitHub](https://github.com/chiragdhiman99)

---

<div align="center">

**Built with ❤️ from Dharamsala, Himachal Pradesh 🏔️**

⭐ Star this repo if you found it useful!

</div>
