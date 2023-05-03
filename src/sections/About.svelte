<script>
    import Card from "../components/Card.svelte";

    export let name = "Tanner Sims";
    export let about_text = "About text";
</script>

<Card>
    <section id="about">
        <h1>{name}</h1>
        <p>{about_text}</p>
    </section>
</Card>

<style>
    section {
        padding: 4em;
    }
</style>
