<script setup lang="ts">
import type { IUser } from '@/interfaces/user'
import { CONSTANTS } from '@/constants'
import type { IBusToast } from '@/interfaces/bus_events'
import { storeToRefs } from 'pinia'

const props = defineProps<{
  users: Array<IUser>
}>()

const { user } = storeToRefs(useUserStore())

const emit = defineEmits(['changedUserRole'])
const { getFullNameRole } = useUsers()

/**
 * Deletes a user
 *
 * @param uid
 */
function deleteUser(uid: string) {
  useUsersStore().softDeleteUserById(uid)
}

/**
 * Triggers a dialog box based on the pressed button
 *
 * @param { string } act The action that triggers the dialog box
 * @param { IUser } u
 */
function promptAction(act: string, u?: IUser) {
  const { triggerDialog, hideDialog } = useDialogStore()

  switch (act) {
    case CONSTANTS.PROMPT_DELETE:
      triggerDialog(
        `Vreti sa stergeti utilizatorul ${u?.personal_info.email}?`,
        [hideDialog, deleteUser],
        [
          {
            text: 'Nu',
            color: 'error-container'
          },
          {
            text: 'Da',
            color: 'secondary',
            actionParams: [u?.id]
          }
        ]
      )
      break
    default:
      break
  }
}

/**
 * Gets the user's role
 *
 * @param { string } uid
 */
function getUserRole(uid: string) {
  return props.users.find((u) => u.id === uid)!.role
}

const { changeUserRole } = useUsersStore()
const busToast = useEventBus<IBusToast>(BUS_EVENTS.NOTIFICATION)

/**
 * Promotes the user one level
 *
 * @param { string } uid Id of the user to promote
 */
async function promoteUser(uid: string) {
  const currentUserRole = user.value?.role
  const currentRole = getUserRole(uid)
  let newRole

  if (currentUserRole === 'Participant' || currentRole === 'Admin') newRole = null
  else {
    newRole =
      currentRole === 'Participant'
        ? 'Coordinator'
        : currentRole === 'Coordinator' && currentUserRole === 'Admin'
        ? 'Admin'
        : null
  }

  if (newRole) {
    const result = await changeUserRole(uid, newRole as typeof currentRole)

    if (result) {
      busToast.emit({
        text: NOTIFICATION_MESSAGES.USER_PROMOTED_SUCCEEDED,
        color: CUSTOM_LIGHT_COLORS['secondary-container']
      })

      emit('changedUserRole')
    } else
      busToast.emit({
        text: NOTIFICATION_MESSAGES.USER_PROMOTED_FAILED,
        color: CUSTOM_LIGHT_COLORS['error-container']
      })
  } else
    busToast.emit({
      text: NOTIFICATION_MESSAGES.USER_PROMOTED_FAILED,
      color: CUSTOM_LIGHT_COLORS['error-container']
    })
}

/**
 * Demotes the user one level
 *
 * @param { string } uid Id of the user to demote
 */
async function demoteUser(uid: string) {
  const currentUserRole = user.value?.role
  const currentRole = getUserRole(uid)
  let newRole

  if (currentUserRole === 'Participant' || currentRole === 'Participant') newRole = null
  else {
    newRole =
      currentRole === 'Coordinator'
        ? 'Participant'
        : currentRole === 'Admin' && currentUserRole === 'Admin'
        ? 'Coordinator'
        : null
  }

  if (newRole) {
    const result = await changeUserRole(uid, newRole as typeof currentRole)

    if (result) {
      busToast.emit({
        text: NOTIFICATION_MESSAGES.USER_DEMOTED_SUCCEEDED,
        color: CUSTOM_LIGHT_COLORS['secondary-container']
      })

      emit('changedUserRole')
    } else
      busToast.emit({
        text: NOTIFICATION_MESSAGES.USER_DEMOTED_FAILED,
        color: CUSTOM_LIGHT_COLORS['error-container']
      })
  } else
    busToast.emit({
      text: NOTIFICATION_MESSAGES.USER_DEMOTED_FAILED,
      color: CUSTOM_LIGHT_COLORS['error-container']
    })
}

/**
 * Redirects to edit user page
 *
 * @param { string } uid Id of the user to edit
 */
function goToEdit(uid: string) {
  router.push({ path: `/users/${uid}` })
}

function getStatusColor(status: string) {
  switch (status) {
    case 'Active':
      return 'secondary'
    case 'Pending':
      return 'primary'
    case 'Deleted':
      return 'error'
    default:
      return 'surface'
  }
}
</script>

<template>
  <v-card density="compact" v-for="user in users" :key="user.id" class="my-2">
    <v-card-item prepend-icon="mdi-account" density="compact">
      <v-card-title tag="section">
        <span>{{ getFullNameRole(user as IUser) }}</span>
        <v-chip class="float-right" :color="getStatusColor(user.status)">{{ user.status }}</v-chip>
      </v-card-title>
      <v-card-subtitle>{{ user.personal_info.email }}</v-card-subtitle>
    </v-card-item>
    <v-divider />
    <v-card-actions class="justify-space-evenly">
      <v-btn density="compact" color="secondary" icon @click="promoteUser(user.id)"
        ><v-icon>mdi-account-arrow-up</v-icon></v-btn
      >
      <v-btn density="compact" color="tertiary" icon @click="demoteUser(user.id)"
        ><v-icon>mdi-account-arrow-down</v-icon></v-btn
      >
      <v-divider vertical />
      <v-btn density="compact" color="primary" @click="goToEdit(user.id)" icon>
        <v-icon>mdi-account-edit</v-icon>
      </v-btn>
      <v-btn
        density="compact"
        color="error"
        @click="promptAction(CONSTANTS.PROMPT_DELETE, user)"
        icon
      >
        <v-icon>mdi-trash-can</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
