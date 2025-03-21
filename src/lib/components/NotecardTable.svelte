<script lang="ts">
    import { type Note } from "$lib/db";
    import Notecard from "./NoteCard.svelte";

    export let notes: Note[] = [];
</script>

<div class="flex flex-col lg:flex-row lg:flex-wrap md:flex-row md:flex-wrap">
    {#each notes as note, index}
        <div
            class="lg:w-1/3 sm:w-full md:w-1/2 p-4"
            style="flex-grow-1 flex-basis: auto;"
        >
            <Notecard bind:note></Notecard>
        </div>
    {/each}
</div>
