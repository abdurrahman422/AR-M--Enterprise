import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EntryCard } from "@/components/content/entry-card";
import { ServiceCta } from "@/components/content/service-cta";
import { Container } from "@/components/ui/container";
import { data } from "@/lib/data";
import { relatedPages } from "@/lib/data/query";
import { createMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const services = await data.services.list();
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await data.services.getBySlug(slug);
  if (!service) {
    return createMetadata({
      title: "Service not found",
      description: "This service is not published.",
      path: `/services/${slug}`,
      noIndex: true,
    });
  }
  return createMetadata({
    title: service.seoTitle ?? service.title,
    description: service.seoDescription ?? service.summary ?? service.title,
    path: `/services/${service.slug}`,
  });
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const [service, catalog] = await Promise.all([data.services.getBySlug(slug), data.services.list()]);
  if (!service) notFound();
  const related = relatedPages(service, catalog);

  return (
    <Container className="space-y-16 py-12 sm:py-16">
      <header className="max-w-3xl">
        <p className="text-xs uppercase tracking-[0.22em] text-accent">Service</p>
        <h1 className="mt-4 font-heading text-4xl leading-tight tracking-tight sm:text-5xl">{service.title}</h1>
        {service.summary ? <p className="mt-5 text-lg leading-8 text-muted">{service.summary}</p> : null}
        <div className="mt-8">
          <ServiceCta serviceTitle={service.title} />
        </div>
      </header>
      {service.description ? (
        <section>
          <h2 className="font-heading text-2xl">Scope</h2>
          <div className="mt-5 max-w-3xl whitespace-pre-wrap text-base leading-8 text-muted">{service.description}</div>
        </section>
      ) : null}
      <section className="border border-border bg-surface p-6 sm:p-8">
        <h2 className="font-heading text-xl">Discuss this service</h2>
        <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
          Work is scoped against the mill, equipment, and site conditions. Commercial terms are issued on request.
        </p>
        <div className="mt-5">
          <ServiceCta serviceTitle={service.title} />
        </div>
      </section>
      {related.length > 0 ? (
        <section>
          <h2 className="font-heading text-2xl">Other services</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {related.map((item) => (
              <EntryCard key={item.id} href={`/services/${item.slug}`} title={item.title} summary={item.summary} />
            ))}
          </div>
        </section>
      ) : null}
    </Container>
  );
}
