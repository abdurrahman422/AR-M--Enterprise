import type { Metadata } from "next";
import { DetailPage } from "@/components/content/detail-page";
import { data } from "@/lib/data";
import { createMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const resources = await data.resources.list();
  return resources.map((resource) => ({ slug: resource.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const resource = await data.resources.getBySlug(slug);
  if (!resource) {
    return createMetadata({ title: "Resource not found", description: "This resource is not published.", path: `/resources/${slug}`, noIndex: true });
  }
  return createMetadata({
    title: resource.seoTitle ?? resource.title,
    description: resource.seoDescription ?? resource.summary ?? resource.title,
    path: `/resources/${resource.slug}`,
  });
}

export default async function ResourceDetailPage({ params }: Props) {
  const { slug } = await params;
  const resource = await data.resources.getBySlug(slug);
  return <DetailPage entity={resource} eyebrow="Resource" />;
}
