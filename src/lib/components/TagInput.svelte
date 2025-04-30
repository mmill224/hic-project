<script lang="ts">
    import { onMount } from "svelte";

    let { tag = $bindable(""), editable = $bindable(true) } = $props<{
        tag: string;
        editable?: boolean;
    }>();

    let inputEl: HTMLInputElement;

    onMount(() => {
        if (editable && inputEl) {
            inputEl.focus();
        }
    });

    function getTagLink(tagName: string): string {
        return `/?search=%23${encodeURIComponent(tagName)}`;
    }

    function normalizeInput(event: Event) {
        const target = event.target as HTMLInputElement;
        tag = target.value.toLowerCase().replace(/\s+/g, "-");
    }
</script>

{#if editable}
    <span>
        <input
            bind:this={inputEl}
            value={tag}
            oninput={normalizeInput}
            type="text"
            class="w-25 m-1 p-2 rounded-lg border border-gray-300 bg-gray-800 text-gray-100 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
            maxlength={30}
        />
    </span>
{:else}
    <a
        style="z-index: 1;"
        onclick={(event) => {
            event.stopPropagation();
        }}
        class="hover:ring-white hover:ring-2 m-1 p-2 rounded bg-gray-800 text-gray-200 flex justify-between items-center overflow-hidden whitespace-nowrap truncate"
        href={getTagLink(tag)}
    >
        {tag}
    </a>
{/if}
