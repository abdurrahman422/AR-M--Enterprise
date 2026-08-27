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

  return (
    <>
      <PageHeader
        eyebrow="Catalog"
        title={activeCategory ? activeCategory.title : "Products"}
        description={
          activeCategory?.summary ||
          "Published equipment and systems. Listings do not include prices — request a quote or ask an engineer."
        }
      />
      <Container className="grid gap-10 py-12 lg:grid-cols-[16rem_minmax(0,1fr)] lg:py-16">
        <aside>
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
              <h2 className="font-heading text-2xl tracking-tight">Featured</h2>
              <div className="mt-5">
                <ProductGrid products={featured} categories={categories} />
              </div>
            </section>
          ) : null}
          {products.length === 0 ? (
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
                <h2 className="font-heading text-2xl tracking-tight">
                  {hasFilters ? "Results" : "All products"}
                </h2>
                <p className="font-mono text-xs text-muted">{products.length} listed</p>
              </div>
              <ProductGrid products={products} categories={categories} />
            </section>
          )}
          <IdentifyCta />
        </div>
      </Container>
    </>
  );
}
