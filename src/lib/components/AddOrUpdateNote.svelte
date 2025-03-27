<script lang="ts">
	import TextInput from "./TextInput.svelte";
	import Button from "./Button.svelte";
	import type { Note } from "$lib/db";
	import { addOrUpdateNote } from "$lib/dbDal";
	import Modal from "./Modal.svelte";

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

	async function handleSubmit() {
		errorMessage = "";
		// if the note is already in the db, do not change the created date
		var createdDate: Date;
		if (note?.id && note.createdDate) {
			createdDate = note.createdDate;
		} else {
			createdDate = new Date();
		}
		note.createdDate = createdDate;
		if (!note.title) {
			errorMessage = "Please add a title to your note";
			return;
		}
		const newNote: Note = {
			...note,
		};

		success = await addOrUpdateNote(newNote);

		if (success) {
			open = false;
		}
		onupdate && onupdate(newNote);
	}
</script>

<Modal title={note.id ? "Edit Note" : "New Note"} bind:open>
	<TextInput label="Title" bind:value={note.title}></TextInput>
	<TextInput type="textarea" label="Content" bind:value={note.content}
	></TextInput>

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
