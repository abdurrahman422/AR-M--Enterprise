"use client";

import Link from "next/link";
import { useState } from "react";
import { SiteMark } from "@/components/layout/site-mark";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { primaryNavigation } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-white/90 shadow-[0_4px_24px_rgba(9,35,62,.04)] backdrop-blur-xl">
      <Container className="flex h-[82px] items-center justify-between gap-6">
        <SiteMark />
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {primaryNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative py-2 text-[12px] font-semibold uppercase tracking-[0.09em] text-foreground/65 transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:origin-left after:scale-x-0 after:bg-accent after:transition-transform hover:text-foreground hover:after:scale-x-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden lg:block">
          <Button href={siteConfig.ctas.quote.href} size="sm">
            {siteConfig.ctas.quote.label}
          </Button>
        </div>
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-foreground/30 text-foreground lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <span aria-hidden="true" className="flex flex-col gap-1.5">
            <span className={cn("h-px w-4 bg-current transition", open && "translate-y-1 rotate-45")} />
            <span className={cn("h-px w-4 bg-current transition", open && "opacity-0")} />
            <span className={cn("h-px w-4 bg-current transition", open && "-translate-y-1 -rotate-45")} />
          </span>
        </button>
      </Container>
      {open ? (
        <div id="mobile-navigation" className="border-t border-foreground/15 bg-background lg:hidden">
          <Container className="flex flex-col gap-4 py-5">
            <nav aria-label="Mobile">
              <ul className="flex flex-col gap-3">
                {primaryNavigation.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="block py-1 text-base text-foreground"
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <Button href={siteConfig.ctas.quote.href} onClick={() => setOpen(false)}>
              {siteConfig.ctas.quote.label}
            </Button>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
