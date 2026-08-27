import type {
  Catalog,
  Category,
  Product,
  Project,
  Resource,
  Service,
  Solution,
  TeamMember,
  Testimonial,
} from "@/types/content";
import type {
  ConsultationRequest,
  IdentifyRequest,
  Inquiry,
  QuoteRequest,
  ServiceRequest,
} from "@/types/inquiries";

export type ListOptions = {
  includeUnpublished?: boolean;
  featuredOnly?: boolean;
  categorySlug?: string;
  categoryId?: string;
  includeDescendants?: boolean;
  query?: string;
  availability?: import("@/types/content").ProductAvailability;
};

export type ProductWriteInput = Omit<
  import("@/types/content").Product,
  "id" | "createdAt" | "updatedAt" | "categorySlug"
>;

export type CategoryWriteInput = Omit<
  import("@/types/content").Category,
  "id" | "createdAt" | "updatedAt"
>;

export type ServiceWriteInput = Omit<
  import("@/types/content").Service,
  "id" | "createdAt" | "updatedAt"
>;

export type SolutionWriteInput = Omit<
  import("@/types/content").Solution,
  "id" | "createdAt" | "updatedAt"
>;

export type ProjectWriteInput = Omit<
  import("@/types/content").Project,
  "id" | "createdAt" | "updatedAt"
>;

export type ResourceWriteInput = Omit<
  import("@/types/content").Resource,
  "id" | "createdAt" | "updatedAt"
>;

export type TeamWriteInput = Omit<
  import("@/types/content").TeamMember,
  "id" | "createdAt" | "updatedAt"
>;

export type TestimonialWriteInput = Omit<
  import("@/types/content").Testimonial,
  "id" | "createdAt" | "updatedAt"
>;

export type PersistenceResult<T> =
  | { ok: true; data: T }
  | { ok: false; code: "NOT_CONFIGURED" | "VALIDATION" | "UNKNOWN"; message: string };

export type DataProvider = {
  driver: "catalog" | "neon";
  writable: boolean;
  categories: {
    list: (options?: ListOptions) => Promise<Category[]>;
    getBySlug: (slug: string, options?: ListOptions) => Promise<Category | null>;
    getById: (id: string, options?: ListOptions) => Promise<Category | null>;
    create: (input: CategoryWriteInput) => Promise<PersistenceResult<Category>>;
    update: (id: string, input: CategoryWriteInput) => Promise<PersistenceResult<Category>>;
    remove: (id: string) => Promise<PersistenceResult<{ id: string }>>;
  };
  products: {
    list: (options?: ListOptions) => Promise<Product[]>;
    getBySlug: (slug: string, options?: ListOptions) => Promise<Product | null>;
    getById: (id: string, options?: ListOptions) => Promise<Product | null>;
    create: (input: ProductWriteInput) => Promise<PersistenceResult<Product>>;
    update: (id: string, input: ProductWriteInput) => Promise<PersistenceResult<Product>>;
    remove: (id: string) => Promise<PersistenceResult<{ id: string }>>;
  };
  services: {
    list: (options?: ListOptions) => Promise<Service[]>;
    getBySlug: (slug: string, options?: ListOptions) => Promise<Service | null>;
    getById: (id: string, options?: ListOptions) => Promise<Service | null>;
    create: (input: ServiceWriteInput) => Promise<PersistenceResult<Service>>;
    update: (id: string, input: ServiceWriteInput) => Promise<PersistenceResult<Service>>;
    remove: (id: string) => Promise<PersistenceResult<{ id: string }>>;
  };
  solutions: {
    list: (options?: ListOptions) => Promise<Solution[]>;
    getBySlug: (slug: string, options?: ListOptions) => Promise<Solution | null>;
    getById: (id: string, options?: ListOptions) => Promise<Solution | null>;
    create: (input: SolutionWriteInput) => Promise<PersistenceResult<Solution>>;
    update: (id: string, input: SolutionWriteInput) => Promise<PersistenceResult<Solution>>;
    remove: (id: string) => Promise<PersistenceResult<{ id: string }>>;
  };
  projects: {
    list: (options?: ListOptions) => Promise<Project[]>;
    getBySlug: (slug: string, options?: ListOptions) => Promise<Project | null>;
    getById: (id: string, options?: ListOptions) => Promise<Project | null>;
    create: (input: ProjectWriteInput) => Promise<PersistenceResult<Project>>;
    update: (id: string, input: ProjectWriteInput) => Promise<PersistenceResult<Project>>;
    remove: (id: string) => Promise<PersistenceResult<{ id: string }>>;
  };
  resources: {
    list: (options?: ListOptions) => Promise<Resource[]>;
    getBySlug: (slug: string, options?: ListOptions) => Promise<Resource | null>;
    getById: (id: string, options?: ListOptions) => Promise<Resource | null>;
    create: (input: ResourceWriteInput) => Promise<PersistenceResult<Resource>>;
    update: (id: string, input: ResourceWriteInput) => Promise<PersistenceResult<Resource>>;
    remove: (id: string) => Promise<PersistenceResult<{ id: string }>>;
  };
  testimonials: {
    list: (options?: ListOptions) => Promise<Testimonial[]>;
    getById: (id: string, options?: ListOptions) => Promise<Testimonial | null>;
    create: (input: TestimonialWriteInput) => Promise<PersistenceResult<Testimonial>>;
    update: (id: string, input: TestimonialWriteInput) => Promise<PersistenceResult<Testimonial>>;
    remove: (id: string) => Promise<PersistenceResult<{ id: string }>>;
  };
  team: {
    list: (options?: ListOptions) => Promise<TeamMember[]>;
    getBySlug: (slug: string, options?: ListOptions) => Promise<TeamMember | null>;
    getById: (id: string, options?: ListOptions) => Promise<TeamMember | null>;
    create: (input: TeamWriteInput) => Promise<PersistenceResult<TeamMember>>;
    update: (id: string, input: TeamWriteInput) => Promise<PersistenceResult<TeamMember>>;
    remove: (id: string) => Promise<PersistenceResult<{ id: string }>>;
  };
  inquiries: {
    createQuote: (input: Omit<QuoteRequest, "id" | "status" | "priority" | "notes" | "attachments" | "createdAt" | "updatedAt">) => Promise<PersistenceResult<Inquiry>>;
    createConsultation: (input: Omit<ConsultationRequest, "id" | "status" | "priority" | "notes" | "attachments" | "createdAt" | "updatedAt">) => Promise<PersistenceResult<Inquiry>>;
    createService: (input: Omit<ServiceRequest, "id" | "status" | "priority" | "notes" | "attachments" | "createdAt" | "updatedAt">) => Promise<PersistenceResult<Inquiry>>;
    createIdentify: (input: Omit<IdentifyRequest, "id" | "status" | "priority" | "notes" | "attachments" | "createdAt" | "updatedAt">) => Promise<PersistenceResult<Inquiry>>;
    list: (kind?: Inquiry["kind"]) => Promise<Inquiry[]>;
    getById: (id: string) => Promise<Inquiry | null>;
    update: (id: string, patch: Partial<Pick<Inquiry, "status" | "priority" | "notes" | "attachments">>) => Promise<PersistenceResult<Inquiry>>;
    remove: (id: string) => Promise<PersistenceResult<{ id: string }>>;
  };
  settings: {
    get: () => Promise<import("@/types/settings").SiteSettings>;
    save: (input: import("@/types/settings").SiteSettings) => Promise<PersistenceResult<import("@/types/settings").SiteSettings>>;
  };
  snapshot: () => Promise<Catalog>;
};
