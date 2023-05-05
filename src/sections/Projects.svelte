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
            image="images/lyrics.jpg"
            image_alt="lyrics on sheet music"
            techs={["Python"]}
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
            image="images/nebula.webp"
            image_alt="a nebula"
            techs={["Python", "PyTorch"]}
            links={[
                {
                    name: "GitHub",
                    url: "https://github.com/HesitantlyHuman/hatespace",
                },
                {
                    name: "Paper",
                    url: "",
                },
            ]}
        />
        <Project
            name="Calculating optimal bets in CamelUp"
            description="Ever played this obscure yet fun board game, and felt a burning desire to win at all costs? Well, you're in luck! I spent far too many hours of my life creating the stockcamel engin in high performance, multi-threaded rust."
            category="Game theory"
            image="images/dice.jpg"
            image_alt="Black and white dice"
            techs={["Rust", "Python"]}
            links={[
                {
                    name: "GitHub",
                    url: "",
                },
                {
                    name: "Link",
                    url: "",
                },
            ]}
        />
    </ContentList>
</Section>
