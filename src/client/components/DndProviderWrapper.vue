<script setup lang="ts">
import { DnDProvider } from "@vue-dnd-kit/core";
</script>

<template>
  <DnDProvider>
    <slot />
  </DnDProvider>
</template>
