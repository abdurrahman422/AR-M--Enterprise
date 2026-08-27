import { absoluteUrl, hasAddress, hasContactEmail, hasContactPhone, siteConfig } from "@/config/site";

export function OrganizationJsonLd() {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    description: `${siteConfig.descriptor}. ${siteConfig.tagline}`,
    url: absoluteUrl("/"),
  };

  if (hasContactEmail || hasContactPhone) {
    data.contactPoint = {
      "@type": "ContactPoint",
      contactType: "sales",
      ...(hasContactEmail ? { email: siteConfig.contact.email } : {}),
      ...(hasContactPhone ? { telephone: siteConfig.contact.phone } : {}),
    };
  }

  if (hasAddress) {
    data.address = siteConfig.contact.address;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
