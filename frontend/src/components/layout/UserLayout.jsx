import { Link, Outlet, useLocation } from "react-router-dom";
import {
  FiHome,
  FiGrid,
  FiLogIn,
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiMail,
  FiPhone,
  FiMapPin,
  FiInfo,
  FiBell,
  FiUser,
  FiTool,
} from "react-icons/fi";

export default function UserLayout() {
  const location = useLocation();

  // temporary notification state
  const hasUnreadNotifications = true;
  const unreadCount = 3;

  const navLinkClass = (path) =>
    `flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${
      location.pathname === path
        ? "bg-orange-500/20 text-orange-300 shadow-sm"
        : "text-zinc-400 hover:text-orange-300 hover:bg-white/5"
    }`;

  return (
    <div
      className="min-h-screen flex flex-col bg-gray-50"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@700;800&display=swap');
      `}</style>

      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-orange-500/20 bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-950 px-6 py-4 shadow-lg backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          {/* Logo + Brand */}
          <div className="flex items-center gap-3">
            <img
              src="/Logo.png"
              alt="CampusNexus Logo"
              className="h-10 w-10 rounded-lg object-cover shadow-md transition-transform hover:scale-105"
            />
            <div>
              <h2
                className="text-base font-semibold text-zinc-200"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                CampusNexus
              </h2>
              <p className="text-xs text-zinc-400">Student Portal</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 lg:flex">
            <Link to="/" className={navLinkClass("/")}>
              <FiHome size={16} />
              Home
            </Link>

            <Link to="/resources" className={navLinkClass("/resources")}>
              <FiGrid size={16} />
              Resources
            </Link>

            <Link to="/tickets" className={navLinkClass("/tickets")}>
              <FiTool size={16} />
              Tickets
            </Link>

            <Link to="/about" className={navLinkClass("/about")}>
              <FiInfo size={16} />
              About Us
            </Link>

            <Link to="/contact" className={navLinkClass("/contact")}>
              <FiMail size={16} />
              Contact Us
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Notification */}
            <button
              type="button"
              className="relative rounded-xl border border-white/10 bg-white/5 p-2.5 text-zinc-300 transition-all duration-200 hover:border-orange-400/30 hover:bg-white/10 hover:text-orange-300 hover:scale-105"
              title="Notifications"
            >
              <FiBell size={18} />
              {hasUnreadNotifications && (
                <>
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-lg ring-2 ring-slate-900">
                    {unreadCount}
                  </span>
                  <span className="absolute right-0 top-0 h-2.5 w-2.5 animate-ping rounded-full bg-red-400 ring-2 ring-slate-900" />
                </>
              )}
            </button>

            {/* Profile */}
            <button
              type="button"
              className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-zinc-300 transition-all duration-200 hover:border-orange-400/30 hover:bg-white/10 hover:text-orange-300 hover:scale-105"
              title="Profile"
            >
              <FiUser size={18} />
            </button>

            {/* Login */}
            <Link
              to="/login"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/20"
            >
              <FiLogIn size={14} />
              Login
            </Link>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="mx-auto mt-4 flex max-w-7xl flex-wrap items-center gap-2 border-t border-white/10 pt-4 lg:hidden">
          <Link to="/" className={navLinkClass("/")}>
            <FiHome size={16} />
            Home
          </Link>
          <Link to="/resources" className={navLinkClass("/resources")}>
            <FiGrid size={16} />
            Resources
          </Link>
          <Link to="/tickets" className={navLinkClass("/tickets")}>
            <FiTool size={16} />
            Tickets
          </Link>
          <Link to="/about" className={navLinkClass("/about")}>
            <FiInfo size={16} />
            About
          </Link>
          <Link to="/contact" className={navLinkClass("/contact")}>
            <FiMail size={16} />
            Contact
          </Link>
        </div>
      </header>

      {/* MAIN */}
      <main className="flex-1 bg-gradient-to-br from-orange-50 via-white to-orange-100 px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <Outlet />
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-orange-500/20 bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-950 px-6 py-8 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* ABOUT */}
            <div>
              <h3 className="mb-3 text-lg font-bold">CampusNexus</h3>
              <p className="text-sm text-zinc-400">
                Empowering students and staff with seamless campus resource,
                booking, and incident management.
              </p>
            </div>

            {/* LINKS */}
            <div>
              <h3 className="mb-3 text-lg font-bold">Quick Links</h3>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li>
                  <Link to="/" className="hover:text-orange-400">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/resources" className="hover:text-orange-400">
                    Resources
                  </Link>
                </li>
                <li>
                  <Link to="/tickets" className="hover:text-orange-400">
                    Tickets
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-orange-400">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-orange-400">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* CONTACT */}
            <div>
              <h3 className="mb-3 text-lg font-bold">Contact</h3>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li className="flex items-center gap-2">
                  <FiMapPin size={14} />
                  <span>SLIIT Malabe Campus</span>
                </li>
                <li className="flex items-center gap-2">
                  <FiPhone size={14} />
                  <span>+94 11 754 4801</span>
                </li>
                <li className="flex items-center gap-2">
                  <FiMail size={14} />
                  <span>support@campusnexus.edu</span>
                </li>
              </ul>
            </div>

            {/* SOCIAL */}
            <div>
              <h3 className="mb-3 text-lg font-bold">Follow Us</h3>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="rounded-full bg-white/10 p-2 transition hover:bg-orange-500 hover:scale-110"
                >
                  <FiFacebook size={18} />
                </a>
                <a
                  href="#"
                  className="rounded-full bg-white/10 p-2 transition hover:bg-orange-500 hover:scale-110"
                >
                  <FiTwitter size={18} />
                </a>
                <a
                  href="#"
                  className="rounded-full bg-white/10 p-2 transition hover:bg-orange-500 hover:scale-110"
                >
                  <FiInstagram size={18} />
                </a>
              </div>
            </div>
          </div>

          {/* COPYRIGHT */}
          <div className="mt-8 border-t border-white/10 pt-6 text-center text-sm text-zinc-500">
            © 2026 CampusNexus — Smart Campus Operation Hub
          </div>
        </div>
      </footer>
    </div>
  );
}