<script setup lang="ts">
import type { IGroup } from '@/interfaces/group'

defineProps<{
  groups: Array<IGroup>
}>()
</script>

<template>
  <GroupCard v-for="group in groups" :key="group.id" :groupId="group.id" />
</template>
