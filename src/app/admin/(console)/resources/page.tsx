import Link from "next/link";
import { AdminBanner } from "@/components/admin/admin-banner";
import { DriverNote } from "@/components/admin/driver-note";
import { Button } from "@/components/ui/button";
import { data, getDataProvider } from "@/lib/data";

export default async function AdminResourcesPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const provider = getDataProvider();
  const items = await data.resources.list({ includeUnpublished: true });
  return (
    <div className="space-y-6"><div className="flex items-end justify-between"><div><p className="text-xs uppercase tracking-[0.18em] text-muted">Content</p><h1 className="mt-2 font-heading text-3xl">Resources</h1><DriverNote driver={provider.driver} writable={provider.writable} entity="Resources" /></div><Button href="/admin/resources/new">New resource</Button></div><AdminBanner created={params.created} saved={params.updated} deleted={params.deleted} error={params.error} /><div className="overflow-x-auto border border-border"><table className="min-w-full text-left text-sm"><tbody>{items.length === 0 ? <tr><td className="p-4 text-muted">No resources yet.</td></tr> : items.map(item => <tr key={item.id} className="border-t border-border"><td className="px-4 py-3">{item.title}</td><td className="px-4 py-3 text-muted">{item.published ? "Published" : "Draft"}</td><td className="px-4 py-3"><Link href={`/admin/resources/${item.id}/edit`}>Edit</Link></td></tr>)}</tbody></table></div></div>
  );
}
