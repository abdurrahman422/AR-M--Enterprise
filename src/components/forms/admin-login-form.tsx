"use client";

import { useActionState } from "react";
import { loginAdmin, type LoginState } from "@/app/admin/actions";
import { FieldError } from "@/components/forms/field-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusMessage } from "@/components/ui/status-message";
import { idleActionState } from "@/lib/forms";

export function AdminLoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(loginAdmin, idleActionState);

  return (
    <form action={action} className="space-y-5">
      <div>
        <Label htmlFor="admin-email">Email</Label>
        <Input
          id="admin-email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className="mt-2"
        />
        <FieldError errors={state.fieldErrors?.email} />
      </div>
      <div>
        <Label htmlFor="admin-password">Password</Label>
        <Input
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-2"
        />
        <FieldError errors={state.fieldErrors?.password} />
      </div>
      {state.message ? (
        <StatusMessage tone={state.status === "error" ? "danger" : "neutral"}>
          {state.message}
        </StatusMessage>
      ) : null}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
