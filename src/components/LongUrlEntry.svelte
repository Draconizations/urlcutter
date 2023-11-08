<script lang="ts">
	import { enhance } from "$app/forms"
	import { page } from "$app/stores"
	import type { LongUrl } from "$lib/types"

	export let longUrl: LongUrl
	export let shortUrl: string
	export let env: "admin" | "public" = "public"

	function copyUrl(shortUrl: string, versionTag: string) {
		if (navigator) {
			navigator.clipboard.writeText(`https://${$page.url.host}/${shortUrl}/${versionTag}`)
		}
	}
</script>

<li class="block col">
	<div class="row-wrap">
		<button class="bg-success" style="margin-right: 0.5rem;" on:click={() => copyUrl(shortUrl, longUrl.versionTag)}>
			copy
		</button>
		<div class="row-small">
			<span style="flex: 1;">
				<b><a href={`/${shortUrl}/${longUrl.versionTag}`}>{longUrl.versionTag}</a></b>
			</span>
			<span>
				{longUrl.created
					.toLocaleString("en-US", {
						day: "2-digit",
						month: "short",
						hour: "2-digit",
						hourCycle: "h24",
						minute: "2-digit"
					})
					.toLowerCase()}
			</span>
		</div>
		{#if env === "admin"}
			<form style="display: flex; flex-direction: column;" action="?/deleteLongUrl" method="post" use:enhance>
				<input type="hidden" name="short-url" value={shortUrl} />
				<input type="hidden" name="version-tag" value={longUrl.versionTag} />
				<input type="submit" style="margin: 0; flex: 1;" class="bg-failure" value="Delete" />
			</form>
		{/if}
	</div>
	<hr />
	<details>
		<summary>Full link</summary>
		<div style="margin-top: 0.75rem;" class="block bg-background">
			<a style="word-wrap: break-word;" href={longUrl.longUrl}>
				{longUrl.longUrl}
			</a>
		</div>
	</details>
</li>

<style>
	.row-small {
		flex: 1;
		display: flex;
		flex-wrap: wrap;
		flex-direction: column;
		align-items: flex-end;
	}

	@media (min-width: 420px) {
		.row-small {
			flex-direction: row;
			align-items: center;
		}
	}
</style>
