import { sqliteTable, text, integer, check } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const subscribers = sqliteTable("subscribers", {
    id: integer("id").primaryKey(),
    email: text("email").notNull().unique(),
    createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .default(new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" })
        .notNull()
        .default(new Date()),
    trafficSource: text("traffic_source"),
    device: text("device"),
    emailVerified: integer("email_verified", { mode: "timestamp" }),
    unsubscribed: integer("unsubscribed", { mode: "timestamp" }),
    confirmationToken: text("confirmation_token"),
}, (table) => [
    check('email', sql`${table.email} LIKE '%@%.%'`)
]);

export const todos = sqliteTable("todos", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    title: text("title").notNull(),
    description: text("description"),
    completed: integer("completed", { mode: "boolean" }).notNull().default(false),
    pinned: integer("pinned", { mode: "boolean" }).notNull().default(false),
    order: integer("order").notNull().default(0),
    createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .default(new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" })
        .notNull()
        .default(new Date()),
});

export type NewSubscriber = typeof subscribers.$inferInsert
export type NewTodo = typeof todos.$inferInsert
export type Todo = typeof todos.$inferSelect