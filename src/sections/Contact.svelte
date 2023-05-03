<script>
    import Icon from "../components/Icon.svelte";
    import ContentColumn from "../components/ContentColumn.svelte";

    export let contacts = [
        {
            name: "Email",
            text: "none@gmail.com",
            link: "mailto:none@gmail.com",
        },
        {
            name: "LinkedIn",
            text: "/none",
            link: "https://www.linkedin.com/in/none/",
        },
        {
            name: "GitHub",
            text: "/none",
            link: "https://www.github.com/none/",
        },
    ];
</script>

<footer id="contact">
    <h2>Contact</h2>
    <div class="contact">
        {#each contacts as contact}
            <a href={contact.link}>
                <div class="icon">
                    <Icon name={contact.name} size="2em" color="white" />
                </div>
                <p>{contact.text}</p>
            </a>
        {/each}
    </div>
</footer>

<style>
    footer {
        background-color: #9ba0a2;
        border-radius: 12px 12px 0 0;
        overflow: hidden;
    }

    footer h2 {
        color: #fff;
        background-color: #697276;
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
    }

    footer .contact a p {
        color: #fff;
    }
</style>
