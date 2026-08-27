import Link from "next/link";
import { AdminBanner } from "@/components/admin/admin-banner";
import { DriverNote } from "@/components/admin/driver-note";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { productAvailabilityLabels } from "@/lib/constants";
import { data, getDataProvider } from "@/lib/data";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; status?: string; created?: string; deleted?: string; error?: string }>;
}) {
  const params = await searchParams;
  const provider = getDataProvider();
  const [products, categories] = await Promise.all([
    data.products.list({
      includeUnpublished: true,
      query: params.q,
      categorySlug: params.category,
      includeDescendants: true,
    }),
    data.categories.list({ includeUnpublished: true }),
  ]);

  const filtered = products.filter((product) => {
    if (params.status === "published") return product.published;
    if (params.status === "draft") return !product.published;
    return true;
  });

  const categoryName = (product: (typeof products)[number]) =>
    categories.find((category) => category.id === product.categoryId)?.title ??
    categories.find((category) => category.slug === product.categorySlug)?.title ??
    "—";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted">Catalog</p>
          <h1 className="mt-2 font-heading text-3xl tracking-tight">Products</h1>
          <div className="mt-2">
            <DriverNote driver={provider.driver} writable={provider.writable} entity="Products" />
          </div>
        </div>
        <Button href="/admin/products/new">New product</Button>
      </div>
      <AdminBanner created={params.created} deleted={params.deleted} error={params.error} />
      <form className="grid gap-3 sm:grid-cols-4" method="get">
        <Input name="q" defaultValue={params.q} placeholder="Search title, SKU, brand" />
        <Select name="category" defaultValue={params.category ?? ""}>
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.slug}>
              {category.title}
            </option>
          ))}
        </Select>
        <Select name="status" defaultValue={params.status ?? "all"}>
          <option value="all">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </Select>
        <Button type="submit" variant="outline">
          Filter
        </Button>
      </form>
      <div className="overflow-x-auto border border-border">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-surface text-xs uppercase tracking-[0.14em] text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">SKU</th>
              <th className="px-4 py-3 font-medium">Availability</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium"> </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-muted">
                  No products match these filters. Public prices are never stored on this list.
                </td>
              </tr>
            ) : (
              filtered.map((product) => (
                <tr key={product.id} className="border-t border-border">
                  <td className="px-4 py-3">
                    <p className="text-foreground">{product.title}</p>
                    {product.featured ? <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-accent">Featured</p> : null}
                  </td>
                  <td className="px-4 py-3 text-muted">{categoryName(product)}</td>
                  <td className="px-4 py-3 font-mono text-xs">{product.sku ?? "—"}</td>
                  <td className="px-4 py-3">
                    <Badge>{productAvailabilityLabels[product.availability]}</Badge>
                  </td>
                  <td className="px-4 py-3 text-muted">{product.published ? "Published" : "Draft"}</td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/products/${product.id}/edit`} className="text-sm hover:text-accent">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
