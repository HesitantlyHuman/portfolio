<script>
    import Section from "../components/Section.svelte";
    import ContentList from "../components/ContentList.svelte";
    import ExperienceCard from "../components/ExperienceCard.svelte";
</script>

<Section title="Experience">
    <ContentList>
        <ExperienceCard
            company="Opsis Health"
            position="Machine Learning Consultant"
            duration="Jan 2022 - Present"
            description="Use python and pytorch to build, train and test various point cloud volume estimation models for upcoming Opsis health product. Implement and optimize new point cloud network methods based on recent white papers. Coordinate with deployment team to develop model pipeline and retraining strategies."
            link="https://www.opsishealth.com/"
        />
        <ExperienceCard
            company="Branch"
            position="Machine Learning Specialist"
            duration="Aug 2021 - Apr 2022"
            description="Did some stuff ¯\_(ツ)_/¯"
            link="https://github.com/with-branch"
        />
        <ExperienceCard
            company="Branch"
            position="Technical Lead"
            duration="Apr 2022 - Jan 2023"
            description="Did some stuff ¯\_(ツ)_/¯"
            link="https://github.com/with-branch"
        />
        <ExperienceCard
            company="University of Utah"
            position="Research Assistant"
            duration="Jan 2021 - Present"
            description="Worky worky"
            link="https://www.math.utah.edu/"
        />
    </ContentList>
</Section>
