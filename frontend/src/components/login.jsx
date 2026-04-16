import { useAuth } from "../context/AuthContext";

function GoogleIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 48 48"
      aria-hidden="true"
    >
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303C33.654 32.657 29.192 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.276 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="M6.306 14.691l6.571 4.819C14.655 16.108 18.961 13 24 13c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.276 4 24 4c-7.682 0-14.347 4.337-17.694 10.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.176 0 9.946-1.977 13.533-5.196l-6.249-5.288C29.208 35.102 26.715 36 24 36c-5.171 0-9.625-3.329-11.287-7.946l-6.522 5.025C9.5 39.556 16.227 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303c-.793 2.45-2.367 4.532-4.553 5.984l.003-.002 6.249 5.288C36.58 39.031 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </svg>
  );
}

export default function LoginPage() {
  const { loginWithGoogle } = useAuth();

  return (
    <div className="flex min-h-[88vh] items-center justify-center px-4 py-8">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-orange-500/20 bg-white shadow-[0_20px_80px_rgba(15,23,42,0.18)] md:grid-cols-2">
        {/* Left Side */}
        <div className="relative hidden min-h-[620px] md:block">
          <img
            src="/login image.jpeg"
            alt="CampusNexus smart campus"
            className="h-full w-full object-cover"
          />

          
        </div>

        {/* Right Side */}
        <div className="relative flex items-center justify-center bg-gradient-to-br from-white via-orange-50/40 to-slate-50 p-8 md:p-12">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 shadow-lg">
                <img
                  src="/Logo.png"
                  alt="CampusNexus logo"
                  className="h-9 w-9 object-contain"
                />
              </div>

              <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-800">
                Welcome to CampusNexus
              </h1>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Sign in with your Google account to access campus resources,
                booking features, and your personalized dashboard.
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5">
                <p className="text-sm font-semibold text-slate-700">
                  Secure campus sign in
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Use your Google account to continue safely and quickly.
                </p>
              </div>

              <button
                onClick={loginWithGoogle}
                className="group flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-300 bg-white px-6 py-3.5 font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-400 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-orange-400/50"
              >
                <GoogleIcon />
                Sign in with Google
              </button>

              <div className="mt-6 rounded-2xl bg-slate-50 px-4 py-4">
                <p className="text-sm font-semibold text-slate-700">
                  What you can do after signing in
                </p>

                <div className="mt-3 space-y-2 text-sm text-slate-500">
                  <div className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-orange-400" />
                    <p>Browse available campus resources and facility details.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-orange-400" />
                    <p>Book supported resources with your account access.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-orange-400" />
                    <p>
                      Access dashboards and role-based features for students or
                      admins.
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-6 text-center text-xs leading-5 text-slate-400">
                By signing in, you are accessing the CampusNexus smart campus
                platform for academic and resource management use.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}