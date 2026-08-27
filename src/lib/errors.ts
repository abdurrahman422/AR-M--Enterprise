export class PersistenceNotConfiguredError extends Error {
  readonly code = "NOT_CONFIGURED" as const;

  constructor(
    message = "A PostgreSQL/Supabase store is not connected, so this request cannot be saved yet.",
  ) {
    super(message);
    this.name = "PersistenceNotConfiguredError";
  }
}

export class AuthNotConfiguredError extends Error {
  readonly code = "AUTH_NOT_CONFIGURED" as const;

  constructor(message = "Administrator access is not configured on this environment.") {
    super(message);
    this.name = "AuthNotConfiguredError";
  }
}
