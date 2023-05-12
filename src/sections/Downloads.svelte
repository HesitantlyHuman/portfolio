<script>
    import Section from "../components/Section.svelte";
    import DownloadCard from "../components/DownloadCard.svelte";

    import resume_preview_transformed from "/src/images/resume.png?format=webp&w=340&aspect=1:1";
    import cv_preview_transformed from "/src/images/cv.png?format=webp&w=340&aspect=1:1";

    export let downloads = [];
</script>

<Section title="Downloads" id="downloads">
    <ul>
        {#each downloads as download}
            <li>
                <DownloadCard
                    name={download.name}
                    file_size={download.file_size}
                    download_url={download.download_url}
                    preview_image={download.preview_image}
                />
            </li>
        {/each}
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
