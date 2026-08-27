import { createCategoryAction } from "@/app/admin/catalog-actions";
import { CategoryForm } from "@/components/admin/category-form";
import { data, getDataProvider } from "@/lib/data";

export default async function NewCategoryPage() {
  const provider = getDataProvider();
  const categories = await data.categories.list({ includeUnpublished: true });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-muted">Catalog</p>
        <h1 className="mt-2 font-heading text-3xl tracking-tight">New category</h1>
      </div>
      <CategoryForm
        categories={categories}
        driver={provider.driver}
        writable={provider.writable}
        action={createCategoryAction}
      />
    </div>
  );
}
