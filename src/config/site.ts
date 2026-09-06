import { isFilled, publicEnv } from "@/config/env";

export const siteConfig = {
  name: "AR&M Enterprise",
  shortName: "AR&M",
  descriptor: "Feed Mill Engineering & Industrial Solutions",
  tagline: "Commitment is our asset",
  url: publicEnv.siteUrl || "http://localhost:3000",
  locale: "en",
  contact: {
    email: publicEnv.contactEmail,
    phone: publicEnv.contactPhone,
    whatsapp: publicEnv.whatsapp,
    address: publicEnv.address,
  },
  social: {
    linkedin: publicEnv.linkedin,
    facebook: publicEnv.facebook,
    instagram: publicEnv.instagram,
    youtube: publicEnv.youtube,
    x: publicEnv.x,
  },
  ctas: {
    quote: {
      label: "Request a Quote",
      href: "/request-quote",
    },
    engineer: {
      label: "Talk to an Engineer",
      href: "/consultation?intent=engineer",
    },
    consultation: {
      label: "Request Consultation",
      href: "/consultation",
    },
    sales: {
      label: "Contact Sales",
      href: "/contact",
    },
    service: {
      label: "Request Service",
      href: "/service-request",
    },
    support: {
      label: "Get Technical Support",
      href: "/service-request?intent=support",
    },
    identify: {
      label: "Can't identify the part?",
      href: "/identify-part",
    },
  },
} as const;

export type SiteConfig = typeof siteConfig;

export function getSiteUrl(): string {
  return siteConfig.url.replace(/\/$/, "");
}

export function absoluteUrl(path = "/"): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteUrl()}${normalized}`;
}

export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function whatsappHref(whatsapp: string): string {
  if (whatsapp.startsWith("http")) {
    return whatsapp;
  }

  const digits = whatsapp.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : "";
}

export function mailtoHref(email: string, subject?: string, body?: string): string {
  const params = new URLSearchParams();
  if (subject) params.set("subject", subject);
  if (body) params.set("body", body);
  const query = params.toString();
  return query ? `mailto:${email}?${query}` : `mailto:${email}`;
}

export const hasContactEmail = isFilled(siteConfig.contact.email);
export const hasContactPhone = isFilled(siteConfig.contact.phone);
export const hasWhatsapp = isFilled(siteConfig.contact.whatsapp);
export const hasAddress = isFilled(siteConfig.contact.address);

export const socialLinks = (
  [
    { label: "LinkedIn", href: siteConfig.social.linkedin },
    { label: "Facebook", href: siteConfig.social.facebook },
    { label: "Instagram", href: siteConfig.social.instagram },
    { label: "YouTube", href: siteConfig.social.youtube },
    { label: "X", href: siteConfig.social.x },
  ] as const
).filter((item) => isFilled(item.href));
