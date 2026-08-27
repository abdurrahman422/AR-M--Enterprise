import { InquiryInbox } from "@/components/admin/inquiry-inbox";
import { data } from "@/lib/data";

export default async function AdminServiceRequestsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams; const items = await data.inquiries.list();
  return <InquiryInbox items={items} path="/admin/requests/services" params={{ ...params, type: params.type ?? "service" }} />;
}
