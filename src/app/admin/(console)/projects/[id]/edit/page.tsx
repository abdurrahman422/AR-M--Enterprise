import { notFound } from "next/navigation";
import { deleteProjectAction, updateProjectAction } from "@/app/admin/catalog-actions";
import { AdminBanner } from "@/components/admin/admin-banner";
import { ProjectForm } from "@/components/admin/project-form";
import { data, getDataProvider } from "@/lib/data";

export default async function EditProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string; saved?: string }>;
}) {
  const { id } = await params;
  const notice = await searchParams;
  const provider = getDataProvider();
  const [project, services] = await Promise.all([
    data.projects.getById(id, { includeUnpublished: true }),
    data.services.list({ includeUnpublished: true }),
  ]);
  if (!project) notFound();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-muted">Work</p>
        <h1 className="mt-2 font-heading text-3xl tracking-tight">Edit project</h1>
      </div>
      <AdminBanner created={notice.created} saved={notice.saved} />
      <ProjectForm
        project={project}
        services={services}
        driver={provider.driver}
        writable={provider.writable}
        action={updateProjectAction}
        deleteAction={deleteProjectAction}
      />
    </div>
  );
}
