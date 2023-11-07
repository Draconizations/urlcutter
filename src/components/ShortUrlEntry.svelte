<script lang="ts">
	import type { shortUrl } from "$lib/types"

	export let url: shortUrl
	export let env: "admin" | "public" = "public"
</script>

<li class="block col">
	<div class="row-wrap" style="justify-content: space-between">
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
			✦
			{#if env === "admin"}
				<a href={`/admin/${url.shortUrl}`}>edit</a>
			{:else}
				<a href={`/history/${url.shortUrl}`}>history</a>
			{/if}
		</span>
	</div>
</li>
