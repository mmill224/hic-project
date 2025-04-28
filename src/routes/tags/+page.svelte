<script lang="ts">
  import { db } from "$lib/db"; // Import the database instance
  import type { Tag } from "$lib/db";
  import { onMount } from "svelte";

  let tags: Tag[] = []; // Array to store all tags

  // Fetch all tags from the database when the component is mounted
  onMount(async () => {
    tags = await db.tags.toArray();
  });

  // Generate the URL for the home page with the tag in the search bar
  function getTagLink(tagName: string): string {
    return `/?search=%23${encodeURIComponent(tagName)}`;
  }
</script>

<div class="p-4">
  <h1 class="text-2xl font-bold mb-4">Tags</h1>
  <ul class="list-disc pl-5">
    {#each tags as tag}
      <li>
        <a
          href={getTagLink(tag.name)}
          class="text-blue-500 hover:underline"
        >
          #{tag.name}
        </a>
      </li>
    {/each}
  </ul>
</div>