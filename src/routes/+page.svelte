<script>
    import "../styles/fonts.css";

    import Projects from "../sections/Projects.svelte";
    import About from "../sections/About.svelte";
    import Experience from "../sections/Experience.svelte";
    import Downloads from "../sections/Downloads.svelte";
    import ContentColumn from "../components/ContentColumn.svelte";
    import Contact from "../sections/Contact.svelte";
    import Navigation from "../sections/Navigation.svelte";

    import { themes } from "../themes.js";
    import { style } from "../style.js";
    import { onMount } from "svelte";

    let theme = themes.dark; // TODO: load this from preferences or cookies

    onMount(() => {
        setCssVariables(theme, "theme");
        setCssVariables(style, "style");
    });

    function setCssVariables(variable_map, variable_name) {
        for (const [property_name, value] of Object.entries(variable_map)) {
            const property_path = `${variable_name}-${property_name}`;
            if (value instanceof Object) {
                setCssVariables(value, property_path);
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
        setCssVariables(theme, "theme");
    }
</script>

<Navigation theme_function={toggleTheme} theme={theme.name} height="5em" />
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
        transition: background-color var(--style-transition-theme);
    }

    :global(h1, h2, h3, h4, h5) {
        color: var(--theme-colors-text-header);
        transition: color var(--style-transition-theme);
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
        transition: color var(--style-transition-theme);
    }
</style>
