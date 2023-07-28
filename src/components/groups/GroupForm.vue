<script setup lang="ts">
import type { IFormField } from '@/interfaces/form'

const valid = ref<boolean | null>(null)
const props = defineProps<{
  action: Function
  title: string
  btn: string
  formFields: Array<IFormField>
  showUsers: boolean
}>()

defineEmits(['showGroupMembers'])

/**
 * Submits the form
 */
function submitForm() {
  if (!valid) return

  // construct the data object from the form fields
  let data: Record<string, string> = {}
  props.formFields.forEach((f) => (data[f.key] = f.value))

  props.action(data)
}
</script>

<template>
  <v-card-item prepend-icon="mdi-account-group" density="compact">
    <v-card-title tag="section">{{ title }}</v-card-title>
  </v-card-item>
  <v-card-text>
    <v-form
      id="group-form"
      @submit.prevent="submitForm"
      validate-on="blur"
      v-model:model-value="valid"
    >
      <section v-for="field in formFields" :key="field.label">
        <v-text-field
          :prepend-inner-icon="field.prependIcon"
          :label="field.label"
          :type="field.typeProp || 'text'"
          v-model="field.value"
          density="compact"
          variant="solo-filled"
          color="primary"
          hide-details
        ></v-text-field>
      </section>
    </v-form>
  </v-card-text>
  <v-card-actions class="justify-end">
    <v-btn
      v-if="showUsers"
      form="group-form"
      type="button"
      append-icon="mdi-account-group"
      class="px-4"
      variant="elevated"
      color="secondary"
      @click="$emit('showGroupMembers')"
    >
      Membri
    </v-btn>
    <v-btn
      form="group-form"
      type="submit"
      append-icon="mdi-check"
      class="px-4"
      variant="elevated"
      color="primary"
    >
      {{ btn }}
    </v-btn>
  </v-card-actions>
</template>
