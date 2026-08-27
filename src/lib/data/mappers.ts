import type { Category, MediaAsset, Product, ProductDocument, Project, Resource, Service, Solution, TeamMember, TechnicalSpecification, Testimonial } from "@/types/content";
import type { ConsultationRequest, IdentifyRequest, Inquiry, InquiryPriority, InquiryStatus, QuoteRequest, ServiceRequest } from "@/types/inquiries";

type JsonRecord = Record<string, unknown>;

function str(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function opt(value: unknown): string | undefined {
  const text = typeof value === "string" ? value.trim() : "";
  return text ? text : undefined;
}

function bool(value: unknown): boolean {
  return value === true;
}

function num(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function inquiryStatus(value: unknown): InquiryStatus {
  if (value === "in_progress" || value === "contacted" || value === "completed" || value === "archived") {
    return value;
  }
  if (value === "in_review") return "in_progress";
  if (value === "quoted") return "contacted";
  if (value === "closed") return "completed";
  return "new";
}

function inquiryPriority(value: unknown): InquiryPriority {
  return value === "low" || value === "high" || value === "urgent" ? value : "normal";
}

function iso(value: unknown): string {
  if (typeof value === "string") return value;
  if (value instanceof Date) return value.toISOString();
  return new Date().toISOString();
}

function mapMedia(value: unknown): MediaAsset[] {
  return asArray(value).map((item, index) => {
    const row = (item ?? {}) as JsonRecord;
    return {
      id: str(row.id) || `media-${index}`,
      url: str(row.url),
      alt: str(row.alt),
      width: typeof row.width === "number" ? row.width : undefined,
      height: typeof row.height === "number" ? row.height : undefined,
      sortOrder: num(row.sortOrder ?? row.sort_order, index),
    };
  });
}

function mapSpecs(value: unknown): TechnicalSpecification[] {
  return asArray(value).map((item, index) => {
    const row = (item ?? {}) as JsonRecord;
    return {
      id: str(row.id) || `spec-${index}`,
      group: str(row.group) || "General",
      label: str(row.label),
      value: str(row.value),
      unit: opt(row.unit),
      sortOrder: num(row.sortOrder ?? row.sort_order, index),
    };
  });
}

function mapDocuments(value: unknown): ProductDocument[] {
  return asArray(value).map((item, index) => {
    const row = (item ?? {}) as JsonRecord;
    return {
      id: str(row.id) || `doc-${index}`,
      title: str(row.title),
      url: str(row.url),
      fileType: str(row.fileType ?? row.file_type) || "pdf",
      sizeBytes: typeof row.sizeBytes === "number" ? row.sizeBytes : typeof row.size_bytes === "number" ? row.size_bytes : undefined,
    };
  });
}

export function mapCategory(row: JsonRecord): Category {
  return {
    id: str(row.id),
    title: str(row.title),
    slug: str(row.slug),
    summary: str(row.summary),
    description: str(row.description),
    parentId: opt(row.parentId ?? row.parent_id),
    sortOrder: num(row.sortOrder ?? row.sort_order),
    featured: bool(row.featured),
    published: bool(row.published),
    seoTitle: opt(row.seoTitle ?? row.seo_title),
    seoDescription: opt(row.seoDescription ?? row.seo_description),
    createdAt: iso(row.createdAt ?? row.created_at),
    updatedAt: iso(row.updatedAt ?? row.updated_at),
  };
}

export function mapProduct(row: JsonRecord): Product {
  return {
    id: str(row.id),
    title: str(row.title),
    slug: str(row.slug),
    summary: str(row.summary),
    description: str(row.description),
    categoryId: opt(row.categoryId ?? row.category_id),
    categorySlug: opt(row.categorySlug ?? row.category_slug),
    brand: opt(row.brand),
    model: opt(row.model),
    sku: opt(row.sku),
    images: mapMedia(row.images),
    specifications: mapSpecs(row.specifications),
    documents: mapDocuments(row.documents),
    availability:
      row.availability === "available" ||
      row.availability === "made_to_order" ||
      row.availability === "limited" ||
      row.availability === "discontinued" ||
      row.availability === "contact"
        ? row.availability
        : "contact",
    featured: bool(row.featured),
    published: bool(row.published),
    seoTitle: opt(row.seoTitle ?? row.seo_title),
    seoDescription: opt(row.seoDescription ?? row.seo_description),
    createdAt: iso(row.createdAt ?? row.created_at),
    updatedAt: iso(row.updatedAt ?? row.updated_at),
  };
}

function mapSimplePage(row: JsonRecord): Service {
  return {
    id: str(row.id),
    title: str(row.title),
    slug: str(row.slug),
    summary: str(row.summary),
    description: str(row.description),
    sortOrder: num(row.sortOrder ?? row.sort_order),
    published: bool(row.published),
    featured: bool(row.featured),
    seoTitle: opt(row.seoTitle ?? row.seo_title),
    seoDescription: opt(row.seoDescription ?? row.seo_description),
    createdAt: iso(row.createdAt ?? row.created_at),
    updatedAt: iso(row.updatedAt ?? row.updated_at),
  };
}

export const mapService = mapSimplePage;

export function mapSolution(row: JsonRecord): Solution {
  return {
    ...mapSimplePage(row),
    problem: str(row.problem),
    approach: str(row.approach),
    deliverables: asArray(row.deliverables)
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter(Boolean),
  };
}

export function mapProject(row: JsonRecord): Project {
  return {
    ...mapSimplePage(row),
    category: opt(row.category),
    clientName: opt(row.clientName ?? row.client_name),
    location: opt(row.location),
    completedOn: opt(row.completedOn ?? row.completed_on),
    scope: opt(row.scope),
    serviceIds: asArray(row.serviceIds ?? row.service_ids)
      .map((item) => (typeof item === "string" ? item : ""))
      .filter(Boolean),
    results: opt(row.results),
    images: mapMedia(row.images),
  };
}

export function mapResource(row: JsonRecord): Resource {
  const type = str(row.type);
  return {
    ...mapSimplePage(row),
    type:
      type === "article" ||
      type === "brochure" ||
      type === "datasheet" ||
      type === "whitepaper" ||
      type === "video" ||
      type === "other"
        ? type
        : "other",
    url: opt(row.url),
    sortOrder: num(row.sortOrder ?? row.sort_order),
  };
}

export function mapTestimonial(row: JsonRecord): Testimonial {
  return {
    id: str(row.id),
    quote: str(row.quote),
    attribution: str(row.attribution),
    role: opt(row.role),
    organization: opt(row.organization),
    sortOrder: num(row.sortOrder ?? row.sort_order),
    published: bool(row.published),
    featured: bool(row.featured),
    createdAt: iso(row.createdAt ?? row.created_at),
    updatedAt: iso(row.updatedAt ?? row.updated_at),
  };
}

export function mapTeamMember(row: JsonRecord): TeamMember {
  const image = row.image ? mapMedia([row.image])[0] : undefined;
  return {
    id: str(row.id),
    name: str(row.name),
    slug: str(row.slug),
    role: str(row.role),
    bio: str(row.bio),
    image: image?.url ? image : undefined,
    published: bool(row.published),
    sortOrder: num(row.sortOrder ?? row.sort_order),
    createdAt: iso(row.createdAt ?? row.created_at),
    updatedAt: iso(row.updatedAt ?? row.updated_at),
  };
}

function mapInquiryBase(row: JsonRecord) {
  return {
    id: str(row.id),
    name: str(row.name),
    company: str(row.company),
    email: str(row.email),
    phone: str(row.phone),
    requirement: opt(row.requirement),
    message: str(row.message),
    fileUrl: opt(row.fileUrl ?? row.file_url),
    fileName: opt(row.fileName ?? row.file_name),
    status: inquiryStatus(row.status),
    priority: inquiryPriority(row.priority),
    notes: asArray(row.notes).map((item, index) => {
      const note = (item ?? {}) as JsonRecord;
      return {
        id: str(note.id) || `note-${index}`,
        body: str(note.body),
        createdAt: iso(note.createdAt ?? note.created_at),
        author: opt(note.author),
      };
    }),
    attachments: asArray(row.attachments).map((item, index) => {
      const file = (item ?? {}) as JsonRecord;
      return {
        id: str(file.id) || `file-${index}`,
        url: str(file.url),
        fileName: str(file.fileName ?? file.file_name) || "attachment",
        createdAt: iso(file.createdAt ?? file.created_at),
      };
    }),
    createdAt: iso(row.createdAt ?? row.created_at),
    updatedAt: iso(row.updatedAt ?? row.updated_at),
  };
}

export function mapQuoteRequest(row: JsonRecord): QuoteRequest {
  return {
    ...mapInquiryBase(row),
    kind: "quote",
    productSlug: opt(row.productSlug ?? row.product_slug),
    productTitle: opt(row.productTitle ?? row.product_title),
    quantity: opt(row.quantity),
  };
}

export function mapConsultationRequest(row: JsonRecord): ConsultationRequest {
  return {
    ...mapInquiryBase(row),
    kind: "consultation",
    topic: opt(row.topic),
    preferredTiming: opt(row.preferredTiming ?? row.preferred_timing),
  };
}

export function mapServiceRequest(row: JsonRecord): ServiceRequest {
  return {
    ...mapInquiryBase(row),
    kind: "service",
    serviceType: opt(row.serviceType ?? row.service_type),
    millLocation: opt(row.millLocation ?? row.mill_location),
  };
}

export function mapIdentifyRequest(row: JsonRecord): IdentifyRequest {
  return {
    ...mapInquiryBase(row),
    kind: "identify",
    millLocation: opt(row.millLocation ?? row.mill_location),
    photoUrl: opt(row.photoUrl ?? row.photo_url),
    photoName: opt(row.photoName ?? row.photo_name),
  };
}

export function mapInquiry(row: JsonRecord): Inquiry {
  const kind =
    row.kind === "consultation" || row.kind === "service" || row.kind === "identify" ? row.kind : "quote";
  return {
    ...mapInquiryBase(row),
    kind,
    productSlug: opt(row.productSlug ?? row.product_slug),
    productTitle: opt(row.productTitle ?? row.product_title),
    quantity: opt(row.quantity),
    topic: opt(row.topic),
    preferredTiming: opt(row.preferredTiming ?? row.preferred_timing),
    serviceType: opt(row.serviceType ?? row.service_type),
    millLocation: opt(row.millLocation ?? row.mill_location),
    photoUrl: opt(row.photoUrl ?? row.photo_url),
    photoName: opt(row.photoName ?? row.photo_name),
  };
}
