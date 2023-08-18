<script setup lang="ts">
import { storeToRefs } from 'pinia'

const searchTerm = ref<string>('')
const studiesStore = useStudiesStore()
const { studies } = storeToRefs(studiesStore)

/**
 * Filters the groups based on the search query
 */
const filteredStudies = computed(() =>
  studies.value?.filter((s) => s.title.toLowerCase().includes(searchTerm.value.toLowerCase()))
)

function goToCreateStudy() {
  router.push({ path: 'studies/create' })
}

const { user } = storeToRefs(useUserStore())
const { hasCoordinatorRights } = useUserPermission()
</script>

<template>
  <v-text-field prepend-inner-icon="mdi-magnify" label="Cauta studiu" v-model="searchTerm" />
  <StudiesList :studies="filteredStudies" />
  <v-btn
    v-if="hasCoordinatorRights(user)"
    class="add-btn"
    density="default"
    color="secondary-container"
    @click="goToCreateStudy"
    icon
  >
    <v-icon>mdi-plus</v-icon>
  </v-btn>
</template>
