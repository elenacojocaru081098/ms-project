<script setup lang="ts">
import type { IFormField } from '@/interfaces/form'
import type { IStudy } from '@/interfaces/study'
import { storeToRefs } from 'pinia'

const props = defineProps<{
  formFields: Array<IFormField>
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

  props.formFields.forEach((f) => (activeStudy.value[f.key] = f.value))
  props.action()
}
</script>

<template>
  <v-card>
    <v-card-item prepend-icon="mdi-format-list-bulleted-type" density="compact">
      <v-card-title tag="section">Creare studiu</v-card-title>
    </v-card-item>
    <v-card-text>
      <v-form
        id="study-form"
        @submit.prevent="submitForm"
        validate-on="blur"
        v-model:model-value="valid"
      >
        <section v-for="field in formFields" :key="field.label">
          <v-text-field
            v-if="field.type === 'text'"
            :label="field.label"
            v-model="field.value"
            variant="solo-filled"
            density="compact"
            color="primary"
          />
          <v-textarea
            v-if="field.type === 'textarea'"
            :label="field.label"
            v-model="field.value"
            variant="solo-filled"
            density="compact"
            color="primary"
          />
        </section>
      </v-form>
    </v-card-text>
    <v-card-actions class="justify-end">
      <v-btn
        form="study-form"
        type="button"
        append-icon="mdi-help-box-multiple-outline"
        class="px-4"
        variant="elevated"
        color="secondary"
      >
        Intrebari
      </v-btn>
      <v-btn
        form="study-form"
        type="submit"
        append-icon="mdi-check"
        class="px-4"
        variant="elevated"
        color="primary"
      >
        Salveaza
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
