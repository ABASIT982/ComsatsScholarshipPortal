"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function StudentSignup() {
  const [prefix, setPrefix] = useState("");
  const [program, setProgram] = useState("");
  const [number, setNumber] = useState("");
  const [level, setLevel] = useState("Undergraduate");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  // Manual sessions and departments
  const sessions = ['FA21', 'SP21','FA22','SP22','FA23', 'SP23','FA24','SP24','FA25', 'SP25','FA26','SP26',];
  const departments = ['BCS', 'BSE','BBA', 'BEC', 'BDS', 'MCS', 'MSE', 'MBA','MEC','MDS'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Client-side validation with proper messages
    if (!fullName.trim()) {
      setError("Full name is required");
      setLoading(false);
      return;
    }

    if (!email.trim()) {
      setError("Email address is required for notifications");
      setLoading(false);
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    if (!prefix || !program || !number) {
      setError("Please complete your registration number (Session, Department, and Number)");
      setLoading(false);
      return;
    }

    if (!level) {
      setError("Please select your student level");
      setLoading(false);
      return;
    }

    if (!password) {
      setError("Password is required");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter your password");
      setLoading(false);
      return;
    }

    const rollNumber = `${prefix}-${program}-${number}`;

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          fullName, 
          email, 
          regno: rollNumber, 
          password, 
          level 
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Show API error messages properly
        setError(data.error || "Signup failed. Please try again.");
        return;
      }

      setSuccess(data.message || "Account created successfully! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 px-6 pt-24">
      <div className="w-full max-w-sm bg-white/10 backdrop-blur-md border border-blue-400/30 rounded-2xl mb-50 p-8 shadow-2xl text-white">
        <h1 className="text-3xl font-bold text-center mb-6 text-cyan-300">
          Student Sign Up
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-400/50 rounded-lg text-red-200 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-500/20 border border-green-400/50 rounded-lg text-green-200 text-sm">
            {success}
          </div>
        )}

        <form className="flex flex-col gap-4 text-sm" onSubmit={handleSubmit}>
          <div>
            <label className="block text-blue-200 mb-1">
              Full Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full px-4 py-2 rounded-lg bg-blue-950/40 border border-blue-400/30 focus:outline-none focus:border-cyan-400 placeholder-blue-300/60 text-white"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-blue-200 mb-1">
              Email Address <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full px-4 py-2 rounded-lg bg-blue-950/40 border border-blue-400/30 focus:outline-none focus:border-cyan-400 placeholder-blue-300/60 text-white"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-blue-200 mb-1">
              Registration No. <span className="text-red-400">*</span>
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
              Student Level <span className="text-red-400">*</span>
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-1.5">
                <input
                  type="radio"
                  value="Undergraduate"
                  checked={level === "Undergraduate"}
                  onChange={() => setLevel("Undergraduate")}
                  className="accent-cyan-400"
                  disabled={loading}
                  required
                />
                Undergraduate
              </label>
              <label className="flex items-center gap-1.5">
                <input
                  type="radio"
                  value="Graduate"
                  checked={level === "Graduate"}
                  onChange={() => setLevel("Graduate")}
                  className="accent-cyan-400"
                  disabled={loading}
                  required
                />
                Graduate
              </label>
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
                className="w-full px-4 py-2 rounded-lg bg-blue-950/40 border border-blue-400/30 focus:outline-none focus:border-cyan-400 placeholder-blue-300/60 text-white pr-16"
                required
                disabled={loading}
                minLength={6}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300 hover:text-cyan-300 text-xs"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-blue-200 mb-1">
              Confirm Password <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                className="w-full px-4 py-2 rounded-lg bg-blue-950/40 border border-blue-400/30 focus:outline-none focus:border-cyan-400 placeholder-blue-300/60 text-white pr-16"
                required
                disabled={loading}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300 hover:text-cyan-300 text-xs"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={loading}
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 bg-gradient-to-r from-blue-500 to-cyan-400 text-blue-900 font-semibold py-2 rounded-full hover:opacity-90 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>

          <p className="text-center text-sm text-blue-200 mt-3">
            Already have an account?{" "}
            <Link href="/login" className="text-cyan-300 hover:underline">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}