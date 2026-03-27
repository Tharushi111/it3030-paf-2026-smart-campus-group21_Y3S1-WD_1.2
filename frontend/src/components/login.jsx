export default function LoginPage() {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-full max-w-md rounded-3xl border border-orange-200 bg-white p-8 shadow-lg">
          <h1 className="text-3xl font-bold text-orange-600">Login</h1>
          <p className="mt-2 text-slate-500">
            Authentication page will be connected later.
          </p>
  
          <form className="mt-6 space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full rounded-xl border border-orange-200 px-4 py-3 outline-none focus:border-orange-400"
            />
  
            <input
              type="password"
              placeholder="Password"
              className="w-full rounded-xl border border-orange-200 px-4 py-3 outline-none focus:border-orange-400"
            />
  
            <button
              type="button"
              className="w-full rounded-xl bg-orange-500 px-4 py-3 font-semibold text-white hover:bg-orange-600"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }