import { createServiceAction } from "@/app/admin/catalog-actions";
import { CapabilityForm } from "@/components/admin/capability-form";
import { getDataProvider } from "@/lib/data";

export default function NewServicePage() {
  const provider = getDataProvider();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-muted">Capabilities</p>
        <h1 className="mt-2 font-heading text-3xl tracking-tight">New service</h1>
      </div>
      <CapabilityForm kind="service" driver={provider.driver} writable={provider.writable} action={createServiceAction} />
    </div>
  );
}
