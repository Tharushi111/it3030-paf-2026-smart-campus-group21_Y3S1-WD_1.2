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
} from "react-icons/fi";

export default function UserLayout() {
  const location = useLocation();

  return (
    <div
      className="min-h-screen flex flex-col bg-gray-50"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@700;800&display=swap');
      `}</style>

      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-orange-500/20 bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-950 px-8 py-4 flex items-center justify-between">

        <div className="flex items-center gap-3">
          <img
            src="/Logo.png"
            alt="CampusNexus Logo"
            className="h-10 w-10 rounded-lg object-cover shadow-md"
          />

          <div>
            <h2 className="text-base font-semibold text-zinc-200">
              CampusNexus
            </h2>
            <p className="text-xs text-zinc-400">Student Portal</p>
          </div>
        </div>

        <div className="flex items-center gap-4">

          <Link
            to="/"
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${
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
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${
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
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 px-5 py-2 text-sm font-semibold text-white shadow hover:scale-105 transition"
          >
            <FiLogIn size={14} />
            Login
          </Link>

        </div>
      </header>

      {/* MAIN CONTENT AREA (LIGHT THEME) */}
      <main className="flex-1 bg-gradient-to-br from-orange-50 via-white to-orange-100 px-8 py-10">

        <div className="mx-auto max-w-7xl">
          <Outlet />
        </div>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-orange-500/20 bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-950 px-8 py-8 text-white">

        <div className="mx-auto max-w-7xl">

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">

            {/* ABOUT */}
            <div>
              <h3 className="text-lg font-bold mb-3">CampusNexus</h3>
              <p className="text-sm text-zinc-400">
                Empowering students and faculty with seamless campus resource
                management.
              </p>
            </div>

            {/* LINKS */}
            <div>
              <h3 className="text-lg font-bold mb-3">Quick Links</h3>

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
                  <Link to="/about" className="hover:text-orange-400">
                    About
                  </Link>
                </li>

                <li>
                  <Link to="/contact" className="hover:text-orange-400">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* CONTACT */}
            <div>
              <h3 className="text-lg font-bold mb-3">Contact</h3>

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
              <h3 className="text-lg font-bold mb-3">Follow Us</h3>

              <div className="flex gap-3">

                <a
                  href="#"
                  className="rounded-full bg-white/10 p-2 hover:bg-orange-500 transition"
                >
                  <FiFacebook size={18} />
                </a>

                <a
                  href="#"
                  className="rounded-full bg-white/10 p-2 hover:bg-orange-500 transition"
                >
                  <FiTwitter size={18} />
                </a>

                <a
                  href="#"
                  className="rounded-full bg-white/10 p-2 hover:bg-orange-500 transition"
                >
                  <FiInstagram size={18} />
                </a>

              </div>
            </div>

          </div>

          {/* COPYRIGHT */}
          <div className="mt-8 border-t border-white/10 pt-6 text-center text-sm text-zinc-500">
            © 2026 CampusNexus — University Resource Management System
          </div>

        </div>

      </footer>

    </div>
  );
}