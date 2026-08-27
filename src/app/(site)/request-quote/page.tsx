import { InquiryForm } from "@/components/forms/inquiry-form";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Request a Quote",
  description: "Request pricing and commercial terms from AR&M Enterprise. Product pages do not display public prices.",
  path: "/request-quote",
});

export default async function RequestQuotePage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string; slug?: string }>;
}) {
  const { product, slug } = await searchParams;

  return (
    <>
      <PageHeader
        eyebrow="Sales"
        title="Request a Quote"
        description="Describe the equipment or system you need. Pricing is issued through this process, not as a public catalog price."
      />
      <Container className="py-14 sm:py-16">
        <InquiryForm kind="quote" defaultProductTitle={product} defaultProductSlug={slug} />
      </Container>
    </>
  );
}
