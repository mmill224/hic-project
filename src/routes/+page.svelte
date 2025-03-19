<script lang="ts">
	import { db } from "$lib/db";
	import NotecardTable from "$lib/components/NotecardTable.svelte";
	import Button from "$lib/components/Button.svelte";
	import AddOrUpdateNoteModal from "$lib/components/AddOrUpdateNoteModal.svelte";
	import { liveQuery, type Observable } from "dexie";
	import type { Note } from "$lib/db";

	let addNoteModal = $state(false);
	let searchTerm = $state("");
	let dbNotes: Observable<Note[]> = liveQuery(() =>
		db.notes.limit(100).toArray(),
	);
	let displayedNotes: Note[] = $state([]);

	$effect(() => {
		displayedNotes = $dbNotes?.filter((note) => {
			if (searchTerm == "") {
				return true;
			}
			if (!note.title) {
				return false;
			}
			return note.title.toLowerCase().includes(searchTerm.toLowerCase());
		});
	});
</script>

<div
	class="h-screen justify-center px-10 py-3 text-center"
	style="max-width: 1000px; margin: auto; min-width: 400px;"
>
	<div class="flex justify-between py-4">
		<input
			type="search"
			bind:value={searchTerm}
			placeholder="Search"
			class="w-full rounded-lg bg-gray-800 border border-gray-300 bg-text-gray-100 focus:border-transparent focus:ring-2 focus:ring-white focus:outline-none"
		/>
		<Button classes="w-50 ml-2" onclick={() => (addNoteModal = true)}
			>Add Note</Button
		>
	</div>
	<NotecardTable notes={displayedNotes}></NotecardTable>
</div>

{#if addNoteModal}
	<AddOrUpdateNoteModal bind:open={addNoteModal}></AddOrUpdateNoteModal>
{/if}
