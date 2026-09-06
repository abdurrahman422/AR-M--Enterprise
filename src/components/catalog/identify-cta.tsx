import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function IdentifyCta({ className }: { className?: string }) {
  return (
    <section className={cn("relative overflow-hidden bg-[#d8ff55] px-7 py-10 sm:px-12 sm:py-14", className)}>
      <span className="absolute -right-4 -top-12 font-heading text-[12rem] font-semibold leading-none text-foreground/[.06]">?</span>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Unknown part? Start here.</p>
      <h2 className="mt-3 max-w-2xl font-heading text-3xl font-semibold tracking-[-.04em] sm:text-5xl">A photo may be enough to get the search moving.</h2>
      <p className="mt-4 max-w-xl text-sm leading-6 text-foreground/70">
        Send the nameplate, dimensions or installed position. We will build the identification trail with you.
      </p>
      <div className="mt-7">
        <Button href={siteConfig.ctas.identify.href}>Identify a part</Button>
      </div>
    </section>
  );
}
