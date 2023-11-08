<script lang="ts">
	import { enhance } from "$app/forms"
	import LongUrlEntry from "$components/LongUrlEntry.svelte"
	import Pagination from "$components/Pagination.svelte"
	import { itemsPerPage, getFirstIndex } from "$lib/utils.js"
	import { page } from "$app/stores"
	import type { ActionData, PageData } from "./$types"

	export let data: PageData
	export let form: ActionData

	const ipp = itemsPerPage()
	$: first = getFirstIndex(data.page)

	$: longUrls = data.url.longUrls.slice(first, first + ipp)
</script>

<section class="section-center" style="gap: 1rem;">
	<form style="display: inline-block; margin-left: auto;" action="?/logout" method="post" use:enhance>
		<a href="/admin" class="button">Admin Panel</a>
		<input type="submit" class="bg-failure" value="Logout" />
	</form>

	<section>
		<h1 style="font-size: 1.75rem;">
			{$page.url.hostname}/<a href={`/${data.url.shortUrl?.shortUrl}`}>{data.url.shortUrl?.shortUrl}</a>
		</h1>
		<span>
			{#if data.url.shortUrl?.isPublic}
				<b>public link</b>
			{:else}
				private link
			{/if}
			✦ created {data.url.shortUrl?.created
				.toLocaleString("en-US", {
					day: "2-digit",
					month: "short",
					hour: "2-digit",
					hourCycle: "h24",
					minute: "2-digit"
				})
				.toLowerCase()}
		</span>
	</section>

	<section class="block text-left" style="width: 100%;">
		<form class="col" style="width: 100%;" action="?/newUrl" method="post" use:enhance>
			<h2>Edit short link</h2>
			<section class="col" style="margin-bottom: 1rem;">
				<label for="new-short-input">Change short link</label>
				<div class="row">
					<input
						style="flex: 1;"
						type="url"
						id="new-short-input"
						name="new-short-url"
						required
						value={data.url.shortUrl?.shortUrl}
					/>
					<input type="submit" value="Submit!" />
				</div>
			</section>
		</form>
		<details>
			<summary>
				Danger Zone
				<hr />
			</summary>
			<form class="text-left" action="?/deleteShortUrl" method="post" use:enhance>
				<input style="margin-right: 0.5rem" type="submit" class="bg-failure" value="Delete Url" />
				⚠️ This is irreversible and does NOT ask for a confirmation!
			</form>
		</details>
	</section>
	<section class="col" style="width: 100%;">
		<h2>Version history</h2>
		{#if form?.deleteLongError}
			<span class="text-failure">Error deleting long url version.</span>
		{/if}
		{#if form?.deleteLongSuccess}
			<span class="text-success">Successfully deleted long url version!</span>
		{/if}
		{#if data.url?.longUrls}
			<Pagination
				page={data.page}
				pageLength={data.url?.longUrls.length}
				path={`/admin/${data.url.shortUrl?.shortUrl}`}
			/>
			<ol class="flex-list text-left">
				{#each longUrls as longUrl}
					<LongUrlEntry {longUrl} shortUrl={data.url.shortUrl?.shortUrl || "ok"} env="admin" />
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
