import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function SiteMark({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("group flex items-center gap-3", className)} aria-label={`${siteConfig.name} home`}>
      <span className="relative h-11 w-11 overflow-hidden rounded-xl border border-border bg-white shadow-sm">
        <Image src="/brand-mark.jpg" alt="" fill sizes="44px" className="scale-[1.75] object-cover object-[50%_38%]" />
      </span>
      <span className="flex flex-col">
        <span className="font-heading text-base font-bold leading-none tracking-[-.03em] text-foreground">{siteConfig.shortName}</span>
        <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-muted">Enterprise</span>
      </span>
    </Link>
  );
}
