import { createProductAction } from "@/app/admin/catalog-actions";
import { ProductForm } from "@/components/admin/product-form";
import { data, getDataProvider } from "@/lib/data";

export default async function NewProductPage() {
  const provider = getDataProvider();
  const categories = await data.categories.list({ includeUnpublished: true });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-muted">Catalog</p>
        <h1 className="mt-2 font-heading text-3xl tracking-tight">New product</h1>
      </div>
      <ProductForm
        categories={categories}
        driver={provider.driver}
        writable={provider.writable}
        action={createProductAction}
      />
    </div>
  );
}
