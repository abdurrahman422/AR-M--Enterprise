"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { parseCategoryForm, parsePageForm, parseProductForm, parseProjectForm, parseResourceForm, parseSolutionForm, parseTeamForm, parseTestimonialForm } from "@/lib/admin/parse-catalog";
import { requireAdmin } from "@/lib/auth/guards";
import { data } from "@/lib/data";
import { stringField, type ActionState } from "@/lib/forms";
import { boolField } from "@/lib/forms";
import { siteSettingsSchema } from "@/lib/validations/content";
import { inquiryPrioritySchema, inquiryStatusSchema } from "@/lib/validations/content";

function persistState(result: { ok: false; code: string; message: string }): ActionState {
  return {
    status: result.code === "NOT_CONFIGURED" ? "unconfigured" : "error",
    message: result.message,
  };
}

function refreshCatalog() {
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/products/[slug]", "page");
  revalidatePath("/categories");
  revalidatePath("/categories/[slug]", "page");
  revalidatePath("/services");
  revalidatePath("/services/[slug]", "page");
  revalidatePath("/solutions");
  revalidatePath("/solutions/[slug]", "page");
  revalidatePath("/projects");
  revalidatePath("/projects/[slug]", "page");
  revalidatePath("/resources");
  revalidatePath("/resources/[slug]", "page");
  revalidatePath("/team");
  revalidatePath("/admin");
  revalidatePath("/admin/products");
  revalidatePath("/admin/products/[id]", "page");
  revalidatePath("/admin/categories");
  revalidatePath("/admin/services");
  revalidatePath("/admin/solutions");
  revalidatePath("/admin/projects");
  revalidatePath("/admin/resources");
  revalidatePath("/admin/team");
  revalidatePath("/admin/testimonials");
  updateTag("catalog");
  updateTag("products");
  updateTag("categories");
  updateTag("content");
}

export async function createProductAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = parseProductForm(formData);
  if (!parsed.ok) return { status: "error", message: parsed.message, fieldErrors: parsed.fieldErrors };
  const result = await data.products.create(parsed.data);
  if (!result.ok) return persistState(result);
  refreshCatalog();
  redirect(`/admin/products/${result.data.id}/edit?created=1`);
}

export async function updateProductAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const id = stringField(formData, "id");
  const parsed = parseProductForm(formData);
  if (!parsed.ok) return { status: "error", message: parsed.message, fieldErrors: parsed.fieldErrors };
  const result = await data.products.update(id, parsed.data);
  if (!result.ok) return persistState(result);
  refreshCatalog();
  redirect(`/admin/products/${id}/edit?saved=1`);
}

export async function deleteProductAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = stringField(formData, "id");
  const result = await data.products.remove(id);
  refreshCatalog();
  if (!result.ok) {
    redirect(`/admin/products?error=${encodeURIComponent(result.message)}`);
  }
  redirect("/admin/products?deleted=1");
}

export async function createCategoryAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = parseCategoryForm(formData);
  if (!parsed.ok) return { status: "error", message: parsed.message, fieldErrors: parsed.fieldErrors };
  const result = await data.categories.create(parsed.data);
  if (!result.ok) return persistState(result);
  refreshCatalog();
  redirect(`/admin/categories/${result.data.id}/edit?created=1`);
}

export async function updateCategoryAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const id = stringField(formData, "id");
  const parsed = parseCategoryForm(formData);
  if (!parsed.ok) return { status: "error", message: parsed.message, fieldErrors: parsed.fieldErrors };
  const result = await data.categories.update(id, parsed.data);
  if (!result.ok) return persistState(result);
  refreshCatalog();
  redirect(`/admin/categories/${id}/edit?saved=1`);
}

export async function deleteCategoryAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = stringField(formData, "id");
  const result = await data.categories.remove(id);
  refreshCatalog();
  if (!result.ok) {
    redirect(`/admin/categories?error=${encodeURIComponent(result.message)}`);
  }
  redirect("/admin/categories?deleted=1");
}

