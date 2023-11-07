<script lang="ts">
	import Pagination from "$components/Pagination.svelte"
	import ShortUrlEntry from "$components/ShortUrlEntry.svelte"
	import { PUBLIC_GIT_URL } from "$env/static/public"
	import { itemsPerPage } from "$lib/utils.js"

	export let data

	const ipp = itemsPerPage()
	const urls = data.urls.slice(0, ipp)
	const version = "__COMMIT_HASH__"
</script>

<section class="section-center" style="gap: 1rem;">
	<section class="col" style="width: 100%;">
		<h2>Public links</h2>
		<Pagination page={data.page} pageLength={data.urls.length} />
		{#if urls.length > 0}
			<ol class="flex-list text-left">
				{#each urls as url}
					<ShortUrlEntry {url} />
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
	<div class="row" style="width: 100%; justify-content: space-between">
		<span>
			Commit <a
				href={`${
					PUBLIC_GIT_URL ? PUBLIC_GIT_URL : "https://github.com/Draconizations/urlcutter"
				}/commit/${version}`}>{version}</a
			>
		</span>
		<a class="button" href="/what">What is this?</a>
	</div>
</section>

<svelte:head>
	<title>URLCutter | Home</title>
</svelte:head>
