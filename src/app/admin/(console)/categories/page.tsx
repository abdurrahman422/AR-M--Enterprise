import Link from "next/link";
import { AdminBanner } from "@/components/admin/admin-banner";
import { DriverNote } from "@/components/admin/driver-note";
import { Button } from "@/components/ui/button";
import { data, getDataProvider } from "@/lib/data";
import { buildCategoryTree } from "@/lib/data/query";

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string; deleted?: string; error?: string }>;
}) {
  const params = await searchParams;
  const provider = getDataProvider();
  const [categories, products] = await Promise.all([
    data.categories.list({ includeUnpublished: true }),
    data.products.list({ includeUnpublished: true }),
  ]);
  const tree = buildCategoryTree(categories);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted">Catalog</p>
          <h1 className="mt-2 font-heading text-3xl tracking-tight">Categories</h1>
          <div className="mt-2">
            <DriverNote driver={provider.driver} writable={provider.writable} entity="Categories" />
          </div>
        </div>
        <Button href="/admin/categories/new">New category</Button>
      </div>
      <AdminBanner created={params.created} deleted={params.deleted} error={params.error} />
      <div className="overflow-x-auto border border-border">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-surface text-xs uppercase tracking-[0.14em] text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">Products</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium"> </th>
            </tr>
          </thead>
          <tbody>
            {tree.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-muted">
                  No categories yet.
                </td>
              </tr>
            ) : (
              tree.flatMap((category) => [category, ...category.children]).map((category) => {
                const count = products.filter(
                  (product) => product.categoryId === category.id || product.categorySlug === category.slug,
                ).length;
                return (
                  <tr key={category.id} className="border-t border-border">
                    <td className="px-4 py-3">
                      {category.parentId ? (
                        <span className="text-muted">— {category.title}</span>
                      ) : (
                        category.title
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted">{category.slug}</td>
                    <td className="px-4 py-3 font-mono text-xs">{count}</td>
                    <td className="px-4 py-3 text-muted">{category.published ? "Published" : "Draft"}</td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/categories/${category.id}/edit`} className="text-sm hover:text-accent">
                        Edit
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
