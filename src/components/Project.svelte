<script>
    import { flip } from "svelte/animate";

    import Card from "./Card.svelte";
    import Icon from "./Icon.svelte";

    export let name = "Project Name";
    export let categories = [];
    export let techs = [];
    export let description = "Project Description";
    export let image = "";
    export let image_alt = "Project Image";
    export let links = [];

    $: techs = techs.map((tech) => tech.toLowerCase());
    $: categories = categories.map((cat) =>
        cat.toLowerCase().replace(" ", "_")
    );
</script>

<Card hover={true}>
    <article>
        <div class="image">
            <img src={image} alt={image_alt} />
        </div>
        <div class="info">
            <h3>{name}</h3>
            <aside>
                <ul class="categories">
                    {#each categories as category}
                        <li>
                            <h4>{category}</h4>
                        </li>
                    {/each}
                </ul>
                <ul class="tech-icons">
                    {#each techs as tech}
                        <li>
                            <Icon name={tech} size="1.8em" />
                        </li>
                    {/each}
                </ul>
            </aside>
            <summary><p>{description}</p></summary>
            <footer>
                <ul class="link-icons">
                    {#each links as link}
                        <li>
                            <a href={link.url}>
                                <Icon
                                    name={link.name.toLowerCase()}
                                    size="2em"
                                />
                            </a>
                        </li>
                    {/each}
                </ul>
                <!-- <p>Read more ></p> -->
            </footer>
        </div>
    </article>
</Card>

<style>
    article {
        display: flex;
        flex-direction: row;
        align-items: left;
        height: 20em;
        background-color: var(--theme-colors-background);
        transition: background-color var(--style-transition-theme);
    }

    article .image {
        width: 23em;
        overflow: hidden;
        background-color: var(--theme-colors-card-accent);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    article .image img {
        height: 100%;
        opacity: 0.8;
    }

    article .info {
        margin: 0;
        padding-inline: 3em;
        display: flex;
        flex-direction: column;
        width: 100%;
    }

    article .info h3 {
        order: 2;
        margin-top: 0.66em;
        margin-bottom: 0em;
    }

    article .info summary {
        order: 3;
        flex: 1;
    }

    article .info summary p {
        margin: 0;
        padding: 0;
    }

    article .info aside {
        order: 1;
        margin-top: 2em;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }

    article .info aside h4 {
        margin: 0;
        padding-block: 0.5em;
        padding-inline: 1em;
        font-size: 1em;
        border-radius: 12px;
        border: var(--style-border-width) solid var(--theme-colors-label-text);
        color: var(--theme-colors-label-text);
        transition: color var(--style-transition-theme);
    }

    .tech-icons,
    .categories,
    .link-icons {
        list-style-type: none;
        display: flex;
        flex-direction: row;
        padding: 0;
        margin: 0;
    }

    .tech-icons li,
    .categories li,
    .link-icons li {
        margin-left: 1.5em;
        display: flex;
        align-items: center;
    }

    .tech-icons li {
        color: var(--theme-colors-label-text);
        transition: color var(--style-transition-theme);
    }

    .tech-icons li:first-child,
    .categories li:first-child,
    .link-icons li:first-child {
        margin-left: 0;
    }

    .link-icons li a {
        color: var(--theme-colors-label-text);
        transition: color var(--style-transition-theme);
    }

    article .info footer {
        order: 4;
        display: flex;
        flex-direction: row;
        bottom: 0;
        margin-bottom: 2em;
    }

    article .info footer p {
        margin-left: auto;
    }
</style>
