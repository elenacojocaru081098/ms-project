<script setup lang="ts">
import { storeToRefs } from 'pinia'

const auth = useAuthStore()
const { page } = storeToRefs(auth)
</script>

<template>
  <div class="layout-login h-screen d-flex align-center justify-center">
    <v-card class="w-75" density="compact">
      <LoginView v-if="page === 'login'"></LoginView>
      <RegisterView v-else-if="page === 'register'"></RegisterView>
    </v-card>
  </div>
</template>
