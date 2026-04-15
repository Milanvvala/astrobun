<script setup lang="ts">
import { DnDProvider } from "@vue-dnd-kit/core";
import { ref } from "vue";
import DraggableItem from "./DraggableItem.vue";
import DropZone from "./DropZone.vue";

/** Track which zone the item is currently in */
const droppedZone = ref<"outer" | "inner">("outer");
</script>

<template>
  <DnDProvider>
    <div class="test-container">
      <h1>Vue DnD Kit Test</h1>
      <p class="description">
        Drag the item between zones. This demonstrates basic drag and drop functionality.
      </p>
      
      <DropZone
        class="zone-outer"
        @drop="droppedZone = 'outer'"
      >
        <template #header>
          <span class="zone-label">Outer Zone {{ droppedZone === 'outer' ? '✓' : '' }}</span>
        </template>
        <DraggableItem v-if="droppedZone === 'outer'" />

        <DropZone
          class="zone-inner"
          @drop="droppedZone = 'inner'"
        >
          <template #header>
            <span class="zone-label">Inner Zone {{ droppedZone === 'inner' ? '✓' : '' }}</span>
          </template>
          <DraggableItem v-if="droppedZone === 'inner'" />
        </DropZone>
      </DropZone>

      <div class="status">
        <p>
          Current location: <strong>{{ droppedZone }}</strong>
        </p>
      </div>
    </div>
  </DnDProvider>
</template>
      <DraggableItem v-if="droppedZone === 'outer'" />

      <DropZone
        class="zone-inner"
        @drop="droppedZone = 'inner'"
      >
        <template #header>
          <span class="zone-label">Inner Zone {{ droppedZone === 'inner' ? '✓' : '' }}</span>
        </template>
        <DraggableItem v-if="droppedZone === 'inner'" />
      </DropZone>
    </DropZone>

    <div class="status">
      <p>
        Current location: <strong>{{ droppedZone }}</strong>
      </p>
    </div>
  </div>
</template>

<style scoped>
  .test-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem;
  }

  h1 {
    font-size: 1.75rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    color: #111827;
  }

  .description {
    color: #6b7280;
    margin-bottom: 1.5rem;
  }

  .zone-outer {
    min-height: 200px;
  }

  .zone-inner {
    margin-top: 1rem;
    min-height: 100px;
  }

  .zone-label {
    display: block;
    font-size: 0.875rem;
    color: #6b7280;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }

  .status {
    margin-top: 1.5rem;
    padding: 1rem;
    background: #f3f4f6;
    border-radius: 8px;
  }

  .status p {
    margin: 0;
    color: #374151;
  }

  .status strong {
    color: #111827;
    text-transform: capitalize;
  }
</style>
