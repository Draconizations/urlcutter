import { getPublicUrls } from "$data/utils.js"
import type { ShortUrl } from "$lib/types.js"
import { redirect } from "@sveltejs/kit"

export async function load() {
	const page = 1

	let urls: ShortUrl[] = []
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
