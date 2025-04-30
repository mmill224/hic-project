<script lang="ts">
  import { db, getTags} from "$lib/db"; // Import the database instance
  import type { Tag } from "$lib/db";
  import { onMount } from "svelte";

  // Example: Hotkey for "Ctrl + S"
  function handleKeydown(event: KeyboardEvent) {
    if (event.altKey && event.key === "e") {
      event.preventDefault(); // Prevent default browser behavior
      // focus search bar
      document.getElementById("search-bar")?.focus();
    }
    if (event.altKey && event.key == "n") {
      event.preventDefault();
      const el = document.querySelector('.New-Note-Button') as HTMLElement;
      el?.click();
    }
    if (event.altKey && event.key == "Backspace") {
      event.preventDefault();
      const el = document.querySelector('.Clear-Filters-Button') as HTMLElement;
      el?.click();
    }
    //other hotkeys here
    if (event.altKey && event.key === "r") {
      getTags().then((tags: Tag[]) => {
        console.log("Tags: ", tags);
      });
      db.noteTagRelation.toArray().then((relations) => {
        console.log("Relations: ", relations);
      });
    }
  }

  // Add event listener on mount
  onMount(() => {
    window.addEventListener("keydown", handleKeydown);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  });
</script>
