import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { IdentifyCta } from "@/components/catalog/identify-cta";
import { ProductGallery } from "@/components/catalog/product-gallery";
import { ProductGrid } from "@/components/catalog/product-grid";
import { QuoteCta } from "@/components/content/quote-cta";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { productAvailabilityLabels } from "@/lib/constants";
import { data } from "@/lib/data";
import { relatedProducts } from "@/lib/data/query";
import { createMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await data.products.getBySlug(slug);
  if (!product) {
    return createMetadata({
      title: "Product not found",
      description: "This product is not published.",
      path: `/products/${slug}`,
      noIndex: true,
    });
  }

  return createMetadata({
    title: product.seoTitle ?? product.title,
    description: product.seoDescription ?? product.summary ?? product.title,
    path: `/products/${product.slug}`,
  });
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const [product, categories, catalog] = await Promise.all([
    data.products.getBySlug(slug),
    data.categories.list(),
    data.products.list(),
  ]);
  if (!product) notFound();

  const category =
    categories.find((item) => item.id === product.categoryId) ??
    categories.find((item) => item.slug === product.categorySlug);
  const related = relatedProducts(product, catalog);
  const specGroups = product.specifications.reduce<Record<string, typeof product.specifications>>((groups, spec) => {
    groups[spec.group] ??= [];
    groups[spec.group].push(spec);
    return groups;
  }, {});

  return (
    <Container className="space-y-20 py-16 sm:py-24">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:gap-16">
        <ProductGallery images={product.images} title={product.title} />
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-xs uppercase tracking-[0.22em] text-accent">
            {category ? (
              <Link href={`/products?category=${category.slug}`} className="hover:text-accent-hover">
                {category.title}
              </Link>
            ) : (
              "Product"
            )}
          </p>
          <h1 className="mt-4 font-heading text-4xl font-medium leading-tight tracking-[-0.035em] sm:text-6xl">{product.title}</h1>
          {product.summary ? <p className="mt-6 text-lg leading-8 text-muted">{product.summary}</p> : null}
          <div className="mt-6 flex flex-wrap gap-2">
            {product.brand ? <Badge>{product.brand}</Badge> : null}
            {product.model ? <Badge>{product.model}</Badge> : null}
            {product.sku ? <Badge>SKU {product.sku}</Badge> : null}
            <Badge>{productAvailabilityLabels[product.availability]}</Badge>
          </div>
          <dl className="mt-9 divide-y divide-border border-y border-border bg-surface/40 px-5 text-sm">
            {product.brand ? (
              <div className="grid grid-cols-2 gap-4 py-3">
                <dt className="text-muted">Brand</dt>
                <dd className="font-mono">{product.brand}</dd>
              </div>
            ) : null}
            {product.model ? (
              <div className="grid grid-cols-2 gap-4 py-3">
                <dt className="text-muted">Model</dt>
                <dd className="font-mono">{product.model}</dd>
              </div>
            ) : null}
            {product.sku ? (
              <div className="grid grid-cols-2 gap-4 py-3">
                <dt className="text-muted">SKU</dt>
                <dd className="font-mono">{product.sku}</dd>
              </div>
            ) : null}
            <div className="grid grid-cols-2 gap-4 py-3">
              <dt className="text-muted">Availability</dt>
              <dd>{productAvailabilityLabels[product.availability]}</dd>
            </div>
            <div className="grid grid-cols-2 gap-4 py-3">
              <dt className="text-muted">Commercial terms</dt>
              <dd>Quote on request</dd>
            </div>
          </dl>
          <div className="mt-8">
            <QuoteCta productTitle={product.title} />
          </div>
        </div>
      </div>
      {product.description ? (
        <section>
          <p className="text-xs uppercase tracking-[0.22em] text-accent">Equipment overview</p>
          <h2 className="mt-4 font-heading text-3xl sm:text-4xl">Built around the process requirement.</h2>
          <div className="mt-6 max-w-3xl whitespace-pre-wrap text-lg leading-9 text-muted">{product.description}</div>
        </section>
      ) : null}
      {product.specifications.length > 0 ? (
        <section>
          <h2 className="font-heading text-2xl">Technical specifications</h2>
          <div className="mt-6 space-y-8">
            {Object.entries(specGroups).map(([group, specs]) => (
              <div key={group}>
                <h3 className="text-xs uppercase tracking-[0.18em] text-muted">{group}</h3>
                <dl className="mt-3 divide-y divide-border border-y border-border">
                  {specs
                    .slice()
                    .sort((a, b) => a.sortOrder - b.sortOrder)
                    .map((spec) => (
                      <div key={spec.id} className="grid grid-cols-2 gap-4 py-3 text-sm">
                        <dt className="text-muted">{spec.label}</dt>
                        <dd className="font-mono text-foreground">
                          {spec.value}
                          {spec.unit ? ` ${spec.unit}` : ""}
                        </dd>
                      </div>
                    ))}
                </dl>
              </div>
            ))}
          </div>
        </section>
      ) : null}
      {product.documents.length > 0 ? (
        <section>
          <h2 className="font-heading text-2xl">Documents</h2>
          <ul className="mt-4 divide-y divide-border border-y border-border">
            {product.documents.map((document) => (
              <li key={document.id} className="flex items-center justify-between gap-4 py-3">
                <a href={document.url} className="text-sm text-foreground hover:text-accent">
                  {document.title}
                </a>
                <span className="font-mono text-xs uppercase text-muted">{document.fileType}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      <IdentifyCta />
      {related.length > 0 ? (
        <section>
          <h2 className="font-heading text-2xl">Related products</h2>
          <div className="mt-6">
            <ProductGrid products={related} categories={categories} />
          </div>
        </section>
      ) : null}
    </Container>
  );
}
