<script setup lang="ts">
import { storeToRefs } from 'pinia'

const auth = useAuthStore()
const { page } = storeToRefs(auth)
</script>

<template>
  <LoginView v-if="page === 'login'"></LoginView>
  <ForgotView v-else-if="page === 'forgot'"></ForgotView>
</template>
