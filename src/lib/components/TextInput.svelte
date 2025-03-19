<script lang="ts">
	export let value = '';
	export let label = '';
	export let type: 'text' | 'textarea' | 'password' = 'text';

	export let classes = '';

	export let onchange = () => {};
</script>

{#if type == 'textarea'}
	<div class="relative my-2 {classes}">
		<textarea
			class="peer w-full rounded-lg border border-gray-300 bg-gray-800  p-4 pt-6 text-gray-100 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
			placeholder=" "
			bind:value
			onchange={() => onchange()}
		></textarea>
		<label
			for="username"
			class="absolute top-4 left-3 z-10 origin-[0] -translate-y-4 scale-75 transform text-gray-100 duration-300 peer-placeholder-shown:translate-y-2 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75"
		>
			{label}
		</label>
	</div>
{:else}
	<div class="relative my-2 {classes}">
		<input
			{type}
			class="peer w-full rounded-lg border border-gray-300 bg-gray-800 p-4 pt-6 text-gray-100 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
			placeholder=" "
			bind:value
			onchange={() => onchange()}
		/>
		<label
			for="username"
			class="absolute top-4 left-3 z-10 origin-[0] -translate-y-4 scale-75 transform text-gray-100 duration-300 peer-placeholder-shown:translate-y-2 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75"
		>
			{label}
		</label>
	</div>
{/if}
