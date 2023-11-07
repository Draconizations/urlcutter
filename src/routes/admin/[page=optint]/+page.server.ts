import { create, loadAdmin, login, logout } from "$lib/utils/admin.js"
import type { Actions } from "@sveltejs/kit"

export async function load({ cookies, params }) {
	return await loadAdmin(cookies, params)
}

export const actions = {
	login: async ({ cookies, request }) => {
		return await login(cookies, request)
	},

	logout: ({ cookies }) => {
		return logout(cookies)
	},

	create: async ({ cookies, request }) => {
		return await create(cookies, request)
	}
} satisfies Actions
