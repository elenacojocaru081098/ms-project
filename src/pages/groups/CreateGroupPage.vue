<script setup lang="ts">
const formFields = ref(useFormStructure().getCreateGroupForm())
const { createGroup } = useGroupsStore()

function createNewGroup(data: any) {
  createGroup(data.name)
}
</script>

<template>
  <GroupForm
    :action="createNewGroup"
    title="Creare grup"
    btn="Creeaza grup"
    :form-fields="formFields"
    :show-users="false"
  />
</template>
