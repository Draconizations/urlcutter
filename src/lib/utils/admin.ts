import { redirect, type Cookies, error } from "@sveltejs/kit"
import { ADMIN_PASSWORD } from "$env/static/private"
import {
	insertUrl,
	allowedCharacters,
	forbiddenWords,
	getAdminUrls,
	deleteLongUrl,
	deleteShortUrl,
	editShortUrl
} from "$data/utils.js"
import type { ShortUrl } from "$lib/types"

export async function login(cookies: Cookies, request: Request) {
	const formData = await request.formData()
	const password = formData.get("password")

	// this shouldn't really happen. but eh
	if (!password) {
		return { missing: true }
	}

	if (password !== ADMIN_PASSWORD) {
		return { incorrect: true }
	}

	// if we reach this point the password matched
	// set the login cookie and redirect back to the page
	cookies.set("authenticated", "I have a permit", {
		path: "/admin",
		maxAge: 3 * 60 * 60 * 24 // 3 days
	})

	return { login: true }
}

export function logout(cookies: Cookies) {
	const loginCookie = cookies.get("authenticated")

	// just remove the cookie
	if (loginCookie) {
		cookies.delete("authenticated", {
			path: "/admin"
		})
	}

	return { logout: true }
}

export async function create(cookies: Cookies, request: Request) {
	if (!cookies.get("authenticated")) {
		throw error(403)
	}

	// ok, we're logged in, let's go
	const formData = await request.formData()

	let shortUrl = formData.get("short-url")
	const longUrl = formData.get("long-url")
	const isPublic = formData.get("is-public")

	// check if we're not using some really weird characters here
	if (shortUrl && !allowedCharacters.test(shortUrl as string)) {
		return { invalidUrl: true, longUrl, isPublic }
	}

	// also check if we're not using some really silly words here
	if (shortUrl && forbiddenWords.some((w) => (shortUrl as string).toLowerCase() === w)) {
		return { forbiddenUrl: shortUrl, longUrl, isPublic }
	}

	// and finally: we need to make sure the page can't be confused for a list page
	if (shortUrl && /^\d+$/.test(shortUrl as string)) {
		return { onlyNumbers: shortUrl, longUrl, isPublic }
	}

	// okay, let's go
	try {
		const inserted = await insertUrl(shortUrl as string, longUrl as string, isPublic as unknown as boolean)
		return {
			inserted: inserted,
			insertSuccess: true
		}
	} catch (error) {
		console.error(error)
		return {
			insertError: true,
			longUrl,
			shortUrl,
			isPublic
		}
	}
}

export async function deleteLong(cookies: Cookies, request: Request) {
	if (!cookies.get("authenticated")) throw error(403)

	const formData = await request.formData()
	let shortUrl = formData.get("short-url")
	let versionTag = formData.get("version-tag")

	try {
		const deleted = deleteLongUrl(shortUrl as string, versionTag as string)
		return {
			deleted: deleted?.deletedVersion,
			deleteLongSuccess: true
		}
	} catch (error) {
		console.error(error)
		return {
			deleteLongError: true
		}
	}
}

export async function editShort(cookies: Cookies, request: Request) {
	if (!cookies.get("authenticated")) throw error(403)

	const formData = await request.formData()
	const currentShortUrl = formData.get("current-short-url")
	let newShortUrl = formData.get("new-short-url")
	const isPublic = formData.get("is-public")

	if (!newShortUrl) newShortUrl = currentShortUrl

	// check if we're not using some really weird characters here
	if (newShortUrl && !allowedCharacters.test(newShortUrl as string)) {
		return { invalidUrl: true, newShortUrl, shortUrl: currentShortUrl, isPublic }
	}

	// also check if we're not using some really silly words here
	if (newShortUrl && forbiddenWords.some((w) => (newShortUrl as string).toLowerCase() === w)) {
		return { forbiddenUrl: newShortUrl, shortUrl: currentShortUrl, isPublic }
	}

	// and finally: we need to make sure the page can't be confused for a list page
	if (newShortUrl && /^\d+$/.test(newShortUrl as string)) {
		return { onlyNumbers: newShortUrl, shortUrl: currentShortUrl, isPublic }
	}

	let edited: Record<string, any>
	try {
		edited = editShortUrl(currentShortUrl as string, {
			newShortUrl: newShortUrl as string,
			isPublic: isPublic as unknown as boolean
		})
	} catch (error) {
		console.error(error)
		return {
			editShortFailure: true,
			shortUrl: currentShortUrl as string,
			isPublic
		}
	}

	if (!edited) {
		return {
			editShortFailure: true,
			shortUrl: currentShortUrl as string,
			isPublic
		}
	}

	if (newShortUrl !== currentShortUrl)
		throw redirect(302, `/admin/${edited.newShortUrl}?msg=shortEdited&prev=${edited.prevShortUrl}`)
	else
		return {
			editShortSuccess: true,
			shortUrl: edited.newShortUrl as string,
			isPublic
		}
}

export async function deleteShort(cookies: Cookies, request: Request) {
	if (!cookies.get("authenticated")) throw error(403)

	const formData = await request.formData()
	let shortUrl = formData.get("short-url")

	let deleted: Record<string, any>
	try {
		deleted = deleteShortUrl(shortUrl as string)
	} catch (error) {
		console.error(error)
		return {
			deleteShortFailure: true
		}
	}

	if (deleted) throw redirect(302, `/admin?msg=shortDeleted&del=${deleted.shortUrl.shortUrl}`)
	else
		return {
			deleteShortFailure: true
		}
}

export async function loadAdmin(
	cookies: Cookies,
	params: {
		page?: string
	},
	url: URL
) {
	const loginCookie = cookies.get("authenticated")
	const loggedIn = loginCookie ? true : false

	const page = parseInt(params.page || "1")

	let urls: ShortUrl[] = []
	let selectError: boolean = false
	if (loggedIn) {
		// ok! we're logged in, let's get the existing urls
		try {
			urls = getAdminUrls(page)
		} catch (error) {
			console.error(error)
			selectError = true
			return {
				authenticated: loggedIn,
				urls: urls,
				selectError: selectError,
				page: page
			}
		}
	}

	// I cannot be bothered to properly check if this page exists lol
	if (urls.length < 1 && page !== 1) {
		throw redirect(302, "/admin")
	}

	let deletedUrl: string | null = null
	if (url.searchParams.get("msg") === "shortDeleted") {
		deletedUrl = url.searchParams.get("del")
	}

	return {
		authenticated: loggedIn,
		urls: urls,
		selectError: selectError,
		page: page,
		deletedUrl: deletedUrl
	}
}
