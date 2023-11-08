<script lang="ts">
	import { enhance } from "$app/forms"
	import type { LongUrl } from "$lib/types"

	export let longUrl: LongUrl
	export let shortUrl: string
	export let env: "admin" | "public" = "public"
</script>

<li class="block col">
	<div class="row-wrap" style="justify-content: space-between; align-items: center;">
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
			{#if env === "admin"}
				<form style="display: inline;" action="?/deleteLongUrl" method="post" use:enhance>
					<input type="hidden" name="short-url" value={shortUrl} />
					<input type="hidden" name="version-tag" value={longUrl.versionTag} />
					<input type="submit" style="margin: 0;" class="bg-failure" value="Delete" />
				</form>
			{/if}
		</span>
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
