<script lang="ts">
	import type { Note, Tag } from '$lib/db';
	import { db } from '$lib/db';
	import Button from '$lib/components/Button.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import AddOrUpdateNoteModal from './AddOrUpdateNoteModal.svelte';
	import { deleteNote } from '$lib/dbDal';

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
			<h2 class="text-2xl font-bold">{note?.title ?? 'No title available'}</h2>
			<Button color={'red'} label="Delete" onclick={handleDeleteClick}></Button>
		</div>
		<div id="body" class="bg-gray-500 p-4">{note?.content ?? 'No Content'}</div>
		<div id="footer" class="flex justify-between p-4">
			<div id="tags" class="flex">
				<p>tag</p>
				<p>tag</p>
				<p>tag</p>
				<p>tag</p>
				<p>tag</p>
			</div>
			{#if editMode}
				something mad stinky is happening here
			{/if}
			<Button label="Edit" onclick={() => (editMode = !editMode)}></Button>
		</div>
	</div>
{/if}

{#if editMode}
	<AddOrUpdateNoteModal bind:note></AddOrUpdateNoteModal>
{/if}
