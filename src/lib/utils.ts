import { env as penv } from "$env/dynamic/public"

export const itemsPerPage = () => {
	const envItems = penv.PUBLIC_ITEMS_PER_PAGE || "15"
	let itemsPerPage = parseInt(envItems)
	if (isNaN(itemsPerPage)) itemsPerPage = 15
	return itemsPerPage
}
