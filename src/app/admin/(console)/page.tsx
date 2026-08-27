import Link from "next/link";
import { adminNavigation } from "@/config/navigation";
import { data, getDataProvider } from "@/lib/data";

export default async function AdminOverviewPage() {
  const unpublished = { includeUnpublished: true };
  const [products, categories, services, solutions, projects, resources, testimonials, team, quotes, consultations, serviceRequests, identifyRequests] =
    await Promise.all([
      data.products.list(unpublished),
      data.categories.list(unpublished),
      data.services.list(unpublished),
      data.solutions.list(unpublished),
      data.projects.list(unpublished),
      data.resources.list(unpublished),
      data.testimonials.list(unpublished),
      data.team.list(unpublished),
      data.inquiries.list("quote"),
      data.inquiries.list("consultation"),
      data.inquiries.list("service"),
      data.inquiries.list("identify"),
    ]);

  const provider = getDataProvider();
  const driver = provider.driver;
  const stats = [
    { label: "Products", value: products.length, href: "/admin/products" },
    { label: "Categories", value: categories.length, href: "/admin/categories" },
    { label: "Services", value: services.length, href: "/admin/services" },
    { label: "Solutions", value: solutions.length, href: "/admin/solutions" },
    { label: "Projects", value: projects.length, href: "/admin/projects" },
    { label: "Resources", value: resources.length, href: "/admin/resources" },
    { label: "Testimonials", value: testimonials.length, href: "/admin/testimonials" },
    { label: "Team", value: team.length, href: "/admin/team" },
    { label: "Quote requests", value: quotes.length, href: "/admin/requests/quotes" },
    { label: "Consultations", value: consultations.length, href: "/admin/requests/consultations" },
    { label: "Service requests", value: serviceRequests.length, href: "/admin/requests/services" },
    { label: "Part identification", value: identifyRequests.length, href: "/admin/requests/identify" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-muted">Console</p>
        <h1 className="mt-2 font-heading text-3xl tracking-tight">Overview</h1>
        <p className="mt-2 text-sm text-muted">
          Data driver: {driver}
          {provider.writable ? "" : " · writes unavailable until a store is connected"}. Product, category, service, solution, and project CRUD is live.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <Link
            key={stat.href}
            href={stat.href}
            className="border border-border bg-surface px-5 py-4 hover:border-foreground/30"
          >
            <p className="text-xs uppercase tracking-[0.16em] text-muted">{stat.label}</p>
            <p className="mt-3 font-mono text-3xl text-foreground">{stat.value}</p>
          </Link>
        ))}
      </div>
      <ul className="grid gap-2 sm:grid-cols-2">
        {adminNavigation.slice(1).map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="text-sm text-muted hover:text-foreground">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
