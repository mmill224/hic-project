<script lang="ts">
    export let value = "";
    export let label = "";
    export let type: "text" | "textarea" | "password" = "text";
    export let classes = "";
    export let maxlength: number = 5000;
    export let onchange = () => {};
    export let onblur = () => {};

    // Add autofocus as a prop
    export let autofocus: boolean = false;
</script>

{#if type == "textarea"}
    <div class="relative my-2 {classes}">
        <textarea
            id={label}
            class="peer w-full rounded-lg border border-gray-300 bg-gray-800 p-4 pt-6 text-gray-100 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder=" "
            bind:value
            onchange={() => onchange()}
            {onblur}
            {autofocus}
            {maxlength}
        ></textarea>
        <label
            for={label}
            class="absolute top-4 left-3 z-10 origin-[0] -translate-y-4 scale-75 transform text-gray-100 duration-300 peer-placeholder-shown:translate-y-2 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75"
        >
            {label}
        </label>
    </div>
{:else}
    <div class="relative my-2 {classes}">
        <input
            {type}
            class="peer w-full rounded-lg border border-gray-300 bg-gray-800 p-4 pt-6 text-gray-100 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder=" "
            bind:value
            onchange={() => onchange()}
            {onblur}
            id={label}
            {maxlength}
            {autofocus}
        />
        <label
            for={label}
            class="absolute top-4 left-3 z-10 origin-[0] -translate-y-4 scale-75 transform text-gray-100 duration-300 peer-placeholder-shown:translate-y-2 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75"
        >
            {label}
        </label>
    </div>
{/if}
