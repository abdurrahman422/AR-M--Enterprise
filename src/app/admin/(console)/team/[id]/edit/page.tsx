import { notFound } from "next/navigation";
import { deleteTeamAction, updateTeamAction } from "@/app/admin/catalog-actions";
import { AdminBanner } from "@/components/admin/admin-banner";
import { ContentRecordForm } from "@/components/admin/content-record-form";
import { data, getDataProvider } from "@/lib/data";
export default async function EditTeamPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string | undefined>> }) { const { id } = await params; const notice = await searchParams; const provider = getDataProvider(); const record = await data.team.getById(id, { includeUnpublished: true }); if (!record) notFound(); return <div className="space-y-6"><h1 className="font-heading text-3xl">Edit team member</h1><AdminBanner saved={notice.updated} deleted={notice.deleted} error={notice.error} /><ContentRecordForm kind="team" record={record} driver={provider.driver} writable={provider.writable} action={updateTeamAction} deleteAction={deleteTeamAction} /></div>; }
