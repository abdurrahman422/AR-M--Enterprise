export function stringField(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export function boolField(formData: FormData, key: string): boolean {
  const values = formData.getAll(key).filter((value): value is string => typeof value === "string");
  return values.at(-1) === "true";
}

export function numberField(formData: FormData, key: string, fallback = 0): number {
  const raw = stringField(formData, key);
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export type ActionState = {
  status: "idle" | "error" | "success" | "unconfigured";
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export const idleActionState: ActionState = { status: "idle" };
