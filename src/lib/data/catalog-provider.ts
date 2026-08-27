import "server-only";

import {
  createId,
  findById,
  findBySlug,
  isEphemeralHost,
  notConfiguredResult,
  nowIso,
} from "@/lib/data/helpers";
import { loadCatalog, saveCatalog, isCatalogWritable } from "@/lib/data/catalog-store";
import { collectDescendantIds, filterPages, filterProducts, resolveCategorySlug } from "@/lib/data/query";
import type { Category, Product, Project, Resource, Service, Solution, TeamMember, Testimonial } from "@/types/content";
import type { Inquiry, InquiryCreateInput } from "@/types/inquiries";
import type { SiteSettings } from "@/types/settings";
import { emptySettings } from "@/types/settings";
import type {
  CategoryWriteInput,
  DataProvider,
  ListOptions,
  PersistenceResult,
  ProductWriteInput,
  ProjectWriteInput,
  ResourceWriteInput,
  ServiceWriteInput,
  SolutionWriteInput,
  TeamWriteInput,
  TestimonialWriteInput,
} from "@/types/data-provider";

function failWrite(entity: string): PersistenceResult<never> {
  if (isEphemeralHost()) {
    return notConfiguredResult(entity);
  }
  return {
    ok: false,
    code: "UNKNOWN",
    message: `${entity} could not be written to the local catalog store.`,
  };
}

function hydrateProduct(input: ProductWriteInput, current?: Product): Product {
  const catalog = loadCatalog();
  const timestamp = nowIso();
  return {
    ...input,
    id: current?.id ?? createId(),
    categorySlug: resolveCategorySlug(catalog.categories, input.categoryId),
    createdAt: current?.createdAt ?? timestamp,
    updatedAt: timestamp,
  };
}

function hydrateCategory(input: CategoryWriteInput, current?: Category): Category {
  const timestamp = nowIso();
  return {
    ...input,
    id: current?.id ?? createId(),
    createdAt: current?.createdAt ?? timestamp,
    updatedAt: timestamp,
  };
}

function hydrateTimestamp<T extends { id: string }>(
  input: Omit<T, "id" | "createdAt" | "updatedAt">,
  current?: T,
): T {
  const timestamp = nowIso();
  return {
    ...input,
    id: current?.id ?? createId(),
    createdAt: current ? (current as T & { createdAt: string }).createdAt : timestamp,
    updatedAt: timestamp,
  } as unknown as T;
}

function slugConflict<T extends { id: string; slug: string }>(
  items: T[],
  slug: string,
  excludeId?: string,
): PersistenceResult<never> | null {
  if (items.some((item) => item.slug === slug && item.id !== excludeId)) {
    return { ok: false, code: "VALIDATION", message: "A record with this slug already exists." };
  }
  return null;
}

