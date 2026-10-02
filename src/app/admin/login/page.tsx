import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { checkAdminSession } from "@/app/actions/admin-auth";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export const metadata: Metadata = {
  title: "Sign In · D J Impex Admin",
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const isAuthenticated = await checkAdminSession();

  if (isAuthenticated) {
    redirect("/admin/images");
  }

  return <AdminLoginForm />;
}
