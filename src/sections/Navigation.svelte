<script>
    import Icon from "../components/Icon.svelte";
    import ThemeToggle from "../components/ThemeToggle.svelte";

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
    export let theme = "dark";

    function navigateToSection(section_id) {
        const scrollTarget = document.getElementById(section_id);
        const scrollTargetLocation = scrollTarget.offsetTop;
        const navigationElementHeight =
            document.getElementById("banner").offsetHeight;
        window.scrollTo({
            top: scrollTargetLocation - navigationElementHeight,
            left: 0,
            behavior: "smooth",
        });
        const sectionHeading =
            scrollTarget.getElementsByClassName("section-title")[0];
        sectionHeading.focus({ preventScroll: true });
    }

    function handleNavigationClick(event) {
        event.preventDefault();
        const target = event.target;
        const href = target.getAttribute("href");
        console.log(href);
        navigateToSection(href);
    }
</script>

<div class="banner-spacer" style="height:{height};margin:1.5em" />
<nav id="banner">
    <div class="nav-container">
        <a href="/" class="logo" aria-hidden="true">
            <Icon name="logo" size="3em" />
        </a>
        <div class="nav-left">
            <ul role="menu">
                {#each nav_links as link}
                    <li>
                        <a
                            href={link.link}
                            style="line-height:{height}"
                            on:click={handleNavigationClick}
                            class={false ? "active" : ""}
                        >
                            {link.name}
                        </a>
                    </li>
                {/each}
            </ul>
            <ThemeToggle {theme_function} {theme} />
        </div>
    </div>
</nav>

<style>
    nav {
        top: 0;
        left: 0;
        padding: 0;
        box-shadow: 2px 4px 5px rgba(0, 0, 0, 0.08);
        position: fixed;
        width: 100%;
        background-color: var(--theme-colors-hero-background);
        transition: background-color var(--style-transition-theme);
        z-index: 1;
    }

    .nav-container {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding-inline: 1em;
        max-width: 80em;
        margin: 0 auto;
    }

    .nav-left {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    nav a {
        text-decoration: none;
    }

    nav ul {
        display: block;
        padding-block: 0.5em;
        padding-inline: 1em;
        margin: 0;
        padding: 0;
        height: 100%;
    }

    nav ul li {
        vertical-align: top;
        display: inline-block;
        list-style: none;
    }

    nav ul li a {
        display: block;
        color: var(--theme-colors-text-body);
        font-family: "IBM Plex Mono", monospace;
        font-size: 1em;
        font-weight: 300;
        padding-inline: 1em;
    }

    nav ul li a:hover {
        background-color: var(--theme-colors-hero-highlight);
        transition: background-color var(--style-transition-theme);
        box-shadow: 0 -4px 0 0 var(--theme-colors-hero-border) inset;
    }

    .active {
        background-color: var(--theme-colors-hero-highlight);
        transition: background-color var(--style-transition-theme);
        box-shadow: 0 -4px 0 0 var(--theme-colors-hero-border) inset;
    }

    .logo {
        background-color: var(--theme-colors-hero-highlight);
        transition: background-color var(--style-transition-theme);
        border-radius: 50%;
        width: 3.5em;
        height: 3.5em;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
