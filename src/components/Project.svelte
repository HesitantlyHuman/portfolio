<script>
    import HoverCard from "./HoverCard.svelte";
    import Icon from "./Icon.svelte";

    export let name = "Project Name";
    export let category = "Project Category";
    export let techs = [];
    export let description = "Project Description";
    export let image = "";
    export let image_alt = "Project Image";
    export let links = [];
</script>

<HoverCard>
    <article>
        <div class="image">
            <img src={image} alt={image_alt} />
        </div>
        <div class="info">
            <h3>{name}</h3>
            <aside>
                <h4>{category.toUpperCase()}</h4>
                <ul>
                    {#each techs as tech}
                        <li>
                            <Icon
                                name={tech.toLowerCase()}
                                color="#697276"
                                size="1.8em"
                            />
                        </li>
                    {/each}
                </ul>
            </aside>
            <summary><p>{description}</p></summary>
            <footer>
                <ul>
                    {#each links as link}
                        <li>
                            <a href={link.url}>
                                <Icon
                                    name={link.name.toLowerCase()}
                                    color="#697276"
                                    size="2.5em"
                                />
                            </a>
                        </li>
                    {/each}
                </ul>
                <p>Read more ></p>
            </footer>
        </div>
    </article>
</HoverCard>

<style>
    article {
        display: flex;
        flex-direction: row;
        align-items: left;
        height: 22em;
    }

    article .image {
        width: 22em;
        overflow: hidden;
        background-color: #9ba0a2;
    }

    article .image img {
        height: 100%;
        opacity: 0.8;
    }

    article .info {
        padding-block: 2em;
        padding-inline: 4em;
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
        border: 2px solid #cdcecf;
        background-color: #e6e5e5;
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
        border-right: 2px solid #cdcecf;
        font-size: 1em;
        color: #697276;
    }

    article .info aside ul {
        list-style-type: none;
        display: flex;
        flex-direction: row;
        padding-block: 0.33em;
        padding-inline: 1em;
        margin: 0;
    }

    article .info aside ul li {
        display: flex;
        align-items: center;
        margin-left: 1em;
        color: #2a3135;
    }

    article .info aside ul li:first-child {
        margin-left: 0;
    }

    article .info summary {
        order: 3;
        flex: 1;
    }

    article .info summary p {
        margin: 0;
        padding: 0;
        color: #2a3135;
    }

    article .info footer {
        order: 4;
        display: flex;
        width: 100%;
        flex-direction: row;
        bottom: 0;
    }

    article .info footer ul {
        list-style-type: none;
        display: flex;
        flex-direction: row;
        margin: 0;
        padding: 0;
    }

    article .info footer p {
        margin-left: auto;
    }
</style>
