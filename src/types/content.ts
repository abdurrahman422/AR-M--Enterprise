export type PublishStatus = "draft" | "published";

export type ProductAvailability =
  | "available"
  | "made_to_order"
  | "limited"
  | "discontinued"
  | "contact";

export type MediaAsset = {
  id: string;
  url: string;
  alt: string;
  width?: number;
  height?: number;
  sortOrder: number;
};

export type TechnicalSpecification = {
  id: string;
  group: string;
  label: string;
  value: string;
  unit?: string;
  sortOrder: number;
};

export type ProductDocument = {
  id: string;
  title: string;
  url: string;
  fileType: string;
  sizeBytes?: number;
};

export type Category = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  parentId?: string;
  sortOrder: number;
  featured: boolean;
  published: boolean;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
};

export type Product = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  categoryId?: string;
  categorySlug?: string;
  brand?: string;
  model?: string;
  sku?: string;
  images: MediaAsset[];
  specifications: TechnicalSpecification[];
  documents: ProductDocument[];
  availability: ProductAvailability;
  featured: boolean;
  published: boolean;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
};

export type Service = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  sortOrder: number;
  published: boolean;
  featured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
};

export type Solution = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  problem: string;
  approach: string;
  deliverables: string[];
  sortOrder: number;
  published: boolean;
  featured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
};

export type Project = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  category?: string;
  clientName?: string;
  location?: string;
  completedOn?: string;
  scope?: string;
  serviceIds: string[];
  results?: string;
  images: MediaAsset[];
  sortOrder: number;
  published: boolean;
  featured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
};

export type ResourceType =
  | "article"
  | "brochure"
  | "datasheet"
  | "whitepaper"
  | "video"
  | "other";

export type Resource = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  type: ResourceType;
  url?: string;
  sortOrder: number;
  published: boolean;
  featured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
};

export type Testimonial = {
  id: string;
  quote: string;
  attribution: string;
  role?: string;
  organization?: string;
  sortOrder: number;
  published: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TeamMember = {
  id: string;
  name: string;
  slug: string;
  role: string;
  bio: string;
  image?: MediaAsset;
  published: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type Catalog = {
  categories: Category[];
  products: Product[];
  services: Service[];
  solutions: Solution[];
  projects: Project[];
  resources: Resource[];
  testimonials: Testimonial[];
  team: TeamMember[];
  inquiries: import("@/types/inquiries").Inquiry[];
  settings: import("@/types/settings").SiteSettings;
};
