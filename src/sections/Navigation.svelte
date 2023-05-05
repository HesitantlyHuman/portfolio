<script>
    import { afterUpdate, onMount } from "svelte";
    import Icon from "../components/Icon.svelte";

    export let nav_links = [
        {
            name: "About",
            link: "about",
        },
        {
            name: "Projects",
            link: "projects",
        },
        {
            name: "Experience",
            link: "experience",
        },
        {
            name: "Resume",
            link: "downloads",
        },
        {
            name: "Contact",
            link: "contact",
        },
    ];

    export let height = "5em";
    export let theme_function;

    function navigateToSection(section_id) {
        const targetScrollLocation =
            document.getElementById(section_id).offsetTop;
        const navigationElementHeight =
            document.getElementById("navbar").offsetHeight;
        console.log(targetScrollLocation);
        console.log(navigationElementHeight);
        window.scrollTo({
            top: targetScrollLocation - navigationElementHeight,
            left: 0,
            behavior: "smooth",
        });
    }

    function handleNavigationClick(event) {
        event.preventDefault();
        const target = event.target;
        const href = target.getAttribute("href");
        console.log(href);
        navigateToSection(href);
    }
</script>

<header id="navbar">
    <nav>
        <a href="/" class="logo">
            <Icon name="logo" size="3em" />
        </a>
        <ul>
            {#each nav_links as link}
                <li>
                    <a
                        href={link.link}
                        style="line-height:{height}"
                        on:click={handleNavigationClick}
                        class={false ? "active" : ""}
                        id={"nav-" + link.link.toLowerCase()}
                    >
                        {link.name}
                    </a>
                </li>
            {/each}
            <button class="theme-toggle" on:click={theme_function}>
                <Icon name="theme" size="1.8em" />
            </button>
        </ul>
    </nav>
</header>

<style>
    header {
        top: 0;
        left: 0;
        padding: 0;
        box-shadow: 2px 4px 5px rgba(0, 0, 0, 0.08);
        position: fixed;
        width: 100%;
        background-color: var(--theme-colors-hero-background);
        z-index: 1;
    }

    header nav {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding-inline: 1em;
        max-width: 80em;
        margin: 0 auto;
    }

    header nav a {
        text-decoration: none;
    }

    header nav ul {
        display: block;
        padding-block: 0.5em;
        padding-inline: 1em;
        margin: 0;
        padding: 0;
        height: 100%;
    }

    header nav ul li {
        vertical-align: top;
        display: inline-block;
        list-style: none;
    }

    header nav ul li a {
        display: block;
        color: var(--theme-colors-text-body);
        font-family: "IBM Plex Mono", monospace;
        font-size: 1em;
        font-weight: 300;
        padding-inline: 1em;
    }

    header nav ul li a:hover {
        background-color: var(--theme-colors-hero-highlight);
        box-shadow: 0 -4px 0 0 var(--theme-colors-hero-border) inset;
    }

    .active {
        background-color: var(--theme-colors-hero-highlight);
        box-shadow: 0 -4px 0 0 var(--theme-colors-hero-border) inset;
    }

    .logo {
        background-color: var(--theme-colors-hero-highlight);
        border-radius: 50%;
        width: 3.5em;
        height: 3.5em;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
