<script lang="ts">
	// ---------
	// Modals are little windows that pop up on top of other content.
	// Intended to be used as short forms or warnings.
	// Can be used to replace js default alert if we do this more thoughtfully
	// Perfect for the little edit screen for now, though.
	// ---------

	let {
		children,
		open = $bindable(false),
		title = "",
	} = $props<{
		children?: any;
		open: boolean;
		title: string;
	}>();

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

	$effect(() => {
		if (open) {
			document.addEventListener("keydown", handleEscape);
			// without any waiting, clicking a button to open the modal results in this event firing
			// immediately, causing the modal to close. add a short delay so that doesn't happen.
			setTimeout(() => {
				document.addEventListener("click", handleClickOutside);
			}, 100);
		} else {
			document.removeEventListener("keydown", handleEscape);
			document.removeEventListener("click", handleClickOutside);
		}
	});
</script>

{#if open}
	<div
		class="fixed inset-0 flex items-center justify-center"
		style="background-color: rgba(0,0,0,.5)"
	>
		<!-- Modal content -->
		<div
			class="w-full max-w-sm rounded-lg bg-gray-600 p-6 shadow-lg"
			id="modalContainer"
		>
			<div class="mb-4 flex justify-between text-xl font-semibold">
				<h2 class="">{title}</h2>
				<button onclick={() => (open = !open)} class="cursor-pointer"
					>&times;</button
				>
			</div>
			{@render children()}
		</div>
	</div>
{/if}
