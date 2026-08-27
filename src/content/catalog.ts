import type { Catalog, Category, Service, Solution } from "@/types/content";

const SEEDED_AT = "2026-08-24T00:00:00.000Z";

const categorySeed: Array<Pick<Category, "id" | "title" | "slug" | "summary" | "description" | "sortOrder">> = [
  {
    id: "8f0a1b2c-0001-4000-8000-000000000001",
    title: "Feed Mill Machinery",
    slug: "feed-mill-machinery",
    summary: "Processing machinery used in feed mill plants.",
    description: "Primary and secondary process equipment for feed mill operations.",
    sortOrder: 1,
  },
  {
    id: "8f0a1b2c-0001-4000-8000-000000000002",
    title: "Spare & Wear Parts",
    slug: "spare-wear-parts",
    summary: "Replacement and wear components for mill equipment.",
    description: "Spare and wear parts specified against mill equipment, not as a public price list.",
    sortOrder: 2,
  },
  {
    id: "8f0a1b2c-0001-4000-8000-000000000003",
    title: "Electrical & Automation",
    slug: "electrical-automation",
    summary: "Electrical, control, and automation components.",
    description: "Control, sensing, and electrical items used in mill and industrial systems.",
    sortOrder: 3,
  },
  {
    id: "8f0a1b2c-0001-4000-8000-000000000004",
    title: "Material Handling",
    slug: "material-handling",
    summary: "Conveying and bulk-material movement equipment.",
    description: "Equipment and components for moving raw materials, intermediates, and finished feed.",
    sortOrder: 4,
  },
  {
    id: "8f0a1b2c-0001-4000-8000-000000000005",
    title: "Silo & Storage",
    slug: "silo-storage",
    summary: "Storage, silo, and related plant infrastructure.",
    description: "Silo, hopper, and storage equipment used in feed and industrial plants.",
    sortOrder: 5,
  },
  {
    id: "8f0a1b2c-0001-4000-8000-000000000006",
    title: "Industrial Components",
    slug: "industrial-components",
    summary: "General industrial components used across mill systems.",
    description: "Cross-cutting industrial components that support mill engineering work.",
    sortOrder: 6,
  },
];

