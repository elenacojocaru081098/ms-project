<script setup lang="ts">
import type { IFormField } from '@/interfaces/form'

const validation = useValidationRules()
const registerRules = validation.getRegisterRules()
const valid = ref<boolean | null>(null)
const props = defineProps<{
  formTitle: string
  formFields: Array<IFormField>
}>()
const { formTitle, formFields } = toRefs(props)
defineEmits(['submitUser'])
const titleIcon = computed(() =>
  formTitle.value === 'Creare cont' ? 'mdi-account-plus-outline' : 'mdi-account-edit'
)
const buttonText = computed(() => (formTitle.value === 'Creare cont' ? 'Inregistrare' : 'Salvare'))
</script>

<template>
  <v-card-item :prepend-icon="titleIcon" density="compact">
    <v-card-title tag="section">{{ formTitle }}</v-card-title>
  </v-card-item>
  <v-card-text>
    <v-form
      id="register-form"
      @submit.prevent="$emit('submitUser', valid)"
      validate-on="input"
      v-model:model-value="valid"
    >
      <section v-for="field in formFields" :key="field.label">
        <v-text-field
          v-if="field.type === 'text'"
          :label="field.label"
          :rules="validation.getValidationRules(registerRules, field.rulesKey)"
          v-model="field.value"
          variant="solo-filled"
          density="compact"
          color="primary"
        ></v-text-field>
        <v-autocomplete
          v-if="field.type === 'select'"
          :label="field.label"
          :rules="validation.getValidationRules(registerRules, field.rulesKey)"
          :items="field.items"
          v-model="field.value"
          variant="solo-filled"
          density="compact"
          color="on-background"
          theme="light"
        ></v-autocomplete>
      </section>
    </v-form>
  </v-card-text>
  <v-card-actions class="justify-end">
    <v-btn
      form="register-form"
      type="submit"
      append-icon="mdi-arrow-right"
      class="px-4"
      variant="elevated"
      color="primary"
    >
      {{ buttonText }}
    </v-btn>
  </v-card-actions>
</template>
