<script lang="ts">
    import { type Note } from "$lib/db";
    import { Pencil } from "lucide-svelte";
    import MiniButton from "./MiniButton.svelte";
    import Modal from "./Modal.svelte";
    import TagList from "./TagList.svelte";
    import TipTap from "./TipTap.svelte";

    let {
        note,
        tags = [],
        open = $bindable(false),
        onEditClick = () => {},
    } = $props<{
        note: Note;
        tags?: string[];
        open: boolean;
        onEditClick?: (event: MouseEvent) => void;
    }>();

    let dueDateString = $state("");
    let createdDateString = $state("");

    let handleEditClick = (event: MouseEvent) => {
        event.stopPropagation();
        onEditClick(event);
    };

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

<Modal size="md" title="View Note" bind:open>
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
    <br />
    <div class="flex justify-between">
        <TagList bind:tags editable={false} />
        <MiniButton color="blue" onclick={handleEditClick}
            ><Pencil /></MiniButton
        >
    </div>
</Modal>
