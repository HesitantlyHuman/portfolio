<script>
	import Projects from "./sections/Projects.svelte";
	import About from "./sections/About.svelte";
	import Experience from "./sections/Experience.svelte";
	import Downloads from "./sections/Downloads.svelte";
	import ContentColumn from "./components/ContentColumn.svelte";
	import Contact from "./sections/Contact.svelte";
	import Navigation from "./sections/Navigation.svelte";

	import { themes } from "./themes.js";
	import { onMount } from "svelte";

	let theme = themes.dark; // TODO: load this from preferences or cookies

	onMount(() => {
		setTheme(theme, "theme");
	});

	function setTheme(theme_map, theme_name) {
		for (const [property_name, value] of Object.entries(theme_map)) {
			const property_path = `${theme_name}-${property_name}`;
			if (value instanceof Object) {
				setTheme(value, property_path);
			} else {
				const property_id = `--${property_path}`;
				document.documentElement.style.setProperty(property_id, value);
			}
		}
	}

	function toggleTheme() {
		if (theme === themes.light) {
			theme = themes.dark;
		} else {
			theme = themes.light;
		}
		setTheme(theme, "theme");
	}
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

<Navigation theme_function={toggleTheme} />
<ContentColumn>
	<About
		name="Tanner Sims"
		about_text="Hi, I'm Tanner. I'm a software engineer and data scientist."
	/>
	<Projects />
	<Experience />
	<Downloads />
	<Contact />
</ContentColumn>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		background-color: var(--theme-colors-background);
	}

	:global(h1, h2, h3, h4, h5) {
		color: var(--theme-colors-text-header);
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
		color: var(--theme-colors-text-body);
	}
</style>
