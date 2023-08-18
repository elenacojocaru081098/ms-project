<script setup lang="ts">
const largeScreen = useScreenSize().hasBigScreen()
</script>

<template>
  <v-app
    :class="{
      'large-screen': largeScreen
    }"
  >
    <ToastNotification />
    <DialogBox />
    <RouterView />
  </v-app>
</template>
