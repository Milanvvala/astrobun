<script setup lang="ts">
import { makeDroppable } from "@vue-dnd-kit/core";
import { useTemplateRef } from "vue";

const emit = defineEmits<(e: "drop") => void>();

const zoneRef = useTemplateRef<HTMLElement>("zoneRef");

const { isDragOver } = makeDroppable(zoneRef, {
  events: {
    onDrop: () => {
      emit("drop");
    },
  },
});
</script>

<template>
  <div
    ref="zoneRef"
    class="zone"
    :class="{ 'zone--over': isDragOver }"
  >
    <div class="zone-header" v-if="$slots.header">
      <slot name="header" />
    </div>
    <div class="zone-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
  .zone {
    min-height: 120px;
    padding: 1rem;
    border: 2px dashed rgba(62, 175, 124, 0.4);
    border-radius: 8px;
    background-color: rgba(62, 175, 124, 0.08);
    transition: background-color 0.15s, border-color 0.15s;
  }

  .zone--over {
    background-color: rgba(62, 175, 124, 0.18);
    border-color: rgba(62, 175, 124, 0.7);
  }

  .zone-header {
    margin-bottom: 0.75rem;
    font-size: 0.875rem;
    color: #6b7280;
  }

  .zone-content {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
</style>
