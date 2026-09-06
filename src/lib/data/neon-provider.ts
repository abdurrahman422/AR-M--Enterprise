import "server-only";

import { unstable_cache } from "next/cache";
import { z } from "zod";
import { createNeonServerClient, isNeonConfigured } from "@/lib/db/neon";
import { createId, notConfiguredResult, nowIso } from "@/lib/data/helpers";
import {
  mapCategory,
  mapInquiry,
  mapProduct,
  mapProject,
  mapResource,
  mapService,
  mapSolution,
  mapTeamMember,
  mapTestimonial,
} from "@/lib/data/mappers";
import { filterPages, filterProducts, resolveCategorySlug } from "@/lib/data/query";
import { categoryToRow, inquiryToRow, productToRow, projectToRow, resourceToRow, serviceToRow, settingsToRow, solutionToRow, teamToRow, testimonialToRow } from "@/lib/data/rows";
import { catalogSchema, categorySchema, inquiryRecordSchema, projectSchema, resourceSchema, serviceSchema, siteSettingsSchema, solutionSchema, teamMemberSchema, testimonialSchema } from "@/lib/validations/content";
import { productSchema } from "@/lib/validations/product";
import type { CategoryWriteInput, DataProvider, ListOptions, PersistenceResult, ProductWriteInput, ProjectWriteInput, ResourceWriteInput, ServiceWriteInput, SolutionWriteInput, TeamWriteInput, TestimonialWriteInput } from "@/types/data-provider";
import type { Category, Product, Project, Resource, Service, Solution, TeamMember, Testimonial } from "@/types/content";
import type { Inquiry, InquiryCreateInput } from "@/types/inquiries";
import { emptySettings, type SiteSettings } from "@/types/settings";

type Mapper<T> = (row: Record<string, unknown>) => T;

function requireClient() {
  if (!isNeonConfigured()) {
    throw new Error("Neon PostgreSQL is not configured.");
  }
  return createNeonServerClient();
}

async function listMapped<T>(
  table: string,
  mapper: Mapper<T>,
  schema: z.ZodType<T>,
  options?: ListOptions,
): Promise<T[]> {
  const client = requireClient();
  let query = client.from(table).select("*");
  if (!options?.includeUnpublished) {
    query = query.eq("published", true);
  }
  if (options?.featuredOnly) {
    query = query.eq("featured", true);
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(error.message);
  }

  const rows = Array.isArray(data) ? data : [];
  return z.array(schema).parse(rows.map((row) => mapper(row as Record<string, unknown>)));
}

async function getMappedBySlug<T extends { slug: string; published: boolean }>(
  table: string,
  mapper: Mapper<T>,
  schema: z.ZodType<T>,
  slug: string,
  options?: ListOptions,
): Promise<T | null> {
  const client = requireClient();
  const { data, error } = await client.from(table).select("*").eq("slug", slug).maybeSingle();
  if (error) {
    throw new Error(error.message);
  }
  if (!data) return null;

  const parsed = schema.parse(mapper(data as unknown as Record<string, unknown>));
  if (!options?.includeUnpublished && !parsed.published) return null;
  return parsed;
}

async function getMappedById<T extends { id: string; published: boolean }>(
  table: string,
  mapper: Mapper<T>,
  schema: z.ZodType<T>,
  id: string,
  options?: ListOptions,
): Promise<T | null> {
  const client = requireClient();
  const { data, error } = await client.from(table).select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;
  const parsed = schema.parse(mapper(data as unknown as Record<string, unknown>));
  if (!options?.includeUnpublished && !parsed.published) return null;
  return parsed;
}

const listPublishedCategories = unstable_cache(
  () => listMapped("categories", mapCategory, categorySchema),
  ["published-categories"],
  { revalidate: 3600, tags: ["catalog", "categories"] },
);

const listPublishedProducts = unstable_cache(
  () => listMapped("products", mapProduct, productSchema),
  ["published-products"],
  { revalidate: 3600, tags: ["catalog", "products"] },
);

const getPublishedProductBySlug = unstable_cache(
  (slug: string) => getMappedBySlug("products", mapProduct, productSchema, slug),
  ["published-product-by-slug"],
  { revalidate: 3600, tags: ["catalog", "products"] },
);

async function writeRow<T>(
  table: string,
  mapper: Mapper<T>,
  schema: z.ZodType<T>,
  row: Record<string, unknown>,
  mode: "insert" | "update",
  id?: string,
): Promise<PersistenceResult<T>> {
  if (!isNeonConfigured()) return notConfiguredResult(table);
  const client = requireClient();
  const query =
    mode === "insert"
      ? client.from(table).insert(row).select("*").single()
      : client.from(table).update(row).eq("id", id).select("*").single();
  const { data, error } = await query;
  if (error || !data) {
    return {
      ok: false,
      code: error?.code === "23505" ? "VALIDATION" : "UNKNOWN",
      message: error?.message ?? "The record could not be saved.",
    };
  }
  return { ok: true, data: schema.parse(mapper(data as unknown as Record<string, unknown>)) };
}

