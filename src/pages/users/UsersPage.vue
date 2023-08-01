<script setup lang="ts">
import type { IUser } from '@/interfaces/user'

function goToRegister() {
  router.push({ path: '/auth/register' })
}

const users = ref<Array<IUser>>()
const { getLowerRoleUsers } = useUsers()

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
  <article class="users-page">
    <UserList :invite-card="false" :users="users" @changed-user-role="changedUserRole" />
    <v-btn class="add-btn" color="secondary-container" @click="goToRegister" icon>
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </article>
</template>
