import Database from "@tauri-apps/plugin-sql";
import { drizzle } from "drizzle-orm/sqlite-proxy";
import { migrate } from "drizzle-orm/sqlite-proxy/migrator";
import * as schema from "@/db/schema";
import { DATABASE_URL } from "./utils";

declare global {
  var sqlite: Database;
}

// const DATABASE = "sqlite:trlatchs.db";

export const db = drizzle(
  async (sql, params, method) => {
    let rows: any = [];
    let results = [];

    if (!globalThis.sqlite) {
      globalThis.sqlite = await Database.load(DATABASE_URL);
    }
    console.log("Database Loaded");

    // If the query is a SELECT, use the select method
    if (isSelectQuery(sql)) {
      rows = await globalThis.sqlite.select(sql, params).catch((e) => {
        console.error("SQL Error:", e);
        return [];
      });
    } else {
      // Otherwise, use the execute method
      rows = await globalThis.sqlite.execute(sql, params).catch((e) => {
        console.error("SQL Error:", e);
        return [];
      });
      return { rows: [] };
    }

    rows = rows.map((row: any) => {
      return Object.values(row);
    });

    // If the method is "all", return all rows
    results = method === "all" ? rows : rows[0];

    return { rows: results };
  },
  { logger: true, schema }
);

function isSelectQuery(sql: string): boolean {
  const selectRegex = /^\s*SELECT\b/i;
  return selectRegex.test(sql);
}

export async function migrateDb() {
  return migrate(
    db,
    async (queries) => {
      console.log({ queries });

      if (!globalThis.sqlite) {
        globalThis.sqlite = await Database.load(DATABASE_URL);
      }
      for (const query of queries) {
        await globalThis.sqlite.execute(query);
      }
    },
    { migrationsFolder: "../../drizzle" }
  )
    .then(() => {
      console.log("Database migrated successfully");
    })
    .catch((error) => {
      console.error("Error migrating database:", error);
    });
}

type InsertCategory = typeof schema.categories.$inferInsert;
type InsertItem = typeof schema.items.$inferInsert;

export type InsertCategoryWithItems = InsertCategory & {
  items: InsertItem[];
};

export async function seedData(data: InsertCategoryWithItems[]) {
  console.log({ data });
  await db.run("PRAGMA foreign_keys = OFF;");
  await db.insert(schema.categories).values(data);
  await db
    .insert(schema.items)
    .values(
      data.flatMap(({ code, items }) =>
        items.map((item) => ({ ...item, categoryCode: code }))
      )
    );
  await db.run("VACUUM;");
  await db.run("PRAGMA foreign_keys = ON;");
}
