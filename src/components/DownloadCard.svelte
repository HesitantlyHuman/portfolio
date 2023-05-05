<script>
    import HoverCard from "../components/HoverCard.svelte";
    import Icon from "../components/Icon.svelte";

    export let name = "Download Name";
    export let file_size = "0kb";
    export let download_url = "";
    export let preview_image = "";
</script>

<a href={download_url}>
    <HoverCard>
        <div class="image">
            <img src={preview_image} alt="Resume" />
        </div>
        <div class="info-bar">
            <div class="title-block">
                <h3>{name}</h3>
                <p>{file_size}</p>
            </div>
            <Icon name="download" size="2em" color="white" />
        </div>
    </HoverCard>
</a>

<style>
    .image {
        width: 100%;
        height: 20em;
        background-color: #f2f1f0;
    }

    .info-bar {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        background-color: #9ba0a2;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding-inline: 2em;
        padding-block: 1em;
        box-sizing: border-box;
    }

    .info-bar .title-block {
        display: flex;
        flex-direction: column;
    }

    .info-bar .title-block h3 {
        margin: 0;
        padding: 0;
        color: #fff;
    }

    .info-bar .title-block p {
        margin: 0;
        padding: 0;
        color: #fff;
    }

    a {
        text-decoration: none;
    }
</style>
