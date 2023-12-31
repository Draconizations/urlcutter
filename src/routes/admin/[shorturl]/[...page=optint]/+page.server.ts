import { getUrlHistory } from "$data/utils.js"
import type { UrlHistory } from "$lib/types"
import { deleteLong, deleteShort, editShort } from "$lib/utils/admin"
import { error, redirect } from "@sveltejs/kit"
import type { Actions } from "@sveltejs/kit"

export async function load({ cookies, params, url }) {
	const loginCookie = cookies.get("authenticated")
	const loggedIn = loginCookie ? true : false

	// redirect to the admin page if we're not logged in
	if (!loggedIn) throw redirect(302, "/admin")

	const pageStr = params.page
	let page = 1
	if (pageStr) {
		page = parseInt(pageStr)
	}

	let urlHistory: UrlHistory = {
		longUrls: []
	}

	let selectError: boolean = false
	try {
		urlHistory = getUrlHistory(params.shorturl, page)
	} catch (error) {
		console.error(error)
		selectError = true
		return {
			url: urlHistory,
			selectError: selectError,
			page: page
		}
	}

	// throw a 404 if the shorturl doesn't exist
	if (!urlHistory.shortUrl) {
		throw error(404, `Short url "${params.shorturl}" not found.`)
	}

	// if we're not on page 1 and there are history items, redirect back to the default page
	// NOTE: we don't want to redirect page 1 to a 404 if there are no items at all
	// since it's possible to delete all history items
	if (urlHistory.longUrls.length < 1 && page !== 1) {
		throw redirect(302, `/admin/${params.shorturl}`)
	}

	let editedUrl: string | null = null
	if (url.searchParams.get("msg") === "shortEdited") {
		editedUrl = url.searchParams.get("prev")
	}

	return {
		url: urlHistory,
		selectError: selectError,
		page: page,
		editedUrl: editedUrl
	}
}

export const actions = {
	deleteLongUrl: async ({ cookies, request }) => {
		return await deleteLong(cookies, request)
	},

	deleteShortUrl: async ({ cookies, request }) => {
		return await deleteShort(cookies, request)
	},

	editShortUrl: async ({ cookies, request }) => {
		return await editShort(cookies, request)
	}
} satisfies Actions
