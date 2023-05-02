<script>
    import Card from "./Card.svelte";

    export let company = "Company Name";
    export let position = "Position";
    export let duration = "Jan 1900 - Present";
    export let description = "One of the jobs of all jobs.";
    export let link = "https://www.example.com/";
</script>

<Card>
    <article>
        <div class="info">
            <h3>{company}</h3>
            <h4>{position}</h4>
            <p>{duration}</p>
            <summary><p>{description}</p></summary>
            <footer>
                <a href={link}>{company} Website ></a>
            </footer>
        </div>
        <div class="style_box" />
    </article>
</Card>

<style>
    article {
        border-radius: 12px;
        display: flex;
        height: 26em;
    }

    article:hover {
        box-shadow: 0 0 0 2px #9ba0a2 inset;
    }

    article .style_box {
        width: 18em;
        background-color: #cdcecf;
        margin: 0;
        padding: 0;
    }

    article:hover .style_box {
        background-color: #9ba0a2;
    }

    article .info {
        display: flex;
        flex-direction: column;
        width: 100%;
        padding-inline: 5em;
        padding-block: 3em;
    }

    article .info > * {
        margin-left: auto;
        text-align: right;
        margin: 0;
        margin-top: 0.5em;
    }

    article .info > *:first-child {
        margin-top: 1em;
    }

    article .info footer {
        margin-top: auto;
    }
</style>
