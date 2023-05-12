<script>
    import Section from "../components/Section.svelte";
    import ContentList from "../components/ContentList.svelte";
    import ExperienceCard from "../components/ExperienceCard.svelte";

    export let experience = [];
</script>

<Section title="Experience" id="experience">
    <ContentList>
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
