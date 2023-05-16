<script>
    import "../styles/fonts.css";

    import Projects from "../sections/Projects.svelte";
    import About from "../sections/About.svelte";
    import Experience from "../sections/Experience.svelte";
    import Downloads from "../sections/Downloads.svelte";
    import ContentColumn from "../components/ContentColumn.svelte";
    import Contact from "../sections/Contact.svelte";
    import Navigation from "../sections/Navigation.svelte";

    import { onMount } from "svelte";

    /** @type {import('./$types').PageData}*/
    export let data;

    let current_theme;

    onMount(() => {
        current_theme = localStorage.getItem("theme-preference");
    });

    function toggleTheme() {
        if (current_theme === "light") {
            current_theme = "dark";
            setCssVariables(themes.dark, "theme");
            localStorage.setItem("theme-preference", "dark");
        } else {
            current_theme = "light";
            setCssVariables(themes.light, "theme");
            localStorage.setItem("theme-preference", "light");
        }
    }
</script>

<svelte:head>
    <script>
        const style = {
            transition: {
                theme: "0.2s ease",
            },
            border: {
                width: "2px",
            },
        };

        const themes = {
            light: {
                name: "light",
                toggle: {
                    left: "2em",
                },
                colors: {
                    background: "#FEFEFE",
                    section: "#F2F1F0",
                    label: {
                        background: "#E6E5E5",
                        border: "#CDCECF",
                        text: "#9BA0A2",
                    },
                    card: {
                        background: "#fff",
                        accent: "#CDCECF",
                        highlight: "#9BA0A2",
                        dark: "#9BA0A2",
                        footer: "#9BA0A2",
                    },
                    contact: {
                        header: "#697276",
                        body: "#9BA0A2",
                    },
                    hero: {
                        background: "#fff",
                        highlight: "#F2F1F0",
                        border: "#CDCECF",
                    },
                    text: {
                        header: "#1D1E20",
                        body: "#2A3135",
                        ondark: "#fff",
                    },
                },
            },
            dark: {
                name: "dark",
                toggle: {
                    left: "0.5em",
                },
                colors: {
                    background: "#1D1E20",
                    section: "#24282B",
                    label: {
                        background: "#697276",
                        border: "#9BA0A2",
                        text: "#CDCECF",
                    },
                    card: {
                        background: "#313539",
                        accent: "#697276",
                        highlight: "#9BA0A2",
                        dark: "#313539",
                        footer: "#697276",
                    },
                    contact: {
                        header: "#313539",
                        body: "#24282B",
                    },
                    hero: {
                        background: "#24282B",
                        highlight: "#313539",
                        border: "#697276",
                    },
                    text: {
                        header: "#fff",
                        body: "#E6E5E5",
                        ondark: "#E6E5E5",
                    },
                },
            },
        };

        function getThemePreference() {
            const theme_preference = localStorage.getItem("theme-preference");
            const has_theme_preference = typeof theme_preference === "string";
            if (has_theme_preference) {
                return theme_preference;
            }
            const system_theme = window.matchMedia(
                "(prefers-color-scheme: dark)"
            );
            const has_system_preference =
                typeof system_theme.matches === "boolean";
            if (has_system_preference) {
                return system_theme.matches ? "dark" : "light";
            } else {
                return "dark";
            }
        }

        const theme_preference = getThemePreference();
        try {
            localStorage.setItem("theme-preference", theme_preference);
        } catch (error) {
            console.error(
                "Unable to set user theme-preference due to " + error
            );
        }

        function setCssVariables(variable_map, variable_name) {
            for (const [property_name, value] of Object.entries(variable_map)) {
                const property_path = `${variable_name}-${property_name}`;
                if (value instanceof Object) {
                    setCssVariables(value, property_path);
                } else {
                    const property_id = `--${property_path}`;
                    document.documentElement.style.setProperty(
                        property_id,
                        value
                    );
                }
            }
        }

        setCssVariables(themes[theme_preference], "theme");
        setCssVariables(style, "style");
    </script>
    <title>Tanner Sims | Mathematics and Computer Science</title>
    <meta name="description" content={data.about.blurb} />
</svelte:head>

<Navigation
    theme_function={toggleTheme}
    theme={current_theme}
    height="5em"
    nav_links={data.navigation}
/>
<ContentColumn>
    <About
        name={data.about.name}
        blurb={data.about.blurb}
        links={data.about.links}
    />
    <Projects projects={data.projects} />
    <Experience experience={data.experience} />
    <Downloads downloads={data.downloads} />
    <Contact contacts={data.contact} />
</ContentColumn>
