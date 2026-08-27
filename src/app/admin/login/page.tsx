import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/forms/admin-login-form";
import { SiteMark } from "@/components/layout/site-mark";
import { getAdminSession } from "@/lib/auth/session";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Admin sign in",
  description: "Administrator access for AR&M Enterprise.",
  path: "/admin/login",
  noIndex: true,
});

export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (session) {
    redirect("/admin");
  }

  return (
    <main id="main-content" className="flex min-h-full flex-1 items-center justify-center px-5 py-16">
      <div className="w-full max-w-md border border-border bg-surface p-8">
        <SiteMark />
        <h1 className="mt-8 font-heading text-2xl">Administrator sign in</h1>
        <p className="mt-2 text-sm text-muted">Protected console for catalog and request management.</p>
        <div className="mt-8">
          <AdminLoginForm />
        </div>
      </div>
    </main>
  );
}
