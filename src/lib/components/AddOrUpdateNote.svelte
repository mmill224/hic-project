<script lang="ts">
	import TextInput from "./TextInput.svelte";
	import Button from "./Button.svelte";
	import type { Note, Tag, noteTagRelation } from "$lib/db";
	import { addOrUpdateNote } from "$lib/dbDal";
	import Modal from "./Modal.svelte";
	import TipTap from "./TipTap.svelte";
	import { Editor } from "@tiptap/core";
	import { db } from "$lib/db"; // Import the database instance

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
	let tags = $state<string[]>([""]); // Initialize with one empty input

	// Fetch tags when the modal is opened
	$effect(() => {
		if (open && note?.id) {
			loadTagsForNote();
		}
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
			tags = [...tags, ""]; // Add an empty input for new tags
		}
	}

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
			tags = [""];
		}
		onupdate && onupdate({ ...note });
	}

	function handleTagInput(index: number, value: string) {
		tags[index] = value;

		// Add a new input field if the last one is being edited
		if (index === tags.length - 1 && value.trim() !== "") {
			tags = [...tags, ""];
		}
	}
</script>

<Modal size="md" title={note.id ? "Edit Note" : "New Note"} bind:open>
	<TextInput label="Title" bind:value={note.title} />
	<TipTap
		content={note.content ?? ""}
		onupdate={() => handleSubmit}
		bind:editor
	/>

	{#if errorMessage}
		<div class="text-red-500 m-2">{errorMessage}</div>
	{/if}

	<div class="mt-4">
		<h3 class="text-lg font-bold mb-2">Tags</h3>
		<div class="flex flex-wrap gap-2">
			{#each tags as tag, index (tag)}
				<div class="mb-2">
					<input
						type="text"
						bind:value={tags[index]}
						oninput={(e) =>
							handleTagInput(index, e.currentTarget.value)}
						placeholder="Enter a tag"
						class="rounded-lg border border-gray-300 bg-gray-800 text-gray-100 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
						style="width: auto; min-width: 50px; padding: 4px;"
						size={tags[index]?.length || 1}
					/>
				</div>
			{/each}
		</div>
	</div>

	<div class="flex justify-between mt-4">
		<Button onclick={handleSubmit}>Submit</Button>
	</div>
</Modal>
