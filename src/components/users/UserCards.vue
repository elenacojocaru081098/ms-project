<script setup lang="ts">
import type { IUser } from '@/interfaces/user'
import { CONSTANTS } from '@/constants'
import { computed, ref } from 'vue'

const { getLowerRoleUsers, getFullNameRole } = useUsers()

const users = ref<Array<IUser>>()

const props = defineProps<{
  searchTerm: string
}>()

const { searchTerm } = toRefs(props)
const { getFullName } = useUsers()

const filteredUsers = computed(() => {
  const search = searchTerm.value.toLowerCase()

  const filtered = users.value?.filter((u) => {
    return (
      u.personal_info.email.includes(search) ||
      u.personal_info.pnc.includes(search) ||
      getFullName(u).toLowerCase().includes(search)
    )
  })

  return filtered
})

function deleteUser(uid: string) {
  // TODO: implement delete
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

function goToEdit(uid: string) {
  router.push({ path: `/users/${uid}` })
}

onMounted(async () => {
  users.value = await getLowerRoleUsers()
})
</script>

<template>
  <v-card density="compact" v-for="user in filteredUsers" :key="user.id">
    <v-card-item prepend-icon="mdi-account" density="compact">
      <v-card-title tag="section">{{ getFullNameRole(user as IUser) }}</v-card-title>
      <v-card-subtitle>{{ user.personal_info.email }}</v-card-subtitle>
    </v-card-item>
    <v-divider />
    <v-card-actions class="justify-space-evenly">
      <v-btn density="compact" color="secondary" icon><v-icon>mdi-account-arrow-up</v-icon></v-btn>
      <v-btn density="compact" color="tertiary" icon><v-icon>mdi-account-arrow-down</v-icon></v-btn>
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
