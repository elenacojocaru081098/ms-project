<script setup lang="ts">
import type { IGroup } from '@/interfaces/group'

const formFields = ref(useFormStructure().getCreateGroupForm())
const group = ref<IGroup>()
const showMemberList = ref<boolean>(false)
const memberList = ref<
  | Array<{
      id: string
      fname: string
      lname: string
      field: string
    }>
  | undefined
>([])

const { updateGroup: updateDBGroup, getGroupById, fetchGroupMembers } = useGroupsStore()

const computedFormFields = computed(() => {
  formFields.value.forEach((f) => f.key === 'name' && (f.value = group.value?.name || null))
  return formFields.value
})

/**
 * Updates the group on submit
 */
async function updateGroup() {
  // construct the data object from the form fields
  let data: Record<string, string> = {}
  formFields.value.forEach((f) => (data[f.key] = f.value))
  data.id = group.value!.id

  // try to update user
  await updateDBGroup(data)
}

/**
 * Initializes the form when component mounts
 */
onBeforeMount(async () => {
  group.value = await getGroupById(router.currentRoute.value.params.id as string)
  const memberIds = await fetchGroupMembers(group.value!.id)
  if (memberIds && memberIds.length > 0)
    memberList.value = await useUsersStore().getUsersByIdList(memberIds)
})

/**
 * Lists the members of the group
 */
function listMembers() {
  showMemberList.value = !showMemberList.value
}

/**
 * Removes a user from the group
 *
 * @param uid
 */
function removeUser(uid: string) {
  const uidx = group.value?.users.indexOf(uid)

  if (uidx !== undefined && uidx > -1) {
    group.value?.users.splice(uidx, 1)
    updateDBGroup(group.value)
  }
}
</script>

<template>
  <GroupForm
    :action="updateGroup"
    title="Editare grup"
    btn="Salveaza"
    :form-fields="computedFormFields"
    :show-users="true"
    @show-group-members="listMembers"
  />
  <UserInviteCard v-if="showMemberList" :users="memberList" @remove-user="removeUser" />
</template>
