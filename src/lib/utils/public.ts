import { getPublicUrls } from "$data/utils"
import type { ShortUrl } from "$lib/types"
import { redirect } from "@sveltejs/kit"

export function loadPublic(params?: { page?: string }) {
	let page = 1
	if (params?.page) {
		page = parseInt(params.page)
	}

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
