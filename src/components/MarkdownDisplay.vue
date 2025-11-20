<script setup>
import { ref, watch, nextTick } from "vue";
import { FileText } from "lucide-vue-next";
import EmptyState from "./EmptyState.vue";

const props = defineProps({
  html: String,
  searchQuery: String,
  filteredTasks: Array,
  allTasks: Array,
});

const contentRef = ref(null);

// Filter and highlight content based on search and filters
function applyFiltersAndHighlight() {
  if (!contentRef.value) return;

  const content = contentRef.value;
  const query = props.searchQuery?.toLowerCase() || "";
  const hasFilters =
    query ||
    (props.filteredTasks && props.filteredTasks.length < props.allTasks.length);

  // Get filtered task texts for matching
  const filteredTaskTexts =
    props.filteredTasks?.map((t) => t.text.toLowerCase()) || [];

  // Process all list items
  const listItems = content.querySelectorAll("li");
  listItems.forEach((li) => {
    const text = li.textContent.toLowerCase();
    let shouldShow = true;

    if (hasFilters) {
      // Check if this item matches any filtered task
      const matchesFilter =
        !props.filteredTasks ||
        filteredTaskTexts.some(
          (taskText) =>
            text.includes(taskText) || taskText.includes(text.trim())
        );

      // Check if it matches search query
      const matchesSearch = !query || text.includes(query);

      shouldShow = matchesFilter && matchesSearch;
    }

    if (shouldShow) {
      li.style.display = "";
      li.classList.remove("opacity-30");
    } else {
      li.style.display = "none";
    }
  });

  // Hide empty sections
  const headings = content.querySelectorAll("h2, h3");
  headings.forEach((heading) => {
    if (hasFilters) {
      let nextElement = heading.nextElementSibling;
      let hasVisibleItems = false;

      // Check if the section has any visible list items
      while (nextElement && !["H1", "H2", "H3"].includes(nextElement.tagName)) {
        if (nextElement.tagName === "UL") {
          const visibleItems = Array.from(
            nextElement.querySelectorAll("li")
          ).filter((li) => li.style.display !== "none");
          if (visibleItems.length > 0) {
            hasVisibleItems = true;
            break;
          }
        }
        nextElement = nextElement.nextElementSibling;
      }

      heading.style.display = hasVisibleItems ? "" : "none";
    } else {
      heading.style.display = "";
    }
  });

  // Apply search highlighting to visible items
  if (query) {
    highlightSearchMatches(query);
  }
}

function highlightSearchMatches(query) {
  if (!contentRef.value || !query) return;

  const content = contentRef.value;
  const walker = document.createTreeWalker(
    content,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: (node) => {
        // Skip if parent is hidden
        let parent = node.parentElement;
        while (parent && parent !== content) {
          if (parent.style.display === "none") {
            return NodeFilter.FILTER_REJECT;
          }
          parent = parent.parentElement;
        }
        return NodeFilter.FILTER_ACCEPT;
      },
    },
    false
  );

  const nodesToReplace = [];
  let node;

  while ((node = walker.nextNode())) {
    const text = node.nodeValue;
    const lowerText = text.toLowerCase();

    if (lowerText.includes(query) && node.parentElement.tagName !== "MARK") {
      nodesToReplace.push(node);
    }
  }

  nodesToReplace.forEach((node) => {
    const text = node.nodeValue;
    const regex = new RegExp(`(${query})`, "gi");
    const highlightedText = text.replace(
      regex,
      '<mark class="bg-yellow-200 dark:bg-yellow-700 px-1 rounded">$1</mark>'
    );

    const span = document.createElement("span");
    span.innerHTML = highlightedText;
    node.parentNode.replaceChild(span, node);
  });
}

watch(
  () => [props.html, props.searchQuery, props.filteredTasks],
  async () => {
    await nextTick();
    if (props.html && contentRef.value) {
      contentRef.value.innerHTML = props.html;
      applyFiltersAndHighlight();
    }
  },
  { immediate: true, deep: true }
);
</script>

<template>
  <div class="bg-white dark:bg-black overflow-hidden">
    <EmptyState
      v-if="!html"
      :icon="FileText"
      title="No content yet"
      description="Paste your markdown or upload a file to transform it into an interactive task list"
    />
    <div v-else ref="contentRef" class="markdown-content p-6"></div>
  </div>
</template>

<style scoped>
@reference "tailwindcss";

/* Light mode text colors */
.markdown-content :deep(h1),
.markdown-content :deep(h2),
.markdown-content :deep(h3),
.markdown-content :deep(p),
.markdown-content :deep(li),
.markdown-content :deep(ul),
.markdown-content :deep(strong) {
  @apply text-gray-700;
}

/* Dark mode text colors */
.dark .markdown-content :deep(h1),
.dark .markdown-content :deep(h2),
.dark .markdown-content :deep(h3),
.dark .markdown-content :deep(p),
.dark .markdown-content :deep(li),
.dark .markdown-content :deep(ul),
.dark .markdown-content :deep(strong) {
  @apply text-gray-400;
}

/* Element-specific styles */
.markdown-content :deep(h1) {
  @apply text-2xl mb-4;
}

.markdown-content :deep(h2) {
  @apply text-2xl font-light mt-6 mb-3 pb-2;
}

.markdown-content :deep(h2:first-child) {
  @apply mt-0;
}

.markdown-content :deep(h3) {
  @apply text-base font-semibold mt-4 mb-2;
}

.markdown-content :deep(p) {
  @apply mb-3 leading-6 font-extralight text-lg;
}

.markdown-content :deep(ul) {
  @apply ml-5 mb-3 space-y-1;
}

.markdown-content :deep(li) {
  @apply leading-6 text-lg;
}

.markdown-content :deep(code) {
  @apply bg-red-50 dark:bg-slate-800 text-red-700 dark:text-red-300 px-2 py-0.5 rounded text-sm font-mono font-medium;
}

.markdown-content :deep(pre) {
  @apply bg-gray-900 dark:bg-slate-950 text-gray-50 p-4 rounded-md overflow-x-auto mb-4;
}

.markdown-content :deep(pre code) {
  @apply bg-transparent text-gray-50 p-0 font-normal;
}

.markdown-content :deep(strong) {
  @apply font-semibold;
}

.markdown-content :deep(a) {
  @apply text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 underline transition-colors;
}
</style>
