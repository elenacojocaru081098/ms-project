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

const { hasCoordinatorRights } = useUserPermission()
</script>

<template>
  <v-app-bar scroll-behavior="hide" color="primary" density="comfortable">
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
      prepend-icon="mdi-cog"
      :title="(userInfo as string)"
      :subtitle="user?.personal_info.email"
      class="py-4"
    />

    <v-divider />

    <v-list class="py-4" nav>
      <v-list-item
        prepend-icon="mdi-home"
        title="Prima pagina"
        subtitle="Reveniti la panoul de control"
        to="/dashboard"
      />
      <v-list-item
        v-if="hasCoordinatorRights(user)"
        prepend-icon="mdi-account"
        title="Gestionare utilizatori"
        subtitle="Creati, editati & stergeti"
        to="/users"
      />
      <v-list-item
        prepend-icon="mdi-account-group"
        :title="hasCoordinatorRights(user) ? 'Gestionare grupuri' : 'Vizualizare grupuri'"
        :subtitle="hasCoordinatorRights(user) ? 'Creati, editati & stergeti' : undefined"
        to="/groups"
      />
      <v-list-item
        prepend-icon="mdi-format-list-bulleted-type"
        :title="hasCoordinatorRights(user) ? 'Gestionare studii' : 'Vizualizare studii'"
        :subtitle="hasCoordinatorRights(user) ? 'Creati, editati & stergeti' : undefined"
        :to="hasCoordinatorRights(user) ? '/studies' : '/studies/all'"
      />
    </v-list>
  </v-navigation-drawer>
</template>
