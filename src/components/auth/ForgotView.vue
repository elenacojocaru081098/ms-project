<script setup lang="ts">
const validation = useValidationRules()
const emailRules = validation.getForgotRules()
const formFields = ref(useFormStructure().getForgotForm())
const valid = ref<boolean | null>(null)
const { setAuthPage, resetPassword } = useAuthStore()

/**
 * Submits the login form when clicking on the button
 */
function forgotPassword() {
  if (!valid.value) return

  // construct the data object from the form fields
  let data: Record<string, string> = {}
  formFields.value.forEach((f) => (data[f.key] = f.value))

  resetPassword(data.email)
}
</script>

<template>
  <v-card-item prepend-icon="mdi-form-textbox-password" density="compact">
    <v-card-title tag="section">Resetare parola</v-card-title>
  </v-card-item>
  <v-card-text>
    <v-form
      id="forgot-form"
      @submit.prevent="forgotPassword"
      validate-on="blur"
      v-model:model-value="valid"
    >
      <section v-for="field in formFields" :key="field.label">
        <v-text-field
          :prepend-inner-icon="field.prependIcon"
          :label="field.label"
          :type="field.typeProp || 'text'"
          :rules="validation.getValidationRules(emailRules, field.rulesKey)"
          v-model="field.value"
          density="compact"
          variant="solo-filled"
          color="primary"
        ></v-text-field>
      </section>
    </v-form>
    <p @click="setAuthPage('login')">Intra in cont</p>
  </v-card-text>
  <v-card-actions class="justify-end">
    <v-btn
      form="forgot-form"
      type="submit"
      append-icon="mdi-arrow-right"
      class="px-4"
      variant="elevated"
      color="primary"
    >
      Trimite email
    </v-btn>
  </v-card-actions>
</template>
