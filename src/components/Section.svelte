<script>
    export let title;
    export let id;
</script>

<section {id}>
    <p>=================================</p>
    <h2>{title}</h2>
    <slot />
</section>

<style>
    p {
        color: #697276;
        font-family: "Work Sans", sans-serif;
        font-weight: 500;
        font-size: 1.8em;
        margin: 0;
        padding-top: 2em;
        height: 0.6em;
    }

    h2 {
        margin: 0;
        padding: 0.5em;
    }
</style>
