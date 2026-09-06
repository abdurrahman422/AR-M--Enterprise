import { ProductCard } from "@/components/catalog/product-card";
import type { Category, Product } from "@/types/content";

export function ProductGrid({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const byId = new Map(categories.map((category) => [category.id, category]));
  const bySlug = new Map(categories.map((category) => [category.slug, category]));

  return (
    <div className="grid gap-x-7 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          category={
            (product.categoryId ? byId.get(product.categoryId) : undefined) ??
            (product.categorySlug ? bySlug.get(product.categorySlug) : undefined)
          }
        />
      ))}
    </div>
  );
}
