import { relations } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  password: text("password").notNull(),
});

export const categories = sqliteTable("categories", {
  code: text("code").primaryKey(),
  name: text("name").notNull(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  items: many(items),
}));

export const items = sqliteTable("items", {
  code: text("code").primaryKey(),
  description: text("description").notNull(),
  unit: text("unit").notNull(),
  categoryCode: text("category_code")
    .notNull()
    .references(() => categories.code, { onDelete: "cascade" }),
});

export const itemsRelations = relations(items, ({ one }) => ({
  category: one(categories, {
    fields: [items.categoryCode],
    references: [categories.code],
  }),
}));
