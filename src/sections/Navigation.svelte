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

    let section_elements = {};
    let section_element_cached_positions = {};
    let current_element_id = null;
    let above_element_position = 0;
    let below_element_position = 0;

    const cache_element_positions = (entries) => {
        console.log("Caching element positions");
        for (let i = 0; i < entries.length; i++) {
            if (entries[i].id in section_element_cached_positions) {
                section_element_cached_positions[entries[i].id] =
                    entries[i].element.offsetTop;
            }
        }
    };

    const observer = new ResizeObserver(cache_element_positions);

    onMount(() => {
        for (const nav_link_info of nav_links) {
            const id = nav_link_info.link;
            const element = document.getElementById(id);
            section_elements[id] = element;
            section_element_cached_positions[id] = null;
            observer.observe(element);
        }
    });

    afterUpdate(() => {
        for (const section_id in section_element_cached_positions) {
            const element = section_elements[section_id];
            section_element_cached_positions[section_id] = element.offsetTop;
        }
    });

    function setActive(element) {
        element.classList.add("active");
    }

    function setInactive(element) {
        element.classList.remove("active");
    }

    function updateScrollState() {
        const scrollPosition = window.scrollY;
        if (
            scrollPosition >= below_element_position ||
            scrollPosition <= above_element_position
        ) {
            let next_element_id = null;
            above_element_position = 0;
            below_element_position = Infinity;
            for (let id in section_element_cached_positions) {
                const position = section_element_cached_positions[id];
                if (
                    scrollPosition > position &&
                    above_element_position < position
                ) {
                    above_element_position = position;
                    next_element_id = id;
                } else if (
                    scrollPosition < position &&
                    below_element_position > position
                ) {
                    below_element_position = position;
                }
            }
            console.log(above_element_position);
            console.log(below_element_position);
            if (next_element_id != current_element_id) {
                if (current_element_id != null) {
                    setInactive(section_elements[current_element_id]);
                }
                setActive(section_elements[next_element_id]);
                current_element_id = next_element_id;
            }
        }
    }

    window.onscroll = () => {
        updateScrollState();
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
        box-shadow: 0 -4px 0 0 #e1e3e4 inset;
    }

    .active:hover {
        background-color: #f2f1f0;
        box-shadow: 0 -4px 0 0 #cdcecf inset;
    }
</style>
