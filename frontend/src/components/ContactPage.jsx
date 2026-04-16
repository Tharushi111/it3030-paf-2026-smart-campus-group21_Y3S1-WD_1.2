import { Link } from "react-router-dom";
import {
  FiMail,
  FiPhone,
  FiClock,
  FiMessageSquare,
  FiHelpCircle,
  FiArrowRight,
  FiCheckCircle,
} from "react-icons/fi";
import { FaFacebookF, FaInstagram, FaXTwitter, FaLinkedinIn } from "react-icons/fa6";

export default function ContactPage() {
  const quickHelp = [
    "Account access and login support",
    "Questions about campus resources",
    "Booking guidance for supported resources",
    "General platform help and navigation support",
  ];

  const supportNotes = [
    {
      title: "General Support",
      text: "Use our official support email for platform questions, account access issues, and general help requests.",
    },
    {
      title: "Faster Response",
      text: "When contacting support, include a short explanation of the issue and the page or feature involved.",
    },
    {
      title: "Role-Based Help",
      text: "Support can guide both student-side and staff-side usage depending on your account role.",
    },
  ];

  return (
    <div className="space-y-10">
      {/* HERO - different design */}
      <section className="overflow-hidden rounded-[2rem] border border-orange-200 bg-white shadow-sm">
        <div className="grid lg:grid-cols-[1.2fr_.8fr]">
          {/* Left */}
          <div className="p-8 sm:p-10 lg:p-14">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-xs font-semibold tracking-wide text-orange-600">
              <span className="h-2 w-2 rounded-full bg-orange-400" />
              Contact CampusNexus
            </div>

            <h1 className="mt-6 text-4xl font-bold leading-tight text-slate-800 sm:text-5xl">
              Need help? We’re here to support your{" "}
              <span className="text-orange-500">CampusNexus experience</span>
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
              Reach out for support related to your account, resource browsing,
              booking guidance, or general platform use. We keep communication
              simple, practical, and easier to access.
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
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:border-slate-400 hover:shadow-sm"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Right */}
          <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 p-8 text-white sm:p-10">
            <p className="text-sm font-semibold uppercase tracking-wider text-orange-300">
              Contact Overview
            </p>

            <div className="mt-6 space-y-5">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5 backdrop-blur">
                <div className="flex items-start gap-4">
                  <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500/20 text-orange-300">
                    <FiMail size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Email Support</p>
                    <p className="mt-1 break-all text-sm text-orange-300">
                      campusnexus29@gmail.com
                    </p>
                    <p className="mt-2 text-sm text-slate-300">
                      For all general support, platform help, and account-related questions.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5 backdrop-blur">
                <div className="flex items-start gap-4">
                  <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500/20 text-orange-300">
                    <FiPhone size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Support Hotline</p>
                    <p className="mt-1 text-sm text-orange-300">+94 76 123 4567</p>
                    <p className="mt-2 text-sm text-slate-300">
                      Contact us for urgent assistance and platform-related guidance.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5 backdrop-blur">
                <div className="flex items-start gap-4">
                  <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500/20 text-orange-300">
                    <FiClock size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Online Support Hours</p>
                    <p className="mt-2 text-sm text-slate-300">
                      Monday - Friday: 8.30 AM - 5.30 PM
                    </p>
                    <p className="text-sm text-slate-300">
                      Saturday: 9.00 AM - 1.00 PM
                    </p>
                    <p className="text-sm text-slate-400">
                      Sunday & public holidays: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL + QUICK HELP */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* Social */}
        <div className="rounded-[2rem] border border-orange-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wider text-orange-500">
            Connect with us
          </p>
          <h2 className="mt-2 text-3xl font-bold text-slate-800">
            Stay connected through our social platforms
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-500">
            Follow CampusNexus updates, announcements, and platform highlights
            through our social channels.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <a
              href="#"
              className="flex items-center gap-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 transition hover:border-orange-300 hover:shadow-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1877F2]/10 text-[#1877F2]">
                <FaFacebookF size={20} />
              </div>
              <div>
                <p className="font-semibold text-slate-800">Facebook</p>
                <p className="text-sm text-slate-500">@CampusNexus</p>
              </div>
            </a>

            <a
              href="#"
              className="flex items-center gap-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 transition hover:border-orange-300 hover:shadow-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black/5 text-black">
                <FaXTwitter size={20} />
              </div>
              <div>
                <p className="font-semibold text-slate-800">X / Twitter</p>
                <p className="text-sm text-slate-500">@CampusNexus</p>
              </div>
            </a>

            <a
              href="#"
              className="flex items-center gap-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 transition hover:border-orange-300 hover:shadow-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E4405F]/10 text-[#E4405F]">
                <FaInstagram size={20} />
              </div>
              <div>
                <p className="font-semibold text-slate-800">Instagram</p>
                <p className="text-sm text-slate-500">@CampusNexus</p>
              </div>
            </a>

            <a
              href="#"
              className="flex items-center gap-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 transition hover:border-orange-300 hover:shadow-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0A66C2]/10 text-[#0A66C2]">
                <FaLinkedinIn size={20} />
              </div>
              <div>
                <p className="font-semibold text-slate-800">LinkedIn</p>
                <p className="text-sm text-slate-500">CampusNexus</p>
              </div>
            </a>
          </div>
        </div>

        {/* Quick Help */}
        <div className="rounded-[2rem] border border-orange-500/20 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 p-8 text-white shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wider text-orange-300">
            Quick Support Topics
          </p>
          <h2 className="mt-2 text-3xl font-bold">
            Common areas we can help you with
          </h2>

          <div className="mt-6 space-y-4">
            {quickHelp.map((item, index) => (
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
      </section>

      {/* SUPPORT NOTES */}
      <section className="rounded-[2rem] border border-orange-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-orange-500">
            Support Guidance
          </p>
          <h2 className="mt-2 text-3xl font-bold text-slate-800">
            A few things to know before contacting us
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
            These practical notes help support respond faster and more
            effectively to your request.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {supportNotes.map((item, index) => (
            <div
              key={index}
              className="rounded-[1.5rem] border border-slate-200 bg-gradient-to-br from-white to-orange-50/40 p-5"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-orange-400 shadow-md">
                <FiMessageSquare size={20} />
              </div>

              <h3 className="mt-4 text-lg font-bold text-slate-800">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {item.text}
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
              Need More Help?
            </p>
            <h2 className="mt-2 text-3xl font-bold">
              Explore CampusNexus or access your account
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/90">
              Browse public campus resources or sign in to use personalized
              features and account-based access.
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