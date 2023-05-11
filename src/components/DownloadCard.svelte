<script>
    import Card from "../components/Card.svelte";
    import Icon from "../components/Icon.svelte";

    export let name = "Download Name";
    export let file_size = "0kb";
    export let download_url = "";
    export let preview_image = "";
</script>

<a href={download_url}>
    <Card hover={true}>
        <div class="image">
            <img src={preview_image} alt="Resume" />
        </div>
        <div class="info-bar">
            <div class="title-block">
                <h3>{name}</h3>
                <p>{file_size}</p>
            </div>
            <div class="download-icon">
                <Icon name="download" size="2em" />
            </div>
        </div>
    </Card>
</a>

<style>
    .image {
        width: 100%;
        height: 20em;
        background-color: var(--theme-colors-section);
        transition: background-color var(--style-transition-theme);
    }

    .info-bar {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        background-color: var(--theme-colors-card-dark);
        transition: background-color var(--style-transition-theme);
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

    .download-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
    }
</style>
