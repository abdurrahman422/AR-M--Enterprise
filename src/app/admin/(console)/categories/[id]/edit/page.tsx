import { notFound } from "next/navigation";
import { deleteCategoryAction, updateCategoryAction } from "@/app/admin/catalog-actions";
import { AdminBanner } from "@/components/admin/admin-banner";
import { CategoryForm } from "@/components/admin/category-form";
import { data, getDataProvider } from "@/lib/data";

export default async function EditCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string; saved?: string }>;
}) {
  const { id } = await params;
  const notice = await searchParams;
  const provider = getDataProvider();
  const [category, categories] = await Promise.all([
    data.categories.getById(id, { includeUnpublished: true }),
    data.categories.list({ includeUnpublished: true }),
  ]);
  if (!category) notFound();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-muted">Catalog</p>
        <h1 className="mt-2 font-heading text-3xl tracking-tight">Edit category</h1>
      </div>
      <AdminBanner created={notice.created} saved={notice.saved} />
      <CategoryForm
        category={category}
        categories={categories}
        driver={provider.driver}
        writable={provider.writable}
        action={updateCategoryAction}
        deleteAction={deleteCategoryAction}
      />
    </div>
  );
}
