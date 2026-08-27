import { IdentifyForm } from "@/components/forms/identify-form";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Identify a part",
  description: "Send a photo or marking so AR&M Enterprise can help identify a feed mill part. No public pricing.",
  path: "/identify-part",
});

export default function IdentifyPartPage() {
  return (
    <>
      <PageHeader
        eyebrow="Engineering"
        title="Can't identify the part?"
        description="Upload a photo, stamping, or datasheet fragment and describe the mill context. An engineer will help match the component. Commercial terms are issued as a quote."
      />
      <Container className="py-14 sm:py-16">
        <IdentifyForm />
      </Container>
    </>
  );
}
