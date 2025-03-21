<script lang="ts">
	import "../app.css";
	import Nav from "$lib/components/Nav.svelte";

	let { children } = $props();
</script>

<div class="min-h-screen bg-gray-700 text-white flex flex-col">
	<Nav />
	<div class="flex flex-grow justify-center mx-3">
		{@render children()}
	</div>
</div>
