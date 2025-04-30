<script lang="ts">
    import { type Note } from "$lib/db";
    import Modal from "./Modal.svelte";
    import TagList from "./TagList.svelte";
    import TipTap from "./TipTap.svelte";

    let {
        note,
        tags = [],
        open = $bindable(false),
    } = $props<{ note: Note; tags?: string[]; open: boolean }>();

    let dueDateString = $state("");
    let createdDateString = $state("");

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
</script>

<Modal size="lg" title="View Note" bind:open>
    <div
        class="content-center p-4 rounded-lg max-h-200 overflow-auto bg-gray-600"
    >
    <h2 class="text-xl font-bold mb-2 text-left">{note.title}</h2>
    <div class="text-left">
        <p class="text-sm text-gray-200 mb-2">
            {createdDateString}
        </p>
        <p class="text-sm text-gray-200 mb-2">
            {dueDateString}
        </p>
    </div>
        <TipTap
            content={note.content}
            editable={false}
            class="note-content rounded-lg text-left overflow-auto w-full overflow-hidden"
        />
    </div>
    <TagList bind:tags editable={false} />
</Modal>
