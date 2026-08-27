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
        title={siteConfig.name}
        description={siteConfig.descriptor}
      />
      <Container className="max-w-3xl py-14 sm:py-16">
        <p className="text-lg leading-8 text-foreground">{siteConfig.tagline}</p>
        <p className="mt-6 text-sm leading-7 text-muted">
          Company history, certifications, clients, and performance statistics will be published here only when verified details are available.
        </p>
      </Container>
    </>
  );
}
