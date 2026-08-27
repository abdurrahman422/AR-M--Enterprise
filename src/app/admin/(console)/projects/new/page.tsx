import { createProjectAction } from "@/app/admin/catalog-actions";
import { ProjectForm } from "@/components/admin/project-form";
import { data, getDataProvider } from "@/lib/data";

export default async function NewProjectPage() {
  const provider = getDataProvider();
  const services = await data.services.list({ includeUnpublished: true });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-muted">Work</p>
        <h1 className="mt-2 font-heading text-3xl tracking-tight">New project</h1>
      </div>
      <ProjectForm
        services={services}
        driver={provider.driver}
        writable={provider.writable}
        action={createProjectAction}
      />
    </div>
  );
}
