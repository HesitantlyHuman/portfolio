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
        /* height: 26em; */
        width: 60em;
    }

    article:hover .card {
        box-shadow: 0 0 0 2px #9ba0a2 inset;
    }

    article .card .style_box {
        background-color: #cdcecf;
        width: 10em;
    }

    article:hover .card .style_box {
        background-color: #9ba0a2;
    }

    article .duration p {
        color: #9ba0a2;
        font-family: "Work Sans", sans-serif;
        font-weight: 400;
        text-align: center;
    }

    article:hover .duration p {
        color: #697276;
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

    article:hover .card .info summary {
        height: 100%;
    }

    article .card .info summary {
        height: 0;
        overflow: hidden;
        transition: 0.8s ease-in-out;
    }

    article:hover .card .info footer {
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

    article .info footer {
        margin-top: auto;
    }
</style>
