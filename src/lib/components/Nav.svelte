<script lang="ts">
	import Button from "./Button.svelte";

	export let logoutOnClick = () => {};
</script>

<nav class="sticky top-0 z-50 bg-gray-800 p-4">
	<div class="container mx-auto flex items-center justify-between">
		<div class="flex space-x-4 text-xl">
			<!-- Navbar Items -->
			<a
				href="/"
				class="focus:border-transparent focus:ring-2 focus:ring-white focus:outline-none rounded-md px-3 py-2 text-xl text-gray-300 hover:bg-gray-700 hover:text-white"
				>Home</a
			>
			<a
				href="/tags"
				class="focus:border-transparent focus:ring-2 focus:ring-white focus:outline-none rounded-md px-3 py-2 text-xl text-gray-300 hover:bg-gray-700 hover:text-white"
				>Tags</a
			>
			<a
				href="/about"
				class="focus:border-transparent focus:ring-2 focus:ring-white focus:outline-none rounded-md px-3 py-2 text-xl text-gray-300 hover:bg-gray-700 hover:text-white"
				>About QuickNote</a
			>
		</div>

		<!-- Logout Button -->
		<div class="mx-5">
			<Button onclick={logoutOnClick} color="red">Logout</Button>
		</div>
	</div>
</nav>
