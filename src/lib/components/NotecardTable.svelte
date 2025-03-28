<script lang="ts">
    import { type Note } from "$lib/db";
    import Notecard from "./NoteCard.svelte";

    export let notes: Note[] = [];
</script>

<div class="flex flex-col lg:flex-row lg:flex-wrap md:flex-row md:flex-wrap">
    {#each notes as note, index (note.id)}
        <div
            class="lg:w-1/3 sm:w-full md:w-1/2 p-4 h-[20rem] overflow-hidden"
            style=""
        >
            <Notecard bind:note id={index}></Notecard>
        </div>
    {/each}
</div>
