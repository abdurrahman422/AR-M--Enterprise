import { EntryCard } from "@/components/content/entry-card";
import { ServiceCta } from "@/components/content/service-cta";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { data } from "@/lib/data";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Services",
  description: "Engineering, plant design, installation, and commissioning services from AR&M Enterprise.",
  path: "/services",
});

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const [services, featured] = await Promise.all([
    data.services.list({ query: q }),
    data.services.list({ featuredOnly: true }),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Capabilities"
        title="Support from concept to continuous operation."
        description="Engineering, installation, commissioning, maintenance, troubleshooting, automation, utilities, and technical consultancy—coordinated around your mill."
        actions={<ServiceCta compact />}
      />
      <Container className="space-y-10 py-12 sm:py-16">
        <form method="get" className="flex max-w-xl gap-3">
          <Input name="q" defaultValue={q} placeholder="Search services" />
          <Button type="submit" variant="outline">
            Search
          </Button>
        </form>
        {!q && featured.length > 0 ? (
          <section>
            <h2 className="font-heading text-3xl font-semibold tracking-[-.04em]">Where owners usually call us first</h2>
            <div className="mt-6 grid md:grid-cols-2">
              {featured.map((service, index) => (
                <EntryCard
                  key={service.id}
                  href={`/services/${service.slug}`}
                  index={String(index + 1).padStart(2, "0")}
                  title={service.title}
                  summary={service.summary}
                />
              ))}
            </div>
          </section>
        ) : null}
        {services.length === 0 ? (
          <EmptyState
            title={q ? "No matching services" : "No services published yet"}
            description={
              q
                ? "Adjust the search, or request a consultation if the work is outside the listed scope."
                : "Service pages appear here after they are published."
            }
            action={
              q ? (
                <Button href="/services" variant="outline" size="sm">
                  Clear search
                </Button>
              ) : null
            }
          />
        ) : (
          <section>
            <div className="mb-5 flex items-end justify-between gap-4">
              <h2 className="font-heading text-2xl tracking-tight">{q ? "Results" : "All services"}</h2>
              <p className="font-mono text-xs text-muted">{services.length} listed</p>
            </div>
            <div className="grid md:grid-cols-2">
              {services.map((service, index) => (
                <EntryCard
                  key={service.id}
                  href={`/services/${service.slug}`}
                  index={String(index + 1).padStart(2, "0")}
                  title={service.title}
                  summary={service.summary}
                />
              ))}
            </div>
          </section>
        )}
      </Container>
    </>
  );
}
