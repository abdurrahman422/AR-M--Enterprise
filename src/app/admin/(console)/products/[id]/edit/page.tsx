import { notFound } from "next/navigation";
import { deleteProductAction, updateProductAction } from "@/app/admin/catalog-actions";
import { AdminBanner } from "@/components/admin/admin-banner";
import { ProductForm } from "@/components/admin/product-form";
import { data, getDataProvider } from "@/lib/data";

export default async function EditProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string; saved?: string }>;
}) {
  const { id } = await params;
  const notice = await searchParams;
  const provider = getDataProvider();
  const [product, categories] = await Promise.all([
    data.products.getById(id, { includeUnpublished: true }),
    data.categories.list({ includeUnpublished: true }),
  ]);
  if (!product) notFound();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-muted">Catalog</p>
        <h1 className="mt-2 font-heading text-3xl tracking-tight">Edit product</h1>
      </div>
      <AdminBanner created={notice.created} saved={notice.saved} />
      <ProductForm
        product={product}
        categories={categories}
        driver={provider.driver}
        writable={provider.writable}
        action={updateProductAction}
        deleteAction={deleteProductAction}
      />
    </div>
  );
}
