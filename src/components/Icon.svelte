<script>
    export let icon_name;
    export let color = "black";
    export let size = "2em";
</script>

{#if icon_name.toLowerCase() === "python"}
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 30 30"
        fill={color}
        height={size}
    >
        <path
            d="M13 3a4 4 0 0 0-4 4v1h5a1 1 0 0 1 0 2H7a4 4 0 0 0-4 4v4a4 4 0 0 0 4 4h1v-5a3 3 0 0 1 3-3h8a1 1 0 0 0 1-1V7a4 4 0 0 0-4-4h-3zm-1 2a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm10 3v5a3 3 0 0 1-3 3h-8a1 1 0 0 0-1 1v6a4 4 0 0 0 4 4h3a4 4 0 0 0 4-4v-1h-5a1 1 0 0 1 0-2h7a4 4 0 0 0 4-4v-4a4 4 0 0 0-4-4h-1zm-4 15a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"
        />
    </svg>
{:else if icon_name.toLowerCase() === "pytorch"}
    <svg
        xmlns="http://www.w3.org/2000/svg"
        xml:space="preserve"
        viewBox="0 0 640 480"
        height={size}
        fill={color}
        ><path
            d="m63.1 28.3-6.6 6.6a27.3 27.3 0 0 1 0 38.8 27.3 27.3 0 0 1-38.8 0 27.3 27.3 0 0 1 0-38.8l17.1-17.1 2.4-2.4V2.5L11.4 28.3a36.7 36.7 0 0 0 0 52 36.3 36.3 0 0 0 51.7 0 36.7 36.7 0 0 0 0-52Z"
            style="stroke:none;stroke-width:1;stroke-dasharray:none;stroke-linecap:butt;stroke-dashoffset:0;stroke-linejoin:miter;stroke-miterlimit:4;fill:#ee4c2c;fill-rule:nonzero;opacity:1"
            transform="translate(282.9 193.5)"
        /><path
            d="M55 21.9a4.8 4.8 0 1 1-9.6 0 4.8 4.8 0 0 1 9.6 0Z"
            style="stroke:none;stroke-width:1;stroke-dasharray:none;stroke-linecap:butt;stroke-dashoffset:0;stroke-linejoin:miter;stroke-miterlimit:4;fill:#ee4c2c;fill-rule:nonzero;opacity:1"
            transform="translate(282.9 193.5)"
        /></svg
    >
{:else}
    <p>{icon_name}</p>
{/if}

<style>
    p {
        padding: 0;
        margin: 0;
        height: 2em;
        text-align: center;
        vertical-align: middle;
        font-size: 0.8em;
        height: 100%;
    }
</style>
