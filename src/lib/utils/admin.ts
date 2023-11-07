import { redirect, type Cookies } from "@sveltejs/kit"
import { ADMIN_PASSWORD } from "$env/static/private"
import { insertUrl, allowedCharacters, forbiddenWords, getAdminUrls } from "$data/utils.js"
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
		maxAge: 1 * 60 * 60 * 24 // 24 hours
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
		return { unauthorized: true }
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

export async function loadAdmin(
	cookies: Cookies,
	params: {
		page?: string
	}
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

	if (urls.length < 1 && page !== 1) {
		throw redirect(302, "/admin")
	}

	return {
		authenticated: loggedIn,
		urls: urls,
		selectError: selectError,
		page: page
	}
}
