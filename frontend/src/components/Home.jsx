import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiCalendar,
  FiGrid,
  FiShield,
  FiClock,
  FiUsers,
  FiCheckCircle,
  FiMonitor,
} from "react-icons/fi";

export default function HomePage() {
  const features = [
    {
      icon: <FiGrid size={22} />,
      title: "Smart Resource Access",
      description:
        "Browse classrooms, labs, equipment, and campus facilities in one organized place.",
    },
    {
      icon: <FiCalendar size={22} />,
      title: "Easy Booking Flow",
      description:
        "Reserve supported resources quickly with a cleaner and more user-friendly booking experience.",
    },
    {
      icon: <FiShield size={22} />,
      title: "Role-Based Access",
      description:
        "Students and administrators get a tailored experience with secure access to relevant features.",
    },
    {
      icon: <FiClock size={22} />,
      title: "Real-Time Availability",
      description:
        "Check resource status, availability, and updates without wasting time or making manual inquiries.",
    },
  ];

  const stats = [
    { value: "48+", label: "Campus Resources" },
    { value: "24/7", label: "Digital Access" },
    { value: "100%", label: "Role-Based Control" },
    { value: "Fast", label: "Booking Experience" },
  ];

  const highlights = [
    "Browse campus facilities and equipment with ease",
    "Book eligible resources through your account",
    "Access separate dashboards for students and admins",
    "Enjoy a cleaner, smarter campus management workflow",
  ];

  return (
    <div className="space-y-10">
      {/* HERO */}
      <section className="overflow-hidden rounded-[2rem] border border-orange-500/20 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white shadow-[0_20px_80px_rgba(15,23,42,0.18)]">
        <div className="grid items-center gap-0 lg:grid-cols-2">
          {/* Left */}
          <div className="p-8 sm:p-10 lg:p-14">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/20 bg-orange-500/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-orange-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Smart Campus Operation Hub
            </div>

            <h1 className="mt-6 text-4xl font-bold leading-tight sm:text-5xl">
              Welcome to <span className="text-orange-400">CampusNexus</span>
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
              A modern platform for managing campus resources, improving access,
              and simplifying booking workflows for students and administrators.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/resources"
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 px-6 py-3 font-semibold text-white shadow-lg transition hover:scale-[1.02] hover:shadow-orange-500/20"
              >
                Explore Resources
                <FiArrowRight size={16} />
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur transition hover:bg-white/15"
              >
                Sign In
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {highlights.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                >
                  <div className="mt-0.5 text-emerald-400">
                    <FiCheckCircle size={16} />
                  </div>
                  <p className="text-sm text-slate-200">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right */}
          <div className="relative h-full min-h-[320px] lg:min-h-[620px]">
            <img
              src="/home image 1.jpeg"
              alt="CampusNexus smart campus"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item, index) => (
          <div
            key={index}
            className="rounded-[1.75rem] border border-orange-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <p className="text-3xl font-bold text-slate-800">{item.value}</p>
            <p className="mt-2 text-sm font-medium text-slate-500">
              {item.label}
            </p>
          </div>
        ))}
      </section>

      {/* FEATURES */}
      <section className="rounded-[2rem] border border-orange-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-orange-500">
            Core Features
          </p>
          <h2 className="mt-2 text-3xl font-bold text-slate-800">
            Everything you need for smart campus operations
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
            CampusNexus helps centralize campus facilities and resource handling
            with a cleaner digital experience for both students and administrators.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-[1.5rem] border border-slate-200 bg-gradient-to-br from-white to-orange-50/40 p-5 transition hover:-translate-y-1 hover:border-orange-300 hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-orange-400 shadow-md">
                {feature.icon}
              </div>

              <h3 className="mt-4 text-lg font-bold text-slate-800">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY SECTION */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-orange-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wider text-orange-500">
            Why CampusNexus
          </p>
          <h2 className="mt-2 text-3xl font-bold text-slate-800">
            Built to make campus operations simpler
          </h2>

          <div className="mt-6 space-y-4">
            <div className="rounded-2xl bg-slate-50 p-4">
              <h3 className="font-semibold text-slate-800">
                Centralized management
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Keep campus resources, visibility, and booking-related actions in
                one connected system.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <h3 className="font-semibold text-slate-800">
                Better user experience
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Reduce confusion with a cleaner interface for searching, viewing,
                and accessing resources.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <h3 className="font-semibold text-slate-800">
                Practical for real campus use
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Designed to support actual student and admin workflows rather
                than just being a basic static portal.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-orange-500/20 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 p-8 text-white shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wider text-orange-300">
            Quick Access
          </p>
          <h2 className="mt-2 text-3xl font-bold">
            Start exploring your campus digitally
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            Browse public resource information right away, or sign in to unlock
            booking and role-based features.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <Link
              to="/resources"
              className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5 transition hover:bg-white/15"
            >
              <FiGrid className="text-orange-400" size={22} />
              <h3 className="mt-4 text-lg font-semibold">View Resources</h3>
              <p className="mt-2 text-sm text-slate-300">
                Check available facilities, equipment, and campus spaces.
              </p>
            </Link>

            <Link
              to="/login"
              className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5 transition hover:bg-white/15"
            >
              <FiUsers className="text-orange-400" size={22} />
              <h3 className="mt-4 text-lg font-semibold">Access Your Account</h3>
              <p className="mt-2 text-sm text-slate-300">
                Sign in to manage bookings and open your personalized dashboard.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-[2rem] border border-orange-200 bg-gradient-to-r from-orange-500 to-amber-400 p-8 text-white shadow-lg">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-white/80">
              CampusNexus Platform
            </p>
            <h2 className="mt-2 text-3xl font-bold">
              Ready to experience a smarter campus system?
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/90">
              Sign in to access your account, explore campus resources, and use
              the smart booking experience built for modern university operations.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/login"
              className="rounded-2xl bg-white px-6 py-3 font-semibold text-orange-600 transition hover:scale-[1.02]"
            >
              Sign In Now
            </Link>

            <Link
              to="/resources"
              className="rounded-2xl border border-white/30 bg-white/10 px-6 py-3 font-semibold text-white transition hover:bg-white/15"
            >
              Explore Resources
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}