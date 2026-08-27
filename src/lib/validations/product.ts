import { z } from "zod";
import {
  mediaAssetSchema,
  optionalString,
  productDocumentSchema,
  slugSchema,
  technicalSpecificationSchema,
} from "@/lib/validations/common";

export const productAvailabilitySchema = z.enum([
  "available",
  "made_to_order",
  "limited",
  "discontinued",
  "contact",
]);

export const productSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(1).max(160),
  slug: slugSchema,
  summary: z.string().trim().max(400).default(""),
  description: z.string().trim().default(""),
  categoryId: optionalString,
  categorySlug: optionalString,
  brand: optionalString,
  model: optionalString,
  sku: optionalString,
  images: z.array(mediaAssetSchema).default([]),
  specifications: z.array(technicalSpecificationSchema).default([]),
  documents: z.array(productDocumentSchema).default([]),
  availability: productAvailabilitySchema.default("contact"),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
  seoTitle: optionalString,
  seoDescription: optionalString,
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
});

export const productInputSchema = productSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const productWriteSchema = productSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  categorySlug: true,
});

export type ProductInput = z.infer<typeof productInputSchema>;
export type ProductWrite = z.infer<typeof productWriteSchema>;
