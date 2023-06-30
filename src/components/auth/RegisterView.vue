<script setup lang="ts">
const registerRules = useValidationRules().getRegisterRules()
const formFields = useFormStructure().getRegisterForm()

function getValidationRules(key: string | undefined) {
  if (key) return registerRules[key as keyof typeof registerRules]
}
</script>

<template>
  <v-card-item prepend-icon="mdi-account-plus-outline">
    <v-card-title tag="section">Creare cont</v-card-title>
  </v-card-item>
  <v-card-text>
    <v-form @submit.prevent validate-on="blur">
      <section v-for="field in formFields" :key="field.label">
        <v-text-field
          v-if="field.type === 'text'"
          :label="field.label"
          :rules="getValidationRules(field.rulesKey)"
          variant="solo-filled"
          density="compact"
        ></v-text-field>
        <v-select
          v-if="field.type === 'select'"
          :label="field.label"
          :rules="getValidationRules(field.rulesKey)"
          :items="field.items"
          variant="solo-filled"
          density="compact"
        ></v-select>
      </section>
    </v-form>
  </v-card-text>
  <v-card-actions class="justify-end">
    <v-btn type="submit" append-icon="mdi-arrow-right">Inregistrare</v-btn>
  </v-card-actions>
</template>
