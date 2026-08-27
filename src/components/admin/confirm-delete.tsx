"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function ConfirmDelete({
  action,
  id,
  label,
  warning,
}: {
  action: (formData: FormData) => Promise<void>;
  id: string;
  label: string;
  warning: string;
}) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <Button type="button" variant="outline" size="sm" onClick={() => setOpen(true)}>
        Delete
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4" role="dialog" aria-modal="true" aria-labelledby="confirm-delete-title">
      <div className="w-full max-w-md border border-border bg-surface p-6">
        <h2 id="confirm-delete-title" className="font-heading text-xl">
          Delete {label}?
        </h2>
        <p className="mt-3 text-sm leading-6 text-muted">{warning}</p>
        <form action={action} className="mt-6 flex justify-end gap-3">
          <input type="hidden" name="id" value={id} />
          <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" variant="outline">
            Delete
          </Button>
        </form>
      </div>
    </div>
  );
}
