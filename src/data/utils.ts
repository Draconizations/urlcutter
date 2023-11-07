import db from "$data"
import { url as urlTable, longUrl as longUrlTable, url } from "$data/schema"
import { eq, desc, sql } from "drizzle-orm"
import type { shortUrl } from "$lib/types"
import { itemsPerPage } from "$lib/utils"

export const randomCharacters = "abcdefghijklmnopqrstuvwxyz"
export const allowedCharacters = /^[A-Za-z0-9@_-]+$/
export const forbiddenWords = ["admin", "what", "history"]

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

export function getAdminUrls(page: number): shortUrl[] {
	const ipp = itemsPerPage()
	return db()
		.select()
		.from(urlTable)
		.orderBy(desc(urlTable.created))
		.limit(ipp + 1)
		.offset((page - 1) * ipp)
		.all()
}

export function getPublicUrls(page: number): shortUrl[] {
	const ipp = itemsPerPage()

	return db()
		.select()
		.from(urlTable)
		.orderBy(desc(urlTable.created))
		.limit(ipp + 1)
		.offset((page - 1) * ipp)
		.where(eq(urlTable.isPublic, true))
		.all()
}

export function getRedirect(url: string, tag?: string) {
	const subQuery = db()
		.select({
			shortUrlId: longUrlTable.shortUrlId,
			longUrl: longUrlTable.longUrl
		})
		.from(longUrlTable)
		.orderBy(desc(longUrlTable.created))
		.limit(1)
		.as("long_url")
	const selected = db()
		.select({
			shortUrl: urlTable.shortUrl,
			longUrl: subQuery.longUrl
		})
		.from(urlTable)
		.where(eq(urlTable.shortUrl, url))
		.leftJoin(subQuery, eq(urlTable.id, subQuery.shortUrlId))
		.get()
	return selected
}

interface insertReturn {
	versionTag: string
	longUrl: string
	existingUrl: boolean
	shortUrl: string
	isPublic: boolean
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
				longUrl: longUrlTable.longUrl
			})

		return {
			versionTag: inserted[0].versionTag,
			longUrl: inserted[0].longUrl,
			existingUrl: true,
			shortUrl: existingUrl.shortUrl,
			isPublic: existingUrl.isPublic
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
			versionTag: insertedLong[0].versionTag
		}
	}
}
