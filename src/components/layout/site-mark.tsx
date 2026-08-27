import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function SiteMark({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("group flex flex-col", className)} aria-label={`${siteConfig.name} home`}>
      <span className="font-heading text-lg leading-none tracking-tight text-foreground">
        {siteConfig.shortName}
      </span>
      <span className="mt-1 text-[10px] uppercase tracking-[0.22em] text-muted">
        Enterprise
      </span>
    </Link>
  );
}
