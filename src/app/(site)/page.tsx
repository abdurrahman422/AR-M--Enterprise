import Link from "next/link";
import { IdentifyCta } from "@/components/catalog/identify-cta";
import { ProductGrid } from "@/components/catalog/product-grid";
import { EntryCard } from "@/components/content/entry-card";
import { QuoteCta } from "@/components/content/quote-cta";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/config/site";
import { data } from "@/lib/data";

const capabilityLinks = [
  { href: "/products", label: "Products", description: "Equipment and systems specified without public pricing." },
  { href: "/services", label: "Services", description: "Engineering, commissioning, and mill support." },
  { href: "/solutions", label: "Solutions", description: "Process-focused industrial applications." },
  { href: "/projects", label: "Projects", description: "Documented work, published only when verified." },
];

export default async function HomePage() {
  const [featured, categories, services] = await Promise.all([
    data.products.list({ featuredOnly: true }),
    data.categories.list(),
    data.services.list(),
  ]);

  return (
    <>
      <section className="border-b border-border">
        <Container className="py-20 sm:py-28">
          <p className="text-xs uppercase tracking-[0.22em] text-accent">{siteConfig.descriptor}</p>
          <h1 className="mt-6 max-w-4xl font-heading text-5xl leading-[1.05] tracking-tight text-foreground sm:text-6xl">
            {siteConfig.name}
          </h1>
          <p className="mt-6 max-w-2xl text-xl leading-8 text-muted">{siteConfig.tagline}</p>
          <div className="mt-10">
            <QuoteCta />
          </div>
        </Container>
      </section>
      <section>
        <Container className="py-16 sm:py-20">
          <div className="grid gap-4 sm:grid-cols-2">
            {capabilityLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="border border-border bg-surface p-6 transition-colors hover:border-foreground/30"
              >
                <h2 className="font-heading text-xl text-foreground">{item.label}</h2>
                <p className="mt-3 text-sm leading-6 text-muted">{item.description}</p>
              </Link>
            ))}
          </div>
        </Container>
      </section>
      {services.length > 0 ? (
        <section className="border-t border-border">
          <Container className="py-16 sm:py-20">
            <h2 className="font-heading text-2xl tracking-tight">Services</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {services.slice(0, 4).map((service, index) => (
                <EntryCard
                  key={service.id}
                  href={`/services/${service.slug}`}
                  index={String(index + 1).padStart(2, "0")}
                  title={service.title}
                  summary={service.summary}
                />
              ))}
            </div>
          </Container>
        </section>
      ) : null}
      {categories.length > 0 ? (
        <section className="border-t border-border">
          <Container className="py-16 sm:py-20">
            <h2 className="font-heading text-2xl tracking-tight">Categories</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {categories
                .filter((category) => !category.parentId)
                .sort((a, b) => a.sortOrder - b.sortOrder)
                .map((category) => (
                  <Link
                    key={category.id}
                    href={`/categories/${category.slug}`}
                    className="border border-border bg-surface p-5 hover:border-foreground/30"
                  >
                    <h3 className="font-heading text-lg">{category.title}</h3>
                    {category.summary ? (
                      <p className="mt-2 text-sm leading-6 text-muted">{category.summary}</p>
                    ) : null}
                  </Link>
                ))}
            </div>
          </Container>
        </section>
      ) : null}
      {featured.length > 0 ? (
        <section className="border-t border-border">
          <Container className="py-16 sm:py-20">
            <h2 className="font-heading text-2xl tracking-tight">Featured products</h2>
            <div className="mt-6">
              <ProductGrid products={featured} categories={categories} />
            </div>
          </Container>
        </section>
      ) : null}
      <Container className="pb-16 sm:pb-20">
        <IdentifyCta />
      </Container>
    </>
  );
}