async function deleteRow(table: string, id: string): Promise<PersistenceResult<{ id: string }>> {
  if (!isNeonConfigured()) return notConfiguredResult(table);
  const client = requireClient();
  const { error } = await client.from(table).delete().eq("id", id);
  if (error) {
    return { ok: false, code: "UNKNOWN", message: error.message };
  }
  return { ok: true, data: { id } };
}

async function persistCategory(
  input: CategoryWriteInput,
  current?: Category,
): Promise<PersistenceResult<Category>> {
  const category: Category = {
    ...input,
    id: current?.id ?? createId(),
    createdAt: current?.createdAt ?? nowIso(),
    updatedAt: nowIso(),
  };
  return writeRow("categories", mapCategory, categorySchema, categoryToRow(category), current ? "update" : "insert", current?.id);
}

async function persistProduct(
  input: ProductWriteInput,
  current?: Product,
): Promise<PersistenceResult<Product>> {
  const categories = await listMapped("categories", mapCategory, categorySchema, { includeUnpublished: true });
  const product: Product = {
    ...input,
    id: current?.id ?? createId(),
    categorySlug: resolveCategorySlug(categories, input.categoryId),
    createdAt: current?.createdAt ?? nowIso(),
    updatedAt: nowIso(),
  };
  return writeRow("products", mapProduct, productSchema, productToRow(product), current ? "update" : "insert", current?.id);
}

async function persistPage<T extends Service | Solution>(
  table: "services" | "solutions",
  mapper: Mapper<T>,
  schema: z.ZodType<T>,
  toRow: (entry: T) => Record<string, unknown>,
  input: ServiceWriteInput | SolutionWriteInput,
  current?: T,
): Promise<PersistenceResult<T>> {
  const entry = {
    ...input,
    id: current?.id ?? createId(),
    createdAt: current?.createdAt ?? nowIso(),
    updatedAt: nowIso(),
  } as T;
  return writeRow(table, mapper, schema, toRow(entry), current ? "update" : "insert", current?.id);
}

async function persistProject(
  input: ProjectWriteInput,
  current?: Project,
): Promise<PersistenceResult<Project>> {
  const project: Project = {
    ...input,
    id: current?.id ?? createId(),
    createdAt: current?.createdAt ?? nowIso(),
    updatedAt: nowIso(),
  };
  return writeRow("projects", mapProject, projectSchema, projectToRow(project), current ? "update" : "insert", current?.id);
}

async function persistNeonInquiry(input: InquiryCreateInput): Promise<PersistenceResult<Inquiry>> {
  if (!isNeonConfigured()) return notConfiguredResult("Inquiries");
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
  return writeRow("inquiries", mapInquiry, inquiryRecordSchema, inquiryToRow(inquiry), "insert");
}

