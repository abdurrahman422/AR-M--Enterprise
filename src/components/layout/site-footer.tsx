import Link from "next/link";
import { SiteMark } from "@/components/layout/site-mark";
import { Container } from "@/components/ui/container";
import { Separator } from "@/components/ui/separator";
import { footerNavigation } from "@/config/navigation";
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

export function SiteFooter() {
  return (
    <footer className="border-t border-foreground/20 bg-foreground text-white">
      <Container className="py-16 sm:py-20">
        <div className="mb-16 flex flex-col gap-6 border-b border-white/20 pb-12 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#d8ff55]">Start a conversation</p><h2 className="mt-4 max-w-2xl font-heading text-3xl font-semibold tracking-[-.04em] sm:text-5xl">Bring the plant problem. We will bring the right disciplines.</h2></div>
          <Link href="/request-quote" className="text-sm font-semibold text-white hover:text-[#d8ff55]">Request a technical quote →</Link>
        </div>
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <SiteMark />
            <p className="mt-5 max-w-sm text-sm leading-6 text-muted">{siteConfig.descriptor}</p>
            <p className="mt-3 max-w-sm text-sm leading-6 text-white">{siteConfig.tagline}</p>
          </div>
          <div className="grid gap-10 sm:grid-cols-3">
            {footerNavigation.map((group) => (
              <div key={group.title}>
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted">{group.title}</p>
                <ul className="mt-4 space-y-2.5">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className="text-sm text-white/80 hover:text-[#d8ff55]">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <Separator className="my-10" />
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2 text-sm text-muted">
            {hasContactEmail ? (
              <p>
                  <a className="hover:text-white" href={mailtoHref(siteConfig.contact.email)}>
                  {siteConfig.contact.email}
                </a>
              </p>
            ) : null}
            {hasContactPhone ? (
              <p>
                  <a className="hover:text-white" href={telHref(siteConfig.contact.phone)}>
                  {siteConfig.contact.phone}
                </a>
              </p>
            ) : null}
            {hasWhatsapp ? (
              <p>
                  <a className="hover:text-white" href={whatsappHref(siteConfig.contact.whatsapp)}>
                  WhatsApp
                </a>
              </p>
            ) : null}
            {hasAddress ? <p>{siteConfig.contact.address}</p> : null}
          </div>
          {socialLinks.length > 0 ? (
            <ul className="flex flex-wrap gap-4 text-sm">
              {socialLinks.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-muted hover:text-white" rel="noreferrer" target="_blank">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <p className="mt-8 text-xs text-muted">
          © {new Date().getFullYear()} {siteConfig.name}
        </p>
      </Container>
    </footer>
  );
}
