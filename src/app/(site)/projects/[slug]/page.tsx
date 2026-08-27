import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/catalog/product-gallery";
import { EntryCard } from "@/components/content/entry-card";
import { QuoteCta } from "@/components/content/quote-cta";
import { Container } from "@/components/ui/container";
import { data } from "@/lib/data";
import { relatedPages } from "@/lib/data/query";
import { createMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const projects = await data.projects.list();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await data.projects.getBySlug(slug);
  if (!project) {
    return createMetadata({
      title: "Project not found",
      description: "This project is not published.",
      path: `/projects/${slug}`,
      noIndex: true,
    });
  }
  return createMetadata({
    title: project.seoTitle ?? project.title,
    description: project.seoDescription ?? project.summary ?? project.title,
    path: `/projects/${project.slug}`,
  });
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const [project, catalog, services] = await Promise.all([
    data.projects.getBySlug(slug),
    data.projects.list(),
    data.services.list(),
  ]);
  if (!project) notFound();
  const related = relatedPages(project, catalog);
  const usedServices = services.filter((service) => project.serviceIds.includes(service.id));

  return (
    <Container className="space-y-16 py-12 sm:py-16">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
        <ProductGallery images={project.images} title={project.title} />
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-accent">Project</p>
          <h1 className="mt-4 font-heading text-4xl leading-tight tracking-tight sm:text-5xl">{project.title}</h1>
          {project.summary ? <p className="mt-5 text-base leading-7 text-muted">{project.summary}</p> : null}
          <dl className="mt-8 divide-y divide-border border-y border-border text-sm">
            {project.category ? (
              <div className="grid grid-cols-2 gap-4 py-3">
                <dt className="text-muted">Category</dt>
                <dd>{project.category}</dd>
              </div>
            ) : null}
            {project.clientName ? (
              <div className="grid grid-cols-2 gap-4 py-3">
                <dt className="text-muted">Client</dt>
                <dd>{project.clientName}</dd>
              </div>
            ) : null}
            {project.location ? (
              <div className="grid grid-cols-2 gap-4 py-3">
                <dt className="text-muted">Location</dt>
                <dd>{project.location}</dd>
              </div>
            ) : null}
            {project.completedOn ? (
              <div className="grid grid-cols-2 gap-4 py-3">
                <dt className="text-muted">Completed</dt>
                <dd className="font-mono">{project.completedOn}</dd>
              </div>
            ) : null}
          </dl>
          <div className="mt-8">
            <QuoteCta productTitle={project.title} />
          </div>
        </div>
      </div>
      {project.description ? (
        <section>
          <h2 className="font-heading text-2xl">Description</h2>
          <div className="mt-5 max-w-3xl whitespace-pre-wrap text-base leading-8 text-muted">{project.description}</div>
        </section>
      ) : null}
      {project.scope ? (
        <section>
          <h2 className="font-heading text-2xl">Scope</h2>
          <div className="mt-5 max-w-3xl whitespace-pre-wrap text-base leading-8 text-muted">{project.scope}</div>
        </section>
      ) : null}
      {usedServices.length > 0 ? (
        <section>
          <h2 className="font-heading text-2xl">Services used</h2>
          <ul className="mt-5 flex flex-wrap gap-2">
            {usedServices.map((service) => (
              <li key={service.id}>
                <a href={`/services/${service.slug}`} className="border border-border px-3 py-2 text-sm hover:border-foreground/30">
                  {service.title}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      {project.results ? (
        <section>
          <h2 className="font-heading text-2xl">Results</h2>
          <div className="mt-5 max-w-3xl whitespace-pre-wrap text-base leading-8 text-muted">{project.results}</div>
        </section>
      ) : null}
      {related.length > 0 ? (
        <section>
          <h2 className="font-heading text-2xl">Other projects</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {related.map((item) => {
              const image = [...item.images].sort((a, b) => a.sortOrder - b.sortOrder)[0];
              return (
                <EntryCard
                  key={item.id}
                  href={`/projects/${item.slug}`}
                  title={item.title}
                  summary={item.summary}
                  meta={[item.location, item.completedOn].filter(Boolean).join(" · ")}
                  image={image ? { url: image.url, alt: image.alt } : undefined}
                />
              );
            })}
          </div>
        </section>
      ) : null}
    </Container>
  );
}
