import { useNavigate } from "react-router-dom";

const navItems = [
  { id: "overview", label: "Overview", icon: "🏠" },
  { id: "bookings", label: "My Bookings", icon: "📋" },
  { id: "history", label: "History", icon: "🕐" },
  { id: "profile", label: "Profile", icon: "👤" },
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

const DriverSidebar = ({ activeNav, setActiveNav, sidebarOpen, setSidebarOpen, userData }) => {
  const navigate = useNavigate();

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-100 flex flex-col h-screen transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="p-6 border-b border-gray-100">
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <div className="w-9 h-9 bg-[#22C55E] rounded-xl flex items-center justify-center">
              <span className="text-white font-black text-base">S</span>
            </div>
            <span className="text-lg font-black text-gray-900">
              Slot<span className="text-[#22C55E]">Hub</span>
            </span>
          </div>
        </div>

        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            {userData.photo ? (
              <img
                src={userData.photo}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-xl object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm bg-[#22C55E]">
                {getInitials(userData.fullName)}
              </div>
            )}
            <div>
              <p className="text-sm font-bold text-gray-900">{userData.fullName}</p>
              <span className="text-[10px] font-semibold bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                🚗 Driver
              </span>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveNav(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeNav === item.id
                  ? "bg-[#22C55E] text-white shadow-[0_4px_12px_rgba(34,197,94,0.3)]"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={() => navigate("/search")}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 rounded-xl text-sm transition-all cursor-pointer"
          >
            🔍 Find Parking
          </button>
        </div>

        <div className="p-4">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
            className="w-full text-red-500 hover:bg-red-50 font-semibold py-2.5 rounded-xl text-sm transition-all cursor-pointer"
          >
            Logout →
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
};

export { navItems, getInitials };
export default DriverSidebar;