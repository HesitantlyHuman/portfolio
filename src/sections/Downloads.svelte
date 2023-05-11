<script>
    import Section from "../components/Section.svelte";
    import DownloadCard from "../components/DownloadCard.svelte";

    import resume_preview_transformed from "/src/images/resume.png?format=webp&w=340&aspect=1:1";
    import cv_preview_transformed from "/src/images/cv.png?format=webp&w=340&aspect=1:1";
</script>

<Section title="Downloads" id="downloads">
    <ul>
        <li>
            <DownloadCard
                name="Resume"
                file_size="123kb"
                download_url="downloads/resume.pdf"
                preview_image={resume_preview_transformed}
            />
        </li>
        <li>
            <DownloadCard
                name="CV"
                file_size="123kb"
                download_url="downloads/cv.pdf"
                preview_image={cv_preview_transformed}
            />
        </li>
    </ul>
</Section>

<style>
    ul {
        display: flex;
        flex-direction: row;
        list-style: none;
        padding-inline: 0;
        padding-block: 1em;
        justify-content: space-between;
    }

    ul li {
        width: 100%;
        padding-left: 3em;
    }

    ul li:first-child {
        padding-left: 0;
    }
</style>
