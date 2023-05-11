<script>
    export let hover = false;
</script>

<div class={hover ? "hover" : ""}>
    <slot />
</div>

<style>
    div {
        position: relative;
        overflow: hidden;
        border-radius: 12px;
        box-shadow: 2px 6px 8px rgba(0, 0, 0, 0.1);
    }

    .hover:hover {
        box-shadow: 3px 8px 9px rgba(0, 0, 0, 0.135);
        /* transition: all 0.1s ease;
        transform: scale(1.002); */
    }
</style>
