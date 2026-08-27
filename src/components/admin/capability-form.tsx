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
import type { Service, Solution } from "@/types/content";

type Capability = Service | Solution;

export function CapabilityForm({
  kind,
  record,
  driver,
  writable,
  action,
  deleteAction,
}: {
  kind: "service" | "solution";
  record?: Capability;
  driver: "catalog" | "neon";
  writable: boolean;
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  deleteAction?: (formData: FormData) => Promise<void>;
}) {
  const [state, formAction, pending] = useActionState(action, idleActionState);
  const [title, setTitle] = useState(record?.title ?? "");
  const [slug, setSlug] = useState(record?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(record?.slug));
  const label = kind === "service" ? "service" : "solution";
  const listHref = kind === "service" ? "/admin/services" : "/admin/solutions";

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      {record ? <input type="hidden" name="id" value={record.id} /> : null}
      <DriverNote driver={driver} writable={writable} entity={kind === "service" ? "Services" : "Solutions"} />
      <div>
        <Label htmlFor={`${kind}-title`}>Title</Label>
        <Input
          id={`${kind}-title`}
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
        <Label htmlFor={`${kind}-slug`}>Slug</Label>
        <Input
          id={`${kind}-slug`}
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
        <Label htmlFor={`${kind}-sort`}>Sort order</Label>
        <Input id={`${kind}-sort`} name="sortOrder" type="number" min={0} defaultValue={record?.sortOrder ?? 0} className="mt-2" />
      </div>
      <div>
        <Label htmlFor={`${kind}-summary`}>Summary</Label>
        <Textarea id={`${kind}-summary`} name="summary" defaultValue={record?.summary} className="mt-2" />
      </div>
      <div>
        <Label htmlFor={`${kind}-description`}>Description</Label>
        <Textarea id={`${kind}-description`} name="description" defaultValue={record?.description} className="mt-2 min-h-32" />
      </div>
      <div>
        <Label htmlFor={`${kind}-seo-title`}>SEO title</Label>
        <Input id={`${kind}-seo-title`} name="seoTitle" defaultValue={record?.seoTitle} className="mt-2" />
      </div>
      <div>
        <Label htmlFor={`${kind}-seo-description`}>SEO description</Label>
        <Input id={`${kind}-seo-description`} name="seoDescription" defaultValue={record?.seoDescription} className="mt-2" />
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
          {pending ? "Saving…" : record ? `Save ${label}` : `Create ${label}`}
        </Button>
        <Button href={listHref} variant="ghost">
          Back to list
        </Button>
        {record && deleteAction ? (
          <ConfirmDelete
            action={deleteAction}
            id={record.id}
            label={record.title}
            warning={`This removes the ${label} from public pages.`}
          />
        ) : null}
      </div>
    </form>
  );
}
