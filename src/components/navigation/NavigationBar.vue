<script setup lang="ts">
const openNav = ref<boolean>(false)
</script>

<template>
  <v-app-bar scroll-behavior="hide" color="primary-container">
    <template v-slot:prepend>
      <v-app-bar-nav-icon @click="openNav = !openNav"></v-app-bar-nav-icon>
    </template>
    <v-app-bar-title>Aplicatie MS</v-app-bar-title>
  </v-app-bar>

  <!-- TODO: add own content in navigation -->
  <v-navigation-drawer v-model="openNav" temporary>
    <v-list-item
      prepend-avatar="https://randomuser.me/api/portraits/men/78.jpg"
      title="John Leider"
    ></v-list-item>

    <v-divider></v-divider>

    <v-list density="compact" nav>
      <v-list-item prepend-icon="mdi-view-dashboard" title="Home" value="home"></v-list-item>
      <v-list-item prepend-icon="mdi-forum" title="About" value="about"></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
