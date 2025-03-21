<script lang="ts">
	import TextInput from "./TextInput.svelte";
	import Button from "./Button.svelte";
	import type { Note } from "$lib/db";
	import { addOrUpdateNote } from "$lib/dbDal";

	export let note: Note = {
		title: "",
		content: "",
		createdDate: new Date(),
		dueDate: undefined,
	};

	export let open = false;

	let success = false;

	async function handleSubmit() {
		// if the note is already in the db, do not change the created date
		var createdDate: Date = new Date();
		if (note?.id && note.createdDate) {
			createdDate = note.createdDate;
		}

		success = await addOrUpdateNote(note);

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
				<button onclick={() => (open = !open)} class="cursor-pointer"
					>&times;</button
				>
			</div>
			<TextInput label="Title" bind:value={note.title}></TextInput>
			<TextInput type="textarea" label="Content" bind:value={note.content}
			></TextInput>

			<div class="flex justify-between">
				<div class="flex">
					<input
						bind:value={note.dueDate}
						type="date"
						id="date"
						class="rounded-lg border border-gray-300 bg-gray-800 text-gray-100 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
					/>
				</div>

				<Button onclick={handleSubmit}>Submit</Button>
			</div>
		</div>
	</div>
{/if}
