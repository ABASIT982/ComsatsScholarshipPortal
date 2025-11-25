"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from '../../contexts/AuthContext' // CORRECT PATH

export default function StudentLogin() {
  const [prefix, setPrefix] = useState("");
  const [program, setProgram] = useState("");
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  // Manual sessions and departments
  const sessions = ['FA21', 'SP21','FA22','SP22','FA23', 'SP23','FA24','SP24','FA25', 'SP25','FA26','SP26',];
  const departments = ['BCS', 'BSE','BBA', 'BEC', 'BDS', 'MCS', 'MSE', 'MBA','MEC','MDS'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!prefix || !program || !number || !password) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    const rollNumber = `${prefix}-${program}-${number}`;

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ regno: rollNumber, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      // ✅ USE AUTH CONTEXT INSTEAD OF DIRECT LOCALSTORAGE
      login({
        name: data.user.full_name,
        regno: data.user.regno
      });

      // ✅ STORE ADDITIONAL STUDENT DATA IN LOCALSTORAGE (KEEP YOUR EXISTING LOGIC)
      localStorage.setItem('studentToken', data.user.regno);
      localStorage.setItem('studentName', data.user.full_name);
      localStorage.setItem('studentLevel', data.user.level);
      localStorage.setItem('studentRegno', data.user.regno);
      localStorage.setItem('studentEmail', data.user.email);
      localStorage.setItem('isAuthenticated', 'true');

      // Redirect to student portal
      router.push("/student/dashboard");

    } catch (err) {
      setError("Network error. Please check your connection.");
      setLoading(false);
    }
  };

  // REST OF YOUR CODE REMAINS EXACTLY THE SAME...
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 px-6">
      <div className="w-full max-w-sm bg-white/10 backdrop-blur-md border border-blue-400/30 rounded-2xl p-8 shadow-2xl text-white">
        <h1 className="text-3xl font-bold text-center mb-6 text-cyan-300">
          Student Login
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-400/50 rounded-lg text-red-200 text-sm">
            {error}
          </div>
        )}

        <form className="flex flex-col gap-4 text-sm" onSubmit={handleSubmit}>
          <div>
            <label className="block text-blue-200 mb-1">
              Registration No <span className="text-red-400">*</span>
            </label>
            <div className="flex gap-2">
              <select
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                className="w-1/3 px-2 py-2 rounded-lg bg-blue-950/40 border border-blue-400/30 focus:outline-none focus:border-cyan-400 text-white"
                required
                disabled={loading}
              >
                <option value="">Session</option>
                {sessions.map((session) => (
                  <option key={session} value={session}>
                    {session}
                  </option>
                ))}
              </select>

              <select
                value={program}
                onChange={(e) => setProgram(e.target.value)}
                className="w-1/3 px-2 py-2 rounded-lg bg-blue-950/40 border border-blue-400/30 focus:outline-none focus:border-cyan-400 text-white"
                required
                disabled={loading}
              >
                <option value="">Dept</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>

              <input
                type="text"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="001"
                maxLength={3}
                className="w-1/3 px-2 py-2 rounded-lg bg-blue-950/40 border border-blue-400/30 focus:outline-none focus:border-cyan-400 placeholder-blue-300/60 text-white"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-blue-200 mb-1">
              Password <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-2 rounded-lg bg-blue-950/40 border border-blue-400/30 focus:outline-none focus:border-cyan-400 placeholder-blue-300/60 text-white pr-10"
                required
                disabled={loading}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300 hover:text-cyan-300"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 bg-gradient-to-r from-blue-500 to-cyan-400 text-blue-900 font-semibold py-2 rounded-full hover:opacity-90 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-center text-sm text-blue-200">
            Don't have an account?{" "}
            <Link href="/register" className="text-cyan-300 hover:underline">
              Sign up here
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}