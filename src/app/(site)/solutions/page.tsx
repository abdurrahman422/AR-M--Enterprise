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
  title: "Solutions",
  description: "Process and plant solutions from AR&M Enterprise.",
  path: "/solutions",
});

export default async function SolutionsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const [solutions, featured] = await Promise.all([
    data.solutions.list({ query: q }),
    data.solutions.list({ featuredOnly: true }),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Applications"
        title="Solve the constraint, not just the symptom."
        description="Integrated paths for new mills, expansion, automation, performance improvement, spare support, and operational recovery."
        actions={<QuoteCta compact />}
      />
      <Container className="space-y-10 py-12 sm:py-16">
        <form method="get" className="flex max-w-xl gap-3">
          <Input name="q" defaultValue={q} placeholder="Search solutions" />
          <Button type="submit" variant="outline">
            Search
          </Button>
        </form>
        {!q && featured.length > 0 ? (
          <section>
            <h2 className="font-heading text-3xl font-semibold tracking-[-.04em]">High-impact interventions</h2>
            <div className="mt-6 grid md:grid-cols-2">
              {featured.map((solution) => (
                <EntryCard
                  key={solution.id}
                  href={`/solutions/${solution.slug}`}
                  title={solution.title}
                  summary={solution.summary}
                />
              ))}
            </div>
          </section>
        ) : null}
        {solutions.length === 0 ? (
          <EmptyState
            title={q ? "No matching solutions" : "No solutions published yet"}
            description={
              q
                ? "Adjust the search, or ask an engineer if the application is not listed."
                : "Solution pages appear here after they are added and published. Application claims are not invented."
            }
            action={
              q ? (
                <Button href="/solutions" variant="outline" size="sm">
                  Clear search
                </Button>
              ) : (
                <QuoteCta compact />
              )
            }
          />
        ) : (
          <div className="grid md:grid-cols-2">
            {solutions.map((solution) => (
              <EntryCard
                key={solution.id}
                href={`/solutions/${solution.slug}`}
                title={solution.title}
                summary={solution.summary}
              />
            ))}
          </div>
        )}
      </Container>
    </>
  );
}
