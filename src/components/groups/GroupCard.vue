<script setup lang="ts">
import { CONSTANTS } from '@/constants'
import type { IUser } from '@/interfaces/user'
import { storeToRefs } from 'pinia'

const props = defineProps<{
  groupId: string
}>()

const groupsStore = useGroupsStore()
const { currentGroup } = storeToRefs(groupsStore)
const { deleteGroupById, updateGroupCoordinators, setGroupAsCurrentGroup } = groupsStore

/**
 * Deletes a group
 */
function deleteGroup() {
  deleteGroupById(currentGroup.value.id)
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
        `Vreti sa stergeti grupul ${currentGroup.value.name}?`,
        [hideDialog, deleteGroup],
        [
          {
            text: 'Nu',
            color: 'error-container'
          },
          {
            text: 'Da',
            color: 'secondary',
            actionParams: [currentGroup.value.id]
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
  router.push({ path: `/groups/${currentGroup.value.id}` })
}

const showCoordsList = ref<boolean>(false)
const groupCoords = ref<Array<string>>(currentGroup.value.coords)

/**
 * Loads current coordinators
 */
async function loadCoordinators() {
  showCoordsList.value = !showCoordsList.value
  groupCoords.value.length = 0
  groupCoords.value!.push(...currentGroup.value.coords)
}

/**
 * Updates the coordinators' list
 *
 * @param { IGroup } group
 */
function updateCoordsList() {
  if (groupCoords.value.length < 1) return

  currentGroup.value.coords.length = 0
  currentGroup.value.coords.push(...groupCoords.value)
  updateGroupCoordinators(currentGroup.value.id, currentGroup.value.coords)
}

const coords = ref<Array<IUser>>([])

/**
 * Loads all the coordinators
 */
onBeforeMount(async () => {
  coords.value = await useUsersStore().getCoordinators()
  setGroupAsCurrentGroup(props.groupId)
})

const { hasCoordinatorRights } = useUserPermission()
const { user } = storeToRefs(useUserStore())
</script>

<template>
  <v-card class="my-2">
    <v-card-item prepend-icon="mdi-account-group">
      <v-card-title tag="section" class="d-flex align-center justify-space-between">
        <span>{{ currentGroup.name }}</span>
        <section class="group-controls" v-if="hasCoordinatorRights(user)">
          <v-btn
            density="comfortable"
            size="small"
            color="tertiary"
            class="mr-2"
            @click="loadCoordinators"
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
        {{
          `${currentGroup.users.length} ${
            currentGroup.users.length === 1 ? 'participant' : 'participanti'
          }`
        }}
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
    </v-card-item>
  </v-card>
</template>
