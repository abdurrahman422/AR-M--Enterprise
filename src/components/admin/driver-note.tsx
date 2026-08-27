export function DriverNote({
  driver,
  writable,
  entity,
}: {
  driver: "catalog" | "neon";
  writable: boolean;
  entity: string;
}) {
  if (driver === "neon" && writable) {
    return <p className="text-sm text-muted">{entity} save to Neon PostgreSQL.</p>;
  }
  if (driver === "catalog" && writable) {
    return (
      <p className="text-sm text-muted">
        {entity} save to the local catalog store. Connect Neon PostgreSQL for production persistence.
      </p>
    );
  }
  return (
    <p className="text-sm text-danger">
      {entity} cannot be saved on this host until PostgreSQL is connected. The form is ready; it will not pretend a write succeeded.
    </p>
  );
}
