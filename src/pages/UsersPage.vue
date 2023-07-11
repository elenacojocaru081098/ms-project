<script setup lang="ts">
function goToRegister() {
  router.push({ path: '/auth/register' })
}

const searchTerm = ref<string>('')
</script>

<template>
  <v-text-field prepend-inner-icon="mdi-magnify" label="Cauta utilizator" v-model="searchTerm" />
  <UserCards :searchTerm="searchTerm" />
  <v-btn class="add-btn" color="secondary-container" @click="goToRegister" icon>
    <v-icon>mdi-plus</v-icon>
  </v-btn>
</template>

<style lang="scss">
@use '../styles/buttons.scss';
</style>
