<script>
    import Card from "./Card.svelte";
    import Icon from "./Icon.svelte";

    export let filter_name;
    export let use_icons = false;
    export let filter_options = [];
    export let filter_state = {};

    for (let filter_name of filter_options) {
        filter_state[filter_name] = true;
    }
    filter_state["all"] = true;

    let possible_filter_items = filter_options;
    possible_filter_items.splice(0, 0, "all");

    function toggleFilter(filter_name) {
        if (filter_name == "all") {
            for (let filter_name of possible_filter_items) {
                filter_state[filter_name] = true;
            }
        } else {
            filter_state["all"] = false;
            filter_state[filter_name] = !filter_state[filter_name];
        }

        filter_options = Object.keys(filter_state).filter(
            (filter_name) => filter_state[filter_name]
        );
        filter_state = filter_state;
    }

    let dropdown_open = false;

    function toggleDropdown() {
        dropdown_open = !dropdown_open;
    }
</script>

<!-- <Card> -->
<div class="dropdown">
    <button class="dropdown-header" on:click={toggleDropdown}>
        <h4>{filter_name + " ⌄"}</h4>
    </button>
    {#if dropdown_open}
        <ul>
            {#each possible_filter_items as filter_item}
                <button
                    type="checkbox"
                    class={filter_state[filter_item] ? "" : "filter-off"}
                    on:click={() => {
                        toggleFilter(filter_item);
                    }}
                >
                    <li>
                        <div
                            class="filter-checkbox {filter_state[filter_item]
                                ? 'checkbox-on'
                                : 'checkbox-off'}"
                        />
                        <h4>{filter_item.toUpperCase()}</h4>
                        {#if use_icons && filter_item != "all"}
                            <Icon
                                name={filter_item}
                                size="1.2em"
                                color="var(--theme-colors-label-text)"
                            />
                        {/if}
                    </li>
                </button>
            {/each}
        </ul>
    {/if}
</div>

<!-- </Card> -->

<style>
    .dropdown {
        position: relative;
        display: flex;
        width: 18em;
        margin-left: 1.5em;
    }

    .dropdown-header {
        margin-left: auto;
    }

    .dropdown-header h4 {
        color: var(--theme-colors-text-body);
        opacity: 0.8;
    }

    .dropdown-header:hover h4 {
        color: var(--theme-colors-text-header);
        opacity: 1;
    }

    .dropdown button:hover {
        cursor: pointer;
    }

    .dropdown button {
        background-color: transparent;
        border: none;
    }

    ul {
        top: 100%;
        width: 100%;
        position: absolute;
        background-color: var(--theme-colors-card-background);
        display: flex;
        flex-direction: column;
        list-style: none;
        padding-inline: 0;
        padding-block: 0.7em;
        margin: 0;
        z-index: 1;
        border-radius: 12px;
        box-shadow: 2px 6px 8px rgba(0, 0, 0, 0.15);
    }

    /* button {
        background-color: var(--theme-colors-label-background);
        border: 2px solid var(--theme-colors-label-border);
        border-radius: 5em;
        padding: 0.5em;
    } */

    button li {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding-inline: 1em;
    }

    .filter-off {
        background-color: var(--theme-colors-card-background);
    }

    h4 {
        margin: 0;
        font-size: 1em;
        color: var(--theme-colors-label-text);
    }

    .filter-checkbox {
        width: 1.3em;
        height: 1.3em;
        border-radius: 25%;
        border: var(--theme-style-border-width) solid
            var(--theme-colors-label-border);
        margin-inline: 1em;
    }

    .checkbox-on {
        background-color: var(--theme-colors-label-border);
    }

    .checkbox-off {
        background-color: var(--theme-colors-card-background);
    }
</style>
