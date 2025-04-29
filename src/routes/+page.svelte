<script lang="ts">
	import { db } from "$lib/db";
	import NotecardTable from "$lib/components/NotecardTable.svelte";
	import Button from "$lib/components/Button.svelte";
	import AddOrUpdateNote from "$lib/components/AddOrUpdateNote.svelte";
	import { liveQuery, type Observable } from "dexie";
	import type { Note } from "$lib/db";
	import { FunnelX } from "lucide-svelte";
	import MiniButton from "$lib/components/MiniButton.svelte";
	import HotKeys from "$lib/utils/HotKeys.svelte";
	import { getTagsForNote, getTag } from "$lib/dbDal";
	import { onMount } from "svelte";

	let _notes: Note[] = $state([]); 
	import { addOrUpdateNote } from "$lib/dbDal";
	import { on } from "svelte/events"; 

	let openModal: boolean = $state(false);
	let searchTerm = $state("");
	let searchTagIds: number[] = $state([]);
	let TitleSearchTerm = $state("");

	let filterCreatedStartDate: Date | undefined = $state(undefined);
	let filterCreatedEndDate: Date | undefined = $state(undefined);

	let filterDueStartDate: Date | undefined = $state(undefined);
	let filterDueEndDate: Date | undefined = $state(undefined);

	let dbNotes: Observable<Note[]> = liveQuery(() =>
		db.notes.limit(100).toArray(),
	);

	let clearFilters = () => {
		filterCreatedStartDate = undefined;
		filterCreatedEndDate = undefined;
		filterDueStartDate = undefined;
		filterDueEndDate = undefined;
		searchTerm = "";
	};
	let parseTagsfromSearchTerm = () => {
		if (searchTerm) {
			const tokens = searchTerm.split(" ");
			const nonTagTokens = tokens.filter(
				(token) => !token.startsWith("#"),
			);
			TitleSearchTerm = nonTagTokens.join(" ");
			let tagnames = tokens
				.filter((tag) => tag.startsWith("#"))
				.map((tag) => tag.slice(1));
			(async () => {
				const tags = await Promise.all(
					tagnames.map((tag) => getTag(tag)),
				);
				// Extract `id` and filter out `undefined`
				searchTagIds = tags
					.map((tag) => tag?.id) // Extract `id`
					.filter((id): id is number => id !== undefined); // Remove `undefined`
			})();
		} else {
			searchTerm = "";
			TitleSearchTerm = "";
			searchTagIds = [];
		}
	};
	let updateNotes = async () => {
		_notes = await arrangeDisplayedNotes();
	};
	$effect(() => {
		parseTagsfromSearchTerm();
		updateNotes();
	});
	onMount(() => {
		const params = new URLSearchParams(window.location.search);
		const urlSearchTerm = params.get("search");
		if (urlSearchTerm) {
			searchTerm += " " + urlSearchTerm;
		}
	});
	let arrangeDisplayedNotes = $derived(async () => { 
		if (!$dbNotes) return []; 
		const notes = await Promise.all(
			$dbNotes?.map(async (note) => {
				if (!note.title) return null;

				// Convert dates
				const createdDate = note.createdDate
					? new Date(note.createdDate)
					: null;
				const createdStartDate = filterCreatedStartDate
					? new Date(filterCreatedStartDate)
					: null;
				const createdEndDate = filterCreatedEndDate
					? new Date(filterCreatedEndDate)
					: null;

				const dueDate = note.dueDate ? new Date(note.dueDate) : null;
				const dueStartDate = filterDueStartDate
					? new Date(filterDueStartDate)
					: null;
				const dueEndDate = filterDueEndDate
					? new Date(filterDueEndDate)
					: null;

				// Ensure end dates are inclusive
				if (createdEndDate) createdEndDate.setHours(23, 59, 59, 999);
				if (dueEndDate) dueEndDate.setHours(23, 59, 59, 999);

				// Fetch tags for the note 
				const tags = await getTagsForNote(note.id as number);
				// Ensure tags is an array before mapping
				const noteTagIds = (tags || []).map((tag) => tag.id as number); 
				// Access the value of searchTagIds if it's a store
				// idk why this makes the errors go away but it does :D
				const resolvedSearchTagIds = Array.isArray(searchTagIds)
					? searchTagIds
					: (searchTagIds as number[]); 

				// Check if tags match
				const matchesTag =
					resolvedSearchTagIds.length === 0 ||
					resolvedSearchTagIds.every((tagId) =>
						noteTagIds.includes(tagId),
					); 

				// Return the note if it matches all conditions
				if (
					note.title
						.toLowerCase() 
						.includes(TitleSearchTerm.toLowerCase()) &&
					(!createdStartDate ||
						(createdDate && createdDate >= createdStartDate)) &&
					(!createdEndDate ||
						(createdDate && createdDate <= createdEndDate)) &&
					(!dueStartDate || (dueDate && dueDate >= dueStartDate)) &&
					(!dueEndDate || (dueDate && dueDate <= dueEndDate)) && 
					matchesTag
				) {
					return note;
				}

				return null;
			}),
		);

		// Filter out null values and sort the notes
		return notes
			.filter((note) => note !== null)
			.sort((a, b) => {
				const aDate = a.createdDate ? new Date(a.createdDate) : null;
				const bDate = b.createdDate ? new Date(b.createdDate) : null;
				return bDate && aDate && bDate > aDate ? 1 : -1;
			});
	});
