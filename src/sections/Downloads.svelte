<script>
    import Section from "../components/Section.svelte";
    import DownloadCard from "../components/DownloadCard.svelte";
</script>

<Section title="Downloads" id="downloads">
    <ul>
        <li>
            <DownloadCard
                name="Resume"
                file_size="123kb"
                download_url="downloads/resume.pdf"
                preview_image="images/resume.webp"
            />
        </li>
        <li>
            <DownloadCard
                name="CV"
                file_size="123kb"
                download_url="downloads/cv.pdf"
                preview_image="images/cv.webp"
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
    }

    ul li {
        margin-inline: 2em;
        width: 40em;
    }

    ul li:first-child {
        margin-inline: 0;
    }
</style>
