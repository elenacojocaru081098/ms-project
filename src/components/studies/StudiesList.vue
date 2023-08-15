<script setup lang="ts">
import type { IStudy } from '@/interfaces/study'

defineProps<{
  studies: Array<IStudy>
}>()
</script>

<template>
  <article>
    <StudyCard v-for="study in studies" :key="study.id" :study="study" />
  </article>
</template>
