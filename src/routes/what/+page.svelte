<script>
	import { PUBLIC_GIT_URL } from "$env/static/public"
</script>

<section class="section-center col" style="justify-content: center;">
	<h1>So what is this?</h1>
	<section class="block" style="width: 100%;">
		<p>
			It's a personal URL shortener! Like tinyurl but only the admin can create new shortened URLs and edit them.
			The homepage consists of the publicized URLs, for easy access. It also has a version history!
		</p>
		<p>
			The source code is available <a href={PUBLIC_GIT_URL}>over here</a>, PRs are welcome but might not always be
			accepted since this really is just for personal use. And I also might just be really slow at answering them.
		</p>
		<p>
			And... that's about it. While this project is useable, it's still incomplete. Feel free to look over the
			public URLs or whatever!
		</p>
	</section>
	<a href="/" class="button" style="margin: 1rem 0">Back home</a>
</section>

<svelte:head>
	<title>URLCutter | What</title>
</svelte:head>
