<script lang="ts">
    let {
        onclick = () => {},
        color = "blue",
        classes = "",
        children,
    } = $props<{
        onclick?: () => void;
        color?: "blue" | "red" | "white";
        classes?: string;
        children?: any;
    }>();
</script>

<button
    {onclick}
    class="{classes} cursor-pointer rounded items-center
    text-center font-bold hover:text-white focus:border-transparent focus:ring-2 focus:ring-white focus:outline-none
    transition duration-100 bg-transparent
    {color == 'red'
        ? 'text-red-500'
        : color == 'blue'
          ? 'text-blue-500'
          : 'text-white'}
    p-2
    "
    >{@render children()}
</button>
