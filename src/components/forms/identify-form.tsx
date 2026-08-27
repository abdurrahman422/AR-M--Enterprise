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

export function IdentifyForm() {
  const [state, action, pending] = useActionState<InquiryActionState, FormData>(
    submitInquiry,
    idleActionState,
  );

  return (
    <form action={action} className="max-w-xl space-y-5" encType="multipart/form-data">
      <input type="hidden" name="kind" value="identify" />
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="identify-website">Website</label>
        <input id="identify-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <Field id="identify-name" name="name" label="Name" required autoComplete="name" error={state.fieldErrors?.name} />
      <Field id="identify-company" name="company" label="Company" required autoComplete="organization" error={state.fieldErrors?.company} />
      <Field id="identify-email" name="email" label="Work email" type="email" required autoComplete="email" error={state.fieldErrors?.email} />
      <Field id="identify-phone" name="phone" label="Phone" type="tel" required autoComplete="tel" error={state.fieldErrors?.phone} />
      <Field id="identify-mill" name="millLocation" label="Mill or plant location" placeholder="Optional" error={state.fieldErrors?.millLocation} />
      <div>
        <Label htmlFor="identify-requirement">Requirement</Label>
        <Textarea id="identify-requirement" name="requirement" className="mt-2" placeholder="What should be identified or matched?" />
      </div>
      <div>
        <Label htmlFor="identify-photo">Photo or marking</Label>
        <Input id="identify-photo" name="photo" type="file" accept="image/jpeg,image/png,image/webp,application/pdf" className="mt-2" />
        <p className="mt-1.5 text-xs text-muted">JPG, PNG, WebP, or PDF. 8MB maximum.</p>
      </div>
      <div>
        <Label htmlFor="identify-message">What should we match?</Label>
        <Textarea id="identify-message" name="message" className="mt-2" required minLength={10} placeholder="Dimensions, equipment, markings, or operating context" />
        <FieldError errors={state.fieldErrors?.message} />
      </div>
      {state.message ? (
        <StatusMessage tone={state.status === "error" ? "danger" : state.status === "success" ? "success" : "neutral"}>
          {state.message}
        </StatusMessage>
      ) : null}
      {state.status === "unconfigured" && hasContactEmail ? (
        <a className="inline-block text-sm text-accent hover:text-accent-hover" href={mailtoHref(siteConfig.contact.email, "Part identification")}>
          Email {siteConfig.contact.email}
        </a>
      ) : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Sending…" : "Send to an engineer"}
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
  error,
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
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
        className="mt-2"
        aria-invalid={Boolean(error?.length)}
      />
      <FieldError errors={error} />
    </div>
  );
}
