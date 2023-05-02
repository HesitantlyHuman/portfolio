<div>
    <slot />
</div>

<style>
    div {
        background-color: #f2f1f0;
        padding: 2.5em;
        border-radius: 12px;
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
