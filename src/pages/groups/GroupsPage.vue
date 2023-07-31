<script setup lang="ts">
import { storeToRefs } from 'pinia'

const searchTerm = ref<string>('')

const groupsStore = useGroupsStore()
const { groups } = storeToRefs(groupsStore)

// TODO: edit group (add users/coords)

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
  fetchCurrentUserGroups()
})
</script>

<template>
  <article>
    <v-text-field prepend-inner-icon="mdi-magnify" label="Cauta grup" v-model="searchTerm" />
    <GroupCards :group-list="filteredGroups" />
    <v-btn class="add-btn" color="secondary-container" @click="goToCreateGroup" icon>
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </article>
</template>

<style lang="scss">
@use '../../styles/buttons.scss';
</style>
