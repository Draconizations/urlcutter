<script lang="ts">
	export let page: number
	export let pageLength: number
	export let env: "admin" | "public" = "public"

	const admin = env === "admin" ? true : false
</script>

<p>
	{#if page > 1}
		<a class="button" href={`${admin ? "/admin/" : "/"}${page - 1}`}>{page - 1}</a>
	{/if}
	<button tabindex="-1" class="inactive">{page}</button>
	{#if pageLength > 0}
		<a class="button" href={`${admin ? "/admin/" : "/"}${page + 1}`}>{page + 1}</a>
	{/if}
</p>
