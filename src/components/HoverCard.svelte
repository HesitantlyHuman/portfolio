<div>
    <slot />
</div>

<style>
    div {
        position: relative;
        overflow: hidden;
        border-radius: 12px;
        box-shadow: 2px 6px 8px rgba(0, 0, 0, 0.1);
        background-color: #fff;
        transition: all 0.2s ease;
    }

    /* div:hover {
        box-shadow: 3px 8px 12px rgba(0, 0, 0, 0.12);
        transition: all 0.2s ease;
        transform: scale(1.004);
    } */
</style>
