import { getPublicUrls } from "$data/utils.js"
import type { shortUrl } from "$lib/types.js"

export async function load() {
	const page = 1

	let urls: shortUrl[] = []
	let selectError: boolean = false

	// no need to be logged in here since this is the public page!
	try {
		urls = getPublicUrls(page)
	} catch (error) {
		console.error(error)
		selectError = true
	}

	return {
		urls: urls,
		selectError: selectError,
		page: page
	}
}