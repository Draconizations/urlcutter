<script lang="ts">
	import { enhance } from "$app/forms"
	import ShortUrlEntry from "$components/ShortUrlEntry.svelte"
	import type { PageData, ActionData } from "./$types"

	export let data: PageData
	export let form: ActionData
</script>

{#if !data.authenticated}
	<section class="section-center justify-center">
		<form action="?/login" method="post" use:enhance>
			<label for="password-input">Enter admin password</label><br />
			<input type="password" id="password-input" required name="password" />
			<input type="submit" value="Awooga" />
			{#if form?.logout}
				<br /><br />
				<span class="text-success">Logged out!</span>
			{/if}
			{#if form?.incorrect}
				<br /><br />
				<span class="text-failure">Incorrect password</span>
			{/if}
		</form>
	</section>
{:else}
	<section class="section-center" style="gap: 1rem;">
		<form style="display: inline-block; margin-left: auto;" action="?/logout" method="post" use:enhance>
			{#if form?.login}
				<span class="text-success">Logged in successfully!</span>
			{/if}
			<input type="submit" value="Logout" />
		</form>

		<form class="block col text-left" action="?/create" method="post" use:enhance>
			<h2>Create new short link</h2>
			{#if form?.insertError}
				<p class="text-failure">Error inserting new url.</p>
			{/if}
			<section class="col" style="margin-bottom: 1rem;">
				<label for="long-input">Full link</label>
				<div class="row">
					<input
						style="flex: 1;"
						type="text"
						id="long-input"
						name="long-url"
						required
						value={form?.longUrl ?? ""}
					/>
					<input type="submit" value="Create url" />
				</div>
			</section>
			<div class="row">
				<section class="col flex-1">
					<label for="short-input">Short link</label>
					<input type="text" id="short-input" name="short-url" value={form?.shortUrl ?? ""} />
					<hr />
					{#if form?.invalidUrl}
						<p class="text-failure">Invalid url. Allowed characters: A-z, 0-9, - _ @.</p>
					{/if}
					{#if form?.forbiddenUrl}
						<p class="text-failure">Invalid url. {form.shortUrl} is a reserved word.</p>
					{/if}
					<span style="margin-top: auto;">
						ℹ️ Leaving this blank will generate a randomly generated url. Inputting an existing url will
						create a new version of that url.
					</span>
				</section>
				<section class="flex-1 col">
					<span
						><label for="privacy-input">Make link public?</label>
						<input
							type="checkbox"
							id="privacy-input"
							name="is-public"
							checked={form?.isPublic ? true : false}
						/><br />
					</span>
					<hr />
					<span style="margin-top: auto;">
						ℹ️ If the link is set to public, it will show up on the homepage.
					</span>
				</section>
			</div>
		</form>
		<section class="col" style="width: 100%;">
			<h2>Existing links</h2>
			{#if data.urls.length > 0}
				<ol class="flex-list text-left">
					{#each data.urls as url}
						<ShortUrlEntry {url} />
					{/each}
				</ol>
			{:else if form?.insertError}
				<p class="text-failure">Error fetching urls.</p>
			{:else}
				<p>No urls yet!</p>
			{/if}
		</section>
	</section>
{/if}

<svelte:head>
	<title>URLCutter | Admin</title>
</svelte:head>