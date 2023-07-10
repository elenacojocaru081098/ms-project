<script setup lang="ts">
import type { IUser } from '@/interfaces/user'

function goToRegister() {
  router.push({ path: '/auth/register' })
}

const users = ref<Array<IUser>>()
const { getLowerRoleUsers, getFullNameRole } = useUsers()

onMounted(async () => {
  users.value = await getLowerRoleUsers()
})

const filteredUsers = computed(() => users.value)
</script>

<template>
  <v-card density="compact" v-for="user in filteredUsers" :key="user.id">
    <v-card-item prepend-icon="mdi-account" density="compact">
      <v-card-title tag="section">{{ getFullNameRole(user as IUser) }}</v-card-title>
      <v-card-subtitle>{{ user.personal_info.email }}</v-card-subtitle>
    </v-card-item>
    <v-card-actions class="justify-space-evenly" density="compact">
      <v-btn color="secondary" icon><v-icon>mdi-account-arrow-up</v-icon></v-btn>
      <v-btn color="tertiary" icon><v-icon>mdi-account-arrow-down</v-icon></v-btn>
      <v-divider vertical />
      <v-btn color="primary" icon><v-icon>mdi-account-edit</v-icon></v-btn>
      <v-btn color="error" icon><v-icon>mdi-trash-can</v-icon></v-btn>
    </v-card-actions>
  </v-card>

  <v-btn class="add-btn" color="secondary-container" @click="goToRegister" icon>
    <v-icon>mdi-plus</v-icon>
  </v-btn>
</template>

<style lang="scss">
@use '../styles/buttons.scss';
</style>
