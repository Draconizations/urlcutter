<script lang="ts">
	import { url } from "$data/schema"
	import type { LongUrl } from "$lib/types"

	export let longUrl: LongUrl
	export let env: "admin" | "public" = "public"
</script>

<li class="block col">
	<div class="row-wrap" style="justify-content: space-between; align-items: center;">
		<span style="flex: 1;">
			<b><a href={`/${longUrl.longUrl}`}>{longUrl.versionTag}</a></b>
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
			{#if env === "admin"}
				<input type="submit" style="margin: 0;" class="bg-failure" value="Delete" />
			{/if}
		</span>
	</div>
	<hr />
	<details>
		<summary>Full link</summary>
		<div style="margin-top: 0.75rem;" />
		<a style="word-wrap: break-word;" href={longUrl.longUrl}>
			{longUrl.longUrl}
		</a>
	</details>
</li>
