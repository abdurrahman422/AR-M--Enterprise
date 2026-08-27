"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusMessage } from "@/components/ui/status-message";
import { Textarea } from "@/components/ui/textarea";
import { idleActionState, type ActionState } from "@/lib/forms";
import type { SiteSettings } from "@/types/settings";

export function SettingsForm({ settings, action }: { settings: SiteSettings; action: (state: ActionState, formData: FormData) => Promise<ActionState> }) {
  const [state, formAction, pending] = useActionState(action, idleActionState);
  const textFields: Array<[keyof SiteSettings, string]> = [["contactEmail", "Contact email"], ["contactPhone", "Contact phone"], ["whatsapp", "WhatsApp"], ["address", "Address"], ["linkedin", "LinkedIn URL"], ["facebook", "Facebook URL"], ["instagram", "Instagram URL"], ["youtube", "YouTube URL"], ["x", "X URL"], ["notifyEmail", "Notification email"]];
  return <form action={formAction} className="max-w-3xl space-y-6"><p className="text-sm text-muted">Leave fields blank when the business has not supplied verified details.</p><div className="grid gap-5 sm:grid-cols-2">{textFields.map(([name, label]) => <div key={name}><Label htmlFor={`settings-${name}`}>{label}</Label><Input id={`settings-${name}`} name={name} type={name === "contactEmail" || name === "notifyEmail" ? "email" : "text"} defaultValue={settings[name] as string} className="mt-2" /></div>)}</div><div><Label htmlFor="settings-seo-title">SEO title</Label><Input id="settings-seo-title" name="seoTitle" defaultValue={settings.seoTitle} className="mt-2" /></div><div><Label htmlFor="settings-seo-description">SEO description</Label><Textarea id="settings-seo-description" name="seoDescription" defaultValue={settings.seoDescription} className="mt-2" /></div><label className="flex items-center gap-3 text-sm"><input type="hidden" name="notifyEnabled" value="false" /><input type="checkbox" name="notifyEnabled" value="true" defaultChecked={settings.notifyEnabled} className="h-4 w-4 accent-accent" />Enable inquiry email notifications</label>{state.message ? <StatusMessage tone={state.status === "error" ? "danger" : state.status === "success" ? "success" : "neutral"}>{state.message}</StatusMessage> : null}<Button type="submit" disabled={pending}>{pending ? "Saving..." : "Save settings"}</Button></form>;
}
