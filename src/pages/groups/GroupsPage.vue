<script setup lang="ts">
import { storeToRefs } from 'pinia'

const searchTerm = ref<string>('')

const groupsStore = useGroupsStore()
const { groups, groupsInitialized } = storeToRefs(groupsStore)

/**
 * Filters the groups based on the search query
 */
const filteredGroups = computed(() =>
  groups.value?.filter((g) => g.name.toLowerCase().includes(searchTerm.value.toLowerCase()))
)

function goToCreateGroup() {
  router.push({ path: '/groups/create' })
}

const { fetchCurrentUserGroups } = groupsStore

onBeforeMount(() => {
  if (!groupsInitialized.value) fetchCurrentUserGroups()
})
</script>

<template>
  <article>
    <v-text-field prepend-inner-icon="mdi-magnify" label="Cauta grup" v-model="searchTerm" />
    <GroupList :groups="filteredGroups" />
    <v-btn class="add-btn" color="secondary-container" @click="goToCreateGroup" icon>
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </article>
</template>
