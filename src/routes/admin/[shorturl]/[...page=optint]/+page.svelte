<script lang="ts">
	import { enhance } from "$app/forms"
	import LongUrlEntry from "$components/LongUrlEntry.svelte"
	import Pagination from "$components/Pagination.svelte"
	import { itemsPerPage } from "$lib/utils.js"

	export let data

	const ipp = itemsPerPage()
	const longUrls = data.url?.longUrls.slice(0, ipp) ?? []
</script>

<section class="section-center" style="gap: 1rem;">
	<form style="display: inline-block; margin-left: auto;" action="?/logout" method="post" use:enhance>
		<a href="/admin" class="button">Admin Panel</a>
		<input type="submit" class="bg-failure" value="Logout" />
	</form>

	<form class="block col text-left" style="width: 100%;" action="?/create" method="post" use:enhance>
		<h2>Edit short link</h2>
	</form>
	<section class="col" style="width: 100%;">
		<h2>Version history</h2>
		{#if data.url?.longUrls}
			<Pagination page={data.page} pageLength={data.url?.longUrls.length} env="admin" />
			<ol class="flex-list text-left">
				{#each longUrls as longUrl}
					<LongUrlEntry {longUrl} env="admin" />
				{/each}
			</ol>
		{:else if data.selectError}
			<p class="text-failure">Error fetching urls.</p>
		{:else}
			<section class="block">
				<span>No urls on this page!</span>
			</section>
		{/if}
	</section>
</section>
