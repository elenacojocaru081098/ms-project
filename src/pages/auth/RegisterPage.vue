<script setup lang="ts">
import { storeToRefs } from 'pinia'

const formFields = useFormStructure().getRegisterForm()
const { user } = storeToRefs(useUserStore())

/**
 * Filters through the available roles for new users
 */
formFields.forEach((f) => {
  if (!f.items || f.key !== 'role') return

  f.items = f.items.filter((i) => {
    if (user.value?.role === 'Admin') return true
    if (user.value?.role === 'Coordinator' && i === 'Participant') return true
    return false
  })
})

/**
 * Submits the register form after clicking on the button
 */
async function submitRegisterForm(valid: boolean) {
  if (!valid) return

  const { handleEmailRegister } = useAuthStore()

  // construct the data object from the form fields
  let data: Record<string, string> = {}
  formFields.forEach((f) => (data[f.key] = f.value))
  data.gender = extractGenderFromPNC(data.pnc)
  data.birthdate = extractBirthdateFromPNC(data.pnc)
  data.email = data.email.toLowerCase()

  // try to register a new account
  const success = await handleEmailRegister(data)

  if (success) formFields.forEach((f) => (f.value = f.type === 'select' ? null : ''))
}
</script>

<template>
  <NavigationBar />
  <UserForm form-title="Creare cont" :form-fields="formFields" @submit-user="submitRegisterForm" />
</template>
