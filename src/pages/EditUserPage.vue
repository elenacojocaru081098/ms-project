<script setup lang="ts">
import type { IUser, IPersonalInfo } from '@/interfaces/user'

const formFields = ref(useFormStructure().getRegisterForm())
const user = ref<IUser>()

const computedFormFields = computed(() => {
  formFields.value.forEach((f) => {
    if (f.key === 'role') f.value = user.value?.role || null
    else f.value = user.value?.personal_info[f.key as keyof IPersonalInfo] || null
  })

  return formFields.value
})

/**
 * Updates the user on submit
 */
async function updateUser(valid: boolean) {
  if (!valid) return

  const { updateUser } = useUsersStore()

  // construct the data object from the form fields
  let data: Record<string, string> = {}
  formFields.value.forEach((f) => (data[f.key] = f.value))
  data.email = data.email.toLowerCase()
  data.id = user.value!.id

  // try to update user
  await updateUser(data)
}

/**
 * Initializes the form when component mounts
 */
onBeforeMount(async () => {
  const { getUserById } = useUsersStore()
  user.value = await getUserById(router.currentRoute.value.params.id as string)
})
</script>

<template>
  <UserForm
    form-title="Editare utilizator"
    :form-fields="computedFormFields"
    @submit-user="updateUser"
  />
</template>
