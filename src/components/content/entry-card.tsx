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
    <article className={cn("group relative flex h-full flex-col overflow-hidden rounded-[1.4rem] border border-border bg-white shadow-[0_12px_45px_rgba(9,35,62,.06)] transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-[0_20px_55px_rgba(9,35,62,.12)]", className)}>
      {image ? (
        <div className="aspect-[16/10] overflow-hidden bg-surface-elevated">
          <CatalogMedia src={image.url} alt={image.alt || title} />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col p-6 sm:p-8">
        {index ? <p className="font-mono text-xs font-medium text-accent">{index}</p> : null}
        {meta ? <p className="text-[11px] uppercase tracking-[0.18em] text-muted">{meta}</p> : null}
        <h2 className={cn("font-heading text-2xl font-semibold leading-snug tracking-[-.025em]", index || meta ? "mt-3" : "")}>{title}</h2>
        {summary ? <p className="mt-3 text-sm leading-6 text-muted">{summary}</p> : null}
        <p className="mt-auto flex items-center justify-between pt-8 text-sm font-semibold text-accent">Open scope <span className="grid h-9 w-9 place-items-center rounded-full bg-accent text-white transition-transform group-hover:translate-x-1" aria-hidden="true">→</span></p>
      </div>
      <Link href={href} className="absolute inset-0 rounded-[1.4rem]" aria-label={`Open scope: ${title}`}><span className="sr-only">Open scope: {title}</span></Link>
    </article>
  );
}
