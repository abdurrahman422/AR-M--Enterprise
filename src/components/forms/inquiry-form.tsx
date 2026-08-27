"use client";

import { useActionState } from "react";
import { submitInquiry, type InquiryActionState } from "@/app/actions/inquiries";
import { FieldError } from "@/components/forms/field-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusMessage } from "@/components/ui/status-message";
import { Textarea } from "@/components/ui/textarea";
import { hasContactEmail, mailtoHref, siteConfig } from "@/config/site";
import { idleActionState } from "@/lib/forms";
import type { InquiryKind } from "@/types/inquiries";

type InquiryFormKind = Exclude<InquiryKind, "identify">;

const copy: Record<InquiryFormKind, { submit: string; extra: { name: string; label: string; placeholder: string }[]; allowFile: boolean }> = {
  quote: {
    submit: "Request a quote",
    extra: [
      { name: "productTitle", label: "Product or equipment", placeholder: "If known" },
      { name: "quantity", label: "Quantity / capacity", placeholder: "Optional" },
    ],
    allowFile: true,
  },
  consultation: {
    submit: "Send request",
    extra: [
      { name: "topic", label: "Topic", placeholder: "Process, layout, equipment, or performance" },
      { name: "preferredTiming", label: "Preferred timing", placeholder: "Optional" },
    ],
    allowFile: true,
  },
  service: {
    submit: "Request service",
    extra: [
      { name: "serviceType", label: "Service type", placeholder: "Installation, audit, spare support, or other" },
      { name: "millLocation", label: "Mill location", placeholder: "Optional" },
    ],
    allowFile: true,
  },
};

export function InquiryForm({
  kind,
  defaultProductTitle = "",
  defaultProductSlug = "",
  defaultTopic = "",
  defaultServiceType = "",
}: {
  kind: InquiryFormKind;
  defaultProductTitle?: string;
  defaultProductSlug?: string;
  defaultTopic?: string;
  defaultServiceType?: string;
}) {
  const [state, action, pending] = useActionState<InquiryActionState, FormData>(
    submitInquiry,
    idleActionState,
  );

  const fields = copy[kind];

  return (
    <form action={action} className="max-w-xl space-y-5" encType="multipart/form-data">
      <input type="hidden" name="kind" value={kind} />
      {defaultProductSlug ? <input type="hidden" name="productSlug" value={defaultProductSlug} /> : null}
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor={`${kind}-website`}>Website</label>
        <input id={`${kind}-website`} name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <Field
        id={`${kind}-name`}
        name="name"
        label="Name"
        required
        autoComplete="name"
        error={state.fieldErrors?.name}
      />
      <Field
        id={`${kind}-company`}
        name="company"
        label="Company"
        required
        autoComplete="organization"
        error={state.fieldErrors?.company}
      />
      <Field
        id={`${kind}-email`}
        name="email"
        label="Work email"
        type="email"
        required
        autoComplete="email"
        error={state.fieldErrors?.email}
      />
      <Field
        id={`${kind}-phone`}
        name="phone"
        label="Phone"
        type="tel"
        required
        autoComplete="tel"
        error={state.fieldErrors?.phone}
      />
      {fields.extra.map((field) => (
        <Field
          key={field.name}
          id={`${kind}-${field.name}`}
          name={field.name}
          label={field.label}
          placeholder={field.placeholder}
          defaultValue={
            field.name === "productTitle"
              ? defaultProductTitle
              : field.name === "topic"
                ? defaultTopic
                : field.name === "serviceType"
                  ? defaultServiceType
                  : undefined
          }
          error={state.fieldErrors?.[field.name]}
        />
      ))}
      <div>
        <Label htmlFor={`${kind}-requirement`}>Requirement</Label>
        <Textarea
          id={`${kind}-requirement`}
          name="requirement"
          className="mt-2"
          placeholder="What needs to be quoted, reviewed, or supported?"
        />
      </div>
      {fields.allowFile ? (
        <div>
          <Label htmlFor={`${kind}-file`}>Attachment</Label>
          <Input id={`${kind}-file`} name="photo" type="file" accept="image/jpeg,image/png,image/webp,application/pdf" className="mt-2" />
          <p className="mt-1.5 text-xs text-muted">Optional. JPG, PNG, WebP, or PDF. 8MB maximum.</p>
        </div>
      ) : null}
      <div>
        <Label htmlFor={`${kind}-message`}>Message</Label>
        <Textarea
          id={`${kind}-message`}
          name="message"
          className="mt-2"
          required
          minLength={10}
        />
        <FieldError errors={state.fieldErrors?.message} />
      </div>
      {state.message ? (
        <StatusMessage
          tone={state.status === "error" ? "danger" : state.status === "success" ? "success" : "neutral"}
        >
          {state.message}
        </StatusMessage>
      ) : null}
      {state.status === "unconfigured" && hasContactEmail ? (
        <a
          className="inline-block text-sm text-accent hover:text-accent-hover"
          href={mailtoHref(siteConfig.contact.email, fields.submit, defaultProductTitle)}
        >
          Email {siteConfig.contact.email}
        </a>
      ) : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Sending…" : fields.submit}
      </Button>
    </form>
  );
}

function Field({
  id,
  name,
  label,
  type = "text",
  required,
  autoComplete,
  placeholder,
  defaultValue,
  error,
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
  defaultValue?: string;
  error?: string[];
}) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="mt-2"
        aria-invalid={Boolean(error?.length)}
      />
      <FieldError errors={error} />
    </div>
  );
}
