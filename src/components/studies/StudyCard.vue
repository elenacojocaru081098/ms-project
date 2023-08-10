<script setup lang="ts">
import { storeToRefs } from 'pinia'

const props = defineProps<{
  studyId: string
}>()

const studiesStore = useStudiesStore()
const { currentStudy } = storeToRefs(studiesStore)

function goToAddQuestion() {
  router.push({ path: `/studies/${props.studyId}/questions/add` })
}

function goToEdit() {
  router.push({ path: `/studies/${props.studyId}` })
}

function startStudy() {
  router.push({ path: `/studies/${props.studyId}/answer` })
}

const { user } = useUserStore()
const { hasCoordinatorRights } = useUserPermission()
</script>

<template>
  <v-card>
    <v-card-item prepend-icon="mdi-format-list-bulleted-type">
      <v-card-title tag="section">
        {{ currentStudy.title }}
      </v-card-title>
      <v-card-subtitle class="text-subtitle-2">
        {{ currentStudy.details }}
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
