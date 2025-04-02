<script lang="ts">
	// ---------
	// Modals are little windows that pop up on top of other content.
	// Intended to be used as short forms or warnings.
	// Can be used to replace js default alert if we do this more thoughtfully.
	// Perfect for the little edit screen for now, though.
	//
	// Recommended usage: make a $state variable modalOpen in the parent component,
	// bind it to this component's open prop and surround the modal with:
	// 	{#if modalOpen}
	// 		<Modal bind:open={modalOpen}>
	// 			<!-- modal content -->
	// 		</Modal>
	// 	{/if}
	// ---------

	import { onMount, onDestroy } from "svelte";
	import MiniButton from "./MiniButton.svelte";
	import { X } from "lucide-svelte";

	let {
		children,
		open = $bindable(false),
		title = "",
		size = "lg",
	} = $props<{
		children?: any;
		open: boolean;
		title: string;
		size: "sm" | "md" | "lg" | "full";
	}>();

	var sizeClass = $state("");

	const handleEscape = (event: KeyboardEvent) => {
		if (event.key === "Escape") {
			open = false;
		}
	};

	const handleClickOutside = (event: MouseEvent) => {
		const container = document.getElementById("modalContainer");
		if (container && !container.contains(event.target as Node)) {
			open = !open;
		}
	};

	onMount(() => {
		document.addEventListener("keydown", handleEscape);
		// without any waiting, clicking a button to open the modal results in this event firing
		// immediately, causing the modal to close. add a short delay so that doesn't happen.
		setTimeout(() => {
			document.addEventListener("click", handleClickOutside);
		}, 100);

		switch (size) {
			case "sm":
				sizeClass = "w-150 m-2 rounded-lg";
				break;
			case "md":
				sizeClass = "w-200 m-2 rounded-lg";
				break;
			case "lg":
				sizeClass = "w-300 m-2 rounded-lg";
				break;
			case "full":
				sizeClass = "w-full h-full";
				break;
		}
	});

	onDestroy(() => {
		document.removeEventListener("keydown", handleEscape);
		document.removeEventListener("click", handleClickOutside);
	});
</script>

{#if open}
	<div
		class="fixed inset-0 flex items-center justify-center z-100"
		style="background-color: rgba(0,0,0,.5)"
	>
		<div class="{sizeClass} bg-gray-700 p-6 shadow-lg" id="modalContainer">
			<div
				class="mb-4 items-center flex justify-between text-xl font-semibold"
			>
				<h2 class="">{title}</h2>
				<MiniButton
					classes="hover:bg-gray-600"
					color="white"
					onclick={() => (open = !open)}><X /></MiniButton
				>
			</div>
			{@render children()}
		</div>
	</div>
{/if}
