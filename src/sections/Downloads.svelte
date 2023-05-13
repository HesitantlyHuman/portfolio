<script>
    import Section from "../components/Section.svelte";
    import DownloadCard from "../components/DownloadCard.svelte";

    export let downloads = [];
</script>

<Section title="Downloads" id="downloads">
    <ul>
        {#each downloads as download}
            <li>
                <DownloadCard
                    name={download.name}
                    file_size={download.file_size}
                    download_url={download.url}
                    preview_image={download.image.src}
                    preview_image_alt={download.image.alt}
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