export async function createServiceAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = parsePageForm(formData);
  if (!parsed.ok) return { status: "error", message: parsed.message, fieldErrors: parsed.fieldErrors };
  const result = await data.services.create(parsed.data);
  if (!result.ok) return persistState(result);
  refreshCatalog();
  redirect(`/admin/services/${result.data.id}/edit?created=1`);
}

export async function updateServiceAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const id = stringField(formData, "id");
  const parsed = parsePageForm(formData);
  if (!parsed.ok) return { status: "error", message: parsed.message, fieldErrors: parsed.fieldErrors };
  const result = await data.services.update(id, parsed.data);
  if (!result.ok) return persistState(result);
  refreshCatalog();
  redirect(`/admin/services/${id}/edit?saved=1`);
}

export async function deleteServiceAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = stringField(formData, "id");
  const result = await data.services.remove(id);
  refreshCatalog();
  if (!result.ok) redirect(`/admin/services?error=${encodeURIComponent(result.message)}`);
  redirect("/admin/services?deleted=1");
}

export async function createSolutionAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = parseSolutionForm(formData);
  if (!parsed.ok) return { status: "error", message: parsed.message, fieldErrors: parsed.fieldErrors };
  const result = await data.solutions.create(parsed.data);
  if (!result.ok) return persistState(result);
  refreshCatalog();
  redirect(`/admin/solutions/${result.data.id}/edit?created=1`);
}

export async function updateSolutionAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const id = stringField(formData, "id");
  const parsed = parseSolutionForm(formData);
  if (!parsed.ok) return { status: "error", message: parsed.message, fieldErrors: parsed.fieldErrors };
  const result = await data.solutions.update(id, parsed.data);
  if (!result.ok) return persistState(result);
  refreshCatalog();
  redirect(`/admin/solutions/${id}/edit?saved=1`);
}

export async function deleteSolutionAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = stringField(formData, "id");
  const result = await data.solutions.remove(id);
  refreshCatalog();
  if (!result.ok) redirect(`/admin/solutions?error=${encodeURIComponent(result.message)}`);
  redirect("/admin/solutions?deleted=1");
}

export async function createProjectAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = parseProjectForm(formData);
  if (!parsed.ok) return { status: "error", message: parsed.message, fieldErrors: parsed.fieldErrors };
  const result = await data.projects.create(parsed.data);
  if (!result.ok) return persistState(result);
  refreshCatalog();
  redirect(`/admin/projects/${result.data.id}/edit?created=1`);
}

export async function updateProjectAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const id = stringField(formData, "id");
  const parsed = parseProjectForm(formData);
  if (!parsed.ok) return { status: "error", message: parsed.message, fieldErrors: parsed.fieldErrors };
  const result = await data.projects.update(id, parsed.data);
  if (!result.ok) return persistState(result);
  refreshCatalog();
  redirect(`/admin/projects/${id}/edit?saved=1`);
}

export async function deleteProjectAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = stringField(formData, "id");
  const result = await data.projects.remove(id);
  refreshCatalog();
  if (!result.ok) redirect(`/admin/projects?error=${encodeURIComponent(result.message)}`);
  redirect("/admin/projects?deleted=1");
}

export async function saveSettingsAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = siteSettingsSchema.safeParse({
    contactEmail: stringField(formData, "contactEmail"), contactPhone: stringField(formData, "contactPhone"),
    whatsapp: stringField(formData, "whatsapp"), address: stringField(formData, "address"),
    linkedin: stringField(formData, "linkedin"), facebook: stringField(formData, "facebook"),
    instagram: stringField(formData, "instagram"), youtube: stringField(formData, "youtube"), x: stringField(formData, "x"),
    seoTitle: stringField(formData, "seoTitle"), seoDescription: stringField(formData, "seoDescription"),
    notifyEmail: stringField(formData, "notifyEmail"), notifyEnabled: boolField(formData, "notifyEnabled"),
  });
  if (!parsed.success) return { status: "error", message: "Please correct the highlighted fields." };
  const result = await data.settings.save(parsed.data);
  if (!result.ok) return persistState(result);
  revalidatePath("/"); revalidatePath("/contact"); revalidatePath("/admin/settings");
  return { status: "success", message: "Settings saved." };
}

