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

    // Maybe just keep track of what the next element is and check it from the DOM every time
    // just in case the position changes because of interactive elements

    let scroll_positions_lookup = [];
    let lower_bound = Infinity;
    let upper_bound = 0;
    let current_scroll_index = 0;

    onMount(() => {
        updateScrollPositionsLookup();
        updateScrollState();
    });

    afterUpdate(() => {
        updateScrollPositionsLookup();
        updateScrollState();
    });

    function updateScrollPositionsLookup() {
        scroll_positions_lookup = [];
        for (let i = 0; i < nav_links.length; i++) {
            let section_id = nav_links[i].link;
            let section_element = document.getElementById(section_id);
            let section_position = section_element.offsetTop;
            scroll_positions_lookup.push([section_position, section_id]);
        }
    }

    function setNavLinkActive(scroll_positions_index) {
        let section_id = scroll_positions_lookup[scroll_positions_index][1];
        let nav_id = "nav-" + section_id;
        let nav_element = document.getElementById(nav_id);
        nav_element.classList.add("active");
    }

    function setNavLinkInactive(scroll_positions_index) {
        let section_id = scroll_positions_lookup[scroll_positions_index][1];
        let nav_id = "nav-" + section_id;
        let nav_element = document.getElementById(nav_id);
        nav_element.classList.remove("active");
    }

    function updateScrollState() {
        function updateScrollStateWithDirection(scrollPosition, direction) {
            setNavLinkInactive(current_scroll_index);
            for (
                let i = current_scroll_index;
                i < scroll_positions_lookup.length && i >= 0;
                i += direction
            ) {
                if (
                    direction === 1 &&
                    scrollPosition > scroll_positions_lookup[i][0]
                ) {
                    current_scroll_index = i;
                } else if (
                    direction === -1 &&
                    scrollPosition < scroll_positions_lookup[i][0]
                ) {
                    current_scroll_index = i - 1;
                }
            }
            lower_bound = scroll_positions_lookup[current_scroll_index][0];
            if (current_scroll_index + 1 >= scroll_positions_lookup.length) {
                upper_bound = Infinity;
            } else {
                upper_bound =
                    scroll_positions_lookup[current_scroll_index + 1][0];
            }
            setNavLinkActive(current_scroll_index);
        }

        const scrollPosition = window.scrollY;
        if (scrollPosition > upper_bound) {
            updateScrollStateWithDirection(scrollPosition, 1);
        } else if (scrollPosition < lower_bound) {
            updateScrollStateWithDirection(scrollPosition, -1);
        }
    }

    window.onscroll = () => {
        updateScrollState();
        console.log(current_scroll_index);
    };

    function navigateToSection(section_id) {
        const targetElement = document.getElementById(section_id);
        targetElement.scrollIntoView({ behavior: "smooth" });
    }

    function handleNavigationClick(event) {
        event.preventDefault();
        const target = event.target;
        const href = target.getAttribute("href");
        console.log(href);
        navigateToSection(href);
    }
</script>

<header>
    <nav>
        <a href="/">
            <Icon name="logo" style="line-height:{height}" />
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
        height: 100%;
    }

    header nav ul li {
        vertical-align: top;
        display: inline-block;
        list-style: none;
    }

    header nav ul li a {
        display: block;
        color: #1d1e20;
        font-family: "IBM Plex Mono", monospace;
        font-size: 1em;
        font-weight: 300;
        padding-inline: 1em;
    }

    header nav ul li a:hover {
        background-color: #f2f1f0;
        box-shadow: 0 -4px 0 0 #cdcecf inset;
    }

    .active {
        background-color: #f2f1f0;
        box-shadow: 0 -4px 0 0 #cdcecf inset;
    }
</style>
