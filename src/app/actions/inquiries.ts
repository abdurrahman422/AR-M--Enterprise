"use server";

import { hasContactEmail, siteConfig } from "@/config/site";
import { data } from "@/lib/data";
import { savePublicUpload } from "@/lib/data/uploads";
import { stringField, type ActionState } from "@/lib/forms";
import { flattenFieldErrors } from "@/lib/validations/common";
import { inquirySchema } from "@/lib/validations/inquiry";

export type InquiryActionState = ActionState;

export async function submitInquiry(
  _prev: InquiryActionState,
  formData: FormData,
): Promise<InquiryActionState> {
  const parsed = inquirySchema.safeParse({
    kind: stringField(formData, "kind"),
    name: stringField(formData, "name"),
    company: stringField(formData, "company"),
    email: stringField(formData, "email"),
    phone: stringField(formData, "phone"),
    message: stringField(formData, "message"),
    website: stringField(formData, "website"),
    productSlug: stringField(formData, "productSlug"),
    productTitle: stringField(formData, "productTitle"),
    quantity: stringField(formData, "quantity"),
    topic: stringField(formData, "topic"),
    preferredTiming: stringField(formData, "preferredTiming"),
    serviceType: stringField(formData, "serviceType"),
    millLocation: stringField(formData, "millLocation"),
    requirement: stringField(formData, "requirement"),
    photoUrl: stringField(formData, "photoUrl"),
    photoName: stringField(formData, "photoName"),
    fileUrl: stringField(formData, "fileUrl"),
    fileName: stringField(formData, "fileName"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please correct the highlighted fields.",
      fieldErrors: flattenFieldErrors(parsed.error),
    };
  }

  const { website, ...payload } = parsed.data;
  const photo = formData.get("photo");
  if (photo instanceof File && photo.size > 0) {
    const uploaded = await savePublicUpload(photo, payload.kind === "identify" ? "identify" : "documents");
    if (uploaded.ok) {
      if (payload.kind === "identify") {
        payload.photoUrl = uploaded.url;
        payload.photoName = uploaded.fileName;
      }
      payload.fileUrl = uploaded.url;
      payload.fileName = uploaded.fileName;
    }
  }

  if (website) {
    return { status: "success", message: "Request received." };
  }
  const result =
    payload.kind === "quote"
      ? await data.inquiries.createQuote(payload)
      : payload.kind === "consultation"
        ? await data.inquiries.createConsultation(payload)
        : payload.kind === "service"
          ? await data.inquiries.createService(payload)
          : await data.inquiries.createIdentify(payload);

  if (result.ok) {
    return {
      status: "success",
      message: "Request stored. The team will follow up on this channel.",
    };
  }

  if (result.code === "NOT_CONFIGURED") {
    const fallback = hasContactEmail
      ? `This request was not stored. Email ${siteConfig.contact.email} with the same details, including any attachment.`
      : "This request was not stored. A contact email has not been published yet, so the submission cannot be delivered from this form.";

    return {
      status: "unconfigured",
      message: fallback,
    };
  }

  return {
    status: "error",
    message: result.message,
  };
}


