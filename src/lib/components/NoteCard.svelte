<script lang="ts">
	import type { Note, Tag } from "$lib/db";
	import MiniButton from "./MiniButton.svelte";
	import AddOrUpdateNote from "./AddOrUpdateNote.svelte";
	import { deleteNote, getTagsForNote } from "$lib/dbDal";
	import { Trash2, Pencil } from "lucide-svelte";
	import { db } from "$lib/db";

	let { note = $bindable(), id = $bindable(0) } = $props<{
		note: Note;
		id: number;
	}>();

	let expandTitle = $state(false);
	let expandContent = $state(false);

	let dueDateString = $state("");
	let createdDateString = $state("");

	let handleDeleteClick = async () => {
		var success = await deleteNote(note);
		if (success) {
			return;
		} else {
			alert("Failed to delete note");
		}
	};

	$effect(() => {
		if (note?.dueDate) {
			dueDateString =
				"Due: " +
				new Date(note.dueDate).toLocaleDateString("en-US", {
					month: "numeric",
					day: "numeric",
					year: "numeric",
				});
		}

		if (note?.createdDate) {
			createdDateString =
				"Created: " +
				note.createdDate.toLocaleDateString("en-US", {
					month: "numeric",
					day: "numeric",
					year: "numeric",
				});
		}
	});

	let editMode = $state(false);
	let tags = $state<Tag[]>([]);

	async function getTags() {
		if (note?.id) {
			// 1. Fetch NoteTagRelation entries
			const relations = await db.noteTagRelation
				.where("noteId")
				.equals(note.id)
				.toArray();

			// 2. Extract tagId values
			const tagIds = relations.map((relation) => relation.tagId);

			// 3. Fetch Tags
			tags = await db.tags.where("id").anyOf(tagIds).toArray();
		}
	}

	$effect(() => {
		getTags();
	});
</script>

<div id="container{id}" class="rounded bg-gray-600 shadow-md">
	<div id="header" class="p-4">
		<div class="flex justify-between">
			<button
				onclick={() => (expandTitle = !expandTitle)}
				class="text-2xl font-bold text-left cursor-pointer {expandTitle
					? 'break-all'
					: 'overflow-hidden line-clamp-2'}"
			>
				{note?.title ?? "No title available"}
			</button>
			<MiniButton color={"red"} onclick={handleDeleteClick}
				><Trash2 /></MiniButton
			>
		</div>
		<div class="flex text-left justify-between pt-3">
			<p class="text-sm text-gray-200">
				{createdDateString}
			</p>
			<p class="text-sm text-gray-200">
				{dueDateString}
			</p>
		</div>
	</div>
	<button
		id="body"
		onclick={() => (expandContent = !expandContent)}
		class="bg-gray-500 p-4 text-left w-full {expandContent
			? 'break-all'
			: 'overflow-hidden line-clamp-5'}"
		style="white-space: pre-wrap;"
	>
		{note?.content ?? "No Content"}
	</button>
	<div id="footer" class="flex justify-between p-4 h-20">
		<div id="tags" class="flex">
			{#each tags as tag}
				<p class="mr-2 bg-gray-700 rounded px-2 py-1 text-sm">{tag.name}</p>
			{/each}
		</div>
		<MiniButton onclick={() => (editMode = !editMode)}
			><Pencil /></MiniButton
		>
	</div>
</div>

<AddOrUpdateNote
	{note}
	bind:open={editMode}
	onupdate={(newNote: Note) => {
		note = newNote;
	}}
></AddOrUpdateNote>
