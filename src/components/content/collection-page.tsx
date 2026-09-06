import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { QuoteCta } from "@/components/content/quote-cta";

type CollectionItem = {
  title: string;
  slug: string;
  summary?: string;
  href: string;
  meta?: string;
};

export function CollectionPage({
  eyebrow,
  title,
  description,
  emptyTitle,
  emptyDescription,
  items,
}: {
  eyebrow: string;
  title: string;
  description: string;
  emptyTitle: string;
  emptyDescription: string;
  items: CollectionItem[];
}) {
  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} description={description} actions={<QuoteCta compact />} />
      <Container className="py-16 sm:py-24">
        {items.length === 0 ? (
          <EmptyState title={emptyTitle} description={emptyDescription} />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <Card
                key={item.slug}
                href={item.href}
                title={item.title}
                description={item.summary}
                meta={item.meta}
              />
            ))}
          </div>
        )}
      </Container>
    </>
  );
}
