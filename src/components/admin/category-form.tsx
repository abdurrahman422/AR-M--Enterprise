"use client";

import { useActionState, useState } from "react";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { DriverNote } from "@/components/admin/driver-note";
import { FieldError } from "@/components/forms/field-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { StatusMessage } from "@/components/ui/status-message";
import { Textarea } from "@/components/ui/textarea";
import { idleActionState, type ActionState } from "@/lib/forms";
import { slugify } from "@/lib/utils";
import type { Category } from "@/types/content";

export function CategoryForm({
  category,
  categories,
  driver,
  writable,
  action,
  deleteAction,
}: {
  category?: Category;
  categories: Category[];
  driver: "catalog" | "neon";
  writable: boolean;
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  deleteAction?: (formData: FormData) => Promise<void>;
}) {
  const [state, formAction, pending] = useActionState(action, idleActionState);
  const [title, setTitle] = useState(category?.title ?? "");
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(category?.slug));
  const parents = categories.filter((item) => item.id !== category?.id);

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      {category ? <input type="hidden" name="id" value={category.id} /> : null}
      <DriverNote driver={driver} writable={writable} entity="Categories" />
      <div>
        <Label htmlFor="category-title">Title</Label>
        <Input
          id="category-title"
          name="title"
          className="mt-2"
          required
          value={title}
          onChange={(event) => {
            const next = event.target.value;
            setTitle(next);
            if (!slugTouched) setSlug(slugify(next));
          }}
        />
        <FieldError errors={state.fieldErrors?.title} />
      </div>
      <div>
        <Label htmlFor="category-slug">Slug</Label>
        <Input
          id="category-slug"
          name="slug"
          className="mt-2"
          required
          value={slug}
          onChange={(event) => {
            setSlugTouched(true);
            setSlug(event.target.value);
          }}
        />
        <FieldError errors={state.fieldErrors?.slug} />
      </div>
      <div>
        <Label htmlFor="category-parent">Parent category</Label>
        <Select id="category-parent" name="parentId" defaultValue={category?.parentId ?? ""} className="mt-2">
          <option value="">Top level</option>
          {parents.map((item) => (
            <option key={item.id} value={item.id}>
              {item.title}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <Label htmlFor="category-sort">Sort order</Label>
        <Input id="category-sort" name="sortOrder" type="number" min={0} defaultValue={category?.sortOrder ?? 0} className="mt-2" />
      </div>
      <div>
        <Label htmlFor="category-summary">Summary</Label>
        <Textarea id="category-summary" name="summary" defaultValue={category?.summary} className="mt-2" />
      </div>
      <div>
        <Label htmlFor="category-description">Description</Label>
        <Textarea id="category-description" name="description" defaultValue={category?.description} className="mt-2 min-h-32" />
      </div>
      <div>
        <Label htmlFor="category-seo-title">SEO title</Label>
        <Input id="category-seo-title" name="seoTitle" defaultValue={category?.seoTitle} className="mt-2" />
      </div>
      <div>
        <Label htmlFor="category-seo-description">SEO description</Label>
        <Input id="category-seo-description" name="seoDescription" defaultValue={category?.seoDescription} className="mt-2" />
      </div>
      <label className="flex items-center gap-3 text-sm">
        <input type="hidden" name="published" value="false" />
        <input type="checkbox" name="published" value="true" defaultChecked={category?.published ?? true} className="h-4 w-4 accent-accent" />
        Published
      </label>
      <label className="flex items-center gap-3 text-sm">
        <input type="hidden" name="featured" value="false" />
        <input type="checkbox" name="featured" value="true" defaultChecked={category?.featured} className="h-4 w-4 accent-accent" />
        Featured
      </label>
      {state.message ? (
        <StatusMessage tone={state.status === "error" ? "danger" : state.status === "success" ? "success" : "neutral"}>
          {state.message}
        </StatusMessage>
      ) : null}
      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : category ? "Save category" : "Create category"}
        </Button>
        <Button href="/admin/categories" variant="ghost">
          Back to list
        </Button>
        {category && deleteAction ? (
          <ConfirmDelete
            action={deleteAction}
            id={category.id}
            label={category.title}
            warning="Delete is blocked if products or child categories still use this record."
          />
        ) : null}
      </div>
    </form>
  );
}
