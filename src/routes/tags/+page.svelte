<script lang="ts">
  import TagList from "$lib/components/TagList.svelte";
  import { db } from "$lib/db"; // Import the database instance
  import type { Tag } from "$lib/db";
  import { onMount } from "svelte";

  let tags: string[] = []; // Array to store all tags

  // Fetch all tags from the database when the component is mounted
  onMount(async () => {
    tags = (await db.tags.toArray()).reduce((acc: string[], tag: Tag) => {
      if (tag.name && !acc.includes(tag.name)) {
        acc.push(tag.name); // Add unique tag names to the array
      }
      return acc;
    }, []);
  });

  // Generate the URL for the home page with the tag in the search bar
  function getTagLink(tagName: string): string {
    return `/?search=%23${encodeURIComponent(tagName)}`;
  }
</script>

<div id="tags" class="flex">
  <TagList {tags} editable={false}></TagList>
</div>
