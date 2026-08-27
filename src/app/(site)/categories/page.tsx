import Link from "next/link";
import { IdentifyCta } from "@/components/catalog/identify-cta";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { data } from "@/lib/data";
import { buildCategoryTree } from "@/lib/data/query";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Categories",
  description: "Product and equipment categories for AR&M Enterprise.",
  path: "/categories",
});

export default async function CategoriesPage() {
  const [categories, products] = await Promise.all([data.categories.list(), data.products.list()]);
  const tree = buildCategoryTree(categories);
  const counts = new Map<string, number>();
  for (const category of categories) {
    counts.set(
      category.id,
      products.filter(
        (product) => product.categoryId === category.id || product.categorySlug === category.slug,
      ).length,
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Catalog"
        title="Categories"
        description="Equipment is grouped by plant function. Subcategories appear when they are published."
      />
      <Container className="space-y-10 py-14 sm:py-16">
        {tree.length === 0 ? (
          <EmptyState
            title="No categories published yet"
            description="Categories will appear here after they are created and published."
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {tree.map((category) => (
              <article key={category.id} className="border border-border bg-surface p-6">
                <p className="font-mono text-xs text-muted">{String(counts.get(category.id) ?? 0).padStart(2, "0")} listed</p>
                <h2 className="mt-3 font-heading text-2xl">
                  <Link href={`/categories/${category.slug}`} className="hover:text-offwhite">
                    {category.title}
                  </Link>
                </h2>
                {category.summary ? <p className="mt-3 text-sm leading-6 text-muted">{category.summary}</p> : null}
                {category.children.length > 0 ? (
                  <ul className="mt-5 space-y-2">
                    {category.children.map((child) => (
                      <li key={child.id}>
                        <Link href={`/categories/${child.slug}`} className="text-sm text-foreground hover:text-accent">
                          {child.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))}
          </div>
        )}
        <IdentifyCta />
      </Container>
    </>
  );
}
