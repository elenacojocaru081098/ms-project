<script setup lang="ts">
import type { IUser } from '@/interfaces/user'
import { storeToRefs } from 'pinia'

const openNav = ref<boolean>(false)
const { user } = storeToRefs(useUserStore())
const { getFullNameRole } = useUsers()
const { logout } = useAuthStore()

const userInfo = computed(() => {
  if (user.value) return getFullNameRole(user.value as IUser)
})
</script>

<template>
  <v-app-bar scroll-behavior="hide" color="primary">
    <template #prepend>
      <v-app-bar-nav-icon @click="openNav = !openNav"></v-app-bar-nav-icon>
    </template>
    <v-app-bar-title>Aplicatie MS</v-app-bar-title>
    <template #append>
      <v-btn icon @click="logout()"><v-icon>mdi-logout-variant</v-icon></v-btn>
    </template>
  </v-app-bar>

  <v-navigation-drawer v-model="openNav" temporary>
    <v-list-item
      density="compact"
      prepend-icon="mdi-cog"
      :title="(userInfo as string)"
      :subtitle="user?.personal_info.email"
      class="py-6"
    ></v-list-item>

    <v-divider />

    <v-list class="py-4" nav>
      <v-list-item
        density="compact"
        prepend-icon="mdi-account"
        title="Gestionare utilizatori"
        subtitle="Creati, editati & stergeti"
        to="/users"
      ></v-list-item>
      <v-list-item
        density="compact"
        prepend-icon="mdi-account-group"
        title="Gestionare grupuri"
        subtitle="Creati, editati & stergeti"
        to="/groups"
      ></v-list-item>
      <v-list-item
        density="compact"
        prepend-icon="mdi-format-list-bulleted-type"
        title="Gestionare studii"
        subtitle="Creati, editati & stergeti"
        to="/studies"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
