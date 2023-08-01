<script setup lang="ts">
import { storeToRefs } from 'pinia'

const props = defineProps<{
  studyId: string
}>()

const studiesStore = useStudiesStore()
const { setStudyAsCurrentStudy } = studiesStore
const { currentStudy } = storeToRefs(studiesStore)

onBeforeMount(() => {
  setStudyAsCurrentStudy(props.studyId)
})
</script>

<template>
  <v-card density="compact">
    <v-card-item prepend-icon="mdi-format-list-bulleted-type" density="compact">
      <v-card-title tag="section">
        {{ currentStudy.title }}
      </v-card-title>
      <v-card-subtitle>
        {{ currentStudy.details }}
      </v-card-subtitle>
    </v-card-item>
  </v-card>
</template>
