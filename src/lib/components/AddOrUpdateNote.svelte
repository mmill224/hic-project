<script lang="ts">
	import TextInput from "./TextInput.svelte";
	import Button from "./Button.svelte";
	import type { Note } from "$lib/db";
	import { addOrUpdateNote } from "$lib/dbDal";
	import Modal from "./Modal.svelte";
	import TipTap from "./TipTap.svelte";
	import { Editor } from "@tiptap/core";
	import { db } from "$lib/db"; // Import the database instance
	import TagList from "./TagList.svelte";

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
	let tags = $state<string[]>([]); // Initialize with one empty input

	// Fetch tags when the modal is opened
	$effect(() => {
		if (open && note?.id) {
			loadTagsForNote();
		}
		// Focus the title input when the modal is opened
	});

	async function loadTagsForNote() {
		if (note?.id) {
			const relations = await db.noteTagRelation
				.where("noteId")
				.equals(note.id)
				.toArray();
			const tagIds = relations
				.map((relation) => relation.tagId)
				.filter((id): id is number => id !== undefined);
			const existingTags = await db.tags
				.where("id")
				.anyOf(tagIds)
				.toArray();
			tags = existingTags.map((tag) => tag.name); // Populate tags with tag names
		}
	}

	async function handleSubmit(e?: MouseEvent) {
		e?.preventDefault();
		errorMessage = "";

		// If the note is already in the database, do not change the created date
		note.createdDate =
			note?.id && note.createdDate ? note.createdDate : new Date();

		if (!note.title) {
			errorMessage = "Please add a title to your note";
			return;
		}

		note.content = editor?.getHTML() ?? note.content;
		const newNote = { ...note };
		success = await addOrUpdateNote(newNote);

		if (success) {
			// Get the note ID (if it's a new note, the ID will be generated)
			const noteId = newNote.id;

			if (!noteId) {
				errorMessage = "Failed to save the note. Please try again.";
				return;
			}

			// Process tags
			const uniqueTags = tags.filter((tag) => tag.trim() !== ""); // Remove empty tags
			for (const tagName of uniqueTags) {
				// Check if the tag already exists
				let tag = await db.tags.where("name").equals(tagName).first();

				if (!tag) {
					// If the tag doesn't exist, add it to the tags table
					const tagId = await db.tags.add({
						name: tagName,
						color: "#000000",
					});
					tag = { id: tagId, name: tagName, color: "#000000" };
				}

				if (!tag?.id) {
					errorMessage = `Failed to save the tag "${tagName}". Please try again.`;
					continue;
				}

				// Check if the relation already exists
				const relationExists = await db.noteTagRelation
					.where({ noteId, tagId: tag.id })
					.first();

				if (!relationExists) {
					// Add the relation to the noteTagRelation table
					await db.noteTagRelation.add({ noteId, tagId: tag.id });
				}
			}

			// Reset the form
			open = false;
			note = { ...DEFAULT_NOTE };
			tags = [];
		}
	}
</script>

<Modal size="md" title={note.id ? "Edit Note" : "New Note"} bind:open>
	<TextInput label="Title" bind:value={note.title} />
	<TipTap content={note.content ?? ""} bind:editor />

	{#if errorMessage}
		<div class="text-red-500 m-2">{errorMessage}</div>
	{/if}

	<div class="mt-4 flex justify-between">
		<div>
			<h3 class="text-lg font-bold mb-2 text-left">Tags</h3>
			<TagList bind:tags></TagList>
		</div>
		<div>
			<div>
				<h3 class="text-right text-lg font-bold mb-2">Due date</h3>
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
					id="filterDueEndDate"
					class="rounded-lg border border-gray-300 bg-gray-800 text-gray-100 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
				/>
			</div>
		</div>
	</div>

	<div class="flex justify-between mt-4">
		<div></div>
		<Button onclick={handleSubmit}>Submit</Button>
	</div>
</Modal>
