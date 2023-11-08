<script lang="ts">
	import { page } from "$app/stores"
</script>

<section class="section-center col" style="gap: 1rem; justify-content: center;">
	<h2>
		❌
		<br /><br />
		{$page.status}: {$page.error?.message}
	</h2>
</section>

<svelte:head>
	<title>URLCutter | Error</title>
</svelte:head>
