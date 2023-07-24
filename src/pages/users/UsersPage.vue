<script setup lang="ts">
import type { IUser } from '@/interfaces/user'

function goToRegister() {
  router.push({ path: '/auth/register' })
}

const searchTerm = ref<string>('')

const { getLowerRoleUsers, getFullName } = useUsers()

const users = ref<Array<IUser>>()

/**
 * Filters the user based on the search query
 */
const filteredUsers = computed(() => {
  const search = searchTerm.value.toLowerCase()

  const filtered = users.value?.filter((u) => {
    return (
      u.personal_info.email.includes(search) ||
      u.personal_info.pnc.includes(search) ||
      u.status.includes(search) ||
      getFullName(u).toLowerCase().includes(search)
    )
  })

  return filtered || []
})

/**
 * Refreshes users list after role change
 */
async function changedUserRole() {
  users.value = await getLowerRoleUsers()
}

/**
 * Initializes the full user list when the component is mounted
 */
onMounted(async () => {
  users.value = await getLowerRoleUsers()
})
</script>

<template>
  <v-text-field prepend-inner-icon="mdi-magnify" label="Cauta utilizator" v-model="searchTerm" />
  <UserCards :userList="filteredUsers" @changed-user-role="changedUserRole" />
  <v-btn class="add-btn" color="secondary-container" @click="goToRegister" icon>
    <v-icon>mdi-plus</v-icon>
  </v-btn>
</template>

<style lang="scss">
@use '../../styles/buttons.scss';
</style>
