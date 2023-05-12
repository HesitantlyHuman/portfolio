<script>
    import Icon from "../components/Icon.svelte";
    import ContentColumn from "../components/ContentColumn.svelte";

    export let contacts = [];
</script>

<footer id="contact">
    <h2 class="section-title" tabindex="-1">Contact</h2>
    <div class="contact">
        {#each contacts as contact}
            <a href={contact.link}>
                <div class="icon">
                    <Icon name={contact.name} size="2em" />
                </div>
                <p>{contact.text}</p>
            </a>
        {/each}
    </div>
</footer>

<style>
    footer {
        background-color: var(--theme-colors-contact-body);
        transition: background-color var(--style-transition-theme);
        border-radius: 12px 12px 0 0;
        overflow: hidden;
    }

    footer h2 {
        color: #fff;
        background-color: var(--theme-colors-contact-header);
        transition: background-color var(--style-transition-theme);
        padding-block: 0.5em;
        padding-inline: 1em;
        margin: 0;
    }

    footer .contact {
        padding-block: 2em;
        padding-inline: 5em;
    }

    footer .contact a {
        display: flex;
        flex-direction: row;
        text-decoration: none;
        align-items: center;
    }

    footer .contact a .icon {
        width: 3em;
        padding: 0;
        margin: 0;
        display: flex;
        align-items: center;
        color: var(--theme-colors-text-ondark);
        transition: color var(--style-transition-theme);
    }

    footer .contact a p {
        color: var(--theme-colors-text-ondark);
        transition: color var(--style-transition-theme);
    }
</style>
