<script lang="ts">
    let {
        onclick = () => {},
        color = "blue",
        classes = "",
        children,
        disabled = false,
    } = $props<{
        onclick?: (e: MouseEvent) => void;
        color?: "blue" | "red" | "white";
        classes?: string;
        children?: any;
        disabled?: boolean;
    }>();
</script>

<button
    {disabled}
    type="button"
    {onclick}
    class="{classes} cursor-pointer rounded items-center
    text-center font-bold hover:text-white focus:border-transparent focus:ring-2 focus:ring-white focus:outline-none
    transition duration-100 bg-transparent
    {disabled
        ? 'text-gray-600'
        : color == 'red'
          ? 'text-red-500'
          : color == 'blue'
            ? 'text-blue-500'
            : 'text-white'}
    "
    >{@render children()}
</button>
