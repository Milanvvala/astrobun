<script setup>
import { ref, onMounted } from "vue"

const status = ref("")

onMounted(async () => {
  const res = await fetch("/api/health")
  const data = await res.text()
  status.value = { status: res.status, message: data }
})
</script>

<template>
  <div>
    <h1 class="text-lg">Server Status</h1>
    <p v-if="status">Status: {{ status.status }} - {{ status.message }}</p>
    <p v-else>Loading...</p>
  </div>
</template>