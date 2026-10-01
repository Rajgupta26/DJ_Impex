"use server";

import crypto from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { storage } from "@/lib/admin/storage";

const SESSION_COOKIE = "dji_admin_session";
const DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD || "djimpex1995";
const AUTH_DOC_KEY = "collections/auth.json";

export type AuthState = {
  error?: string;
  success?: boolean;
};

type StoredAuth = {
  passwordHash?: string;
  updatedAt?: string;
};

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, stored: string): boolean {
  if (stored.includes(":")) {
    const [salt, key] = stored.split(":");
    if (!salt || !key) return false;
    try {
      const keyBuffer = Buffer.from(key, "hex");
      const derivedKey = crypto.scryptSync(password, salt, 64);
      return crypto.timingSafeEqual(keyBuffer, derivedKey);
    } catch {
      return false;
    }
  }
  // Constant time comparison for plaintext fallback
  if (password.length !== stored.length) return false;
  return crypto.timingSafeEqual(Buffer.from(password), Buffer.from(stored));
}

async function getStoredPassword(): Promise<{ passwordHash?: string; version: string | null }> {
  try {
    const doc = await storage().readDoc(AUTH_DOC_KEY);
    if (!doc?.text) return { version: null };
    const parsed = JSON.parse(doc.text) as StoredAuth;
    return { passwordHash: parsed.passwordHash, version: doc.version };
  } catch {
    return { version: null };
  }
}

export async function loginAdminAction(
  _prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  const password = formData.get("password")?.toString();
  const remember = formData.get("remember") === "on";

  if (!password) {
    return { error: "Please enter your password." };
  }

  const { passwordHash } = await getStoredPassword();
  const isValid = passwordHash
    ? verifyPassword(password, passwordHash)
    : verifyPassword(password, process.env.ADMIN_PASSWORD || DEFAULT_PASSWORD);

  if (!isValid) {
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

export async function changeAdminPasswordAction(
  _prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  const oldPassword = formData.get("oldPassword")?.toString()?.trim() || "";
  const newPassword = formData.get("newPassword")?.toString() || "";
  const confirmPassword = formData.get("confirmPassword")?.toString() || "";

  if (!oldPassword) {
    return { error: "Please enter your current password." };
  }
  if (!newPassword) {
    return { error: "Please enter a new password." };
  }
  if (newPassword.length < 8) {
    return { error: "New password must be at least 8 characters long." };
  }
  if (newPassword !== confirmPassword) {
    return { error: "New password and confirmation do not match." };
  }

  const { passwordHash, version } = await getStoredPassword();
  const isOldValid = passwordHash
    ? verifyPassword(oldPassword, passwordHash)
    : verifyPassword(oldPassword, process.env.ADMIN_PASSWORD || DEFAULT_PASSWORD);

  if (!isOldValid) {
    return { error: "Current (old) password is incorrect." };
  }

  const newHash = hashPassword(newPassword);
  const authData: StoredAuth = {
    passwordHash: newHash,
    updatedAt: new Date().toISOString(),
  };

  try {
    await storage().writeDoc(
      AUTH_DOC_KEY,
      JSON.stringify(authData, null, 2) + "\n",
      version
    );
  } catch (error) {
    console.error("[admin-auth] Could not save updated password:", error);
    return { error: "Could not save the new password. Please try again." };
  }

  // Set authenticated session cookie
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });

  return { success: true };
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

