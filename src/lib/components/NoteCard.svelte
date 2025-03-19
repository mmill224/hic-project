<script lang="ts">
	import type { Note, Tag } from "$lib/db";
	import MiniButton from "./MiniButton.svelte";
	import AddOrUpdateNoteModal from "./AddOrUpdateNoteModal.svelte";
	import { deleteNote } from "$lib/dbDal";
	import { Trash2, Pencil } from "lucide-svelte";

	export let note: Note | undefined = undefined;

	let handleDeleteClick = async () => {
		var success = await deleteNote(note);
		if (success) {
		}
	};

	let editMode = false;
</script>

{#if true}
	<div id="container" class="rounded bg-gray-600 shadow-md">
		<div id="header" class="flex justify-between p-4">
			<h2 class="text-2xl font-bold text-left">
				{note?.title ?? "No title available"}
			</h2>
			<MiniButton color={"red"} onclick={handleDeleteClick}
				><Trash2 /></MiniButton
			>
		</div>
		<div
			id="body"
			class="bg-gray-500 p-4 text-left"
			style="white-space: pre-wrap;"
		>
		{note?.content ?? "No Content"}
	</div>
		<div id="footer" class="flex justify-between p-4">
			<div id="tags" class="flex">
				<p>A tag array would go here</p>
			</div>
			{#if editMode}
				Doesn't work yet
			{/if}
			<MiniButton onclick={() => (editMode = !editMode)}
				><Pencil /></MiniButton
			>
		</div>
	</div>
{/if}

{#if editMode}
	<AddOrUpdateNoteModal bind:note></AddOrUpdateNoteModal>
{/if}
