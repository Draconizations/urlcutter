import db from "$data"
import { url as urlTable, longUrl as longUrlTable, longUrl } from "$data/schema"
import { eq, desc, sql, and } from "drizzle-orm"
import type { UrlHistory, ShortUrl } from "$lib/types"
import { itemsPerPage, pageOffset } from "$lib/utils"

export const randomCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVW0123456789"
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

export function getAdminUrls(page: number): ShortUrl[] {
	const ipp = itemsPerPage()
	const po = pageOffset()

	return db()
		.select({
			created: urlTable.created,
			isPublic: urlTable.isPublic,
			shortUrl: urlTable.shortUrl,
			description: urlTable.description
		})
		.from(urlTable)
		.orderBy(desc(urlTable.created))
		.limit(ipp + po * 2 * ipp) // one page + 2x the amount of offset pages we want
		.offset((page - 1) * ipp - ipp * po) // current page - 1x the amount of offset pages we want
		.all()
}

export function getPublicUrls(page: number): ShortUrl[] {
	const ipp = itemsPerPage()
	const po = pageOffset()

	return db()
		.select({
			created: urlTable.created,
			isPublic: urlTable.isPublic,
			shortUrl: urlTable.shortUrl,
			description: urlTable.description
		})
		.from(urlTable)
		.orderBy(desc(urlTable.created))
		.limit(ipp + po * 2 * ipp) // one page + 2x the amount of offset pages we want
		.offset((page - 1) * ipp - ipp * po) // current page - 1x the amount of offset pages we want
		.where(eq(urlTable.isPublic, true))
		.all()
}

export function getRedirect(url: string, tag?: string) {
	const selected = db()
		.select({
			shortUrl: urlTable.shortUrl,
			longUrl: longUrlTable.longUrl
		})
		.from(urlTable)
		.where(eq(urlTable.shortUrl, url))
		.orderBy(desc(longUrlTable.created))
		.innerJoin(longUrlTable, eq(urlTable.id, longUrlTable.shortUrlId))
	if (tag) {
		return selected.where(eq(longUrlTable.versionTag, tag)).get()
	} else return selected.get()
}

export function getUrlHistory(url: string, page: number): UrlHistory {
	const ipp = itemsPerPage()

	const short = db()
		.select({
			shortUrl: urlTable.shortUrl,
			isPublic: urlTable.isPublic,
			created: urlTable.created,
			description: urlTable.description
		})
		.from(urlTable)
		.where(eq(urlTable.shortUrl, url))
		.get()

	const long = db()
		.select({
			longUrl: longUrlTable.longUrl,
			created: longUrlTable.created,
			versionTag: longUrlTable.versionTag
		})
		.from(urlTable)
		.where(eq(urlTable.shortUrl, url))
		.innerJoin(longUrlTable, eq(urlTable.id, longUrlTable.shortUrlId))
		.orderBy(desc(longUrlTable.created))
		.limit(ipp + 1)
		.offset((page - 1) * ipp)
		.all()

	return {
		shortUrl: short,
		longUrls: long
	}
}

interface insertReturn {
	versionTag: string
	longUrl: string
	existingUrl: boolean
	shortUrl: string
	isPublic: boolean
}

export async function insertUrl(shortUrl: string | null, longUrl: string, isPublic: boolean): Promise<insertReturn> {
	if (!shortUrl) shortUrl = generateUrl(5)

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

export function deleteLongUrl(shortUrl: string, versionTag: string) {
	const shortSelected = db()
		.select({
			shortId: urlTable.id
		})
		.from(urlTable)
		.where(eq(urlTable.shortUrl, shortUrl))
		.get()

	if (!shortSelected) throw Error(`No short url "${shortUrl} found."`)
	const shortId = shortSelected.shortId

	const deleted = db()
		.delete(longUrlTable)
		.where(and(eq(longUrlTable.shortUrlId, shortId), eq(longUrlTable.versionTag, versionTag)))
		.returning({
			deletedVersion: longUrlTable.versionTag
		})
		.get()

	return deleted
}

export function deleteShortUrl(shortUrl: string) {
	const shortSelected = db()
		.select({
			shortId: urlTable.id
		})
		.from(urlTable)
		.where(eq(urlTable.shortUrl, shortUrl))
		.get()

	if (!shortSelected) throw Error(`No short url "${shortUrl} found."`)
	const shortId = shortSelected.shortId

	const deleted = db().transaction((tx) => {
		const long = tx
			.delete(longUrlTable)
			.where(eq(longUrl.shortUrlId, shortId))
			.returning({
				versionTag: longUrlTable.versionTag
			})
			.all()

		const short = tx
			.delete(urlTable)
			.where(eq(urlTable.id, shortId))
			.returning({
				shortUrl: urlTable.shortUrl
			})
			.get()

		return {
			longUrls: long,
			shortUrl: short
		}
	})

	return deleted
}

export function editShortUrl(
	shortUrl: string,
	data: {
		newShortUrl: string
		isPublic: boolean,
		description: string|null
	}
) {
	const edited = db()
		.update(urlTable)
		.set({
			shortUrl: data.newShortUrl,
			isPublic: data.isPublic ? true : false,
			description: data.description
		})
		.where(eq(urlTable.shortUrl, shortUrl))
		.returning({
			newShortUrl: urlTable.shortUrl
		})
		.get()

	return {
		...edited,
		...{
			prevShortUrl: shortUrl
		}
	}
}
