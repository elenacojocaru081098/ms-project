<script setup lang="ts">
import type { IFormField } from '@/interfaces/form'
import type { IStudy } from '@/interfaces/study'
import { storeToRefs } from 'pinia'

const props = defineProps<{
  formFields: Array<IFormField>
  title: string
  action: Function
  newStudy: boolean
  study: IStudy
}>()

const valid = ref<boolean>(false)
const { currentStudy } = storeToRefs(useStudiesStore())
const activeStudy = ref<IStudy>(props.newStudy ? props.study : currentStudy.value)

/**
 * Submits the form
 */
function submitForm() {
  if (!valid.value) return

  let gid: string = ''
  props.formFields.forEach((f) => {
    if (f.key === 'group') gid = f.value!
    activeStudy.value[f.key] = f.value
  })
  props.action(gid)
}

function goToAddQuestion() {
  router.push({ path: `/studies/${props.study.id}/questions/add` })
}
</script>

<template>
  <v-card>
    <v-card-item prepend-icon="mdi-format-list-bulleted-type">
      <v-card-title tag="section">{{ title }}</v-card-title>
    </v-card-item>
    <v-card-text>
      <v-form
        id="study-form"
        @submit.prevent="submitForm"
        validate-on="lazy submit"
        v-model:model-value="valid"
      >
        <section v-for="field in formFields" :key="field.label">
          <v-text-field
            v-if="field.type === 'text'"
            :label="field.label"
            v-model="field.value"
            variant="solo-filled"
            color="primary"
          />
          <v-textarea
            v-if="field.type === 'textarea'"
            :label="field.label"
            v-model="field.value"
            variant="solo-filled"
            color="primary"
          />
          <v-autocomplete
            v-if="field.type === 'select'"
            :label="field.label"
            :items="field.items"
            item-title="name"
            item-value="id"
            v-model="field.value"
            variant="solo-filled"
            color="on-background"
            theme="light"
          />
        </section>
      </v-form>
    </v-card-text>
    <v-card-actions class="justify-end">
      <v-btn
        v-if="!newStudy"
        form="study-form"
        type="button"
        append-icon="mdi-help-box-multiple-outline"
        class="px-4"
        color="secondary"
        @click="goToAddQuestion"
      >
        Intrebari
      </v-btn>
      <v-btn form="study-form" type="submit" append-icon="mdi-check" class="px-4" color="primary">
        Salveaza
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
