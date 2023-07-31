<script setup lang="ts">
import type { IGroup } from '@/interfaces/group'

const group = ref<IGroup>()
const { updateGroup: updateDBGroup, getGroupById } = useGroupsStore()
const formFields = ref(useFormStructure().getCreateGroupForm())

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

const memberList = ref<Array<{
  id: string
  fname: string
  lname: string
  field: string
}> | null>(null)

const showMemberList = ref<boolean>(true)

/**
 * Lists the members of the group
 */
function listMembers() {
  showAllUsers.value = false
  showMemberList.value = !showMemberList.value
}

const users = ref<Array<{
  id: string
  fname: string
  lname: string
  field: string
}> | null>(null)

const showAllUsers = ref<boolean>(false)

/**
 * Lists all users
 */
function listUsers() {
  showMemberList.value = false
  showAllUsers.value = !showAllUsers.value
}

/**
 * Removes a user from the group
 *
 * @param uid
 */
async function removeUser(uid: string) {
  const uidx = group.value?.users.indexOf(uid)

  if (uidx === undefined || uidx < 0) return

  group.value?.users.splice(uidx, 1)
  await updateDBGroup(group.value)

  // update local state
  const user = memberList.value?.find((u) => u.id === uid)

  if (user) {
    const midx = memberList.value?.indexOf(user)

    if (midx !== undefined && midx > -1) {
      memberList.value?.splice(midx, 1)
      users.value?.push(user)
    }
  }
}

/**
 * Adds a user to the group
 *
 * @param uid
 */
async function addUserToGroup(uid: string) {
  group.value?.users.push(uid)
  await updateDBGroup(group.value)

  // update local state
  const user = users.value?.find((u) => u.id === uid)

  if (user) {
    const uidx = users.value?.indexOf(user)

    if (uidx !== undefined && uidx > -1) {
      users.value?.splice(uidx, 1)
      memberList.value?.push(user)
    }
  }
}

/**
 * Initializes the memberList and users arrays
 */
async function initializeUsersLists() {
  if (!group.value) group.value = await getGroupById(router.currentRoute.value.params.id as string)
  const memberIds = group.value!.users || []

  if (!users.value) users.value = await useUsersStore().getUsersByIdList(memberIds, 'not-in')

  if (!memberList.value) {
    if (memberIds && memberIds.length > 0)
      memberList.value = await useUsersStore().getUsersByIdList(memberIds, 'in')
  }
}

/**
 * Initializes the form when component mounts
 */
onBeforeMount(async () => {
  group.value = await getGroupById(router.currentRoute.value.params.id as string)
  initializeUsersLists()
})
</script>

<template>
  <GroupForm
    :action="updateGroup"
    title="Editare grup"
    :form-fields="computedFormFields"
    :show-users="true"
    @show-all-users="listUsers"
    @show-group-members="listMembers"
  />
  <UserList
    class="mt-6"
    v-show="showMemberList || showAllUsers"
    :users="showMemberList ? memberList : users"
    :invite-card="true"
    :allow-invite="!showMemberList"
    @remove-user="removeUser"
    @add-user-to-group="addUserToGroup"
  />
</template>
