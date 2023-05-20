<script>
    import Section from "../components/Section.svelte";
    import ContentList from "../components/ContentList.svelte";
    import ExperienceCard from "../components/ExperienceCard.svelte";

    export let experience = [];
</script>

<Section title="Experience" id="experience">
    <ContentList>
        <hr />
        {#each experience as job}
            <ExperienceCard
                company={job.company}
                position={job.position}
                duration={job.duration}
                description={job.description}
                link={job.link}
            />
        {/each}
    </ContentList>
</Section>

<style>
    hr {
        position: absolute;
        top: 0;
        right: 22em;
        margin: 0;
        width: 0;
        height: 100%;
        border-bottom: var(--style-border-width) solid
            var(--theme-colors-card-accent);
    }
</style>
