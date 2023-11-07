import db from "$data"
import { url as urlTable, longUrl as longUrlTable } from "$data/schema"
import { eq, desc, sql } from "drizzle-orm"
import type { shortUrl } from "$lib/types"

export const randomCharacters = "abcdefghijklmnopqrstuvwxyz"
export const allowedCharacters = /^[A-Za-z0-9@_-]+$/

export function generateUrl(length: number) {
	let result = ""
	const charactersLength = randomCharacters.length
	let counter = 0
	while (counter < length) {
		result += randomCharacters.charAt(Math.floor(Math.random() * charactersLength))
		counter += 1
	}
	return result
}

export function getAdminUrls(): shortUrl[] {
	// turns out we don't need this inner join
	// but I'm keeping the query as a comment just in case
	// const subQuery = db().select().from(longUrlTable).limit(1).orderBy(desc(longUrlTable.created)).as("long_url")
	const selected = db().select().from(urlTable).all() // .leftJoin(subQuery, eq(urlTable.id, longUrlTable.shortUrlId)).all()
	console.log(selected[0].created)
	return selected
}

interface insertReturn {
	versionTag: string
	longUrl: string
	longId: number
	existingUrl: boolean
	shortUrl: string
	isPublic: boolean
	shortId: number
}

export async function insertUrl(shortUrl: string | null, longUrl: string, isPublic: boolean): Promise<insertReturn> {
	if (!shortUrl) shortUrl = generateUrl(6)

	// first check if the url already exists
	const existingUrl = db()
		.select()
		.from(urlTable)
		.where(eq(urlTable.shortUrl, shortUrl))
		.orderBy(desc(urlTable.created))
		.get()

	if (existingUrl) {
		// congrats! we need to make a new version of this url
		const inserted = await db()
			.insert(longUrlTable)
			.values({
				shortUrlId: existingUrl.id,
				versionTag: generateUrl(5),
				longUrl: longUrl,
				created: sql`strftime ('%s', 'now')`
			})
			.returning({
				versionTag: longUrlTable.versionTag,
				longUrl: longUrlTable.longUrl,
				longId: longUrlTable.id
			})

		return {
			versionTag: inserted[0].versionTag,
			longUrl: inserted[0].longUrl,
			longId: inserted[0].longId,
			existingUrl: true,
			shortUrl: existingUrl.shortUrl,
			isPublic: existingUrl.isPublic,
			shortId: existingUrl.id
		}
	} else {
		// okay, new url got. Let's insert that instead
		const insertedShort = await db()
			.insert(urlTable)
			.values({
				isPublic: isPublic ? true : false,
				shortUrl: shortUrl,
				created: sql`strftime ('%s', 'now')`
			})
			.returning({
				shortId: urlTable.id,
				isPublic: urlTable.isPublic,
				shortUrl: urlTable.shortUrl
			})

		const insertedLong = await db()
			.insert(longUrlTable)
			.values({
				shortUrlId: insertedShort[0].shortId,
				versionTag: generateUrl(5),
				longUrl: longUrl,
				created: sql`strftime ('%s', 'now')`
			})
			.returning({
				versionTag: longUrlTable.versionTag,
				longUrl: longUrlTable.longUrl,
				longId: longUrlTable.id
			})

		return {
			existingUrl: false,
			isPublic: insertedShort[0].isPublic,
			shortUrl: insertedShort[0].shortUrl,
			longUrl: insertedLong[0].longUrl,
			shortId: insertedShort[0].shortId,
			longId: insertedLong[0].longId,
			versionTag: insertedLong[0].versionTag
		}
	}
}
