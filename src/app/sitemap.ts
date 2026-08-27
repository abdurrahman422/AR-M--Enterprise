import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/config/site";
import { data } from "@/lib/data";

const staticRoutes = [
  "/",
  "/products",
  "/categories",
  "/services",
  "/solutions",
  "/projects",
  "/resources",
  "/about",
  "/team",
  "/contact",
  "/request-quote",
  "/consultation",
  "/service-request",
  "/identify-part",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories, services, solutions, projects, resources] = await Promise.all([
    data.products.list(),
    data.categories.list(),
    data.services.list(),
    data.solutions.list(),
    data.projects.list(),
    data.resources.list(),
  ]);

  const dynamicRoutes = [
    ...products.map((item) => `/products/${item.slug}`),
    ...categories.map((item) => `/categories/${item.slug}`),
    ...services.map((item) => `/services/${item.slug}`),
    ...solutions.map((item) => `/solutions/${item.slug}`),
    ...projects.map((item) => `/projects/${item.slug}`),
    ...resources.map((item) => `/resources/${item.slug}`),
  ];

  return [...staticRoutes, ...dynamicRoutes].map((path) => ({
    url: absoluteUrl(path),
    lastModified: new Date(),
  }));
}
