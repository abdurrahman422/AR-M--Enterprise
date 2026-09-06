import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { QuoteCta } from "@/components/content/quote-cta";

export function DetailPage({
  entity,
  eyebrow,
  fallbackTitle,
}: {
  entity: {
    title: string;
    summary?: string;
    description?: string;
  } | null;
  eyebrow: string;
  fallbackTitle?: string;
}) {
  if (!entity) {
    notFound();
  }

  return (
    <>
      <PageHeader
        eyebrow={eyebrow}
        title={entity.title}
        description={entity.summary}
        actions={<QuoteCta productTitle={fallbackTitle ?? entity.title} compact />}
      />
      <Container className="py-16 sm:py-24">
        {entity.description ? (
          <div className="grid gap-8 lg:grid-cols-[14rem_minmax(0,1fr)]">
            <p className="text-xs uppercase tracking-[0.22em] text-accent">Scope overview</p>
            <div className="max-w-3xl whitespace-pre-wrap text-lg leading-9 text-muted">{entity.description}</div>
          </div>
        ) : (
          <p className="max-w-2xl text-sm leading-6 text-muted">
            Detailed content for this entry will be published when it is available.
          </p>
        )}
      </Container>
    </>
  );
}
