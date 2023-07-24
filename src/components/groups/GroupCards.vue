<script setup lang="ts">
import type { IGroup } from '@/interfaces/group'
import { CONSTANTS } from '@/constants'

const props = defineProps<{
  groupList: Array<IGroup>
}>()

/**
 * Deletes a group
 *
 * @param gid
 */
function deleteGroup(gid: string) {
  useGroupsStore().deleteGroupById(gid)
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
</script>

<template>
  <v-card density="compact" v-for="group in groupList" :key="group.id" class="my-2">
    <v-card-item prepend-icon="mdi-account-group" density="compact">
      <v-card-title tag="section" class="d-flex align-center justify-space-between">
        <span>{{ group.name }}</span>
        <v-btn
          density="comfortable"
          size="small"
          color="error"
          @click="promptAction(CONSTANTS.PROMPT_DELETE, group)"
          icon
        >
          <v-icon>mdi-trash-can</v-icon>
        </v-btn>
      </v-card-title>
    </v-card-item>
  </v-card>
</template>
