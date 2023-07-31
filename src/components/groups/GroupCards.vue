<script setup lang="ts">
import type { IGroup } from '@/interfaces/group'
import { CONSTANTS } from '@/constants'
import type { IUser } from '@/interfaces/user'

const props = defineProps<{
  groupList: Array<IGroup>
}>()

const { deleteGroupById, updateGroupCoordinators } = useGroupsStore()

/**
 * Deletes a group
 *
 * @param gid
 */
function deleteGroup(gid: string) {
  deleteGroupById(gid)
}

/**
 * Triggers a dialog box based on the pressed button
 *
 * @param { string } act The action that triggers the dialog box
 * @param { IUser } u
 */
function promptAction(act: string, g?: IGroup) {
  const { triggerDialog, hideDialog } = useDialogStore()

  switch (act) {
    case CONSTANTS.PROMPT_DELETE:
      triggerDialog(
        `Vreti sa stergeti grupul ${g?.name}?`,
        [hideDialog, deleteGroup],
        [
          {
            text: 'Nu',
            color: 'error-container'
          },
          {
            text: 'Da',
            color: 'secondary',
            actionParams: [g?.id]
          }
        ]
      )
      break
    default:
      break
  }
}

/**
 * Redirects to edit group page
 *
 * @param { string } gid Id of the group to edit
 */
function goToEdit(gid: string) {
  router.push({ path: `/groups/${gid}` })
}

const showCoordsList = ref<boolean>(false)
const groupCoords = ref<Array<string>>([])

/**
 * Loads current coordinators
 */
async function loadCoordinators(group: IGroup) {
  showCoordsList.value = !showCoordsList.value
  groupCoords.value.length = 0
  groupCoords.value!.push(...group.coords)
}

/**
 * Updates the coordinators' list
 *
 * @param { IGroup } group
 */
function updateCoordsList(group: IGroup) {
  if (groupCoords.value.length < 1) return

  group.coords.length = 0
  group.coords.push(...groupCoords.value)
  updateGroupCoordinators(group.id, group.coords)
}

const coords = ref<Array<IUser>>([])

/**
 * Loads all the coordinators
 */
onBeforeMount(async () => {
  coords.value = await useUsersStore().getCoordinators()
})
</script>

<template>
  <v-card density="compact" v-for="group in props.groupList" :key="group.id" class="my-2">
    <v-card-item prepend-icon="mdi-account-group" density="compact">
      <v-card-title tag="section" class="d-flex align-center justify-space-between">
        <span>{{ group.name }}</span>
        <section class="group-controls">
          <v-btn
            density="comfortable"
            size="small"
            color="tertiary"
            class="mr-2"
            @click="loadCoordinators(group)"
            icon
          >
            <v-icon>mdi-transit-transfer</v-icon>
          </v-btn>
          <v-btn
            density="comfortable"
            size="small"
            color="primary"
            class="mr-2"
            @click="goToEdit(group.id)"
            icon
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn
            density="comfortable"
            size="small"
            color="error"
            @click="promptAction(CONSTANTS.PROMPT_DELETE, group)"
            icon
          >
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
        </section>
      </v-card-title>
      <v-card-subtitle>
        {{ group.users.length }} {{ group.users.length === 1 ? 'participant' : 'participanti' }}
      </v-card-subtitle>
      <v-card-text v-if="showCoordsList">
        <v-autocomplete
          label="Coordonatori"
          v-model="groupCoords"
          :items="coords"
          item-title="personal_info.email"
          item-value="id"
          variant="solo-filled"
          density="compact"
          chips
          closable-chips
          multiple
          @update:model-value="updateCoordsList(group)"
        ></v-autocomplete>
      </v-card-text>
    </v-card-item>
  </v-card>
</template>
