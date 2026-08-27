"use client";

import { useActionState, useState } from "react";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { DriverNote } from "@/components/admin/driver-note";
import { FieldError } from "@/components/forms/field-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusMessage } from "@/components/ui/status-message";
import { Textarea } from "@/components/ui/textarea";
import { idleActionState, type ActionState } from "@/lib/forms";
import { slugify } from "@/lib/utils";
import type { Solution } from "@/types/content";

export function SolutionForm({
  record,
  driver,
  writable,
  action,
  deleteAction,
}: {
  record?: Solution;
  driver: "catalog" | "neon";
  writable: boolean;
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  deleteAction?: (formData: FormData) => Promise<void>;
}) {
  const [state, formAction, pending] = useActionState(action, idleActionState);
  const [title, setTitle] = useState(record?.title ?? "");
  const [slug, setSlug] = useState(record?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(record?.slug));

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      {record ? <input type="hidden" name="id" value={record.id} /> : null}
      <DriverNote driver={driver} writable={writable} entity="Solutions" />
      <div>
        <Label htmlFor="solution-title">Title</Label>
        <Input
          id="solution-title"
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
        <Label htmlFor="solution-slug">Slug</Label>
        <Input
          id="solution-slug"
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
        <Label htmlFor="solution-sort">Sort order</Label>
        <Input id="solution-sort" name="sortOrder" type="number" min={0} defaultValue={record?.sortOrder ?? 0} className="mt-2" />
      </div>
      <div>
        <Label htmlFor="solution-summary">Summary</Label>
        <Textarea id="solution-summary" name="summary" defaultValue={record?.summary} className="mt-2" />
      </div>
      <div>
        <Label htmlFor="solution-problem">Problem</Label>
        <Textarea id="solution-problem" name="problem" defaultValue={record?.problem} className="mt-2" />
      </div>
      <div>
        <Label htmlFor="solution-approach">Approach</Label>
        <Textarea id="solution-approach" name="approach" defaultValue={record?.approach} className="mt-2" />
      </div>
      <div>
        <Label htmlFor="solution-deliverables">Deliverables</Label>
        <Textarea
          id="solution-deliverables"
          name="deliverables"
          defaultValue={record?.deliverables.join("\n")}
          className="mt-2 min-h-32"
          placeholder="One deliverable per line"
        />
        <p className="mt-1.5 text-xs text-muted">One item per line.</p>
      </div>
      <div>
        <Label htmlFor="solution-description">Description</Label>
        <Textarea id="solution-description" name="description" defaultValue={record?.description} className="mt-2 min-h-32" />
      </div>
      <div>
        <Label htmlFor="solution-seo-title">SEO title</Label>
        <Input id="solution-seo-title" name="seoTitle" defaultValue={record?.seoTitle} className="mt-2" />
      </div>
      <div>
        <Label htmlFor="solution-seo-description">SEO description</Label>
        <Input id="solution-seo-description" name="seoDescription" defaultValue={record?.seoDescription} className="mt-2" />
      </div>
      <label className="flex items-center gap-3 text-sm">
        <input type="hidden" name="published" value="false" />
        <input type="checkbox" name="published" value="true" defaultChecked={record?.published ?? true} className="h-4 w-4 accent-accent" />
        Published
      </label>
      <label className="flex items-center gap-3 text-sm">
        <input type="hidden" name="featured" value="false" />
        <input type="checkbox" name="featured" value="true" defaultChecked={record?.featured} className="h-4 w-4 accent-accent" />
        Featured
      </label>
      {state.message ? (
        <StatusMessage tone={state.status === "error" ? "danger" : state.status === "success" ? "success" : "neutral"}>
          {state.message}
        </StatusMessage>
      ) : null}
      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : record ? "Save solution" : "Create solution"}
        </Button>
        <Button href="/admin/solutions" variant="ghost">
          Back to list
        </Button>
        {record && deleteAction ? (
          <ConfirmDelete
            action={deleteAction}
            id={record.id}
            label={record.title}
            warning="This removes the solution from public pages."
          />
        ) : null}
      </div>
    </form>
  );
}
