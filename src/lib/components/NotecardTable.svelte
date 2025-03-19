<script lang="ts">
    import { onMount } from 'svelte';
    import { db, type Note } from '$lib/db';
    import { liveQuery } from 'dexie'; // Import liveQuery from Dexie
    import Notecard from './NoteCard.svelte';

    export let notes: Note[] = [];

</script>

<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    {#each notes as note}
        <Notecard bind:note></Notecard>
    {/each}
</div>