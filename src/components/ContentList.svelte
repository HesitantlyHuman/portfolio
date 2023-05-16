<script>
    import Icon from "./Icon.svelte";

    export let expandable = false;
    let open = !expandable;

    function toggleContentList() {
        open = !open;
    }
</script>

<div class="list-container" style="height:{open ? 'fit-content' : '80em'}">
    <slot />
    {#if expandable}
        <div class="fade-element" style={open ? "visibility:hidden" : ""} />
        <button class="list-control" on:click={toggleContentList}>
            <p>{open ? "See Less" : "See More"}</p>
            <Icon name={open ? "chevron-up" : "chevron-down"} size="1.5em" />
        </button>
    {/if}
</div>

<style>
    .list-container {
        background-color: var(--theme-colors-section);
        padding: 2.5em;
        border-radius: 12px;
        overflow: hidden;
        transition: background-color var(--style-transition-theme);
        height: 80em;
        position: relative;
    }

    .list-container :global(> *) {
        display: block;
        margin: 1.5em 0;
    }

    .list-container :global(> *:first-child) {
        margin-top: 0;
    }

    .list-container :global(> *:last-child) {
        margin-bottom: 0;
    }

    .fade-element {
        position: absolute;
        margin: 0;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 10em;
        pointer-events: none;
        background: none;
        background: linear-gradient(
            rgba(0, 0, 0, 0),
            var(--theme-colors-section) 80%
        );
    }

    .list-control {
        position: absolute;
        width: 14em;
        bottom: 2em;
        left: 0;
        right: 0;
        margin: 0 auto;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        padding-inline: 2em;
        border-radius: 12px;
        background-color: var(--theme-colors-section);
        color: var(--theme-colors-label-text);
        border: var(--style-border-width) solid var(--theme-colors-label-text);
        transition: background-color var(--style-transition-theme),
            color var(--style-transition-theme),
            border-color var(--style-transition-theme);
    }

    p {
        margin: 0;
        padding: 0;
        margin-right: 0.5em;
        font-size: 1.25em;
    }
</style>
