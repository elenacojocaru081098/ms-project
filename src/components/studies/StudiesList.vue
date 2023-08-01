<script setup lang="ts">
import { storeToRefs } from 'pinia'

const searchTerm = ref<string>('')

const studiesStore = useStudiesStore()
const { studies } = storeToRefs(studiesStore)

function goToCreateStudy() {
  router.push({ path: 'studies/create' })
}
</script>

<template>
  <article>
    <v-text-field prepend-inner-icon="mdi-magnify" label="Cauta studiu" v-model="searchTerm" />
    <StudyCard v-for="study in studies" :key="study.id" :study-id="study.id" />
    <v-btn class="add-btn" color="secondary-container" @click="goToCreateStudy" icon>
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </article>
</template>
