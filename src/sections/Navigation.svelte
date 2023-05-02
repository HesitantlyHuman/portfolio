<script>
    import Icon from "../components/Icon.svelte";

    export let nav_links = [
        {
            name: "About",
            link: "/",
        },
        {
            name: "Projects",
            link: "/projects",
        },
        {
            name: "Experience",
            link: "/experience",
        },
        {
            name: "Resume",
            link: "/resume",
        },
        {
            name: "Contact",
            link: "/contact",
        },
    ];

    export let height = "5em";
</script>

<header style="height: {height}">
    <nav>
        <a href="/" style="line-height: {height}">
            <Icon name="logo" size="2em" />
        </a>
        <ul>
            {#each nav_links as link}
                <li>
                    <a href={link.link} style="line-height: {height}">
                        {link.name}
                    </a>
                </li>
            {/each}
            <button class="theme-toggle">
                <Icon name="theme" size="1.5em" />
            </button>
        </ul>
    </nav>
</header>

<style>
    header {
        top: 0;
        left: 0;
        padding: 0;
        box-shadow: 2px 4px 5px rgba(0, 0, 0, 0.05);
        position: fixed;
        width: 100%;
        background-color: #fff;
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
    }

    header nav ul li {
        vertical-align: top;
        display: inline-block;
        list-style: none;
    }

    header nav ul li a {
        display: block;
        color: #000;
        font-family: "IBM Plex Mono", monospace;
        font-size: 1em;
        font-weight: 300;
        padding-inline: 1em;
    }

    header nav ul li a:hover {
        background-color: #f2f1f0;
        box-shadow: 0 -4px 0 0 #cdcecf inset;
    }
</style>
