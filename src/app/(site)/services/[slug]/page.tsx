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
    <>
      <header className="relative overflow-hidden bg-foreground text-white"><div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-accent/20 blur-3xl" /><Container className="relative py-16 sm:py-24">
        <p className="section-label text-accent-soft">Service capability</p>
        <h1 className="mt-6 max-w-4xl font-heading text-5xl font-semibold leading-[.95] tracking-[-.05em] sm:text-7xl">{service.title}</h1>
        {service.summary ? <p className="mt-6 max-w-2xl text-lg leading-8 text-white/65">{service.summary}</p> : null}
        <div className="mt-9">
          <ServiceCta serviceTitle={service.title} />
        </div>
      </Container></header>
    <Container className="space-y-16 py-16 sm:py-24">
      {service.description ? (
        <section className="grid gap-8 lg:grid-cols-[.45fr_1fr]">
          <div><p className="section-label">Scope overview</p><h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight">What this engagement covers</h2></div>
          <div className="rounded-3xl border border-border bg-white p-7 whitespace-pre-wrap text-base leading-8 text-muted shadow-sm sm:p-10">{service.description}</div>
        </section>
      ) : null}
      <section className="rounded-3xl bg-[#e9eef3] p-7 sm:p-10">
        <h2 className="font-heading text-2xl font-semibold">Discuss this service with an engineer</h2>
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
    </>
  );
}
