<script setup lang="ts">
import { storeToRefs } from 'pinia'

const { groups, currentGroupIndex, currentGroup } = storeToRefs(useGroupsStore())
const { updateGroup: updateDBGroup, fetchCurrentUserGroups } = useGroupsStore()
const formFields = ref(useFormStructure().getCreateGroupForm())

const computedFormFields = computed(() => {
  formFields.value.forEach((f) => f.key === 'name' && (f.value = currentGroup.value?.name || null))
  return formFields.value
})

/**
 * Updates the group on submit
 */
async function updateGroup() {
  await updateDBGroup(currentGroup.value)
}

onBeforeMount(async () => {
  if (!groups.value.length) await fetchCurrentUserGroups()

  currentGroupIndex.value = groups.value.findIndex(
    (g) => g.id === router.currentRoute.value.params.id
  )
})
</script>

<template>
  <GroupForm
    v-if="currentGroup"
    :action="updateGroup"
    title="Editare grup"
    :form-fields="computedFormFields"
    :new-group="false"
    :group="currentGroup"
  />
</template>
