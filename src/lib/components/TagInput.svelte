<script lang="ts">
    let { tag = $bindable(""), editable = true } = $props<{
        tag: string;
        editable?: boolean;
    }>();
</script>

<button onclick={() => (editable = true)}>
    {#if editable}
        <input
            bind:value={tag}
            type="text"
            class="rounded-lg border border-gray-300 bg-gray-800 text-gray-100 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
            maxlength={30}
            onblur={() => (editable = false)}
            
        />
    {:else}
        <span class="p-2 bg-gray-800 text-gray-100">{tag}</span>
    {/if}
</button>
