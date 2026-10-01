"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useState } from "react";
import { Eye, EyeOff, Lock, ShieldCheck } from "lucide-react";

import { loginAdminAction, type AuthState } from "@/app/actions/admin-auth";
import { ChangePasswordModal } from "@/components/admin/ChangePasswordModal";

export function AdminLoginForm() {
  const [state, formAction, isPending] = useActionState<AuthState, FormData>(
    loginAdminAction,
    {}
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  return (
    <div className="relative min-h-dvh w-full bg-[#f8fafc] text-[#0f172a] flex flex-col justify-between">
      {/* Top Header Branding */}
      <header className="p-6 sm:p-8">
        <Link href="/" className="inline-flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center shrink-0">
            <Image
              src="/images/logos/dji-logo-transparent.png"
              alt="DJ Impex"
              width={48}
              height={48}
              className="h-9 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </div>
          <div>
            <span className="block font-sans text-xl font-bold tracking-tight text-[#172850]">
              DJ Impex
            </span>
            <span className="block text-xs font-medium text-[#64748b] tracking-wide">
              Nabeen® Admin Portal
            </span>
          </div>
        </Link>
      </header>

      {/* Centered Login Card */}
      <main className="flex items-center justify-center px-4 py-6 sm:px-6">
        <div className="w-full max-w-[420px] rounded-2xl border border-[#e2e8f0] bg-white p-7 sm:p-9 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
          {/* Card Header with Centered Logo */}
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f1f5f9] border border-[#e2e8f0] shadow-xs">
              <Image
                src="/images/logos/dji-logo-transparent.png"
                alt="DJ Impex"
                width={40}
                height={40}
                className="h-8 w-auto object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[#0f172a]">
              Welcome back
            </h1>
            <p className="mt-1.5 text-xs text-[#64748b]">
              Sign in to manage images, fabrics and site content
            </p>
          </div>

          {/* Form */}
          <form action={formAction} className="mt-6 space-y-4">
            {state?.error ? (
              <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700 font-medium"
              >
                {state.error}
              </div>
            ) : null}

            {/* Email Address */}
            <div className="space-y-1.5">
              <label htmlFor="admin-email" className="block text-xs font-semibold uppercase tracking-wide text-[#475569]">
                Email Address
              </label>
              <input
                id="admin-email"
                type="email"
                name="email"
                defaultValue="admin@djimpex.in"
                placeholder="admin@djimpex.in"
                className="w-full rounded-lg border border-[#cbd5e1] bg-white px-3.5 py-2.5 text-sm text-[#0f172a] placeholder:text-[#94a3b8] focus:border-[#172850] focus:ring-2 focus:ring-[#172850]/20 focus:outline-none transition shadow-xs"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="admin-password" className="block text-xs font-semibold uppercase tracking-wide text-[#475569]">
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  placeholder="••••••••••••"
                  className="w-full rounded-lg border border-[#cbd5e1] bg-white px-3.5 py-2.5 pr-10 text-sm text-[#0f172a] placeholder:text-[#94a3b8] focus:border-[#172850] focus:ring-2 focus:ring-[#172850]/20 focus:outline-none transition shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#475569] transition cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff size={16} aria-hidden="true" />
                  ) : (
                    <Eye size={16} aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-[#475569]">
                <input
                  type="checkbox"
                  name="remember"
                  defaultChecked
                  className="size-4 rounded border-[#cbd5e1] text-[#172850] focus:ring-[#172850]/20"
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="font-medium text-[#172850] hover:underline cursor-pointer"
              >
                Forgot password?
              </button>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isPending}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-[#172850] hover:bg-[#24386a] py-2.5 text-sm font-semibold text-white shadow-sm transition active:scale-[0.99] disabled:opacity-60 cursor-pointer"
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

          {/* Security Notice */}
          <div className="mt-6 border-t border-[#e2e8f0] pt-4 text-center text-xs text-[#94a3b8]">
            <p className="flex items-center justify-center gap-1.5">
              <Lock size={12} aria-hidden="true" />
              <span>Protected administrator session</span>
            </p>
          </div>
        </div>
      </main>

      {/* Page Footer */}
      <footer className="p-6 text-center text-xs text-[#94a3b8]">
        <p>
          © {new Date().getFullYear()} DJ Impex &amp; Co. ·{" "}
          <Link href="/" className="hover:text-[#475569] transition">
            Back to Website
          </Link>
        </p>
      </footer>

      {/* Password Reset Modal */}
      <ChangePasswordModal
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
        redirectTo="/admin/images"
      />
    </div>
  );
}