export const neonProvider: DataProvider = {
  driver: "neon",
  writable: isNeonConfigured(),
  categories: {
    list: async (options) => {
      const categories = options?.includeUnpublished
        ? await listMapped("categories", mapCategory, categorySchema, options)
        : await listPublishedCategories();
      return categories.sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title));
    },
    getBySlug: (slug, options) => getMappedBySlug("categories", mapCategory, categorySchema, slug, options),
    getById: (id, options) => getMappedById("categories", mapCategory, categorySchema, id, options),
    create: (input) => persistCategory(input),
    update: async (id, input) => {
      const existing = await getMappedById("categories", mapCategory, categorySchema, id, { includeUnpublished: true });
      if (!existing) return { ok: false, code: "UNKNOWN", message: "Category was not found." };
      return persistCategory(input, existing);
    },
    remove: (id) => deleteRow("categories", id),
  },
  products: {
    list: async (options?: ListOptions) => {
      const [products, categories] = await Promise.all([
        options?.includeUnpublished
          ? listMapped("products", mapProduct, productSchema, { includeUnpublished: true })
          : listPublishedProducts(),
        options?.includeUnpublished
          ? listMapped("categories", mapCategory, categorySchema, { includeUnpublished: true })
          : listPublishedCategories(),
      ]);
      return filterProducts(products, categories, options);
    },
    getBySlug: (slug, options) => options?.includeUnpublished
      ? getMappedBySlug("products", mapProduct, productSchema, slug, options)
      : getPublishedProductBySlug(slug),
    getById: (id, options) => getMappedById("products", mapProduct, productSchema, id, options),
    create: (input) => persistProduct(input),
    update: async (id, input) => {
      const existing = await getMappedById("products", mapProduct, productSchema, id, { includeUnpublished: true });
      if (!existing) return { ok: false, code: "UNKNOWN", message: "Product was not found." };
      return persistProduct(input, existing);
    },
    remove: (id) => deleteRow("products", id),
  },
  services: {
    list: async (options) => filterPages(await listMapped("services", mapService, serviceSchema, options), options),
    getBySlug: (slug, options) => getMappedBySlug("services", mapService, serviceSchema, slug, options),
    getById: (id, options) => getMappedById("services", mapService, serviceSchema, id, options),
    create: (input: ServiceWriteInput) =>
      persistPage("services", mapService, serviceSchema, serviceToRow, input),
    update: async (id, input: ServiceWriteInput) => {
      const existing = await getMappedById("services", mapService, serviceSchema, id, { includeUnpublished: true });
      if (!existing) return { ok: false, code: "UNKNOWN", message: "Service was not found." };
      return persistPage("services", mapService, serviceSchema, serviceToRow, input, existing);
    },
    remove: (id) => deleteRow("services", id),
  },
  solutions: {
    list: async (options) => filterPages(await listMapped("solutions", mapSolution, solutionSchema, options), options),
    getBySlug: (slug, options) => getMappedBySlug("solutions", mapSolution, solutionSchema, slug, options),
    getById: (id, options) => getMappedById("solutions", mapSolution, solutionSchema, id, options),
    create: (input: SolutionWriteInput) =>
      persistPage("solutions", mapSolution, solutionSchema, solutionToRow, input),
    update: async (id, input: SolutionWriteInput) => {
      const existing = await getMappedById("solutions", mapSolution, solutionSchema, id, { includeUnpublished: true });
      if (!existing) return { ok: false, code: "UNKNOWN", message: "Solution was not found." };
      return persistPage("solutions", mapSolution, solutionSchema, solutionToRow, input, existing);
    },
    remove: (id) => deleteRow("solutions", id),
  },
  projects: {
    list: async (options) => filterPages(await listMapped("projects", mapProject, projectSchema, options), options),
    getBySlug: (slug, options) => getMappedBySlug("projects", mapProject, projectSchema, slug, options),
    getById: (id, options) => getMappedById("projects", mapProject, projectSchema, id, options),
    create: (input: ProjectWriteInput) => persistProject(input),
    update: async (id, input: ProjectWriteInput) => {
      const existing = await getMappedById("projects", mapProject, projectSchema, id, { includeUnpublished: true });
      if (!existing) return { ok: false, code: "UNKNOWN", message: "Project was not found." };
      return persistProject(input, existing);
    },
    remove: (id) => deleteRow("projects", id),
  },
  resources: {
    list: async (options) => filterPages(await listMapped("resources", mapResource, resourceSchema, options), options),
    getBySlug: (slug, options) => getMappedBySlug("resources", mapResource, resourceSchema, slug, options),
    getById: (id, options) => getMappedById("resources", mapResource, resourceSchema, id, options),
    create: (input: ResourceWriteInput) => {
      const item: Resource = { ...input, id: createId(), createdAt: nowIso(), updatedAt: nowIso() };
      return writeRow("resources", mapResource, resourceSchema, resourceToRow(item), "insert");
    },
    update: async (id, input: ResourceWriteInput) => {
      const existing = await getMappedById("resources", mapResource, resourceSchema, id, { includeUnpublished: true });
      if (!existing) return { ok: false, code: "UNKNOWN", message: "Resource was not found." };
      const item: Resource = { ...input, id, createdAt: existing.createdAt, updatedAt: nowIso() };
      return writeRow("resources", mapResource, resourceSchema, resourceToRow(item), "update", id);
    },
    remove: (id) => deleteRow("resources", id),
  },
  testimonials: {
    list: async (options) => {
      const items = await listMapped("testimonials", mapTestimonial, testimonialSchema, options);
      return items.sort((a, b) => a.sortOrder - b.sortOrder);
    },
    getById: (id, options) => getMappedById("testimonials", mapTestimonial, testimonialSchema, id, options),
    create: (input: TestimonialWriteInput) => {
      const item: Testimonial = { ...input, id: createId(), createdAt: nowIso(), updatedAt: nowIso() };
      return writeRow("testimonials", mapTestimonial, testimonialSchema, testimonialToRow(item), "insert");
    },
    update: async (id, input: TestimonialWriteInput) => {
      const existing = await getMappedById("testimonials", mapTestimonial, testimonialSchema, id, { includeUnpublished: true });
      if (!existing) return { ok: false, code: "UNKNOWN", message: "Testimonial was not found." };
      const item: Testimonial = { ...input, id, createdAt: existing.createdAt, updatedAt: nowIso() };
      return writeRow("testimonials", mapTestimonial, testimonialSchema, testimonialToRow(item), "update", id);
    },
    remove: (id) => deleteRow("testimonials", id),
  },
  team: {
    list: async (options) => {
      const members = await listMapped("team_members", mapTeamMember, teamMemberSchema, options);
      return members.sort((a: TeamMember, b: TeamMember) => a.sortOrder - b.sortOrder);
    },
    getBySlug: (slug, options) => getMappedBySlug("team_members", mapTeamMember, teamMemberSchema, slug, options),
    getById: (id, options) => getMappedById("team_members", mapTeamMember, teamMemberSchema, id, options),
    create: (input: TeamWriteInput) => {
      const item: TeamMember = { ...input, id: createId(), createdAt: nowIso(), updatedAt: nowIso() };
      return writeRow("team_members", mapTeamMember, teamMemberSchema, teamToRow(item), "insert");
    },
    update: async (id, input: TeamWriteInput) => {
      const existing = await getMappedById("team_members", mapTeamMember, teamMemberSchema, id, { includeUnpublished: true });
      if (!existing) return { ok: false, code: "UNKNOWN", message: "Team member was not found." };
      const item: TeamMember = { ...input, id, createdAt: existing.createdAt, updatedAt: nowIso() };
      return writeRow("team_members", mapTeamMember, teamMemberSchema, teamToRow(item), "update", id);
    },
    remove: (id) => deleteRow("team_members", id),
  },
  inquiries: {
    createQuote: async (input) => persistNeonInquiry({ ...input, kind: "quote" }),
    createConsultation: async (input) => persistNeonInquiry({ ...input, kind: "consultation" }),
    createService: async (input) => persistNeonInquiry({ ...input, kind: "service" }),
    createIdentify: async (input) => persistNeonInquiry({ ...input, kind: "identify" }),
    list: async (kind) => {
      const client = requireClient();
      let query = client.from("inquiries").select("*").order("created_at", { ascending: false });
      if (kind) query = query.eq("kind", kind);
      const { data, error } = await query;
      if (error) throw new Error(error.message);
      const rows: unknown[] = Array.isArray(data) ? data : [];
      return rows.map((row) => mapInquiry(row as Record<string, unknown>));
    },
    getById: async (id) => {
      const client = requireClient();
      const { data, error } = await client.from("inquiries").select("*").eq("id", id).maybeSingle();
      if (error) throw new Error(error.message);
      return data ? mapInquiry(data as unknown as Record<string, unknown>) : null;
    },
    update: async (id, patch) => {
      const existing = await neonProvider.inquiries.getById(id);
      if (!existing) return { ok: false, code: "UNKNOWN", message: "Inquiry was not found." };
      const next = { ...existing, ...patch, updatedAt: nowIso() };
      return writeRow("inquiries", mapInquiry, inquiryRecordSchema, inquiryToRow(next), "update", id);
    },
    remove: (id) => deleteRow("inquiries", id),
  },
  settings: {
    get: async () => {
      const client = requireClient();
      const { data, error } = await client.from("site_settings").select("payload").eq("id", "default").maybeSingle();
      if (error || !data) return emptySettings();
      return siteSettingsSchema.parse(((data as unknown as { payload: unknown } | null)?.payload) ?? {});
    },
    save: async (input: SiteSettings) => {
      const parsed = siteSettingsSchema.parse(input);
      const result = await writeRow(
        "site_settings",
        (row) => siteSettingsSchema.parse((row.payload ?? row) as unknown),
        siteSettingsSchema,
        settingsToRow(parsed),
        "update",
        "default",
      );
      if (!result.ok) {
        return writeRow(
          "site_settings",
          (row) => siteSettingsSchema.parse((row.payload ?? row) as unknown),
          siteSettingsSchema,
          settingsToRow(parsed),
          "insert",
        );
      }
      return result;
    },
  },
  snapshot: async () => {
    const [categories, products, services, solutions, projects, resources, testimonials, team] =
      await Promise.all([
        listMapped("categories", mapCategory, categorySchema, { includeUnpublished: true }),
        listMapped("products", mapProduct, productSchema, { includeUnpublished: true }),
        listMapped("services", mapService, serviceSchema, { includeUnpublished: true }),
        listMapped("solutions", mapSolution, solutionSchema, { includeUnpublished: true }),
        listMapped("projects", mapProject, projectSchema, { includeUnpublished: true }),
        listMapped("resources", mapResource, resourceSchema, { includeUnpublished: true }),
        listMapped("testimonials", mapTestimonial, testimonialSchema, { includeUnpublished: true }),
        listMapped("team_members", mapTeamMember, teamMemberSchema, { includeUnpublished: true }),
      ]);

    return catalogSchema.parse({
      categories,
      products,
      services,
      solutions,
      projects,
      resources,
      testimonials,
      team,
      inquiries: [],
      settings: emptySettings(),
    });
  },
};
