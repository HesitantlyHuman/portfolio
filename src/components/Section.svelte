<script>
    export let title;
</script>

<section>
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
        padding-bottom: 0.5em;
    }

    h2 {
        margin: 0;
        padding-bottom: 0.5em;
    }
</style>
