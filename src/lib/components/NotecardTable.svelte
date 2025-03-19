<script lang="ts">
    import { onMount } from 'svelte';
    import { db, type Note } from '$lib/db';
    import { liveQuery } from 'dexie'; // Import liveQuery from Dexie
    import Notecard from './NoteCard.svelte';

    let notes: Note[] = [];

    onMount(() => {
        // Set up live query for notes
        const liveNotesQuery = liveQuery(async () => {
            return await db.notes.toArray(); // Automatically keeps notes in sync
        });

        // Subscribe to changes in the live query and update notes
        const unsubscribe = liveNotesQuery.subscribe({
            next: (newNotes) => {
                notes = newNotes; // Update notes with the latest data
            }
        });	

        // Cleanup when the component is destroyed
        return () => {
            unsubscribe;
        };
    });
</script>

<div class="grid grid-cols-2 gap-4">
    {#each notes as note}
        <Notecard bind:note></Notecard>
    {/each}
</div>