<script lang="ts">
    import MiniButton from "./MiniButton.svelte";
    import { Plus } from "lucide-svelte";
    import TagInput from "./TagInput.svelte";

    let { tags = $bindable([]), editable = true } = $props<{
        tags: string[];
        editable?: boolean;
    }>();
</script>

<div class="flex justify-between">
    <MiniButton
        color="blue"
        onclick={() => {
            tags = ["", ...tags];
        }}><Plus /></MiniButton
    >
    {#each tags as element, i}
        <TagInput bind:tag={tags[i]}></TagInput>
    {/each}
</div>
