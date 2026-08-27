import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type CardProps = {
  href?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  meta?: string;
  children?: ReactNode;
  className?: string;
};

export function Card({ href, eyebrow, title, description, meta, children, className }: CardProps) {
  const content = (
    <>
      {eyebrow ? (
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted">{eyebrow}</p>
      ) : null}
      <h3 className="mt-3 font-heading text-xl text-foreground">{title}</h3>
      {description ? <p className="mt-3 text-sm leading-6 text-muted">{description}</p> : null}
      {meta ? <p className="mt-4 font-mono text-xs text-muted">{meta}</p> : null}
      {children}
    </>
  );

  const classes = cn(
    "block border border-border bg-surface p-6 transition-colors",
    href && "hover:border-foreground/30",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return <article className={classes}>{content}</article>;
}
