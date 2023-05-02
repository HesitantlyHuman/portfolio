<script>
    export let name;
    export let color = "black";
    export let size = "2em";

    name = name.toLowerCase();
</script>

{#if name === "python"}
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="3 3 24.5 24.5"
        fill={color}
        height={size}
    >
        <path
            d="M13 3a4 4 0 0 0-4 4v1h5a1 1 0 0 1 0 2H7a4 4 0 0 0-4 4v4a4 4 0 0 0 4 4h1v-5a3 3 0 0 1 3-3h8a1 1 0 0 0 1-1V7a4 4 0 0 0-4-4h-3zm-1 2a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm10 3v5a3 3 0 0 1-3 3h-8a1 1 0 0 0-1 1v6a4 4 0 0 0 4 4h3a4 4 0 0 0 4-4v-1h-5a1 1 0 0 1 0-2h7a4 4 0 0 0 4-4v-4a4 4 0 0 0-4-4h-1zm-4 15a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"
        />
    </svg>
{:else if name === "pytorch"}
    <svg
        xmlns="http://www.w3.org/2000/svg"
        xml:space="preserve"
        viewBox="278 200 85 85"
        height={size}
        fill={color}
        ><path
            d="m63.1 28.3-6.6 6.6a27.3 27.3 0 0 1 0 38.8 27.3 27.3 0 0 1-38.8 0 27.3 27.3 0 0 1 0-38.8l17.1-17.1 2.4-2.4V2.5L11.4 28.3a36.7 36.7 0 0 0 0 52 36.3 36.3 0 0 0 51.7 0 36.7 36.7 0 0 0 0-52Z"
            style="stroke:none;stroke-width:1;stroke-dasharray:none;stroke-linecap:butt;stroke-dashoffset:0;stroke-linejoin:miter;stroke-miterlimit:4;fill-rule:nonzero;opacity:1"
            transform="translate(282.9 193.5)"
        /><path
            d="M55 21.9a4.8 4.8 0 1 1-9.6 0 4.8 4.8 0 0 1 9.6 0Z"
            style="stroke:none;stroke-width:1;stroke-dasharray:none;stroke-linecap:butt;stroke-dashoffset:0;stroke-linejoin:miter;stroke-miterlimit:4;fill-rule:nonzero;opacity:1"
            transform="translate(282.9 193.5)"
        /></svg
    >
{:else if name === "logo"}
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="10.5 8 79 79"
        height={size}
        ><path
            fill="#000"
            d="M50.5 86.74c-15.82 0-28.66-12.04-28.66-26.86l.06-15.75c0-8.65 9.03-16.07 18.25-16.07H62.6c8.27 0 16.57 8.32 16.57 16.07v15.75c0 14.82-12.84 26.86-28.66 26.86Z"
        /><path
            fill="#E6E5E5"
            d="M50.5 83.14c-13.88 0-25.14-10.56-25.14-23.57V45.4c0-7.58 6.68-13.73 14.77-13.73H61.8c7.26 0 13.84 6.93 13.84 13.73v14.17c0 13-11.26 23.57-25.14 23.57Z"
        /><path
            fill="#000"
            d="M50.53 17.34c1.28 0 2.32.97 2.32 2.15v10.02c0 1.19-1.04 2.16-2.33 2.16h-.14c-1.23 0-2.23-.93-2.23-2.07V19.42c0-1.15 1-2.08 2.24-2.08h.14Z"
        /><path
            fill="#000"
            d="M50.5 7.93c5.16 0 9.34 3.92 9.34 8.76 0 4.83-4.18 8.75-9.34 8.75s-9.35-3.92-9.35-8.75c0-4.84 4.2-8.76 9.35-8.76Z"
        /><path
            fill="#E83422"
            d="M50.5 11.35c3.14 0 5.69 2.4 5.69 5.34s-2.55 5.33-5.69 5.33c-3.14 0-5.69-2.4-5.69-5.33 0-2.95 2.55-5.34 5.69-5.34Z"
        /><path
            fill="#697276"
            d="M30.6 63.56c5.24.99 9.26 4.93 10.08 9.87l1.38 8.34c-8.75-2.92-15.27-10.27-16.5-19.16l5.04.95Zm39.9 0c-5.23.99-9.25 4.93-10.07 9.87l-1.38 8.34C67.8 78.85 74.3 71.5 75.54 62.61l-5.04.95Z"
        /><path
            fill="#000"
            d="M41.88 67.06c0-1.19 1.03-2.15 2.3-2.15h12.64c1.27 0 2.3.97 2.3 2.16 0 1.14-.99 2.06-2.2 2.06H44.09c-1.22 0-2.21-.93-2.21-2.07ZM29.96 49.78c0-2.67 2.32-4.84 5.18-4.84h31.05c2.68 0 4.85 2.03 4.85 4.54v7.02c0 2.51-2.18 4.55-4.87 4.55H35.15c-2.87 0-5.19-2.17-5.19-4.85v-6.42Z"
        /><path
            fill="#33BBD9"
            d="M38.12 50.59c0-1.57 1.36-2.84 3.05-2.84h.02c1.68 0 3.05 1.27 3.05 2.84v4.99h-6.12v-5Zm18.64 0c0-1.57 1.37-2.84 3.05-2.84h.02c1.69 0 3.05 1.27 3.05 2.84v4.99h-6.12v-5Z"
        /></svg
    >
{:else}
    <p style="font-size: {size}">{name}</p>
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
