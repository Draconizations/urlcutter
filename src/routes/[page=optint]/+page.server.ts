import { loadPublic } from "$lib/utils/public.js"

export async function load({ params }) {
	return loadPublic(params)
}
