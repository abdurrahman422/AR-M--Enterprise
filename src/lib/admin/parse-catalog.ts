import { createId } from "@/lib/data/helpers";
import { boolField, numberField, stringField } from "@/lib/forms";
import { flattenFieldErrors } from "@/lib/validations/common";
import { categoryWriteSchema, projectWriteSchema, resourceTypeSchema, resourceWriteSchema, serviceWriteSchema, solutionWriteSchema, teamWriteSchema, testimonialWriteSchema } from "@/lib/validations/content";
import { productAvailabilitySchema, productWriteSchema } from "@/lib/validations/product";
import type { CategoryWriteInput, ProductWriteInput, ProjectWriteInput, ServiceWriteInput, SolutionWriteInput } from "@/types/data-provider";

function parseJson(value: string): unknown {
  if (!value) return [];
  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
}

export function parseProductForm(formData: FormData):
  | { ok: true; data: ProductWriteInput }
  | { ok: false; fieldErrors: Record<string, string[] | undefined>; message: string } {
  const title = stringField(formData, "title");
  const imagesRaw = parseJson(stringField(formData, "imagesJson"));
  const specificationsRaw = parseJson(stringField(formData, "specificationsJson"));
  const documentsRaw = parseJson(stringField(formData, "documentsJson"));

  const images = (Array.isArray(imagesRaw) ? imagesRaw as Record<string, unknown>[] : [])
    .map((row, index) => ({
      id: String(row.id || createId()),
      url: String(row.url ?? "").trim(),
      alt: String(row.alt ?? "").trim() || title,
      sortOrder: Number(row.sortOrder) || index,
    }))
    .filter((row) => row.url);

  const specifications = (Array.isArray(specificationsRaw) ? specificationsRaw as Record<string, unknown>[] : [])
    .map((row, index) => ({
      id: String(row.id || createId()),
      group: String(row.group ?? "General").trim() || "General",
      label: String(row.label ?? "").trim(),
      value: String(row.value ?? "").trim(),
      unit: String(row.unit ?? "").trim() || undefined,
      sortOrder: Number(row.sortOrder) || index,
    }))
    .filter((row) => row.label && row.value);

  const documents = (Array.isArray(documentsRaw) ? documentsRaw as Record<string, unknown>[] : [])
    .map((row) => ({
      id: String(row.id || createId()),
      title: String(row.title ?? "").trim(),
      url: String(row.url ?? "").trim(),
      fileType: String(row.fileType ?? "pdf").trim() || "pdf",
      sizeBytes: typeof row.sizeBytes === "number" ? row.sizeBytes : undefined,
    }))
    .filter((row) => row.title && row.url);

  const parsed = productWriteSchema.safeParse({
    title: stringField(formData, "title"),
    slug: stringField(formData, "slug"),
    summary: stringField(formData, "summary"),
    description: stringField(formData, "description"),
    categoryId: stringField(formData, "categoryId") || undefined,
    brand: stringField(formData, "brand") || undefined,
    model: stringField(formData, "model") || undefined,
    sku: stringField(formData, "sku") || undefined,
    images,
    specifications,
    documents,
    availability: productAvailabilitySchema.catch("contact").parse(stringField(formData, "availability") || "contact"),
    featured: boolField(formData, "featured"),
    published: boolField(formData, "published"),
    seoTitle: stringField(formData, "seoTitle") || undefined,
    seoDescription: stringField(formData, "seoDescription") || undefined,
  });

  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: flattenFieldErrors(parsed.error),
      message: "Please correct the highlighted fields.",
    };
  }

  return { ok: true, data: parsed.data };
}

export function parseCategoryForm(formData: FormData):
  | { ok: true; data: CategoryWriteInput }
  | { ok: false; fieldErrors: Record<string, string[] | undefined>; message: string } {
  const parsed = categoryWriteSchema.safeParse({
    title: stringField(formData, "title"),
    slug: stringField(formData, "slug"),
    summary: stringField(formData, "summary"),
    description: stringField(formData, "description"),
    parentId: stringField(formData, "parentId") || undefined,
    sortOrder: numberField(formData, "sortOrder", 0),
    featured: boolField(formData, "featured"),
    published: boolField(formData, "published"),
    seoTitle: stringField(formData, "seoTitle") || undefined,
    seoDescription: stringField(formData, "seoDescription") || undefined,
  });

  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: flattenFieldErrors(parsed.error),
      message: "Please correct the highlighted fields.",
    };
  }

  return { ok: true, data: parsed.data };
}

export function parsePageForm(formData: FormData):
  | { ok: true; data: ServiceWriteInput }
  | { ok: false; fieldErrors: Record<string, string[] | undefined>; message: string } {
  const parsed = serviceWriteSchema.safeParse({
    title: stringField(formData, "title"),
    slug: stringField(formData, "slug"),
    summary: stringField(formData, "summary"),
    description: stringField(formData, "description"),
    sortOrder: numberField(formData, "sortOrder", 0),
    featured: boolField(formData, "featured"),
    published: boolField(formData, "published"),
    seoTitle: stringField(formData, "seoTitle") || undefined,
    seoDescription: stringField(formData, "seoDescription") || undefined,
  });

  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: flattenFieldErrors(parsed.error),
      message: "Please correct the highlighted fields.",
    };
  }

  return { ok: true, data: parsed.data };
}

