import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { siteConfig } from "@/config/site";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "About",
  description: `${siteConfig.name} — ${siteConfig.descriptor}.`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Company"
        title="One partner across the feed mill lifecycle."
        description={`${siteConfig.name} brings equipment supply, engineering, installation, maintenance, automation, and technical support into one coordinated relationship.`}
      />
      <Container className="py-16 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div><p className="text-xs uppercase tracking-[0.22em] text-accent">Our role</p><h2 className="mt-4 font-heading text-3xl tracking-tight sm:text-4xl">From a single spare to a complete plant scope.</h2></div>
          <div className="space-y-6 text-base leading-8 text-muted"><p>We support feed mill owners and operating teams through equipment selection, process engineering, installation, commissioning, preventive maintenance, breakdown response, spare-part matching, and plant modernization.</p><p>Every recommendation starts with operating context: product, capacity, utilities, existing equipment, and the result the plant needs. Commercial terms are prepared through a technical review and quotation.</p></div>
        </div>
        <div className="mt-16 grid border-l border-t border-border sm:grid-cols-2 lg:grid-cols-4">
          {["Equipment supply", "Engineering & design", "Installation & commissioning", "Maintenance & support"].map((item, index) => <div key={item} className="border-b border-r border-border bg-surface p-6"><p className="font-mono text-xs text-accent">0{index + 1}</p><p className="mt-8 font-heading text-lg">{item}</p></div>)}
        </div>
      </Container>
    </>
  );
}
