import { pgTable, text, timestamp, integer } from "drizzle-orm/pg-core"

export const summaries = pgTable("summaries", {
    id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "summaries_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
    url: text().notNull(),
    createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
});