export function parseSolutionForm(formData: FormData):
  | { ok: true; data: SolutionWriteInput }
  | { ok: false; fieldErrors: Record<string, string[] | undefined>; message: string } {
  const deliverables = stringField(formData, "deliverables")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const parsed = solutionWriteSchema.safeParse({
    title: stringField(formData, "title"),
    slug: stringField(formData, "slug"),
    summary: stringField(formData, "summary"),
    description: stringField(formData, "description"),
    problem: stringField(formData, "problem"),
    approach: stringField(formData, "approach"),
    deliverables,
    sortOrder: numberField(formData, "sortOrder", 0),
    featured: boolField(formData, "featured"),
    published: boolField(formData, "published"),
    seoTitle: stringField(formData, "seoTitle") || undefined,
    seoDescription: stringField(formData, "seoDescription") || undefined,
  });

  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: flattenFieldErrors(parsed.error),
      message: "Please correct the highlighted fields.",
    };
  }

  return { ok: true, data: parsed.data };
}

export function parseProjectForm(formData: FormData):
  | { ok: true; data: ProjectWriteInput }
  | { ok: false; fieldErrors: Record<string, string[] | undefined>; message: string } {
  const title = stringField(formData, "title");
  const imagesRaw = parseJson(stringField(formData, "imagesJson"));
  const images = (Array.isArray(imagesRaw) ? (imagesRaw as Record<string, unknown>[]) : [])
    .map((row, index) => ({
      id: String(row.id || createId()),
      url: String(row.url ?? "").trim(),
      alt: String(row.alt ?? "").trim() || title,
      sortOrder: Number(row.sortOrder) || index,
    }))
    .filter((row) => row.url);

  const parsed = projectWriteSchema.safeParse({
    title,
    slug: stringField(formData, "slug"),
    summary: stringField(formData, "summary"),
    description: stringField(formData, "description"),
    category: stringField(formData, "category") || undefined,
    clientName: stringField(formData, "clientName") || undefined,
    location: stringField(formData, "location") || undefined,
    completedOn: stringField(formData, "completedOn") || undefined,
    scope: stringField(formData, "scope") || undefined,
    serviceIds: formData.getAll("serviceIds").filter((value): value is string => typeof value === "string" && value.length > 0),
    results: stringField(formData, "results") || undefined,
    images,
    sortOrder: numberField(formData, "sortOrder", 0),
    featured: boolField(formData, "featured"),
    published: boolField(formData, "published"),
    seoTitle: stringField(formData, "seoTitle") || undefined,
    seoDescription: stringField(formData, "seoDescription") || undefined,
  });

  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: flattenFieldErrors(parsed.error),
      message: "Please correct the highlighted fields.",
    };
  }

  return { ok: true, data: parsed.data };
}

export function parseResourceForm(formData: FormData) {
  const parsed = resourceWriteSchema.safeParse({
    title: stringField(formData, "title"), slug: stringField(formData, "slug"),
    summary: stringField(formData, "summary"), description: stringField(formData, "description"),
    type: resourceTypeSchema.catch("other").parse(stringField(formData, "type") || "other"),
    url: stringField(formData, "url") || undefined, sortOrder: numberField(formData, "sortOrder", 0),
    published: boolField(formData, "published"), featured: boolField(formData, "featured"),
    seoTitle: stringField(formData, "seoTitle") || undefined, seoDescription: stringField(formData, "seoDescription") || undefined,
  });
  if (!parsed.success) return { ok: false as const, fieldErrors: flattenFieldErrors(parsed.error), message: "Please correct the highlighted fields." };
  return { ok: true as const, data: parsed.data };
}

export function parseTeamForm(formData: FormData) {
  const parsed = teamWriteSchema.safeParse({
    name: stringField(formData, "name"), slug: stringField(formData, "slug"), role: stringField(formData, "role"),
    bio: stringField(formData, "bio"), sortOrder: numberField(formData, "sortOrder", 0),
    published: boolField(formData, "published"), image: undefined,
  });
  if (!parsed.success) return { ok: false as const, fieldErrors: flattenFieldErrors(parsed.error), message: "Please correct the highlighted fields." };
  return { ok: true as const, data: parsed.data };
}

export function parseTestimonialForm(formData: FormData) {
  const parsed = testimonialWriteSchema.safeParse({
    quote: stringField(formData, "quote"), attribution: stringField(formData, "attribution"),
    role: stringField(formData, "role") || undefined, organization: stringField(formData, "organization") || undefined,
    sortOrder: numberField(formData, "sortOrder", 0), published: boolField(formData, "published"), featured: boolField(formData, "featured"),
  });
  if (!parsed.success) return { ok: false as const, fieldErrors: flattenFieldErrors(parsed.error), message: "Please correct the highlighted fields." };
  return { ok: true as const, data: parsed.data };
}
