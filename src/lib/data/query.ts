import type { Category, Product } from "@/types/content";
import type { ListOptions } from "@/types/data-provider";
import { applyListOptions } from "@/lib/data/helpers";

export type CategoryNode = Category & { children: CategoryNode[] };

export function buildCategoryTree(categories: Category[]): CategoryNode[] {
  const sorted = [...categories].sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title));
  const nodes = new Map<string, CategoryNode>(
    sorted.map((category) => [category.id, { ...category, children: [] }]),
  );

  const roots: CategoryNode[] = [];
  for (const node of nodes.values()) {
    const parent = node.parentId ? nodes.get(node.parentId) : undefined;
    if (parent) {
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}

export function collectDescendantIds(categories: Category[], rootId: string): string[] {
  const ids = [rootId];
  for (const child of categories.filter((category) => category.parentId === rootId)) {
    ids.push(...collectDescendantIds(categories, child.id));
  }
  return ids;
}

export function matchesProductQuery(product: Product, query: string): boolean {
  const haystack = [
    product.title,
    product.summary,
    product.description,
    product.brand,
    product.model,
    product.sku,
    product.categorySlug,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(query.trim().toLowerCase());
}

export function filterProducts(
  products: Product[],
  categories: Category[],
  options?: ListOptions,
): Product[] {
  let result = applyListOptions(products, options);

  if (options?.query?.trim()) {
    result = result.filter((product) => matchesProductQuery(product, options.query ?? ""));
  }

  if (options?.availability) {
    result = result.filter((product) => product.availability === options.availability);
  }

  if (options?.categoryId || options?.categorySlug) {
    const root = options.categoryId
      ? categories.find((category) => category.id === options.categoryId)
      : categories.find((category) => category.slug === options.categorySlug);

    if (!root) return [];

    const ids =
      options.includeDescendants === false ? [root.id] : collectDescendantIds(categories, root.id);
    const slugs = categories.filter((category) => ids.includes(category.id)).map((category) => category.slug);

    result = result.filter(
      (product) =>
        (product.categoryId && ids.includes(product.categoryId)) ||
        (product.categorySlug && slugs.includes(product.categorySlug)),
    );
  }

  return result;
}

export function relatedProducts(product: Product, catalog: Product[], limit = 4): Product[] {
  return catalog
    .filter((item) => item.id !== product.id && item.published)
    .filter((item) => {
      if (product.categoryId && item.categoryId === product.categoryId) return true;
      if (product.categorySlug && item.categorySlug === product.categorySlug) return true;
      return false;
    })
    .slice(0, limit);
}

export function categoryById(categories: Category[], id?: string): Category | undefined {
  if (!id) return undefined;
  return categories.find((category) => category.id === id);
}

export function resolveCategorySlug(categories: Category[], categoryId?: string): string | undefined {
  return categoryById(categories, categoryId)?.slug;
}

type Searchable = {
  title: string;
  summary: string;
  description: string;
  published: boolean;
  featured?: boolean;
  sortOrder?: number;
};

export function filterPages<T extends Searchable>(items: T[], options?: ListOptions): T[] {
  let result = applyListOptions(items, options);
  if (options?.query?.trim()) {
    const query = options.query.trim().toLowerCase();
    result = result.filter((item) =>
      [item.title, item.summary, item.description].join(" ").toLowerCase().includes(query),
    );
  }
  return [...result].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.title.localeCompare(b.title));
}

export function relatedPages<T extends { id: string; published: boolean }>(current: T, items: T[], limit = 3): T[] {
  return items.filter((item) => item.id !== current.id && item.published).slice(0, limit);
}
