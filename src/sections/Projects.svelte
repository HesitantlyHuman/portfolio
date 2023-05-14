<script>
    import Section from "../components/Section.svelte";
    import ContentList from "../components/ContentList.svelte";
    import Project from "../components/Project.svelte";
    import Filter from "../components/Filter.svelte";
    import Card from "../components/Card.svelte";
    import Icon from "../components/Icon.svelte";

    // We should probably cache the outputs of each of the filter steps
    // independently. That way we only have to recompute the changed filter
    // step
    function project_is_visible(
        project,
        filter_text,
        filter_techs,
        filter_categories
    ) {
        filter_text = filter_text.toLowerCase();
        filter_techs = filter_techs.map((tech) => tech.toLowerCase());
        filter_categories = filter_categories.map((cat) => cat.toLowerCase());
        let visible = true;

        if (filter_text && filter_text !== "") {
            visible =
                visible &&
                (project.name.toLowerCase().includes(filter_text) ||
                    project.description.toLowerCase().includes(filter_text));
        }

        if (filter_techs.length > 0) {
            visible =
                visible &&
                filter_techs.some((tech) =>
                    project.technologies.some((project_tech) =>
                        project_tech.toLowerCase().includes(tech)
                    )
                );
        }

        if (filter_categories.length > 0) {
            visible =
                visible &&
                filter_categories.some((cat) =>
                    project.category.toLowerCase().includes(cat)
                );
        }

        return visible;
    }

    export let projects = [];

    let filter_text = "";
    let filter_techs = new Set();
    for (const project of projects) {
        for (const tech of project.technologies) {
            filter_techs.add(tech);
        }
    }
    filter_techs = Array.from(filter_techs);
    let filter_categories = new Set();
    for (const project of projects) {
        filter_categories.add(project.category);
    }
    filter_categories = Array.from(filter_categories);

    $: visible_projects = projects.filter((project) =>
        project_is_visible(
            project,
            filter_text,
            filter_techs,
            filter_categories
        )
    );
</script>

<Section title="Projects" id="projects">
    <ContentList>
        <div class="filter-header">
            <input
                type="text"
                bind:value={filter_text}
                placeholder="Search"
                class="filter-input"
            />
            <div class="search-icon">
                <Icon name="search" size="1.25em" />
            </div>
            <div class="category-filters">
                <Filter
                    filter_name="Technologies"
                    bind:filter_options={filter_techs}
                    use_icons={true}
                />
                <Filter
                    filter_name="Category"
                    bind:filter_options={filter_categories}
                />
            </div>
        </div>

        {#each visible_projects as project}
            <Project
                name={project.name}
                description={project.description}
                category={project.category}
                image={project.image.src}
                image_alt={project.image.alt}
                techs={project.technologies}
                links={project.links}
            />
        {/each}
    </ContentList>
</Section>

<style>
    .filter-header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        color: var(--theme-colors-label-text);
        transition: color var(--style-transition-theme);
    }

    .filter-header .search-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-inline: 0.75em;
        position: absolute;
        opacity: 0.8;
    }

    .filter-header input:hover + .search-icon {
        opacity: 1;
    }

    .filter-header input {
        background-color: var(--theme-colors-card-background);
        border: none;
        height: 2em;
        color: var(--theme-colors-text-body);
        transition: all var(--style-transition-theme);
        padding-inline: 3em;
        border-radius: 100px;
    }

    .filter-header input:focus:not(:focus-visible) {
        outline: none;
        box-shadow: 0 0 0 var(--style-border-width) var(--theme-colors-accent);
    }

    .category-filters {
        display: flex;
        flex-direction: row;
    }
</style>
