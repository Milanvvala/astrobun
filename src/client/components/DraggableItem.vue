<script setup lang="ts">
import { makeDraggable } from "@vue-dnd-kit/core";
import { useTemplateRef } from "vue";

const itemRef = useTemplateRef<HTMLElement>("itemRef");

const { isDragging } = makeDraggable(itemRef);
</script>

<template>
  <div
    ref="itemRef"
    class="draggable-item"
    :style="{
      opacity: isDragging ? 0 : 1,
    }"
  >
    <slot>Drag me</slot>
  </div>
</template>

<style scoped>
  .draggable-item {
    padding: 0.75rem 1.25rem;
    border-radius: 8px;
    background-color: #3eaf7c;
    color: white;
    cursor: grab;
    user-select: none;
    font-weight: 500;
    display: inline-block;
    transition: all 0.15s ease;
  }

  .draggable-item:hover {
    background-color: #369e6e;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .draggable-item:active {
    cursor: grabbing;
  }
</style>
