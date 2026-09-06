import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
};

export function PageHeader({ eyebrow, title, description, actions, className }: PageHeaderProps) {
  return (
    <header className={cn("relative isolate overflow-hidden border-b border-white/10 bg-foreground text-white", className)}>
      <div className="absolute -right-20 -top-32 -z-10 h-96 w-96 rounded-full bg-accent/25 blur-3xl" />
      <Container className="py-16 sm:py-24">
        {eyebrow ? (
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.26em] text-accent-soft"><span className="h-[2px] w-9 bg-accent" />{eyebrow}</p>
        ) : null}
        <div className="mt-6 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <h1 className="font-heading text-5xl font-semibold leading-[0.94] tracking-[-0.055em] text-white sm:text-7xl">
              {title}
            </h1>
            {description ? (
              <p className="mt-6 max-w-2xl text-base font-medium leading-8 text-white/65 sm:text-lg">{description}</p>
            ) : null}
          </div>
          {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
        </div>
      </Container>
    </header>
  );
}
