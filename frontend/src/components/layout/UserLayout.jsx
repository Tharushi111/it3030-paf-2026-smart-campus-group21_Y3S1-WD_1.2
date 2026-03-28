import { Link, Outlet, useLocation } from "react-router-dom";
import {
  FiHome,
  FiGrid,
  FiLogIn,
  FiHeart,
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiMail,
  FiPhone,
  FiMapPin,
} from "react-icons/fi";

export default function UserLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@700;800&display=swap');
        .pulse-dot { animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.4;} }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-orange-500/20 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950/90 backdrop-blur px-8 py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          {/* Logo */}
          <img 
            src="/Logo.png" 
            alt="CampusNexus Logo" 
            className="h-10 w-10 rounded-lg object-cover shadow-md"
          />
          <div>
            <h2 className="text-base font-semibold text-zinc-200">CampusNexus</h2>
            <p className="text-xs text-zinc-500">Student Portal</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className={`flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium transition-all duration-200 ${
              location.pathname === "/"
                ? "bg-orange-500/20 text-orange-300"
                : "text-zinc-400 hover:text-orange-300"
            }`}
          >
            <FiHome size={16} />
            Home
          </Link>
          <Link
            to="/resources"
            className={`flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium transition-all duration-200 ${
              location.pathname === "/resources"
                ? "bg-orange-500/20 text-orange-300"
                : "text-zinc-400 hover:text-orange-300"
            }`}
          >
            <FiGrid size={16} />
            Resources
          </Link>
          <Link
            to="/login"
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 px-5 py-2 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:scale-105"
          >
            <FiLogIn size={14} />
            Login
          </Link>
        </div>
      </header>

      {/* Main Content – dark blue but lighter than header */}
      <main className="flex-1 bg-gradient-to-br from-slate-800 via-blue-800 to-indigo-800 px-8 py-8">
        <div className="mx-auto max-w-7xl">
          <Outlet />
        </div>
      </main>

      {/* Footer – dark blue gradient (deep) */}
      <footer className="border-t border-orange-500/20 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950/90 backdrop-blur px-8 py-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* About Column */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="rounded-xl bg-white/20 p-2">
                  <FiGrid className="text-white" size={20} />
                </div>
                <h3 className="text-lg font-bold">CampusNexus</h3>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Empowering students and faculty with seamless campus resource management.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li><Link to="/" className="hover:text-orange-400 transition-colors">Home</Link></li>
                <li><Link to="/resources" className="hover:text-orange-400 transition-colors">Resources</Link></li>
                <li><Link to="/about" className="hover:text-orange-400 transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-orange-400 transition-colors">Contact</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-bold mb-4">Contact Us</h3>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li className="flex items-center gap-2">
                  <FiMapPin size={14} />
                  <span>123 University Ave, City, State 12345</span>
                </li>
                <li className="flex items-center gap-2">
                  <FiPhone size={14} />
                  <span>+1 (555) 123-4567</span>
                </li>
                <li className="flex items-center gap-2">
                  <FiMail size={14} />
                  <span>support@campusnexus.edu</span>
                </li>
              </ul>
            </div>

            {/* Social & Newsletter */}
            <div>
              <h3 className="text-lg font-bold mb-4">Follow Us</h3>
              <div className="flex gap-4 mb-6">
                <a href="#" className="rounded-full bg-white/20 p-2 hover:bg-white/30 transition-all">
                  <FiFacebook size={18} />
                </a>
                <a href="#" className="rounded-full bg-white/20 p-2 hover:bg-white/30 transition-all">
                  <FiTwitter size={18} />
                </a>
                <a href="#" className="rounded-full bg-white/20 p-2 hover:bg-white/30 transition-all">
                  <FiInstagram size={18} />
                </a>
              </div>
              <h3 className="text-lg font-bold mb-2">Newsletter</h3>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 rounded-l-xl border border-white/30 bg-white/10 px-4 py-2 text-sm text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                />
                <button className="rounded-r-xl bg-orange-500/20 px-4 py-2 text-sm font-medium text-orange-300 hover:bg-orange-500/30 transition-all">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-8 border-t border-white/10 pt-6 text-center text-sm text-zinc-500">
            <div className="flex items-center justify-center gap-2">
              <span>© 2024 CampusNexus. All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}