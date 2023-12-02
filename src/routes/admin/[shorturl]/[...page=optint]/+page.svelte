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
		{#if form?.editShortSuccess}
			<span class="text-success">Successfully edited "{data.url.shortUrl?.shortUrl}"!</span>
		{:else if data.editedUrl}
			<span class="text-success">Successfully renamed "{data.editedUrl}" to "{data.url.shortUrl?.shortUrl}"!</span
			>
		{/if}
		{#if form?.editShortFailure}
			<span class="text-failure">Failed to edit short url.</span>
		{/if}
		<h1 style="font-size: 1.5rem;">
			{$page.url.host}/<a href={`/${data.url.shortUrl?.shortUrl}`}>{data.url.shortUrl?.shortUrl}</a>
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
		<form class="col" style="width: 100%;" action="?/editShortUrl" method="post" use:enhance>
			<h2>Edit short link</h2>
			<section class="col" style="margin-bottom: 0.5rem;">
				<label for="new-short-input">Change short link</label>
				<div class="row">
					<input type="hidden" name="current-short-url" value={data.url.shortUrl?.shortUrl} />
					<input
						style="flex: 1;"
						type="text"
						id="new-short-input"
						name="new-short-url"
						required
						value={form?.shortUrl || data.url.shortUrl?.shortUrl}
					/>
					<input type="submit" value="Submit!" />
				</div>
				<div class="text-left">
					{#if form?.invalidUrl}
						<p class="text-failure">Invalid url. Allowed characters: A-z, 0-9, - _ @.</p>
					{/if}
					{#if form?.forbiddenUrl}
						<p class="text-failure">Invalid url. "{form.forbiddenUrl}" is a reserved word.</p>
					{/if}
					{#if form?.onlyNumbers}
						<p class="text-failure">Invalid url. Url can't only be numbers</p>
					{/if}
				</div>
				<div class="text-left">
					<label for="is-public-input">Set URL to public?</label>
					<input
						type="checkbox"
						id="is-public-input"
						name="is-public"
						checked={data.url.shortUrl?.isPublic === true ? true : false}
					/>
				</div>
			</section>
			<hr/>
			<section class="col" style="margin-bottom: 1rem;">
				<label for="description-input">Change description</label>
				<textarea
						style="flex: 1; resize: none;"
						id="description-input"
						name="description"
						required
						value={form?.description || (data.url.shortUrl?.description ?? "")}
					></textarea>
			</section>
		</form>
		<details>
			<summary>
				Danger Zone
				<hr />
			</summary>
			<form class="text-left" action="?/deleteShortUrl" method="post" use:enhance>
				<input type="hidden" name="short-url" value={data.url.shortUrl?.shortUrl} />
				<input style="margin-right: 0.5rem" type="submit" class="bg-failure" value="Delete Url" />
				⚠️ This is irreversible and does NOT ask for a confirmation!
			</form>
		</details>
	</section>
	<section class="col" style="width: 100%;">
		<h2>Version history</h2>
		{#if form?.deleteLongError}
			<p class="text-failure">Error deleting long url "{form?.deleted}".</p>
		{/if}
		{#if form?.deleteLongSuccess}
			<p class="text-success">Successfully deleted long url "{form?.deleted}"!</p>
		{/if}
		{#if data.url?.longUrls.length > 0}
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

<svelte:head>
	<title>URLCutter | {data.url.shortUrl?.shortUrl}</title>
</svelte:head>
