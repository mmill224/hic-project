<script lang="ts">
	import "../app.css";
	import Nav from "$lib/components/Nav.svelte";
	import TextInput from "$lib/components/TextInput.svelte";
	import Button from "$lib/components/Button.svelte";

	let { children } = $props();

	let signedIn = $state(true);

	let userName: string | undefined = $state();
	let password: string | undefined = $state();
</script>

<div class="min-h-screen bg-gray-700 text-white flex flex-col">
	{#if signedIn}
		<Nav
			logoutOnClick={() => {
				signedIn = false;
			}}
		/>
		<div class="flex flex-grow justify-center mx-3">
			{@render children()}
		</div>
	{:else}
		<div class="bg-gray-900 rounded-lg content-center m-auto w-100 p-10">
			<h2 class="text-xl font-bold mb-2 text-left">
				Welcome to QuickNote
			</h2>
			<TextInput label="User Name" bind:value={userName} />
			<TextInput type="password" label="Password" bind:value={password} />
			<div class="flex justify-end">
				<Button
					color="blue"
					onclick={() => {
						signedIn = true;
					}}>Sign in</Button
				>
			</div>
		</div>
	{/if}
</div>
