import { notFound } from "next/navigation";
import { deleteSolutionAction, updateSolutionAction } from "@/app/admin/catalog-actions";
import { AdminBanner } from "@/components/admin/admin-banner";
import { SolutionForm } from "@/components/admin/solution-form";
import { data, getDataProvider } from "@/lib/data";

export default async function EditSolutionPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string; saved?: string }>;
}) {
  const { id } = await params;
  const notice = await searchParams;
  const provider = getDataProvider();
  const solution = await data.solutions.getById(id, { includeUnpublished: true });
  if (!solution) notFound();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-muted">Applications</p>
        <h1 className="mt-2 font-heading text-3xl tracking-tight">Edit solution</h1>
      </div>
      <AdminBanner created={notice.created} saved={notice.saved} />
      <SolutionForm
        record={solution}
        driver={provider.driver}
        writable={provider.writable}
        action={updateSolutionAction}
        deleteAction={deleteSolutionAction}
      />
    </div>
  );
}
