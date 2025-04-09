<script lang="ts">
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
    //other hotkeys here
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
