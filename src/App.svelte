<script>
	import Projects from "./sections/Projects.svelte";
	import About from "./sections/About.svelte";
	import Experience from "./sections/Experience.svelte";
	import Downloads from "./sections/Downloads.svelte";
	import ContentColumn from "./components/ContentColumn.svelte";
</script>

<head>
	<link
		href="https://fonts.googleapis.com/css?family=Work+Sans:400,600,700&display=swap"
		rel="stylesheet"
	/>
	<link
		href="https://fonts.googleapis.com/css?family=IBM+Plex+Mono:300,700&display=swap"
		rel="stylesheet"
	/>
</head>

<ContentColumn>
	<About
		name="Tanner Sims"
		about_text="Hi, I'm Tanner. I'm a software engineer and data scientist."
	/>
	<Projects />
	<Experience />
	<Downloads />
</ContentColumn>

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
		font-weight: 600;
		font-size: 1.8em;
	}

	:global(h4) {
		font-weight: 600;
		font-size: 1.2em;
	}

	:global(p) {
		font-weight: 300;
		font-size: 1em;
		font-family: "IBM Plex Mono", monospace;
		color: #2a3135;
	}
</style>
