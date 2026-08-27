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
import type { Resource, TeamMember, Testimonial } from "@/types/content";

type RecordValue = Resource | TeamMember | Testimonial;

export function ContentRecordForm({ kind, record, driver, writable, action, deleteAction }: {
  kind: "resource" | "team" | "testimonial";
  record?: RecordValue;
  driver: "catalog" | "neon";
  writable: boolean;
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  deleteAction?: (formData: FormData) => Promise<void>;
}) {
  const [state, formAction, pending] = useActionState(action, idleActionState);
  const team = kind === "team" ? record as TeamMember | undefined : undefined;
  const resource = kind === "resource" ? record as Resource | undefined : undefined;
  const testimonial = kind === "testimonial" ? record as Testimonial | undefined : undefined;
  const [title, setTitle] = useState(team?.name ?? resource?.title ?? "");
  const [slug, setSlug] = useState(team?.slug ?? resource?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(slug));
  const label = kind === "team" ? "team member" : kind;
  const listHref = `/admin/${kind === "team" ? "team" : `${kind}s`}`;

  return <form action={formAction} className="max-w-2xl space-y-6">
    {record ? <input type="hidden" name="id" value={record.id} /> : null}
    <DriverNote driver={driver} writable={writable} entity={label} />
    {kind === "testimonial" ? <>
      <div><Label htmlFor="testimonial-quote">Quote</Label><Textarea id="testimonial-quote" name="quote" required defaultValue={testimonial?.quote} className="mt-2 min-h-32" /><FieldError errors={state.fieldErrors?.quote} /></div>
      <div><Label htmlFor="testimonial-attribution">Attribution</Label><Input id="testimonial-attribution" name="attribution" required defaultValue={testimonial?.attribution} className="mt-2" /><FieldError errors={state.fieldErrors?.attribution} /></div>
      <div className="grid gap-5 sm:grid-cols-2"><div><Label htmlFor="testimonial-role">Role</Label><Input id="testimonial-role" name="role" defaultValue={testimonial?.role} className="mt-2" /></div><div><Label htmlFor="testimonial-organization">Organization</Label><Input id="testimonial-organization" name="organization" defaultValue={testimonial?.organization} className="mt-2" /></div></div>
    </> : <>
      <div><Label htmlFor={`${kind}-title`}>{kind === "team" ? "Name" : "Title"}</Label><Input id={`${kind}-title`} name={kind === "team" ? "name" : "title"} required value={title} onChange={event => { const next = event.target.value; setTitle(next); if (!slugTouched) setSlug(slugify(next)); }} className="mt-2" /><FieldError errors={state.fieldErrors?.[kind === "team" ? "name" : "title"]} /></div>
      <div><Label htmlFor={`${kind}-slug`}>Slug</Label><Input id={`${kind}-slug`} name="slug" required value={slug} onChange={event => { setSlugTouched(true); setSlug(event.target.value); }} className="mt-2" /><FieldError errors={state.fieldErrors?.slug} /></div>
      {kind === "team" ? <><div><Label htmlFor="team-role">Role</Label><Input id="team-role" name="role" required defaultValue={team?.role} className="mt-2" /><FieldError errors={state.fieldErrors?.role} /></div><div><Label htmlFor="team-bio">Bio</Label><Textarea id="team-bio" name="bio" defaultValue={team?.bio} className="mt-2 min-h-32" /></div></> : <><div><Label htmlFor="resource-type">Type</Label><Select id="resource-type" name="type" defaultValue={resource?.type ?? "other"} className="mt-2"><option value="article">Article</option><option value="brochure">Brochure</option><option value="datasheet">Datasheet</option><option value="whitepaper">Whitepaper</option><option value="video">Video</option><option value="other">Other</option></Select></div><div><Label htmlFor="resource-url">URL</Label><Input id="resource-url" name="url" type="url" defaultValue={resource?.url} className="mt-2" /></div><div><Label htmlFor="resource-summary">Summary</Label><Textarea id="resource-summary" name="summary" defaultValue={resource?.summary} className="mt-2" /></div><div><Label htmlFor="resource-description">Description</Label><Textarea id="resource-description" name="description" defaultValue={resource?.description} className="mt-2 min-h-32" /></div></>}
    </>}
    <div><Label htmlFor={`${kind}-sort`}>Sort order</Label><Input id={`${kind}-sort`} name="sortOrder" type="number" min={0} defaultValue={record && "sortOrder" in record ? record.sortOrder : 0} className="mt-2" /></div>
    <label className="flex items-center gap-3 text-sm"><input type="hidden" name="published" value="false" /><input type="checkbox" name="published" value="true" defaultChecked={record?.published ?? true} className="h-4 w-4 accent-accent" />Published</label>
    {kind !== "team" ? <label className="flex items-center gap-3 text-sm"><input type="hidden" name="featured" value="false" /><input type="checkbox" name="featured" value="true" defaultChecked={record && "featured" in record ? record.featured : false} className="h-4 w-4 accent-accent" />Featured</label> : null}
    {state.message ? <StatusMessage tone={state.status === "error" ? "danger" : "neutral"}>{state.message}</StatusMessage> : null}
    <div className="flex flex-wrap gap-3"><Button type="submit" disabled={pending}>{pending ? "Saving..." : record ? `Save ${label}` : `Create ${label}`}</Button><Button href={listHref} variant="ghost">Back to list</Button>{record && deleteAction ? <ConfirmDelete action={deleteAction} id={record.id} label={title} warning={`This removes the ${label} from public pages.`} /> : null}</div>
  </form>;
}
