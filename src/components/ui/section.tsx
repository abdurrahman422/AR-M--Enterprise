import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  tone?: "default" | "surface";
};

export function Section({ children, className, id, tone = "default" }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "py-16 sm:py-24",
        tone === "surface" && "bg-surface",
        className,
      )}
    >
      {children}
    </section>
  );
}
