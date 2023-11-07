import { getRedirect } from "$data/utils.js"
import { error, redirect } from "@sveltejs/kit"

export function load({ params }) {
	const shortUrl = params.shorturl
	const selected = getRedirect(shortUrl)

	if (!selected || !selected.longUrl) {
		throw error(404, {
			message: `Redirect with url "${shortUrl}" not found.`
		})
	}

	throw redirect(301, selected.longUrl)
}
