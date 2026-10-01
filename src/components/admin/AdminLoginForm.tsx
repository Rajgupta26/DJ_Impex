"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useState } from "react";
import { Eye, EyeOff, Lock, ShieldCheck } from "lucide-react";

import { loginAdminAction, type AuthState } from "@/app/actions/admin-auth";
import { DJIAnimatedLogo } from "@/components/home/DJIAnimatedLogo";

export function AdminLoginForm() {
  const [state, formAction, isPending] = useActionState<AuthState, FormData>(
    loginAdminAction,
    {}
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  return (
    <div className="relative min-h-dvh w-full overflow-hidden bg-white text-slate-900 selection:bg-teal-500 selection:text-white flex flex-col justify-between">
      {/* Luxury White Draped Fabric Background */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <Image
          src="/images/brand-imagery/white-fabric-drape.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          quality={92}
          className="object-cover object-center opacity-80"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-white/60 backdrop-blur-[0.5px]"
        />
      </div>

      {/* Top Left Header Branding (Matching Mockup) */}
      <header className="relative z-10 p-6 sm:p-8 lg:p-10">
        <Link href="/" className="inline-flex items-center gap-3.5 group">
          <div className="flex h-12 w-12 items-center justify-center shrink-0">
            <Image
              src="/images/logos/dji-logo-transparent.png"
              alt="DJ Impex"
              width={64}
              height={64}
              className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </div>
          <div>
            <span className="block font-sans text-2xl font-bold tracking-tight text-navy sm:text-3xl">
              DJ Impex
            </span>
            <span className="block text-xs font-medium text-slate tracking-wide">
              Premium Nabeen Fabric · Textile & Exports
            </span>
          </div>
        </Link>
      </header>

      {/* Centered Login Card */}
      <main className="relative z-10 flex items-center justify-center px-4 py-8 sm:px-6">
        <div className="w-full max-w-[440px] rounded-3xl border border-line/80 bg-white/95 p-7 sm:p-10 shadow-[0_20px_50px_rgba(13,23,51,0.08)] backdrop-blur-md">
          {/* Card Header */}
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Welcome Back
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Sign in to your DJ Impex account to continue
            </p>
          </div>

          {/* Form */}
          <form action={formAction} className="mt-8 space-y-5">
            {state?.error ? (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
              >
                {state.error}
              </div>
            ) : null}

            {/* Email Address */}
            <div className="space-y-1.5">
              <label
                htmlFor="admin-email"
                className="block text-xs font-semibold text-slate-700"
              >
                Email Address
              </label>
              <input
                id="admin-email"
                type="email"
                name="email"
                defaultValue="admin@djimpex.in"
                placeholder="you@company.com"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#52968e] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#52968e]/20 transition"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="admin-password"
                className="block text-xs font-semibold text-slate-700"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 pr-11 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#52968e] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#52968e]/20 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff size={18} aria-hidden="true" />
                  ) : (
                    <Eye size={18} aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600">
                <input
                  type="checkbox"
                  name="remember"
                  defaultChecked
                  className="size-4 rounded border-slate-300 text-[#52968e] focus:ring-[#52968e]/30"
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="font-medium text-[#52968e] hover:underline"
              >
                Forgot password?
              </button>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isPending}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#52968e] py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#437d76] hover:shadow-lg active:scale-[0.99] disabled:opacity-70 cursor-pointer"
            >
              {isPending ? (
                <>
                  <span className="inline-block size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Signing in…</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          {/* Additional Info */}
          <div className="mt-6 border-t border-slate-100 pt-5 text-center text-xs text-slate-500">
            <p className="flex items-center justify-center gap-1.5 text-slate-400">
              <Lock size={13} aria-hidden="true" className="text-slate-400" />
              <span>Secure login · Protected by encrypted session</span>
            </p>
          </div>
        </div>
      </main>

      {/* Page Footer */}
      <footer className="relative z-10 p-6 text-center text-xs text-slate-500 sm:p-8">
        <p>
          © {new Date().getFullYear()} DJ Impex &amp; Co. All rights reserved. ·{" "}
          <Link href="/" className="hover:text-slate-800 transition">
            Privacy Policy
          </Link>{" "}
          ·{" "}
          <Link href="/" className="hover:text-slate-800 transition">
            Terms of Service
          </Link>{" "}
          ·{" "}
          <Link href="/#contact" className="hover:text-slate-800 transition">
            Support
          </Link>
        </p>
      </footer>

      {/* Forgot Password Modal */}
      {showForgotModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl border border-line/80 bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-2.5 text-navy font-semibold text-base">
              <ShieldCheck size={20} className="text-[#52968e]" />
              <span>Password Recovery</span>
            </div>
            <p className="mt-3 text-xs text-slate-600 leading-relaxed">
              If you forgot the administrator password, please check your project configuration (`ADMIN_PASSWORD` in `.env.local`) or contact the DJ Impex technical team at{" "}
              <a
                href="mailto:admin@djimpex.in"
                className="font-medium text-[#52968e] underline"
              >
                admin@djimpex.in
              </a>.
            </p>
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="rounded-lg bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
