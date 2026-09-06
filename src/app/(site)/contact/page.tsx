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
        title="Bring us the plant challenge."
        description="Talk to sales, engineering, or service support. We will route the request to the right technical conversation."
      />
      <Container className="space-y-12 py-16 sm:py-24">
        <div className="grid gap-4 md:grid-cols-3">
          <a href="/request-quote" className="group border border-border bg-surface p-7 hover:border-accent/50"><p className="text-xs uppercase tracking-[0.2em] text-accent">Sales</p><h2 className="mt-5 font-heading text-2xl">Request a quote</h2><p className="mt-3 text-sm leading-6 text-muted">Equipment, systems, parts, and commercial scopes.</p></a>
          <a href="/consultation" className="group border border-border bg-surface p-7 hover:border-accent/50"><p className="text-xs uppercase tracking-[0.2em] text-accent">Engineering</p><h2 className="mt-5 font-heading text-2xl">Discuss a project</h2><p className="mt-3 text-sm leading-6 text-muted">Process, capacity, layout, automation, and upgrade planning.</p></a>
          <a href="/service-request" className="group border border-border bg-surface p-7 hover:border-accent/50"><p className="text-xs uppercase tracking-[0.2em] text-accent">Support</p><h2 className="mt-5 font-heading text-2xl">Request service</h2><p className="mt-3 text-sm leading-6 text-muted">Maintenance, troubleshooting, commissioning, and breakdown help.</p></a>
        </div>
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