export async function updateInquiryAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = stringField(formData, "id");
  const status = inquiryStatusSchema.safeParse(stringField(formData, "status"));
  const priority = inquiryPrioritySchema.safeParse(stringField(formData, "priority"));
  const returnTo = stringField(formData, "returnTo");
  const destination = returnTo.startsWith("/admin/requests/") ? returnTo : "/admin/requests/quotes";
  if (!status.success || !priority.success) redirect(`${destination}?error=Invalid%20inquiry%20status%20or%20priority`);
  const result = await data.inquiries.update(id, { status: status.data, priority: priority.data });
  redirect(result.ok ? `${destination}?saved=1` : `${destination}?error=${encodeURIComponent(result.message)}`);
}

export async function createResourceAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin(); const parsed = parseResourceForm(formData);
  if (!parsed.ok) return { status: "error", message: parsed.message, fieldErrors: parsed.fieldErrors };
  const result = await data.resources.create(parsed.data); if (!result.ok) return persistState(result);
  refreshCatalog(); redirect(`/admin/resources?created=1`);
}
export async function updateResourceAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin(); const parsed = parseResourceForm(formData); const id = stringField(formData, "id");
  if (!parsed.ok) return { status: "error", message: parsed.message, fieldErrors: parsed.fieldErrors };
  const result = await data.resources.update(id, parsed.data); if (!result.ok) return persistState(result);
  refreshCatalog(); redirect(`/admin/resources?updated=1`);
}
export async function deleteResourceAction(formData: FormData): Promise<void> {
  await requireAdmin(); const result = await data.resources.remove(stringField(formData, "id")); refreshCatalog();
  redirect(result.ok ? "/admin/resources?deleted=1" : `/admin/resources?error=${encodeURIComponent(result.message)}`);
}

export async function createTeamAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin(); const parsed = parseTeamForm(formData);
  if (!parsed.ok) return { status: "error", message: parsed.message, fieldErrors: parsed.fieldErrors };
  const result = await data.team.create(parsed.data); if (!result.ok) return persistState(result);
  refreshCatalog(); redirect(`/admin/team?created=1`);
}
export async function updateTeamAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin(); const parsed = parseTeamForm(formData); const id = stringField(formData, "id");
  if (!parsed.ok) return { status: "error", message: parsed.message, fieldErrors: parsed.fieldErrors };
  const result = await data.team.update(id, parsed.data); if (!result.ok) return persistState(result);
  refreshCatalog(); redirect(`/admin/team?updated=1`);
}
export async function deleteTeamAction(formData: FormData): Promise<void> {
  await requireAdmin(); const result = await data.team.remove(stringField(formData, "id")); refreshCatalog();
  redirect(result.ok ? "/admin/team?deleted=1" : `/admin/team?error=${encodeURIComponent(result.message)}`);
}

export async function createTestimonialAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin(); const parsed = parseTestimonialForm(formData);
  if (!parsed.ok) return { status: "error", message: parsed.message, fieldErrors: parsed.fieldErrors };
  const result = await data.testimonials.create(parsed.data); if (!result.ok) return persistState(result);
  refreshCatalog(); redirect(`/admin/testimonials?created=1`);
}
export async function updateTestimonialAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin(); const parsed = parseTestimonialForm(formData); const id = stringField(formData, "id");
  if (!parsed.ok) return { status: "error", message: parsed.message, fieldErrors: parsed.fieldErrors };
  const result = await data.testimonials.update(id, parsed.data); if (!result.ok) return persistState(result);
  refreshCatalog(); redirect(`/admin/testimonials?updated=1`);
}
export async function deleteTestimonialAction(formData: FormData): Promise<void> {
  await requireAdmin(); const result = await data.testimonials.remove(stringField(formData, "id")); refreshCatalog();
  redirect(result.ok ? "/admin/testimonials?deleted=1" : `/admin/testimonials?error=${encodeURIComponent(result.message)}`);
}
