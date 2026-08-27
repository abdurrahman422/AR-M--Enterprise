import type { Metadata } from "next";
import { InquiryForm } from "@/components/forms/inquiry-form";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { createMetadata } from "@/lib/seo";

type Props = { searchParams: Promise<{ service?: string; intent?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { intent } = await searchParams;
  const support = intent === "support";
  return createMetadata({
    title: support ? "Get Technical Support" : "Request Service",
    description: "Request mill service or technical support from AR&M Enterprise.",
    path: "/service-request",
  });
}

export default async function ServiceRequestPage({ searchParams }: Props) {
  const { service, intent } = await searchParams;
  const support = intent === "support";

  return (
    <>
      <PageHeader
        eyebrow="Service"
        title={support ? "Get Technical Support" : "Request Service"}
        description="Submit a service request for installation, maintenance, spare support, or related mill work."
      />
      <Container className="py-14 sm:py-16">
        <InquiryForm kind="service" defaultServiceType={service} />
      </Container>
    </>
  );
}
