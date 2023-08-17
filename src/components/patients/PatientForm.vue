<script setup lang="ts">
import type { IFormField } from '@/interfaces/form'
import type { IPatient } from '@/interfaces/study'

const props = defineProps<{
  title: string
  formFields: Array<IFormField>
  newPatient: boolean
}>()

const valid = ref<boolean | null>(null)
const validation = useValidationRules()
const validationRules = validation.getPatientRules()
const emit = defineEmits(['createNewPatient'])

function submitForm() {
  if (!valid.value) return

  let data = {} as IPatient
  props.formFields.forEach((f) => (data[f.key] = f.value))
  data.gender = extractGenderFromPNC(data.pnc)
  data.birthdate = extractBirthdateFromPNC(data.pnc)

  emit('createNewPatient', data as IPatient)
}
</script>

<!-- TODO: move gotoquestions to store -->
<!-- TODO: add gotoquestion @click on continue -->

<template>
  <v-card>
    <v-card-item prepend-icon="mdi-account">
      <v-card-title tag="section">{{ title }}</v-card-title>
    </v-card-item>
    <v-card-text>
      <v-form
        id="patient-form"
        @submit.prevent="submitForm"
        validate-on="lazy submit"
        v-model:model-value="valid"
      >
        <section v-for="field in formFields" :key="field.label">
          <v-text-field
            :label="field.label"
            :type="field.typeProp || 'text'"
            :rules="validation.getValidationRules(validationRules, field.rulesKey)"
            v-model="field.value"
            variant="solo-filled"
            color="primary"
            class="my-2"
            :disabled="!newPatient"
          />
        </section>
      </v-form>
    </v-card-text>
    <v-card-actions class="justify-end">
      <v-btn v-if="newPatient" form="patient-form" type="submit" color="primary">Salveaza</v-btn>
      <v-btn v-else form="patient-form" color="primary" @click="">Continua</v-btn>
    </v-card-actions>
  </v-card>
</template>
