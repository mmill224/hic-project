<script lang="ts">
    import MiniButton from "./MiniButton.svelte";
    import { Plus } from "lucide-svelte";
    import TagInput from "./TagInput.svelte";

    let { tags = $bindable([]), editable = true } = $props<{
        tags: string[];
        editable?: boolean;
    }>();
</script>

<div id="tag-container" class="flex flex-wrap items-center">
    {#if editable}
        <MiniButton
            classes={tags.length > 4 ? "hidden" : ""}
            disabled={(tags[0]?.length ?? 1) == 0}
            color="blue"
            onclick={() => {
                tags = ["", ...tags];
            }}><Plus /></MiniButton
        >
    {/if}
    {#each tags as element, i}
        <TagInput {editable} bind:tag={tags[i]}></TagInput>
    {/each}
</div>
