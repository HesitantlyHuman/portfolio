<script>
    import Card from "./Card.svelte";

    export let company = "Company Name";
    export let position = "Position";
    export let duration = "Jan 1900 - Present";
    export let description = "One of the jobs of all jobs.";
    export let link = null;
</script>

<div class="hover-region">
    <article>
        <Card>
            <div class="card">
                <div class="info">
                    <h3>{company}</h3>
                    <h4>{position.toUpperCase()}</h4>
                    <summary><p>{description}</p></summary>
                    {#if link}
                        <a href={link.url}> <footer>{link.name}</footer></a>
                    {/if}
                </div>
                <div class="style_box" />
            </div>
        </Card>
        <div class="triangle">
            <div class="background-triangle" />
            <div class="highlight-triangle" />
        </div>
        <div class="duration">
            <p>{duration}</p>
        </div>
    </article>
</div>

<style>
    .hover-region {
        margin: 0;
    }

    :root {
        --local-colors-accent: var(--theme-colors-card-accent);
    }

    article {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: 0.75em 0;
    }

    article .duration {
        flex: 1;
        margin-left: 6em;
    }

    article .card {
        border-radius: 12px;
        display: flex;
        flex-direction: row;
        background-color: var(--theme-colors-card-background);
        width: 50em;
        max-height: 12em;
        box-shadow: 0 0 0 var(--style-border-width)
            var(--theme-colors-card-background) inset;
        transition: box-shadow var(--style-transition-theme),
            background-color var(--style-transition-theme),
            width 0.3s ease-in-out, max-height 0.3s ease-in-out;
    }

    article:is(:hover, :focus-within) {
        --local-colors-accent: var(--theme-colors-card-highlight);
    }

    article:is(:hover, :focus-within) .card {
        box-shadow: 0 0 0 var(--style-border-width) var(--local-colors-accent)
            inset;
        width: 53.5em;
        max-height: 30em;
    }

    article .card .style_box {
        background-color: var(--local-colors-accent);
        transition: background-color var(--style-transition-theme);
        width: 7em;
    }

    article .duration p {
        color: var(--local-colors-accent);
        transition: color var(--style-transition-theme);
        font-family: "Work Sans", sans-serif;
        font-weight: 400;
        text-align: center;
        font-size: 1.25em;
    }

    article .card .info {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding-inline: 4em;
        padding-block: 3em;
        margin-left: auto;
        flex: 1;
    }

    article .card .info h3 {
        padding: 0;
        margin: 0;
    }

    article .card .info h4 {
        color: #9ba0a2;
        padding: 0;
        margin-top: 0.3em;
    }

    article:is(:hover, :focus-within) .card .info summary {
        height: 100%;
    }

    article .card .info summary {
        height: 0;
        overflow: hidden;
        transition: height 0.3s ease-in-out;
    }

    article:is(:hover, :focus-within) .card .info footer {
        display: block;
    }

    article .card .info footer {
        display: none;
    }

    a {
        text-decoration: none;
        color: var(--local-colors-accent);
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

    .triangle {
        position: relative;
    }

    .highlight-triangle {
        position: absolute;
        top: -1.125em;
        width: 0;
        height: 0;
        border-top: 1.125em solid transparent;
        border-bottom: 1.125em solid transparent;
        z-index: 1;
        border-left: 1.8em solid var(--local-colors-accent);
        transition: border-left var(--style-transition-theme);
    }

    .background-triangle {
        position: absolute;
        top: -2em;
        width: 0;
        height: 0;
        border-top: 2em solid transparent;
        border-bottom: 2em solid transparent;
        z-index: 1;

        border-left: 3em solid var(--theme-colors-section);
        transition: border-left var(--style-transition-theme);
    }
</style>
