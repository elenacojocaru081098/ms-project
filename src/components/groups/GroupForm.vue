<script setup lang="ts">
import type { IFormField } from '@/interfaces/form'

const valid = ref<boolean | null>(null)
const props = defineProps<{
  action: Function
  title: string
  formFields: Array<IFormField>
  showUsers: boolean
}>()

defineEmits(['showGroupMembers', 'showAllUsers'])

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
  <v-card>
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
        density="comfortable"
        size="small"
        form="group-form"
        type="button"
        class="px-4"
        variant="elevated"
        color="tertiary"
        @click="$emit('showAllUsers')"
        icon
      >
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
      <v-btn
        v-if="showUsers"
        density="comfortable"
        size="small"
        form="group-form"
        type="button"
        class="px-4"
        variant="elevated"
        color="secondary"
        @click="$emit('showGroupMembers')"
        icon
      >
        <v-icon>mdi-account-group</v-icon>
      </v-btn>
      <v-btn
        density="comfortable"
        size="small"
        form="group-form"
        type="submit"
        class="px-4"
        variant="elevated"
        color="primary"
        icon
      >
        <v-icon>mdi-check</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
