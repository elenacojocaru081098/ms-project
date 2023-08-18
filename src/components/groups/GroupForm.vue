<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { IFormField } from '@/interfaces/form'
import type { IGroup } from '@/interfaces/group'

const valid = ref<boolean | null>(null)
const props = defineProps<{
  action: Function
  title: string
  formFields: Array<IFormField>
  newGroup: boolean
  group: IGroup
}>()

defineEmits(['showGroupMembers', 'showAllUsers'])

/**
 * Submits the form
 */
function submitForm() {
  if (!valid.value) return

  const groupName = props.formFields.find((f) => f.key === 'name')
  activeGroup.value.name = groupName?.value || ''

  props.action()
}

const memberList = ref<Array<{
  id: string
  fname: string
  lname: string
  field: string
}> | null>(null)

const showMemberList = ref<boolean>(!props.newGroup)

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

const showAllUsers = ref<boolean>(props.newGroup)

/**
 * Lists all users
 */
function listUsers() {
  showMemberList.value = false
  showAllUsers.value = !showAllUsers.value
}

const { getCurrentGroupMembers, getAvailableParticipants, setGroupAsCurrentGroup } =
  useGroupsStore()

/**
 * Initializes the memberList and users arrays
 */
async function initializeUsersLists() {
  if (!props.newGroup) memberList.value = await getCurrentGroupMembers()
  users.value = await getAvailableParticipants()
}

const { currentGroup } = storeToRefs(useGroupsStore())
const activeGroup = ref<IGroup>(props.newGroup ? props.group : currentGroup.value)

/**
 * Removes a user from the group
 *
 * @param uid
 */
async function removeUser(uid: string) {
  const uidx = activeGroup.value?.users.indexOf(uid)

  if (uidx === undefined || uidx < 0) return

  activeGroup.value?.users.splice(uidx, 1)

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
  activeGroup.value?.users.push(uid)

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
 * Initializes the form when component mounts
 */
onMounted(async () => {
  if (props.newGroup) setGroupAsCurrentGroup()
  initializeUsersLists()
})
</script>

<template>
  <v-card>
    <v-card-item prepend-icon="mdi-account-group">
      <v-card-title tag="section">{{ title }}</v-card-title>
    </v-card-item>
    <v-card-text>
      <v-form
        id="group-form"
        @submit.prevent="submitForm"
        validate-on="lazy input"
        v-model:model-value="valid"
      >
        <section v-for="field in formFields" :key="field.label">
          <v-text-field
            :prepend-inner-icon="field.prependIcon"
            :label="field.label"
            :type="field.typeProp || 'text'"
            v-model="field.value"
            variant="solo-filled"
            color="primary"
            hide-details
          />
        </section>
      </v-form>
      <p class="mt-4 text-subtitle-2">
        {{ memberList?.length || 0 }}
        {{ memberList?.length === 1 ? 'participant' : 'participanti' }}
      </p>
    </v-card-text>
    <v-card-actions class="justify-end">
      <v-btn
        density="comfortable"
        size="small"
        form="group-form"
        type="button"
        class="px-4"
        color="tertiary"
        @click="listUsers"
        icon
      >
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
      <v-btn
        v-if="!newGroup"
        density="comfortable"
        size="small"
        form="group-form"
        type="button"
        class="px-4"
        color="secondary"
        @click="listMembers"
        icon
      >
        <v-icon>mdi-account-group</v-icon>
      </v-btn>
      <v-btn
        density="comfortable"
        size="small"
        form="group-form"
        type="submit"
        class="px-4"
        color="primary"
        icon
      >
        <v-icon>mdi-check</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
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
