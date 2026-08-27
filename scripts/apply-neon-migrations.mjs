import fs from "node:fs";
import path from "node:path";
import { Client } from "pg";

const requiredTables = [
  "categories",
  "products",
  "services",
  "solutions",
  "projects",
  "resources",
  "team_members",
  "testimonials",
  "inquiries",
  "site_settings",
];

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required.");
}

const client = new Client({ connectionString: process.env.DATABASE_URL });
const migrationDir = path.join(process.cwd(), "supabase", "migrations");

try {
  await client.connect();
  const migrations = fs.readdirSync(migrationDir).filter((file) => file.endsWith(".sql")).sort();
  for (const migration of migrations) {
    console.log(`APPLY ${migration}`);
    await client.query(fs.readFileSync(path.join(migrationDir, migration), "utf8"));
  }

  const result = await client.query(
    "select table_name from information_schema.tables where table_schema = current_schema()",
  );
  const found = result.rows.map((row) => row.table_name).filter((name) => requiredTables.includes(name)).sort();
  console.log(`TABLES ${found.join(",")}`);
  if (found.length !== requiredTables.length) throw new Error("Required table verification failed.");
  console.log("NEON_SCHEMA_VERIFIED");
} finally {
  await client.end();
}
