import { StatusMessage } from "@/components/ui/status-message";

export function AdminBanner({
  created,
  saved,
  deleted,
  error,
}: {
  created?: string;
  saved?: string;
  deleted?: string;
  error?: string;
}) {
  if (error) return <StatusMessage tone="danger">{error}</StatusMessage>;
  if (created) return <StatusMessage tone="success">Record created.</StatusMessage>;
  if (saved) return <StatusMessage tone="success">Changes saved.</StatusMessage>;
  if (deleted) return <StatusMessage tone="success">Record deleted.</StatusMessage>;
  return null;
}
