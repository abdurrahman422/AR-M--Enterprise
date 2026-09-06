import { EntryCard } from "@/components/content/entry-card";
import { QuoteCta } from "@/components/content/quote-cta";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { data } from "@/lib/data";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Projects",
  description: "Published projects and case studies from AR&M Enterprise.",
  path: "/projects",
});

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const [projects, featured] = await Promise.all([
    data.projects.list({ query: q }),
    data.projects.list({ featuredOnly: true }),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Work"
        title="Engineering work, documented clearly."
        description="Selected project scopes and delivery stories will appear here as verified records become available."
        actions={<QuoteCta compact />}
      />
      <Container className="space-y-10 py-12 sm:py-16">
        <form method="get" className="flex max-w-xl gap-3">
          <Input name="q" defaultValue={q} placeholder="Search projects" />
          <Button type="submit" variant="outline">
            Search
          </Button>
        </form>
        {!q && featured.length > 0 ? (
          <section>
            <h2 className="font-heading text-3xl font-semibold tracking-[-.04em]">Selected delivery stories</h2>
            <div className="mt-6 grid md:grid-cols-2">
              {featured.map((project) => {
                const image = [...project.images].sort((a, b) => a.sortOrder - b.sortOrder)[0];
                return (
                  <EntryCard
                    key={project.id}
                    href={`/projects/${project.slug}`}
                    title={project.title}
                    summary={project.summary}
                    meta={[project.location, project.completedOn].filter(Boolean).join(" · ")}
                    image={image ? { url: image.url, alt: image.alt } : undefined}
                  />
                );
              })}
            </div>
          </section>
        ) : null}
        {projects.length === 0 ? (
          <EmptyState
            title={q ? "No matching projects" : "No projects published yet"}
            description={
              q
                ? "Adjust the search. Only verified project records are listed."
                : "Project pages appear here after documented work is added. Unverified clients and statistics are not published."
            }
            action={
              q ? (
                <Button href="/projects" variant="outline" size="sm">
                  Clear search
                </Button>
              ) : null
            }
          />
        ) : (
          <div className="grid md:grid-cols-2">
            {projects.map((project) => {
              const image = [...project.images].sort((a, b) => a.sortOrder - b.sortOrder)[0];
              return (
                <EntryCard
                  key={project.id}
                  href={`/projects/${project.slug}`}
                  title={project.title}
                  summary={project.summary}
                  meta={[project.location, project.completedOn].filter(Boolean).join(" · ")}
                  image={image ? { url: image.url, alt: image.alt } : undefined}
                />
              );
            })}
          </div>
        )}
      </Container>
    </>
  );
}
