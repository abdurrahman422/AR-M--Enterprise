import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("border border-border bg-surface px-6 py-12 sm:px-10", className)}>
      <h2 className="font-heading text-xl text-foreground">{title}</h2>
      <p className="mt-3 max-w-xl text-sm leading-6 text-muted">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
