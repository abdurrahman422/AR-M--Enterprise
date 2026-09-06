"use client";

import { useActionState, useMemo, useState } from "react";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { DriverNote } from "@/components/admin/driver-note";
import { FieldError } from "@/components/forms/field-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { StatusMessage } from "@/components/ui/status-message";
import { Textarea } from "@/components/ui/textarea";
import { productAvailabilityLabels } from "@/lib/constants";
import { idleActionState, type ActionState } from "@/lib/forms";
import { slugify } from "@/lib/utils";
import type { Category, MediaAsset, Product, ProductDocument, TechnicalSpecification } from "@/types/content";

type ImageDraft = MediaAsset;
type SpecDraft = TechnicalSpecification;
type DocDraft = ProductDocument;

export function ProductForm({
  product,
  categories,
  driver,
  writable,
  action,
  deleteAction,
}: {
  product?: Product;
  categories: Category[];
  driver: "catalog" | "neon";
  writable: boolean;
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  deleteAction?: (formData: FormData) => Promise<void>;
}) {
  const [state, formAction, pending] = useActionState(action, idleActionState);
  const [title, setTitle] = useState(product?.title ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(product?.slug));
  const [images, setImages] = useState<ImageDraft[]>(product?.images ?? []);
  const [specifications, setSpecifications] = useState<SpecDraft[]>(product?.specifications ?? []);
  const [documents, setDocuments] = useState<DocDraft[]>(product?.documents ?? []);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  const treeOptions = useMemo(
    () =>
      [...categories]
        .sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title))
        .map((category) => ({
          id: category.id,
          label: category.parentId
            ? `${categories.find((item) => item.id === category.parentId)?.title ?? ""} / ${category.title}`
            : category.title,
        })),
    [categories],
  );

  return (
    <form action={formAction} className="max-w-3xl space-y-8">
      {product ? <input type="hidden" name="id" value={product.id} /> : null}
      <input type="hidden" name="imagesJson" value={JSON.stringify(images)} />
      <input type="hidden" name="specificationsJson" value={JSON.stringify(specifications)} />
      <input type="hidden" name="documentsJson" value={JSON.stringify(documents)} />
      <DriverNote driver={driver} writable={writable} entity="Products" />
      <section className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="product-title">Title</Label>
          <Input
            id="product-title"
            name="title"
            value={title}
            className="mt-2"
            required
            onChange={(event) => {
              const next = event.target.value;
              setTitle(next);
              if (!slugTouched) setSlug(slugify(next));
            }}
          />
          <FieldError errors={state.fieldErrors?.title} />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="product-slug">Slug</Label>
          <Input
            id="product-slug"
            name="slug"
            value={slug}
            className="mt-2"
            required
            onChange={(event) => {
              setSlugTouched(true);
              setSlug(event.target.value);
            }}
          />
          <FieldError errors={state.fieldErrors?.slug} />
        </div>
        <div>
          <Label htmlFor="product-category">Category</Label>
          <Select id="product-category" name="categoryId" defaultValue={product?.categoryId ?? ""} className="mt-2">
            <option value="">Unassigned</option>
            {treeOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="product-availability">Availability</Label>
          <Select id="product-availability" name="availability" defaultValue={product?.availability ?? "contact"} className="mt-2">
            {Object.entries(productAvailabilityLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </div>
        <Field id="product-brand" name="brand" label="Brand" defaultValue={product?.brand} />
        <Field id="product-model" name="model" label="Model" defaultValue={product?.model} />
        <Field id="product-sku" name="sku" label="SKU" defaultValue={product?.sku} />
      </section>
      <section className="space-y-5">
        <div>
          <Label htmlFor="product-summary">Summary</Label>
          <Textarea id="product-summary" name="summary" defaultValue={product?.summary} className="mt-2 min-h-24" />
        </div>
        <div>
          <Label htmlFor="product-description">Description</Label>
          <Textarea id="product-description" name="description" defaultValue={product?.description} className="mt-2 min-h-40" />
        </div>
      </section>
      <section>
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-heading text-xl">Images</h2>
          <div className="flex items-center gap-2"><label className="inline-flex h-9 cursor-pointer items-center rounded-xl bg-foreground px-3.5 text-sm font-semibold text-white hover:bg-foreground/85">
            {uploading ? "Uploading…" : "Upload image"}<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="sr-only" disabled={uploading} onChange={async(event)=>{const file=event.target.files?.[0];if(!file)return;setUploading(true);setUploadMessage("");try{const body=new FormData();body.set("file",file);const response=await fetch("/api/admin/uploads",{method:"POST",body});const result=await response.json() as {url?:string;message?:string};if(!response.ok||!result.url)throw new Error(result.message||"Upload failed");setImages(current=>[...current,{id:crypto.randomUUID(),url:result.url!,alt:title||file.name,sortOrder:current.length}]);setUploadMessage("Image uploaded. Click Save product to publish it.")}catch(error){setUploadMessage(error instanceof Error?error.message:"Upload failed")}finally{setUploading(false);event.target.value=""}}} /></label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setImages((current) => [
                ...current,
                { id: crypto.randomUUID(), url: "", alt: "", sortOrder: current.length },
              ])
            }
          >
            Add image
          </Button>
          </div>
        </div>
        {uploadMessage ? <p className="mt-3 text-sm text-muted">{uploadMessage}</p> : null}
        <div className="mt-4 space-y-4">
          {images.map((image, index) => (
            <div key={image.id} className="grid gap-3 border border-border p-4 sm:grid-cols-[1fr_1fr_auto]">
              <Field
                id={`image-url-${image.id}`}
                label="URL"
                value={image.url}
                onChange={(value) =>
                  setImages((current) => current.map((item) => (item.id === image.id ? { ...item, url: value } : item)))
                }
              />
              <Field
                id={`image-alt-${image.id}`}
                label="Alt text"
                value={image.alt}
                onChange={(value) =>
                  setImages((current) => current.map((item) => (item.id === image.id ? { ...item, alt: value } : item)))
                }
              />
              <div className="flex items-end">
                <Button type="button" variant="ghost" size="sm" onClick={() => setImages((current) => current.filter((item) => item.id !== image.id).map((item, order) => ({ ...item, sortOrder: order })))}>
                  Remove
                </Button>
              </div>
              <p className="sr-only">{index}</p>
            </div>
          ))}
        </div>
      </section>
      <section>
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-heading text-xl">Technical specifications</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setSpecifications((current) => [
                ...current,
                { id: crypto.randomUUID(), group: "General", label: "", value: "", sortOrder: current.length },
              ])
            }
          >
            Add specification
          </Button>
        </div>
        <div className="mt-4 space-y-4">
          {specifications.map((spec) => (
            <div key={spec.id} className="grid gap-3 border border-border p-4 sm:grid-cols-4">
              <Field id={`spec-group-${spec.id}`} label="Group" value={spec.group} onChange={(value) => setSpecifications((current) => current.map((item) => (item.id === spec.id ? { ...item, group: value } : item)))} />
              <Field id={`spec-label-${spec.id}`} label="Label" value={spec.label} onChange={(value) => setSpecifications((current) => current.map((item) => (item.id === spec.id ? { ...item, label: value } : item)))} />
              <Field id={`spec-value-${spec.id}`} label="Value" value={spec.value} onChange={(value) => setSpecifications((current) => current.map((item) => (item.id === spec.id ? { ...item, value: value } : item)))} />
              <div className="flex items-end gap-2">
                <Field id={`spec-unit-${spec.id}`} label="Unit" value={spec.unit ?? ""} onChange={(value) => setSpecifications((current) => current.map((item) => (item.id === spec.id ? { ...item, unit: value } : item)))} />
                <Button type="button" variant="ghost" size="sm" onClick={() => setSpecifications((current) => current.filter((item) => item.id !== spec.id))}>
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section>
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-heading text-xl">Documents</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setDocuments((current) => [...current, { id: crypto.randomUUID(), title: "", url: "", fileType: "pdf" }])
            }
          >
            Add document
          </Button>
        </div>
        <div className="mt-4 space-y-4">
          {documents.map((document) => (
            <div key={document.id} className="grid gap-3 border border-border p-4 sm:grid-cols-[1fr_1fr_8rem_auto]">
              <Field id={`doc-title-${document.id}`} label="Title" value={document.title} onChange={(value) => setDocuments((current) => current.map((item) => (item.id === document.id ? { ...item, title: value } : item)))} />
              <Field id={`doc-url-${document.id}`} label="URL" value={document.url} onChange={(value) => setDocuments((current) => current.map((item) => (item.id === document.id ? { ...item, url: value } : item)))} />
              <Field id={`doc-type-${document.id}`} label="Type" value={document.fileType} onChange={(value) => setDocuments((current) => current.map((item) => (item.id === document.id ? { ...item, fileType: value } : item)))} />
              <div className="flex items-end">
                <Button type="button" variant="ghost" size="sm" onClick={() => setDocuments((current) => current.filter((item) => item.id !== document.id))}>
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="grid gap-5 sm:grid-cols-2">
        <Field id="product-seo-title" name="seoTitle" label="SEO title" defaultValue={product?.seoTitle} />
        <Field id="product-seo-description" name="seoDescription" label="SEO description" defaultValue={product?.seoDescription} />
        <BooleanField name="published" label="Published" defaultChecked={product?.published} />
        <BooleanField name="featured" label="Featured" defaultChecked={product?.featured} />
      </section>
      {state.message ? (
        <StatusMessage tone={state.status === "error" ? "danger" : state.status === "success" ? "success" : "neutral"}>
          {state.message}
        </StatusMessage>
      ) : null}
      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : product ? "Save product" : "Create product"}
        </Button>
        <Button href="/admin/products" variant="ghost">
          Back to list
        </Button>
        {product && deleteAction ? (
          <ConfirmDelete
            action={deleteAction}
            id={product.id}
            label={product.title}
            warning="This removes the product from the catalog. Public pages never show prices."
          />
        ) : null}
      </div>
    </form>
  );
}

function Field({
  id,
  name,
  label,
  defaultValue,
  value,
  onChange,
}: {
  id: string;
  name?: string;
  label: string;
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        name={name}
        className="mt-2"
        defaultValue={onChange ? undefined : defaultValue}
        value={onChange ? value : undefined}
        onChange={onChange ? (event) => onChange(event.target.value) : undefined}
      />
    </div>
  );
}

function BooleanField({ name, label, defaultChecked }: { name: string; label: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-center gap-3 text-sm">
      <input type="hidden" name={name} value="false" />
      <input type="checkbox" name={name} value="true" defaultChecked={defaultChecked} className="h-4 w-4 accent-accent" />
      {label}
    </label>
  );
}
