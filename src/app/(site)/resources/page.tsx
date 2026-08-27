import { CollectionPage } from "@/components/content/collection-page";
import { resourceTypeLabels } from "@/lib/constants";
import { data } from "@/lib/data";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Resources",
  description: "Technical resources from AR&M Enterprise.",
  path: "/resources",
});

export default async function ResourcesPage() {
  const resources = await data.resources.list();

  return (
    <CollectionPage
      eyebrow="Library"
      title="Resources"
      description="Published articles, datasheets, and technical documents."
      emptyTitle="No resources published yet"
      emptyDescription="Resources will appear here after they are added and published."
      items={resources.map((resource) => ({
        title: resource.title,
        slug: resource.slug,
        summary: resource.summary,
        href: `/resources/${resource.slug}`,
        meta: resourceTypeLabels[resource.type],
      }))}
    />
  );
}
