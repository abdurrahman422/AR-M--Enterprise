import Link from "next/link";
import { AdminBanner } from "@/components/admin/admin-banner";
import { DriverNote } from "@/components/admin/driver-note";
import { Button } from "@/components/ui/button";
import { data, getDataProvider } from "@/lib/data";

export default async function AdminTeamPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const provider = getDataProvider();
  const items = await data.team.list({ includeUnpublished: true });
  return (
    <div className="space-y-6"><div className="flex items-end justify-between"><div><p className="text-xs uppercase tracking-[0.18em] text-muted">Content</p><h1 className="mt-2 font-heading text-3xl">Team</h1><DriverNote driver={provider.driver} writable={provider.writable} entity="Team" /></div><Button href="/admin/team/new">New member</Button></div><AdminBanner created={params.created} saved={params.updated} deleted={params.deleted} error={params.error} /><div className="overflow-x-auto border border-border"><table className="min-w-full text-left text-sm"><tbody>{items.length === 0 ? <tr><td className="p-4 text-muted">No team members yet.</td></tr> : items.map(item => <tr key={item.id} className="border-t border-border"><td className="px-4 py-3">{item.name}</td><td className="px-4 py-3 text-muted">{item.role}</td><td className="px-4 py-3"><Link href={`/admin/team/${item.id}/edit`}>Edit</Link></td></tr>)}</tbody></table></div></div>
  );
}
