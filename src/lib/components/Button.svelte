<script lang="ts">
	let {
		onclick = () => {},
		color = "blue",
		classes = "",
		children,
	} = $props<{
		onclick?: (e: MouseEvent) => void;
		color?: "blue" | "red";
		classes?: string;
		children?: any;
	}>();
</script>

<button
	{onclick}
	class="focus:border-transparent focus:ring-2 focus:ring-white focus:outline-none
	 cursor-pointer rounded
    {color == 'red'
		? 'bg-red-500 hover:bg-red-600 focus:bg-red-600 '
		: 'focus:bg-blue-550 bg-blue-500 hover:bg-blue-600 '} 
        px-4 py-2 font-bold transition duration-100 {classes}"
	>{@render children()}
</button>
