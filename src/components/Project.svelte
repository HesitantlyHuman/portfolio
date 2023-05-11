<script>
    import Card from "./Card.svelte";
    import Icon from "./Icon.svelte";

    export let name = "Project Name";
    export let category = "Project Category";
    export let techs = [];
    export let description = "Project Description";
    export let image = "";
    export let image_alt = "Project Image";
    export let links = [];
</script>

<Card hover={true}>
    <article>
        <div class="image">
            <img src={image} alt={image_alt} />
        </div>
        <div class="info">
            <h3>{name}</h3>
            <aside>
                <h4>{category.toUpperCase()}</h4>
                <ul class="tech-icons">
                    {#each techs as tech}
                        <li>
                            <Icon
                                name={tech.toLowerCase()}
                                color="var(--theme-colors-label-text)"
                                size="1.8em"
                            />
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
                                    color="var(--theme-colors-card-footer)"
                                    size="2em"
                                />
                            </a>
                        </li>
                    {/each}
                </ul>
                <p>Read more ></p>
            </footer>
        </div>
    </article>
</Card>

<style>
    article {
        display: flex;
        flex-direction: row;
        align-items: left;
        height: 22em;
        background-color: var(--theme-colors-card-background);
    }

    article .image {
        width: 22em;
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
        padding-block: 2em;
        padding-inline: 3em;
        display: flex;
        flex-direction: column;
        width: 100%;
    }

    article .info h3 {
        order: 2;
    }

    article .info aside {
        order: 1;
        display: flex;
        border: var(--theme-style-border-width) solid
            var(--theme-colors-label-border);
        background-color: var(--theme-colors-label-background);
        border-radius: 10px;
        width: fit-content;
        padding: 0;
    }

    article .info aside h4 {
        display: flex;
        align-items: center;
        margin: 0;
        padding-block: 0.5em;
        padding-inline: 2em;
        border-right: var(--theme-style-border-width) solid
            var(--theme-colors-label-border);
        font-size: 1em;
        color: var(--theme-colors-label-text);
    }

    .tech-icons {
        list-style-type: none;
        display: flex;
        flex-direction: row;
        padding-block: 0.33em;
        padding-inline: 1em;
        margin: 0;
    }

    .tech-icons li {
        display: flex;
        align-items: center;
        margin-left: 1em;
    }

    .tech-icons li:first-child {
        margin-left: 0;
    }

    .link-icons {
        list-style-type: none;
        display: flex;
        flex-direction: row;
        padding: 0;
        margin: 0;
    }

    .link-icons li {
        margin-left: 1.5em;
    }

    .link-icons li:first-child {
        margin-left: 0;
    }

    article .info summary {
        order: 3;
        flex: 1;
    }

    article .info summary p {
        margin: 0;
        padding: 0;
    }

    article .info footer {
        order: 4;
        display: flex;
        flex-direction: row;
        bottom: 0;
    }

    article .info footer p {
        margin-left: auto;
    }
</style>
