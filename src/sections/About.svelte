<script>
    import Icon from "../components/Icon.svelte";
    import Card from "../components/Card.svelte";

    export let name = "Tanner Sims";
    export let about_text = "About text";
</script>

<Card>
    <section id="about">
        <h1>{name}</h1>
        <p>{about_text}</p>
        <ul>
            <li>
                <Icon name="github" size="2em" />
            </li>
            <li>
                <Icon name="linkedin" size="2em" />
            </li>
        </ul>
    </section>
</Card>

<style>
    section {
        padding: 4em;
    }

    section ul {
        display: flex;
        flex-direction: row;
        list-style: none;
        padding-inline: 0;
        padding-block: 1em;
    }

    section ul > li {
        margin-inline: 1.5em;
    }

    section ul > li:first-child {
        margin-inline: 0;
    }
</style>
