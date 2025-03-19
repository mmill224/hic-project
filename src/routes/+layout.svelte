<script lang="ts">
	import '../app.css';
	import TextInput from '$lib/components/TextInput.svelte';
	import Button from '$lib/components/Button.svelte';
	import Nav from '$lib/components/Nav.svelte';

	let { children } = $props();

	let handleLoginSubmit = () => {
		loggedIn = true;
	};

	let logout = () => {
		loggedIn = false;
	};

	let password = $state('');
	let username = $state('');
	let loggedIn = $state(true);
</script>

<div class="bg-gray-700 text-white">
	{#if loggedIn}
		<Nav logoutOnClick={() => logout()} />
		<div class="items-center justify-center pt-20">
			{@render children()}
		</div>
	{:else}
		<div class="flex h-screen items-center justify-center">
			<div class="rounded-lg bg-gray-800 p-6" style="min-width: 400px; width: 50%;">
				<h1 class="p-2 text-4xl">Log In</h1>
				<form>
					<TextInput bind:value={username} label="Username"></TextInput>
					<TextInput bind:value={password} label="Password" type="password"></TextInput>
					<Button label="Submit" onclick={handleLoginSubmit}></Button>
				</form>
			</div>
		</div>
	{/if}
</div>