export const catalogProvider: DataProvider = {
  driver: "catalog",
  writable: isCatalogWritable(),
  categories: {
    list: async (options?: ListOptions) => {
      const categories = loadCatalog().categories;
      return categories
        .filter((category) => options?.includeUnpublished || category.published)
        .filter((category) => !options?.featuredOnly || category.featured)
        .sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title));
    },
    getBySlug: async (slug, options) => findBySlug(loadCatalog().categories, slug, options),
    getById: async (id, options) => findById(loadCatalog().categories, id, options),
    create: async (input) => {
      const current = loadCatalog();
      if (current.categories.some((category) => category.slug === input.slug)) {
        return { ok: false, code: "VALIDATION", message: "A category with this slug already exists." };
      }
      if (input.parentId && !current.categories.some((category) => category.id === input.parentId)) {
        return { ok: false, code: "VALIDATION", message: "Parent category was not found." };
      }
      const category = hydrateCategory(input);
      current.categories.push(category);
      if (!saveCatalog(current)) return failWrite("Categories");
      return { ok: true, data: category };
    },
    update: async (id, input) => {
      const current = loadCatalog();
      const existing = current.categories.find((category) => category.id === id);
      if (!existing) {
        return { ok: false, code: "UNKNOWN", message: "Category was not found." };
      }
      if (current.categories.some((category) => category.slug === input.slug && category.id !== id)) {
        return { ok: false, code: "VALIDATION", message: "A category with this slug already exists." };
      }
      if (input.parentId === id) {
        return { ok: false, code: "VALIDATION", message: "A category cannot be its own parent." };
      }
      if (input.parentId && collectDescendantIds(current.categories, id).includes(input.parentId)) {
        return { ok: false, code: "VALIDATION", message: "A category cannot be nested under one of its children." };
      }
      const category = hydrateCategory(input, existing);
      current.categories = current.categories.map((item) => (item.id === id ? category : item));
      current.products = current.products.map((product) =>
        product.categoryId === id ? { ...product, categorySlug: category.slug, updatedAt: nowIso() } : product,
      );
      if (!saveCatalog(current)) return failWrite("Categories");
      return { ok: true, data: category };
    },
    remove: async (id) => {
      const current = loadCatalog();
      if (current.categories.some((category) => category.parentId === id)) {
        return { ok: false, code: "VALIDATION", message: "Remove or reassign child categories before deleting this one." };
      }
      if (current.products.some((product) => product.categoryId === id)) {
        return { ok: false, code: "VALIDATION", message: "Reassign products in this category before deleting it." };
      }
      if (!current.categories.some((category) => category.id === id)) {
        return { ok: false, code: "UNKNOWN", message: "Category was not found." };
      }
      current.categories = current.categories.filter((category) => category.id !== id);
      if (!saveCatalog(current)) return failWrite("Categories");
      return { ok: true, data: { id } };
    },
  },
  products: {
    list: async (options?: ListOptions) => {
      const current = loadCatalog();
      return filterProducts(current.products, current.categories, options);
    },
    getBySlug: async (slug, options) => findBySlug(loadCatalog().products, slug, options),
    getById: async (id, options) => findById(loadCatalog().products, id, options),
    create: async (input) => {
      const current = loadCatalog();
      if (current.products.some((product) => product.slug === input.slug)) {
        return { ok: false, code: "VALIDATION", message: "A product with this slug already exists." };
      }
      if (input.sku && current.products.some((product) => product.sku === input.sku)) {
        return { ok: false, code: "VALIDATION", message: "A product with this SKU already exists." };
      }
      const product = hydrateProduct(input);
      current.products.push(product);
      if (!saveCatalog(current)) return failWrite("Products");
      return { ok: true, data: product };
    },
    update: async (id, input) => {
      const current = loadCatalog();
      const existing = current.products.find((product) => product.id === id);
      if (!existing) {
        return { ok: false, code: "UNKNOWN", message: "Product was not found." };
      }
      if (current.products.some((product) => product.slug === input.slug && product.id !== id)) {
        return { ok: false, code: "VALIDATION", message: "A product with this slug already exists." };
      }
      if (input.sku && current.products.some((product) => product.sku === input.sku && product.id !== id)) {
        return { ok: false, code: "VALIDATION", message: "A product with this SKU already exists." };
      }
      const product = hydrateProduct(input, existing);
      current.products = current.products.map((item) => (item.id === id ? product : item));
      if (!saveCatalog(current)) return failWrite("Products");
      return { ok: true, data: product };
    },
    remove: async (id) => {
      const current = loadCatalog();
      if (!current.products.some((product) => product.id === id)) {
        return { ok: false, code: "UNKNOWN", message: "Product was not found." };
      }
      current.products = current.products.filter((product) => product.id !== id);
      if (!saveCatalog(current)) return failWrite("Products");
      return { ok: true, data: { id } };
    },
  },
  services: {
    list: async (options?: ListOptions) => filterPages(loadCatalog().services, options),
    getBySlug: async (slug, options) => findBySlug(loadCatalog().services, slug, options),
    getById: async (id, options) => findById(loadCatalog().services, id, options),
    create: async (input: ServiceWriteInput) => {
      const current = loadCatalog();
      const conflict = slugConflict(current.services, input.slug);
      if (conflict) return conflict;
      const service = hydrateTimestamp<Service>(input);
      current.services.push(service);
      if (!saveCatalog(current)) return failWrite("Services");
      return { ok: true, data: service };
    },
    update: async (id, input: ServiceWriteInput) => {
      const current = loadCatalog();
      const existing = current.services.find((item) => item.id === id);
      if (!existing) return { ok: false, code: "UNKNOWN", message: "Service was not found." };
      const conflict = slugConflict(current.services, input.slug, id);
      if (conflict) return conflict;
      const service = hydrateTimestamp<Service>(input, existing);
      current.services = current.services.map((item) => (item.id === id ? service : item));
      if (!saveCatalog(current)) return failWrite("Services");
      return { ok: true, data: service };
    },
    remove: async (id) => {
      const current = loadCatalog();
      if (!current.services.some((item) => item.id === id)) {
        return { ok: false, code: "UNKNOWN", message: "Service was not found." };
      }
      current.services = current.services.filter((item) => item.id !== id);
      if (!saveCatalog(current)) return failWrite("Services");
      return { ok: true, data: { id } };
    },
  },
  solutions: {
    list: async (options?: ListOptions) => filterPages(loadCatalog().solutions, options),
    getBySlug: async (slug, options) => findBySlug(loadCatalog().solutions, slug, options),
    getById: async (id, options) => findById(loadCatalog().solutions, id, options),
    create: async (input: SolutionWriteInput) => {
      const current = loadCatalog();
      const conflict = slugConflict(current.solutions, input.slug);
      if (conflict) return conflict;
      const solution = hydrateTimestamp<Solution>(input);
      current.solutions.push(solution);
      if (!saveCatalog(current)) return failWrite("Solutions");
      return { ok: true, data: solution };
    },
    update: async (id, input: SolutionWriteInput) => {
      const current = loadCatalog();
      const existing = current.solutions.find((item) => item.id === id);
      if (!existing) return { ok: false, code: "UNKNOWN", message: "Solution was not found." };
      const conflict = slugConflict(current.solutions, input.slug, id);
      if (conflict) return conflict;
      const solution = hydrateTimestamp<Solution>(input, existing);
      current.solutions = current.solutions.map((item) => (item.id === id ? solution : item));
      if (!saveCatalog(current)) return failWrite("Solutions");
      return { ok: true, data: solution };
    },
    remove: async (id) => {
      const current = loadCatalog();
      if (!current.solutions.some((item) => item.id === id)) {
        return { ok: false, code: "UNKNOWN", message: "Solution was not found." };
      }
      current.solutions = current.solutions.filter((item) => item.id !== id);
      if (!saveCatalog(current)) return failWrite("Solutions");
      return { ok: true, data: { id } };
    },
  },
  projects: {
    list: async (options?: ListOptions) => filterPages(loadCatalog().projects, options),
    getBySlug: async (slug, options) => findBySlug(loadCatalog().projects, slug, options),
    getById: async (id, options) => findById(loadCatalog().projects, id, options),
    create: async (input: ProjectWriteInput) => {
      const current = loadCatalog();
      const conflict = slugConflict(current.projects, input.slug);
      if (conflict) return conflict;
      const project = hydrateTimestamp<Project>(input);
      current.projects.push(project);
      if (!saveCatalog(current)) return failWrite("Projects");
      return { ok: true, data: project };
    },
    update: async (id, input: ProjectWriteInput) => {
      const current = loadCatalog();
      const existing = current.projects.find((item) => item.id === id);
      if (!existing) return { ok: false, code: "UNKNOWN", message: "Project was not found." };
      const conflict = slugConflict(current.projects, input.slug, id);
      if (conflict) return conflict;
      const project = hydrateTimestamp<Project>(input, existing);
      current.projects = current.projects.map((item) => (item.id === id ? project : item));
      if (!saveCatalog(current)) return failWrite("Projects");
      return { ok: true, data: project };
    },
    remove: async (id) => {
      const current = loadCatalog();
      if (!current.projects.some((item) => item.id === id)) {
        return { ok: false, code: "UNKNOWN", message: "Project was not found." };
      }
      current.projects = current.projects.filter((item) => item.id !== id);
      if (!saveCatalog(current)) return failWrite("Projects");
      return { ok: true, data: { id } };
    },
  },
  resources: {
    list: async (options?: ListOptions) => filterPages(loadCatalog().resources, options),
    getBySlug: async (slug, options) => findBySlug(loadCatalog().resources, slug, options),
    getById: async (id, options) => findById(loadCatalog().resources, id, options),
    create: async (input: ResourceWriteInput) => {
      const current = loadCatalog();
      const conflict = slugConflict(current.resources, input.slug);
      if (conflict) return conflict;
      const resource = hydrateTimestamp<Resource>(input);
      current.resources.push(resource);
      if (!saveCatalog(current)) return failWrite("Resources");
      return { ok: true, data: resource };
    },
    update: async (id, input: ResourceWriteInput) => {
      const current = loadCatalog();
      const existing = current.resources.find((item) => item.id === id);
      if (!existing) return { ok: false, code: "UNKNOWN", message: "Resource was not found." };
      const conflict = slugConflict(current.resources, input.slug, id);
      if (conflict) return conflict;
      const resource = hydrateTimestamp<Resource>(input, existing);
      current.resources = current.resources.map((item) => (item.id === id ? resource : item));
      if (!saveCatalog(current)) return failWrite("Resources");
      return { ok: true, data: resource };
    },
    remove: async (id) => {
      const current = loadCatalog();
      if (!current.resources.some((item) => item.id === id)) {
        return { ok: false, code: "UNKNOWN", message: "Resource was not found." };
      }
      current.resources = current.resources.filter((item) => item.id !== id);
      if (!saveCatalog(current)) return failWrite("Resources");
      return { ok: true, data: { id } };
    },
  },
  testimonials: {
    list: async (options?: ListOptions) =>
      applyPublished(loadCatalog().testimonials, options).sort((a, b) => a.sortOrder - b.sortOrder),
    getById: async (id, options) => findById(loadCatalog().testimonials, id, options),
    create: async (input: TestimonialWriteInput) => {
      const current = loadCatalog();
      const item = hydrateTimestamp<Testimonial>(input);
      current.testimonials.push(item);
      if (!saveCatalog(current)) return failWrite("Testimonials");
      return { ok: true, data: item };
    },
    update: async (id, input: TestimonialWriteInput) => {
      const current = loadCatalog();
      const existing = current.testimonials.find((item) => item.id === id);
      if (!existing) return { ok: false, code: "UNKNOWN", message: "Testimonial was not found." };
      const item = hydrateTimestamp<Testimonial>(input, existing);
      current.testimonials = current.testimonials.map((entry) => (entry.id === id ? item : entry));
      if (!saveCatalog(current)) return failWrite("Testimonials");
      return { ok: true, data: item };
    },
    remove: async (id) => {
      const current = loadCatalog();
      if (!current.testimonials.some((item) => item.id === id)) {
        return { ok: false, code: "UNKNOWN", message: "Testimonial was not found." };
      }
      current.testimonials = current.testimonials.filter((item) => item.id !== id);
      if (!saveCatalog(current)) return failWrite("Testimonials");
      return { ok: true, data: { id } };
    },
  },
  team: {
    list: async (options?: ListOptions) =>
      applyPublished(loadCatalog().team, options).sort((a, b) => a.sortOrder - b.sortOrder),
    getBySlug: async (slug, options) => findBySlug(loadCatalog().team, slug, options),
    getById: async (id, options) => findById(loadCatalog().team, id, options),
    create: async (input: TeamWriteInput) => {
      const current = loadCatalog();
      const conflict = slugConflict(current.team, input.slug);
      if (conflict) return conflict;
      const member = hydrateTimestamp<TeamMember>(input);
      current.team.push(member);
      if (!saveCatalog(current)) return failWrite("Team");
      return { ok: true, data: member };
    },
    update: async (id, input: TeamWriteInput) => {
      const current = loadCatalog();
      const existing = current.team.find((item) => item.id === id);
      if (!existing) return { ok: false, code: "UNKNOWN", message: "Team member was not found." };
      const conflict = slugConflict(current.team, input.slug, id);
      if (conflict) return conflict;
      const member = hydrateTimestamp<TeamMember>(input, existing);
      current.team = current.team.map((item) => (item.id === id ? member : item));
      if (!saveCatalog(current)) return failWrite("Team");
      return { ok: true, data: member };
    },
    remove: async (id) => {
      const current = loadCatalog();
      if (!current.team.some((item) => item.id === id)) {
        return { ok: false, code: "UNKNOWN", message: "Team member was not found." };
      }
      current.team = current.team.filter((item) => item.id !== id);
      if (!saveCatalog(current)) return failWrite("Team");
      return { ok: true, data: { id } };
    },
  },
  inquiries: {
    createQuote: async (input) => persistInquiry({ ...input, kind: "quote" }),
    createConsultation: async (input) => persistInquiry({ ...input, kind: "consultation" }),
    createService: async (input) => persistInquiry({ ...input, kind: "service" }),
    createIdentify: async (input) => persistInquiry({ ...input, kind: "identify" }),
    list: async (kind) => {
      const items = loadCatalog().inquiries ?? [];
      return kind ? items.filter((item) => item.kind === kind) : items;
    },
    getById: async (id) => (loadCatalog().inquiries ?? []).find((item) => item.id === id) ?? null,
    update: async (id, patch) => {
      const current = loadCatalog();
      const existing = (current.inquiries ?? []).find((item) => item.id === id);
      if (!existing) return { ok: false, code: "UNKNOWN", message: "Inquiry was not found." };
      const next = { ...existing, ...patch, updatedAt: nowIso() };
      current.inquiries = current.inquiries.map((item) => (item.id === id ? next : item));
      if (!saveCatalog(current)) return failWrite("Inquiries");
      return { ok: true, data: next };
    },
    remove: async (id) => {
      const current = loadCatalog();
      if (!(current.inquiries ?? []).some((item) => item.id === id)) {
        return { ok: false, code: "UNKNOWN", message: "Inquiry was not found." };
      }
      current.inquiries = current.inquiries.filter((item) => item.id !== id);
      if (!saveCatalog(current)) return failWrite("Inquiries");
      return { ok: true, data: { id } };
    },
  },
  settings: {
    get: async () => loadCatalog().settings ?? emptySettings(),
    save: async (input: SiteSettings) => {
      const current = loadCatalog();
      current.settings = input;
      if (!saveCatalog(current)) return failWrite("Settings");
      return { ok: true, data: input };
    },
  },
  snapshot: async () => loadCatalog(),
};

function applyPublished<T extends { published: boolean; featured?: boolean }>(items: T[], options?: ListOptions): T[] {
  return items.filter((item) => {
    if (!options?.includeUnpublished && !item.published) return false;
    if (options?.featuredOnly && !item.featured) return false;
    return true;
  });
}

function persistInquiry(input: InquiryCreateInput): PersistenceResult<Inquiry> {
  const current = loadCatalog();
  const timestamp = nowIso();
  const inquiry: Inquiry = {
    ...input,
    id: createId(),
    status: "new",
    priority: "normal",
    notes: [],
    attachments: input.fileUrl
      ? [{ id: createId(), url: input.fileUrl, fileName: input.fileName || "attachment", createdAt: timestamp }]
      : [],
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  current.inquiries = [inquiry, ...(current.inquiries ?? [])];
  if (!saveCatalog(current)) return failWrite("Inquiries");
  return { ok: true, data: inquiry };
}
