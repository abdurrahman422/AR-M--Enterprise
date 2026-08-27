import "server-only";

import { Pool } from "pg";
import { serverEnv, isFilled } from "@/config/env";

const tables = new Set([
  "categories", "products", "services", "solutions", "projects", "resources", "testimonials", "team_members", "inquiries", "site_settings",
]);
const jsonColumns = new Set([
  "products.images", "products.specifications", "products.documents", "solutions.deliverables", "projects.service_ids", "projects.images",
  "team_members.image", "inquiries.notes", "inquiries.attachments", "site_settings.payload",
]);

let pool: Pool | undefined;

export function isNeonConfigured(): boolean {
  return isFilled(serverEnv.databaseUrl);
}

function getPool(): Pool {
  if (!isNeonConfigured()) throw new Error("DATABASE_URL is not configured.");
  pool ??= new Pool({ connectionString: normalizedDatabaseUrl(), max: 5, idleTimeoutMillis: 10_000 });
  return pool;
}

function normalizedDatabaseUrl(): string {
  const url = new URL(serverEnv.databaseUrl);
  url.searchParams.set("sslmode", "verify-full");
  return url.toString();
}

function tableName(table: string): string {
  if (!tables.has(table)) throw new Error(`Unsupported database table: ${table}`);
  return `"${table}"`;
}

type Row = Record<string, unknown>;
type QueryResponse = { data: Row | Row[] | null; error: { message: string; code?: string } | null };

class NeonQuery implements PromiseLike<QueryResponse> {
  private operation: "select" | "insert" | "update" | "delete" = "select";
  private values: Record<string, unknown> | undefined;
  private filters: Array<[string, unknown]> = [];
  private singleRow = false;
  private sort?: { column: string; ascending: boolean };

  constructor(private readonly table: string) {}

  select(...columns: string[]): this { void columns; return this; }
  eq(column: string, value: unknown): this { this.filters.push([column, value]); return this; }
  order(column: string, options?: { ascending?: boolean }): this { this.sort = { column, ascending: options?.ascending ?? true }; return this; }
  insert(values: Record<string, unknown>): this { this.operation = "insert"; this.values = values; return this; }
  update(values: Record<string, unknown>): this { this.operation = "update"; this.values = values; return this; }
  delete(): this { this.operation = "delete"; return this; }
  single(): this { this.singleRow = true; return this; }
  maybeSingle(): this { this.singleRow = true; return this; }

  then<TResult1 = QueryResponse, TResult2 = never>(onfulfilled?: ((value: QueryResponse) => TResult1 | PromiseLike<TResult1>) | null, onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null): Promise<TResult1 | TResult2> {
    return this.execute().then(onfulfilled, onrejected);
  }

  private async execute(): Promise<QueryResponse> {
    try {
      const parameters: unknown[] = [];
      const add = (value: unknown, column?: string) => {
        const parameter = column && jsonColumns.has(`${this.table}.${column}`) && value !== null ? JSON.stringify(value) : value;
        parameters.push(parameter);
        return `$${parameters.length}`;
      };
      const where = this.filters.length ? ` where ${this.filters.map(([column, value]) => `${this.safeColumn(column)} = ${add(value)}`).join(" and ")}` : "";
      let text: string;
      if (this.operation === "insert") {
        const entries = Object.entries(this.values ?? {});
        text = `insert into ${tableName(this.table)} (${entries.map(([key]) => this.safeColumn(key)).join(", ")}) values (${entries.map(([key, value]) => add(value, key)).join(", ")}) returning *`;
      } else if (this.operation === "update") {
        const entries = Object.entries(this.values ?? {});
        text = `update ${tableName(this.table)} set ${entries.map(([key, value]) => `${this.safeColumn(key)} = ${add(value, key)}`).join(", ")}${where} returning *`;
      } else if (this.operation === "delete") {
        text = `delete from ${tableName(this.table)}${where}`;
      } else {
        text = `select * from ${tableName(this.table)}${where}${this.sort ? ` order by ${this.safeColumn(this.sort.column)} ${this.sort.ascending ? "asc" : "desc"}` : ""}`;
      }
      const result = await getPool().query(text, parameters);
      const rows = result.rows as Row[];
      if (this.singleRow && rows.length > 1) return { data: null, error: { message: "Multiple rows returned." } };
      return { data: this.operation === "delete" ? null : (this.singleRow ? rows[0] ?? null : rows), error: null };
    } catch (error) {
      const databaseError = error as { message?: string; code?: string };
      return { data: null, error: { message: databaseError.message ?? "Database request failed.", code: databaseError.code } };
    }
  }

  private safeColumn(column: string): string {
    if (!/^[a-z_][a-z0-9_]*$/i.test(column)) throw new Error("Unsupported database column.");
    return `"${column}"`;
  }
}

export function createNeonServerClient() {
  if (!isNeonConfigured()) throw new Error("DATABASE_URL is not configured.");
  return { from: (table: string) => new NeonQuery(table) };
}
