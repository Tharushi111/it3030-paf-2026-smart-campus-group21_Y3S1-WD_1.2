import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiCheckCircle,
  FiTarget,
  FiEye,
  FiShield,
  FiUsers,
  FiGrid,
  FiCalendar,
  FiTrendingUp,
} from "react-icons/fi";

export default function AboutPage() {
  const coreValues = [
    {
      icon: <FiUsers size={20} />,
      title: "User-Centered Experience",
      description:
        "Designed to make campus access and operations simpler for both students and administrators.",
    },
    {
      icon: <FiShield size={20} />,
      title: "Reliable Digital Access",
      description:
        "Supports organized, role-based access to key campus services and resource workflows.",
    },
    {
      icon: <FiTrendingUp size={20} />,
      title: "Operational Efficiency",
      description:
        "Improves visibility, coordination, and management of campus resources in a smarter way.",
    },
  ];

  const strengths = [
    "Centralized campus resource visibility",
    "Smarter and cleaner resource access workflow",
    "Role-based control for users and staff members",
    "Digital support for real campus operations",
  ];

  const features = [
    {
      icon: <FiGrid size={22} />,
      title: "Resource Management",
      description:
        "Browse and organize campus resources such as rooms, labs, and equipment in a structured system.",
    },
    {
      icon: <FiCalendar size={22} />,
      title: "Booking Support",
      description:
        "Enable smoother booking interactions for supported resources through a more practical interface.",
    },
    {
      icon: <FiUsers size={22} />,
      title: "Role-Specific Access",
      description:
        "Different experiences are provided for students and staff members based on their responsibilities.",
    },
    {
      icon: <FiShield size={22} />,
      title: "Better Control",
      description:
        "Supports better management, clearer visibility, and more organized operational processes.",
    },
  ];

  return (
    <div className="space-y-10">
      {/* HERO */}
      <section className="grid gap-6 lg:grid-cols-12">
        {/* Left content */}
        <div className="lg:col-span-7 rounded-[2rem] border border-orange-200 bg-white p-8 shadow-sm sm:p-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-xs font-semibold tracking-wide text-orange-600">
            <span className="h-2 w-2 rounded-full bg-orange-400" />
            About CampusNexus
          </div>

          <h1 className="mt-6 text-4xl font-bold leading-tight text-slate-800 sm:text-5xl">
            Building a smarter way to manage{" "}
            <span className="text-orange-500">campus operations</span>
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
            CampusNexus is a smart campus management platform created to improve
            how users interact with campus resources, facilities, and digital
            services. It brings together visibility, structure, and convenience
            in one modern system built for real campus needs.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-orange-400 shadow-md">
                <FiTarget size={20} />
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-800">
                Our Mission
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                To simplify campus resource handling and improve operational
                efficiency through a modern, centralized digital platform.
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-orange-400 shadow-md">
                <FiEye size={20} />
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-800">
                Our Vision
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                To support a smarter and more connected campus ecosystem through
                digital-first management experiences.
              </p>
            </div>
          </div>

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
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:border-slate-400 hover:shadow-sm"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Right image area */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="overflow-hidden rounded-[2rem] border border-orange-500/20 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 shadow-sm">
            <img
              src="/about 1.jpeg"
              alt="CampusNexus team and platform"
              className="h-[320px] w-full object-cover"
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-[1.1fr_.9fr] lg:grid-cols-1 xl:grid-cols-[1.1fr_.9fr]">
            <div className="rounded-[2rem] border border-orange-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-wider text-orange-500">
                Why it matters
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-500">
                CampusNexus helps reduce disconnected processes by offering a
                clearer and more accessible digital workflow for campus
                resource-related operations.
              </p>
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-orange-200 bg-white shadow-sm">
              <img
                src="/about 2.jpg"
                alt="Campus technology and smart operations"
                className="h-full min-h-[220px] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* INTRO / STORY */}
      <section className="rounded-[2rem] border border-orange-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-orange-500">
          Our Story
        </p>
        <h2 className="mt-2 text-3xl font-bold text-slate-800">
          Created to make campus systems feel modern, practical, and connected
        </h2>
        <div className="mt-5 grid gap-6 lg:grid-cols-2">
          <p className="text-sm leading-7 text-slate-500">
            Many campus-related activities still depend on scattered processes,
            limited visibility, or manual coordination. CampusNexus was designed
            to address that by bringing important operational interactions into
            one smarter platform.
          </p>
          <p className="text-sm leading-7 text-slate-500">
            By combining modern UI design with practical campus functionality,
            CampusNexus creates a more organized experience for discovering
            resources, handling access, and supporting better day-to-day campus
            management.
          </p>
        </div>
      </section>

      {/* VALUES */}
      <section className="grid gap-5 lg:grid-cols-3">
        {coreValues.map((item, index) => (
          <div
            key={index}
            className="rounded-[1.75rem] border border-orange-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-orange-400 shadow-md">
              {item.icon}
            </div>
            <h3 className="mt-4 text-lg font-bold text-slate-800">
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {item.description}
            </p>
          </div>
        ))}
      </section>

      {/* STRENGTHS + IMAGE BAND */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-orange-500/20 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 p-8 text-white shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wider text-orange-300">
            Platform Strengths
          </p>
          <h2 className="mt-2 text-3xl font-bold">
            What makes CampusNexus valuable
          </h2>

          <div className="mt-6 space-y-4">
            {strengths.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-4"
              >
                <div className="mt-0.5 text-emerald-400">
                  <FiCheckCircle size={18} />
                </div>
                <p className="text-sm text-slate-200">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-orange-200 bg-white shadow-sm">
          <img
            src="/about.jpeg"
            alt="CampusNexus digital campus view"
            className="h-full min-h-[420px] w-full object-cover"
          />
        </div>
      </section>

      {/* FEATURES */}
      <section className="rounded-[2rem] border border-orange-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-orange-500">
            What the platform supports
          </p>
          <h2 className="mt-2 text-3xl font-bold text-slate-800">
            Key areas of the CampusNexus experience
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
            The platform is structured to make resource-related operations more
            visible, practical, and user-friendly.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {features.map((item, index) => (
            <div
              key={index}
              className="rounded-[1.5rem] border border-slate-200 bg-gradient-to-br from-white to-orange-50/40 p-5 transition hover:-translate-y-1 hover:border-orange-300 hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-orange-400 shadow-md">
                {item.icon}
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-800">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-[2rem] border border-orange-200 bg-gradient-to-r from-orange-500 to-amber-400 p-8 text-white shadow-lg">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-white/80">
              Discover the Platform
            </p>
            <h2 className="mt-2 text-3xl font-bold">
              Explore how CampusNexus supports smarter campus operations
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/90">
              Browse public resources, learn more about the platform, and sign
              in to experience role-based access and booking-enabled features.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/resources"
              className="rounded-2xl bg-white px-6 py-3 font-semibold text-orange-600 transition hover:scale-[1.02]"
            >
              Explore Resources
            </Link>

            <Link
              to="/login"
              className="rounded-2xl border border-white/30 bg-white/10 px-6 py-3 font-semibold text-white transition hover:bg-white/15"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}