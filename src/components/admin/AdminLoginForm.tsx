"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

import { loginAdminAction, type AuthState } from "@/app/actions/admin-auth";
import { ChangePasswordModal } from "@/components/admin/ChangePasswordModal";
import { buttonPrimary, card, inputClass, labelClass } from "@/components/admin/ui";

export function AdminLoginForm() {
  const [state, formAction, isPending] = useActionState<AuthState, FormData>(
    loginAdminAction,
    {}
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  return (
    <div className="relative min-h-dvh w-full bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col justify-between">
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
            <span className="block font-sans text-xl font-bold tracking-tight text-navy dark:text-white">
              DJ Impex
            </span>
            <span className="block text-xs font-medium text-slate-500 dark:text-slate-400 tracking-wide">
              Nabeen® Admin Portal
            </span>
          </div>
        </Link>
      </header>

      {/* Centered Login Card */}
      <main className="flex items-center justify-center px-4 py-6 sm:px-6">
        <div className={`${card} w-full max-w-[420px] p-7 sm:p-9 shadow-md`}>
          {/* Card Header with Centered Logo */}
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 shadow-xs">
              <Image
                src="/images/logos/dji-logo-transparent.png"
                alt="DJ Impex"
                width={40}
                height={40}
                className="h-8 w-auto object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Welcome back
            </h1>
            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
              Sign in to manage images, fabrics and site content
            </p>
          </div>

          {/* Form */}
          <form action={formAction} className="mt-6 space-y-4">
            {state?.error ? (
              <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
              >
                {state.error}
              </div>
            ) : null}

            {/* Email Address */}
            <div className="space-y-1.5">
              <label htmlFor="admin-email" className={labelClass}>
                Email Address
              </label>
              <input
                id="admin-email"
                type="email"
                name="email"
                defaultValue="admin@djimpex.in"
                placeholder="admin@djimpex.in"
                className={inputClass}
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="admin-password" className={labelClass}>
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  placeholder="••••••••••••"
                  className={`${inputClass} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition"
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
              <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 dark:text-slate-400">
                <input
                  type="checkbox"
                  name="remember"
                  defaultChecked
                  className="size-4 rounded border-slate-300 text-navy focus:ring-navy/20 dark:border-slate-700 dark:bg-slate-950"
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="font-medium text-navy hover:underline dark:text-slate-300 cursor-pointer"
              >
                Forgot password?
              </button>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isPending}
              className={`${buttonPrimary} w-full py-2.5 mt-2 text-sm cursor-pointer`}
            >
              {isPending ? (
                <>
                  <span className="inline-block size-4 animate-spin rounded-full border-2 border-white border-t-transparent dark:border-slate-900" />
                  <span>Signing in…</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 border-t border-slate-100 pt-4 text-center text-xs text-slate-400 dark:border-slate-800 dark:text-slate-500">
            <p className="flex items-center justify-center gap-1.5">
              <Lock size={12} aria-hidden="true" />
              <span>Protected administrator session</span>
            </p>
          </div>
        </div>
      </main>

      {/* Page Footer */}
      <footer className="p-6 text-center text-xs text-slate-400 dark:text-slate-500">
        <p>
          © {new Date().getFullYear()} DJ Impex &amp; Co. ·{" "}
          <Link href="/" className="hover:text-slate-600 dark:hover:text-slate-300 transition">
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
