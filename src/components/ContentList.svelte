<div>
    <slot />
</div>

<style>
    div {
        background-color: var(--theme-colors-section);
        padding: 2.5em;
        border-radius: 12px;
        transition: background-color var(--style-transition-theme);
    }

    div :global(> *) {
        display: block;
        margin: 1.5em 0;
    }

    div :global(> *:first-child) {
        margin-top: 0;
    }

    div :global(> *:last-child) {
        margin-bottom: 0;
    }
</style>
