<script lang="ts">
	import type { shortUrl } from "$lib/types"

	export let url: shortUrl
</script>

<li class="block col">
	<div class="row-wrap" style="justify-content: space-between">
		<span>
			<b>/<a href={`/${url.shortUrl}`}>{url.shortUrl}</a></b>
			{#if url.isPublic}
				(public)
			{/if}
		</span>
		<span>
			<a href={`/admin/${url.shortUrl}`}>edit</a>
		</span>
	</div>
</li>
