<script lang="ts">
	import { db } from "$lib/db";
	import NotecardTable from "$lib/components/NotecardTable.svelte";
	import Button from "$lib/components/Button.svelte";
	import AddOrUpdateNote from "$lib/components/AddOrUpdateNote.svelte";
	import { liveQuery, type Observable } from "dexie";
	import type { Note } from "$lib/db";
	import { FunnelX } from "lucide-svelte";
	import MiniButton from "$lib/components/MiniButton.svelte";

	let openModal: boolean = $state(false);
	let searchTerm = $state("");

	let filterCreatedStartDate: Date | undefined = $state(undefined);
	let filterCreatedEndDate: Date | undefined = $state(undefined);

	let filterDueStartDate: Date | undefined = $state(undefined);
	let filterDueEndDate: Date | undefined = $state(undefined);

	let dbNotes: Observable<Note[]> = liveQuery(() =>
		db.notes.limit(100).toArray(),
	);
	let displayedNotes: Note[] = $state([]);

	let clearFilters = () => {
		filterCreatedStartDate = undefined;
		filterCreatedEndDate = undefined;
		filterDueStartDate = undefined;
		filterDueEndDate = undefined;
		searchTerm = "";
	};

	// change to $derived()
	$effect(() => {
		displayedNotes = $dbNotes
			?.filter((note) => {
				if (!note.title) {
					return false;
				}

				// default date selection is not good, so we need to convert the output to real date objects
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

				// if there's an end date, we want the entire day to be inclusive
				if (createdEndDate) {
					createdEndDate.setHours(23, 59, 59, 999); // Set to 11:59:59 PM
				}
				if (dueEndDate) {
					dueEndDate.setHours(23, 59, 59, 999); // Set to 11:59:59 PM
				}

				return (
					note.title
						.toLowerCase()
						.includes(searchTerm.toLowerCase()) &&
					(!createdStartDate ||
						(createdDate && createdDate >= createdStartDate)) &&
					(!createdEndDate ||
						(createdDate && createdDate <= createdEndDate)) &&
					(!dueStartDate || (dueDate && dueDate >= dueStartDate)) &&
					(!dueEndDate || (dueDate && dueDate <= dueEndDate))
				);
			})
			.sort((a, b) => {
				const aDate = a.createdDate ? new Date(a.createdDate) : null;
				const bDate = b.createdDate ? new Date(b.createdDate) : null;
				return bDate && aDate && bDate > aDate ? 1 : -1;
			});
	});
</script>

<div class="mx-auto text-center w-300 m-5">
	<div class="flex justify-between py-4">
		<input
			type="search"
			bind:value={searchTerm}
			placeholder="Search"
			class="w-full rounded-lg bg-gray-800 border border-gray-300 bg-text-gray-100 focus:border-transparent focus:ring-2 focus:ring-white focus:outline-none"
		/>
		<Button classes="w-50 ml-2" onclick={() => (openModal = !openModal)}
			>New Note</Button
		>
	</div>
	<div class="hidden sm:flex justify-between">
		<MiniButton classes="flex" color="blue" onclick={clearFilters}
			><FunnelX />Clear Filters</MiniButton
		>
		<div class="flex justify-between">
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
						filterCreatedStartDate.setFullYear(
							parseInt(tempDate[0]),
						);
						filterCreatedStartDate.setMonth(
							parseInt(tempDate[1]) - 1,
						);
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
						filterCreatedEndDate.setMonth(
							parseInt(tempDate[1]) - 1,
						);
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
	<NotecardTable notes={displayedNotes}></NotecardTable>
</div>

<AddOrUpdateNote bind:open={openModal}></AddOrUpdateNote>
