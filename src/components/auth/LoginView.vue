<script setup lang="ts">
const validation = useValidationRules()
const loginRules = validation.getLoginRules()
const formFields = ref(useFormStructure().getLoginForm())
const valid = ref<boolean | null>(null)
const { setAuthPage, handleEmailLogin } = useAuthStore()

/**
 * Submits the login form when clicking on the button
 */
function submitLoginForm() {
  if (!valid.value) return

  // construct the data object from the form fields
  let data: Record<string, string> = {}
  formFields.value.forEach((f) => (data[f.key] = f.value))

  // try to login
  handleEmailLogin(data.email, data.pass)
}
</script>

<template>
  <v-card-item prepend-icon="mdi-login-variant">
    <v-card-title tag="section">Autentificare</v-card-title>
  </v-card-item>
  <v-card-text>
    <v-form
      id="login-form"
      @submit.prevent="submitLoginForm"
      validate-on="lazy input"
      v-model:model-value="valid"
    >
      <section v-for="field in formFields" :key="field.label">
        <v-text-field
          :prepend-inner-icon="field.prependIcon"
          :label="field.label"
          :type="field.typeProp || 'text'"
          :rules="validation.getValidationRules(loginRules, field.rulesKey)"
          v-model="field.value"
          variant="solo-filled"
          color="primary"
        />
      </section>
    </v-form>
    <p class="text-body-2" @click="setAuthPage('forgot')">Ai uitat parola?</p>
  </v-card-text>
  <v-card-actions class="justify-end">
    <v-btn
      form="login-form"
      type="submit"
      append-icon="mdi-arrow-right"
      class="px-4"
      color="primary"
    >
      Intra in cont
    </v-btn>
  </v-card-actions>
</template>
