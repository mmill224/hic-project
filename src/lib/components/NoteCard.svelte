<script lang="ts">
	import type { Note } from "$lib/db";
	import MiniButton from "./MiniButton.svelte";
	import AddOrUpdateNote from "./AddOrUpdateNote.svelte";
	import { deleteNote, getTagsForNote } from "$lib/dbDal";
	import { Trash2, Pencil, Eye } from "lucide-svelte";
	import TipTap from "./TipTap.svelte";
	import { db } from "$lib/db";
	import { onMount } from "svelte";
	import TagList from "./TagList.svelte";
	import ViewNote from "./ViewNote.svelte";

	let { note = $bindable(), id = $bindable(0) } = $props<{
		note: Note;
		id: number;
	}>();

	let expandTitle = $state(false);

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

	let openEditModal = $state(false);
	let openViewModal = $state(false);
	let tags = $state<string[]>([]);

	onMount(async () => {
		if (note?.id) {
			tags = (await getTagsForNote(note.id)).reduce((acc, tag) => {
				acc.push(tag.name);
				return acc;
			}, [] as string[]);
		}
	});
</script>

<div
	id="container{id}"
	class="rounded bg-gray-600 shadow-md max-h-full flex flex-col w-full hover:ring-2 hover:ring-white cursor-pointer"
	onclick={(e: MouseEvent) => {
		e.stopPropagation();
		openViewModal = !openViewModal;
	}}
	role="button"
	tabindex="0"
	style="z-index: -1;"
	onkeydown={(e: KeyboardEvent) => {
		if (e.key === "Enter") {
			openViewModal = true;
		}
	}}
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
			<MiniButton
				color={"red"}
				onclick={(event) => {
					event.stopPropagation();
					handleDeleteClick();
				}}><Trash2 /></MiniButton
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
		class="note-content bg-gray-500 text-left w-full overflow-hidden"
	/>
	<div id="footer" class="flex justify-between p-4">
		<div id="tags" class="flex">
			<TagList bind:tags editable={false}></TagList>
		</div>
		<MiniButton
			onclick={(e: MouseEvent) => {
				e.stopPropagation();
				openEditModal = true;
			}}><Pencil /></MiniButton
		>
	</div>
</div>

<AddOrUpdateNote {note} bind:open={openEditModal}></AddOrUpdateNote>

<ViewNote
	bind:open={openViewModal}
	{note}
	{tags}
	onEditClick={() => {
		openViewModal = false;
		openEditModal = true;
		return;
	}}
/>
