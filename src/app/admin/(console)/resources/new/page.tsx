import { createResourceAction } from "@/app/admin/catalog-actions";
import { ContentRecordForm } from "@/components/admin/content-record-form";
import { getDataProvider } from "@/lib/data";
export default function NewResourcePage() { const provider = getDataProvider(); return <div className="space-y-6"><h1 className="font-heading text-3xl">New resource</h1><ContentRecordForm kind="resource" driver={provider.driver} writable={provider.writable} action={createResourceAction} /></div>; }
