import { ADMIN_PASSWORD } from "$env/static/private"
import type { Actions } from "@sveltejs/kit"
import type { shortUrl } from "$lib/types.js"
import { insertUrl, allowedCharacters, getAdminUrls } from "$data/utils.js"

export async function load({ cookies }) {
	const loginCookie = cookies.get("authenticated")
	const loggedIn = loginCookie ? true : false

	let urls: shortUrl[] = []
	let selectError: boolean = false
	if (loggedIn) {
		// ok! we're logged in, let's get the existing urls
		try {
			urls = getAdminUrls()
		} catch (error) {
			console.error(error)
			selectError = true
		}
	}

	return {
		authenticated: loggedIn,
		urls: urls,
		selectError: selectError
	}
}

export const actions = {
	login: async ({ cookies, request }) => {
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
	},

	logout: async ({ cookies }) => {
		const loginCookie = cookies.get("authenticated")

		// just remove the cookie
		if (loginCookie) {
			cookies.delete("authenticated", {
				path: "/admin"
			})
		}

		return { logout: true }
	},

	create: async ({ cookies, request }) => {
		if (!cookies.get("authenticated")) {
			return { unauthorized: true }
		}

		// ok, we're logged in, let's go
		const formData = await request.formData()

		let shortUrl = formData.get("short-url")
		const longUrl = formData.get("long-url")
		const isPublic = formData.get("is-public")

		// check if we're not using some really weird characters here
		if (!allowedCharacters.test(shortUrl as string)) {
			return { invalidUrl: true, longUrl, isPublic }
		}

		// okay, let's go
		try {
			const inserted = await insertUrl(shortUrl as string, longUrl as string, isPublic as unknown as boolean)
			return {
				inserted: inserted
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
} satisfies Actions
