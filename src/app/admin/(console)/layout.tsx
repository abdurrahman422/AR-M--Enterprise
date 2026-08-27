import { AdminShell } from "@/components/layout/admin-shell";
import { requireAdmin } from "@/lib/auth/guards";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Admin",
  description: "AR&M Enterprise administration.",
  path: "/admin",
  noIndex: true,
});

export default async function AdminConsoleLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <AdminShell session={session}>{children}</AdminShell>
    </div>
  );
}
