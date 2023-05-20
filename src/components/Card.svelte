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
        box-shadow: 4px 12px 12px rgba(0, 0, 0, 0.125);
    }
</style>
