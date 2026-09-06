import { cn } from "@/lib/utils";

export function CatalogMedia({
  src,
  alt,
  className,
}: {
  src?: string;
  alt: string;
  className?: string;
}) {
  if (!src) {
    return (
      <div
        className={cn("flex h-full w-full items-end bg-surface-elevated p-4", className)}
        aria-hidden="true"
      >
        <span className="text-[10px] uppercase tracking-[0.18em] text-muted">No image</span>
      </div>
    );
  }

  return (
    // External catalog URLs are admin-entered and not known at build time.
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={cn("h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]", className)} />
  );
}
