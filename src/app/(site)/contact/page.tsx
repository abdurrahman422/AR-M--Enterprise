import { QuoteCta } from "@/components/content/quote-cta";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import {
  hasAddress,
  hasContactEmail,
  hasContactPhone,
  hasWhatsapp,
  mailtoHref,
  siteConfig,
  socialLinks,
  telHref,
  whatsappHref,
} from "@/config/site";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Contact",
  description: "Contact AR&M Enterprise for sales, engineering, and service requests.",
  path: "/contact",
});

export default function ContactPage() {
  const hasAnyContact = hasContactEmail || hasContactPhone || hasWhatsapp || hasAddress;

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Contact sales and engineering"
        description="Use a quote, consultation, or service request. Direct contact details appear only when they have been provided."
      />
      <Container className="space-y-10 py-14 sm:py-16">
        {hasAnyContact ? (
          <div className="max-w-xl space-y-3 text-sm leading-7 text-muted">
            {hasContactEmail ? (
              <p>
                Email:{" "}
                <a className="text-foreground hover:text-accent" href={mailtoHref(siteConfig.contact.email)}>
                  {siteConfig.contact.email}
                </a>
              </p>
            ) : null}
            {hasContactPhone ? (
              <p>
                Phone:{" "}
                <a className="text-foreground hover:text-accent" href={telHref(siteConfig.contact.phone)}>
                  {siteConfig.contact.phone}
                </a>
              </p>
            ) : null}
            {hasWhatsapp ? (
              <p>
                WhatsApp:{" "}
                <a className="text-foreground hover:text-accent" href={whatsappHref(siteConfig.contact.whatsapp)}>
                  Message on WhatsApp
                </a>
              </p>
            ) : null}
            {hasAddress ? <p>Address: {siteConfig.contact.address}</p> : null}
          </div>
        ) : (
          <p className="max-w-xl text-sm leading-7 text-muted">
            Direct email, phone, WhatsApp, and address have not been supplied yet. Use the request forms in the meantime.
          </p>
        )}
        {socialLinks.length > 0 ? (
          <ul className="flex flex-wrap gap-4 text-sm">
            {socialLinks.map((item) => (
              <li key={item.label}>
                <a href={item.href} className="text-muted hover:text-foreground" rel="noreferrer" target="_blank">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        ) : null}
        <QuoteCta />
      </Container>
    </>
  );
}
