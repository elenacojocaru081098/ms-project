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
const userform = ref<HTMLFormElement>()

const emit = defineEmits(['submitUser'])

const titleIcon = computed(() =>
  formTitle.value === 'Creare cont' ? 'mdi-account-plus-outline' : 'mdi-account-edit'
)

const buttonText = computed(() => (formTitle.value === 'Creare cont' ? 'Inregistrare' : 'Salvare'))

function submitForm() {
  userform.value!.reset()
  emit('submitUser', valid.value)
}
</script>

<template>
  <v-card>
    <v-card-item :prepend-icon="titleIcon">
      <v-card-title tag="section">{{ formTitle }}</v-card-title>
    </v-card-item>
    <v-card-text>
      <v-form
        ref="userform"
        id="register-form"
        @submit.prevent="submitForm"
        validate-on="lazy input"
        v-model:model-value="valid"
      >
        <section v-for="field in formFields" :key="field.label">
          <v-text-field
            v-if="field.type === 'text'"
            :label="field.label"
            :rules="validation.getValidationRules(registerRules, field.rulesKey)"
            v-model="field.value"
            variant="solo-filled"
            color="primary"
          />
          <v-autocomplete
            v-if="field.type === 'select'"
            :label="field.label"
            :rules="validation.getValidationRules(registerRules, field.rulesKey)"
            :items="field.items"
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
        form="register-form"
        type="submit"
        append-icon="mdi-arrow-right"
        class="px-4"
        color="primary"
      >
        {{ buttonText }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
