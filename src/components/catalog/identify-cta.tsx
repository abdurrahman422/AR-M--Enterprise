import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function IdentifyCta({ className }: { className?: string }) {
  return (
    <section className={cn("border border-border bg-surface px-6 py-8 sm:px-8", className)}>
      <p className="text-xs uppercase tracking-[0.18em] text-accent">Engineering support</p>
      <h2 className="mt-3 font-heading text-2xl tracking-tight">{siteConfig.ctas.identify.label}</h2>
      <p className="mt-3 max-w-xl text-sm leading-6 text-muted">
        Send a photo, stamping, or mill context. An engineer will help match the component. This is not a public price list.
      </p>
      <div className="mt-6">
        <Button href={siteConfig.ctas.identify.href}>Identify a part</Button>
      </div>
    </section>
  );
}
