export function AdminModulePage({
  title,
  description,
  count,
}: {
  title: string;
  description: string;
  count: number;
}) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-muted">Manage</p>
        <h1 className="mt-2 font-heading text-3xl tracking-tight">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{description}</p>
      </div>
      <div className="border border-border bg-surface px-5 py-4">
        <p className="text-xs uppercase tracking-[0.16em] text-muted">Records</p>
        <p className="mt-2 font-mono text-3xl">{count}</p>
      </div>
    </div>
  );
}
