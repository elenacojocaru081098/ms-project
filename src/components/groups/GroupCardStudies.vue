<script setup lang="ts">
const { studies } = useStudiesStore()

function goToStudy(sid: string) {
  router.push({ path: `/studies/${sid}/answer` })
}

onBeforeMount(() => useFetchOnNavigation().fetchStudiesResources())
</script>

<template>
  <section
    class="d-flex align-center justify-space-between"
    v-for="study in studies"
    :key="study.id"
  >
    <p class="text-body-1">{{ study.title }}</p>
    <v-btn color="primary" @click="goToStudy(study.id)" icon>
      <v-icon>mdi-arrow-right</v-icon>
    </v-btn>
  </section>
</template>
