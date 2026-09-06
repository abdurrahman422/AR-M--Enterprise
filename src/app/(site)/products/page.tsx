import { CatalogFilters } from "@/components/catalog/catalog-filters";
import { IdentifyCta } from "@/components/catalog/identify-cta";
import { ProductGrid } from "@/components/catalog/product-grid";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { productAvailabilityLabels } from "@/lib/constants";
import { data } from "@/lib/data";
import { createMetadata } from "@/lib/seo";
import type { ProductAvailability } from "@/types/content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = createMetadata({
  title: "Products",
  description: "Feed mill equipment and industrial products from AR&M Enterprise. Pricing is provided through quote requests.",
  path: "/products",
});

function isAvailability(value?: string): value is ProductAvailability {
  return Boolean(value && value in productAvailabilityLabels);
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; availability?: string; featured?: string }>;
}) {
  const params = await searchParams;
  const availability = isAvailability(params.availability) ? params.availability : undefined;
  const featuredOnly = params.featured === "1";
  const hasFilters = Boolean(params.q || params.category || availability || featuredOnly);

  const [categories, products, featured] = await Promise.all([
    data.categories.list(),
    data.products.list({
      query: params.q,
      categorySlug: params.category,
      availability,
      featuredOnly,
      includeDescendants: true,
    }),
    data.products.list({ featuredOnly: true }),
  ]);

  const activeCategory = categories.find((category) => category.slug === params.category);
  const featuredIds = new Set(featured.map((product) => product.id));
  const catalogProducts = hasFilters
    ? products
    : products.filter((product) => !featuredIds.has(product.id));

  return (
    <>
      <PageHeader
        eyebrow="Catalog"
        title={activeCategory ? activeCategory.title : "Equipment for every stage of production."}
        description={
          activeCategory?.summary ||
          "Explore intake, processing, pelleting, handling, storage, utilities, automation, and critical spares. Every system is specified and quoted against your plant requirement."
        }
      />
      <Container className="grid gap-10 py-16 lg:grid-cols-[17rem_minmax(0,1fr)] lg:py-24">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <CatalogFilters
            categories={categories}
            values={{
              q: params.q,
              category: params.category,
              availability,
              featured: featuredOnly,
            }}
          />
        </aside>
        <div className="space-y-10">
          {!hasFilters && featured.length > 0 ? (
            <section>
              <p className="text-xs font-semibold uppercase tracking-[.2em] text-accent">Priority systems</p><h2 className="mt-3 font-heading text-4xl font-semibold tracking-[-.04em]">Start with the production core.</h2>
              <div className="mt-5">
                <ProductGrid products={featured} categories={categories} />
              </div>
            </section>
          ) : null}
          {catalogProducts.length === 0 ? (
            <EmptyState
              title={hasFilters ? "No matching products" : "No products published yet"}
              description={
                hasFilters
                  ? "Adjust search or category filters, or send a photo if the part is unmarked."
                  : "Product records appear here after they are added and published. There are no public prices."
              }
              action={
                hasFilters ? (
                  <Button href="/products" variant="outline" size="sm">
                    Clear filters
                  </Button>
                ) : (
                  <Button href="/identify-part" variant="outline" size="sm">
                    Identify a part
                  </Button>
                )
              }
            />
          ) : (
            <section>
              <div className="mb-5 flex items-end justify-between gap-4">
                <h2 className="font-heading text-3xl font-semibold tracking-[-.04em]">
                  {hasFilters ? "Results" : "Complete catalog"}
                </h2>
                <p className="font-mono text-xs text-muted">{catalogProducts.length} listed</p>
              </div>
              <ProductGrid products={catalogProducts} categories={categories} />
            </section>
          )}
          <IdentifyCta />
        </div>
      </Container>
    </>
  );
}
