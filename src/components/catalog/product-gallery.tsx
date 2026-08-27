"use client";

import { useState } from "react";
import { CatalogMedia } from "@/components/catalog/catalog-media";
import { cn } from "@/lib/utils";
import type { MediaAsset } from "@/types/content";

export function ProductGallery({ images, title }: { images: MediaAsset[]; title: string }) {
  const ordered = [...images].sort((a, b) => a.sortOrder - b.sortOrder);
  const [active, setActive] = useState(0);
  const current = ordered[active];

  return (
    <div>
      <div className="aspect-[4/3] overflow-hidden border border-border bg-surface-elevated">
        <CatalogMedia src={current?.url} alt={current?.alt || title} />
      </div>
      {ordered.length > 1 ? (
        <ul className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5">
          {ordered.map((image, index) => (
            <li key={image.id}>
              <button
                type="button"
                aria-label={`Show image ${index + 1}`}
                aria-pressed={index === active}
                onClick={() => setActive(index)}
                className={cn(
                  "aspect-square w-full overflow-hidden border bg-surface-elevated",
                  index === active ? "border-accent" : "border-border hover:border-foreground/30",
                )}
              >
                <CatalogMedia src={image.url} alt="" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
