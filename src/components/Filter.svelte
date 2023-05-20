<script>
    import { onMount } from "svelte";
    import Icon from "./Icon.svelte";

    export let filter_name;
    export let use_icons = false;
    export let filter_options = [];
    export let filter_state = {};

    for (let filter_name of filter_options) {
        filter_state[filter_name] = false;
    }
    filter_state["all"] = true;

    let possible_filter_items = filter_options;
    possible_filter_items.splice(0, 0, "all");

    function toggleFilter(filter_name) {
        filter_state[filter_name] = !filter_state[filter_name];

        if (filter_name == "all") {
            for (let filter_name of possible_filter_items) {
                if (filter_name != "all") {
                    filter_state[filter_name] = !filter_state["all"];
                }
            }
        } else {
            filter_state["all"] = true;
            for (let filter_name of possible_filter_items) {
                if (filter_name != "all" && filter_state[filter_name]) {
                    filter_state["all"] = false;
                }
            }
        }

        if (filter_state["all"]) {
            filter_options = Object.keys(filter_state).filter(
                (filter_name) => filter_name != "all"
            );
        } else {
            filter_options = Object.keys(filter_state).filter(
                (filter_name) =>
                    filter_state[filter_name] && filter_name != "all"
            );
        }

        filter_state = filter_state;
    }

    let dropdown_open = false;

    function toggleDropdown() {
        dropdown_open = !dropdown_open;
    }
</script>

<div class="dropdown">
    <button class="dropdown-header" on:click={toggleDropdown}>
        <h4>{filter_name}</h4>
        <div class="dropdown-arrow">
            <Icon name="chevron-down" size="1em" />
        </div>
    </button>
    {#if dropdown_open}
        <ul>
            {#each possible_filter_items as filter_item}
                <li>
                    <button
                        type="checkbox"
                        class="filter-toggle"
                        on:click={() => {
                            toggleFilter(filter_item);
                        }}
                    >
                        <input
                            type="checkbox"
                            class="filter-checkbox"
                            checked={filter_state[filter_item]}
                        />
                        <div class="filter-text">
                            <h4>
                                {filter_item.toUpperCase()}
                            </h4>
                            {#if use_icons && filter_item != "all"}
                                <div class="filter-icon">
                                    <Icon name={filter_item} size="1.2em" />
                                </div>
                            {/if}
                        </div>
                    </button>
                </li>
            {/each}
        </ul>
    {/if}
</div>

<style>
    .dropdown {
        position: relative;
        display: flex;
        width: 14em;
        margin-left: 1.5em;
    }

    .dropdown-header {
        margin-left: auto;
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    button {
        display: flex;
        color: var(--theme-colors-text-body);
        transition: color var(--style-transition-theme);
        opacity: 0.8;
        background-color: transparent;
        border: none;
    }

    button h4 {
        margin: 0;
        font-size: 1em;
        color: var(--theme-colors-text-body);
        transition: color var(--style-transition-theme);
    }

    .dropdown-arrow,
    .filter-icon {
        margin-left: 0.5em;
        display: flex;
        align-items: center;
    }

    .filter-icon {
        margin-left: 1em;
    }

    button:hover {
        color: var(--theme-colors-text-header);
        opacity: 1;
        cursor: pointer;
    }

    ul {
        top: 100%;
        width: 100%;
        position: absolute;
        background-color: var(--theme-colors-card-background);
        transition: background-color var(--style-transition-theme);
        display: flex;
        flex-direction: column;
        list-style: none;
        margin: 0;
        margin-top: 0.5em;
        padding-inline: 0;
        padding-block: 0.7em;
        z-index: 1;
        border-radius: 12px;
        box-shadow: 2px 6px 8px rgba(0, 0, 0, 0.18);
    }

    .filter-toggle {
        margin: 0;
        width: 100%;
        justify-content: space-between;
    }

    .filter-toggle:hover {
        background-color: var(--theme-colors-label-background);
    }

    .filter-text {
        margin-right: 1em;
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .filter-checkbox {
        appearance: none;
        width: 1.3em;
        height: 1.3em;
        border-radius: 20%;
        border: var(--style-border-width) solid var(--theme-colors-label-border);
        box-shadow: inset 0 0 0 0.15em var(--theme-colors-card-background);
        background-color: var(--theme-colors-card-background);
        transition: box-shadow var(--style-transition-theme),
            background-color var(--style-transition-theme);
        margin-inline: 1em;
    }

    .filter-checkbox:checked {
        background-color: var(--theme-colors-card-highlight);
    }
</style>
