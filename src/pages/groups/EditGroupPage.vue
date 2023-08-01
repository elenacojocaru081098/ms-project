<script setup lang="ts">
import { storeToRefs } from 'pinia'

const groupsStore = useGroupsStore()
const { groupsInitialized, currentGroup } = storeToRefs(groupsStore)
const { updateGroup: updateDBGroup, fetchCurrentUserGroups, setGroupAsCurrentGroup } = groupsStore
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
  if (!groupsInitialized.value) await fetchCurrentUserGroups()
  setGroupAsCurrentGroup(router.currentRoute.value.params.id as string)
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