const serviceSeed: Array<Pick<Service, "id" | "title" | "slug" | "summary" | "description" | "sortOrder">> = [
  {
    id: "8f0a1b2c-0002-4000-8000-000000000001",
    title: "Engineering & Plant Design",
    slug: "engineering-plant-design",
    summary: "Process, layout, and plant-design support for feed mill projects.",
    description:
      "Engineering and plant-design work covering process arrangement, equipment specification, and mill layout. Scope is defined per project through a consultation or service request.",
    sortOrder: 1,
  },
  {
    id: "8f0a1b2c-0002-4000-8000-000000000002",
    title: "Installation & Commissioning",
    slug: "installation-commissioning",
    summary: "Installation and commissioning support for mill equipment and systems.",
    description:
      "Installation and commissioning support for plant equipment and related systems. Work is scoped against the mill, equipment list, and site conditions — not as a public price package.",
    sortOrder: 2,
  },
  {
    id: "8f0a1b2c-0002-4000-8000-000000000003",
    title: "Preventive Maintenance",
    slug: "preventive-maintenance",
    summary: "Planned inspection and maintenance support for mill equipment.",
    description:
      "Preventive maintenance is scoped against the installed equipment, operating conditions, and the mill’s maintenance calendar. Commercial terms are issued on request.",
    sortOrder: 3,
  },
  {
    id: "8f0a1b2c-0002-4000-8000-000000000004",
    title: "Breakdown & Technical Support",
    slug: "breakdown-technical-support",
    summary: "Technical support for equipment faults and unplanned stoppages.",
    description:
      "Breakdown and technical support covers fault diagnosis, spare matching, and recovery guidance. Response method and site attendance are agreed per request.",
    sortOrder: 4,
  },
  {
    id: "8f0a1b2c-0002-4000-8000-000000000005",
    title: "Retrofit & Upgrades",
    slug: "retrofit-upgrades",
    summary: "Equipment and process upgrades on existing mill lines.",
    description:
      "Retrofit and upgrade work is defined against the current plant, available space, and the intended process change. Scope and commercial terms follow a site or drawing review.",
    sortOrder: 5,
  },
  {
    id: "8f0a1b2c-0002-4000-8000-000000000006",
    title: "Automation & Control",
    slug: "automation-control",
    summary: "Control, sensing, and automation support for mill systems.",
    description:
      "Automation and control work covers panels, sensing, sequencing, and related electrical items as specified for the mill. Integration scope is confirmed before quotation.",
    sortOrder: 6,
  },
  {
    id: "8f0a1b2c-0002-4000-8000-000000000007",
    title: "Silo & Storage Solutions",
    slug: "silo-storage-solutions",
    summary: "Silo, hopper, and bulk-storage engineering support.",
    description:
      "Silo and storage support covers hoppers, silos, and related conveying interfaces. Design and supply scope depends on product, capacity, and site constraints.",
    sortOrder: 7,
  },
  {
    id: "8f0a1b2c-0002-4000-8000-000000000008",
    title: "Boiler & Steam Systems",
    slug: "boiler-steam-systems",
    summary: "Steam-generation and distribution support for mill utilities.",
    description:
      "Boiler and steam-system work is specified against utility demand, fuel, and plant layout. Scope is confirmed through engineering review, not a standard package price.",
    sortOrder: 8,
  },
  {
    id: "8f0a1b2c-0002-4000-8000-000000000009",
    title: "Generator & Power Systems",
    slug: "generator-power-systems",
    summary: "Standby and plant power equipment support.",
    description:
      "Generator and power-system support covers specification and integration of plant power equipment. Electrical interface and load data are required before quotation.",
    sortOrder: 9,
  },
  {
    id: "8f0a1b2c-0002-4000-8000-00000000000a",
    title: "Technical Consultancy",
    slug: "technical-consultancy",
    summary: "Independent engineering review for process, plant, and equipment decisions.",
    description:
      "Technical consultancy is scoped to the question at hand: process, layout, equipment selection, or recovery. Engagements start with a consultation request.",
    sortOrder: 10,
  },
];

const solutionSeed: Array<
  Pick<Solution, "id" | "title" | "slug" | "summary" | "description" | "problem" | "approach" | "deliverables" | "sortOrder">
