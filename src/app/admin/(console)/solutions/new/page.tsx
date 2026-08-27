import { createSolutionAction } from "@/app/admin/catalog-actions";
import { SolutionForm } from "@/components/admin/solution-form";
import { getDataProvider } from "@/lib/data";

export default function NewSolutionPage() {
  const provider = getDataProvider();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-muted">Applications</p>
        <h1 className="mt-2 font-heading text-3xl tracking-tight">New solution</h1>
      </div>
      <SolutionForm driver={provider.driver} writable={provider.writable} action={createSolutionAction} />
    </div>
  );
}
