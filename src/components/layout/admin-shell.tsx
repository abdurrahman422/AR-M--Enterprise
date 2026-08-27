import Link from "next/link";
import { SiteMark } from "@/components/layout/site-mark";
import { adminNavigation } from "@/config/navigation";
import { logoutAdmin } from "@/app/admin/actions";
import type { AdminSession } from "@/types/auth";

export function AdminShell({
  children,
  session,
}: {
  children: React.ReactNode;
  session: AdminSession;
}) {
  return (
    <div className="min-h-full grid-cols-[16rem_1fr] bg-background lg:grid">
      <aside className="border-b border-border bg-surface lg:min-h-full lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between px-5 py-5">
          <SiteMark />
          <span className="text-[10px] uppercase tracking-[0.18em] text-muted">Admin</span>
        </div>
        <nav aria-label="Admin" className="px-3 pb-6">
          <ul className="space-y-1">
            {adminNavigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-sm px-3 py-2 text-sm text-muted hover:bg-surface-elevated hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <div className="flex min-w-0 flex-col">
        <div className="flex items-center justify-between border-b border-border px-5 py-3 text-sm text-muted">
          <p>{session.email}</p>
          <form action={logoutAdmin}>
            <button type="submit" className="text-foreground hover:text-accent">
              Sign out
            </button>
          </form>
        </div>
        <div className="flex-1 px-5 py-8 sm:px-8">{children}</div>
      </div>
    </div>
  );
}
