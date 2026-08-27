import { notFound } from "next/navigation";
import { deleteTestimonialAction, updateTestimonialAction } from "@/app/admin/catalog-actions";
import { AdminBanner } from "@/components/admin/admin-banner";
import { ContentRecordForm } from "@/components/admin/content-record-form";
import { data, getDataProvider } from "@/lib/data";
export default async function EditTestimonialPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string | undefined>> }) { const { id } = await params; const notice = await searchParams; const provider = getDataProvider(); const record = await data.testimonials.getById(id, { includeUnpublished: true }); if (!record) notFound(); return <div className="space-y-6"><h1 className="font-heading text-3xl">Edit testimonial</h1><AdminBanner saved={notice.updated} deleted={notice.deleted} error={notice.error} /><ContentRecordForm kind="testimonial" record={record} driver={provider.driver} writable={provider.writable} action={updateTestimonialAction} deleteAction={deleteTestimonialAction} /></div>; }
