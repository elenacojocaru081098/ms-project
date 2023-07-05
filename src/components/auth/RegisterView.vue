<script setup lang="ts">
const validation = useValidationRules()
const registerRules = validation.getRegisterRules()
const formFields = ref(useFormStructure().getRegisterForm())
const valid = ref<boolean | null>(null)

function submitRegisterForm() {
  if (!valid.value) return

  const { handleEmailRegister } = useAuthStore()
  let data: Record<string, string> = {}

  formFields.value.forEach((f) => (data[f.key] = f.value))
  data.gender = extractGenderFromPNC(data.pnc)
  data.birthdate = extractBirthdateFromPNC(data.pnc)
  handleEmailRegister(data)
}
</script>

<template>
  <v-card-item prepend-icon="mdi-account-plus-outline" density="compact">
    <v-card-title tag="section">Creare cont</v-card-title>
  </v-card-item>
  <v-card-text>
    <v-form
      id="register-form"
      @submit.prevent="submitRegisterForm"
      validate-on="blur"
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
          color="on-background"
        ></v-text-field>
        <v-select
          v-if="field.type === 'select'"
          :label="field.label"
          :rules="validation.getValidationRules(registerRules, field.rulesKey)"
          :items="field.items"
          v-model="field.value"
          variant="solo-filled"
          density="compact"
          color="on-background"
        ></v-select>
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
      Inregistrare
    </v-btn>
  </v-card-actions>
</template>
