import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

export function ServiceCta({
  serviceTitle,
  compact = false,
}: {
  serviceTitle?: string;
  compact?: boolean;
}) {
  const consultationHref = serviceTitle
    ? `${siteConfig.ctas.engineer.href}&topic=${encodeURIComponent(serviceTitle)}`
    : siteConfig.ctas.engineer.href;
  const supportHref = serviceTitle
    ? `${siteConfig.ctas.support.href}&service=${encodeURIComponent(serviceTitle)}`
    : siteConfig.ctas.support.href;

  return (
    <div className="flex flex-wrap gap-3">
      <Button href={consultationHref} size={compact ? "sm" : "md"}>
        {siteConfig.ctas.engineer.label}
      </Button>
      <Button href={supportHref} variant="outline" size={compact ? "sm" : "md"}>
        {siteConfig.ctas.support.label}
      </Button>
    </div>
  );
}
