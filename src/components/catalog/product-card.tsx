import Link from "next/link";
import { CatalogMedia } from "@/components/catalog/catalog-media";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { productAvailabilityLabels } from "@/lib/constants";
import { siteConfig } from "@/config/site";
import type { Category, Product } from "@/types/content";

export function ProductCard({
  product,
  category,
}: {
  product: Product;
  category?: Category;
}) {
  const image = [...product.images].sort((a, b) => a.sortOrder - b.sortOrder)[0];
  const quoteHref = `${siteConfig.ctas.quote.href}?product=${encodeURIComponent(product.title)}&slug=${encodeURIComponent(product.slug)}`;
  const meta = [product.brand, product.model].filter(Boolean).join(" · ");

  return (
    <article className="flex h-full flex-col border border-border bg-surface">
      <Link href={`/products/${product.slug}`} className="block aspect-[4/3] overflow-hidden bg-surface-elevated">
        <CatalogMedia src={image?.url} alt={image?.alt || product.title} />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        {category ? (
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted">{category.title}</p>
        ) : product.categorySlug ? (
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted">{product.categorySlug}</p>
        ) : null}
        <h3 className="mt-2 font-heading text-xl leading-snug">
          <Link href={`/products/${product.slug}`} className="hover:text-offwhite">
            {product.title}
          </Link>
        </h3>
        {meta ? <p className="mt-2 font-mono text-xs text-muted">{meta}</p> : null}
        <div className="mt-4">
          <Badge>{productAvailabilityLabels[product.availability]}</Badge>
        </div>
        <div className="mt-auto flex flex-wrap gap-2 pt-5">
          <Button href={quoteHref} size="sm">
            {siteConfig.ctas.quote.label}
          </Button>
          <Button href={siteConfig.ctas.engineer.href} variant="outline" size="sm">
            {siteConfig.ctas.engineer.label}
          </Button>
        </div>
      </div>
    </article>
  );
}
