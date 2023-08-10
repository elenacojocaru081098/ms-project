<script setup lang="ts">
import { storeToRefs } from 'pinia'

const groupsStore = useGroupsStore()
const { currentGroup } = storeToRefs(groupsStore)
const { updateGroup: updateDBGroup } = groupsStore
const formFields = ref(useFormStructure().getCreateGroupForm())

const computedFormFields = computed(() => {
  formFields.value.forEach((f) => f.key === 'name' && (f.value = currentGroup.value?.name || null))
  return formFields.value
})

/**
 * Updates the group on submit
 */
function updateGroup() {
  updateDBGroup(currentGroup.value)
}
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
