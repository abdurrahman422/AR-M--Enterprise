import type { Metadata } from "next";
import { InquiryForm } from "@/components/forms/inquiry-form";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { createMetadata } from "@/lib/seo";

type Props = { searchParams: Promise<{ topic?: string; intent?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { intent } = await searchParams;
  const engineer = intent === "engineer";
  return createMetadata({
    title: engineer ? "Talk to an Engineer" : "Request Consultation",
    description: "Request engineering consultation with AR&M Enterprise.",
    path: "/consultation",
  });
}

export default async function ConsultationPage({ searchParams }: Props) {
  const { topic, intent } = await searchParams;
  const engineer = intent === "engineer";

  return (
    <>
      <PageHeader
        eyebrow="Engineering"
        title={engineer ? "Talk to an Engineer" : "Request Consultation"}
        description="Request a consultation on process, layout, equipment selection, or mill performance."
      />
      <Container className="py-14 sm:py-16">
        <InquiryForm kind="consultation" defaultTopic={topic} />
      </Container>
    </>
  );
}
