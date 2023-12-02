<script lang="ts">
	import type { ShortUrl } from "$lib/types"
	import { page } from "$app/stores"

	export let url: ShortUrl
	export let env: "admin" | "public" = "public"

	function copyUrl(shortUrl: string) {
		if (navigator) {
			navigator.clipboard.writeText(`https://${$page.url.host}/${shortUrl}`)
		}
	}
</script>

<li class="block col">
	<div class="row-wrap">
		<button class="bg-success" on:click={() => copyUrl(url.shortUrl)}>copy</button>
		<div class="row-small">
			<span style="flex: 1;">
				<b><a href={`/${url.shortUrl}`}>{url.shortUrl}</a></b>
				{#if env === "admin" && url.isPublic}
					(public)
				{/if}
			</span>
			<span>
				{url.created
					.toLocaleString("en-US", {
						day: "2-digit",
						month: "short",
						hour: "2-digit",
						hourCycle: "h24",
						minute: "2-digit"
					})
					.toLowerCase()}
				{#if env === "admin"}
					✦
					<a href={`/admin/${url.shortUrl}`}>view</a>
				{/if}
			</span>
		</div>
	</div>
	{#if url.description}
	<hr />
		<div class="blockquote">{url.description}</div>
	{/if}
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
