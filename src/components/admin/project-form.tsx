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
import type { MediaAsset, Project, Service } from "@/types/content";

export function ProjectForm({
  project,
  services = [],
  driver,
  writable,
  action,
  deleteAction,
}: {
  project?: Project;
  services?: Service[];
  driver: "catalog" | "neon";
  writable: boolean;
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  deleteAction?: (formData: FormData) => Promise<void>;
}) {
  const [state, formAction, pending] = useActionState(action, idleActionState);
  const [title, setTitle] = useState(project?.title ?? "");
  const [slug, setSlug] = useState(project?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(project?.slug));
  const [images, setImages] = useState<MediaAsset[]>(project?.images ?? []);

  return (
    <form action={formAction} className="max-w-3xl space-y-6">
      {project ? <input type="hidden" name="id" value={project.id} /> : null}
      <input type="hidden" name="imagesJson" value={JSON.stringify(images)} />
      <DriverNote driver={driver} writable={writable} entity="Projects" />
      <p className="text-sm text-muted">
        Publish only verified project details. Do not invent client names, certifications, or performance numbers.
      </p>
      <div>
        <Label htmlFor="project-title">Title</Label>
        <Input
          id="project-title"
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
        <Label htmlFor="project-slug">Slug</Label>
        <Input
          id="project-slug"
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
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="project-category">Category</Label>
          <Input id="project-category" name="category" defaultValue={project?.category} className="mt-2" placeholder="Optional" />
        </div>
        <div>
          <Label htmlFor="project-client">Client</Label>
          <Input id="project-client" name="clientName" defaultValue={project?.clientName} className="mt-2" placeholder="Only if provided" />
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <Label htmlFor="project-location">Location</Label>
          <Input id="project-location" name="location" defaultValue={project?.location} className="mt-2" placeholder="Only if provided" />
        </div>
        <div>
          <Label htmlFor="project-completed">Completed</Label>
          <Input id="project-completed" name="completedOn" defaultValue={project?.completedOn} className="mt-2" placeholder="YYYY or YYYY-MM" />
        </div>
        <div>
          <Label htmlFor="project-sort">Sort order</Label>
          <Input id="project-sort" name="sortOrder" type="number" min={0} defaultValue={project?.sortOrder ?? 0} className="mt-2" />
        </div>
      </div>
      <div>
        <Label htmlFor="project-summary">Summary</Label>
        <Textarea id="project-summary" name="summary" defaultValue={project?.summary} className="mt-2" />
      </div>
      <div>
        <Label htmlFor="project-description">Description</Label>
        <Textarea id="project-description" name="description" defaultValue={project?.description} className="mt-2 min-h-32" />
      </div>
      <div>
        <Label htmlFor="project-scope">Scope</Label>
        <Textarea id="project-scope" name="scope" defaultValue={project?.scope} className="mt-2" />
      </div>
      <div>
        <Label htmlFor="project-results">Results</Label>
        <Textarea id="project-results" name="results" defaultValue={project?.results} className="mt-2" placeholder="Only if verified" />
        <p className="mt-1.5 text-xs text-muted">Leave blank unless verified. Do not invent numbers.</p>
      </div>
      {services.length > 0 ? (
        <fieldset>
          <legend className="text-sm font-medium">Services used</legend>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {services.map((service) => (
              <label key={service.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="serviceIds"
                  value={service.id}
                  defaultChecked={project?.serviceIds.includes(service.id)}
                  className="h-4 w-4 accent-accent"
                />
                {service.title}
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}
      <section>
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-heading text-xl">Images</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setImages((current) => [...current, { id: crypto.randomUUID(), url: "", alt: "", sortOrder: current.length }])
            }
          >
            Add image
          </Button>
        </div>
        <div className="mt-4 space-y-4">
          {images.map((image) => (
            <div key={image.id} className="grid gap-3 border border-border p-4 sm:grid-cols-[1fr_1fr_auto]">
              <div>
                <Label htmlFor={`project-image-url-${image.id}`}>URL</Label>
                <Input
                  id={`project-image-url-${image.id}`}
                  className="mt-2"
                  value={image.url}
                  onChange={(event) =>
                    setImages((current) => current.map((item) => (item.id === image.id ? { ...item, url: event.target.value } : item)))
                  }
                />
              </div>
              <div>
                <Label htmlFor={`project-image-alt-${image.id}`}>Alt text</Label>
                <Input
                  id={`project-image-alt-${image.id}`}
                  className="mt-2"
                  value={image.alt}
                  onChange={(event) =>
                    setImages((current) => current.map((item) => (item.id === image.id ? { ...item, alt: event.target.value } : item)))
                  }
                />
              </div>
              <div className="flex items-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setImages((current) => current.filter((item) => item.id !== image.id))}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>
      <div>
        <Label htmlFor="project-seo-title">SEO title</Label>
        <Input id="project-seo-title" name="seoTitle" defaultValue={project?.seoTitle} className="mt-2" />
      </div>
      <div>
        <Label htmlFor="project-seo-description">SEO description</Label>
        <Input id="project-seo-description" name="seoDescription" defaultValue={project?.seoDescription} className="mt-2" />
      </div>
      <label className="flex items-center gap-3 text-sm">
        <input type="hidden" name="published" value="false" />
        <input type="checkbox" name="published" value="true" defaultChecked={project?.published} className="h-4 w-4 accent-accent" />
        Published
      </label>
      <label className="flex items-center gap-3 text-sm">
        <input type="hidden" name="featured" value="false" />
        <input type="checkbox" name="featured" value="true" defaultChecked={project?.featured} className="h-4 w-4 accent-accent" />
        Featured
      </label>
      {state.message ? (
        <StatusMessage tone={state.status === "error" ? "danger" : state.status === "success" ? "success" : "neutral"}>
          {state.message}
        </StatusMessage>
      ) : null}
      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : project ? "Save project" : "Create project"}
        </Button>
        <Button href="/admin/projects" variant="ghost">
          Back to list
        </Button>
        {project && deleteAction ? (
          <ConfirmDelete
            action={deleteAction}
            id={project.id}
            label={project.title}
            warning="This removes the project record from public pages."
          />
        ) : null}
      </div>
    </form>
  );
}
