<script setup lang="ts">
import { CONSTANTS } from '@/constants'
import type { IGroup } from '@/interfaces/group'
import type { IUser } from '@/interfaces/user'
import { storeToRefs } from 'pinia'

const props = defineProps<{
  group: IGroup
}>()

const groupsStore = useGroupsStore()
const { deleteGroupById, updateGroupCoordinators } = groupsStore

/**
 * Deletes a group
 *
 * @param { string } gid
 */
function deleteGroup(gid: string) {
  deleteGroupById(gid)
}

/**
 * Triggers a dialog box based on the pressed button
 *
 * @param { string } act The action that triggers the dialog box
 */
function promptAction(act: string) {
  const { triggerDialog, hideDialog } = useDialogStore()

  switch (act) {
    case CONSTANTS.PROMPT_DELETE:
      triggerDialog(
        `Vreti sa stergeti grupul ${props.group.name}?`,
        [hideDialog, deleteGroup],
        [
          {
            text: 'Nu',
            color: 'error-container'
          },
          {
            text: 'Da',
            color: 'secondary',
            actionParams: [props.group.id]
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
 */
function goToEdit() {
  router.push({ path: `/groups/${props.group.id}` })
}

const showCoordsList = ref<boolean>(false)
const groupCoords = ref<Array<string>>(props.group.coords)

/**
 * Loads current coordinators
 */
async function showCoordinators() {
  showCoordsList.value = !showCoordsList.value
}

/**
 * Updates the coordinators' list
 */
function updateCoordsList() {
  if (groupCoords.value.length < 1) return

  updateGroupCoordinators(props.group.id, groupCoords.value)
}

const coords = ref<Array<IUser>>([])

/**
 * Loads all the coordinators
 */
onBeforeMount(async () => {
  coords.value = await useUsersStore().getCoordinators()
})

const { hasCoordinatorRights, isParticipant } = useUserPermission()
const { user } = storeToRefs(useUserStore())
</script>

<template>
  <v-card class="my-2">
    <v-card-item prepend-icon="mdi-account-group">
      <v-card-title tag="section" class="d-flex align-center justify-space-between">
        <span>{{ group.name }}</span>
        <section class="group-controls" v-if="hasCoordinatorRights(user)">
          <v-btn
            density="comfortable"
            size="small"
            color="tertiary"
            class="mr-2"
            @click="showCoordinators"
            icon
          >
            <v-icon>mdi-transit-transfer</v-icon>
          </v-btn>
          <v-btn
            density="comfortable"
            size="small"
            color="primary"
            class="mr-2"
            @click="goToEdit"
            icon
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn
            density="comfortable"
            size="small"
            color="error"
            @click="promptAction(CONSTANTS.PROMPT_DELETE)"
            icon
          >
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
        </section>
      </v-card-title>
      <v-card-subtitle class="text-subtitle-2">
        <GroupCardInfo />
      </v-card-subtitle>
      <v-card-text v-if="showCoordsList">
        <v-autocomplete
          label="Coordonatori"
          v-model="groupCoords"
          :items="coords"
          item-title="personal_info.email"
          item-value="id"
          variant="solo-filled"
          chips
          closable-chips
          multiple
          @update:model-value="updateCoordsList()"
        />
      </v-card-text>
      <v-card-text v-if="isParticipant(user)" class="pa-2">
        <GroupCardStudies :studiesIds="group.studies" />
      </v-card-text>
    </v-card-item>
  </v-card>
</template>
