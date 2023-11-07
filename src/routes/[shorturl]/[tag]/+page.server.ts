import { getRedirect } from "$data/utils.js"
import { error, redirect } from "@sveltejs/kit"

export function load({ params }) {
	const shortUrl = params.shorturl

	const selected = getRedirect(shortUrl, params.tag)

	if (!selected) {
		throw error(404, {
			message: `Redirect with url "${shortUrl}" and tag "${params.tag}" not found.`
		})
	}

	throw redirect(302, selected.longUrl)
}
