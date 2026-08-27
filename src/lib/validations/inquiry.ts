import { z } from "zod";
import { optionalString } from "@/lib/validations/common";

const contactFields = {
  name: z.string().trim().min(2, "Enter your name").max(120),
  company: z.string().trim().min(1, "Enter your company").max(160),
  email: z.email("Enter a valid work email"),
  phone: z.string().trim().min(7, "Enter a phone number").max(40),
  requirement: optionalString,
  message: z.string().trim().min(10, "Add a short description of the request").max(5000),
  fileUrl: optionalString,
  fileName: optionalString,
  website: z.string().optional(),
};

export const quoteRequestSchema = z.object({
  kind: z.literal("quote"),
  ...contactFields,
  productSlug: optionalString,
  productTitle: optionalString,
  quantity: optionalString,
});

export const consultationRequestSchema = z.object({
  kind: z.literal("consultation"),
  ...contactFields,
  topic: optionalString,
  preferredTiming: optionalString,
});

export const serviceRequestSchema = z.object({
  kind: z.literal("service"),
  ...contactFields,
  serviceType: optionalString,
  millLocation: optionalString,
});

export const identifyRequestSchema = z.object({
  kind: z.literal("identify"),
  ...contactFields,
  millLocation: optionalString,
  photoUrl: optionalString,
  photoName: optionalString,
});

export const inquirySchema = z.discriminatedUnion("kind", [
  quoteRequestSchema,
  consultationRequestSchema,
  serviceRequestSchema,
  identifyRequestSchema,
]);

export type QuoteRequestInput = z.infer<typeof quoteRequestSchema>;
export type ConsultationRequestInput = z.infer<typeof consultationRequestSchema>;
export type ServiceRequestInput = z.infer<typeof serviceRequestSchema>;
export type IdentifyRequestInput = z.infer<typeof identifyRequestSchema>;
export type InquiryInput = z.infer<typeof inquirySchema>;
