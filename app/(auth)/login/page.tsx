"use client";

import Link from "next/link";
import { useState } from "react";

export default function StudentLogin() {
  const [prefix, setPrefix] = useState("");
  const [program, setProgram] = useState("");
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const rollNumber = `${prefix}-${program}-${number}`;
    console.log({
      rollNumber,
      password,
    });
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 px-6">
      <div className="w-full max-w-sm bg-white/10 backdrop-blur-md border border-blue-400/30 rounded-2xl p-8 shadow-2xl text-white">
        <h1 className="text-3xl font-bold text-center mb-6 text-cyan-300">
          Student Login
        </h1>

        <form className="flex flex-col gap-4 text-sm" onSubmit={handleSubmit}>
          {/* Roll Number Section */}
          <div>
            <label className="block text-blue-200 mb-1">Registration No</label>
            <div className="flex gap-2">
              <select
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                className="w-1/3 px-2 py-2 rounded-lg bg-blue-950/40 border border-blue-400/30 focus:outline-none focus:border-cyan-400 text-white"
                required
              >
                <option value="">FA22</option>
                <option value="FA22">FA22</option>
                <option value="SP23">SP23</option>
                <option value="FA23">FA23</option>
              </select>

              <select
                value={program}
                onChange={(e) => setProgram(e.target.value)}
                className="w-1/3 px-2 py-2 rounded-lg bg-blue-950/40 border border-blue-400/30 focus:outline-none focus:border-cyan-400 text-white"
                required
              >
                <option value="">BCS</option>
                <option value="BCS">BCS</option>
                <option value="BSE">BSE</option>
                <option value="BBA">BBA</option>
                <option value="MCS">MCS</option>
              </select>

              <input
                type="text"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="005"
                maxLength={3}
                className="w-1/3 px-2 py-2 rounded-lg bg-blue-950/40 border border-blue-400/30 focus:outline-none focus:border-cyan-400 placeholder-blue-300/60 text-white"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-blue-200 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 rounded-lg bg-blue-950/40 border border-blue-400/30 focus:outline-none focus:border-cyan-400 placeholder-blue-300/60 text-white"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-4 bg-gradient-to-r from-blue-500 to-cyan-400 text-blue-900 font-semibold py-2 rounded-full hover:opacity-90 transition shadow-md"
          >
            Login
          </button>

          <p className="text-center text-sm text-blue-200 mt-3">
            Don’t have an account?{" "}
            <Link href="/register" className="text-cyan-300 hover:underline">
              Sign up here
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}
