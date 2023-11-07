import { getPublicUrls } from "$data/utils.js"
import type { shortUrl } from "$lib/types.js"
import { redirect } from "@sveltejs/kit"

export async function load({ cookies, params }) {
	const pageStr = params.page
	let page = 1
	if (pageStr) {
		page = parseInt(pageStr)
	}

	let urls: shortUrl[] = []
	let selectError: boolean = false

	// no need to be logged in here since this is the public page!
	try {
		urls = getPublicUrls(page)
	} catch (error) {
		console.error(error)
		selectError = true
		return {
			urls: urls,
			selectError: selectError,
			page: page
		}
	}

	if (urls.length < 1 && page !== 1) {
		throw redirect(302, "/")
	}

	return {
		urls: urls,
		selectError: selectError,
		page: page
	}
}
