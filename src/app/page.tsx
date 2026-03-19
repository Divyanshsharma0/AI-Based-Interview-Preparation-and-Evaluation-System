"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
  GlobeAltIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";

type AuthMode = "login" | "signup";

// Static shape component (no animation)
const StaticShape = ({
  shape,
  size,
  color,
  top,
  left,
  right,
  bottom,
  className,
}: {
  shape: "circle" | "triangle" | "semicircle";
  size: number;
  color: string;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  className?: string;
}) => {
  return (
    <div
      className={`absolute ${className}`}
      style={{
        top,
        left,
        right,
        bottom,
        width: size,
        height: size,
      }}
    >
      {shape === "circle" && (
        <div className={`h-full w-full rounded-full ${color}`} />
      )}

      {shape === "triangle" && (
        <div
          className={color}
          style={{
            width: 0,
            height: 0,
            borderLeft: `${size / 2}px solid transparent`,
            borderRight: `${size / 2}px solid transparent`,
            borderBottom: `${size}px solid currentColor`,
          }}
        />
      )}

      {shape === "semicircle" && (
        <div
          className={color}
          style={{
            width: size,
            height: size / 2,
            borderRadius: `${size}px ${size}px 0 0`,
          }}
        />
      )}
    </div>
  );
};

export default function Home() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("login");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1400));
    setLoading(false);
    // Redirect to dashboard
    router.push("/dashboard");
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-white">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-5">
        {/* Left Section - Visual Area with Shapes (50-60%) */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative hidden overflow-hidden bg-gradient-to-br from-purple-100 via-blue-50 to-purple-50 lg:col-span-3 lg:flex lg:items-center lg:justify-center"
        >
          {/* Static Shapes - Positioned Around */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Top Left - Purple Circle */}
            <StaticShape
              shape="circle"
              size={180}
              color="bg-purple-300"
              top="-40px"
              left="-50px"
            />

            {/* Top Left - Cyan Semicircle */}
            <StaticShape
              shape="semicircle"
              size={140}
              color="bg-cyan-400"
              top="20px"
              left="60px"
            />

            {/* Top Right - Orange Circle */}
            <StaticShape
              shape="circle"
              size={200}
              color="bg-orange-400"
              top="-60px"
              right="-80px"
            />

            {/* Top Right - Pink Circle */}
            <StaticShape
              shape="circle"
              size={120}
              color="bg-pink-300"
              top="40px"
              right="20px"
            />

            {/* Bottom Left - Red/Pink Triangle */}
            <StaticShape
              shape="triangle"
              size={100}
              color="text-pink-500"
              bottom="80px"
              left="40px"
            />

            {/* Bottom Center - Cyan Triangle */}
            <StaticShape
              shape="triangle"
              size={110}
              color="text-cyan-400"
              bottom="60px"
              left="50%"
              className="-translate-x-1/2"
            />

            {/* Bottom Right - Purple Triangle */}
            <StaticShape
              shape="triangle"
              size={130}
              color="text-purple-400"
              bottom="40px"
              right="60px"
            />
          </div>

          {/* Heading Text - In Front of Shapes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative z-10 text-center px-6"
          >
            <h2 className="max-w-md text-5xl font-bold leading-tight text-gray-900">
              Changing the way{" "}
              <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-pink-500 bg-clip-text text-transparent">
                the world writes
              </span>
            </h2>
          </motion.div>
        </motion.section>

        {/* Right Section - Auth Form (40-50%) */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center justify-center px-6 py-12 sm:px-8 lg:col-span-2 lg:px-12"
        >
          <div className="w-full max-w-sm space-y-8">
            {/* Logo / Branding */}
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 text-white font-bold text-lg">
                C.
              </div>
            </div>

            {/* Title */}
            <div>
              <h1 className="text-2xl font-medium text-gray-900">
                {mode === "login" ? "Login" : "Create account"}
              </h1>
            </div>

            {/* Google Button */}
            <button
              type="button"
              className="group flex w-full items-center justify-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 active:scale-95"
            >
              <GlobeAltIcon className="h-5 w-5 text-gray-600" />
              Sign in with Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-xs font-medium text-gray-500">
                Or sign in with email
              </span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            {/* Form */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              {mode === "signup" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Full name
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="John Carter"
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <EnvelopeIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    required
                    type="email"
                    placeholder="you@company.com"
                    className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <LockClosedIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-11 pr-11 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {mode === "signup" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Confirm password
                  </label>
                  <div className="relative">
                    <LockClosedIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                      required
                      type={showConfirm ? "text" : "password"}
                      placeholder="••••••••"
                      className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-11 pr-11 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-600"
                    >
                      {showConfirm ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {mode === "login" && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-200 text-indigo-600"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Keep me logged in
                    </span>
                  </label>
                  <button
                    type="button"
                    className="text-sm font-medium text-indigo-600 transition hover:text-indigo-700"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-80"
              >
                {loading
                  ? mode === "login"
                    ? "Signing in..."
                    : "Creating account..."
                  : mode === "login"
                    ? "Login"
                    : "Create Account"}
              </motion.button>
            </form>

            {/* Sign up / Login toggle */}
            <p className="text-center text-sm text-gray-600">
              {mode === "login"
                ? "Don't have an account? "
                : "Already have an account? "}
              <button
                type="button"
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
                className="font-semibold text-indigo-600 transition hover:text-indigo-700"
              >
                {mode === "login" ? "Sign up" : "Login"}
              </button>
            </p>
          </div>
        </motion.section>
      </div>
    </main>
  );
}
