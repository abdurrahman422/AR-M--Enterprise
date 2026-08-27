import { createTeamAction } from "@/app/admin/catalog-actions";
import { ContentRecordForm } from "@/components/admin/content-record-form";
import { getDataProvider } from "@/lib/data";
export default function NewTeamPage() { const provider = getDataProvider(); return <div className="space-y-6"><h1 className="font-heading text-3xl">New team member</h1><ContentRecordForm kind="team" driver={provider.driver} writable={provider.writable} action={createTeamAction} /></div>; }
