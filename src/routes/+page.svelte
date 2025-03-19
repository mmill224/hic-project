<script lang="ts">
	import { db } from '$lib/db';
	import NotecardTable from '$lib/components/NotecardTable.svelte';
	import Button from '$lib/components/Button.svelte';
	import { addNoteToDb } from '$lib/dbDal';
	import AddOrUpdateNoteModal from '$lib/components/AddOrUpdateNoteModal.svelte';

	var addNoteModal = false;
</script>

<div
	class="h-screen justify-center px-10 py-3 text-center"
	style="max-width: 1000px; margin: auto; min-width: 400px;"
>
	<div class="flex justify-between py-4">
		<Button onclick={() => (addNoteModal = true)} label="Add Note"></Button>
	</div>
	<NotecardTable></NotecardTable>
</div>

{#if addNoteModal}
	<AddOrUpdateNoteModal bind:open={addNoteModal}></AddOrUpdateNoteModal>
{/if}
