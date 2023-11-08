import { getRedirect } from "$data/utils.js"
import { error, redirect } from "@sveltejs/kit"

export function GET({ params }) {
	const shortUrl = params.shorturl
	const selected = getRedirect(shortUrl)

	if (!selected) {
		throw error(404, {
			message: `Redirect with url "${shortUrl}" not found.`
		})
	}

	throw redirect(302, selected.longUrl)
}
