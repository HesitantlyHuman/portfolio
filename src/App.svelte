<script>
	import ContentList from "./components/ContentList.svelte";
	import Project from "./components/Project.svelte";
	import About from "./About.svelte";
</script>

<head>
	<link
		href="https://fonts.googleapis.com/css?family=Work+Sans:400,700&display=swap"
		rel="stylesheet"
	/>
	<link
		href="https://fonts.googleapis.com/css?family=IBM+Plex+Mono:400,700&display=swap"
		rel="stylesheet"
	/>
</head>

<main>
	<About
		name="Tanner Sims"
		about_text="Hi, I'm Tanner. I'm a software engineer and data scientist."
	/>
	<h2>Projects</h2>
	<ContentList>
		<Project
			name="Open Lyrics Dataset"
			description="A dataset of song lyrics"
			category="Data collection"
			techs={["Python", "Beautiful Soup"]}
			links={[
				{
					name: "GitHub",
					url: "https://github.com/HesitantlyHuman/open-lyrics-dataset",
				},
			]}
		/>
		<Project
			name="Generating structured latent spaces with VAEs"
			description="Implementation of a novel method for deep archetypal analysis, with the aim of creating highly interpretable latent spaces."
			category="Machine learning"
			techs={["Python", "PyTorch"]}
			links={[
				{
					name: "GitHub",
					url: "",
				},
				{
					name: "Paper",
					url: "",
				},
			]}
		/>
	</ContentList>
</main>

<style>
	main {
		text-align: left;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	:global(h1, h2, h3, h4, h5) {
		color: #1d1e20;
		font-family: "Work Sans", sans-serif;
	}

	:global(h1) {
		font-weight: 700;
		font-size: 4em;
	}

	:global(h2) {
		font-weight: 700;
		font-size: 3em;
		font-family: "IBM Plex Mono", monospace;
	}

	:global(h3) {
		font-weight: 700;
		font-size: 1.5em;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
