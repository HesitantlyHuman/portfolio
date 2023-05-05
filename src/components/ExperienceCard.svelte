<script>
    import Card from "./Card.svelte";

    export let company = "Company Name";
    export let position = "Position";
    export let duration = "Jan 1900 - Present";
    export let description = "One of the jobs of all jobs.";
    export let link = "https://www.example.com/";
</script>

<article>
    <Card>
        <div class="card">
            <div class="info">
                <h3>{company}</h3>
                <h4>{position.toUpperCase()}</h4>
                <summary><p>{description}</p></summary>
                <footer>
                    <a href={link}>{company} Website ></a>
                </footer>
            </div>
            <div class="style_box" />
        </div>
    </Card>
    <div class="duration">
        <p>{duration}</p>
    </div>
</article>

<style>
    :root {
        --local-colors-accent: var(--theme-colors-card-accent);
    }

    article {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }

    article .duration {
        flex: 1;
        margin-left: 2em;
    }

    article .card {
        border-radius: 12px;
        display: flex;
        background-color: var(--theme-colors-card-background);
        width: 60em;
    }

    article:is(:hover, :focus-within) {
        --local-colors-accent: var(--theme-colors-card-highlight);
    }

    article:is(:hover, :focus-within) .card {
        box-shadow: 0 0 0 2px var(--local-colors-accent) inset;
    }

    article .card .style_box {
        background-color: var(--local-colors-accent);
        width: 10em;
    }

    article .duration p {
        color: var(--local-colors-accent);
        font-family: "Work Sans", sans-serif;
        font-weight: 400;
        text-align: center;
    }

    article .card .info {
        display: flex;
        flex-direction: column;
        padding-inline: 5em;
        padding-block: 3em;
        margin-left: auto;
        flex: 1;
    }

    article .card .info h4 {
        color: #9ba0a2;
    }

    article:is(:hover, :focus-within) .card .info summary {
        height: 100%;
    }

    article .card .info summary {
        height: 0;
        overflow: hidden;
        transition: 0.8s ease-in-out;
    }

    article:is(:hover, :focus-within) .card .info footer {
        height: 100%;
    }

    article .card .info footer {
        height: 0;
        overflow: hidden;
        transition: 0.8s ease-in-out;
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

    article .card .info footer a {
        color: var(--theme-colors-text-body);
    }
</style>
