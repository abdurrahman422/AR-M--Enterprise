import { InquiryInbox } from "@/components/admin/inquiry-inbox";
import { data } from "@/lib/data";

export default async function AdminConsultationsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams; const items = await data.inquiries.list();
  return <InquiryInbox items={items} path="/admin/requests/consultations" params={{ ...params, type: params.type ?? "consultation" }} />;
}
