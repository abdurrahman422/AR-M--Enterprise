import { notFound } from "next/navigation";
import { deleteServiceAction, updateServiceAction } from "@/app/admin/catalog-actions";
import { AdminBanner } from "@/components/admin/admin-banner";
import { CapabilityForm } from "@/components/admin/capability-form";
import { data, getDataProvider } from "@/lib/data";

export default async function EditServicePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string; saved?: string }>;
}) {
  const { id } = await params;
  const notice = await searchParams;
  const provider = getDataProvider();
  const service = await data.services.getById(id, { includeUnpublished: true });
  if (!service) notFound();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-muted">Capabilities</p>
        <h1 className="mt-2 font-heading text-3xl tracking-tight">Edit service</h1>
      </div>
      <AdminBanner created={notice.created} saved={notice.saved} />
      <CapabilityForm
        kind="service"
        record={service}
        driver={provider.driver}
        writable={provider.writable}
        action={updateServiceAction}
        deleteAction={deleteServiceAction}
      />
    </div>
  );
}
