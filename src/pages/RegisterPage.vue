<script setup lang="ts">
const formFields = ref(useFormStructure().getRegisterForm())

/**
 * Submits the register form after clicking on the button
 */
async function submitRegisterForm(valid: boolean) {
  if (!valid) return

  const { handleEmailRegister } = useAuthStore()

  // construct the data object from the form fields
  let data: Record<string, string> = {}
  formFields.value.forEach((f) => (data[f.key] = f.value))
  data.gender = extractGenderFromPNC(data.pnc)
  data.birthdate = extractBirthdateFromPNC(data.pnc)
  data.email = data.email.toLowerCase()

  // try to register a new account
  const success = await handleEmailRegister(data)

  if (success) formFields.value.forEach((f) => (f.value = f.type === 'select' ? null : ''))
}
</script>

<template>
  <UserForm form-title="Creare cont" :form-fields="formFields" @submit-user="submitRegisterForm" />
</template>
