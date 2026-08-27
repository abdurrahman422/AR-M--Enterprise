export type InquiryKind = "quote" | "consultation" | "service" | "identify";

export type InquiryStatus = "new" | "in_progress" | "contacted" | "completed" | "archived";

export type InquiryPriority = "low" | "normal" | "high" | "urgent";

export type InquiryNote = {
  id: string;
  body: string;
  createdAt: string;
  author?: string;
};

export type InquiryAttachment = {
  id: string;
  url: string;
  fileName: string;
  createdAt: string;
};

export type Inquiry = {
  id: string;
  kind: InquiryKind;
  name: string;
  company: string;
  email: string;
  phone: string;
  requirement?: string;
  message: string;
  fileUrl?: string;
  fileName?: string;
  productSlug?: string;
  productTitle?: string;
  quantity?: string;
  topic?: string;
  preferredTiming?: string;
  serviceType?: string;
  millLocation?: string;
  photoUrl?: string;
  photoName?: string;
  status: InquiryStatus;
  priority: InquiryPriority;
  notes: InquiryNote[];
  attachments: InquiryAttachment[];
  createdAt: string;
  updatedAt: string;
};

export type InquiryCreateInput = Omit<
  Inquiry,
  "id" | "status" | "priority" | "notes" | "attachments" | "createdAt" | "updatedAt"
>;

export type QuoteRequest = Inquiry;
export type ConsultationRequest = Inquiry;
export type ServiceRequest = Inquiry;
export type IdentifyRequest = Inquiry;
