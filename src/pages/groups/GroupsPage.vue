<script setup lang="ts">
import type { IGroup } from '@/interfaces/group'

const searchTerm = ref<string>('')
const groupsStore = useGroupsStore()
const { getAllGroups } = groupsStore
const groups = ref<Array<IGroup>>(await getAllGroups())

/**
 * Filters the groups based on the search query
 */
const filteredGroups = computed(() =>
  groups.value?.filter((g) => g.name.toLowerCase().includes(searchTerm.value.toLowerCase()))
)

function goToCreateGroup() {
  router.push({ path: '/groups/create' })
}
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
