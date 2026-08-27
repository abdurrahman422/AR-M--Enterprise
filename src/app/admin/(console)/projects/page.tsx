import Link from "next/link";
import { AdminBanner } from "@/components/admin/admin-banner";
import { DriverNote } from "@/components/admin/driver-note";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { data, getDataProvider } from "@/lib/data";

export default async function AdminProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; created?: string; deleted?: string; error?: string }>;
}) {
  const params = await searchParams;
  const provider = getDataProvider();
  const projects = await data.projects.list({ includeUnpublished: true, query: params.q });
  const filtered = projects.filter((item) => {
    if (params.status === "published") return item.published;
    if (params.status === "draft") return !item.published;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted">Work</p>
          <h1 className="mt-2 font-heading text-3xl tracking-tight">Projects</h1>
          <div className="mt-2">
            <DriverNote driver={provider.driver} writable={provider.writable} entity="Projects" />
          </div>
        </div>
        <Button href="/admin/projects/new">New project</Button>
      </div>
      <AdminBanner created={params.created} deleted={params.deleted} error={params.error} />
      <form className="grid gap-3 sm:grid-cols-3" method="get">
        <Input name="q" defaultValue={params.q} placeholder="Search projects" />
        <Select name="status" defaultValue={params.status ?? "all"}>
          <option value="all">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </Select>
        <Button type="submit" variant="outline">
          Filter
        </Button>
      </form>
      <div className="overflow-x-auto border border-border">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-surface text-xs uppercase tracking-[0.14em] text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Project</th>
              <th className="px-4 py-3 font-medium">Location</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium"> </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-muted">
                  No projects match these filters. Do not invent clients or performance claims.
                </td>
              </tr>
            ) : (
              filtered.map((project) => (
                <tr key={project.id} className="border-t border-border">
                  <td className="px-4 py-3">
                    {project.title}
                    {project.featured ? <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-accent">Featured</p> : null}
                  </td>
                  <td className="px-4 py-3 text-muted">{project.location ?? "—"}</td>
                  <td className="px-4 py-3 text-muted">{project.published ? "Published" : "Draft"}</td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/projects/${project.id}/edit`} className="text-sm hover:text-accent">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
