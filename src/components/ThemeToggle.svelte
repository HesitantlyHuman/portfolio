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

<div class="toggle-container">
    <div class="toggle-button" on:click={toggle_theme}>
        <div class="toggle-notch" />
        <div class="toggle-nob" style="left:{toggle_left ? '0.5em' : '2em'}">
            <Icon name={theme} color="white" size="1.25em" />
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
        position: absolute;
        transition: left 0.2s ease-in-out;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
