<script lang="ts">
	import type { Note } from "$lib/db";
	import MiniButton from "./MiniButton.svelte";
	import AddOrUpdateNote from "./AddOrUpdateNote.svelte";
	import { deleteNote, getTagsForNote } from "$lib/dbDal";
	import { Trash2, Pencil } from "lucide-svelte"; 
	import TipTap from "./TipTap.svelte"; 
	import { db } from "$lib/db"; 
	import type { Tag } from "$lib/db";

	let { note = $bindable(), id = $bindable(0) } = $props<{
		note: Note;
		id: number;
	}>();

	let expandTitle = $state(false);
	let expandContent = $state(false);

	let dueDateString = $state("");
	let createdDateString = $state("");

	let handleDeleteClick = async () => {
		// Delete relationships to tags from the relationship table
		if (note?.id) {
			await db.noteTagRelation.where("noteId").equals(note.id).delete();
		}
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
			tags = await getTagsForNote(note.id);
		} else {
			tags = [];
		}
	}

	$effect(() => {
		getTags();
	});
</script>

<div
	id="container{id}"
	class="rounded bg-gray-600 shadow-md h-full flex flex-col w-full"
>
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
	<TipTap
		content={note.content}
		editable={false}
		class="
			note-content
			bg-gray-500 text-left w-full shrink h-full overflow-hidden
			{expandContent ? 'break-all' : 'overflow-hidden line-clamp-5'}
		"
	/>
	<div id="footer" class="flex justify-between p-4 h-20">
		<div id="tags" class="flex">
			{#each tags as tag}
				<p class="mr-2 bg-gray-700 rounded px-2 py-1 text-sm h-[2em]">
					{tag.name}
				</p>
			{/each}
		</div>
		<MiniButton
			onclick={(e: MouseEvent) => {
				e.stopPropagation();
				editMode = !editMode;
			}}><Pencil /></MiniButton
		>
	</div>
</div>

<AddOrUpdateNote
	{note}
	bind:open={editMode}
	onupdate={(_note) => (note = _note)}
></AddOrUpdateNote>
