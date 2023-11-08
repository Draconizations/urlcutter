<script lang="ts">
	import { itemsPerPage, pageOffset } from "$lib/utils"

	export let page: number
	export let pageLength: number
	export let path: string

	const ipp = itemsPerPage()
	const po = pageOffset()

	// the same as the offset in the db
	// but with an extra check to see if we aren't going into the negatives
	// since our db query doesn't do that either
	$: absolute = (page - 1) * ipp - ipp * po
	$: offset = getOffset(absolute)
	const getOffset = (absolute: number) => {
		if (absolute > 0) return absolute
		else return 0
	}

	// so what we need to do is to check if the actual last item in the list
	// comes after the first item on that page
	// if it does, then we can show the page!
	function hasMoreItems(page: number, shift: number, pgLength: number) {
		const potential = (page + shift) * ipp
		const actual = offset + pgLength
		return actual > potential
	}

	// jesus christ this was a headache
	// I hope I never have to do that again
</script>

<div class="row-wrap" style="margin: 0.5rem 0; width: 100%; justify-content: center;">
	{#each Array.from(Array(po).keys()).reverse() as shift}
		{#if (page - shift - 1) * ipp > 0}
			<a class="button inactive" href={`${path}/${page - shift - 1}`}>{page - shift - 1}</a>
		{/if}
	{/each}
	<button tabindex="-1">{page}</button>
	{#each Array.from(Array(po).keys()) as shift}
		{#if hasMoreItems(page, shift, pageLength)}
			<a class="button inactive" href={`${path}/${page + shift + 1}`}>
				{page + shift + 1}
			</a>
		{/if}
	{/each}
</div>
