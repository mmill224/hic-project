<script lang="ts">
    import { type Note } from "$lib/db";
    import Notecard from "./NoteCard.svelte";

    export let notes: Note[] = [];
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:grid-cols-3">
    {#each notes as note}
        <Notecard bind:note></Notecard>
    {/each}
</div>
