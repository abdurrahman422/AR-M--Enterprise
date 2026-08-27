import type { Metadata } from "next";
import { absoluteUrl, siteConfig } from "@/config/site";

type CreateMetadataInput = {
  title: string;
  description: string;
  path?: string;
  noIndex?: boolean;
};

export const defaultTitleTemplate = `%s | ${siteConfig.name}`;

export function createMetadata({
  title,
  description,
  path = "/",
  noIndex = false,
}: CreateMetadataInput): Metadata {
  const url = absoluteUrl(path);

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    robots: noIndex
      ? { index: false, follow: false, nocache: true }
      : { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: "en_US",
      url,
      siteName: siteConfig.name,
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export function titleFor(pageTitle: string): string {
  return `${pageTitle} | ${siteConfig.name}`;
}
