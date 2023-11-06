import { drizzle } from "drizzle-orm/better-sqlite3"
import Sqlite3 from "better-sqlite3"
import { migrate } from "drizzle-orm/better-sqlite3/migrator"
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3"

let db: BetterSQLite3Database

export default function () {
	if (!db) {
		const sqlite = new Sqlite3("urlcutter.db")
		db = drizzle(sqlite)

		migrate(db, { migrationsFolder: "migrations" })
	}

	return db
}
