<script lang="ts">
	import { itemsPerPage } from "$lib/utils"

	export let page: number
	export let pageLength: number
	export let path: string

	const ipp = itemsPerPage()
</script>

<p>
	{#if page > 1}
		<a class="button" href={`${path}/${page - 1}`}>
			{page - 1}
		</a>
	{/if}
	<button tabindex="-1" class="inactive">{page}</button>
	{#if pageLength > ipp}
		<a class="button" href={`${path}/${page + 1}`}>{page + 1}</a>
	{/if}
</p>