</script>

<div class="flex flex-col mx-auto text-center w-full max-w-300 m-5">
	<div class="flex justify-between py-4">
		<input
			id="search-bar"
			type="search"
			bind:value={searchTerm}
			placeholder="Search"
			class="w-full rounded-lg bg-gray-800 border border-gray-300 bg-text-gray-100 focus:border-transparent focus:ring-2 focus:ring-white focus:outline-none"
		/>
		<Button
			classes="w-50 ml-2 New-Note-Button"
			onclick={(e: MouseEvent) => {
				e.stopPropagation();
				openModal = true;
			}}>Add Note</Button
		>
	</div>
	<div class="hidden sm:flex justify-between">
		<MiniButton classes="flex" color="blue" onclick={clearFilters}
			><FunnelX />Clear Filters</MiniButton
		>
		<div class="flex justify-between flex-wrap">
			<div class="mx-1">
				<label for="filterDueStartDate" class="text-left block"
					>Due From Date:</label
				>
				<input
					oninput={(e) => {
						filterDueStartDate = new Date();
						const tempDate = e.currentTarget.value.split("-");
						filterDueStartDate.setFullYear(parseInt(tempDate[0]));
						filterDueStartDate.setMonth(parseInt(tempDate[1]) - 1);
						filterDueStartDate.setDate(parseInt(tempDate[2]));
					}}
					value={filterDueStartDate?.toISOString().split("T")[0]}
					type="date"
					id="filterDueStartDate"
					class="rounded-lg border border-gray-300 bg-gray-800 text-gray-100 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
				/>
			</div>
			<div class="mx-1">
				<label for="filterCreatedEndDate" class="text-left block"
					>To Date:</label
				>
				<input
					oninput={(e) => {
						filterDueEndDate = new Date();
						const tempDate = e.currentTarget.value.split("-");
						filterDueEndDate.setFullYear(parseInt(tempDate[0]));
						filterDueEndDate.setMonth(parseInt(tempDate[1]) - 1);
						filterDueEndDate.setDate(parseInt(tempDate[2]));
					}}
					value={filterDueEndDate?.toISOString().split("T")[0]}
					type="date"
					id="filterDueEndDate"
					class="rounded-lg border border-gray-300 bg-gray-800 text-gray-100 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
				/>
			</div>

			<div class="mx-1">
				<label for="filterCreatedStartDate" class="text-left block"
					>Created From Date:</label
				>
				<input
					oninput={(e) => {
						filterCreatedStartDate = new Date();
						const tempDate = e.currentTarget.value.split("-");
						filterCreatedStartDate.setFullYear(parseInt(tempDate[0]));
						filterCreatedStartDate.setMonth(parseInt(tempDate[1]) - 1);
						filterCreatedStartDate.setDate(parseInt(tempDate[2]));
					}}
					value={filterCreatedStartDate?.toISOString().split("T")[0]}
					type="date"
					id="filterCreatedStartDate"
					class="rounded-lg border border-gray-300 bg-gray-800 text-gray-100 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
				/>
			</div>
			<div class="mx-1">
				<label for="filterCreatedEndDate" class="text-left block"
					>To Date:</label
				>
				<input
					oninput={(e) => {
						filterCreatedEndDate = new Date();
						const tempDate = e.currentTarget.value.split("-");
						filterCreatedEndDate.setFullYear(parseInt(tempDate[0]));
						filterCreatedEndDate.setMonth(parseInt(tempDate[1]) - 1);
						filterCreatedEndDate.setDate(parseInt(tempDate[2]));
					}}
					value={filterCreatedEndDate?.toISOString().split("T")[0]}
					type="date"
					id="filterCreatedEndDate"
					class="rounded-lg border border-gray-300 bg-gray-800 text-gray-100 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
				/>
			</div>
		</div>
	</div>
	<NotecardTable bind:notes={_notes}></NotecardTable>
</div>

<AddOrUpdateNote
	bind:open={openModal}
	onupdate={(updatedNote: Note) => {
		// Refresh the tags for the updated note
		_notes = _notes.map((note) =>
			note.id === updatedNote.id ? updatedNote : note,
		);
	}}
></AddOrUpdateNote>

<HotKeys />
