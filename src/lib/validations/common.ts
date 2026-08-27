import { z } from "zod";

export const slugSchema = z
  .string()
  .trim()
  .min(1, "Slug is required")
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens");

export const optionalString = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value ? value : undefined));

export const assetUrlSchema = z
  .string()
  .trim()
  .min(1, "URL is required")
  .refine(
    (value) => value.startsWith("/") || value.startsWith("https://") || value.startsWith("http://"),
    "Use a site path or an http(s) URL",
  );

export const mediaAssetSchema = z.object({
  id: z.string().min(1),
  url: assetUrlSchema,
  alt: z.string().trim().min(1, "Image alt text is required").max(200),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  sortOrder: z.number().int().nonnegative().default(0),
});

export const technicalSpecificationSchema = z.object({
  id: z.string().min(1),
  group: z.string().trim().min(1).max(80),
  label: z.string().trim().min(1).max(120),
  value: z.string().trim().min(1).max(240),
  unit: optionalString,
  sortOrder: z.number().int().nonnegative().default(0),
});

export const productDocumentSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(1).max(160),
  url: assetUrlSchema,
  fileType: z.string().trim().min(1).max(20),
  sizeBytes: z.number().int().nonnegative().optional(),
});

export function flattenFieldErrors(error: z.ZodError): Record<string, string[] | undefined> {
  return error.flatten().fieldErrors as Record<string, string[] | undefined>;
}
