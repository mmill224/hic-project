<script lang="ts">
	import TextInput from "./TextInput.svelte";
	import Button from "./Button.svelte";
	import { db, type Note } from "$lib/db";
	import { addOrUpdateNote } from "$lib/dbDal";
	import TipTap from "./TipTap.svelte";
	import { debounce } from "$lib/utils";
	import { Editor } from "@tiptap/core";

	const DEFAULT_NOTE: Note = {
		title: "",
		content: "",
		createdDate: new Date(),
	};
	type NoteProps = {
		note?: Note;
		open: boolean;
		onupdate?: (note: Note) => void;
	};

	let {
		onupdate,
		open = $bindable(false),
		note: _note = { ...DEFAULT_NOTE },
	}: NoteProps = $props();
	let note = $state(_note);

	let success = $state(false);
	let errorMessage = $state<string>("");

	let editor = $state<Editor>();
	async function handleSubmit() {
		errorMessage = "";
		const content = editor?.getHTML();
		// if the note is already in the db, do not change the created date
		var createdDate: Date;
		if (note?.id && note.createdDate) {
			createdDate = note.createdDate;
		} else {
			createdDate = new Date();
		}
		note.createdDate = createdDate;
		note.content = content;
		if (!note.title) {
			errorMessage = "Please add a title to your note";
			return;
		}

		success = await addOrUpdateNote({ ...note });

		if (success) {
			open = false;
		}
		onupdate && onupdate(note);
	}
	const saveNote = debounce((editor: Editor) => {
		db.notes.update(note, { content: editor.getHTML() });
	}, 1000);
</script>

{#if open}
	<div
		class="fixed inset-0 flex items-center justify-center z-100"
		style="background-color: rgba(0,0,0,.5)"
	>
		<!-- Modal content -->
		<div
			class="w-[90%] h-[90%] lg:w-[800px] rounded-lg bg-gray-600 p-6 shadow-lg max-h-full overflow-hidden flex flex-col"
		>
			<div class="mb-4 flex justify-between text-xl font-semibold">
				<h2 class="">Edit note</h2>
				<button onclick={() => (open = !open)} class="cursor-pointer"
					>&times;</button
				>
			</div>
			<TextInput label="Title" bind:value={note.title}></TextInput>
			<TipTap
				content={note.content ?? ""}
				onupdate={saveNote}
				bind:editor
			/>

			<div class="flex justify-between">
				<div class="flex">
					<input
						oninput={(e) => {
							note.dueDate = new Date();
							const tempDate = e.currentTarget.value.split("-");
							note.dueDate.setFullYear(parseInt(tempDate[0]));
							note.dueDate.setMonth(parseInt(tempDate[1]) - 1);
							note.dueDate.setDate(parseInt(tempDate[2]));
						}}
						value={note.dueDate?.toISOString().split("T")[0]}
						type="date"
						id="date"
						class="rounded-lg border border-gray-300 bg-gray-800 text-gray-100 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
					/>
				</div>

				<Button onclick={handleSubmit}>Submit</Button>
			</div>
			{#if errorMessage}
				<p class="text-red-300">{errorMessage}</p>
			{/if}
		</div>
	</div>
{/if}
