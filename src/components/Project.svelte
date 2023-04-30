<script>
    import HoverCard from "./HoverCard.svelte";

    export let name = "Project Name";
    export let category = "Project Category";
    export let techs = [];
    export let description = "Project Description";
    export let image = "https://via.placeholder.com/150";
    export let image_alt = "Project Image";
    export let links = [];
</script>

<HoverCard>
    <article>
        <h3>{name}</h3>
        <img src={image} alt={image_alt} />
        <aside>
            <h4>{category.toUpperCase()}</h4>
            <ul>
                {#each techs as tech}
                    <li>{tech}</li>
                {/each}
            </ul>
        </aside>
        <summary><p>{description}</p></summary>
        <footer>
            <ul>
                {#each links as link}
                    <li><a href={link.url}>{link.name}</a></li>
                {/each}
            </ul>
        </footer>
    </article>
</HoverCard>

<style>
    article {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: left;
        padding: 1em;
        margin: 1em;
    }
</style>
