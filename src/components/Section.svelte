<script>
    export let title;
    export let id;
</script>

<section {id}>
    {#if title}
        <p aria-hidden="true">=================================</p>
        <h2 class="section-title" tabindex="-1">{title}</h2>
    {/if}
    <slot />
</section>

<style>
    section {
        margin-bottom: 3em;
    }

    p {
        color: #697276;
        font-family: "Work Sans", sans-serif;
        font-weight: 500;
        font-size: 1.8em;
        margin: 0;
        height: 0.6em;
    }

    h2 {
        margin: 0;
        padding: 0.5em;
    }
</style>
