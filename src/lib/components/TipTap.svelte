<script lang="ts">
	import { Editor } from "@tiptap/core";
	import StarterKit from "@tiptap/starter-kit";
	import Icon from "@iconify/svelte";
	import Underline from "@tiptap/extension-underline";

	let {
		content,
		onupdate,
		editable = true,
		editor = $bindable<Editor>(),
		onclick,
		...args
	}: {
		content: string;
		editable?: boolean;
		onclick?: (e: MouseEvent) => void;
		onupdate?: (editor: Editor) => void;
		editor?: Editor;
		class?: string;
	} = $props();
	let element = $state<Element>();

	let is_bold = $state<boolean>(false);
	let is_italic = $state<boolean>(false);
	let is_underline = $state<boolean>(false);
	let can_undo = $state<boolean>(false);
	let can_redo = $state<boolean>(false);
	$effect(() => {
		if (element) {
			editor = new Editor({
				element: element,
				extensions: [StarterKit, Underline],
				content: content,
				editable: editable,
				onUpdate: () => {
					onupdate && onupdate(editor);
				},
				onTransaction: () => {
					// force re-render so `editor.isActive` works as expected
					editor = editor;
					is_bold = editor.isActive("bold");
					is_italic = editor.isActive("italic");
					is_underline = editor.isActive("underline");
					can_undo = editor.can().undo();
					can_redo = editor.can().redo();
				},
			});
		}
		return () => {
			editor?.destroy();
		};
	});
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
	bind:this={element}
	onclick={(e: MouseEvent) => {
		onclick && onclick(e);
		editor.chain().focus().run();
	}}
	role="button"
	tabindex="0"
	class={`
		min-h-30
		${editable && `peer editable h-200`}

		note-content overflow-y-auto 
		${
			editable &&
			` 
				peer w-full rounded-lg border border-gray-300 bg-gray-800 text-gray-100 
				focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none
				hover:cursor-pointer
			`
		}
		${args.class}
	`}
	aria-label="Note Content."
>
	{#if editable}
		<div class="toolbar-bg">
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<div
				class="toolbar"
				role="button"
				tabindex="0"
				onclick={(e: MouseEvent) => {
					e.stopPropagation();
				}}
			>
				<div class="container">
					<button
						class="tool-btn history-btn {can_undo ? 'active' : ''}"
						onclick={() => {
							editor.chain().focus().undo().run();
						}}><Icon icon="mingcute:back-fill" /></button
					>
					<button
						class="tool-btn history-btn {can_redo ? 'active' : ''}"
						onclick={() => {
							editor.chain().focus().redo().run();
						}}><Icon icon="mingcute:forward-fill" /></button
					>
				</div>
				<div class="separator"></div>
				<div class="container">
					<button
						class="tool-btn {is_bold ? 'active' : ''}"
						onclick={() => {
							editor.chain().focus().toggleBold().run();
						}}><Icon icon="teenyicons:bold-outline" /></button
					>
					<button
						class="tool-btn {is_italic ? 'active' : ''}"
						onclick={() => {
							editor.chain().focus().toggleItalic().run();
						}}><Icon icon="tabler:italic" /></button
					>
					<button
						class="tool-btn {is_underline ? 'active' : ''}"
						onclick={() => {
							editor.chain().focus().toggleUnderline().run();
						}}><Icon icon="garden:underline-stroke-16" /></button
					>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.note-content {
		width: 100%;
		position: relative;
		display: flex;
		flex-direction: column;
	}

	.note-content :global(.tiptap) {
		cursor: text;
		height: auto; /* not 100% */
		max-height: 100%;
		overflow-y: auto;
	}

	.note-content :global(.tiptap:focus) {
		border: none;
		outline: none;
	}

	.note-content :global > * {
		padding: 1rem 2rem;
	}

	.note-content :global {
		text-align: left;
	}

	.note-content :global h1 {
		font-size: 1.4rem;
		font-weight: 900;
	}

	.note-content :global h2 {
		font-size: 1.2rem;
		font-weight: 800;
	}

	.note-content :global h3 {
		font-size: 1rem;
		font-weight: 800;
	}

	.note-content :global ul {
		margin-left: 1rem;
		list-style: disc;
	}

	.note-content :global ol {
		margin-left: 1rem;
		list-style: decimal;
	}

	.toolbar {
		display: flex;
		justify-content: left;
		align-items: center;
		container-type: inline-size;
		padding: 0 1rem;
		height: 2.4rem;
		margin:
			0.5rem auto,
			0,
			auto;
		width: 97%;
		border-radius: 100px;
		background: var(--color-gray-700);
		border-bottom: 1px solid hsla(0, 0%, 100%, 0.111);
	}

	.toolbar-bg {
		position: sticky;
		display: flex;
		justify-content: center;
		height: fit-content;
		align-items: center;
		padding: 1rem 0;
		width: 100%;
		top: 0;
		z-index: 2;
		background: var(--color-gray-800);
	}

	.tool-btn {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 80%;
		width: auto;
		aspect-ratio: 1/1;
		cursor: pointer;
		border-radius: 0.4rem;
	}

	.tool-btn:hover {
		background: var(--color-gray-500);
	}

	.tool-btn:active {
		background: color-mix(in srgb, var(--color-gray-500), white 30%);
	}

	.tool-btn.active {
		background: var(--color-blue-500);
		color: var(--color-gray-800);
	}

	.tool-btn.active:hover {
		background: color-mix(in srgb, var(--color-blue-500), white 30%);
	}

	.tool-btn.active:active {
		background: color-mix(in srgb, var(--color-blue-500), white 30%);
	}

	.history-btn {
		color: var(--color-gray-500);
	}

	.history-btn:hover {
		background: none;
	}

	.history-btn.active {
		color: var(--color-gray-300);
		background: none;
	}

	.history-btn:active {
		background: none;
	}

	.history-btn.active:hover {
		background: var(--color-gray-500);
	}

	.history-btn.active:active {
		background: none;
	}

	.separator {
		height: 60%;
		width: 2px;
		background: var(--color-gray-600);
		margin-inline: 0.3rem;
	}

	.container {
		width: fit-content;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.3rem;
	}
</style>