> = [
  {
    id: "8f0a1b2c-0003-4000-8000-000000000001",
    title: "New Feed Mill Setup",
    slug: "new-feed-mill-setup",
    summary: "From process intent to an engineered plant path for a new mill.",
    description: "A structured path covering layout, equipment specification, installation, and commissioning for a new feed mill.",
    problem: "A new mill needs process arrangement, equipment selection, and a commissioning sequence before production can start.",
    approach: "Review capacity intent, process flow, equipment specification, and installation sequencing with the project team.",
    deliverables: [
      "Process and layout input",
      "Equipment specification support",
      "Installation and commissioning plan",
      "Quote-based commercial terms",
    ],
    sortOrder: 1,
  },
  {
    id: "8f0a1b2c-0003-4000-8000-000000000002",
    title: "Plant Upgrade & Expansion",
    slug: "plant-upgrade-expansion",
    summary: "Upgrade or expand an existing mill without inventing a greenfield plant.",
    description: "Upgrade and expansion work is fitted to the current mill, available space, and the intended process change.",
    problem: "An operating mill needs more capacity, a process change, or replacement of constrained equipment while remaining in production.",
    approach: "Assess the existing line, bottlenecks, and available space, then specify retrofit or expansion work against that baseline.",
    deliverables: [
      "Plant assessment notes",
      "Upgrade or expansion specification",
      "Installation interface plan",
      "Quote-based commercial terms",
    ],
    sortOrder: 2,
  },
  {
    id: "8f0a1b2c-0003-4000-8000-000000000003",
    title: "Feed Mill Automation",
    slug: "feed-mill-automation",
    summary: "Control and automation specified against the actual mill process.",
    description: "Automation is scoped to the process, existing panels, and the control outcomes required by the mill.",
    problem: "Manual or fragmented control limits consistent operation, tracing, or safe sequencing of mill equipment.",
    approach: "Map the current process and electrical condition, then specify sensing, sequencing, and control work that fits the plant.",
    deliverables: [
      "Control-scope definition",
      "Sensing and panel specification support",
      "Integration notes for existing equipment",
      "Quote-based commercial terms",
    ],
    sortOrder: 3,
  },
  {
    id: "8f0a1b2c-0003-4000-8000-000000000004",
    title: "Plant Optimization",
    slug: "plant-optimization",
    summary: "Engineering review of process, equipment, and operating constraints.",
    description: "Optimization work starts from the current mill condition. No performance percentages are claimed without verified data.",
    problem: "The mill is running, but process flow, equipment condition, or utilities limit stable output.",
    approach: "Review process, equipment, and operating data provided by the mill, then recommend targeted changes.",
    deliverables: [
      "Findings from the review",
      "Recommended process or equipment changes",
      "Prioritized next steps",
      "Quote-based commercial terms",
    ],
    sortOrder: 4,
  },
  {
    id: "8f0a1b2c-0003-4000-8000-000000000005",
    title: "Spare Parts & Technical Support",
    slug: "spare-parts-technical-support",
    summary: "Identify, specify, and quote parts against mill equipment — without public prices.",
    description: "Spare and technical-support work matches parts and advice to the installed equipment. Listings never show public prices.",
    problem: "A mill needs the correct spare or wear part and technical confirmation before ordering.",
    approach: "Identify the part from marking, drawing, photo, or mill context, then quote the specified item.",
    deliverables: [
      "Part identification support",
      "Specification against the mill equipment",
      "Quote on request",
      "Optional technical follow-up",
    ],
    sortOrder: 5,
  },
  {
    id: "8f0a1b2c-0003-4000-8000-000000000006",
    title: "Troubleshooting & Recovery",
    slug: "troubleshooting-recovery",
    summary: "Diagnose faults and plan recovery for mill equipment and process.",
    description: "Troubleshooting is scoped to the reported fault, available data, and site access. Recovery steps are agreed before work starts.",
    problem: "Equipment or process has stopped or is unstable, and the mill needs a structured path back to operation.",
    approach: "Collect fault data, markings, and operating context, then diagnose and propose recovery work.",
    deliverables: [
      "Fault diagnosis notes",
      "Recommended recovery steps",
      "Spare or service specification if required",
      "Quote-based commercial terms",
    ],
    sortOrder: 6,
  },
];

/**
 * Typed local catalog.
 * Categories and services are structural only.
 * Do not invent products, brands, clients, certifications, or experience claims.
 */
export const catalog: Catalog = {
  categories: categorySeed.map((category) => ({
    ...category,
    featured: false,
    published: true,
    createdAt: SEEDED_AT,
    updatedAt: SEEDED_AT,
  })),
  products: [],
  services: serviceSeed.map((service) => ({
    ...service,
    featured: false,
    published: true,
    createdAt: SEEDED_AT,
    updatedAt: SEEDED_AT,
  })),
  solutions: solutionSeed.map((solution) => ({
    ...solution,
    featured: false,
    published: true,
    createdAt: SEEDED_AT,
    updatedAt: SEEDED_AT,
  })),
  projects: [],
  resources: [],
  testimonials: [],
  team: [],
  inquiries: [],
  settings: {
    contactEmail: "",
    contactPhone: "",
    whatsapp: "",
    address: "",
    linkedin: "",
    facebook: "",
    instagram: "",
    youtube: "",
    x: "",
    seoTitle: "",
    seoDescription: "",
    notifyEmail: "",
    notifyEnabled: false,
  },
};
