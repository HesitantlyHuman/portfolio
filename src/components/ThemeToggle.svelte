<script>
    import Icon from "./Icon.svelte";

    export let theme_function;
    export let theme = "dark";

    let toggle_left = true;

    function toggle_theme() {
        toggle_left = !toggle_left;
        theme_function(toggle_left);
    }
</script>

<div class="toggle-container" aria-hidden="true">
    <div class="toggle-button" on:click={toggle_theme}>
        <div class="toggle-notch" />
        <div class="toggle-nob" style="left:{toggle_left ? '0.5em' : '2em'}">
            <Icon name={theme} size="1.15em" />
        </div>
    </div>
</div>

<style>
    .toggle-container {
        margin-left: 1em;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .toggle-button {
        width: 4em;
        height: 2em;
        border-radius: 1em;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .toggle-button:hover {
        cursor: pointer;
    }

    .toggle-notch {
        width: 2em;
        height: 0.7em;
        border-radius: 100px;
        background-color: var(--theme-colors-card-highlight);
        transition: background-color var(--style-transition-theme);
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .toggle-nob {
        width: 1.5em;
        height: 1.5em;
        border-radius: 50%;
        background-color: var(--theme-colors-card-accent);
        transition: background-color var(--style-transition-theme);
        color: var(--theme-colors-text-ondark);
        transition: color var(--style-transition-theme);
        transition: color var(--style-transition-theme);
        position: absolute;
        transition: left 0.2s ease-in-out;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
