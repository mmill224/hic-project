<script lang="ts">
	export let onclick = () => {};
	export let label = 'Button Text';

	export let color: 'blue' | 'red' = 'blue';
</script>

<button
	{onclick}
	class="focus:ring-opacity-75 hoover:pointer cursor-pointer rounded
    {color == 'red'
		? 'bg-red-500 hover:bg-red-600 focus:bg-red-600 focus:ring-gray-100'
		: 'focus:bg-blue-550 bg-blue-500 hover:bg-blue-600 focus:ring-gray-100'} 
        px-4 py-2 font-bold transition duration-100 focus:ring-2"
	>{label}
</button>
