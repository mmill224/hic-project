<script lang="ts">
	import TextInput from "./TextInput.svelte";
	import Button from "./Button.svelte";
	import type { Note } from "$lib/db";
	import { addOrUpdateNote } from "$lib/dbDal";
	import Modal from "./Modal.svelte";
	import TipTap from "./TipTap.svelte";
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

	async function handleSubmit(e?: MouseEvent) {
		e?.preventDefault();
		errorMessage = "";
		// if the note is already in the db, do not change the created date
		note.createdDate =
			note?.id && note.createdDate ? note.createdDate : new Date();
		if (!note.title) {
			errorMessage = "Please add a title to your note";
			return;
		}
		note.content = editor?.getHTML() ?? note.content;
		success = await addOrUpdateNote({ ...note });
		if (success) {
			open = false;
		}
		onupdate && onupdate({ ...note });
	}
</script>

{#if open}
	<Modal size="sm" title={note.id ? "Edit Note" : "New Note"} bind:open>
		<TextInput label="Title" bind:value={note.title} />
		<TipTap
			content={note.content ?? ""}
			onupdate={() => handleSubmit}
			bind:editor
		/>

		{#if errorMessage}
			<div class="text-red-500 m-2">{errorMessage}</div>
		{/if}

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
	</Modal>
{/if}
