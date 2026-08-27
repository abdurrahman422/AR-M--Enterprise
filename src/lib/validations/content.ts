import { z } from "zod";
import { mediaAssetSchema, optionalString, slugSchema } from "@/lib/validations/common";
import { productSchema } from "@/lib/validations/product";

const publishable = {
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  seoTitle: optionalString,
  seoDescription: optionalString,
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
};

export const categorySchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(1).max(160),
  slug: slugSchema,
  summary: z.string().trim().default(""),
  description: z.string().trim().default(""),
  parentId: optionalString,
  sortOrder: z.number().int().nonnegative().default(0),
  ...publishable,
});

export const categoryWriteSchema = categorySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const serviceSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(1).max(160),
  slug: slugSchema,
  summary: z.string().trim().default(""),
  description: z.string().trim().default(""),
  sortOrder: z.number().int().nonnegative().default(0),
  ...publishable,
});

export const serviceWriteSchema = serviceSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const solutionSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(1).max(160),
  slug: slugSchema,
  summary: z.string().trim().default(""),
  description: z.string().trim().default(""),
  problem: z.string().trim().default(""),
  approach: z.string().trim().default(""),
  deliverables: z.array(z.string().trim().min(1)).default([]),
  sortOrder: z.number().int().nonnegative().default(0),
  ...publishable,
});

export const solutionWriteSchema = solutionSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const projectSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(1).max(160),
  slug: slugSchema,
  summary: z.string().trim().default(""),
  description: z.string().trim().default(""),
  category: optionalString,
  clientName: optionalString,
  location: optionalString,
  completedOn: optionalString,
  scope: optionalString,
  serviceIds: z.array(z.string().min(1)).default([]),
  results: optionalString,
  images: z.array(mediaAssetSchema).default([]),
  sortOrder: z.number().int().nonnegative().default(0),
  ...publishable,
});

export const projectWriteSchema = projectSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const resourceTypeSchema = z.enum([
  "article",
  "brochure",
  "datasheet",
  "whitepaper",
  "video",
  "other",
]);

export const resourceSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(1).max(160),
  slug: slugSchema,
  summary: z.string().trim().default(""),
  description: z.string().trim().default(""),
  type: resourceTypeSchema.default("other"),
  url: optionalString,
  sortOrder: z.number().int().nonnegative().default(0),
  ...publishable,
});

export const resourceWriteSchema = resourceSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const testimonialSchema = z.object({
  id: z.string().min(1),
  quote: z.string().trim().min(1).max(1000),
  attribution: z.string().trim().min(1).max(120),
  role: optionalString,
  organization: optionalString,
  sortOrder: z.number().int().nonnegative().default(0),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
});

export const testimonialWriteSchema = testimonialSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const teamMemberSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1).max(120),
  slug: slugSchema,
  role: z.string().trim().min(1).max(160),
  bio: z.string().trim().default(""),
  image: mediaAssetSchema.optional(),
  published: z.boolean().default(false),
  sortOrder: z.number().int().nonnegative().default(0),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
});

export const teamWriteSchema = teamMemberSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const siteSettingsSchema = z.object({
  contactEmail: z.string().trim().default(""),
  contactPhone: z.string().trim().default(""),
  whatsapp: z.string().trim().default(""),
  address: z.string().trim().default(""),
  linkedin: z.string().trim().default(""),
  facebook: z.string().trim().default(""),
  instagram: z.string().trim().default(""),
  youtube: z.string().trim().default(""),
  x: z.string().trim().default(""),
  seoTitle: z.string().trim().default(""),
  seoDescription: z.string().trim().default(""),
  notifyEmail: z.string().trim().default(""),
  notifyEnabled: z.boolean().default(false),
});

export const inquiryStatusSchema = z.enum(["new", "in_progress", "contacted", "completed", "archived"]);
export const inquiryPrioritySchema = z.enum(["low", "normal", "high", "urgent"]);

export const inquiryNoteSchema = z.object({
  id: z.string().min(1),
  body: z.string().trim().min(1),
  createdAt: z.string().min(1),
  author: z.string().optional(),
});

export const inquiryAttachmentSchema = z.object({
  id: z.string().min(1),
  url: z.string().min(1),
  fileName: z.string().min(1),
  createdAt: z.string().min(1),
});

export const inquiryRecordSchema = z.object({
  id: z.string().min(1),
  kind: z.enum(["quote", "consultation", "service", "identify"]),
  name: z.string().min(1),
  company: z.string().min(1),
  email: z.string().min(1),
  phone: z.string().min(1),
  requirement: optionalString,
  message: z.string().min(1),
  fileUrl: optionalString,
  fileName: optionalString,
  productSlug: optionalString,
  productTitle: optionalString,
  quantity: optionalString,
  topic: optionalString,
  preferredTiming: optionalString,
  serviceType: optionalString,
  millLocation: optionalString,
  photoUrl: optionalString,
  photoName: optionalString,
  status: inquiryStatusSchema.default("new"),
  priority: inquiryPrioritySchema.default("normal"),
  notes: z.array(inquiryNoteSchema).default([]),
  attachments: z.array(inquiryAttachmentSchema).default([]),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
});

export const catalogSchema = z.object({
  categories: z.array(categorySchema),
  products: z.array(productSchema),
  services: z.array(serviceSchema),
  solutions: z.array(solutionSchema),
  projects: z.array(projectSchema),
  resources: z.array(resourceSchema),
  testimonials: z.array(testimonialSchema),
  team: z.array(teamMemberSchema),
  inquiries: z.array(inquiryRecordSchema).default([]),
  settings: siteSettingsSchema.default({
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
  }),
});
