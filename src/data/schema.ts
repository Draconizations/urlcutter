import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"
import { sql } from "drizzle-orm"

export const url = sqliteTable("short_url", {
	id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
	created: integer("created", { mode: "timestamp" }).notNull(),
	isPublic: integer("is_public", { mode: "boolean" }).notNull(),
	shortUrl: text("short_url").notNull()
})

export const longUrl = sqliteTable("long_url", {
	id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
	shortUrlId: integer("short_url_id").references(() => url.id),
	created: integer("created", { mode: "timestamp" }).notNull(),
	versionTag: text("version_tag").notNull(),
	longUrl: text("long_url").notNull()
})
