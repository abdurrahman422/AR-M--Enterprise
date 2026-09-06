import { CollectionPage } from "@/components/content/collection-page";
import { data } from "@/lib/data";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Team",
  description: "Engineers and specialists at AR&M Enterprise.",
  path: "/team",
});

export default async function TeamPage() {
  const team = await data.team.list();

  return (
    <CollectionPage
      eyebrow="People"
      title="People behind the plant support."
      description="Engineering, project, service, and commercial profiles will appear here as verified team information is published."
      emptyTitle="No team profiles published yet"
      emptyDescription="Team members will appear here after profiles are added and published."
      items={team.map((member) => ({
        title: member.name,
        slug: member.slug,
        summary: member.role,
        href: "/team",
        meta: member.role,
      }))}
    />
  );
}
