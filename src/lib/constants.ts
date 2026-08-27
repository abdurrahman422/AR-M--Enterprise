import type { ProductAvailability, ResourceType } from "@/types/content";
import type { InquiryKind, InquiryStatus } from "@/types/inquiries";

export const productAvailabilityLabels: Record<ProductAvailability, string> = {
  available: "Available",
  made_to_order: "Made to order",
  limited: "Limited availability",
  discontinued: "Discontinued",
  contact: "Contact for availability",
};

export const resourceTypeLabels: Record<ResourceType, string> = {
  article: "Article",
  brochure: "Brochure",
  datasheet: "Datasheet",
  whitepaper: "White paper",
  video: "Video",
  other: "Resource",
};

export const inquiryKindLabels: Record<InquiryKind, string> = {
  quote: "Quote request",
  consultation: "Consultation request",
  service: "Service request",
  identify: "Part identification",
};

export const inquiryStatusLabels: Record<InquiryStatus, string> = {
  new: "New",
  in_progress: "In Progress",
  contacted: "Contacted",
  completed: "Completed",
  archived: "Archived",
};

export const inquiryPriorityLabels: Record<import("@/types/inquiries").InquiryPriority, string> = {
  low: "Low",
  normal: "Normal",
  high: "High",
  urgent: "Urgent",
};

export const SESSION_COOKIE = "arm_admin_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;
