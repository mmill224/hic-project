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
</script>

<Modal size="lg" title="View Note" bind:open>
    <div class="content-center p-4 rounded-lg max-h-200 overflow-auto bg-gray-600">
        <h2 class="text-xl font-bold mb-2 text-left">{note.title}</h2>
        <TipTap
            content={note.content}
            editable={false}
            class="note-content rounded-lg text-left overflow-auto w-full overflow-hidden"
        />
    </div>
    <h3 class="text-lg font-bold mt-2 text-left">Tags</h3>
    <TagList bind:tags editable={false} />
</Modal>
