import { env as penv } from "$env/dynamic/public"

export const itemsPerPage = () => {
	const envItems = penv.PUBLIC_ITEMS_PER_PAGE || "15"
	let itemsPerPage = parseInt(envItems)
	if (isNaN(itemsPerPage)) itemsPerPage = 15
	return itemsPerPage
}

export const pageOffset = () => {
	const envPages = penv.PUBLIC_PAGE_FETCH_OFFSET || "3"
	let pageAmount = parseInt(envPages)
	if (isNaN(pageAmount)) pageAmount = 3
	return pageAmount
}

export const getFirstIndex = (page: number) => {
	const ipp = itemsPerPage()
	const po = pageOffset()
	const start = (page - 1) * ipp
	const offset = ipp * po
	return start <= offset ? start : offset
}
