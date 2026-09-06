import Image from "next/image";
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

  if (src.startsWith("/")) {
    return (
      <Image
        src={src}
        alt={alt}
        width={800}
        height={640}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className={cn("h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]", className)}
      />
    );
  }

  return (
    // External catalog URLs are admin-entered and not known at build time.
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} loading="lazy" decoding="async" className={cn("h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]", className)} />
  );
}
