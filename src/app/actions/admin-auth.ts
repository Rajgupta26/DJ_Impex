"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const SESSION_COOKIE = "dji_admin_session";
const DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD || "djimpex1995";

export type AuthState = {
  error?: string;
  success?: boolean;
};

export async function loginAdminAction(
  _prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  const password = formData.get("password")?.toString();
  const remember = formData.get("remember") === "on";

  if (!password) {
    return { error: "Please enter your password." };
  }

  const expectedPassword = process.env.ADMIN_PASSWORD || DEFAULT_PASSWORD;

  if (password !== expectedPassword) {
    return { error: "Invalid password. Please verify and try again." };
  }

  // Set session cookie
  const cookieStore = await cookies();
  const maxAge = remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24; // 30 days vs 24 hours

  cookieStore.set(SESSION_COOKIE, "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge,
    path: "/",
  });

  redirect("/admin/images");
}

export async function logoutAdminAction() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  redirect("/admin/login");
}

export async function checkAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.has(SESSION_COOKIE);
}
