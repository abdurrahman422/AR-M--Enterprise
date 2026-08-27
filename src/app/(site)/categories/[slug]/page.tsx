import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { IdentifyCta } from "@/components/catalog/identify-cta";
import { ProductGrid } from "@/components/catalog/product-grid";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { data } from "@/lib/data";
import { collectDescendantIds } from "@/lib/data/query";
import { createMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const categories = await data.categories.list();
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await data.categories.getBySlug(slug);
  if (!category) {
    return createMetadata({
      title: "Category not found",
      description: "This category is not published.",
      path: `/categories/${slug}`,
      noIndex: true,
    });
  }
  return createMetadata({
    title: category.seoTitle ?? category.title,
    description: category.seoDescription ?? category.summary ?? category.title,
    path: `/categories/${category.slug}`,
  });
}

export default async function CategoryDetailPage({ params }: Props) {
  const { slug } = await params;
  const [category, categories, products] = await Promise.all([
    data.categories.getBySlug(slug),
    data.categories.list(),
    data.products.list({ categorySlug: slug, includeDescendants: true }),
  ]);
  if (!category) notFound();

  const childIds = collectDescendantIds(categories, category.id).filter((id) => id !== category.id);
  const children = categories.filter((item) => childIds.includes(item.id) && item.parentId === category.id);

  return (
    <>
      <PageHeader
        eyebrow="Category"
        title={category.title}
        description={category.summary || category.description || "Published products in this category."}
      />
      <Container className="space-y-10 py-14 sm:py-16">
        {children.length > 0 ? (
          <section>
            <h2 className="text-xs uppercase tracking-[0.18em] text-muted">Subcategories</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {children.map((child) => (
                <li key={child.id}>
                  <Link
                    href={`/categories/${child.slug}`}
                    className="border border-border px-3 py-2 text-sm text-foreground hover:border-foreground/30"
                  >
                    {child.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
        {products.length === 0 ? (
          <EmptyState
            title="No products in this category"
            description="Products assigned here will appear once published. Pricing remains quote-based."
          />
        ) : (
          <ProductGrid products={products} categories={categories} />
        )}
        <IdentifyCta />
      </Container>
    </>
  );
}
