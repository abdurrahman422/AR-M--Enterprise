export type NavItem = {
  label: string;
  href: string;
};

export const primaryNavigation: NavItem[] = [
  { label: "Products", href: "/products" },
  { label: "Services", href: "/services" },
  { label: "Solutions", href: "/solutions" },
  { label: "Projects", href: "/projects" },
  { label: "Resources", href: "/resources" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const footerNavigation: { title: string; items: NavItem[] }[] = [
  {
    title: "Capabilities",
    items: [
      { label: "Products", href: "/products" },
      { label: "Categories", href: "/categories" },
      { label: "Services", href: "/services" },
      { label: "Solutions", href: "/solutions" },
    ],
  },
  {
    title: "Work",
    items: [
      { label: "Projects", href: "/projects" },
      { label: "Resources", href: "/resources" },
      { label: "Team", href: "/team" },
      { label: "About", href: "/about" },
    ],
  },
  {
    title: "Engage",
    items: [
      { label: "Request a Quote", href: "/request-quote" },
      { label: "Ask an Engineer", href: "/consultation" },
      { label: "Request Service", href: "/service-request" },
      { label: "Identify a part", href: "/identify-part" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export const adminNavigation: NavItem[] = [
  { label: "Overview", href: "/admin" },
  { label: "Analytics & history", href: "/admin/analytics" },
  { label: "Products", href: "/admin/products" },
  { label: "Categories", href: "/admin/categories" },
  { label: "Services", href: "/admin/services" },
  { label: "Solutions", href: "/admin/solutions" },
  { label: "Projects", href: "/admin/projects" },
  { label: "Resources", href: "/admin/resources" },
  { label: "Testimonials", href: "/admin/testimonials" },
  { label: "Team", href: "/admin/team" },
  { label: "Settings", href: "/admin/settings" },
  { label: "Quote requests", href: "/admin/requests/quotes" },
  { label: "Consultations", href: "/admin/requests/consultations" },
  { label: "Service requests", href: "/admin/requests/services" },
  { label: "Part identification", href: "/admin/requests/identify" },
];
