<script>
    import Section from "../components/Section.svelte";
    import ContentList from "../components/ContentList.svelte";
    import Project from "../components/Project.svelte";
</script>

<Section title="Projects" id="projects">
    <ContentList>
        <Project
            name="Open Lyrics Dataset"
            description="A dataset of song lyrics"
            category="Data collection"
            techs={["Python", "GitHub"]}
            links={[
                {
                    name: "GitHub",
                    url: "https://github.com/HesitantlyHuman/open-lyrics-dataset",
                },
            ]}
        />
        <Project
            name="Generating structured latent spaces with VAEs"
            description="Implementation of a novel method for deep archetypal analysis, with the aim of creating highly interpretable latent spaces."
            category="Machine learning"
            image="images/graph_theory.webp"
            techs={["Python", "PyTorch"]}
            links={[
                {
                    name: "GitHub",
                    url: "",
                },
                {
                    name: "Paper",
                    url: "",
                },
            ]}
        />
    </ContentList>
</Section>
