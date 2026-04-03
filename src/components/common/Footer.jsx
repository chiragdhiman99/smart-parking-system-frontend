import { useNavigate } from "react-router-dom";
import {
  FaXTwitter,
  FaLinkedinIn,
  FaFacebookF,
  FaYoutube,
} from "react-icons/fa6";

const Footer = () => {
  const navigate = useNavigate();

  const links = {
    Platform: [
      { label: "Find Parking", path: "/search" },
      { label: "List Your Space", path: "/register?role=owner" },
      { label: "How It Works", path: "/#how-it-works" },
      { label: "Cities", path: "/search?city=all" },
      { label: "Pricing", path: "/#pricing" },
    ],
    Company: [
      { label: "About Us", path: "/about" },
      { label: "Blog", path: "/blog" },
      { label: "Careers", path: "/careers" },
      { label: "Press", path: "/press" },
      { label: "Contact", path: "/contact" },
    ],
    Support: [
      { label: "Help Center", path: "/help" },
      { label: "Privacy Policy", path: "/privacy" },
      { label: "Terms of Service", path: "/terms" },
      { label: "Cookie Policy", path: "/cookies" },
      { label: "Report Issue", path: "/report" },
    ],
  };
  const socials = [
    { icon: <FaXTwitter />, label: "Twitter", hover: "hover:bg-black" },
    { icon: <FaLinkedinIn />, label: "LinkedIn", hover: "hover:bg-[#0077B5]" },
    { icon: <FaFacebookF />, label: "Facebook", hover: "hover:bg-[#1877F2]" },
    { icon: <FaYoutube />, label: "YouTube", hover: "hover:bg-[#FF0000]" },
  ];

  return (
    <footer className="bg-gray-950 text-gray-400">
      <div className="max-w-7xl mx-auto px-6 lg:px-16 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <div
              onClick={() => navigate("/")}
              className="flex items-center gap-2.5 cursor-pointer mb-4 w-fit"
            >
              <div className="w-9 h-9 bg-[#22C55E] rounded-[10px] flex items-center justify-center shadow-[0_4px_12px_rgba(34,197,94,0.3)]">
                <span className="text-white font-black text-base">S</span>
              </div>
              <span className="text-[19px] font-black text-white tracking-tight">
                Slot<span className="text-[#22C55E]">Hub</span>
              </span>
            </div>

            <p className="text-sm leading-relaxed text-gray-500 mb-6 max-w-xs">
              A smarter way to find, book, and manage parking slots near metro
              stations, offices, and commercial hubs across India.
            </p>

            <div className="flex gap-2">
              {socials.map((s, i) => (
                <button
                  key={i}
                  className={`w-9 h-9 cursor-pointer bg-gray-800 ${s.hover} rounded-lg flex items-center justify-center text-sm font-bold text-gray-400 hover:text-white transition-all duration-200`}
                >
                  {s.icon}
                </button>
              ))}
            </div>
          </div>

          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 className="text-xs font-bold text-white tracking-[2px] uppercase mb-4">
                {title}
              </h4>
              <ul className="flex flex-col gap-3">
                {items.map((item, i) => (
                  <li key={i}>
                    <span
                      onClick={() => navigate(item.path)}
                      className="text-sm text-gray-500 hover:text-[#22C55E] cursor-pointer transition-colors duration-200"
                    >
                      {item.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-800" />

      <div className="max-w-7xl mx-auto px-6 lg:px-16 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-gray-600">
          © 2026 SlotHub Technologies Pvt. Ltd. All rights reserved.
        </p>
        <p className="text-xs text-gray-600">
          Made with 💚 for smarter Indian cities
        </p>
      </div>
    </footer>
  );
};

export default Footer;
