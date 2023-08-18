<script setup lang="ts">
const largeScreen = useScreenSize().hasBigScreen()
</script>

<template>
  <NavigationBar />
  <v-main>
    <section
      :class="[
        'main-section pa-4',
        {
          'pa-16': largeScreen
        }
      ]"
    >
      <Suspense>
        <template #default>
          <RouterView />
        </template>
        <template #fallback>
          <section class="w-screen h-screen d-flex justify-center align-center">
            <v-progress-circular indeterminate :size="100" />
          </section>
        </template>
      </Suspense>
    </section>
  </v-main>
</template>
