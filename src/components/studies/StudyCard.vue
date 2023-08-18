<script setup lang="ts">
import type { IStudy } from '@/interfaces/study'

const props = defineProps<{
  study: IStudy
}>()

function goToAddQuestion() {
  router.push({ path: `/studies/${props.study.id}/questions/add` })
}

function goToEdit() {
  router.push({ path: `/studies/${props.study.id}` })
}

function startStudy() {
  router.push({ path: `/studies/${props.study.id}/answer` })
}

const { user } = useUserStore()
const { hasCoordinatorRights } = useUserPermission()
</script>

<template>
  <v-card class="my-2">
    <v-card-item prepend-icon="mdi-format-list-bulleted-type">
      <v-card-title tag="section">
        {{ study.title }}
      </v-card-title>
      <v-card-subtitle class="text-subtitle-2">
        {{ study.details }}
      </v-card-subtitle>
    </v-card-item>
    <v-divider />
    <v-card-actions class="justify-end">
      <section v-if="hasCoordinatorRights(user)">
        <v-btn
          form="study-form"
          type="button"
          append-icon="mdi-help-box-multiple-outline"
          class="px-4"
          color="secondary"
          @click="goToAddQuestion"
        >
          Intrebari
        </v-btn>
        <v-btn
          form="study-form"
          type="submit"
          append-icon="mdi-pencil"
          class="px-4"
          color="primary"
          @click="goToEdit"
        >
          Editeaza
        </v-btn>
      </section>
      <section v-else>
        <v-btn
          form="study-form"
          type="button"
          append-icon="mdi-arrow-right"
          class="px-4"
          color="secondary"
          @click="startStudy"
        >
          Raspunde
        </v-btn>
      </section>
    </v-card-actions>
  </v-card>
</template>
