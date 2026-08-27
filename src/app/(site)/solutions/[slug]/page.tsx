import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EntryCard } from "@/components/content/entry-card";
import { QuoteCta } from "@/components/content/quote-cta";
import { Container } from "@/components/ui/container";
import { data } from "@/lib/data";
import { relatedPages } from "@/lib/data/query";
import { createMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const solutions = await data.solutions.list();
  return solutions.map((solution) => ({ slug: solution.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const solution = await data.solutions.getBySlug(slug);
  if (!solution) {
    return createMetadata({
      title: "Solution not found",
      description: "This solution is not published.",
      path: `/solutions/${slug}`,
      noIndex: true,
    });
  }
  return createMetadata({
    title: solution.seoTitle ?? solution.title,
    description: solution.seoDescription ?? solution.summary ?? solution.title,
    path: `/solutions/${solution.slug}`,
  });
}

export default async function SolutionDetailPage({ params }: Props) {
  const { slug } = await params;
  const [solution, catalog] = await Promise.all([data.solutions.getBySlug(slug), data.solutions.list()]);
  if (!solution) notFound();
  const related = relatedPages(solution, catalog);

  return (
    <Container className="space-y-16 py-12 sm:py-16">
      <header className="max-w-3xl">
        <p className="text-xs uppercase tracking-[0.22em] text-accent">Solution</p>
        <h1 className="mt-4 font-heading text-4xl leading-tight tracking-tight sm:text-5xl">{solution.title}</h1>
        {solution.summary ? <p className="mt-5 text-lg leading-8 text-muted">{solution.summary}</p> : null}
        <div className="mt-8">
          <QuoteCta productTitle={solution.title} />
        </div>
      </header>
      <section className="grid gap-8 lg:grid-cols-3">
        <div className="border border-border bg-surface p-6">
          <p className="text-xs uppercase tracking-[0.18em] text-accent">Problem</p>
          <p className="mt-4 text-sm leading-7 text-muted">{solution.problem || "The mill condition and required outcome are confirmed during consultation."}</p>
        </div>
        <div className="border border-border bg-surface p-6">
          <p className="text-xs uppercase tracking-[0.18em] text-accent">Approach</p>
          <p className="mt-4 text-sm leading-7 text-muted">{solution.approach || "Scope is defined against the plant, process, and available data."}</p>
        </div>
        <div className="border border-border bg-surface p-6">
          <p className="text-xs uppercase tracking-[0.18em] text-accent">Deliverables</p>
          {solution.deliverables.length > 0 ? (
            <ul className="mt-4 space-y-2 text-sm leading-7 text-muted">
              {solution.deliverables.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm leading-7 text-muted">Deliverables are confirmed with the mill before work starts.</p>
          )}
        </div>
      </section>
      {solution.description ? (
        <section>
          <h2 className="font-heading text-2xl">Application</h2>
          <div className="mt-5 max-w-3xl whitespace-pre-wrap text-base leading-8 text-muted">{solution.description}</div>
        </section>
      ) : null}
      <section className="border border-border bg-surface p-6 sm:p-8">
        <h2 className="font-heading text-xl">Next step</h2>
        <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
          Solutions are quoted against process conditions. No public prices are published.
        </p>
        <div className="mt-5">
          <QuoteCta productTitle={solution.title} />
        </div>
      </section>
      {related.length > 0 ? (
        <section>
          <h2 className="font-heading text-2xl">Other solutions</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {related.map((item) => (
              <EntryCard key={item.id} href={`/solutions/${item.slug}`} title={item.title} summary={item.summary} />
            ))}
          </div>
        </section>
      ) : null}
    </Container>
  );
}
