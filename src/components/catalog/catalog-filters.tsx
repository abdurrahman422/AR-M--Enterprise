import { buildCategoryTree } from "@/lib/data/query";
import { productAvailabilityLabels } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import type { Category, ProductAvailability } from "@/types/content";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type CatalogFilterValues = {
  q?: string;
  category?: string;
  availability?: ProductAvailability;
  featured?: boolean;
};

export function CatalogFilters({
  categories,
  values,
  action = "/products",
}: {
  categories: Category[];
  values: CatalogFilterValues;
  action?: string;
}) {
  const tree = buildCategoryTree(categories);
  const availabilityOptions = Object.entries(productAvailabilityLabels) as [ProductAvailability, string][];

  return (
    <div className="space-y-8 border-t-4 border-accent bg-[#e7e8df] p-5">
      <form method="get" action={action} className="space-y-5">
        <div>
          <Label htmlFor="catalog-q">Search</Label>
          <Input
            id="catalog-q"
            name="q"
            defaultValue={values.q ?? ""}
            placeholder="Title, SKU, brand, model"
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="catalog-availability">Availability</Label>
          <Select id="catalog-availability" name="availability" defaultValue={values.availability ?? ""} className="mt-2">
            <option value="">Any</option>
            {availabilityOptions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </div>
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            name="featured"
            value="1"
            defaultChecked={values.featured}
            className="h-4 w-4 accent-accent"
          />
          Featured only
        </label>
        {values.category ? <input type="hidden" name="category" value={values.category} /> : null}
        <Button type="submit" variant="outline" size="sm">
          Apply filters
        </Button>
      </form>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">Shop the process</p>
        <ul className="mt-3 space-y-1">
          <li>
            <Link
              href={action}
              className={cn("block py-1 text-sm", !values.category ? "text-foreground" : "text-muted hover:text-foreground")}
            >
              All products
            </Link>
          </li>
          {tree.map((category) => (
            <CategoryLinks key={category.id} node={category} active={values.category} query={values.q} depth={0} action={action} />
          ))}
        </ul>
      </div>
    </div>
  );
}

function CategoryLinks({
  node,
  active,
  query,
  depth,
  action,
}: {
  node: ReturnType<typeof buildCategoryTree>[number];
  active?: string;
  query?: string;
  depth: number;
  action: string;
}) {
  const params = new URLSearchParams();
  params.set("category", node.slug);
  if (query) params.set("q", query);
  const href = `${action}?${params.toString()}`;

  return (
    <li>
      <Link
        href={href}
        className={cn(
          "block py-1 text-sm",
          active === node.slug ? "font-semibold text-accent" : "text-muted hover:text-foreground",
        )}
        style={{ paddingLeft: depth * 12 }}
      >
        {node.title}
      </Link>
      {node.children.length > 0 ? (
        <ul className="space-y-1">
          {node.children.map((child) => (
            <CategoryLinks
              key={child.id}
              node={child}
              active={active}
              query={query}
              depth={depth + 1}
              action={action}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}
