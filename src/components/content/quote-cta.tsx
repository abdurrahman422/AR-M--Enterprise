import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

export function QuoteCta({
  productTitle,
  compact = false,
}: {
  productTitle?: string;
  compact?: boolean;
}) {
  const quoteHref = productTitle
    ? `${siteConfig.ctas.quote.href}?product=${encodeURIComponent(productTitle)}`
    : siteConfig.ctas.quote.href;

  return (
    <div className="flex flex-wrap gap-3">
      <Button href={quoteHref} size={compact ? "sm" : "md"}>
        {siteConfig.ctas.quote.label}
      </Button>
      <Button href={siteConfig.ctas.engineer.href} variant="outline" size={compact ? "sm" : "md"}>
        {siteConfig.ctas.engineer.label}
      </Button>
      {!compact ? (
        <Button href={siteConfig.ctas.sales.href} variant="ghost" size="md">
          {siteConfig.ctas.sales.label}
        </Button>
      ) : null}
    </div>
  );
}
