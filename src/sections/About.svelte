<script>
    import Icon from "../components/Icon.svelte";
    import Card from "../components/Card.svelte";
    import Section from "../components/Section.svelte";

    export let name = "Tanner Sims";
    export let about_text = "About text";
</script>

<Section id="about">
    <div id="about-spacer" style="height: 3em;" />
    <Card>
        <div class="about-card">
            <div class="content">
                <h1>{name}</h1>
                <p>{about_text}</p>
                <ul>
                    <li>
                        <Icon name="github" size="2em" />
                    </li>
                    <li>
                        <Icon name="linkedin" size="2em" use_color={false} />
                    </li>
                </ul>
            </div>
            <div class="headshot">
                <Icon name="logo" size="15em" />
            </div>
        </div>
    </Card>
</Section>

<style>
    .about-card {
        padding-inline: 7.5em;
        padding-block: 10em;
        background-color: var(--theme-colors-hero-background);
        transition: background-color var(--style-transition-theme);
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }

    .about-card ul {
        display: flex;
        flex-direction: row;
        list-style: none;
        padding-inline: 0;
        padding-block: 1em;
    }

    .about-card ul > li {
        margin-inline: 1.5em;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--theme-colors-text-body);
        transition: color var(--style-transition-theme);
    }

    .about-card ul > li:first-child {
        margin-inline: 0;
    }

    .about-card .headshot {
        background-color: var(--theme-colors-hero-highlight);
        transition: background-color var(--style-transition-theme);
        width: 19em;
        height: 19em;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
