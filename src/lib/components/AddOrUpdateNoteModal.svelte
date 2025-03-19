<script lang="ts">
	import TextInput from './TextInput.svelte';
	import Button from './Button.svelte';
	import type { Note } from '$lib/db';
	import { addNoteToDb } from '$lib/dbDal';

	export let note: Note | undefined = undefined;
	export let open = false;

	let noteTitle = note?.title ?? '';
	let noteContent = note?.title ?? '';
	let success = false;

	async function handleSubmit() {
		var newNote: Note = {
			title: noteTitle,
			content: noteContent
		};

		success = await addNoteToDb(newNote);

		if (success) {
			open = false;
		}
	}
</script>

{#if open}
	<div
		class="fixed inset-0 flex items-center justify-center"
		style="background-color: rgba(0,0,0,.5)"
	>
		<!-- Modal content -->
		<div class="w-full max-w-sm rounded-lg bg-gray-600 p-6 shadow-lg">
			<div class="mb-4 flex justify-between text-xl font-semibold">
				<h2 class="">Edit note</h2>
				<button onclick={() => (open = !open)} class="cursor-pointer">&times;</button>
			</div>
			<TextInput label="Title" bind:value={noteTitle}></TextInput>
			<TextInput type="textarea" label="Content" bind:value={noteContent}></TextInput>
			<!-- Close button -->
			<div class="flex justify-end">
				<Button label="Submit" onclick={handleSubmit}></Button>
			</div>
		</div>
	</div>
{/if}
