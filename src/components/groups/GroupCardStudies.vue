<script setup lang="ts">
import { storeToRefs } from 'pinia'

const props = defineProps<{
  studiesIds?: Array<string>
}>()

const studiesStore = useStudiesStore()
const { studies } = storeToRefs(studiesStore)
const groupStudies = computed(() => studies.value.filter((s) => props.studiesIds?.includes(s.id)))

function goToStudy(sid: string) {
  router.push({ path: `/studies/${sid}/answer` })
}
</script>

<template>
  <section
    class="d-flex align-center justify-space-between"
    v-for="study in groupStudies"
    :key="study.id"
  >
    <p class="text-body-1">{{ study.title }}</p>
    <v-btn color="primary" @click="goToStudy(study.id)" icon>
      <v-icon>mdi-arrow-right</v-icon>
    </v-btn>
  </section>
</template>
