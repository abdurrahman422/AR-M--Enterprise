import Link from "next/link";
import { CatalogMedia } from "@/components/catalog/catalog-media";
import { cn } from "@/lib/utils";

export function EntryCard({
  href,
  index,
  title,
  summary,
  meta,
  image,
  className,
}: {
  href: string;
  index?: string;
  title: string;
  summary?: string;
  meta?: string;
  image?: { url: string; alt: string };
  className?: string;
}) {
  return (
    <article className={cn("flex h-full flex-col border border-border bg-surface", className)}>
      {image ? (
        <Link href={href} className="block aspect-[16/10] overflow-hidden bg-surface-elevated">
          <CatalogMedia src={image.url} alt={image.alt || title} />
        </Link>
      ) : null}
      <div className="flex flex-1 flex-col p-6">
        {index ? <p className="font-mono text-xs text-muted">{index}</p> : null}
        {meta ? <p className="text-[11px] uppercase tracking-[0.18em] text-muted">{meta}</p> : null}
        <h2 className={cn("font-heading text-2xl leading-snug", index || meta ? "mt-3" : "")}>
          <Link href={href} className="hover:text-offwhite">
            {title}
          </Link>
        </h2>
        {summary ? <p className="mt-3 text-sm leading-6 text-muted">{summary}</p> : null}
        <p className="mt-auto pt-6 text-sm text-foreground">View details</p>
      </div>
    </article>
  );
}
