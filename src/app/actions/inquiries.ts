"use server";

import { hasContactEmail, siteConfig } from "@/config/site";
import { data } from "@/lib/data";
import { stringField, type ActionState } from "@/lib/forms";
import { flattenFieldErrors } from "@/lib/validations/common";
import { inquirySchema } from "@/lib/validations/inquiry";
import { notifyInquiry } from "@/lib/email/notify";
import { checkRateLimit } from "@/lib/security/rate-limit";

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
  if (website) {
    return { status: "success", message: "Request received." };
  }

  const rateLimit = await checkRateLimit({
    scope: "public-inquiry",
    limit: 5,
    windowMs: 10 * 60 * 1000,
  });
  if (!rateLimit.allowed) {
    const minutes = Math.max(1, Math.ceil(rateLimit.retryAfterSeconds / 60));
    return {
      status: "error",
      message: `Too many requests. Please try again in about ${minutes} minute${minutes === 1 ? "" : "s"}.`,
    };
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
    let message =
      "Request stored. Email notifications are unavailable; the team can still see it in the admin inbox.";
    try {
      const settings = await data.settings.get();
      const notification = await notifyInquiry(result.data, settings);
      message = notification.sent
        ? "Request stored and the team has been notified."
        : notification.attempted
          ? "Request stored, but the notification email could not be sent. The team can still see it in the admin inbox."
          : "Request stored. Email notifications are disabled or not configured; the team can still see it in the admin inbox.";
    } catch {
      // The inquiry is already durable. A notification problem must not turn the
      // successful submission into an error or encourage a duplicate request.
    }
    return {
      status: "success",
      message,
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
