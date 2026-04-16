// src/components/NotFoundPage.jsx
import { Link } from "react-router-dom";
import { FiArrowLeft, FiHome, FiGrid } from "react-icons/fi";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[75vh] items-center justify-center px-4 py-10">
      <style>{`
        @keyframes floatY {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .float-animate {
          animation: floatY 3s ease-in-out infinite;
        }
      `}</style>

      <div className="grid w-full max-w-6xl items-center gap-8 overflow-hidden rounded-[2rem] border border-orange-200 bg-white shadow-[0_20px_80px_rgba(15,23,42,0.12)] lg:grid-cols-2">
        {/* Left Side */}
        <div className="p-8 sm:p-10 lg:p-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-xs font-semibold tracking-wide text-orange-600">
            <span className="h-2 w-2 rounded-full bg-orange-400" />
            Page not found
          </div>

          <h1 className="mt-6 text-6xl font-extrabold tracking-tight text-slate-800 sm:text-7xl">
            404
          </h1>

          <h2 className="mt-4 text-3xl font-bold leading-tight text-slate-800">
            Oops! This page seems to have gone missing.
          </h2>

          <p className="mt-5 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
            The page you are looking for may have been moved, deleted, or the
            link may be incorrect. Let’s help you get back to the right place in
            CampusNexus.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 px-6 py-3 font-semibold text-white shadow-lg transition hover:scale-[1.02] hover:shadow-orange-500/20"
            >
              <FiHome size={16} />
              Back to Home
            </Link>

            <Link
              to="/resources"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:border-slate-400 hover:shadow-sm"
            >
              <FiGrid size={16} />
              Explore Resources
            </Link>
          </div>

          <div className="mt-8 rounded-[1.5rem] bg-slate-50 p-5">
            <p className="text-sm font-semibold text-slate-700">
              You can try these next:
            </p>

            <ul className="mt-3 space-y-2 text-sm text-slate-500">
              <li>• Go back to the homepage</li>
              <li>• Check the page address again</li>
              <li>• Browse available public resources</li>
              <li>• Sign in if you were trying to open a protected page</li>
            </ul>
          </div>
        </div>

        {/* Right Side */}
        <div className="relative flex min-h-[420px] items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 p-8">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute left-10 top-10 h-24 w-24 rounded-full bg-orange-400 blur-3xl" />
            <div className="absolute bottom-10 right-10 h-32 w-32 rounded-full bg-blue-400 blur-3xl" />
          </div>

          <div className="relative z-10 text-center">
            <div className="float-animate mx-auto w-full max-w-sm">
              <img
                src="/404 error.jpg"
                alt="404 not found"
                className="mx-auto w-full max-h-[320px] object-contain"
              />
            </div>

            <p className="mt-6 text-sm text-slate-300">
              Sorry, we couldn’t find the page you requested.
            </p>

            <Link
              to="/"
              className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-5 py-3 font-semibold text-white backdrop-blur transition hover:bg-white/15"
            >
              <FiArrowLeft size={16} />
              Return Safely
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}