<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { IGroup } from '@/interfaces/group'

const formFields = ref(useFormStructure().getCreateGroupForm())

const { user } = storeToRefs(useUserStore())
const { createGroup } = useGroupsStore()

const group = ref<IGroup>()

/**
 * Creates a new group
 */
function createNewGroup() {
  createGroup(group.value!)
}

onBeforeMount(() => {
  group.value = {
    id: '',
    name: '',
    users: [],
    coords: user.value ? [user.value.id] : [],
    studies: []
  }
})
</script>

<template>
  <GroupForm
    :action="createNewGroup"
    title="Creare grup"
    :form-fields="formFields"
    :new-group="true"
    :group="group!"
  />
</template>
