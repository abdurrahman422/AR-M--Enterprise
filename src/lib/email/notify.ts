import "server-only";

import { isFilled, serverEnv } from "@/config/env";
import { inquiryKindLabels } from "@/lib/constants";
import { siteConfig } from "@/config/site";
import type { Inquiry } from "@/types/inquiries";
import type { SiteSettings } from "@/types/settings";

export type NotifyResult = {
  attempted: boolean;
  sent: boolean;
  message: string;
};

export function isEmailConfigured(settings?: SiteSettings): boolean {
  const to = settings?.notifyEmail || serverEnv.inquiryNotifyEmail;
  return isFilled(serverEnv.resendApiKey) && isFilled(to);
}

export async function notifyInquiry(inquiry: Inquiry, settings?: SiteSettings): Promise<NotifyResult> {
  const enabled = settings?.notifyEnabled ?? true;
  const to = settings?.notifyEmail || serverEnv.inquiryNotifyEmail;
  const from = serverEnv.emailFrom || "AR&M Enterprise <noreply@localhost>";

  if (!enabled) {
    return { attempted: false, sent: false, message: "Email notifications are disabled." };
  }
  if (!isFilled(serverEnv.resendApiKey) || !isFilled(to)) {
    return { attempted: false, sent: false, message: "Email notifications are not configured." };
  }

  const subject = `${inquiryKindLabels[inquiry.kind]} from ${inquiry.company}`;
  const text = [
    `Kind: ${inquiryKindLabels[inquiry.kind]}`,
    `Name: ${inquiry.name}`,
    `Company: ${inquiry.company}`,
    `Email: ${inquiry.email}`,
    `Phone: ${inquiry.phone}`,
    inquiry.requirement ? `Requirement: ${inquiry.requirement}` : "",
    `Message: ${inquiry.message}`,
    inquiry.productTitle ? `Product: ${inquiry.productTitle}` : "",
    inquiry.serviceType ? `Service: ${inquiry.serviceType}` : "",
    inquiry.topic ? `Topic: ${inquiry.topic}` : "",
    inquiry.fileUrl ? `Attachment: ${inquiry.fileUrl}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${serverEnv.resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `[${siteConfig.shortName}] ${subject}`,
        text,
      }),
    });

    if (!response.ok) {
      return { attempted: true, sent: false, message: "Notification email failed to send." };
    }

    return { attempted: true, sent: true, message: "Notification email sent." };
  } catch {
    return { attempted: true, sent: false, message: "Notification email failed to send." };
  }
}
