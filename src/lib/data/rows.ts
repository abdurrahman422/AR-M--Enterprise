import type { Category, Product, Project, Resource, Service, Solution, TeamMember, Testimonial } from "@/types/content";
import type { Inquiry } from "@/types/inquiries";
import type { SiteSettings } from "@/types/settings";

export function categoryToRow(category: Category): Record<string, unknown> {
  return {
    id: category.id,
    title: category.title,
    slug: category.slug,
    summary: category.summary,
    description: category.description,
    parent_id: category.parentId ?? null,
    sort_order: category.sortOrder,
    featured: category.featured,
    published: category.published,
    seo_title: category.seoTitle ?? null,
    seo_description: category.seoDescription ?? null,
    created_at: category.createdAt,
    updated_at: category.updatedAt,
  };
}

export function productToRow(product: Product): Record<string, unknown> {
  return {
    id: product.id,
    title: product.title,
    slug: product.slug,
    summary: product.summary,
    description: product.description,
    category_id: product.categoryId ?? null,
    category_slug: product.categorySlug ?? null,
    brand: product.brand ?? null,
    model: product.model ?? null,
    sku: product.sku ?? null,
    images: product.images,
    specifications: product.specifications,
    documents: product.documents,
    availability: product.availability,
    featured: product.featured,
    published: product.published,
    seo_title: product.seoTitle ?? null,
    seo_description: product.seoDescription ?? null,
    created_at: product.createdAt,
    updated_at: product.updatedAt,
  };
}

function pageToRow(entry: Service | Solution): Record<string, unknown> {
  return {
    id: entry.id,
    title: entry.title,
    slug: entry.slug,
    summary: entry.summary,
    description: entry.description,
    sort_order: entry.sortOrder,
    featured: entry.featured,
    published: entry.published,
    seo_title: entry.seoTitle ?? null,
    seo_description: entry.seoDescription ?? null,
    created_at: entry.createdAt,
    updated_at: entry.updatedAt,
  };
}

export const serviceToRow = pageToRow;

export function solutionToRow(solution: Solution): Record<string, unknown> {
  return {
    ...pageToRow(solution),
    problem: solution.problem,
    approach: solution.approach,
    deliverables: solution.deliverables,
  };
}

export function projectToRow(project: Project): Record<string, unknown> {
  return {
    ...pageToRow(project),
    category: project.category ?? null,
    client_name: project.clientName ?? null,
    location: project.location ?? null,
    completed_on: project.completedOn ?? null,
    scope: project.scope ?? null,
    service_ids: project.serviceIds,
    results: project.results ?? null,
    images: project.images,
  };
}

export function resourceToRow(resource: Resource): Record<string, unknown> {
  return {
    id: resource.id,
    title: resource.title,
    slug: resource.slug,
    summary: resource.summary,
    description: resource.description,
    type: resource.type,
    url: resource.url ?? null,
    sort_order: resource.sortOrder,
    featured: resource.featured,
    published: resource.published,
    seo_title: resource.seoTitle ?? null,
    seo_description: resource.seoDescription ?? null,
    created_at: resource.createdAt,
    updated_at: resource.updatedAt,
  };
}

export function testimonialToRow(item: Testimonial): Record<string, unknown> {
  return {
    id: item.id,
    quote: item.quote,
    attribution: item.attribution,
    role: item.role ?? null,
    organization: item.organization ?? null,
    sort_order: item.sortOrder,
    featured: item.featured,
    published: item.published,
    created_at: item.createdAt,
    updated_at: item.updatedAt,
  };
}

export function teamToRow(member: TeamMember): Record<string, unknown> {
  return {
    id: member.id,
    name: member.name,
    slug: member.slug,
    role: member.role,
    bio: member.bio,
    image: member.image ?? null,
    published: member.published,
    sort_order: member.sortOrder,
    created_at: member.createdAt,
    updated_at: member.updatedAt,
  };
}

export function inquiryToRow(inquiry: Inquiry): Record<string, unknown> {
  return {
    id: inquiry.id,
    kind: inquiry.kind,
    name: inquiry.name,
    company: inquiry.company,
    email: inquiry.email,
    phone: inquiry.phone,
    requirement: inquiry.requirement ?? null,
    message: inquiry.message,
    file_url: inquiry.fileUrl ?? null,
    file_name: inquiry.fileName ?? null,
    product_slug: inquiry.productSlug ?? null,
    product_title: inquiry.productTitle ?? null,
    quantity: inquiry.quantity ?? null,
    topic: inquiry.topic ?? null,
    preferred_timing: inquiry.preferredTiming ?? null,
    service_type: inquiry.serviceType ?? null,
    mill_location: inquiry.millLocation ?? null,
    photo_url: inquiry.photoUrl ?? null,
    photo_name: inquiry.photoName ?? null,
    status: inquiry.status,
    priority: inquiry.priority,
    notes: inquiry.notes,
    attachments: inquiry.attachments,
    created_at: inquiry.createdAt,
    updated_at: inquiry.updatedAt,
  };
}

export function settingsToRow(settings: SiteSettings): Record<string, unknown> {
  return { id: "default", payload: settings, updated_at: new Date().toISOString() };
}
