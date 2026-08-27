import { cn } from "@/lib/utils";

type StatusMessageProps = {
  tone?: "neutral" | "danger" | "success";
  children: string;
};

export function StatusMessage({ tone = "neutral", children }: StatusMessageProps) {
  return (
    <p
      role={tone === "danger" ? "alert" : "status"}
      className={cn(
        "text-sm leading-6",
        tone === "neutral" && "text-muted",
        tone === "danger" && "text-danger",
        tone === "success" && "text-foreground",
      )}
    >
      {children}
    </p>
  );
}
