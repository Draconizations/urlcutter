<script lang="ts">
	import Pagination from "$components/Pagination.svelte"
	import ShortUrlEntry from "$components/ShortUrlEntry.svelte"

	export let data
</script>

<section class="section-center" style="gap: 1rem;">
	<section class="col" style="width: 100%;">
		<h2>Public links</h2>
		<Pagination page={data.page} pageLength={data.urls.length} />
		{#if data.urls.length > 0}
			<ol class="flex-list text-left">
				{#each data.urls as url}
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
	<div style="display: inline-block; margin-left: auto; marin">
		<a class="button" href="/what">What is this?</a>
	</div>
</section>
